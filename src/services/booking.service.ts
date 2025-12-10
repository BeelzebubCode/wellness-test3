// ==========================================
// 📌 Booking Service
// ==========================================

import prisma from '@/lib/prisma';
import { sendBookingConfirmation, sendAssignmentNotification, sendCancellationNotification } from '@/lib/line';
import { startOfDay, endOfDay } from '@/lib/date';
import type { CreateBookingDTO, UpdateBookingDTO, BookingFilters, Booking } from '@/types';

export const bookingService = {
  // ----- GET: List Bookings with Filters -----
  async getBookings(filters: BookingFilters = {}): Promise<Booking[]> {
    const where: Record<string, unknown> = {};

    // Date filter
    if (filters.date) {
      const date = new Date(filters.date);
      where.date = {
        gte: startOfDay(date),
        lte: endOfDay(date),
      };
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      where.date = {
        gte: startOfDay(new Date(filters.startDate)),
        lte: endOfDay(new Date(filters.endDate)),
      };
    }

    // LINE user filter (need to find user first)
    if (filters.lineUserId) {
      const user = await prisma.user.findUnique({
        where: { lineId: filters.lineUserId },
      });
      if (!user) return [];
      where.userId = user.id;
    }

    // Consultant filter
    if (filters.consultantId) {
      where.consultantId = filters.consultantId;
    }

    // Status filter
    if (filters.status) {
      where.status = filters.status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: true,
        consultant: true,
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    return bookings.map(this.formatBooking);
  },

  // ----- GET: Single Booking -----
  async getBookingById(id: string): Promise<Booking | null> {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        consultant: true,
      },
    });

    return booking ? this.formatBooking(booking) : null;
  },

  // ----- POST: Create Booking -----
  async createBooking(data: CreateBookingDTO): Promise<Booking> {
    // 1. Find or create user
    let user = await prisma.user.findUnique({
      where: { lineId: data.lineUserId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          lineId: data.lineUserId,
          name: data.userName || 'ผู้ใช้ใหม่',
        },
      });
    }

    // 2. Check for existing active booking
    const activeBooking = await prisma.booking.findFirst({
      where: {
        userId: user.id,
        status: { in: ['CONFIRMED', 'ASSIGNED'] },
      },
    });

    if (activeBooking) {
      throw new Error('คุณมีรายการจองที่รอดำเนินการอยู่แล้ว กรุณายกเลิกรายการเดิมก่อน');
    }

    // 3. Check slot availability
    const bookingDate = new Date(data.date);
    const existingBookingsCount = await prisma.booking.count({
      where: {
        date: {
          gte: startOfDay(bookingDate),
          lte: endOfDay(bookingDate),
        },
        startTime: data.startTime,
        endTime: data.endTime,
        status: { not: 'CANCELLED' },
      },
    });

    // Get slot config (check override first, then default)
    const slotOverride = await prisma.slotOverride.findFirst({
      where: {
        date: {
          gte: startOfDay(bookingDate),
          lte: endOfDay(bookingDate),
        },
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });

    const maxBookings = slotOverride?.maxBookings || 1;

    if (existingBookingsCount >= maxBookings) {
      throw new Error('ช่วงเวลานี้เต็มแล้ว กรุณาเลือกช่วงเวลาอื่น');
    }

    // 4. Check if day is closed
    const dayOverride = await prisma.dayOverride.findFirst({
      where: {
        date: {
          gte: startOfDay(bookingDate),
          lte: endOfDay(bookingDate),
        },
        isClosed: true,
      },
    });

    if (dayOverride) {
      throw new Error('วันที่เลือกปิดให้บริการ กรุณาเลือกวันอื่น');
    }

    // 5. Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        date: bookingDate,
        startTime: data.startTime,
        endTime: data.endTime,
        problemType: data.problemType,
        problemDescription: data.problemDescription,
        status: 'CONFIRMED',
      },
      include: {
        user: true,
        consultant: true,
      },
    });

    // 6. Send LINE notification (async, don't wait)
    sendBookingConfirmation(user.lineId, {
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      problemType: data.problemType,
    }).catch(console.error);

    return this.formatBooking(booking);
  },

  // ----- PUT: Update Booking Status -----
  async updateBooking(id: string, data: UpdateBookingDTO): Promise<Booking> {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!booking) {
      throw new Error('ไม่พบรายการจอง');
    }

    let updateData: Record<string, unknown> = {};

    switch (data.action) {
      case 'assign':
        if (!data.consultantId) {
          throw new Error('กรุณาเลือกผู้ให้คำปรึกษา');
        }
        updateData = {
          status: 'ASSIGNED',
          consultantId: data.consultantId,
        };

        // Get consultant name and notify user
        const consultant = await prisma.consultant.findUnique({
          where: { id: data.consultantId },
        });
        if (consultant && booking.user) {
          sendAssignmentNotification(booking.user.lineId, consultant.name).catch(console.error);
        }
        break;

      case 'complete':
        updateData = {
          status: 'COMPLETED',
          consultantNote: data.consultantNote,
          completedAt: new Date(),
        };
        break;

      case 'cancel':
        updateData = {
          status: 'CANCELLED',
          cancelReason: data.cancelReason,
        };

        // Notify user about cancellation
        if (booking.user) {
          sendCancellationNotification(booking.user.lineId, data.cancelReason).catch(console.error);
        }
        break;

      default:
        throw new Error('Invalid action');
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        consultant: true,
      },
    });

    return this.formatBooking(updated);
  },

  // ----- DELETE: Cancel Booking -----
  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    return this.updateBooking(id, { action: 'cancel', cancelReason: reason });
  },

  // ----- GET: User's Active Booking -----
  async getUserActiveBooking(lineUserId: string): Promise<Booking | null> {
    const user = await prisma.user.findUnique({
      where: { lineId: lineUserId },
    });

    if (!user) return null;

    const booking = await prisma.booking.findFirst({
      where: {
        userId: user.id,
        status: { in: ['CONFIRMED', 'ASSIGNED'] },
      },
      include: {
        user: true,
        consultant: true,
      },
    });

    return booking ? this.formatBooking(booking) : null;
  },

  // ----- Helper: Format Booking Response -----
  formatBooking(booking: any): Booking {
    return {
      id: booking.id,
      date: booking.date.toISOString().split('T')[0],
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      problemType: booking.problemType,
      problemDescription: booking.problemDescription,
      consultantNote: booking.consultantNote,
      cancelReason: booking.cancelReason,
      completedAt: booking.completedAt?.toISOString() ?? null,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),

      userId: booking.userId ?? null,
      consultantId: booking.consultantId ?? null,

      lineUserId: booking.lineUserId ?? booking.user?.lineId ?? null,
      userName: booking.user?.name ?? null,

      user: booking.user
        ? {
          id: booking.user.id,
          lineId: booking.user.lineId,
          name: booking.user.name,
          pictureUrl: booking.user.pictureUrl,
          studentId: booking.user.studentId,
          faculty: booking.user.faculty,
          phone: booking.user.phone,
          email: booking.user.email,
          isActive: booking.user.isActive,
          createdAt: booking.user.createdAt.toISOString(),
          updatedAt: booking.user.updatedAt.toISOString(),
        }
        : undefined,
      consultant: booking.consultant
        ? {
          id: booking.consultant.id,
          name: booking.consultant.name,
          email: booking.consultant.email,
          phone: booking.consultant.phone,
          avatar: booking.consultant.avatar,
          specialty: booking.consultant.specialty,
          isActive: booking.consultant.isActive,
          createdAt: booking.consultant.createdAt.toISOString(),
          updatedAt: booking.consultant.updatedAt.toISOString(),
        }
        : undefined,
    };
  }
};

export default bookingService;
