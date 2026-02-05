/**
 * LoadingSkeleton Component
 *
 * A shimmer loading placeholder component that displays animated loading states
 * while data is being fetched. Supports different shape variants and can render
 * multiple skeleton items in a group.
 *
 * @example
 * // Basic text skeleton
 * <LoadingSkeleton variant="text" />
 *
 * // Circle avatar skeleton
 * <LoadingSkeleton variant="circle" width="48px" height="48px" />
 *
 * // Multiple text lines
 * <LoadingSkeleton variant="text" count={3} gap="8px" />
 *
 * // Card skeleton
 * <LoadingSkeleton variant="card" width="100%" height="200px" />
 */

type SkeletonVariant = 'text' | 'circle' | 'rectangle' | 'card';

interface LoadingSkeletonProps {
    /** Shape variant */
    variant?: SkeletonVariant;
    /** Width (CSS value or Tailwind class) */
    width?: string;
    /** Height (CSS value or Tailwind class) */
    height?: string;
    /** Number of skeleton items to render */
    count?: number;
    /** Gap between items when count > 1 */
    gap?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Default dimensions for each variant
 */
const variantDefaults: Record<SkeletonVariant, { width: string; height: string }> = {
    text: { width: '100%', height: '16px' },
    circle: { width: '40px', height: '40px' },
    rectangle: { width: '100%', height: '100px' },
    card: { width: '100%', height: '150px' },
};

/**
 * Shape styles for each variant
 */
const variantStyles: Record<SkeletonVariant, string> = {
    text: 'rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
    card: 'rounded-xl',
};

/**
 * Checks if a value is a Tailwind class (starts with common Tailwind prefixes)
 * @param value - The value to check
 * @returns True if the value appears to be a Tailwind class
 */
const isTailwindClass = (value: string): boolean => {
    const tailwindPrefixes = ['w-', 'h-', 'min-', 'max-', 'size-'];
    return tailwindPrefixes.some((prefix) => value.startsWith(prefix));
};

/**
 * A reusable loading skeleton component for displaying placeholder states
 * while data is being fetched.
 *
 * @param variant - Shape variant (text, circle, rectangle, card). Default: 'text'
 * @param width - Width as CSS value or Tailwind class. Uses variant default if not provided
 * @param height - Height as CSS value or Tailwind class. Uses variant default if not provided
 * @param count - Number of skeleton items to render. Default: 1
 * @param gap - Gap between items when count > 1. Default: '8px'
 * @param className - Additional CSS classes
 * @returns A styled skeleton loading element or group of elements
 */
export const LoadingSkeleton = ({
    variant = 'text',
    width,
    height,
    count = 1,
    gap = '8px',
    className = '',
}: LoadingSkeletonProps) => {
    // Validate count - default to 1 for invalid values (0, negative)
    const safeCount = count > 0 ? count : 1;

    // Get default dimensions for the variant
    const defaults = variantDefaults[variant];
    const finalWidth = width || defaults.width;
    const finalHeight = height || defaults.height;

    // Determine if width/height are Tailwind classes or CSS values
    const widthIsTailwind = isTailwindClass(finalWidth);
    const heightIsTailwind = isTailwindClass(finalHeight);

    // Build the style object for CSS values
    const style: React.CSSProperties = {
        ...(widthIsTailwind ? {} : { width: finalWidth }),
        ...(heightIsTailwind ? {} : { height: finalHeight }),
    };

    // Build the className for Tailwind classes
    const dimensionClasses = [
        widthIsTailwind ? finalWidth : '',
        heightIsTailwind ? finalHeight : '',
    ]
        .filter(Boolean)
        .join(' ');

    /**
     * Renders a single skeleton element with shimmer effect
     */
    const renderSkeleton = (index: number) => (
        <div
            key={index}
            className={`shimmer ${variantStyles[variant]} ${dimensionClasses} ${className}`}
            style={style}
            data-testid="loading-skeleton"
            data-variant={variant}
            aria-hidden="true"
        />
    );

    // If only one item, render directly without wrapper
    if (safeCount === 1) {
        return renderSkeleton(0);
    }

    // Render multiple items in a flex container
    return (
        <div
            className="flex flex-col"
            style={{ gap }}
            data-testid="loading-skeleton-group"
        >
            {Array.from({ length: safeCount }, (_, index) => renderSkeleton(index))}
        </div>
    );
};
