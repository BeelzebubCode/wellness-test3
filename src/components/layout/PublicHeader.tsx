// ==========================================
// 📌 Layout Component: PublicHeader (v2)
// ==========================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { APP_CONFIG, PUBLIC_NAV } from '@/lib/constants';
import { LogOut, Menu, X } from 'lucide-react';

export interface PublicHeaderProps {
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

export function PublicHeader({
  userName,
  userAvatar,
  onLogout,
}: PublicHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((v) => !v);

  return (
    <header className="sticky top-0 z-40">
      {/* BG + blur layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-teal-500 to-cyan-500 opacity-95" />
      <div className="absolute inset-0 backdrop-blur-md" />

      <div className="relative">
        {/* Desktop / main bar */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/15 shadow-sm transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
                💚
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/70 tracking-wide">
                  NU Wellness
                </span>
                <span className="text-sm font-semibold text-white">
                  {APP_CONFIG.name}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {PUBLIC_NAV.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 text-xs tracking-wide font-medium px-3 py-1.5 rounded-full transition-all duration-200',
                      isActive
                        ? 'bg-white text-slate-900 shadow-md shadow-black/10'
                        : 'text-white/75 hover:text-white hover:bg-white/10'
                    )}
                  >
                    {item.icon && (
                      <span className="w-4 h-4 flex items-center justify-center">
                        {item.icon}
                      </span>
                    )}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User area */}
            <div className="flex items-center gap-3">
              {userName ? (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-black/10 border border-white/20">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="w-8 h-8 rounded-full ring-2 ring-white/40 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        👤
                      </div>
                    )}
                    <div className="flex flex-col leading-tight">
                      <span className="text-[11px] text-white/70">
                        สวัสดี
                      </span>
                      <span className="text-sm font-semibold text-white line-clamp-1 max-w-[120px]">
                        {userName}
                      </span>
                    </div>
                  </div>

                  {onLogout && (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/25 bg-white/10 text-xs font-medium text-white/90 hover:bg-white hover:text-slate-900 hover:shadow-md transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>ออกจากระบบ</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/10 border border-white/20 text-xs text-white/80">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    👤
                  </div>
                  <span>ยังไม่ได้เข้าสู่ระบบ</span>
                </div>
              )}

              {/* Mobile toggle */}
              <button
                type="button"
                onClick={toggleMobile}
                className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/15 border border-white/20 text-white hover:bg-black/25 transition"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden border-t border-white/15 bg-black/20 backdrop-blur-md transition-all duration-200 overflow-hidden',
            mobileOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 py-2 space-y-2">
            <nav className="flex flex-wrap gap-2">
              {PUBLIC_NAV.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-xs font-medium px-3 py-1.5 rounded-full',
                      isActive
                        ? 'bg-white text-slate-900'
                        : 'text-white/80 bg-white/10'
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile user + logout */}
            <div className="flex items-center justify-between pt-2">
              {userName ? (
                <div className="flex items-center gap-2 text-xs text-white">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-7 h-7 rounded-full ring-2 ring-white/40 object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                      👤
                    </div>
                  )}
                  <span className="line-clamp-1 max-w-[140px]">
                    {userName}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-white/80">
                  ยังไม่ได้เข้าสู่ระบบ
                </span>
              )}

              {userName && onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-[11px] text-white hover:bg-white hover:text-slate-900 transition"
                >
                  <LogOut className="w-3 h-3" />
                  <span>ออกจากระบบ</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
