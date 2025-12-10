// ==========================================
// 📌 Layout Component: PublicFooter (v2 – Modern Glass Footer)
// ==========================================

import { APP_CONFIG } from '@/lib/constants';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="relative mt-10">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-teal-500 to-cyan-500 opacity-95" />
      <div className="absolute inset-0 backdrop-blur-md" />

      <div className="relative max-w-7xl mx-auto px-4 py-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-8 text-white/90">
          
          {/* Logo + Description */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-lg mb-1">
              <span className="text-2xl">💚</span>
              {APP_CONFIG.name}
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              ระบบบริการให้คำปรึกษาสำหรับนิสิตมหาวิทยาลัยนเรศวร  
              ใช้งานง่าย ปลอดภัย และเป็นส่วนตัว
            </p>
            <p className="text-xs text-white/70 mt-2">
              © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex-1 text-center md:text-right space-y-2">
            <p className="font-semibold text-sm text-white/95">ติดต่อเรา</p>
            <p className="flex items-center justify-center md:justify-end gap-2 text-white/80 text-sm">
              <MapPin size={16} /> มหาวิทยาลัยนเรศวร
            </p>
            <p className="flex items-center justify-center md:justify-end gap-2 text-white/80 text-sm">
              <Phone size={16} /> 055-xxx-xxx
            </p>
            <p className="flex items-center justify-center md:justify-end gap-2 text-white/80 text-sm">
              <Mail size={16} /> support@wellness.nu.ac.th
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-6" />

        {/* Privacy */}
        <div className="text-center">
          <p className="inline-flex items-center gap-2 text-white/70 text-xs tracking-wide">
            <ShieldCheck size={14} className="text-white/80" />
            ข้อมูลของคุณได้รับการปกป้องตามนโยบายความเป็นส่วนตัวของมหาวิทยาลัย
          </p>
        </div>
      </div>
    </footer>
  );
}
