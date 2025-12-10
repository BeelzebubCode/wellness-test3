// ==========================================
// 📌 Public Layout (Route Group)
// ==========================================

'use client';

import { LineProvider } from '@/contexts';
import { PublicHeader, PublicFooter } from '@/components/layout';
import { useLine } from '@/contexts/LineContext';

function PublicLayoutContent({ children }: { children: React.ReactNode }) {
  const { profile } = useLine();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader
        userName={profile?.displayName}
        userAvatar={profile?.pictureUrl}
      />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
  
  return (
    <LineProvider liffId={liffId}>
      <PublicLayoutContent>{children}</PublicLayoutContent>
    </LineProvider>
  );
}