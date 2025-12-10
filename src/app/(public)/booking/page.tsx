// ==========================================
// 📌 Booking Page (Mobile-first + Lucide Icons)
// ==========================================

'use client';

import { useMemo, useState } from 'react';
import { useLine } from '@/contexts/LineContext';
import { useTimeSlots } from '@/features/booking/hooks/useTimeSlots';
import { useMyAppointments } from '@/features/booking/hooks/useMyAppointments';
import { useBooking } from '@/features/booking/hooks/useBooking';
import {
  BookingCalendar,
  TimeSlotGrid,
  BookingConfirmModal,
  BookingSuccessModal,
} from '@/components/booking';
import { Button, Card, LoadingSpinner } from '@/components/ui';
import { addDays, toISODateString } from '@/lib/date';
import { PROBLEM_TYPES } from '@/lib/constants';
import type { TimeSlot } from '@/types';
import type { BookingFormData } from '@/components/booking/BookingForm';
import Link from "next/link";

// ✅ icons จาก lucide-react
import {
  CalendarClock,
  HeartPulse,
  Info,
  MessageCircle,
  RotateCcw,
  UserRound,
} from 'lucide-react';
import { ImageCard } from '@/components/ui/ImageCard';

const GUEST_PROFILE = {
  userId: 'guest_user_demo',
  displayName: 'Guest User',
  pictureUrl: '',
};

