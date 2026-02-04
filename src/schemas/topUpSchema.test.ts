import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { topUpSchema } from './topUpSchema';

/**
 * Property-based tests for Top-Up Schema validation
 * 
 * **Validates: Requirements 2.6, 2.7**
 * - Requirement 2.6: WHEN defining a top-up schema, THE Validation_Schema SHALL require an amount greater than 0
 * - Requirement 2.7: WHEN defining a top-up schema, THE Validation_Schema SHALL require an amount with maximum 2 decimal places
 */

// Helper to create valid form data with a specific amount
const createFormData = (amount: string) => ({
    amount,
    currency: 'SGD',
    paymentMethod: 'card1',
});

describe('Top-Up Schema Property Tests', () => {
    // Feature: react-hook-form-integration, Property 4: Amount Positive Validation
    describe('Property 4: Amount Positive Validation', () => {
        /**
         * **Validates: Requirements 2.6**
         * 
         * For any numeric string input, the amount validation schema should accept 
         * amounts greater than 0 and reject amounts less than or equal to 0.
         */
        it('should accept positive amounts with valid decimal places', () => {
            fc.assert(
                fc.property(
                    // Generate positive numbers with 0-2 decimal places using integers
                    fc.tuple(
                        fc.integer({ min: 1, max: 100000 }),
                        fc.integer({ min: 0, max: 99 })
                    ).map(([whole, decimal]) =>
                        decimal === 0 ? whole.toString() : `${whole}.${decimal.toString().padStart(2, '0')}`
                    ),
                    (validAmount) => {
                        const result = topUpSchema.safeParse(createFormData(validAmount));
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject zero amount', () => {
            const result = topUpSchema.safeParse(createFormData('0'));
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some((i) => i.path.includes('amount'))
                ).toBe(true);
            }
        });

        it('should reject negative amounts', () => {
            fc.assert(
                fc.property(
                    fc.tuple(
                        fc.integer({ min: 1, max: 100000 }),
                        fc.integer({ min: 0, max: 99 })
                    ).map(([whole, decimal]) =>
                        decimal === 0 ? `-${whole}` : `-${whole}.${decimal.toString().padStart(2, '0')}`
                    ),
                    (negativeAmount) => {
                        const result = topUpSchema.safeParse(createFormData(negativeAmount));
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('amount'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject empty amount string', () => {
            const result = topUpSchema.safeParse(createFormData(''));
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some((i) => i.path.includes('amount'))
                ).toBe(true);
            }
        });

        it('should reject non-numeric strings', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 1 }).filter((s) => isNaN(parseFloat(s))),
                    (nonNumeric) => {
                        const result = topUpSchema.safeParse(createFormData(nonNumeric));
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('amount'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    // Feature: react-hook-form-integration, Property 5: Amount Decimal Precision Validation
    describe('Property 5: Amount Decimal Precision Validation', () => {
        /**
         * **Validates: Requirements 2.7**
         * 
         * For any numeric string input, the amount validation schema should accept 
         * amounts with 0, 1, or 2 decimal places and reject amounts with more than 
         * 2 decimal places.
         */
        it('should accept amounts with no decimal places', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 100000 }).map((n) => n.toString()),
                    (wholeNumber) => {
                        const result = topUpSchema.safeParse(createFormData(wholeNumber));
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should accept amounts with 1 decimal place', () => {
            fc.assert(
                fc.property(
                    fc.tuple(
                        fc.integer({ min: 1, max: 100000 }),
                        fc.integer({ min: 0, max: 9 })
                    ).map(([whole, decimal]) => `${whole}.${decimal}`),
                    (oneDecimal) => {
                        const result = topUpSchema.safeParse(createFormData(oneDecimal));
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should accept amounts with 2 decimal places', () => {
            fc.assert(
                fc.property(
                    fc.tuple(
                        fc.integer({ min: 1, max: 100000 }),
                        fc.integer({ min: 0, max: 99 })
                    ).map(([whole, decimal]) => `${whole}.${decimal.toString().padStart(2, '0')}`),
                    (twoDecimals) => {
                        const result = topUpSchema.safeParse(createFormData(twoDecimals));
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject amounts with more than 2 decimal places', () => {
            fc.assert(
                fc.property(
                    fc.tuple(
                        fc.integer({ min: 1, max: 100000 }),
                        fc.integer({ min: 100, max: 999999 })
                    ).map(([whole, decimal]) => `${whole}.${decimal}`),
                    (manyDecimals) => {
                        const result = topUpSchema.safeParse(createFormData(manyDecimals));
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('amount'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should accept boundary case: exactly 2 decimal places', () => {
            const testCases = ['10.00', '10.01', '10.99', '0.01', '0.10'];
            testCases.forEach((amount) => {
                const result = topUpSchema.safeParse(createFormData(amount));
                expect(result.success).toBe(true);
            });
        });

        it('should reject boundary case: exactly 3 decimal places', () => {
            const testCases = ['10.001', '10.010', '10.100', '0.001'];
            testCases.forEach((amount) => {
                const result = topUpSchema.safeParse(createFormData(amount));
                expect(result.success).toBe(false);
            });
        });
    });

    // Combined validation tests
    describe('Combined Amount Validation', () => {
        it('should accept valid positive amounts with proper decimal precision', () => {
            fc.assert(
                fc.property(
                    fc.tuple(
                        fc.integer({ min: 1, max: 100000 }),
                        fc.integer({ min: 0, max: 99 })
                    ).map(([whole, decimal]) =>
                        decimal === 0 ? whole.toString() : `${whole}.${decimal.toString().padStart(2, '0')}`
                    ),
                    (validAmount) => {
                        const result = topUpSchema.safeParse(createFormData(validAmount));
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject amounts that are both negative and have too many decimals', () => {
            fc.assert(
                fc.property(
                    fc.tuple(
                        fc.integer({ min: -100000, max: -1 }),
                        fc.integer({ min: 100, max: 999999 })
                    ).map(([whole, decimal]) => `${whole}.${decimal}`),
                    (invalidAmount) => {
                        const result = topUpSchema.safeParse(createFormData(invalidAmount));
                        expect(result.success).toBe(false);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    // Currency and payment method validation
    describe('Currency and Payment Method Validation', () => {
        it('should require currency field', () => {
            const result = topUpSchema.safeParse({
                amount: '100.00',
                currency: '',
                paymentMethod: 'card1',
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some((i) => i.path.includes('currency'))
                ).toBe(true);
            }
        });

        it('should require payment method field', () => {
            const result = topUpSchema.safeParse({
                amount: '100.00',
                currency: 'SGD',
                paymentMethod: '',
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some((i) => i.path.includes('paymentMethod'))
                ).toBe(true);
            }
        });

        it('should accept valid currency codes', () => {
            const currencies = ['SGD', 'USD', 'EUR', 'GBP'];
            currencies.forEach((currency) => {
                const result = topUpSchema.safeParse({
                    amount: '100.00',
                    currency,
                    paymentMethod: 'card1',
                });
                expect(result.success).toBe(true);
            });
        });
    });
});
