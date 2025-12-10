'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from '@/components/ui';
import {
  BarChart3,
  CalendarSearch,
  Download,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatThaiDate } from '@/lib/date';

// ------------ Types ------------
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

interface StatsSummary {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

interface StatsBookingItem {
  id: string;
  studentId?: string | null;
  userName?: string | null;
  faculty?: string | null;
  major?: string | null;
  problemType?: string | null;
  date: string;          // ISO string
  startTime: string;     // "08:00"
  status: BookingStatus;
}

// ------------ Mock options (ปรับ/ผูกจากฐานจริงได้) ------------
const FACULTIES = ['ทั้งหมด', 'วิทยาศาสตร์', 'วิศวกรรมศาสตร์', 'สังคมศาสตร์', 'อื่น ๆ'];
const PROBLEM_TYPES = ['ทั้งหมด', 'ความเครียด', 'การเรียน', 'ความสัมพันธ์', 'สุขภาพจิตอื่น ๆ'];
const STATUS_OPTIONS: { label: string; value: '' | BookingStatus }[] = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'รอดำเนินการ', value: 'PENDING' },
  { label: 'อนุมัติแล้ว', value: 'CONFIRMED' },
  { label: 'เสร็จสิ้น', value: 'COMPLETED' },
  { label: 'ยกเลิก', value: 'CANCELLED' },
];

