import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, onRightIconClick, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-slate-900 dark:text-white text-sm font-medium leading-normal"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8fa6cc]">
              <span className="material-symbols-outlined text-[20px]">{leftIcon}</span>
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg text-slate-900 dark:text-white border-slate-200 dark:border-[#304669] bg-slate-50 dark:bg-[#101722] focus:border-blue-500 focus:ring-blue-500 h-12 ${leftIcon ? 'pl-11' : 'pl-4'
              } ${rightIcon ? 'pr-11' : 'pr-4'
              } placeholder:text-slate-400 dark:placeholder:text-[#5e7ba8] text-base font-normal transition-all ${className}`}
            {...props}
          />
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8fa6cc] hover:text-blue-500 transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined text-[20px]">{rightIcon}</span>
            </button>
          )}
        </div>
        {error && (
          <p className="text-red-600 dark:text-red-400 text-xs mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
