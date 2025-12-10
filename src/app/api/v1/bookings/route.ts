// ==========================================
// 📌 API Route: /api/v1/bookings
// รองรับทั้ง Mock Data และ Database จริง
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CONFIG, generateMockBookings, simulateApiDelay } from '@/lib/mockData';
import type { BookingFilters } from '@/types';

// ======================================
// GET /api/v1/bookings
// ======================================
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

    // ========== MOCK MODE ==========
    if (MOCK_CONFIG.enabled) {
      await simulateApiDelay();
      
      let bookings = generateMockBookings(filters.date);
      
      // Filter by status if provided
      if (filters.status) {
        bookings = bookings.filter(b => b.status === filters.status);
      }
      
      // Filter by lineUserId if provided
      if (filters.lineUserId) {
        bookings = bookings.filter(b => b.user?.lineId === filters.lineUserId);
      }
      
      return NextResponse.json({ 
        success: true, 
        bookings,
        _mock: true 
      });
    }

    // ========== REAL DATABASE MODE ==========
    const { bookingService } = await import('@/services');
    const bookings = await bookingService.getBookings(filters);
    return NextResponse.json({ success: true, bookings });
    
  } catch (error) {
    console.error('Error fetching bookings:', error);
    
    // Fallback to mock data
    const dateStr = new URL(request.url).searchParams.get('date') || undefined;
    const bookings = generateMockBookings(dateStr);
    
    return NextResponse.json({ 
      success: true, 
      bookings,
      _mock: true,
      _error: 'Database unavailable'
    });
  }
}

// ======================================
// POST /api/v1/bookings
// ======================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.lineUserId || !body.date || !body.startTime || !body.endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ========== MOCK MODE ==========
    if (MOCK_CONFIG.enabled) {
      await simulateApiDelay();
      
      const mockBooking = {
        id: `booking-${Date.now()}`,
        date: body.date,
        startTime: body.startTime,
        endTime: body.endTime,
        status: 'CONFIRMED',
        problemType: body.problemType,
        problemDescription: body.problemDescription,
        user: {
          id: `user-${Date.now()}`,
          lineId: body.lineUserId,
          name: body.userName || 'ผู้ใช้ทดสอบ',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({ 
        success: true, 
        booking: mockBooking,
        _mock: true 
      });
    }

    // ========== REAL DATABASE MODE ==========
    const { bookingService } = await import('@/services');
    
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