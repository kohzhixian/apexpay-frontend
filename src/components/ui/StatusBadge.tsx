/**
 * StatusBadge Component
 *
 * A pill-shaped status indicator component that displays entity statuses
 * consistently across tables and cards.
 *
 * @example
 * // Basic usage
 * <StatusBadge variant="success" label="Completed" />
 *
 * // With dot indicator
 * <StatusBadge variant="pending" label="Processing" showDot />
 *
 * // Small size
 * <StatusBadge variant="failed" label="Error" size="sm" />
 */

export type StatusVariant = 'success' | 'pending' | 'failed' | 'cancelled' | 'info';

interface StatusBadgeProps {
    /** Status variant determining color scheme */
    variant: StatusVariant;
    /** Label text to display */
    label: string;
    /** Whether to show the status dot indicator */
    showDot?: boolean;
    /** Size variant */
    size?: 'sm' | 'md';
}

/**
 * Color styles for each status variant
 * Based on existing patterns from ActivityTable status styles
 */
const variantStyles: Record<StatusVariant, string> = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-slate-500/10 text-slate-400 border-white/10',
    failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

/**
 * Dot color styles for each status variant
 */
const dotStyles: Record<StatusVariant, string> = {
    success: 'bg-emerald-400',
    pending: 'bg-slate-400',
    failed: 'bg-rose-400',
    cancelled: 'bg-rose-400',
    info: 'bg-blue-400',
};

/**
 * Size styles for the badge
 */
const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
};

/**
 * Dot size styles
 */
const dotSizeStyles = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
};

/**
 * A reusable status badge component for displaying entity statuses
 * with consistent styling across the application.
 *
 * @param variant - Status variant determining color scheme (success, pending, failed, cancelled, info)
 * @param label - Label text to display
 * @param showDot - Whether to show the status dot indicator (default: false)
 * @param size - Size variant (default: 'md')
 * @returns A styled status badge element
 */
export const StatusBadge = ({
    variant,
    label,
    showDot = false,
    size = 'md',
}: StatusBadgeProps) => {
    // Fall back to 'info' styling for invalid variants
    const safeVariant = variantStyles[variant] ? variant : 'info';

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${variantStyles[safeVariant]} ${sizeStyles[size]}`}
            data-testid="status-badge"
            data-variant={safeVariant}
        >
            {showDot && (
                <span
                    className={`rounded-full ${dotStyles[safeVariant]} ${dotSizeStyles[size]}`}
                    data-testid="status-badge-dot"
                />
            )}
            {label}
        </span>
    );
};
