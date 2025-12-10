// ==========================================
// 📌 UI Component: ImageCard
// ==========================================

'use client';

interface ImageCardProps {
  src?: string;
  alt?: string;
  height?: number; // ปรับความสูงได้ตามต้องการ
}

export function ImageCard({
  src,
  alt = 'image',
  height = 500,
}: ImageCardProps) {
  return (
    <div
      className="
        bg-white 
        rounded-2xl 
        shadow-sm 
        border border-gray-200 
        overflow-hidden
        flex 
        items-center 
        justify-center
      "
      style={{ height }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="text-gray-400 text-sm">ไม่มีรูปภาพ</div>
      )}
    </div>
  );
}
