export interface QuickActionButtonProps {
    icon: string;
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

export const QuickActionButton = ({
    icon,
    label,
    onClick,
    variant = 'primary',
}: QuickActionButtonProps) => {
    const baseStyles =
        'flex-1 min-w-[140px] h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-base transition-all active:scale-[0.98]';

    const variantStyles = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25',
        secondary:
            'bg-white dark:bg-[#1e2a40] border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#2a3855] text-slate-500 dark:text-white',
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]}`}
        >
            <span className="material-symbols-outlined">{icon}</span>
            {label}
        </button>
    );
};