// เอา status → label + สี badge
function getStatusBadge(status: BookingStatus) {
  switch (status) {
    case 'PENDING':
      return { label: 'รอดำเนินการ', className: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'CONFIRMED':
      return { label: 'อนุมัติแล้ว', className: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'COMPLETED':
      return { label: 'เสร็จสิ้น', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'CANCELLED':
      return { label: 'ยกเลิก', className: 'bg-rose-50 text-rose-700 border-rose-200' };
    default:
      return { label: status, className: 'bg-gray-50 text-gray-600 border-gray-200' };
  }
}

// ------------ Main Page ------------
export default function AdminStatsPage() {
  // ฟิลเตอร์
  const [search, setSearch] = useState('');
  const [faculty, setFaculty] = useState('ทั้งหมด');
  const [problemType, setProblemType] = useState('ทั้งหมด');
  const [status, setStatus] = useState<'' | BookingStatus>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // ข้อมูล
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [bookings, setBookings] = useState<StatsBookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // โหลดครั้งแรกแบบ "ทั้งหมด"
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // สร้าง query string จากฟิลเตอร์
  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (faculty !== 'ทั้งหมด') params.set('faculty', faculty);
    if (problemType !== 'ทั้งหมด') params.set('problemType', problemType);
    if (status) params.set('status', status);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    return params.toString();
  };

  // กดค้นหา
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const qs = buildQueryString();
      const res = await fetch(`/api/admin/stats/bookings${qs ? `?${qs}` : ''}`);

      if (!res.ok) throw new Error('Failed to fetch stats');

      const data = await res.json();
      setSummary(data.summary);
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('stats fetch error', err);
      setSummary(null);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Export CSV
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const qs = buildQueryString();
      const res = await fetch(`/api/admin/stats/export${qs ? `?${qs}` : ''}`);

      if (!res.ok) throw new Error('Failed to export CSV');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nu-wellness-stats.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('export csv error', err);
      alert('ไม่สามารถ Export CSV ได้');
    } finally {
      setIsExporting(false);
    }
  };

  const total = summary?.total ?? 0;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <BarChart3 className="w-6 h-6" />
            </span>
            สถิติและข้อมูลนิสิต
          </h1>
          <p className="text-gray-500 text-sm mt-1 ml-12">
            ดูสถิติการจองคิวและข้อมูลนิสิตที่เข้ารับบริการ พร้อม Export เป็น CSV
          </p>
        </div>
        <Button
          size="sm"
          className="bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2"
          onClick={handleExport}
          disabled={isExporting || total === 0}
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'กำลัง Export...' : 'Export CSV'}
        </Button>
      </div>

      {/* KPI Cards (ใช้ข้อมูลจริงจาก summary) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="ทั้งหมด"
          value={summary?.total ?? 0}
          accent="border-sky-400"
        />
        <KpiCard
          label="รอดำเนินการ"
          value={summary?.pending ?? 0}
          accent="border-amber-400"
        />
        <KpiCard
          label="อนุมัติแล้ว"
          value={summary?.confirmed ?? 0}
          accent="border-blue-400"
        />
        <KpiCard
          label="เสร็จสิ้น"
          value={summary?.completed ?? 0}
          accent="border-emerald-500"
        />
        <KpiCard
          label="ยกเลิก"
          value={summary?.cancelled ?? 0}
          accent="border-rose-500"
        />
      </div>

      {/* Filter Card (ตัวกรอง) */}
      <Card className="p-4 sm:p-5 border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="p-1.5 bg-sky-100 rounded-lg text-sky-600">
            <CalendarSearch className="w-4 h-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-800">ตัวกรอง</p>
            <p className="text-xs text-gray-500">
              เลือกช่วงวัน คณะ ประเภทปัญหา และสถานะคิวที่ต้องการดู
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4 mb-3">
          {/* search */}
          <div className="md:col-span-2">
            <label className="text-xs text-gray-600 mb-1 block">ค้นหา</label>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ชื่อ หรือ รหัสนิสิต"
                className="w-full py-2 text-sm bg-transparent outline-none"
              />
            </div>
          </div>

          {/* faculty */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">คณะ</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
            >
              {FACULTIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* problem type */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">ประเภทปัญหา</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
            >
              {PROBLEM_TYPES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4 items-end">
          {/* status */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">สถานะ</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              value={status}
              onChange={(e) => setStatus(e.target.value as '' | BookingStatus)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.label} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* date from */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">ตั้งแต่วันที่</label>
            <input
              type="date"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          {/* date to */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">ถึงวันที่</label>
            <input
              type="date"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          {/* buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="border border-gray-200 text-gray-500"
              onClick={() => {
                setSearch('');
                setFaculty('ทั้งหมด');
                setProblemType('ทั้งหมด');
                setStatus('');
                setDateFrom('');
                setDateTo('');
              }}
            >
              ล้างตัวกรองทั้งหมด
            </Button>
            <Button
              size="sm"
              className="bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1"
              onClick={handleSearch}
              disabled={isLoading}
            >
              <Search className="w-4 h-4" />
              {isLoading ? 'กำลังค้นหา...' : 'ค้นหา'}
            </Button>
          </div>
        </div>
      </Card>

      {/* ตารางข้อมูลนิสิต */}
      <Card className="p-0 border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              ข้อมูลนิสิต ({bookings.length} รายการ)
            </p>
            <p className="text-xs text-gray-500">
              แสดงข้อมูลตามเงื่อนไขที่เลือกด้านบน
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-4 py-2 text-left">รหัสนิสิต</th>
                <th className="px-4 py-2 text-left">ชื่อ-สกุล</th>
                <th className="px-4 py-2 text-left">คณะ</th>
                <th className="px-4 py-2 text-left">สาขา</th>
                <th className="px-4 py-2 text-left">ประเภทปัญหา</th>
                <th className="px-4 py-2 text-left">วันที่</th>
                <th className="px-4 py-2 text-left">สถานะ</th>
                <th className="px-4 py-2 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">
                    ไม่พบข้อมูลตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const badge = getStatusBadge(b.status);
                  return (
                    <tr key={b.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-2 align-top">{b.studentId || '-'}</td>
                      <td className="px-4 py-2 align-top">{b.userName || '-'}</td>
                      <td className="px-4 py-2 align-top">{b.faculty || '-'}</td>
                      <td className="px-4 py-2 align-top">{b.major || '-'}</td>
                      <td className="px-4 py-2 align-top">{b.problemType || '-'}</td>
                      <td className="px-4 py-2 align-top">
                        {formatThaiDate(new Date(b.date))}
                      </td>
                      <td className="px-4 py-2 align-top">
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-full border text-xs',
                            badge.className,
                          )}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-2 align-top text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary-600 text-xs px-0"
                          // ปรับลิงก์ดูรายละเอียดตาม route จริงของหน้า booking detail
                          onClick={() => (window.location.href = `/admin/bookings?id=${b.id}`)}
                        >
                          ดูรายละเอียด
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ------------ Small KPI Card component ------------
function KpiCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <Card className={cn('p-4 border-gray-200 shadow-sm border-t-4', accent)}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </Card>
  );
}
