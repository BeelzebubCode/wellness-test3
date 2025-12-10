// ==========================================
// 📌 Booking Component: TimeSlotGrid (desktop friendly + mobile list)
// ==========================================

'use client';

import type { ReactNode } from 'react';
import { formatThaiDate } from '@/lib/date';
import { TimeSlotCard } from './TimeSlotCard';
import { LoadingSpinner } from '@/components/ui';
import type { TimeSlot } from '@/types';
import {
  Sunrise,
  Sun,
  Moon,
  CheckCircle2,
  CalendarX2,
  AlertTriangle,
} from 'lucide-react';

export interface TimeSlotGridProps {
  selectedDate: Date;
  slots: TimeSlot[];
  onSelectSlot: (slot: TimeSlot) => void;
  isLoading?: boolean;
  hasActiveBooking?: boolean;
}

export function TimeSlotGrid({
  selectedDate,
  slots,
  onSelectSlot,
  isLoading = false,
  hasActiveBooking = false,
}: TimeSlotGridProps) {
  const groupedSlots = {
    morning: slots.filter((s) => parseInt(s.startTime.split(':')[0]) < 12),
    afternoon: slots.filter((s) => {
      const hour = parseInt(s.startTime.split(':')[0]);
      return hour >= 12 && hour < 17;
    }),
    evening: slots.filter((s) => parseInt(s.startTime.split(':')[0]) >= 17),
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-10 flex items-center justify-center">
        <LoadingSpinner size="lg" label="กำลังโหลดช่วงเวลา..." />
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 mx-auto">
          <CalendarX2 className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          ไม่มีช่วงเวลาว่าง
        </h3>
        <p className="text-gray-500 text-sm">
          วันที่ {formatThaiDate(selectedDate)} ไม่มีช่วงเวลาเปิดจอง
          <br />
          กรุณาเลือกวันอื่น
        </p>
      </div>
    );
  }

  const totalAvailable = slots.filter((s) => s.isAvailable).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 md:px-6 md:py-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              {formatThaiDate(selectedDate, { includeDay: true })}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              ช่วงเวลาว่าง {totalAvailable} รอบ
            </p>
          </div>

          {hasActiveBooking && (
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] md:text-xs font-medium self-start md:self-auto">
              <AlertTriangle className="w-3 h-3" />
              <span>คุณมีคิวค้างอยู่</span>
            </div>
          )}
        </div>
      </div>

      {/* Slot Sections */}
      <div className="px-5 py-5 md:px-6 md:py-6 space-y-6 md:space-y-7">
        {groupedSlots.morning.length > 0 && (
          <TimeSlotSection
            icon={<Sunrise className="w-4 h-4 text-amber-500" />}
            title="ช่วงเช้า"
            subtitle="08:00 - 12:00"
            slots={groupedSlots.morning}
            onSelectSlot={onSelectSlot}
            disabled={hasActiveBooking}
          />
        )}

        {groupedSlots.afternoon.length > 0 && (
          <TimeSlotSection
            icon={<Sun className="w-4 h-4 text-orange-500" />}
            title="ช่วงบ่าย"
            subtitle="12:00 - 17:00"
            slots={groupedSlots.afternoon}
            onSelectSlot={onSelectSlot}
            disabled={hasActiveBooking}
          />
        )}

        {groupedSlots.evening.length > 0 && (
          <TimeSlotSection
            icon={<Moon className="w-4 h-4 text-indigo-500" />}
            title="ช่วงเย็น"
            subtitle="17:00 - 20:00"
            slots={groupedSlots.evening}
            onSelectSlot={onSelectSlot}
            disabled={hasActiveBooking}
          />
        )}
      </div>
    </div>
  );
}

interface TimeSlotSectionProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  slots: TimeSlot[];
  onSelectSlot: (slot: TimeSlot) => void;
  disabled?: boolean;
}

function TimeSlotSection({
  icon,
  title,
  subtitle,
  slots,
  onSelectSlot,
  disabled,
}: TimeSlotSectionProps) {
  const availableCount = slots.filter((s) => s.isAvailable).length;

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
        {/* Left: icon + title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-gray-800">
              {title}
            </h3>
            <p className="text-[11px] md:text-xs text-gray-400">{subtitle}</p>
          </div>
        </div>

        {/* Right: available count badge */}
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-[11px] md:text-xs font-medium self-start md:self-auto">
          <CheckCircle2 className="w-3 h-3" />
          {availableCount} ว่าง
        </span>
      </div>

      {/* ตารางช่วงเวลา */}
      {/* 📱 mobile: 1 คอลัมน์ = list ยาว
          💻 md ขึ้นไป: 2–3 คอลัมน์ตามเดิม */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-4">
        {slots.map((slot) => (
          <TimeSlotCard
            key={`${slot.startTime}-${slot.endTime}`}
            slot={slot}
            onSelect={() => onSelectSlot(slot)}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  );
}
