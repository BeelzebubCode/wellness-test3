'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalFooter, Button, LoadingSpinner } from '@/components/ui';
import { UserCog, Save } from 'lucide-react';

interface AssignConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
  onSuccess: () => void;
}

export function AssignConsultantModal({ isOpen, onClose, bookingId, onSuccess }: AssignConsultantModalProps) {
  const [consultants, setConsultants] = useState<{id: string, name: string}[]>([]);
  const [selectedConsultant, setSelectedConsultant] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch('/api/v1/consultants') // ดึงรายชื่อหมอ
        .then(res => res.json())
        .then(data => setConsultants(data.consultants || []))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!bookingId || !selectedConsultant) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/v1/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assign', consultantId: selectedConsultant }),
      });
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert('เกิดข้อผิดพลาด');
      }
    } catch (error) { console.error(error); } 
    finally { setIsSaving(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="มอบหมายผู้ให้คำปรึกษา" size="sm">
      <div className="space-y-4 py-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">เลือกผู้ให้คำปรึกษา</label>
          {isLoading ? (
            <div className="flex justify-center p-4"><LoadingSpinner size="sm" /></div>
          ) : (
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedConsultant}
              onChange={(e) => setSelectedConsultant(e.target.value)}
            >
              <option value="">-- กรุณาเลือก --</option>
              {consultants.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>
      <ModalFooter>
        <Button variant="ghost" size="sm" onClick={onClose}>ยกเลิก</Button>
        <Button size="sm" onClick={handleSave} isLoading={isSaving} disabled={!selectedConsultant} className="bg-primary-600 hover:bg-primary-700 text-white">
          <Save className="w-4 h-4 mr-2" /> บันทึก
        </Button>
      </ModalFooter>
    </Modal>
  );
}