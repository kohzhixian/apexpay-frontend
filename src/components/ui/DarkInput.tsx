import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export interface DarkInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
  variant?: 'default' | 'modal';
}

export interface DarkTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  variant?: 'default' | 'modal';
}

export const DarkInput = forwardRef<HTMLInputElement, DarkInputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, onRightIconClick, variant = 'default', className = '', id, ...props }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    const variantStyles = {
      default: {
        wrapper: 'bg-[#0f1623] hover:bg-[#0f1623]/80 border-transparent focus-within:ring-2 focus-within:ring-blue-500/50',
        label: 'text-slate-300',
        icon: 'text-slate-400',
        input: 'text-white placeholder:text-slate-500',
        helper: 'text-slate-400',
        error: 'text-red-400',
      },
      modal: {
        wrapper: 'bg-[#101723]/60 border-[#304669]/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
        label: 'text-[#90a4cb]',
        icon: 'text-[#8fa6cc]',
        input: 'text-white placeholder:text-[#506385]',
        helper: 'text-[#90a4cb]',
        error: 'text-red-400',
      },
    };

    const styles = variantStyles[variant];

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={`${styles.label} text-sm font-medium leading-normal ml-1`}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className={`material-symbols-outlined absolute left-4 ${styles.icon} text-[20px] pointer-events-none z-10`}>
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl focus:outline-0 border ${styles.wrapper} ${styles.input} h-12 ${leftIcon ? 'pl-11' : 'pl-4'
              } ${rightIcon ? 'pr-12' : 'pr-4'
              } text-sm font-normal leading-normal transition-all outline-none focus:outline-none ${className}`}
            {...props}
          />
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className={`absolute right-0 top-0 h-full px-4 flex items-center justify-center ${styles.icon} hover:text-white transition-colors cursor-pointer`}
            >
              <span className="material-symbols-outlined text-[20px]">{rightIcon}</span>
            </button>
          )}
        </div>
        {error && (
          <p className={`${styles.error} text-xs mt-1 ml-1`}>{error}</p>
        )}
        {helperText && !error && (
          <p className={`${styles.helper} text-[11px] ml-1`}>{helperText}</p>
        )}
      </div>
    );
  }
);

DarkInput.displayName = 'DarkInput';

export const DarkTextarea = forwardRef<HTMLTextAreaElement, DarkTextareaProps>(
  ({ label, error, helperText, leftIcon, variant = 'default', className = '', id, rows = 3, ...props }, ref) => {
    const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    const variantStyles = {
      default: {
        wrapper: 'bg-[#0f1623] hover:bg-[#0f1623]/80 border-transparent focus-within:ring-2 focus-within:ring-blue-500/50',
        label: 'text-slate-300',
        icon: 'text-slate-400',
        textarea: 'text-white placeholder:text-slate-500',
        helper: 'text-slate-400',
        error: 'text-red-400',
      },
      modal: {
        wrapper: 'bg-[#101723]/60 border-[#304669]/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
        label: 'text-[#90a4cb]',
        icon: 'text-[#8fa6cc]',
        textarea: 'text-white placeholder:text-[#506385]',
        helper: 'text-[#90a4cb]',
        error: 'text-red-400',
      },
    };

    const styles = variantStyles[variant];

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className={`${styles.label} text-sm font-medium leading-normal ml-1`}
          >
            {label}
          </label>
        )}
        <div className={`relative flex items-start rounded-xl border ${styles.wrapper} px-4 py-3 transition-all`}>
          {leftIcon && (
            <span className={`material-symbols-outlined ${styles.icon} mr-3 mt-0.5 text-[20px]`}>
              {leftIcon}
            </span>
          )}
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            className={`flex-1 w-full bg-transparent border-none p-0 focus:outline-0 focus:ring-0 ${styles.textarea} text-sm font-normal leading-normal resize-none outline-none ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className={`${styles.error} text-xs mt-1 ml-1`}>{error}</p>
        )}
        {helperText && !error && (
          <p className={`${styles.helper} text-[11px] ml-1`}>{helperText}</p>
        )}
      </div>
    );
  }
);

DarkTextarea.displayName = 'DarkTextarea';