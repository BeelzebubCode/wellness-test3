// ไฟล์: prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding default working hours...')

  // กำหนดเวลาทำการ:
  // จันทร์ - ศุกร์ : 08:00 - 20:00
  // เสาร์ - อาทิตย์ : 08:00 - 16:00
  // dayOfWeek: 0=อาทิตย์, 1=จันทร์, ..., 6=เสาร์
  const workingHours = [
    { day: 1, open: '08:00', close: '20:00' }, // จันทร์
    { day: 2, open: '08:00', close: '20:00' }, // อังคาร
    { day: 3, open: '08:00', close: '20:00' }, // พุธ
    { day: 4, open: '08:00', close: '20:00' }, // พฤหัส
    { day: 5, open: '08:00', close: '20:00' }, // ศุกร์
    { day: 6, open: '08:00', close: '16:00' }, // เสาร์
    { day: 0, open: '08:00', close: '16:00' }, // อาทิตย์
  ]

  for (const wh of workingHours) {
    await prisma.workingHours.upsert({
      where: { dayOfWeek: wh.day },
      // update: กรณีมีข้อมูลอยู่แล้ว ให้อัปเดตเวลาทำการใหม่ทับลงไป
      update: {
        openTime: wh.open,
        closeTime: wh.close,
        isActive: true,
      },
      // create: กรณีไม่มีข้อมูล ให้สร้างใหม่
      create: {
        dayOfWeek: wh.day,
        openTime: wh.open,
        closeTime: wh.close,
        slotDuration: 60, // กำหนดค่า default 60 นาทีต่อสล็อต
        maxBookings: 1,
        isActive: true,
      },
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })