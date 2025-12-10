// ==========================================
// 📌 Root Layout
// ==========================================

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'NU Wellness Center',
    template: '%s | NU Wellness Center',
  },
  description: 'ระบบจองคิวให้คำปรึกษาสุขภาพจิต มหาวิทยาลัยนเรศวร',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="antialiased">{children}</body>
    </html>
  );
}