'use client';

import { Card, Button } from '@/components/ui';
import { UserCog, Plus, Mail, Phone, MoreVertical, Star, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/cn';

// Mock Data
const consultants = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  name: `ดร.สมศรี ที่ปรึกษา ${i + 1}`,
  role: 'นักจิตวิทยาคลินิก',
  email: 'som@example.com',
  active: i % 3 !== 0,
  cases: 120 + i * 5,
  rating: 4.8
}));

export default function AdminConsultantsPage() {
  return (
    // <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
    //    {/* Header */}
    //    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    //     <div>
    //       <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
    //         <span className="p-2 bg-purple-100 rounded-lg text-purple-600"><UserCog className="w-6 h-6" /></span>
    //         ผู้ให้คำปรึกษา
    //       </h1>
    //       <p className="text-gray-500 text-sm mt-1 ml-12">จัดการข้อมูลบุคลากรในระบบ</p>
    //     </div>
    //     <Button size="sm" className="bg-purple-600 text-white hover:bg-purple-700">
    //       <Plus className="w-4 h-4 mr-2" /> เพิ่มบุคลากร
    //     </Button>
    //   </div>

    //   {/* Grid Layout - Compact (Up to 5 columns) */}
    //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    //     {consultants.map((c) => (
    //       <Card key={c.id} className="group relative p-4 flex flex-col items-center text-center hover:shadow-md transition-all border-gray-200">
            
    //         {/* Action Menu (Hidden by default, shown on hover) */}
    //         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
    //            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
    //              <MoreVertical className="w-4 h-4" />
    //            </button>
    //         </div>

    //         {/* Avatar */}
    //         <div className="relative mb-3">
    //           <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-50 border-2 border-white shadow-sm flex items-center justify-center text-2xl">
    //             👩‍⚕️
    //           </div>
    //           <span className={cn(
    //             "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white",
    //             c.active ? "bg-green-500" : "bg-gray-300"
    //           )} />
    //         </div>

    //         {/* Info */}
    //         <h3 className="font-bold text-gray-800 text-sm mb-0.5 line-clamp-1">{c.name}</h3>
    //         <p className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mb-3 font-medium">
    //           {c.role}
    //         </p>

    //         {/* Stats Compact */}
    //         <div className="grid grid-cols-2 w-full gap-2 mb-3">
    //           <div className="bg-gray-50 rounded p-1.5 flex flex-col items-center">
    //              <span className="text-[10px] text-gray-400 uppercase">เคสดูแล</span>
    //              <span className="text-xs font-bold text-gray-700">{c.cases}</span>
    //           </div>
    //           <div className="bg-gray-50 rounded p-1.5 flex flex-col items-center">
    //              <span className="text-[10px] text-gray-400 uppercase">คะแนน</span>
    //              <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
    //                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {c.rating}
    //              </span>
    //           </div>
    //         </div>

    //         {/* Contact Actions */}
    //         <div className="flex gap-2 w-full mt-auto pt-2 border-t border-gray-50">
    //            <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs text-gray-500 hover:text-purple-600 hover:bg-purple-50">
    //              <Mail className="w-3.5 h-3.5 mr-1.5" /> อีเมล
    //            </Button>
    //            <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs text-gray-500 hover:text-purple-600 hover:bg-purple-50">
    //              <CalendarDays className="w-3.5 h-3.5 mr-1.5" /> ตาราง
    //            </Button>
    //         </div>
    //       </Card>
    //     ))}

    //     {/* Add New Card Slot */}
    //     <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-gray-300 text-gray-400 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all min-h-[220px]">
    //        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2 group-hover:bg-purple-100 transition-colors">
    //           <Plus className="w-6 h-6" />
    //        </div>
    //        <span className="text-sm font-medium">เพิ่มบุคลากรใหม่</span>
    //     </button>
    //   </div>
    // </div>
    <></>
  );
}