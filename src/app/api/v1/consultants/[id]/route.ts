// ==========================================
// 📌 API: /api/v1/consultants/[id]
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import { consultantService } from '@/services';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const consultant = await consultantService.getConsultantById(id);
    if (!consultant) return NextResponse.json({ error: 'Consultant not found' }, { status: 404 });
    return NextResponse.json({ success: true, consultant });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch consultant' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const consultant = await consultantService.updateConsultant(id, {
      name: body.name,
      email: body.email,
      phone: body.phone,
      avatar: body.avatar,
      specialty: body.specialty,
      isActive: body.isActive,
    });

    return NextResponse.json({ success: true, consultant });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update consultant' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await consultantService.deactivateConsultant(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete consultant' }, { status: 500 });
  }
}