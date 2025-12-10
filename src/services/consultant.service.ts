// ==========================================
// 📌 Consultant Service
// ==========================================

import prisma from '@/lib/prisma';
import type { Consultant, CreateConsultantDTO, UpdateConsultantDTO } from '@/types';

export const consultantService = {
  // ----- GET: All Consultants -----
  async getAllConsultants(activeOnly = true): Promise<Consultant[]> {
    const consultants = await prisma.consultant.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { name: 'asc' },
    });
    return consultants.map(this.formatConsultant);
  },

  // ----- GET: Consultant by ID -----
  async getConsultantById(id: string): Promise<Consultant | null> {
    const consultant = await prisma.consultant.findUnique({
      where: { id },
    });
    return consultant ? this.formatConsultant(consultant) : null;
  },

  // ----- POST: Create Consultant -----
  async createConsultant(data: CreateConsultantDTO): Promise<Consultant> {
    const consultant = await prisma.consultant.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
        specialty: data.specialty,
      },
    });
    return this.formatConsultant(consultant);
  },

  // ----- PUT: Update Consultant -----
  async updateConsultant(id: string, data: UpdateConsultantDTO): Promise<Consultant> {
    const consultant = await prisma.consultant.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
        specialty: data.specialty,
        isActive: data.isActive,
      },
    });
    return this.formatConsultant(consultant);
  },

  // ----- DELETE: Deactivate Consultant -----
  async deactivateConsultant(id: string): Promise<void> {
    await prisma.consultant.update({
      where: { id },
      data: { isActive: false },
    });
  },

  // ----- GET: Consultant Stats -----
  async getConsultantStats(id: string, startDate?: Date, endDate?: Date) {
    const where: Record<string, unknown> = { consultantId: id };
    
    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [total, completed, assigned] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.booking.count({ where: { ...where, status: 'ASSIGNED' } }),
    ]);

    return { total, completed, assigned };
  },

  // ----- Helper: Format Consultant -----
  formatConsultant(consultant: any): Consultant {
    return {
      id: consultant.id,
      name: consultant.name,
      email: consultant.email,
      phone: consultant.phone,
      avatar: consultant.avatar,
      specialty: consultant.specialty,
      isActive: consultant.isActive,
      createdAt: consultant.createdAt.toISOString(),
      updatedAt: consultant.updatedAt.toISOString(),
    };
  },
};

export default consultantService;
