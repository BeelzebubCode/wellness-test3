// ==========================================
// 📌 Types - Booking
// ==========================================

export type BookingStatus = 'CONFIRMED' | 'ASSIGNED' | 'COMPLETED' | 'CANCELLED';

// ใช้เป็นสรุป user ที่ผูกกับ booking (ให้ตรงกับ formatBooking)
export interface BookingUser {
  id: string;
  lineId: string | null;
  name: string | null;
  pictureUrl?: string | null;
  studentId?: string | null;
  faculty?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// สรุป consultant ที่ผูกกับ booking
export interface BookingConsultant {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  specialty?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;

  // วันที่ + เวลา
  date: string;           // format: 'YYYY-MM-DD' (มาจาก booking.date.toISOString().split('T')[0])
  startTime: string;      // '08:00'
  endTime: string;        // '09:00'
  status: BookingStatus | string;

  // ข้อมูลปัญหา
  problemType: string | null;
  problemDescription: string | null;

  // ผลการปรึกษา / ยกเลิก
  consultantNote: string | null;
  cancelReason: string | null;

  // เวลา system
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;

  // ===========================
  //  FK / ข้อมูลเสริม
  // ===========================

  // id ของ user / consultant (อาจไม่จำเป็นต้องใช้ทุกหน้า ให้เป็น optional)
  userId?: string | null;
  consultantId?: string | null;

  // lineUserId + userName เผื่อไว้ใช้บนหน้า booking / admin
  lineUserId?: string | null;
  userName?: string | null;

  // object user / consultant ที่ formatBooking ใส่มาให้
  user?: BookingUser;
  consultant?: BookingConsultant;
}

// ---------- DTOs ----------

export interface CreateBookingDTO {
  lineUserId: string;
  userName?: string;
  date: string;
  startTime: string;
  endTime: string;
  problemType?: string;
  problemDescription?: string;
}

export interface UpdateBookingDTO {
  action: 'assign' | 'complete' | 'cancel';
  consultantId?: string;
  consultantNote?: string;
  cancelReason?: string;
}

// (ถ้ายังอยาก re-export User/Consultant ตัวเต็มไว้ใช้ที่อื่นก็ได้)
export type { User } from './user';
export type { Consultant } from './consultant';
