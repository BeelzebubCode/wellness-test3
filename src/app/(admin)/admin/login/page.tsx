// ==========================================
// 📌 Admin Login Page
// ==========================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Input } from '@/components/ui';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminId', data.admin.id);
      localStorage.setItem('adminName', data.admin.name);
      localStorage.setItem('adminRole', data.admin.role);

      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    localStorage.setItem('adminToken', 'demo-token');
    localStorage.setItem('adminId', 'demo-admin');
    localStorage.setItem('adminName', 'Demo Admin');
    localStorage.setItem('adminRole', 'admin');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-600 to-secondary-900 p-4">
      <Card className="max-w-md w-full" padding="lg" variant="elevated">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🏥</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-500">NU Wellness Center</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="ชื่อผู้ใช้"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="กรอกชื่อผู้ใช้"
            leftIcon={<span>👤</span>}
            required
          />

          <Input
            label="รหัสผ่าน"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="กรอกรหัสผ่าน"
            leftIcon={<span>🔒</span>}
            required
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">⚠️ {error}</p>
            </div>
          )}

          <Button type="submit" variant="secondary" size="lg" className="w-full" isLoading={isLoading}>
            เข้าสู่ระบบ
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-center text-gray-400 text-sm mb-3">สำหรับทดสอบระบบ</p>
          <Button type="button" variant="ghost" size="md" className="w-full" onClick={handleDemoLogin}>
            🧪 เข้าสู่ระบบแบบ Demo
          </Button>
        </div>
      </Card>
    </div>
  );
}