// ==========================================
// 📌 API: /api/v1/schedule
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import { scheduleService } from '@/services';

export async function GET() {
  try {
    const workingHours = await scheduleService.getAllWorkingHours();
    return NextResponse.json({ success: true, workingHours });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.date || !body.slots) {
      return NextResponse.json({ error: 'Date and slots are required' }, { status: 400 });
    }

    const result = await scheduleService.updateSchedule({
      date: body.date,
      slots: body.slots,
      adminId: body.adminId,
    });

    return NextResponse.json({ ...result, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}