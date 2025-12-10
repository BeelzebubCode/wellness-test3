// ==========================================
// 📌 Schedule Service
// ==========================================

import prisma from '@/lib/prisma';
import { toISODateString, startOfDay, endOfDay, timeToMinutes, minutesToTime, isWeekend } from '@/lib/date';
import { DEFAULT_WORKING_HOURS } from '@/lib/constants';
import type { TimeSlot, WorkingHours, DayOverride, SlotOverride, UpdateScheduleDTO } from '@/types';

export const scheduleService = {
  // ----- GET: Time Slots for a Date -----
  async getTimeSlotsForDate(date: Date): Promise<TimeSlot[]> {
    const dateStr = toISODateString(date);
    const dayOfWeek = date.getDay();

    // 1. Check if day is closed
    const dayOverride = await this.getDayOverride(date);
    if (dayOverride?.isClosed) {
      return []; // Return empty if closed
    }

    // 2. Get working hours for this day
    const workingHours = await this.getWorkingHoursForDay(dayOfWeek);

    // Determine open/close times (override takes precedence)
    const openTime = dayOverride?.openTime || workingHours?.openTime ||
      (isWeekend(date) ? DEFAULT_WORKING_HOURS.weekend.openTime : DEFAULT_WORKING_HOURS.weekday.openTime);
    const closeTime = dayOverride?.closeTime || workingHours?.closeTime ||
      (isWeekend(date) ? DEFAULT_WORKING_HOURS.weekend.closeTime : DEFAULT_WORKING_HOURS.weekday.closeTime);
    const slotDuration = workingHours?.slotDuration || DEFAULT_WORKING_HOURS.slotDuration;
    const defaultMaxBookings = dayOverride?.maxBookings || workingHours?.maxBookings || DEFAULT_WORKING_HOURS.maxBookings;

    // 3. Get slot overrides for this date
    const slotOverrides = await this.getSlotOverrides(date);

    // 4. Get existing bookings for this date
    const bookingCounts = await this.getBookingCountsBySlot(date);

    // 5. Generate time slots
    const slots: TimeSlot[] = [];
    let currentTime = timeToMinutes(openTime);
    const endTime = timeToMinutes(closeTime);

    while (currentTime + slotDuration <= endTime) {
      const slotStart = minutesToTime(currentTime);
      const slotEnd = minutesToTime(currentTime + slotDuration);

      // Check for slot-specific override
      const override = slotOverrides.find(
        o => o.startTime === slotStart && o.endTime === slotEnd
      );

      // Skip if slot is explicitly unavailable
      if (override && !override.isAvailable) {
        currentTime += slotDuration;
        continue;
      }

      const maxBookings = override?.maxBookings || defaultMaxBookings;
      const bookedCount = bookingCounts[`${slotStart}-${slotEnd}`] || 0;
      const availableCount = Math.max(0, maxBookings - bookedCount);

      slots.push({
        // ใช้ id แบบสมมติจากวันที่ + เวลา เพื่อให้ TypeScript พอใจ
        id: `${dateStr}-${slotStart}-${slotEnd}`,
        date: dateStr,
        startTime: slotStart,
        endTime: slotEnd,
        maxBookings,
        bookedCount,
        availableCount,
        isAvailable: availableCount > 0,
        isOverridden: !override,
      });


      currentTime += slotDuration;
    }

    // 6. Add any custom slots from overrides that don't match regular pattern
    for (const override of slotOverrides) {
      const exists = slots.some(
        s => s.startTime === override.startTime && s.endTime === override.endTime
      );

      if (!exists && override.isAvailable) {
        const bookedCount = bookingCounts[`${override.startTime}-${override.endTime}`] || 0;
        const maxBookings = override.maxBookings || defaultMaxBookings;

        slots.push({
          id: `${dateStr}-${override.startTime}-${override.endTime}`,
          date: dateStr,
          startTime: override.startTime,
          endTime: override.endTime,
          maxBookings,
          bookedCount,
          availableCount: Math.max(0, maxBookings - bookedCount),
          isAvailable: bookedCount < maxBookings,
          isOverridden: true,
        });
      }
    }

    // Sort by start time
    return slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  },

  // ----- GET: Working Hours for Day of Week -----
  async getWorkingHoursForDay(dayOfWeek: number): Promise<WorkingHours | null> {
    const workingHours = await prisma.workingHours.findUnique({
      where: { dayOfWeek },
    });
    return workingHours ? this.formatWorkingHours(workingHours) : null;
  },

  // ----- GET: All Working Hours -----
  async getAllWorkingHours(): Promise<WorkingHours[]> {
    const hours = await prisma.workingHours.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });
    return hours.map(this.formatWorkingHours);
  },

  // ----- GET: Day Override -----
  async getDayOverride(date: Date): Promise<DayOverride | null> {
    const override = await prisma.dayOverride.findFirst({
      where: {
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
    });
    return override ? this.formatDayOverride(override) : null;
  },

  // ----- GET: Day Overrides for Range -----
  async getDayOverridesForRange(startDate: Date, endDate: Date): Promise<DayOverride[]> {
    const overrides = await prisma.dayOverride.findMany({
      where: {
        date: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      orderBy: { date: 'asc' },
    });
    return overrides.map(this.formatDayOverride);
  },

  // ----- GET: Slot Overrides for Date -----
  async getSlotOverrides(date: Date): Promise<SlotOverride[]> {
    const overrides = await prisma.slotOverride.findMany({
      where: {
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
      orderBy: { startTime: 'asc' },
    });
    return overrides.map(this.formatSlotOverride);
  },

  // ----- POST: Update Schedule for Date (Batch) -----
  async updateSchedule(data: UpdateScheduleDTO): Promise<{ success: boolean }> {
    const date = new Date(data.date);

    // Delete existing slot overrides for this date
    await prisma.slotOverride.deleteMany({
      where: {
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
    });

    // Create new slot overrides
    if (data.slots.length > 0) {
      await prisma.slotOverride.createMany({
        data: data.slots.map(slot => ({
          date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          maxBookings: slot.maxBookings,
          isAvailable: slot.isAvailable,
          createdBy: data.adminId,
        })),
      });
    }

    return { success: true };
  },

  // ----- POST: Set Day Override -----
  async setDayOverride(
    date: Date,
    data: {
      isClosed?: boolean;
      openTime?: string;
      closeTime?: string;
      maxBookings?: number;
      reason?: string;
      createdBy?: string;
    }
  ): Promise<DayOverride> {
    const override = await prisma.dayOverride.upsert({
      where: { date: startOfDay(date) },
      update: {
        isClosed: data.isClosed,
        openTime: data.openTime,
        closeTime: data.closeTime,
        maxBookings: data.maxBookings,
        reason: data.reason,
        createdBy: data.createdBy,
      },
      create: {
        date: startOfDay(date),
        isClosed: data.isClosed ?? false,
        openTime: data.openTime,
        closeTime: data.closeTime,
        maxBookings: data.maxBookings,
        reason: data.reason,
        createdBy: data.createdBy,
      },
    });

    return this.formatDayOverride(override);
  },

  // ----- DELETE: Remove Day Override -----
  async removeDayOverride(date: Date): Promise<void> {
    await prisma.dayOverride.deleteMany({
      where: {
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
    });
  },

  // ----- Helper: Get Booking Counts by Slot -----
  async getBookingCountsBySlot(date: Date): Promise<Record<string, number>> {
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        status: { not: 'CANCELLED' },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    const counts: Record<string, number> = {};
    for (const booking of bookings) {
      const key = `${booking.startTime}-${booking.endTime}`;
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  },

  // ----- Helper: Format Working Hours -----
  formatWorkingHours(wh: any): WorkingHours {
    return {
      id: wh.id,
      dayOfWeek: wh.dayOfWeek,
      openTime: wh.openTime,
      closeTime: wh.closeTime,
      slotDuration: wh.slotDuration,
      maxBookings: wh.maxBookings,
      isActive: wh.isActive,
    };
  },

  // ----- Helper: Format Day Override -----
  formatDayOverride(override: any): DayOverride {
    return {
      id: override.id,
      date: override.date.toISOString().split('T')[0],
      isClosed: override.isClosed,
      openTime: override.openTime,
      closeTime: override.closeTime,
      maxBookings: override.maxBookings,
      reason: override.reason,
      createdBy: override.createdBy,
      createdAt: override.createdAt.toISOString(),
    };
  },

  // ----- Helper: Format Slot Override -----
  formatSlotOverride(override: any): SlotOverride {
    return {
      id: override.id,
      date: override.date.toISOString().split('T')[0],
      startTime: override.startTime,
      endTime: override.endTime,
      isAvailable: override.isAvailable,
      maxBookings: override.maxBookings,
      reason: override.reason,
      createdBy: override.createdBy,
      createdAt: override.createdAt.toISOString(),
    };
  },
};

export default scheduleService;
