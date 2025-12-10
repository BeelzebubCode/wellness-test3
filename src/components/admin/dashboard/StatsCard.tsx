// src/components/admin/dashboard/StatsCard.tsx

import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'gray';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
  const colorStyles = {
    blue: 'bg-blue-50 border-blue-100 text-blue-700',
    purple: 'bg-purple-50 border-purple-100 text-purple-700',
    green: 'bg-green-50 border-green-100 text-green-700',
    amber: 'bg-amber-50 border-amber-100 text-amber-700',
    red: 'bg-red-50 border-red-100 text-red-700',
    gray: 'bg-gray-50 border-gray-100 text-gray-700',
  };

  const iconBgStyles = {
    blue: 'bg-white text-blue-600',
    purple: 'bg-white text-purple-600',
    green: 'bg-white text-green-600',
    amber: 'bg-white text-amber-600',
    red: 'bg-white text-red-600',
    gray: 'bg-white text-gray-600',
  };

  return (
    <div className={cn('relative rounded-2xl p-6 border transition-all hover:shadow-lg', colorStyles[color])}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-2">{title}</p>
          <h3 className="text-4xl font-extrabold tracking-tight">{value}</h3>
        </div>
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm", iconBgStyles[color])}>
          {/* แสดงไอคอนตรงนี้ */}
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className={cn("px-2 py-0.5 rounded-lg bg-white/50", trend.isPositive ? 'text-green-700' : 'text-red-700')}>
            {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
          </span>
          <span className="text-gray-500 opacity-80">จากเดือนก่อน</span>
        </div>
      )}
    </div>
  );
}