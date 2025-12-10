// File: src/app/api/admin/day-status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type DayStatus = 'OPEN' | 'CLOSED';

function toDateOnly(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`);
}

// POST /api/admin/day-status
// body: { date: 'YYYY-MM-DD', status: 'OPEN' | 'CLOSED' }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, status } = body as { date?: string; status?: DayStatus };

    if (!date || !status) {
      return NextResponse.json(
        { error: 'Missing date or status' },
        { status: 400 },
      );
    }

    const dateObj = toDateOnly(date);

    // ถ้า CLOSED -> isClosed = true
    // ถ้า OPEN -> isClosed = false (หรือจะลบ override ทิ้งก็ได้)
    const isClosed = status === 'CLOSED';

    const override = await prisma.dayOverride.upsert({
      where: { date: dateObj },
      update: { isClosed },
      create: {
        date: dateObj,
        isClosed,
        reason: isClosed ? 'ปิดให้บริการทั้งวัน (ตั้งค่าจากระบบแอดมิน)' : null,
      },
    });

    return NextResponse.json({ success: true, override });
  } catch (error) {
    console.error('Error toggling day status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle day status' },
      { status: 500 },
    );
  }
}
