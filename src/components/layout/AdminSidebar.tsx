'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { ADMIN_NAV } from '@/lib/constants';
import { useEffect } from 'react';
// 👇 Import ไอคอน Lucide
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  Stethoscope,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ShieldPlus, // ไอคอนสำหรับ Logo
  BookCheck
} from 'lucide-react';

export interface AdminSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
}

export function AdminSidebar({ isOpen, isCollapsed, onCloseMobile, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();

  // ปิด Sidebar อัตโนมัติเมื่อเปลี่ยนหน้า (บนมือถือ)
  useEffect(() => {
    onCloseMobile();
  }, [pathname]);

  // 🗺️ ฟังก์ชันเลือกไอคอนตามเมนู
  const getIcon = (href: string) => {
    switch (href) {
      case '/admin': return <LayoutDashboard className="w-6 h-6" />;
      case '/admin/bookings': return <CalendarDays className="w-6 h-6" />;
      case '/admin/schedule': return <Clock className="w-6 h-6" />;
      // case '/admin/consultants': return <Stethoscope className="w-6 h-6" />;
      case '/admin/stats': return <BarChart3 className="w-6 h-6" />;
      case '/admin/my-jobs': return <BookCheck className="w-6 h-6" />;
      default: return <LayoutDashboard className="w-6 h-6" />;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 text-gray-600 shadow-sm">
      {/* Logo Area */}
      <div className={cn("h-20 flex items-center px-6 border-b border-gray-100", isCollapsed ? "justify-center px-2" : "")}>
        <div className="w-10 h-10 bg-primary-500 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-primary-500/20">
          <ShieldPlus className="w-6 h-6" /> {/* Logo Icon */}
        </div>
        {!isCollapsed && (
          <span className="ml-3 font-bold text-gray-800 text-xl tracking-tight whitespace-nowrap">
            NU Wellness
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {ADMIN_NAV.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative',
                isCollapsed && 'justify-center px-2',
                isActive
                  ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
              )}
            >
              <span className={cn("transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")}>
                {getIcon(item.href)}
              </span>
              {!isCollapsed && (
                <span className="text-base">{item.label}</span>
              )}
              
              {/* Active Indicator Line */}
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Toggle Desktop */}
      <div className="p-4 border-t border-gray-100 hidden md:block">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <div className="flex items-center gap-2"><ChevronLeft className="w-5 h-5" /> <span>ย่อเมนู</span></div>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* --- Mobile Overlay --- */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onCloseMobile}
      />

      {/* --- Mobile Sidebar (Drawer) --- */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white transition-transform duration-300 ease-out md:hidden shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* --- Desktop Sidebar (Static) --- */}
      <aside 
        className={cn(
          "hidden md:block h-screen sticky top-0 transition-all duration-300 ease-in-out z-20 border-r border-gray-200 bg-white",
          isCollapsed ? "w-24" : "w-72" // 📏 ขยายความกว้างให้ดูเต็มตา (w-72 = 288px)
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}