import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'social';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Material icon name to display on the left */
  leftIcon?: string;
  /** Material icon name to display on the right */
  rightIcon?: string;
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** Button content */
  children: ReactNode;
}

/**
 * A versatile button component with multiple variants, sizes, and icon support.
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = 'font-semibold rounded-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20',
    secondary: 'bg-[#161E2C] hover:bg-[#1e2a3c] border border-slate-700 text-white',
    outline: 'border border-slate-700 text-slate-300 hover:border-blue-500 hover:text-white bg-transparent',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent',
    social: 'bg-white/5 hover:bg-white/10 border border-white/5 text-white',
  };

  const sizeStyles = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-sm',
    lg: 'py-3.5 px-6 text-base',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="material-symbols-outlined text-[18px]">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="material-symbols-outlined text-[18px]">{rightIcon}</span>}
    </button>
  );
};
