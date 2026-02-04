import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { LoadingSkeleton } from '../LoadingSkeleton';

/**
 * Property-based tests for LoadingSkeleton component
 *
 * **Validates: Requirements 6.1, 6.2, 6.4**
 * - Property 11: LoadingSkeleton shape variants
 * - Property 12: LoadingSkeleton dimension props
 * - Property 13: LoadingSkeleton count rendering
 *
 * Feature: codebase-improvements
 */

// Valid skeleton variants as defined in the component
const validVariants = ['text', 'circle', 'rectangle', 'card'] as const;
type SkeletonVariant = (typeof validVariants)[number];

// Expected shape classes for each variant (based on LoadingSkeleton implementation)
const variantShapeClasses: Record<SkeletonVariant, string> = {
    text: 'rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
    card: 'rounded-xl',
};

// Default dimensions for each variant
const variantDefaults: Record<SkeletonVariant, { width: string; height: string }> = {
    text: { width: '100%', height: '16px' },
    circle: { width: '40px', height: '40px' },
    rectangle: { width: '100%', height: '100px' },
    card: { width: '100%', height: '150px' },
};

// Custom generators
const variantArbitrary = fc.constantFrom(...validVariants);

// Generate valid CSS dimension values (px, rem, em, %, or plain numbers)
const cssDimensionArbitrary = fc.oneof(
    // Pixel values
    fc.integer({ min: 1, max: 500 }).map((n) => `${n}px`),
    // Percentage values
    fc.integer({ min: 1, max: 100 }).map((n) => `${n}%`),
    // Rem values
    fc.integer({ min: 1, max: 20 }).map((n) => `${n}rem`)
);

// Generate valid count values (1 to 10)
const countArbitrary = fc.integer({ min: 1, max: 10 });

// Generate invalid count values (0 or negative)
const invalidCountArbitrary = fc.integer({ min: -10, max: 0 });

// Generate gap values
const gapArbitrary = fc.oneof(
    fc.integer({ min: 1, max: 32 }).map((n) => `${n}px`),
    fc.integer({ min: 1, max: 4 }).map((n) => `${n}rem`)
);

