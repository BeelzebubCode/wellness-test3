// ==========================================
// 📌 Hook: useTimeSlots
// ==========================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { toISODateString } from '@/lib/date';
import type { TimeSlot } from '@/types';

interface UseTimeSlotsReturn {
  slots: TimeSlot[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTimeSlots(selectedDate: Date): UseTimeSlotsReturn {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeSlots = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dateStr = toISODateString(selectedDate);
      const response = await fetch(`/api/v1/slots?date=${dateStr}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch time slots');
      }

      const data = await response.json();
      setSlots(data.slots || []);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError('ไม่สามารถโหลดข้อมูลช่วงเวลาได้');
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchTimeSlots();
  }, [fetchTimeSlots]);

  return {
    slots,
    isLoading,
    error,
    refetch: fetchTimeSlots,
  };
}
