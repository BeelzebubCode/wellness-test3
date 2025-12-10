// ==========================================
// 📌 Types - Schedule
// ==========================================

export interface TimeSlot {
  id: string; 
  date: string;
  startTime: string;
  endTime: string;
  maxBookings: number;
  bookedCount: number;
  availableCount: number;
  isAvailable: boolean;
  isClosed?: boolean;
  closedReason?: string;
  isOverridden?: boolean;
}

export interface WorkingHours {
  id: string;
  dayOfWeek: number; // 0-6
  openTime: string;
  closeTime: string;
  slotDuration: number;
  maxBookings: number;
  isActive: boolean;
}

export interface DayOverride {
  id: string;
  date: string;
  isClosed: boolean;
  openTime?: string;
  closeTime?: string;
  maxBookings?: number;
  reason?: string;
  createdBy?: string;
  createdAt: string;
}

export interface SlotOverride {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxBookings?: number;
  reason?: string;
  createdBy?: string;
  createdAt: string;
}

export interface ScheduleConfig {
  workingHours: WorkingHours[];
  dayOverrides: DayOverride[];
  slotOverrides: SlotOverride[];
}

export interface UpdateScheduleDTO {
  date: string;
  slots: {
    startTime: string;
    endTime: string;
    maxBookings: number;
    isAvailable: boolean;
  }[];
  adminId?: string;
}
