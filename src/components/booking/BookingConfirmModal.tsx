// ==========================================
// 📌 Booking Component: BookingConfirmModal (Scrollable)
// ==========================================

'use client';

import { Modal } from '@/components/ui';
import { BookingForm, type BookingFormData } from './BookingForm';
import { formatThaiDate } from '@/lib/date';
import type { TimeSlot } from '@/types';
import { CalendarClock, Clock3, Lock } from 'lucide-react';

export interface BookingConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimeSlot | null;
  selectedDate: Date;
  onConfirm: (data: BookingFormData) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function BookingConfirmModal({
  isOpen,
  onClose,
  slot,
  selectedDate,
  onConfirm,
  isLoading = false,
  error,
}: BookingConfirmModalProps) {
  if (!slot) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ยืนยันการจองคิวให้คำปรึกษา"
      size="lg"
    >
      {/* ✅ ทำส่วนเนื้อหาทั้งหมดให้ scroll ได้ */}
      <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-4">
        {/* Booking Summary */}
        <div className="p-4 bg-gradient-to-r from-primary-50 to-cyan-50 rounded-xl border border-primary-100">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-primary-800">
                  รายละเอียดการจอง
                </h4>
                <p className="text-xs text-primary-600">
                  กรุณาตรวจสอบวันและเวลานัดหมายให้ถูกต้องก่อนยืนยัน
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">วันที่</span>
                  <span className="font-semibold text-gray-800">
                    {formatThaiDate(selectedDate, { includeDay: true })}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">เวลา</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
                    <Clock3 className="h-4 w-4 text-primary-500" />
                    {slot.startTime} - {slot.endTime} น.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <BookingForm onSubmit={onConfirm} isLoading={isLoading} error={error} />

        {/* Privacy Notice */}
        <p className="pb-1 text-xs text-gray-400 flex items-center justify-center gap-1">
          <Lock className="h-3 w-3" />
          ข้อมูลของคุณจะถูกเก็บรักษาเป็นความลับตามนโยบายความเป็นส่วนตัว
        </p>
      </div>
    </Modal>
  );
}
