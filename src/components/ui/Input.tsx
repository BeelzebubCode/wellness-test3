// src/components/ui/Input.tsx

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-base lg:text-lg font-bold text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl lg:text-2xl">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            /* 📏 Desktop สูง 56px (h-14) */
            className={cn(
              'w-full h-12 lg:h-14 rounded-xl border-2 border-gray-200 bg-white text-gray-900',
              'px-4 text-base lg:text-lg placeholder:text-gray-400',
              'transition-all duration-200',
              'focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100',
              'disabled:bg-gray-50 disabled:text-gray-500',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-100',
              leftIcon && 'pl-12 lg:pl-14',
              rightIcon && 'pr-12 lg:pr-14',
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl lg:text-2xl">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-sm lg:text-base text-red-600 mt-1 font-medium">⚠️ {error}</p>}
        {hint && !error && <p className="text-sm lg:text-base text-gray-500 mt-1">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };