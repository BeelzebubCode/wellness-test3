import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    if (!dateStr) {
      return new NextResponse("Date parameter is required", { status: 400 });
    }

    // แปลงวันที่เพื่อค้นหา
    const queryDate = new Date(dateStr);
    const startDate = new Date(`${dateStr}T00:00:00`);
    const endDate = new Date(`${dateStr}T23:59:59`);

    const dayOverride = await prisma.dayOverride.findFirst({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return NextResponse.json({ dayOverride });
  } catch (error) {
    console.error("[OVERRIDES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// 2. POST: บันทึก/ยกเลิก การปิดร้าน (สำหรับปุ่ม Toggle)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, isClosed, reason } = body;

    if (!date) {
      return new NextResponse("Date is required", { status: 400 });
    }

    // เตรียมวันที่สำหรับบันทึก (ใช้เวลาเที่ยงคืน UTC เพื่อให้เป็นมาตรฐาน)
    const targetDate = new Date(`${date}T00:00:00Z`);

    // ใช้ upsert: ถ้ามีอยู่แล้วให้อัปเดต ถ้าไม่มีให้สร้างใหม่
    const override = await prisma.dayOverride.upsert({
      where: {
        date: targetDate, 
      },
      update: {
        isClosed,
        reason,
      },
      create: {
        date: targetDate,
        isClosed,
        reason,
      },
    });

    return NextResponse.json(override);
  } catch (error) {
    console.error("[OVERRIDES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}