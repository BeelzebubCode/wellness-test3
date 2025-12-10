// ==========================================
// 📌 Hook: useBooking
// ==========================================

'use client';

import { useState, useCallback } from 'react';
import type { CreateBookingDTO, Booking } from '@/types';

interface UseBookingReturn {
  createBooking: (data: CreateBookingDTO) => Promise<Booking>;
  cancelBooking: (id: string, reason?: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

// helper: ปาร์ส JSON แบบปลอดภัย เผื่อ response ว่าง
async function safeJson<T = any>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function useBooking(): UseBookingReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = useCallback(
    async (data: CreateBookingDTO): Promise<Booking> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/v1/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await safeJson<{ booking: Booking; error?: string }>(
          response,
        );

        if (!response.ok) {
          throw new Error(result?.error || 'Failed to create booking');
        }

        if (!result?.booking) {
          throw new Error('Invalid response from server');
        }

        return result.booking;
      } catch (err: any) {
        const errorMessage = err?.message || 'เกิดข้อผิดพลาดในการจอง';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const cancelBooking = useCallback(
  async (id: string, reason?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel', cancelReason: reason }),
      });

      // ถ้าไม่ ok ลองอ่าน body ดูก่อน
      const text = await response.text();
      const json = text ? JSON.parse(text) : null;

      if (!response.ok) {
        const msg =
          json?.error ||
          `ไม่สามารถยกเลิกคิวได้ (status ${response.status})`;
        throw new Error(msg);
      }

      // success ไม่ต้องทำอะไรต่อ
      return;
    } catch (err: any) {
      const errorMessage = err?.message || 'เกิดข้อผิดพลาดในการยกเลิก';
      console.error('[cancelBooking]', err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  },
  [],
);


  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createBooking,
    cancelBooking,
    isLoading,
    error,
    clearError,
  };
}
