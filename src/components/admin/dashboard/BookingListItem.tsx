'use client';

import { useState } from 'react';
import { Card, Button, Modal, ModalFooter } from '@/components/ui';
import { formatThaiDate } from '@/lib/date';
import { cn } from '@/lib/cn';
import type { Booking, Consultant } from '@/types';
import {
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  User,
  CalendarDays,
  FileText,
  Stethoscope,
} from 'lucide-react';

export interface BookingListItemProps {
  booking: Booking;
  showDate?: boolean;
  onRefresh?: () => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'CONFIRMED':
      return {
        label: 'รอมอบหมาย',
        icon: <Clock className="w-5 h-5" />,
        color: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    case 'ASSIGNED':
      return {
        label: 'กำลังดำเนินการ',
        icon: <UserCheck className="w-5 h-5" />,
        color: 'bg-purple-50 text-purple-700 border-purple-200',
      };
    case 'COMPLETED':
      return {
        label: 'เสร็จสิ้น',
        icon: <CheckCircle2 className="w-5 h-5" />,
        color: 'bg-green-50 text-green-700 border-green-200',
      };
    case 'CANCELLED':
      return {
        label: 'ยกเลิก',
        icon: <XCircle className="w-5 h-5" />,
        color: 'bg-gray-50 text-gray-600 border-gray-200',
      };
    default:
      return {
        label: status,
        icon: <Clock className="w-5 h-5" />,
        color: 'bg-gray-100',
      };
  }
};

export function BookingListItem({
  booking,
  showDate = false,
  onRefresh,
}: BookingListItemProps) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [selectedConsultantId, setSelectedConsultantId] = useState('');
  const [consultantNote, setConsultantNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const statusConfig = getStatusConfig(booking.status);

  const loadConsultants = async () => {
    try {
      const res = await fetch('/api/v1/consultants');
      const data = await res.json();
      setConsultants(data.consultants || []);
    } catch (error) {
      console.error('Error loading consultants:', error);
    }
  };

  const handleOpenAssignModal = () => {
    loadConsultants();
    setSelectedConsultantId('');
    setShowAssignModal(true);
  };

  const handleAssign = async () => {
    if (!selectedConsultantId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assign', consultantId: selectedConsultantId }),
      });
      if (res.ok) {
        setShowAssignModal(false);
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error assigning:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete', consultantNote }),
      });
      if (res.ok) {
        setShowCompleteModal(false);
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error completing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        padding="none"
        className="overflow-hidden mb-5 border border-gray-200 shadow-sm hover:shadow-md transition-all"
      >
        {/* Status bar */}
        <div
          className={cn(
            'px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3',
            statusConfig.color,
          )}
        >
          <div className="flex items-center gap-2 font-bold text-lg">
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
          </div>
          {showDate && (
            <div className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-lg text-base font-medium">
              <CalendarDays className="w-4 h-4" />
              {formatThaiDate(new Date(booking.date), { short: true })}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-200 shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div>
                {/* 👇 ใช้ userName แทน booking.user */}
                <p className="text-xl font-bold text-gray-900 mb-1">
                  {booking.userName || 'ไม่ระบุชื่อ'}
                </p>
                <div className="flex items-center gap-2 text-gray-600 text-lg">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <span>
                    {booking.startTime} - {booking.endTime} น.
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
              {booking.status === 'CONFIRMED' && (
                <Button
                  size="md"
                  variant="secondary"
                  onClick={handleOpenAssignModal}
                  className="w-full md:w-auto text-lg"
                  leftIcon={<UserCheck className="w-5 h-5" />}
                >
                  มอบหมายงาน
                </Button>
              )}
              {booking.status === 'ASSIGNED' && (
                <Button
                  size="md"
                  variant="success"
                  onClick={() => setShowCompleteModal(true)}
                  className="w-full md:w-auto text-lg"
                  leftIcon={<CheckCircle2 className="w-5 h-5" />}
                >
                  บันทึกผล
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 grid md:grid-cols-2 gap-6">
            {/* Problem type */}
            {booking.problemType && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    หัวข้อการปรึกษา
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {booking.problemType}
                  </p>
                </div>
              </div>
            )}

            {/* Consultant info */}
            {booking.consultant && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    ผู้ให้คำปรึกษา
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {booking.consultant.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Consultant note */}
          {booking.consultantNote && (
            <div className="mt-6 bg-green-50/50 border border-green-100 rounded-xl p-5">
              <p className="text-green-800 font-bold text-lg mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                บันทึกผลการปรึกษา
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                {booking.consultantNote}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Assign Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="มอบหมายผู้ให้คำปรึกษา"
        size="md"
      >
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">ผู้จอง</p>
          <p className="font-bold text-lg text-gray-800">
            {booking.userName || 'ไม่ระบุชื่อ'}
          </p>
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <span className="text-sm">
              📅 {formatThaiDate(new Date(booking.date))}
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-sm">
              🕒 {booking.startTime} - {booking.endTime}
            </span>
          </div>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          <p className="text-base font-semibold text-gray-700 sticky top-0 bg-white pb-2">
            เลือกผู้ให้คำปรึกษา
          </p>
          {consultants
            .filter((c) => c.isActive)
            .map((consultant) => (
              <label
                key={consultant.id}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all',
                  selectedConsultantId === consultant.id
                    ? 'border-primary-500 bg-primary-50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50',
                )}
              >
                <input
                  type="radio"
                  name="consultant"
                  value={consultant.id}
                  checked={selectedConsultantId === consultant.id}
                  onChange={(e) => setSelectedConsultantId(e.target.value)}
                  className="sr-only"
                />
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-gray-800 block text-lg">
                    {consultant.name}
                  </span>
                  {consultant.specialty && (
                    <span className="text-sm text-gray-500">
                      {consultant.specialty}
                    </span>
                  )}
                </div>
                {selectedConsultantId === consultant.id && (
                  <span className="ml-auto text-primary-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </span>
                )}
              </label>
            ))}
        </div>

        <ModalFooter className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setShowAssignModal(false)}
            size="md"
          >
            ยกเลิก
          </Button>
          <Button
            variant="secondary"
            onClick={handleAssign}
            disabled={!selectedConsultantId}
            isLoading={isLoading}
            size="md"
          >
            ยืนยันการมอบหมาย
          </Button>
        </ModalFooter>
      </Modal>

      {/* Complete Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="บันทึกผลการปรึกษา"
        size="md"
      >
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">ผู้รับคำปรึกษา</p>
          <p className="text-xl font-bold text-gray-900 mb-1">
            {booking.userName || 'ไม่ระบุชื่อ'}
          </p>
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-700 mb-2">
            สรุปผลการดำเนินการ
          </label>
          <textarea
            value={consultantNote}
            onChange={(e) => setConsultantNote(e.target.value)}
            rows={5}
            placeholder="กรอกรายละเอียดคำแนะนำ หรือประเด็นสำคัญ..."
            className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none resize-none"
          />
        </div>

        <ModalFooter className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setShowCompleteModal(false)}
            size="md"
          >
            ยกเลิก
          </Button>
          <Button
            variant="success"
            onClick={handleComplete}
            isLoading={isLoading}
            size="md"
          >
            บันทึกข้อมูล
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
