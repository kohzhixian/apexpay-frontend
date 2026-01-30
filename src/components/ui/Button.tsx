import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'social';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: string;
  rightIcon?: string;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'w-full font-bold rounded-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20',
    secondary: 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10',
    ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
    social: 'bg-white/5 hover:bg-white/10 border border-white/5 text-white',
  };

  const sizeStyles = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3.5 px-4 text-base',
    lg: 'py-4 px-6 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {leftIcon && <span className="material-symbols-outlined text-[20px]">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="material-symbols-outlined text-[20px]">{rightIcon}</span>}
    </button>
  );
};
