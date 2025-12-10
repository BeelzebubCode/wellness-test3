'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalFooter, Button } from '@/components/ui';
import { CalendarClock, Save } from 'lucide-react';
import { toISODateString } from '@/lib/date';
import type { Booking } from '@/types';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSuccess: () => void;
}

export function RescheduleModal({ isOpen, onClose, booking, onSuccess }: RescheduleModalProps) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (booking && isOpen) {
      setDate(booking.date);
      setStartTime(booking.startTime);
      setEndTime(booking.endTime);
    }
  }, [booking, isOpen]);

  const handleSave = async () => {
    if (!booking) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/v1/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reschedule',
          date, 
          startTime, 
          endTime 
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert('ไม่สามารถเลื่อนนัดได้');
      }
    } catch (error) { console.error(error); } 
    finally { setIsSaving(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="เลื่อนวัน/เวลานัดหมาย" size="sm">
      <div className="space-y-4 py-2">
        <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800 border border-blue-200">
          แก้ไขคิวของ: <b>{booking?.userName ?? 'ไม่ทราบชื่อ'}</b>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">วันที่ต้องการเลื่อนไป</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            min={toISODateString(new Date())}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">เวลาเริ่มใหม่</label>
            <input 
              type="time" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">เวลาสิ้นสุดใหม่</label>
            <input 
              type="time" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
      <ModalFooter>
        <Button variant="ghost" size="sm" onClick={onClose}>ยกเลิก</Button>
        <Button size="sm" onClick={handleSave} isLoading={isSaving} className="bg-gray-800 text-white hover:bg-gray-900">
          <Save className="w-4 h-4 mr-2" /> ยืนยัน
        </Button>
      </ModalFooter>
    </Modal>
  );
}