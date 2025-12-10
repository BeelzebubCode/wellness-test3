// ==========================================
// 📌 Admin Component: QuickActions
// ==========================================

import Link from 'next/link';
import { Card } from '@/components/ui';

export function QuickActions() {
  const actions = [
    { href: '/admin/bookings', icon: '📅', label: 'จัดการการจอง', color: 'blue' },
    { href: '/admin/schedule', icon: '⏰', label: 'ตั้งค่าตาราง', color: 'purple' },
    { href: '/admin/consultants', icon: '👨‍⚕️', label: 'ผู้ให้คำปรึกษา', color: 'green' },
    { href: '/admin/stats', icon: '📊', label: 'ดูสถิติ', color: 'amber' },
  ];

  return (
    <Card>
      <h3 className="font-semibold text-gray-800 mb-4">⚡ ทางลัด</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">{action.icon}</span>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}