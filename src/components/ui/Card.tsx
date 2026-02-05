import type { ReactNode } from 'react';

interface CardProps {
    /** Card content */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Card variant */
    variant?: 'dark' | 'glass';
    /** Optional padding override */
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

/**
 * Reusable card component with dark and glass variants.
 * - dark: Solid dark background with slate border (matches dashboard cards)
 * - glass: Glassmorphism effect with backdrop blur (matches wallet cards)
 */
export const Card = ({
    children,
    className = '',
    variant = 'dark',
    padding = 'md',
}: CardProps) => {
    const baseClasses = variant === 'dark'
        ? 'bg-[#1e293b] border border-slate-700 rounded-2xl'
        : 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-xl';

    return (
        <div className={`${baseClasses} ${paddingClasses[padding]} ${className}`}>
            {children}
        </div>
    );
};
