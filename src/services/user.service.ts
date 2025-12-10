// ==========================================
// 📌 User Service
// ==========================================

import prisma from '@/lib/prisma';
import type { User, CreateUserDTO, UpdateUserDTO } from '@/types';

export const userService = {
  // ----- GET: User by LINE ID -----
  async getUserByLineId(lineId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { lineId },
    });
    return user ? this.formatUser(user) : null;
  },

  // ----- GET: User by ID -----
  async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user ? this.formatUser(user) : null;
  },

  // ----- POST: Create or Update User -----
  async upsertUser(data: CreateUserDTO): Promise<User> {
    const user = await prisma.user.upsert({
      where: { lineId: data.lineId },
      update: {
        name: data.name,
        pictureUrl: data.pictureUrl,
        studentId: data.studentId,
        faculty: data.faculty,
        phone: data.phone,
        email: data.email,
      },
      create: {
        lineId: data.lineId,
        name: data.name,
        pictureUrl: data.pictureUrl,
        studentId: data.studentId,
        faculty: data.faculty,
        phone: data.phone,
        email: data.email,
      },
    });

    return this.formatUser(user);
  },

  // ----- PUT: Update User -----
  async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        pictureUrl: data.pictureUrl,
        studentId: data.studentId,
        faculty: data.faculty,
        phone: data.phone,
        email: data.email,
      },
    });

    return this.formatUser(user);
  },

  // ----- GET: All Users -----
  async getAllUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return users.map(this.formatUser);
  },

  // ----- Helper: Format User -----
  formatUser(user: any): User {
    return {
      id: user.id,
      lineId: user.lineId,
      name: user.name,
      pictureUrl: user.pictureUrl,
      studentId: user.studentId,
      faculty: user.faculty,
      phone: user.phone,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  },
};

export default userService;
