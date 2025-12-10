'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLine } from '@/contexts/LineContext';
import { useMyAppointments } from '@/features/booking/hooks/useMyAppointments';
import { useBooking } from '@/features/booking/hooks/useBooking';
import { MyAppointmentCard } from '@/components/booking';
import {
  Card,
  Button,
  LoadingSpinner,
  Modal,
  ModalFooter,
} from '@/components/ui';

import {
  ClipboardList,
  Clock3,
  UserRound,
  Inbox,
  CalendarPlus,
  History,
} from 'lucide-react';

const GUEST_PROFILE = { userId: 'guest_user_demo', displayName: 'Guest User' };

export default function MyAppointmentsPage() {
  const {
    profile: lineProfile,
    isLoggedIn: isLineLoggedIn,
    isLoading: isLineLoading,
    login,
  } = useLine();

  const [isGuestMode, setIsGuestMode] = useState(false);

  const profile = isGuestMode ? GUEST_PROFILE : lineProfile;
  const isLoggedIn = isLineLoggedIn || isGuestMode;

  const {
    activeBooking,
    pastBookings,
    isLoading,
    refetch,
  } = useMyAppointments(profile?.userId || null);

  const { cancelBooking, isLoading: isCancelling } = useBooking();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const handleCancelClick = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    await cancelBooking(bookingToCancel, cancelReason || undefined);
    setShowCancelModal(false);
    setBookingToCancel(null);
    refetch();
  };

  // LOADING
  if (isLineLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="xl" label="กำลังโหลดข้อมูล..." />
      </div>
    );
  }

  // NOT LOGIN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <Card className="max-w-md w-full text-center py-10 shadow-md rounded-2xl">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 text-primary-500" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-gray-500 mb-6">เพื่อดูตารางนัดของคุณ</p>

          <Button onClick={login} className="w-full mb-3 bg-[#06C755] hover:bg-[#05b34d]">
            เข้าสู่ระบบด้วย LINE
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsGuestMode(true)}
          >
            เข้าใช้งานทดสอบ (Guest)
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16 pt-10">
      {/* -------------------- TITLE -------------------- */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-primary-600" />
          ตารางนัดของฉัน
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-8">
        {/* -------------------- GRID SECTION -------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Active Booking */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-emerald-600" />
                  การจองที่กำลังดำเนินการ
                </h2>

                <Link href="/booking">
                  <Button variant="outline" size="sm">
                    <CalendarPlus className="w-4 h-4 mr-1" />
                    จองคิวใหม่
                  </Button>
                </Link>
              </div>

              {activeBooking ? (
                <MyAppointmentCard
                  booking={activeBooking}
                  onCancel={() => handleCancelClick(activeBooking.id)}
                />
              ) : (
                <div className="py-12 text-center border border-dashed rounded-xl bg-white">
                  <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="font-semibold text-gray-700">ไม่มีการจองที่กำลังดำเนินการ</p>
                  <p className="text-xs text-gray-500 mt-1">คุณยังไม่มีคิวในตอนนี้</p>

                  <Link href="/booking">
                    <Button className="mt-4">จองคิวใหม่</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT: SUMMARY */}
          <div>
            <Card className="rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-primary-500" />
                สรุปการใช้งาน
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>จำนวนการจองทั้งหมด</span>
                  <span className="font-semibold text-gray-800">
                    {pastBookings.length + (activeBooking ? 1 : 0)} รายการ
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ประวัติที่เสร็จสิ้นแล้ว</span>
                  <span className="font-semibold text-emerald-600">
                    {pastBookings.length} รายการ
                  </span>
                </div>
              </div>

              {profile?.displayName && (
                <div className="mt-4 flex items-center gap-2 pt-3 border-t text-xs text-gray-500">
                  <UserRound className="w-4 h-4" />
                  {profile.displayName}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* -------------------- HISTORY SECTION -------------------- */}
        <Card className="rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <ClipboardList className="w-4 h-4 text-primary-500" />
            ประวัติการจอง ({pastBookings.length})
          </h2>

          {pastBookings.length > 0 ? (
            <div className="space-y-3">
              {pastBookings.map((booking) => (
                <MyAppointmentCard key={booking.id} booking={booking} isCompact />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm py-6 bg-gray-50 border border-dashed rounded-xl">
              ยังไม่มีประวัติการจอง
            </div>
          )}
        </Card>
      </div>

      {/* -------------------- CANCEL MODAL -------------------- */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="ยืนยันการยกเลิก"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">คุณต้องการยกเลิกการจองนี้หรือไม่?</p>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="เหตุผล (ไม่บังคับ)"
            className="w-full p-3 border rounded-xl text-sm"
            rows={3}
          />
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
            ยกเลิก
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            ยืนยัน
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
