// ==========================================
// 📌 Mock Data Generator
// สำหรับทดสอบระบบโดยไม่ต้องต่อ Database
// ==========================================

import type { TimeSlot, Booking, Consultant } from '@/types';

// ========================================
// 🎯 CONFIG
// ========================================
export const MOCK_CONFIG = {
  enabled: true, // เปลี่ยนเป็น false เมื่อต้องการใช้ Database จริง
  simulateDelay: 300, // ms
};

// ========================================
// 📅 MOCK TIME SLOTS
// ========================================

export function generateMockSlots(dateStr: string): TimeSlot[] {
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
    // สุ่มแบบคงที่ตามวันและ index
    const pseudoRandom = ((dateSeed + index) * 7) % 10;
    const bookedCount = pseudoRandom >= 7 ? 1 : 0; // 30% chance booked
    const maxBookings = 1;
    
    mockSlots.push({
      id: `slot-${dateStr}-${index}`,
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
// 📋 MOCK BOOKINGS
// ========================================

const now = new Date().toISOString();

export function generateMockBookings(dateStr?: string): Booking[] {
  const baseDate = dateStr || new Date().toISOString().split('T')[0];
  
  const mockBookings: Booking[] = [
    {
      id: 'booking-001',
      date: baseDate,
      startTime: '09:00',
      endTime: '10:00',
      status: 'CONFIRMED',
      problemType: 'ความเครียด/วิตกกังวล',
      problemDescription: 'มีความเครียดเรื่องการเรียน',
      consultantNote: null,
      cancelReason: null,
      completedAt: null,
      user: {
        id: 'user-001',
        lineId: 'U123456789',
        name: 'สมชาย ใจดี',
        pictureUrl: '',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'booking-002',
      date: baseDate,
      startTime: '10:00',
      endTime: '11:00',
      status: 'ASSIGNED',
      problemType: 'ปัญหาความสัมพันธ์',
      problemDescription: 'มีปัญหากับเพื่อนร่วมห้อง',
      consultantNote: null,
      cancelReason: null,
      completedAt: null,
      consultant: {
        id: 'consultant-001',
        name: 'ดร.วิภา สุขใจ',
        specialty: 'จิตวิทยาคลินิก',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      user: {
        id: 'user-002',
        lineId: 'U987654321',
        name: 'สมหญิง รักเรียน',
        pictureUrl: '',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'booking-003',
      date: baseDate,
      startTime: '14:00',
      endTime: '15:00',
      status: 'COMPLETED',
      problemType: 'ปัญหาการเรียน',
      problemDescription: 'ไม่มีสมาธิในการเรียน',
      consultantNote: 'แนะนำให้ฝึกสมาธิก่อนนอน',
      cancelReason: null,
      completedAt: now,
      consultant: {
        id: 'consultant-002',
        name: 'อ.สมศักดิ์ เมตตา',
        specialty: 'การให้คำปรึกษา',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      user: {
        id: 'user-003',
        lineId: 'U111222333',
        name: 'ทดสอบ ระบบ',
        pictureUrl: '',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      createdAt: now,
      updatedAt: now,
    },
  ];

  // กรองเฉพาะวันที่ที่ต้องการ (ถ้าระบุ)
  if (dateStr) {
    return mockBookings.filter(b => b.date === dateStr);
  }

  return mockBookings;
}

// ========================================
// 👨‍⚕️ MOCK CONSULTANTS
// ========================================

export function generateMockConsultants(): Consultant[] {
  return [
    {
      id: 'consultant-001',
      name: 'ดร.วิภา สุขใจ',
      email: 'vipa@wellness.ac.th',
      phone: '081-234-5678',
      specialty: 'จิตวิทยาคลินิก',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'consultant-002',
      name: 'อ.สมศักดิ์ เมตตา',
      email: 'somsak@wellness.ac.th',
      phone: '082-345-6789',
      specialty: 'การให้คำปรึกษา',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'consultant-003',
      name: 'ผศ.ดร.มณี ใจสงบ',
      email: 'manee@wellness.ac.th',
      phone: '083-456-7890',
      specialty: 'จิตวิทยาพัฒนาการ',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'consultant-004',
      name: 'อ.ประเสริฐ สันติ',
      email: 'prasert@wellness.ac.th',
      phone: '084-567-8901',
      specialty: 'การให้คำปรึกษาครอบครัว',
      isActive: false,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

// ========================================
// 📊 MOCK STATS
// ========================================

export function generateMockStats() {
  return {
    total: 156,
    confirmed: 12,
    assigned: 8,
    completed: 128,
    cancelled: 8,
    todayTotal: 5,
    todayCompleted: 2,
    weeklyTrend: [
      { date: '2024-01-08', count: 3 },
      { date: '2024-01-09', count: 5 },
      { date: '2024-01-10', count: 4 },
      { date: '2024-01-11', count: 6 },
      { date: '2024-01-12', count: 2 },
      { date: '2024-01-13', count: 0 },
      { date: '2024-01-14', count: 0 },
    ],
    byProblemType: [
      { type: 'ความเครียด/วิตกกังวล', count: 45 },
      { type: 'ปัญหาการเรียน', count: 32 },
      { type: 'ปัญหาความสัมพันธ์', count: 28 },
      { type: 'ภาวะซึมเศร้า', count: 18 },
      { type: 'อื่นๆ', count: 33 },
    ],
    byConsultant: [
      { name: 'ดร.วิภา สุขใจ', count: 52 },
      { name: 'อ.สมศักดิ์ เมตตา', count: 48 },
      { name: 'ผศ.ดร.มณี ใจสงบ', count: 36 },
    ],
  };
}

// ========================================
// 🔧 HELPER
// ========================================

export async function simulateApiDelay(): Promise<void> {
  if (MOCK_CONFIG.simulateDelay > 0) {
    await new Promise(resolve => setTimeout(resolve, MOCK_CONFIG.simulateDelay));
  }
}