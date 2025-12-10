// ==========================================
// 📌 API: /api/v1/users
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.lineId || !body.name) {
      return NextResponse.json({ error: 'lineId and name are required' }, { status: 400 });
    }

    const user = await userService.upsertUser({
      lineId: body.lineId,
      name: body.name,
      pictureUrl: body.pictureUrl,
      studentId: body.studentId,
      faculty: body.faculty,
      phone: body.phone,
      email: body.email,
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create/update user' }, { status: 500 });
  }
}