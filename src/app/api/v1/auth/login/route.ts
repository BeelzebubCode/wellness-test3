// ==========================================
// 📌 API: /api/v1/auth/login
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateToken, verifyPassword } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
      include: { consultant: true },
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
    }

    const token = await generateToken({
      adminId: admin.id,
      username: admin.username,
      role: admin.role,
      consultantId: admin.consultantId || undefined,
    });

    const response = NextResponse.json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username, name: admin.name, role: admin.role },
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' }, { status: 500 });
  }
}