// File: src/app/api/v1/slots/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

// GET /api/v1/slots/:id
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const slot = await prisma.timeSlot.findUnique({
      where: { id: params.id },
    });

    if (!slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    return NextResponse.json({ slot });
  } catch (error) {
    console.error('Error fetching slot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slot' },
      { status: 500 },
    );
  }
}

// PATCH /api/v1/slots/:id
// body: { startTime?, endTime?, capacity?, isAvailable? }
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const body = await req.json();
    const { startTime, endTime, capacity, isAvailable } = body;

    const data: any = {};
    if (startTime !== undefined) data.startTime = startTime;
    if (endTime !== undefined) data.endTime = endTime;
    if (capacity !== undefined) data.maxBookings = capacity;
    if (isAvailable !== undefined) data.isAvailable = isAvailable;

    const slot = await prisma.timeSlot.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ slot });
  } catch (error) {
    console.error('Error updating slot:', error);
    return NextResponse.json(
      { error: 'Failed to update slot' },
      { status: 500 },
    );
  }
}

// DELETE /api/v1/slots/:id
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await prisma.timeSlot.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting slot:', error);
    return NextResponse.json(
      { error: 'Failed to delete slot' },
      { status: 500 },
    );
  }
}
