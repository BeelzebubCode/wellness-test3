// 📁 src/app/api/v1/bookings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteContext {
  params: { id: string };
}

// PUT /api/v1/bookings/:id
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const id = params.id;
    const body = await req.json().catch(() => ({} as any));
    const { action, cancelReason } = body as {
      action?: string;
      cancelReason?: string;
    };

    if (action !== 'cancel') {
      return NextResponse.json(
        { error: 'Unsupported action' },
        { status: 400 },
      );
    }

    // เช็คว่ามี booking นี้จริงไหม
    const existing = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'ไม่พบรายการจองนี้แล้ว' },
        { status: 404 },
      );
    }

    // อัปเดตสถานะเป็น CANCELLED
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelReason: cancelReason || null,
      },
    });

    return NextResponse.json({ booking });
  } catch (error: any) {
    console.error('[BOOKING_CANCEL]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to cancel booking' },
      { status: 500 },
    );
  }
}
