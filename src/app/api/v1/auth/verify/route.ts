// ==========================================
// 📌 API: /api/v1/auth/verify
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return NextResponse.json({ valid: false, error: 'No token' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 });

    return NextResponse.json({
      valid: true,
      admin: { id: payload.adminId, username: payload.username, role: payload.role },
    });
  } catch (error) {
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 });
  }
}