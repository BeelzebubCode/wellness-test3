// ==========================================
// 📌 API: /api/v1/consultants
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import { consultantService } from '@/services';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    const consultants = await consultantService.getAllConsultants(!showAll);
    return NextResponse.json({ success: true, consultants });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch consultants' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const consultant = await consultantService.createConsultant({
      name: body.name,
      email: body.email,
      phone: body.phone,
      avatar: body.avatar,
      specialty: body.specialty,
    });

    return NextResponse.json({ success: true, consultant });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create consultant' }, { status: 500 });
  }
}