// src/app/api/admin/stats/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GET as getStats } from '../bookings/route';

export async function GET(req: NextRequest) {
  // reuse logic จาก bookings/route.ts
  const res = await getStats(req);
  const data = await res.json();

  const rows = [
    ['รหัสนิสิต', 'ชื่อ-สกุล', 'คณะ', 'ประเภทปัญหา', 'วันที่', 'เวลา', 'สถานะ'],
    ...data.bookings.map((b: any) => [
      b.studentId ?? '',
      b.userName ?? '',
      b.faculty ?? '',
      b.problemType ?? '',
      b.date.slice(0, 10),
      b.startTime,
      b.status,
    ]),
  ];

  const csv = rows.map((r) => r.map((c: string | number | null) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="nu-wellness-stats.csv"',
    },
  });
}
