import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { StatusBadge } from '../StatusBadge';

/**
 * Property-based tests for StatusBadge component
 *
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
 * - Property 9: StatusBadge renders variant styling and label correctly
 * - Property 10: StatusBadge dot indicator visibility
 *
 * Feature: codebase-improvements
 */

// Valid status variants as defined in the component
const validVariants = ['success', 'pending', 'failed', 'cancelled', 'info'] as const;
type StatusVariant = (typeof validVariants)[number];

// Expected color classes for each variant (based on StatusBadge implementation)
const variantColorClasses: Record<StatusVariant, string[]> = {
    success: ['bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/20'],
    pending: ['bg-slate-500/10', 'text-slate-400', 'border-white/10'],
    failed: ['bg-rose-500/10', 'text-rose-400', 'border-rose-500/20'],
    cancelled: ['bg-rose-500/10', 'text-rose-400', 'border-rose-500/20'],
    info: ['bg-blue-500/10', 'text-blue-400', 'border-blue-500/20'],
};

// Expected dot color classes for each variant
const variantDotClasses: Record<StatusVariant, string> = {
    success: 'bg-emerald-400',
    pending: 'bg-slate-400',
    failed: 'bg-rose-400',
    cancelled: 'bg-rose-400',
    info: 'bg-blue-400',
};

// Custom generators
const variantArbitrary = fc.constantFrom(...validVariants);

// Generate non-empty label strings (alphanumeric with spaces, reasonable length)
const labelArbitrary = fc
    .stringMatching(/^[a-zA-Z][a-zA-Z0-9 ]{0,29}$/)
    .filter((s) => s.trim().length > 0);

const sizeArbitrary = fc.constantFrom('sm', 'md');

const showDotArbitrary = fc.boolean();

describe('StatusBadge Property Tests', () => {
    afterEach(() => {
        cleanup();
    });

    // Feature: codebase-improvements, Property 9: StatusBadge renders variant styling and label correctly
    describe('Property 9: StatusBadge renders variant styling and label correctly', () => {
        /**
         * **Validates: Requirements 5.1, 5.2, 5.4**
         *
         * For any StatusBadge with a valid variant (success, pending, failed, cancelled, info)
         * and label, the component SHALL render with the correct color scheme and display
         * the provided label text.
         */
        it('should render correct color scheme for each variant', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    labelArbitrary,
                    sizeArbitrary,
                    async (variant, label, size) => {
                        cleanup();
                        render(
                            <StatusBadge
                                variant={variant}
                                label={label}
                                size={size as 'sm' | 'md'}
                            />
                        );

                        const badge = screen.getByTestId('status-badge');

                        // Verify the badge exists and has the correct variant data attribute
                        expect(badge).toBeInTheDocument();
                        expect(badge).toHaveAttribute('data-variant', variant);

                        // Verify the badge has the correct color classes for the variant
                        const expectedClasses = variantColorClasses[variant];
                        expectedClasses.forEach((className) => {
                            expect(badge.className).toContain(className);
                        });
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should display the provided label text', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    labelArbitrary,
                    async (variant, label) => {
                        cleanup();
                        render(<StatusBadge variant={variant} label={label} />);

                        const badge = screen.getByTestId('status-badge');

                        // Verify the label text is displayed
                        // Note: Browser normalizes whitespace in text content, so we compare trimmed values
                        expect(badge.textContent?.trim()).toBe(label.trim());
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should apply correct size styling', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    labelArbitrary,
                    sizeArbitrary,
                    async (variant, label, size) => {
                        cleanup();
                        render(
                            <StatusBadge
                                variant={variant}
                                label={label}
                                size={size as 'sm' | 'md'}
                            />
                        );

                        const badge = screen.getByTestId('status-badge');

                        // Verify size-specific classes are applied
                        if (size === 'sm') {
                            expect(badge.className).toContain('px-2');
                            expect(badge.className).toContain('py-0.5');
                        } else {
                            expect(badge.className).toContain('px-3');
                            expect(badge.className).toContain('py-1');
                        }
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });

    // Feature: codebase-improvements, Property 10: StatusBadge dot indicator visibility
    describe('Property 10: StatusBadge dot indicator visibility', () => {
        /**
         * **Validates: Requirements 5.3**
         *
         * For any StatusBadge, when showDot is true the status dot SHALL be visible,
         * and when showDot is false or undefined the dot SHALL NOT be visible.
         */
        it('should show dot when showDot is true', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    labelArbitrary,
                    async (variant, label) => {
                        cleanup();
                        render(
                            <StatusBadge variant={variant} label={label} showDot={true} />
                        );

                        // Verify the dot is visible
                        const dot = screen.getByTestId('status-badge-dot');
                        expect(dot).toBeInTheDocument();

                        // Verify the dot has the correct color class for the variant
                        const expectedDotClass = variantDotClasses[variant];
                        expect(dot.className).toContain(expectedDotClass);
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should hide dot when showDot is false', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    labelArbitrary,
                    async (variant, label) => {
                        cleanup();
                        render(
                            <StatusBadge variant={variant} label={label} showDot={false} />
                        );

                        // Verify the dot is NOT visible
                        const dot = screen.queryByTestId('status-badge-dot');
                        expect(dot).not.toBeInTheDocument();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should hide dot when showDot is undefined (default)', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    labelArbitrary,
                    async (variant, label) => {
                        cleanup();
                        render(<StatusBadge variant={variant} label={label} />);

                        // Verify the dot is NOT visible when showDot is not provided
                        const dot = screen.queryByTestId('status-badge-dot');
                        expect(dot).not.toBeInTheDocument();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should show correct dot size based on size prop', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    labelArbitrary,
                    sizeArbitrary,
                    async (variant, label, size) => {
                        cleanup();
                        render(
                            <StatusBadge
                                variant={variant}
                                label={label}
                                showDot={true}
                                size={size as 'sm' | 'md'}
                            />
                        );

                        const dot = screen.getByTestId('status-badge-dot');

                        // Verify dot size classes match the size prop
                        if (size === 'sm') {
                            expect(dot.className).toContain('w-1.5');
                            expect(dot.className).toContain('h-1.5');
                        } else {
                            expect(dot.className).toContain('w-2');
                            expect(dot.className).toContain('h-2');
                        }
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should toggle dot visibility correctly for any showDot value', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    labelArbitrary,
                    showDotArbitrary,
                    async (variant, label, showDot) => {
                        cleanup();
                        render(
                            <StatusBadge
                                variant={variant}
                                label={label}
                                showDot={showDot}
                            />
                        );

                        const dot = screen.queryByTestId('status-badge-dot');

                        if (showDot) {
                            expect(dot).toBeInTheDocument();
                        } else {
                            expect(dot).not.toBeInTheDocument();
                        }
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });
});
