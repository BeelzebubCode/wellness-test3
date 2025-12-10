// ==========================================
// 📌 Types - Consultant
// ==========================================

export interface Consultant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  specialty?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string | null;
}

export interface CreateConsultantDTO {
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  specialty?: string;
}

export interface UpdateConsultantDTO {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  specialty?: string;
  isActive?: boolean;
}
