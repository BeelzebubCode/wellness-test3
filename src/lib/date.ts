// ==========================================
// 📌 Date Utilities
// ==========================================

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const THAI_DAYS_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

/**
 * Convert Date to ISO date string (YYYY-MM-DD)
 */
export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date in Thai format
 */
export function formatThaiDate(
  date: Date | string,
  options: { short?: boolean; includeYear?: boolean; includeDay?: boolean } = {}
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const { short = false, includeYear = true, includeDay = false } = options;

  const day = d.getDate();
  const month = short ? THAI_MONTHS_SHORT[d.getMonth()] : THAI_MONTHS[d.getMonth()];
  const year = d.getFullYear() + 543;
  const dayName = THAI_DAYS[d.getDay()];

  let result = `${day} ${month}`;
  if (includeYear) result += ` ${short ? year.toString().slice(-2) : year}`;
  if (includeDay) result = `วัน${dayName} ${result}`;

  return result;
}

/**
 * Get Thai day name
 */
export function getThaiDayName(date: Date, format: 'short' | 'full' = 'full'): string {
  const dayIndex = date.getDay();
  return format === 'short' ? THAI_DAYS_SHORT[dayIndex] : THAI_DAYS[dayIndex];
}

/**
 * Format month and year in Thai
 */
export function formatMonthYear(date: Date, short = false): string {
  const month = short ? THAI_MONTHS_SHORT[date.getMonth()] : THAI_MONTHS[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `${month} ${year}`;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
}

/**
 * Check if date is weekend
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Get calendar days for a month (includes padding from prev/next months)
 */
export function getCalendarDays(currentMonth: Date): Date[] {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();

  const days: Date[] = [];

  // Previous month padding
  for (let i = startPadding - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Next month padding (to make 42 days = 6 weeks)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

/**
 * Add days to date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Format time (HH:mm)
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')} น.`;
}

/**
 * Parse time string to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to time string
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// Export constants
export { THAI_MONTHS, THAI_MONTHS_SHORT, THAI_DAYS, THAI_DAYS_SHORT };
