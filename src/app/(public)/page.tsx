'use client';

import Link from 'next/link';
import {
  Heart,
  Calendar,
  ClipboardList,
  Lock,
  Users,
  Smartphone,
  Clock,
  CalendarDays,
  User,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-cyan-50">

      {/* ------------------------------------------------------- */}
      {/* 🟩 Hero Section */}
      {/* ------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        {/* Floating Blobs */}
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary-200/40 rounded-full blur-3xl" />
          <div className="absolute top-48 -left-20 w-60 h-60 bg-cyan-200/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32 text-center">
          {/* Logo Badge */}
          <div className="w-24 h-24 bg-white/40 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary-500/20">
            <Heart className="w-12 h-12 text-primary-600 drop-shadow-sm" />
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            NU Wellness Center
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mt-4">
            ระบบจองคิวให้คำปรึกษาสุขภาพจิต
          </p>

          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            ดูแลสุขภาพจิตของคุณอย่างใกล้ชิด ด้วยทีมผู้เชี่ยวชาญที่พร้อมรับฟังเสมอ
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <Calendar className="w-5 h-5" />
              จองคิวให้คำปรึกษา
            </Link>

            <Link
              href="/booking/my-appointments"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-gray-700 font-semibold border border-gray-200 shadow-md hover:bg-primary-50 transition-all"
            >
              <ClipboardList className="w-5 h-5" />
              ตารางนัดของฉัน
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- */}
      {/* 🟦 Features (ซ่อนบน Mobile) */}
      {/* ------------------------------------------------------- */}
      <section className="hidden md:block py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">ทำไมต้องเลือกเรา?</h2>
            <p className="text-gray-500 mt-2">บริการเพื่อสุขภาพจิตที่ดีที่สุดสำหรับนิสิต</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lock className="w-7 h-7 text-primary-500" />,
                title: 'ความเป็นส่วนตัว',
                desc: 'ข้อมูลของคุณได้รับการปกป้องอย่างเข้มงวด',
              },
              {
                icon: <Users className="w-7 h-7 text-primary-500" />,
                title: 'ผู้เชี่ยวชาญ',
                desc: 'ดูแลโดยนักจิตวิทยาที่มีประสบการณ์',
              },
              {
                icon: <Smartphone className="w-7 h-7 text-primary-500" />,
                title: 'ใช้งานง่าย',
                desc: 'จองคิวสะดวกรวดเร็วผ่านระบบออนไลน์',
              },
              {
                icon: <Clock className="w-7 h-7 text-primary-500" />,
                title: 'ยืดหยุ่น',
                desc: 'เลือกเวลาได้ตามความสะดวกของคุณ',
              },
              {
                icon: <Heart className="w-7 h-7 text-primary-500" />,
                title: 'พร้อมรับฟัง',
                desc: 'ดูแลทุกปัญหา ไม่ว่าจะเรื่องเรียนหรือส่วนตัว',
              },
              {
                icon: <Users className="w-7 h-7 text-primary-500" />,
                title: 'บริการฟรี',
                desc: 'สำหรับนิสิตและบุคลากรมหาวิทยาลัย',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- */}
      {/* 🟪 How it Works (ซ่อนบน Mobile) */}
      {/* ------------------------------------------------------- */}
      {/* How it Works – New Style */}
      {/* วิธีใช้งาน - โทนเดียวกับ ทำไมต้องเลือกเรา */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">

          {/* Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">วิธีใช้งาน</h2>
            <p className="text-gray-500">ง่าย ๆ เพียงไม่กี่ขั้นตอน</p>
          </div>

          {/* Row - 4 items */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            {[
              {
                icon: <User className="w-7 h-7 text-primary-500" />,
                title: "เข้าสู่ระบบ",
                desc: "เข้าสู่ระบบด้วย LINE Account",
                step: 1
              },
              {
                icon: <CalendarDays className="w-7 h-7 text-primary-500" />,
                title: "เลือกวันเวลา",
                desc: "เลือกเวลาที่คุณสะดวก",
                step: 2
              },
              {
                icon: <ClipboardList className="w-7 h-7 text-primary-500" />,
                title: "กรอกข้อมูล",
                desc: "ระบุรายละเอียดที่ต้องการปรึกษา",
                step: 3
              },
              {
                icon: <Heart className="w-7 h-7 text-primary-500" />,
                title: "ยืนยันการจอง",
                desc: "รับการแจ้งเตือนผ่าน LINE",
                step: 4
              }
            ].map((item, index) => (
              <div
                key={index}
                className="relative bg-gray-50 p-8 rounded-3xl hover:shadow-lg transition-all text-center"
              >
                {/* Step Number Bubble */}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold shadow-md">
                  {item.step}
                </div>

                {/* Icon Box */}
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>



      {/* ------------------------------------------------------- */}
      {/* 🟩 Simple Footer */}
      {/* ------------------------------------------------------- */}
      {/* <footer className="hidden md:block bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-primary-400" />
            <span className="font-semibold">NU Wellness Center</span>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} NU Wellness Center
          </p>
        </div>
      </footer> */}
    </div>
  );
}