describe('LoadingSkeleton Property Tests', () => {
    afterEach(() => {
        cleanup();
    });

    // Feature: codebase-improvements, Property 11: LoadingSkeleton shape variants
    describe('Property 11: LoadingSkeleton shape variants', () => {
        /**
         * **Validates: Requirements 6.1**
         *
         * For any LoadingSkeleton with a variant (text, circle, rectangle, card),
         * the component SHALL render with the appropriate shape styling for that variant.
         */
        it('should render correct shape class for each variant', async () => {
            await fc.assert(
                fc.asyncProperty(variantArbitrary, async (variant) => {
                    cleanup();
                    render(<LoadingSkeleton variant={variant} />);

                    const skeleton = screen.getByTestId('loading-skeleton');

                    // Verify the skeleton exists and has the correct variant data attribute
                    expect(skeleton).toBeInTheDocument();
                    expect(skeleton).toHaveAttribute('data-variant', variant);

                    // Verify the skeleton has the correct shape class for the variant
                    const expectedShapeClass = variantShapeClasses[variant];
                    expect(skeleton.className).toContain(expectedShapeClass);
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should apply animate-pulse class for shimmer effect', async () => {
            await fc.assert(
                fc.asyncProperty(variantArbitrary, async (variant) => {
                    cleanup();
                    render(<LoadingSkeleton variant={variant} />);

                    const skeleton = screen.getByTestId('loading-skeleton');

                    // Verify the shimmer animation class is applied
                    expect(skeleton.className).toContain('animate-pulse');
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should apply background color class for skeleton appearance', async () => {
            await fc.assert(
                fc.asyncProperty(variantArbitrary, async (variant) => {
                    cleanup();
                    render(<LoadingSkeleton variant={variant} />);

                    const skeleton = screen.getByTestId('loading-skeleton');

                    // Verify the background color class is applied
                    expect(skeleton.className).toContain('bg-slate-700/50');
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should use default variant (text) when not specified', async () => {
            cleanup();
            render(<LoadingSkeleton />);

            const skeleton = screen.getByTestId('loading-skeleton');

            // Verify default variant is 'text'
            expect(skeleton).toHaveAttribute('data-variant', 'text');
            expect(skeleton.className).toContain(variantShapeClasses.text);
        });
    });

    // Feature: codebase-improvements, Property 12: LoadingSkeleton dimension props
    describe('Property 12: LoadingSkeleton dimension props', () => {
        /**
         * **Validates: Requirements 6.2**
         *
         * For any LoadingSkeleton with width and height props,
         * the rendered element SHALL have those dimensions applied.
         */
        it('should apply custom width and height as inline styles', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    cssDimensionArbitrary,
                    cssDimensionArbitrary,
                    async (variant, width, height) => {
                        cleanup();
                        render(
                            <LoadingSkeleton
                                variant={variant}
                                width={width}
                                height={height}
                            />
                        );

                        const skeleton = screen.getByTestId('loading-skeleton');

                        // Verify the dimensions are applied as inline styles
                        expect(skeleton.style.width).toBe(width);
                        expect(skeleton.style.height).toBe(height);
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should use default dimensions when width and height are not provided', async () => {
            await fc.assert(
                fc.asyncProperty(variantArbitrary, async (variant) => {
                    cleanup();
                    render(<LoadingSkeleton variant={variant} />);

                    const skeleton = screen.getByTestId('loading-skeleton');
                    const defaults = variantDefaults[variant];

                    // Verify default dimensions are applied
                    expect(skeleton.style.width).toBe(defaults.width);
                    expect(skeleton.style.height).toBe(defaults.height);
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should apply only width when height is not provided', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    cssDimensionArbitrary,
                    async (variant, width) => {
                        cleanup();
                        render(<LoadingSkeleton variant={variant} width={width} />);

                        const skeleton = screen.getByTestId('loading-skeleton');
                        const defaults = variantDefaults[variant];

                        // Verify custom width is applied
                        expect(skeleton.style.width).toBe(width);
                        // Verify default height is used
                        expect(skeleton.style.height).toBe(defaults.height);
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should apply only height when width is not provided', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    cssDimensionArbitrary,
                    async (variant, height) => {
                        cleanup();
                        render(<LoadingSkeleton variant={variant} height={height} />);

                        const skeleton = screen.getByTestId('loading-skeleton');
                        const defaults = variantDefaults[variant];

                        // Verify default width is used
                        expect(skeleton.style.width).toBe(defaults.width);
                        // Verify custom height is applied
                        expect(skeleton.style.height).toBe(height);
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });

    // Feature: codebase-improvements, Property 13: LoadingSkeleton count rendering
    describe('Property 13: LoadingSkeleton count rendering', () => {
        /**
         * **Validates: Requirements 6.4**
         *
         * For any LoadingSkeleton with a count prop greater than 1,
         * exactly that many skeleton elements SHALL be rendered.
         */
        it('should render exactly count number of skeleton elements', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    countArbitrary,
                    async (variant, count) => {
                        cleanup();
                        render(<LoadingSkeleton variant={variant} count={count} />);

                        const skeletons = screen.getAllByTestId('loading-skeleton');

                        // Verify exactly count number of skeletons are rendered
                        expect(skeletons).toHaveLength(count);
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render single skeleton without wrapper when count is 1', async () => {
            await fc.assert(
                fc.asyncProperty(variantArbitrary, async (variant) => {
                    cleanup();
                    render(<LoadingSkeleton variant={variant} count={1} />);

                    const skeletons = screen.getAllByTestId('loading-skeleton');
                    const group = screen.queryByTestId('loading-skeleton-group');

                    // Verify single skeleton is rendered
                    expect(skeletons).toHaveLength(1);
                    // Verify no wrapper group is rendered for single item
                    expect(group).not.toBeInTheDocument();
                }),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render skeletons in a group container when count > 1', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    fc.integer({ min: 2, max: 10 }),
                    async (variant, count) => {
                        cleanup();
                        render(<LoadingSkeleton variant={variant} count={count} />);

                        const group = screen.getByTestId('loading-skeleton-group');
                        const skeletons = screen.getAllByTestId('loading-skeleton');

                        // Verify group container exists
                        expect(group).toBeInTheDocument();
                        // Verify correct number of skeletons in group
                        expect(skeletons).toHaveLength(count);
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should apply gap style to group container when count > 1', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    fc.integer({ min: 2, max: 10 }),
                    gapArbitrary,
                    async (variant, count, gap) => {
                        cleanup();
                        render(
                            <LoadingSkeleton variant={variant} count={count} gap={gap} />
                        );

                        const group = screen.getByTestId('loading-skeleton-group');

                        // Verify gap is applied to the group container
                        expect(group.style.gap).toBe(gap);
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should default to 1 skeleton for invalid count values (0 or negative)', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    invalidCountArbitrary,
                    async (variant, count) => {
                        cleanup();
                        render(<LoadingSkeleton variant={variant} count={count} />);

                        const skeletons = screen.getAllByTestId('loading-skeleton');

                        // Verify exactly 1 skeleton is rendered for invalid counts
                        expect(skeletons).toHaveLength(1);
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render each skeleton with correct variant styling when count > 1', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    fc.integer({ min: 2, max: 5 }),
                    async (variant, count) => {
                        cleanup();
                        render(<LoadingSkeleton variant={variant} count={count} />);

                        const skeletons = screen.getAllByTestId('loading-skeleton');
                        const expectedShapeClass = variantShapeClasses[variant];

                        // Verify each skeleton has the correct variant styling
                        skeletons.forEach((skeleton) => {
                            expect(skeleton).toHaveAttribute('data-variant', variant);
                            expect(skeleton.className).toContain(expectedShapeClass);
                            expect(skeleton.className).toContain('animate-pulse');
                        });
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should apply dimensions to all skeletons when count > 1', async () => {
            await fc.assert(
                fc.asyncProperty(
                    variantArbitrary,
                    fc.integer({ min: 2, max: 5 }),
                    cssDimensionArbitrary,
                    cssDimensionArbitrary,
                    async (variant, count, width, height) => {
                        cleanup();
                        render(
                            <LoadingSkeleton
                                variant={variant}
                                count={count}
                                width={width}
                                height={height}
                            />
                        );

                        const skeletons = screen.getAllByTestId('loading-skeleton');

                        // Verify each skeleton has the correct dimensions
                        skeletons.forEach((skeleton) => {
                            expect(skeleton.style.width).toBe(width);
                            expect(skeleton.style.height).toBe(height);
                        });
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });
});
