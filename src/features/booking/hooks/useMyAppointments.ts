// ==========================================
// 📌 Hook: useMyAppointments
// ==========================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Booking } from '@/types';

interface UseMyAppointmentsReturn {
  bookings: Booking[];
  activeBooking: Booking | null;
  pastBookings: Booking[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasActiveBooking: boolean;
}

export function useMyAppointments(lineUserId: string | null): UseMyAppointmentsReturn {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!lineUserId) {
      setBookings([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/bookings?lineUserId=${lineUserId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('ไม่สามารถโหลดข้อมูลการจองได้');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [lineUserId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Separate active and past bookings
  const activeBooking = bookings.find(b => 
    ['CONFIRMED', 'ASSIGNED'].includes(b.status)
  ) || null;

  const pastBookings = bookings.filter(b => 
    ['COMPLETED', 'CANCELLED'].includes(b.status)
  );

  return {
    bookings,
    activeBooking,
    pastBookings,
    isLoading,
    error,
    refetch: fetchBookings,
    hasActiveBooking: !!activeBooking,
  };
}
