import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { createTransferSchema } from './transferSchema';

/**
 * Property-based tests for Transfer Schema validation
 * 
 * **Validates: Requirements 2.8, 2.9, 2.10**
 * - Requirement 2.8: WHEN defining a transfer schema, THE Validation_Schema SHALL require a non-empty recipient field
 * - Requirement 2.9: WHEN defining a transfer schema, THE Validation_Schema SHALL require an amount greater than 0 and less than or equal to the available balance
 * - Requirement 2.10: WHEN defining a transfer schema, THE Validation_Schema SHALL allow an optional note field with maximum 200 characters
 */

// Default balance for testing
const DEFAULT_BALANCE = 1000;

// Helper to create valid form data
const createFormData = (recipient: string, amount: string, note?: string) => ({
    recipient,
    amount,
    note: note ?? '',
});

describe('Transfer Schema Property Tests', () => {
    // Feature: react-hook-form-integration, Property 6: Recipient Required Validation
    describe('Property 6: Recipient Required Validation', () => {
        /**
         * **Validates: Requirements 2.8**
         * 
         * For any string input, the recipient validation schema should accept non-empty 
         * strings (after trimming whitespace) and reject empty strings or strings 
         * containing only whitespace.
         */
        it('should accept valid recipient strings (3+ characters)', () => {
            const schema = createTransferSchema(DEFAULT_BALANCE);
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9@._-]{3,50}$/),
                    (validRecipient) => {
                        const result = schema.safeParse(createFormData(validRecipient, '100.00'));
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject empty recipient string', () => {
            const schema = createTransferSchema(DEFAULT_BALANCE);
            const result = schema.safeParse(createFormData('', '100.00'));
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some((i) => i.path.includes('recipient'))
                ).toBe(true);
            }
        });

        it('should reject recipient strings with fewer than 3 characters', () => {
            const schema = createTransferSchema(DEFAULT_BALANCE);
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9]{1,2}$/),
                    (shortRecipient) => {
                        const result = schema.safeParse(createFormData(shortRecipient, '100.00'));
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('recipient'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should accept recipient at exactly 3 characters boundary', () => {
            const schema = createTransferSchema(DEFAULT_BALANCE);
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9]{3}$/),
                    (boundaryRecipient) => {
                        const result = schema.safeParse(createFormData(boundaryRecipient, '100.00'));
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });


    // Feature: react-hook-form-integration, Property 7: Amount Balance Validation
    describe('Property 7: Amount Balance Validation', () => {
        /**
         * **Validates: Requirements 2.9**
         * 
         * For any numeric string input and any positive balance value, the transfer 
         * amount validation schema should accept amounts greater than 0 and less than 
         * or equal to the balance, and reject amounts outside this range.
         */
        it('should accept amounts within balance', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 100, max: 10000 }),  // Balance in cents
                    fc.integer({ min: 1, max: 100 }),      // Percentage of balance (1-100%)
                    (balanceCents, percentage) => {
                        const balance = balanceCents / 100;
                        const amount = (balance * percentage / 100).toFixed(2);
                        const schema = createTransferSchema(balance);

                        const result = schema.safeParse(createFormData('test@example.com', amount));
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should accept amount exactly equal to balance', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 100, max: 100000 }).map((n) => n / 100),
                    (balance) => {
                        const schema = createTransferSchema(balance);
                        const result = schema.safeParse(
                            createFormData('test@example.com', balance.toFixed(2))
                        );
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject amounts exceeding balance', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 100, max: 10000 }),  // Balance in cents
                    fc.integer({ min: 1, max: 1000 }),     // Extra cents above balance
                    (balanceCents, extraCents) => {
                        const balance = balanceCents / 100;
                        const amount = ((balanceCents + extraCents) / 100).toFixed(2);
                        const schema = createTransferSchema(balance);

                        const result = schema.safeParse(createFormData('test@example.com', amount));
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

        it('should reject zero amount', () => {
            const schema = createTransferSchema(DEFAULT_BALANCE);
            const result = schema.safeParse(createFormData('test@example.com', '0'));
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some((i) => i.path.includes('amount'))
                ).toBe(true);
            }
        });

        it('should reject negative amounts', () => {
            const schema = createTransferSchema(DEFAULT_BALANCE);
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 10000 }).map((n) => `-${(n / 100).toFixed(2)}`),
                    (negativeAmount) => {
                        const result = schema.safeParse(createFormData('test@example.com', negativeAmount));
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
            const schema = createTransferSchema(DEFAULT_BALANCE);
            const result = schema.safeParse(createFormData('test@example.com', ''));
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some((i) => i.path.includes('amount'))
                ).toBe(true);
            }
        });
    });

    // Feature: react-hook-form-integration, Property 8: Note Length Validation
    describe('Property 8: Note Length Validation', () => {
        /**
         * **Validates: Requirements 2.10**
         * 
         * For any string input, the note validation schema should accept strings 
         * with 0 to 200 characters and reject strings exceeding 200 characters.
         */
        it('should accept notes with 0 to 200 characters', () => {
            const schema = createTransferSchema(DEFAULT_BALANCE);
            fc.assert(
                fc.property(
                    fc.string({ minLength: 0, maxLength: 200 }),
                    (validNote) => {
                        const result = schema.safeParse(
                            createFormData('test@example.com', '100.00', validNote)
                        );
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject notes exceeding 200 characters', () => {
            const schema = createTransferSchema(DEFAULT_BALANCE);
            fc.assert(
                fc.property(
                    fc.string({ minLength: 201, maxLength: 500 }),
                    (longNote) => {
                        const result = schema.safeParse(
                            createFormData('test@example.com', '100.00', longNote)
                        );
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('note'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should accept note at exactly 200 characters boundary', () => {
            const schema = createTransferSchema(DEFAULT_BALANCE);
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9 ]{200}$/),
                    (boundaryNote) => {
                        const result = schema.safeParse(
                            createFormData('test@example.com', '100.00', boundaryNote)
                        );
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject note at exactly 201 characters boundary', () => {
            const schema = createTransferSchema(DEFAULT_BALANCE);
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9 ]{201}$/),
                    (boundaryNote) => {
                        const result = schema.safeParse(
                            createFormData('test@example.com', '100.00', boundaryNote)
                        );
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('note'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should accept empty note (optional field)', () => {
            const schema = createTransferSchema(DEFAULT_BALANCE);
            const result = schema.safeParse(createFormData('test@example.com', '100.00', ''));
            expect(result.success).toBe(true);
        });

        it('should accept undefined note (optional field)', () => {
            const schema = createTransferSchema(DEFAULT_BALANCE);
            const result = schema.safeParse({
                recipient: 'test@example.com',
                amount: '100.00',
            });
            expect(result.success).toBe(true);
        });
    });

    // Combined validation tests
    describe('Combined Transfer Validation', () => {
        it('should accept valid transfer with all fields', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9@._-]{3,30}$/),
                    fc.integer({ min: 100, max: 10000 }),
                    fc.integer({ min: 1, max: 99 }),
                    fc.string({ minLength: 0, maxLength: 200 }),
                    (recipient, balanceCents, percentage, note) => {
                        const balance = balanceCents / 100;
                        const amount = (balance * percentage / 100).toFixed(2);
                        const schema = createTransferSchema(balance);

                        const result = schema.safeParse(createFormData(recipient, amount, note));
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject when all fields are invalid', () => {
            const schema = createTransferSchema(100);
            const result = schema.safeParse(createFormData('ab', '200.00', 'a'.repeat(201)));
            expect(result.success).toBe(false);
            if (!result.success) {
                // Should have errors for recipient, amount, and note
                const hasRecipientError = result.error.issues.some((i) =>
                    i.path.includes('recipient')
                );
                const hasAmountError = result.error.issues.some((i) =>
                    i.path.includes('amount')
                );
                const hasNoteError = result.error.issues.some((i) =>
                    i.path.includes('note')
                );
                expect(hasRecipientError).toBe(true);
                expect(hasAmountError).toBe(true);
                expect(hasNoteError).toBe(true);
            }
        });
    });
});
