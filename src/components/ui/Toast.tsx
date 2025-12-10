// ==========================================
// 📌 UI Component: Toast
// ==========================================

'use client';

import { cn } from '@/lib/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  onClose: (id: string) => void;
}

export function Toast({ id, type, title, message, onClose }: ToastProps) {
  const typeStyles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: '✅',
      title: 'text-green-800',
      message: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: '❌',
      title: 'text-red-800',
      message: 'text-red-700',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      icon: '⚠️',
      title: 'text-amber-800',
      message: 'text-amber-700',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'ℹ️',
      title: 'text-blue-800',
      message: 'text-blue-700',
    },
  };

  const styles = typeStyles[type];

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 w-full max-w-sm p-4 rounded-xl border shadow-lg',
        'animate-in slide-in-from-right duration-200',
        styles.bg
      )}
    >
      <span className="text-xl flex-shrink-0">{styles.icon}</span>
      
      <div className="flex-1 min-w-0">
        <p className={cn('font-semibold', styles.title)}>{title}</p>
        {message && (
          <p className={cn('mt-1 text-sm', styles.message)}>{message}</p>
        )}
      </div>

      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ----- Toast Container -----
export interface ToastContainerProps {
  toasts: Array<Omit<ToastProps, 'onClose'>>;
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastContainer({ toasts, onClose, position = 'top-right' }: ToastContainerProps) {
  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  if (toasts.length === 0) return null;

  return (
    <div className={cn('fixed z-50 flex flex-col gap-2', positionStyles[position])}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
