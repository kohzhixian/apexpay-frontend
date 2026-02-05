import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { TransactionTable } from '../TransactionTable';
import type { Transaction } from '../../types';

/**
 * Property-based tests for TransactionTable loading state
 *
 * **Validates: Requirements 5.1, 5.2**
 * - Property 6: Loading state displays LoadingSkeleton (TransactionTable portion)
 * - Property 8: Rectangle variant for table row placeholders
 *
 * Feature: unused-components-integration
 */

// Generator for ISO date strings (safer than fc.date().map(toISOString))
const isoDateArbitrary = fc
    .integer({ min: 1577836800000, max: 1767225600000 }) // 2020-01-01 to 2025-12-31 in ms
    .map((timestamp) => new Date(timestamp).toISOString());

// Generator for transaction data
const transactionArbitrary = fc.record({
    id: fc.uuid(),
    type: fc.constantFrom('deposit', 'withdrawal', 'transfer') as fc.Arbitrary<'deposit' | 'withdrawal' | 'transfer'>,
    amount: fc.float({ min: Math.fround(0.01), max: Math.fround(100000), noNaN: true }),
    currency: fc.constantFrom('SGD', 'USD', 'EUR', 'GBP'),
    date: isoDateArbitrary,
    description: fc.string({ minLength: 1, maxLength: 100 }),
    status: fc.constantFrom('completed', 'pending', 'failed') as fc.Arbitrary<'completed' | 'pending' | 'failed'>,
});

// Generator for array of transactions
const transactionsArbitrary = fc.array(transactionArbitrary, { minLength: 0, maxLength: 10 });

// Generator for error messages
const errorMessageArbitrary = fc.oneof(
    fc.constant(null),
    fc.string({ minLength: 1, maxLength: 200 })
);

