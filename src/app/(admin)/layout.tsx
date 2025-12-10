'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminHeader, AdminSidebar } from '@/components/layout';
import { LoadingSpinner } from '@/components/ui';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState<{ name: string; role: string } | null>(null);
  
  // State for Layout
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    // Check Auth
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    setAdminInfo({
      name: localStorage.getItem('adminName') || 'Admin',
      role: localStorage.getItem('adminRole') || 'admin'
    });
    setIsLoading(false);
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" label="กำลังตรวจสอบสิทธิ์..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={isMobileMenuOpen}
        isCollapsed={isSidebarCollapsed}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <AdminHeader 
          adminName={adminInfo?.name} 
          adminRole={adminInfo?.role} 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}