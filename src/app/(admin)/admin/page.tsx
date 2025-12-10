'use client';

import { Card, Button } from '@/components/ui';
import { 
  Users, 
  Calendar, 
  Clock, 
  Activity, 
  ArrowUpRight, 
  MoreHorizontal, 
  CalendarDays,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/cn';

// Mock Data
const todayAppointments = [
  { time: '09:00', user: 'คุณสมชาย', type: 'ความเครียด', consultant: 'ดร.สมศรี', status: 'pending' },
  { time: '10:00', user: 'คุณวิภา', type: 'ซึมเศร้า', consultant: 'พญ.ใจใส', status: 'confirmed' },
  { time: '13:00', user: 'คุณนพดล', type: 'ครอบครัว', consultant: 'ดร.สมศรี', status: 'completed' },
  { time: '14:00', user: 'Guest User', type: 'การเรียน', consultant: '-', status: 'cancelled' },
];

export default function AdminDashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Activity className="w-6 h-6" /></span>
            แดชบอร์ดภาพรวม
          </h1>
          <p className="text-gray-500 text-sm mt-1 ml-12">สวัสดี, ผู้ดูแลระบบ (Admin Demo)</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-700">พุธ, 10 ธันวาคม 2568</p>
          <p className="text-xs text-gray-400">อัปเดตล่าสุด: 12:00 น.</p>
        </div>
      </div>

      {/* Stats Grid (Compact) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'นัดหมายวันนี้', value: '12', sub: '+2 จากเมื่อวาน', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'รอดำเนินการ', value: '5', sub: 'ต้องการการจัดการ', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'ผู้ใช้งานใหม่', value: '28', sub: '+15% สัปดาห์นี้', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'ผู้ให้คำปรึกษา', value: '8', sub: 'ออนไลน์ 6 ท่าน', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <Card key={i} className="p-4 flex flex-col justify-between border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className={cn("p-2 rounded-lg", stat.bg, stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={cn("flex items-center text-xs font-medium bg-gray-50 px-1.5 py-0.5 rounded", stat.color === 'text-green-600' ? 'text-green-600' : 'text-gray-500')}>
                {stat.sub}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (2/3): Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                <CalendarDays className="w-4 h-4 text-indigo-500" />
                ตารางนัดหมายวันนี้
              </h3>
              <Button variant="ghost" size="sm" className="text-xs h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                ดูทั้งหมด <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            
            <div className="divide-y divide-gray-100">
              {todayAppointments.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center">
                      <div className="text-sm font-bold text-gray-800">{item.time}</div>
                    </div>
                    <div className="w-1 h-8 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{item.user}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="bg-gray-100 px-1.5 rounded text-gray-600">{item.type}</span>
                        <span>• {item.consultant}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.status === 'confirmed' && <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded border border-green-100">ยืนยันแล้ว</span>}
                    {item.status === 'pending' && <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded border border-amber-100">รอจัดสรร</span>}
                    {item.status === 'completed' && <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200">เสร็จสิ้น</span>}
                    {item.status === 'cancelled' && <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100">ยกเลิก</span>}
                    
                    <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (1/3): Quick Actions & Notifications */}
        <div className="space-y-4">
          {/* Notifications */}
          <Card className="p-4 border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" /> การแจ้งเตือนล่าสุด
            </h3>
            <div className="space-y-3">
              {[
                { text: 'มีคำขอจองคิวใหม่เข้ามา 2 รายการ', time: '10 นาทีที่แล้ว', type: 'alert' },
                { text: 'คุณหมอสมศรี เข้าสู่ระบบแล้ว', time: '1 ชั่วโมงที่แล้ว', type: 'info' },
                { text: 'ระบบสำรองข้อมูลเสร็จสิ้น', time: '2 ชั่วโมงที่แล้ว', type: 'success' },
              ].map((notif, i) => (
                <div key={i} className="flex gap-3 items-start">
                   <div className={cn(
                     "w-2 h-2 mt-1.5 rounded-full shrink-0",
                     notif.type === 'alert' ? 'bg-amber-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                   )} />
                   <div>
                     <p className="text-xs text-gray-700 leading-snug">{notif.text}</p>
                     <p className="text-[10px] text-gray-400 mt-0.5">{notif.time}</p>
                   </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Status */}
          <Card className="p-4 border-gray-200 shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-sm opacity-90">สถานะระบบ</h3>
                <p className="text-xs opacity-75">พร้อมใช้งาน 100%</p>
              </div>
              <CheckCircle2 className="w-5 h-5 opacity-75" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
               <div className="bg-white/10 rounded p-2">
                 <div className="text-lg font-bold">45ms</div>
                 <div className="text-[10px] opacity-75">Latency</div>
               </div>
               <div className="bg-white/10 rounded p-2">
                 <div className="text-lg font-bold">Stable</div>
                 <div className="text-[10px] opacity-75">Database</div>
               </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}