describe('TransactionTable Property Tests', () => {
    afterEach(() => {
        cleanup();
    });

    // Feature: unused-components-integration, Property 6: Loading state displays LoadingSkeleton
    describe('Property 6: Loading state displays LoadingSkeleton (TransactionTable portion)', () => {
        /**
         * **Validates: Requirements 5.1**
         *
         * For any component with a loading state (`TransactionTable`), when the loading flag is `true`,
         * the rendered output should contain at least one `LoadingSkeleton` component
         * (identified by `data-testid="loading-skeleton"`).
         */
        it('should display LoadingSkeleton when isLoading is true', async () => {
            await fc.assert(
                fc.asyncProperty(
                    transactionsArbitrary,
                    async (transactions) => {
                        cleanup();

                        render(
                            <TransactionTable
                                transactions={transactions as Transaction[]}
                                isLoading={true}
                                error={null}
                            />
                        );

                        // Verify: LoadingSkeleton components are displayed
                        const skeletons = screen.getAllByTestId('loading-skeleton');
                        expect(skeletons.length).toBeGreaterThanOrEqual(1);
                    }
                ),
                { numRuns: 100 }
            );
        }, 60000);

        it('should display exactly 5 LoadingSkeleton rows when loading (per requirement 5.3)', async () => {
            await fc.assert(
                fc.asyncProperty(
                    transactionsArbitrary,
                    async (transactions) => {
                        cleanup();

                        render(
                            <TransactionTable
                                transactions={transactions as Transaction[]}
                                isLoading={true}
                                error={null}
                            />
                        );

                        // Verify: exactly 5 LoadingSkeleton components for table row placeholders
                        const skeletons = screen.getAllByTestId('loading-skeleton');
                        expect(skeletons).toHaveLength(5);
                    }
                ),
                { numRuns: 100 }
            );
        }, 60000);

        it('should NOT display LoadingSkeleton when isLoading is false and data is available', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.array(transactionArbitrary, { minLength: 1, maxLength: 10 }),
                    async (transactions) => {
                        cleanup();

                        render(
                            <TransactionTable
                                transactions={transactions as Transaction[]}
                                isLoading={false}
                                error={null}
                            />
                        );

                        // Verify: no LoadingSkeleton components are displayed
                        const skeletons = screen.queryAllByTestId('loading-skeleton');
                        expect(skeletons).toHaveLength(0);
                    }
                ),
                { numRuns: 100 }
            );
        }, 60000);

        it('should NOT display LoadingSkeleton when isLoading is false and error is present', async () => {
            await fc.assert(
                fc.asyncProperty(
                    transactionsArbitrary,
                    fc.string({ minLength: 1, maxLength: 200 }),
                    async (transactions, errorMessage) => {
                        cleanup();

                        render(
                            <TransactionTable
                                transactions={transactions as Transaction[]}
                                isLoading={false}
                                error={errorMessage}
                            />
                        );

                        // Verify: no LoadingSkeleton components are displayed in error state
                        const skeletons = screen.queryAllByTestId('loading-skeleton');
                        expect(skeletons).toHaveLength(0);
                    }
                ),
                { numRuns: 100 }
            );
        }, 60000);

        it('should display LoadingSkeleton regardless of transactions array content when loading', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.oneof(
                        fc.constant([]),
                        fc.array(transactionArbitrary, { minLength: 1, maxLength: 20 })
                    ),
                    async (transactions) => {
                        cleanup();

                        render(
                            <TransactionTable
                                transactions={transactions as Transaction[]}
                                isLoading={true}
                                error={null}
                            />
                        );

                        // Verify: LoadingSkeleton is displayed regardless of transactions content
                        const skeletons = screen.getAllByTestId('loading-skeleton');
                        expect(skeletons.length).toBeGreaterThanOrEqual(1);
                    }
                ),
                { numRuns: 100 }
            );
        }, 60000);
    });

    // Feature: unused-components-integration, Property 8: Rectangle variant for table row placeholders
    describe('Property 8: Rectangle variant for table row placeholders', () => {
        /**
         * **Validates: Requirements 5.2**
         *
         * For any loading skeleton used as a placeholder for table rows in `TransactionTable`,
         * the `data-variant` attribute should be `"rectangle"`.
         */
        it('should use rectangle variant for table row placeholders', async () => {
            await fc.assert(
                fc.asyncProperty(
                    transactionsArbitrary,
                    async (transactions) => {
                        cleanup();

                        render(
                            <TransactionTable
                                transactions={transactions as Transaction[]}
                                isLoading={true}
                                error={null}
                            />
                        );

                        // Verify: all LoadingSkeleton components have rectangle variant
                        const skeletons = screen.getAllByTestId('loading-skeleton');
                        skeletons.forEach((skeleton) => {
                            expect(skeleton).toHaveAttribute('data-variant', 'rectangle');
                        });
                    }
                ),
                { numRuns: 100 }
            );
        }, 60000);

        it('should use rectangle variant for all 5 table row placeholders', async () => {
            await fc.assert(
                fc.asyncProperty(fc.constant(null), async () => {
                    cleanup();

                    render(
                        <TransactionTable
                            transactions={[]}
                            isLoading={true}
                            error={null}
                        />
                    );

                    // Verify: all 5 LoadingSkeleton components have rectangle variant
                    const skeletons = screen.getAllByTestId('loading-skeleton');
                    expect(skeletons).toHaveLength(5);
                    skeletons.forEach((skeleton) => {
                        expect(skeleton).toHaveAttribute('data-variant', 'rectangle');
                    });
                }),
                { numRuns: 100 }
            );
        }, 60000);

        it('should have correct height for table row placeholders (56px)', async () => {
            await fc.assert(
                fc.asyncProperty(fc.constant(null), async () => {
                    cleanup();

                    render(
                        <TransactionTable
                            transactions={[]}
                            isLoading={true}
                            error={null}
                        />
                    );

                    // Verify: LoadingSkeleton components have correct height (56px as per design)
                    const skeletons = screen.getAllByTestId('loading-skeleton');
                    skeletons.forEach((skeleton) => {
                        expect(skeleton.style.height).toBe('56px');
                    });
                }),
                { numRuns: 100 }
            );
        }, 60000);

        it('should have correct gap between table row placeholders (8px)', async () => {
            await fc.assert(
                fc.asyncProperty(fc.constant(null), async () => {
                    cleanup();

                    render(
                        <TransactionTable
                            transactions={[]}
                            isLoading={true}
                            error={null}
                        />
                    );

                    // Verify: skeleton group has correct gap (8px as per design)
                    const skeletonGroup = screen.getByTestId('loading-skeleton-group');
                    expect(skeletonGroup.style.gap).toBe('8px');
                }),
                { numRuns: 100 }
            );
        }, 60000);

        it('should maintain rectangle variant regardless of error prop value when loading', async () => {
            await fc.assert(
                fc.asyncProperty(
                    errorMessageArbitrary,
                    async (error) => {
                        cleanup();

                        render(
                            <TransactionTable
                                transactions={[]}
                                isLoading={true}
                                error={error}
                            />
                        );

                        // Verify: rectangle variant is used regardless of error prop
                        const skeletons = screen.getAllByTestId('loading-skeleton');
                        skeletons.forEach((skeleton) => {
                            expect(skeleton).toHaveAttribute('data-variant', 'rectangle');
                        });
                    }
                ),
                { numRuns: 100 }
            );
        }, 60000);
    });
});
