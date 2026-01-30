import type { InputHTMLAttributes, ReactNode } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  variant?: 'light' | 'dark';
}

export const Checkbox = ({ label, variant = 'light', className = '', ...props }: CheckboxProps) => {
  const isDark = variant === 'dark';

  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        className={`h-4 w-4 rounded ${isDark
          ? 'border-slate-600 bg-[#0f1623] text-blue-500 focus:ring-blue-500/50'
          : 'border-slate-300 dark:border-[#304669] bg-slate-50 dark:bg-[#101722] text-blue-500 focus:ring-blue-500'
          } focus:ring-offset-0 transition-all cursor-pointer ${className}`}
        {...props}
      />
      <span className={`text-sm transition-colors ${isDark
        ? 'text-slate-400 group-hover:text-white'
        : 'text-slate-600 dark:text-[#8fa6cc] group-hover:text-slate-800 dark:group-hover:text-white'
        }`}>
        {label}
      </span>
    </label>
  );
};
