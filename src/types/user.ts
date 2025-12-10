// ==========================================
// 📌 Types - User
// ==========================================

export interface User {
  id: string;
  lineId: string;
  name: string;
  pictureUrl?: string;
  studentId?: string;
  faculty?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tel?: string | null;
}

export interface CreateUserDTO {
  lineId: string;
  name: string;
  pictureUrl?: string;
  studentId?: string;
  faculty?: string;
  phone?: string;
  email?: string;
}

export interface UpdateUserDTO {
  name?: string;
  pictureUrl?: string;
  studentId?: string;
  faculty?: string;
  phone?: string;
  email?: string;
}

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}
