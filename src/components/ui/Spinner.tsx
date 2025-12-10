// ==========================================
// 📌 UI Component: Spinner
// ==========================================

import { cn } from '@/lib/cn';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const colorStyles = {
    primary: 'border-primary-500 border-t-transparent',
    secondary: 'border-secondary-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizeStyles[size],
        colorStyles[color],
        className
      )}
    />
  );
}

// ----- Loading Spinner with Label -----
export interface LoadingSpinnerProps extends SpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label, ...props }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Spinner {...props} />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  );
}

// ----- Full Page Loading -----
export interface LoadingOverlayProps {
  isLoading: boolean;
  label?: string;
}

export function LoadingOverlay({ isLoading, label = 'กำลังโหลด...' }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <LoadingSpinner size="xl" label={label} />
    </div>
  );
}

// ----- Skeleton Loader -----
export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variantStyles[variant],
        className
      )}
      style={{ width, height }}
    />
  );
}