export default function BookingPage() {
  const {
    profile: lineProfile,
    isLoggedIn: isLineLoggedIn,
    login,
    isLoading: isLineLoading,
  } = useLine();

  const [isGuestMode, setIsGuestMode] = useState(false);

  const profile = useMemo(
    () => (isGuestMode ? GUEST_PROFILE : lineProfile),
    [isGuestMode, lineProfile],
  );
  const isLoggedIn = isLineLoggedIn || isGuestMode;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const {
    slots,
    isLoading: isSlotsLoading,
    refetch: refetchSlots,
  } = useTimeSlots(selectedDate);

  const {
    hasActiveBooking,
    refetch: refetchAppointments,
  } = useMyAppointments(profile?.userId || null);

  const {
    createBooking,
    isLoading: isBookingLoading,
    error: bookingError,
    clearError,
  } = useBooking();

  const handlePreviousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    if (hasActiveBooking) {
      alert('คุณมีรายการจองที่ยังไม่เสร็จสิ้น กรุณายกเลิกรายการเดิมก่อน');
      return;
    }
    if (!slot.isAvailable) return;

    setSelectedSlot(slot);
    clearError();
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBooking = async (formData: BookingFormData) => {
    if (!selectedSlot || !profile?.userId) return;

    try {
      const problemLabel =
        formData.problemType === 'other'
          ? formData.problemTypeOther
          : PROBLEM_TYPES.find((p) => p.id === formData.problemType)?.label ||
          formData.problemType;

      await createBooking({
        lineUserId: profile.userId,
        userName: profile.displayName,
        date: toISODateString(selectedDate),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        problemType: problemLabel,
        problemDescription: formData.problemDescription,
      });

      setIsConfirmModalOpen(false);
      setSelectedSlot(null);
      setIsSuccessModalOpen(true);
      refetchSlots();
      refetchAppointments();
    } catch {
      // error ถูกจัดการใน hook แล้ว
    }
  };

  // ตัดเวลาออกให้เหลือแค่วันที่ (กันปัญหาวันนี้กดไม่ได้)
  const startOfDay = (d: Date) => {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
  };

  // -----------------------------
  // 🔐 Login Screen
  // -----------------------------
  if (!isLoggedIn) {
    if (isLineLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <LoadingSpinner size="xl" label="กำลังเชื่อมต่อ LINE..." />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-emerald-50 to-cyan-50 px-4">
        <Card
          className="w-full max-w-md text-center shadow-xl rounded-2xl border border-white/60 bg-white/90 backdrop-blur"
          padding="lg"
          variant="elevated"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <HeartPulse className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            NU Wellness Center
          </h1>
          <p className="text-gray-500 mb-6 text-sm">
            ระบบจองคิวให้คำปรึกษาสุขภาพจิตสำหรับนิสิต
          </p>

          <Button
            onClick={login}
            size="lg"
            className="w-full bg-[#06C755] hover:bg-[#05b34d] text-white mb-3 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>เข้าสู่ระบบด้วย LINE</span>
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400">หรือ</span>
            </div>
          </div>

          <Button
            onClick={() => setIsGuestMode(true)}
            variant="outline"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
          >
            <UserRound className="w-4 h-4" />
            <span>เข้าใช้งานทดสอบ (Guest)</span>
          </Button>

          <p className="mt-3 text-[11px] text-gray-400">
            โหมด Guest ใช้สำหรับทดลองระบบเท่านั้น ข้อมูลจะไม่ถูกบันทึกจริง
          </p>
        </Card>
      </div>
    );
  }

  // -----------------------------
  // 📱 Main Booking UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Content */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 pt-4 pb-24 space-y-4">
        {/* Greeting / Info card (mobile only) */}
        <section className="block sm:hidden">
          <Card className="border-primary-100 bg-white/90 rounded-2xl shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <UserRound className="w-5 h-5 text-primary-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">
                  สวัสดี
                  {profile?.displayName ? `, ${profile.displayName}` : ''}
                </p>
                <p className="text-xs text-gray-600">
                  เลือกวันที่จากปฏิทิน แล้วเลือกช่วงเวลาที่ต้องการจอง ระบบจะบันทึกเป็น
                  &quot;รอการยืนยัน&quot; จากเจ้าหน้าที่
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Rule / Remark card */}
        <section>
          <Card className="rounded-2xl shadow-sm border border-primary-100 bg-primary-50/80 px-5 py-4">
            <div className="flex items-start gap-3">

              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5 flex items-center justify-center w-9 h-9 rounded-xl bg-primary-100">
                <Info className="w-5 h-5 text-primary-700" />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <p className="text-sm font-semibold text-primary-900">
                  เงื่อนไขการจองคิว
                </p>

                <ul className="text-[15px] leading-relaxed text-primary-800 space-y-1.5 list-disc pl-5">
                  <li>สามารถจองล่วงหน้าได้สูงสุด <span className="font-semibold">7 วัน</span></li>
                  <li>เปิดให้บริการ <span className="font-semibold">จันทร์–ศุกร์ 08:00–20:00</span></li>
                  <li>เสาร์–อาทิตย์ <span className="font-semibold">08:00–16:00</span> (เว้นวันหยุดราชการ)</li>
                  <li className="text-primary-900 font-medium">
                    หากมีคิวที่ยังไม่เสร็จสิ้น จะไม่สามารถจองคิวเพิ่มได้
                  </li>
                </ul>
              </div>

            </div>
          </Card>
        </section>


        {/* Calendar + Slots */}
        <section className="grid gap-4 md:grid-cols-5 lg:gap-6">
          {/* Calendar column (2/5) */}
          <div className="md:col-span-2 space-y-3">
            <Card className="rounded-2xl shadow-sm bg-white">
              {/* header ของ calendar card + ปุ่ม “วันนี้” */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-semibold text-gray-800">
                    ปฏิทินการจอง
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToday}
                  className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-[11px] font-medium text-primary-700 hover:bg-primary-100 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  วันนี้
                </button>
              </div>

              <BookingCalendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                currentMonth={currentMonth}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
                minDate={startOfDay(new Date())}
                maxDate={startOfDay(addDays(new Date(), 7))}
              />
            </Card>

            <Card className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="space-y-3 text-sm text-gray-700">

                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800">สถานะการจองของคุณ</p>
                  <div className="h-[1px] flex-1 bg-gray-200"></div>
                </div>

                {hasActiveBooking ? (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-amber-600"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="text-[13px] leading-relaxed text-amber-700">
                      <p>คุณมีคิวที่ยังไม่เสร็จสิ้นอยู่</p>
                      <p>หากต้องการจองใหม่ กรุณายกเลิกคิวเดิมก่อน</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-emerald-600"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="text-[13px] leading-relaxed text-emerald-700">
                      <p>ขณะนี้คุณยังไม่มีคิวที่กำลังดำเนินการอยู่</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <Card>
              <Link href="https://www.facebook.com/Happyhome2563">
                <ImageCard
                  src="/images/profiles.jpg"
                  height={180}
                />
              </Link>
            </Card>
          </div>


          {/* Time slots column (3/5) */}
          <div className="md:col-span-3 space-y-4">

            {/* Heading Section */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 px-5 py-2 bg-white/60 rounded-xl border border-gray-100"
            >

              {/* Main Title */}
              <p className="text-lg font-semibold text-gray-900 tracking-tight text-center sm:text-left">
                ช่วงเวลาที่ว่างในวันที่เลือก
              </p>

              {/* Subtitle */}
              <p className="text-sm text-gray-500 text-center sm:text-right">
                เลือกวันที่จากปฏิทินด้านซ้าย
              </p>
            </div>




            <Card className="rounded-2xl shadow-sm bg-white">
              <TimeSlotGrid
                selectedDate={selectedDate}
                slots={slots}
                onSelectSlot={handleSelectSlot}
                isLoading={isSlotsLoading}
                hasActiveBooking={hasActiveBooking}
              />
            </Card>

            {/* mobile: status */}
            <Card className="md:hidden bg-white/90 rounded-2xl shadow-sm">
              <div className="space-y-1 text-xs text-gray-700">
                <p className="font-semibold text-gray-800 mb-1">
                  สถานะการจองของคุณ
                </p>
                {hasActiveBooking ? (
                  <p>
                    • คุณมีคิวที่ยังไม่เสร็จสิ้นอยู่
                    <br />
                    • หากต้องการจองใหม่ กรุณายกเลิกคิวเดิมก่อน
                  </p>
                ) : (
                  <p>• ขณะนี้คุณยังไม่มีคิวที่กำลังดำเนินการอยู่</p>
                )}
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Modals */}
      <BookingConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        slot={selectedSlot}
        selectedDate={selectedDate}
        onConfirm={handleConfirmBooking}
        isLoading={isBookingLoading}
        error={bookingError}
      />

      <BookingSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onViewAppointments={() => {
          setIsSuccessModalOpen(false);
          window.location.href = '/booking/my-appointments';
        }}
      />
    </div>
  );
}
