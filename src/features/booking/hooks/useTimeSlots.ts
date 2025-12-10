// ==========================================
// 📌 Hook: useTimeSlots (with Mock Data Support)
// ==========================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { toISODateString } from '@/lib/date';
import type { TimeSlot } from '@/types';

// ========================================
// 🎯 MOCK DATA CONFIG
// ========================================
const USE_MOCK_DATA = true; // เปลี่ยนเป็น false เมื่อต้องการใช้ API จริง

// สร้าง Mock Slots สำหรับวันที่ใดๆ
function generateMockSlots(dateStr: string): TimeSlot[] {
  const mockSlots: TimeSlot[] = [];
  
  // เช้า: 08:00 - 12:00
  const morningSlots = [
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
  ];
  
  // บ่าย: 13:00 - 17:00
  const afternoonSlots = [
    { start: '13:00', end: '14:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
  ];
  
  // เย็น: 17:00 - 20:00
  const eveningSlots = [
    { start: '17:00', end: '18:00' },
    { start: '18:00', end: '19:00' },
    { start: '19:00', end: '20:00' },
  ];

  const allSlots = [...morningSlots, ...afternoonSlots, ...eveningSlots];

  // ใช้ dateStr เป็น seed สำหรับสุ่มให้ผลลัพธ์คงที่ต่อวัน
  const dateSeed = dateStr.split('-').reduce((acc, num) => acc + parseInt(num), 0);

  allSlots.forEach((slot, index) => {
    // สุ่มแบบคงที่ตามวันและ index (30% chance booked)
    const pseudoRandom = ((dateSeed + index) * 7) % 10;
    const bookedCount = pseudoRandom >= 7 ? 1 : 0;
    const maxBookings = 1;
    
    mockSlots.push({
      id: `mock-slot-${dateStr}-${index}`,
      date: dateStr,
      startTime: slot.start,
      endTime: slot.end,
      maxBookings: maxBookings,
      bookedCount: bookedCount,
      availableCount: maxBookings - bookedCount,
      isAvailable: bookedCount < maxBookings,
    });
  });

  return mockSlots;
}

// ========================================
// 🎣 HOOK
// ========================================

interface UseTimeSlotsReturn {
  slots: TimeSlot[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isMockData: boolean;
}

export function useTimeSlots(selectedDate: Date): UseTimeSlotsReturn {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  const fetchTimeSlots = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsMockData(false);

    const dateStr = toISODateString(selectedDate);

    // ถ้าเปิด mock mode - ใช้ mock data เสมอ
    if (USE_MOCK_DATA) {
      // จำลองการโหลด
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockSlots = generateMockSlots(dateStr);
      console.log('[useTimeSlots] Using MOCK DATA:', mockSlots.length, 'slots');
      setSlots(mockSlots);
      setIsMockData(true);
      setIsLoading(false);
      return;
    }

    // ถ้าใช้ API จริง
    try {
      const response = await fetch(`/api/v1/slots?date=${dateStr}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch time slots');
      }

      const data = await response.json();
      
      if (data.slots && data.slots.length > 0) {
        setSlots(data.slots);
      } else {
        // Fallback to mock data
        console.warn('[useTimeSlots] API returned empty, using mock data');
        const mockSlots = generateMockSlots(dateStr);
        setSlots(mockSlots);
        setIsMockData(true);
      }
    } catch (err) {
      console.error('[useTimeSlots] Error fetching, falling back to mock:', err);
      
      // Fallback to mock data เมื่อ API ล้มเหลว
      const mockSlots = generateMockSlots(dateStr);
      setSlots(mockSlots);
      setIsMockData(true);
      setError(null);
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
    isMockData,
  };
}