// ==========================================
// 📌 API: /api/v1/bookings
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import { bookingService } from '@/services';
import type { BookingFilters } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters: BookingFilters = {
      date: searchParams.get('date') || undefined,
      status: searchParams.get('status') || undefined,
      lineUserId: searchParams.get('lineUserId') || undefined,
      consultantId: searchParams.get('consultantId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    };

    const bookings = await bookingService.getBookings(filters);
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.lineUserId || !body.date || !body.startTime || !body.endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const booking = await bookingService.createBooking({
      lineUserId: body.lineUserId,
      userName: body.userName,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      problemType: body.problemType,
      problemDescription: body.problemDescription,
    });

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 400 });
  }
}