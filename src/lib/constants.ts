// ==========================================
// 📌 App Constants
// ==========================================

// ----- Booking Status Config -----
export const BOOKING_STATUS = {
  CONFIRMED: {
    key: 'CONFIRMED',
    label: 'รอมอบหมาย',
    icon: '⏳',
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  ASSIGNED: {
    key: 'ASSIGNED',
    label: 'กำลังดำเนินการ',
    icon: '👨‍⚕️',
    color: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
  },
  COMPLETED: {
    key: 'COMPLETED',
    label: 'เสร็จสิ้น',
    icon: '✅',
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  CANCELLED: {
    key: 'CANCELLED',
    label: 'ยกเลิก',
    icon: '❌',
    color: 'gray',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-500',
    borderColor: 'border-gray-200',
  },
} as const;

// ----- Problem Types -----
export const PROBLEM_TYPES = [
  { id: 'stress', label: 'ความเครียด/วิตกกังวล', icon: '😰' },
  { id: 'depression', label: 'ภาวะซึมเศร้า', icon: '😢' },
  { id: 'relationship', label: 'ปัญหาความสัมพันธ์', icon: '💔' },
  { id: 'academic', label: 'ปัญหาการเรียน', icon: '📚' },
  { id: 'career', label: 'ปัญหาอาชีพ/การทำงาน', icon: '💼' },
  { id: 'family', label: 'ปัญหาครอบครัว', icon: '👨‍👩‍👧‍👦' },
  { id: 'self-esteem', label: 'ปัญหาความมั่นใจในตัวเอง', icon: '🪞' },
  { id: 'sleep', label: 'ปัญหาการนอนหลับ', icon: '😴' },
  { id: 'addiction', label: 'ปัญหาการเสพติด', icon: '🚭' },
  { id: 'grief', label: 'การสูญเสีย/ความเศร้าโศก', icon: '🕊️' },
  { id: 'other', label: 'อื่นๆ', icon: '💭' },
] as const;

// ----- Days of Week -----
export const DAYS_OF_WEEK = [
  { id: 0, name: 'อาทิตย์', short: 'อา', en: 'Sunday' },
  { id: 1, name: 'จันทร์', short: 'จ', en: 'Monday' },
  { id: 2, name: 'อังคาร', short: 'อ', en: 'Tuesday' },
  { id: 3, name: 'พุธ', short: 'พ', en: 'Wednesday' },
  { id: 4, name: 'พฤหัสบดี', short: 'พฤ', en: 'Thursday' },
  { id: 5, name: 'ศุกร์', short: 'ศ', en: 'Friday' },
  { id: 6, name: 'เสาร์', short: 'ส', en: 'Saturday' },
] as const;

// ----- Default Working Hours -----
export const DEFAULT_WORKING_HOURS = {
  weekday: { openTime: '08:00', closeTime: '20:00' },
  weekend: { openTime: '08:00', closeTime: '16:00' },
  slotDuration: 60, // minutes
  maxBookings: 1,
} as const;

// ----- App Settings -----
export const APP_CONFIG = {
  name: 'NU Wellness Center',
  shortName: 'NUW',
  description: 'ระบบจองคิวให้คำปรึกษาสุขภาพจิต',
  maxAdvanceBookingDays: 60, // 2 months
  maxActiveBookingsPerUser: 1,
  lineChannelId: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID || '',
  liffId: process.env.NEXT_PUBLIC_LIFF_ID || '',
} as const;

// ----- API Routes -----
export const API_ROUTES = {
  auth: {
    login: '/api/v1/auth/login',
    verify: '/api/v1/auth/verify',
  },
  bookings: {
    list: '/api/v1/bookings',
    create: '/api/v1/bookings',
    detail: (id: string) => `/api/v1/bookings/${id}`,
    update: (id: string) => `/api/v1/bookings/${id}`,
  },
  slots: {
    list: '/api/v1/slots',
  },
  schedule: {
    config: '/api/v1/schedule',
    overrides: '/api/v1/schedule/overrides',
  },
  consultants: {
    list: '/api/v1/consultants',
    detail: (id: string) => `/api/v1/consultants/${id}`,
  },
  users: {
    create: '/api/v1/users',
  },
} as const;

// ----- Navigation -----
export const PUBLIC_NAV = [
  { href: '/booking', label: 'จองคิว', icon: '📅' },
  { href: '/booking/my-appointments', label: 'ตารางนัดของฉัน', icon: '📋' },
] as const;

export const ADMIN_NAV = [
  { href: '/admin', label: 'แดชบอร์ด', icon: '🏠' },
  { href: '/admin/bookings', label: 'รายการจอง', icon: '📅' },
  { href: '/admin/schedule', label: 'จัดการตาราง', icon: '⏰' },
  // { href: '/admin/consultants', label: 'ผู้ให้คำปรึกษา', icon: '👨‍⚕️' },
  { href: '/admin/stats', label: 'สถิติ', icon: '📊' },
  { href: '/admin/my-jobs', label: 'งานของฉัน', icon: '👨‍⚕️' },
] as const;
