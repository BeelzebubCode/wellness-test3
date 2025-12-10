// File: src/app/api/v1/slots/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ฟังก์ชันช่วยบวกเวลา เช่น 08:00 + 60 -> 09:00
function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toTimeString().slice(0, 5); // HH:MM
}

// helper ให้ได้ Date เฉพาะวันที่ (ตัดเวลาออก)
function toDateOnly(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`);
}

// ======================================
// 1) GET /api/v1/slots?date=YYYY-MM-DD
//    - ดึง slot ของวันนั้นจากตาราง time_slots
//    - ถ้ายังไม่มี -> auto-generate จาก WorkingHours
//    - คืน { slots, dayStatus }
// ======================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');

    if (!dateStr) {
      return NextResponse.json(
        { error: 'Date required' },
        { status: 400 },
      );
    }

    const startDate = new Date(`${dateStr}T00:00:00`);
    const endDate = new Date(`${dateStr}T23:59:59`);
    const targetDate = toDateOnly(dateStr);

    // 1. ดึง slot จาก time_slots ตามวันที่
    let slots = await prisma.timeSlot.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { startTime: 'asc' },
    });

    // 2. ถ้ายังไม่มี slot เลย -> auto generate จาก WorkingHours
    if (slots.length === 0) {
      const dayOfWeek = targetDate.getDay(); // 0 = Sunday ... 6 = Saturday

      const workingHours = await prisma.workingHours.findUnique({
        where: { dayOfWeek },
      });

      if (workingHours && workingHours.isActive) {
        const newSlotsData: {
          date: Date;
          startTime: string;
          endTime: string;
          maxBookings: number;
          isAvailable: boolean;
        }[] = [];

        let currentTime = workingHours.openTime;

        while (currentTime < workingHours.closeTime) {
          const nextTime = addMinutes(currentTime, workingHours.slotDuration);
          if (nextTime > workingHours.closeTime) break;

          newSlotsData.push({
            date: startDate,
            startTime: currentTime,
            endTime: nextTime,
            maxBookings: workingHours.maxBookings,
            isAvailable: true,
          });

          currentTime = nextTime;
        }

        if (newSlotsData.length > 0) {
          await prisma.timeSlot.createMany({
            data: newSlotsData,
            skipDuplicates: true,
          });

          // ดึงใหม่อีกรอบหลังสร้างเสร็จ
          slots = await prisma.timeSlot.findMany({
            where: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
            orderBy: { startTime: 'asc' },
          });
        }
      }
    }

    // 3. ดึง DayOverride เพื่อบอกสถานะวัน (OPEN / CLOSED)
    let dayStatus: 'OPEN' | 'CLOSED' | null = null;

    const override = await prisma.dayOverride.findUnique({
      where: { date: targetDate },
    });

    if (override) {
      dayStatus = override.isClosed ? 'CLOSED' : 'OPEN';
    } else {
      // ถ้าไม่มี override เลย ถือว่าเปิดปกติ
      dayStatus = 'OPEN';
    }

    return NextResponse.json({ slots, dayStatus });
  } catch (error) {
    console.error('[SLOTS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// ======================================
// 2) DELETE /api/v1/slots?date=YYYY-MM-DD
//    - ลบ slot ทั้งวันจาก time_slots
// ======================================
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');

    if (!dateStr) {
      return NextResponse.json(
        { error: 'Date required' },
        { status: 400 },
      );
    }

    const startDate = new Date(`${dateStr}T00:00:00`);
    const endDate = new Date(`${dateStr}T23:59:59`);

    const deleted = await prisma.timeSlot.deleteMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return NextResponse.json({ count: deleted.count });
  } catch (error) {
    console.error('[SLOTS_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
