// ==========================================
// 📌 API Route: /api/v1/slots
// รองรับทั้ง Mock Data และ Database จริง
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CONFIG, generateMockSlots, simulateApiDelay } from '@/lib/mockData';

// ======================================
// 1) GET /api/v1/slots?date=YYYY-MM-DD
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

    // ========== MOCK MODE ==========
    if (MOCK_CONFIG.enabled) {
      await simulateApiDelay();
      
      const slots = generateMockSlots(dateStr);
      const dayStatus = 'OPEN'; // หรือ 'CLOSED' ตามต้องการทดสอบ
      
      return NextResponse.json({ 
        slots, 
        dayStatus,
        _mock: true // flag บอกว่าเป็น mock data
      });
    }

    // ========== REAL DATABASE MODE ==========
    // Import prisma เฉพาะเมื่อจะใช้งานจริง
    const prisma = (await import('@/lib/prisma')).default;
    
    const startDate = new Date(`${dateStr}T00:00:00`);
    const endDate = new Date(`${dateStr}T23:59:59`);
    const targetDate = new Date(`${dateStr}T00:00:00`);

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
      const dayOfWeek = targetDate.getDay();

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

    // 3. ดึง DayOverride
    let dayStatus: 'OPEN' | 'CLOSED' = 'OPEN';

    const override = await prisma.dayOverride.findUnique({
      where: { date: targetDate },
    });

    if (override) {
      dayStatus = override.isClosed ? 'CLOSED' : 'OPEN';
    }

    return NextResponse.json({ slots, dayStatus });
  } catch (error) {
    console.error('[SLOTS_GET]', error);
    
    // Fallback to mock data on error
    const dateStr = new URL(req.url).searchParams.get('date') || new Date().toISOString().split('T')[0];
    const slots = generateMockSlots(dateStr);
    
    return NextResponse.json({ 
      slots, 
      dayStatus: 'OPEN',
      _mock: true,
      _error: 'Database unavailable, using mock data'
    });
  }
}

// ======================================
// 2) POST /api/v1/slots - Create new slot
// ======================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ========== MOCK MODE ==========
    if (MOCK_CONFIG.enabled) {
      await simulateApiDelay();
      
      return NextResponse.json({ 
        success: true,
        slot: {
          id: `slot-new-${Date.now()}`,
          ...body,
          isAvailable: true,
          bookedCount: 0,
        },
        _mock: true
      });
    }

    // ========== REAL DATABASE MODE ==========
    const prisma = (await import('@/lib/prisma')).default;
    
    const slot = await prisma.timeSlot.create({
      data: {
        date: new Date(body.date),
        startTime: body.startTime,
        endTime: body.endTime,
        maxBookings: body.capacity || body.maxBookings || 1,
        isAvailable: true,
      },
    });

    return NextResponse.json({ success: true, slot });
  } catch (error) {
    console.error('[SLOTS_POST]', error);
    return NextResponse.json(
      { error: 'Failed to create slot' },
      { status: 500 }
    );
  }
}

// ======================================
// 3) DELETE /api/v1/slots?date=YYYY-MM-DD
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

    // ========== MOCK MODE ==========
    if (MOCK_CONFIG.enabled) {
      await simulateApiDelay();
      return NextResponse.json({ count: 11, _mock: true });
    }

    // ========== REAL DATABASE MODE ==========
    const prisma = (await import('@/lib/prisma')).default;
    
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
    return NextResponse.json(
      { error: 'Failed to delete slots' },
      { status: 500 }
    );
  }
}

// ======================================
// Helper Functions
// ======================================

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toTimeString().slice(0, 5);
}