// src/app/api/admin/stats/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') ?? '';
  const faculty = searchParams.get('faculty');
  const problemType = searchParams.get('problemType');
  const status = searchParams.get('status') as
    | 'PENDING'
    | 'CONFIRMED'
    | 'COMPLETED'
    | 'CANCELLED'
    | null;
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  const where: any = {};

  if (search) {
    where.OR = [
      { userName: { contains: search, mode: 'insensitive' } },
      { user: { studentId: { contains: search } } },
    ];
  }

  if (faculty) where.user = { ...(where.user ?? {}), faculty };
  if (problemType && problemType !== 'ทั้งหมด')
    where.problemType = { contains: problemType, mode: 'insensitive' };
  if (status) where.status = status;

  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = new Date(`${dateFrom}T00:00:00`);
    if (dateTo) where.date.lte = new Date(`${dateTo}T23:59:59`);
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      user: true,
    },
    orderBy: { date: 'desc' },
  });

  const summary = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
    completed: bookings.filter((b) => b.status === 'COMPLETED').length,
    cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
  };

  const mapped = bookings.map((b) => ({
    id: b.id,
    studentId: b.user?.studentId ?? null,
    userName: b.userName ?? b.user?.name ?? null,
    faculty: b.user?.faculty ?? null,
    major: null, // ถ้ามี field major ก็ map เพิ่มได้
    problemType: b.problemType,
    date: b.date.toISOString(),
    startTime: b.startTime,
    status: b.status as any,
  }));

  return NextResponse.json({ summary, bookings: mapped });
}
