// ==========================================
// 📌 Booking Component: MyAppointmentCard
// ==========================================

'use client';

import { cn } from '@/lib/cn';
import { formatThaiDate } from '@/lib/date';
import { BOOKING_STATUS } from '@/lib/constants';
import { Card, Badge, Button } from '@/components/ui';
import type { Booking, BookingStatus } from '@/types';

export interface MyAppointmentCardProps {
  booking: Booking;
  onCancel?: () => void;
  isCompact?: boolean;
}

export function MyAppointmentCard({
  booking,
  onCancel,
  isCompact = false,
}: MyAppointmentCardProps) {
  const statusConfig = BOOKING_STATUS[booking.status as keyof typeof BOOKING_STATUS];
  const canCancel = ['CONFIRMED', 'ASSIGNED'].includes(booking.status);

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-200 hover:shadow-md',
        isCompact && 'p-4'
      )}
      padding={isCompact ? 'none' : 'md'}
    >
      {/* Status Bar */}
      <div className={cn('px-4 py-2', statusConfig.bgColor, !isCompact && '-mx-6 -mt-6 mb-4')}>
        <div className="flex items-center justify-between">
          <span className={cn('text-sm font-medium flex items-center gap-2', statusConfig.textColor)}>
            <span>{statusConfig.icon}</span>
            {statusConfig.label}
          </span>
          <span className="text-xs text-gray-500">
            #{booking.id.slice(-6).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={cn('space-y-4', isCompact && 'mt-3')}>
        {/* Date & Time */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-primary-50 rounded-xl flex flex-col items-center justify-center text-primary-600 flex-shrink-0">
            <span className="text-xs font-bold uppercase">
              {new Date(booking.date).toLocaleDateString('th-TH', { weekday: 'short' })}
            </span>
            <span className="text-xl font-bold leading-none">
              {new Date(booking.date).getDate()}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800">
              {formatThaiDate(new Date(booking.date))}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span>🕐</span>
              {booking.startTime} - {booking.endTime} น.
            </p>
          </div>
        </div>

        {/* Problem Type */}
        {booking.problemType && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">ประเภทปัญหา</p>
            <p className="text-sm text-gray-700">{booking.problemType}</p>
          </div>
        )}

        {/* Consultant Info */}
        {booking.consultant && (
          <div className="flex items-center gap-3 bg-purple-50 rounded-lg p-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
              {booking.consultant.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-purple-600">ผู้ให้คำปรึกษา</p>
              <p className="font-semibold text-purple-800">{booking.consultant.name}</p>
            </div>
          </div>
        )}

        {/* Consultant Note (if completed) */}
        {booking.status === 'COMPLETED' && booking.consultantNote && (
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-green-600 mb-1 flex items-center gap-1">
              <span>📝</span> สรุปการให้คำปรึกษา
            </p>
            <p className="text-sm text-green-800">{booking.consultantNote}</p>
          </div>
        )}

        {/* Cancel Reason (if cancelled) */}
        {booking.status === 'CANCELLED' && booking.cancelReason && (
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs text-red-600 mb-1">เหตุผลการยกเลิก</p>
            <p className="text-sm text-red-800">{booking.cancelReason}</p>
          </div>
        )}

        {/* Actions */}
        {canCancel && onCancel && (
          <div className="pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              ❌ ยกเลิกการจอง
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
