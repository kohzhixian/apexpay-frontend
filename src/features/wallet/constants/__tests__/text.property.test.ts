import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
    DASHBOARD_TEXT,
    MODAL_TEXT,
    TRANSACTION_HISTORY_TEXT,
    PORTFOLIO_INSIGHTS_TEXT,
    DYNAMIC_TEXT,
} from '../text';

/**
 * Property-based tests for template functions in wallet constants
 *
 * **Validates: Requirements 1.4**
 * - Property 1: Template functions produce correct output
 *
 * Feature: codebase-improvements
 */

// Custom generators for realistic input values
const userNameArbitrary = fc
    .stringMatching(/^[a-zA-Z][a-zA-Z0-9 ]{0,49}$/)
    .filter((s) => s.trim().length > 0);

const currencyArbitrary = fc.constantFrom('SGD', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD');

const walletNameArbitrary = fc
    .stringMatching(/^[a-zA-Z][a-zA-Z0-9 ]{0,49}$/)
    .filter((s) => s.trim().length > 0);

const percentArbitrary = fc.integer({ min: -100, max: 1000 });

const positiveIntArbitrary = fc.integer({ min: 0, max: 10000 });

// Generate valid hex addresses (like wallet/ledger addresses)
const hexChars = '0123456789abcdef';
const addressArbitrary = fc
    .array(fc.constantFrom(...hexChars.split('')), { minLength: 20, maxLength: 64 })
    .map((chars) => `0x${chars.join('')}`);

describe('Template Functions Property Tests', () => {
    // Feature: codebase-improvements, Property 1: Template functions produce correct output
    describe('Property 1: Template functions produce correct output', () => {
        /**
         * **Validates: Requirements 1.4**
         *
         * For any input string passed to a template function in a constants file,
         * the returned string SHALL contain the original input value.
         */

        describe('WELCOME_BACK_USER', () => {
            it('should contain the user name in the output', () => {
                fc.assert(
                    fc.property(userNameArbitrary, (userName) => {
                        const result = DASHBOARD_TEXT.WELCOME_BACK_USER(userName);

                        // The result should be a string
                        expect(typeof result).toBe('string');

                        // The result should contain the original input value
                        expect(result).toContain(userName);

                        // The result should follow the expected format
                        expect(result).toBe(`Welcome back, ${userName}`);
                    }),
                    { numRuns: 100 }
                );
            });
        });

        describe('APEX_WALLET', () => {
            it('should contain the currency in the output', () => {
                fc.assert(
                    fc.property(currencyArbitrary, (currency) => {
                        const result = MODAL_TEXT.APEX_WALLET(currency);

                        // The result should be a string
                        expect(typeof result).toBe('string');

                        // The result should contain the original input value
                        expect(result).toContain(currency);

                        // The result should follow the expected format
                        expect(result).toBe(`Apex Wallet (${currency})`);
                    }),
                    { numRuns: 100 }
                );
            });
        });

        describe('SHOWING_TRANSACTIONS_FOR', () => {
            it('should contain the wallet name in the output', () => {
                fc.assert(
                    fc.property(walletNameArbitrary, (walletName) => {
                        const result =
                            TRANSACTION_HISTORY_TEXT.SHOWING_TRANSACTIONS_FOR(walletName);

                        // The result should be a string
                        expect(typeof result).toBe('string');

                        // The result should contain the original input value
                        expect(result).toContain(walletName);

                        // The result should follow the expected format
                        expect(result).toBe(`Showing transactions for ${walletName}`);
                    }),
                    { numRuns: 100 }
                );
            });
        });

        describe('PERFORMANCE_MESSAGE', () => {
            it('should contain both wallet name and percent in the output', () => {
                fc.assert(
                    fc.property(
                        walletNameArbitrary,
                        percentArbitrary,
                        (walletName, percent) => {
                            const result = PORTFOLIO_INSIGHTS_TEXT.PERFORMANCE_MESSAGE(
                                walletName,
                                percent
                            );

                            // The result should be a string
                            expect(typeof result).toBe('string');

                            // The result should contain the original input values
                            expect(result).toContain(walletName);
                            expect(result).toContain(String(percent));

                            // The result should follow the expected format
                            expect(result).toBe(
                                `Your ${walletName} wallet is performing ${percent}% better than the platform average this month. Consider adding more funds to maximize yield.`
                            );
                        }
                    ),
                    { numRuns: 100 }
                );
            });
        });

        describe('DYNAMIC_TEXT functions', () => {
            describe('CHARACTER_COUNT', () => {
                it('should contain both current and max values in the output', () => {
                    fc.assert(
                        fc.property(
                            positiveIntArbitrary,
                            positiveIntArbitrary,
                            (current, max) => {
                                const result = DYNAMIC_TEXT.CHARACTER_COUNT(current, max);

                                // The result should be a string
                                expect(typeof result).toBe('string');

                                // The result should contain the original input values
                                expect(result).toContain(String(current));
                                expect(result).toContain(String(max));

                                // The result should follow the expected format
                                expect(result).toBe(`${current}/${max}`);
                            }
                        ),
                        { numRuns: 100 }
                    );
                });
            });

            describe('TRUNCATED_ADDRESS', () => {
                it('should contain prefix and suffix of the original address', () => {
                    fc.assert(
                        fc.property(addressArbitrary, (address) => {
                            const prefixLength = 8;
                            const suffixLength = 10;
                            const result = DYNAMIC_TEXT.TRUNCATED_ADDRESS(
                                address,
                                prefixLength,
                                suffixLength
                            );

                            // The result should be a string
                            expect(typeof result).toBe('string');

                            // The result should contain the prefix of the original address
                            const expectedPrefix = address.slice(0, prefixLength);
                            expect(result).toContain(expectedPrefix);

                            // The result should contain the suffix of the original address
                            const expectedSuffix = address.slice(-suffixLength);
                            expect(result).toContain(expectedSuffix);

                            // The result should contain the ellipsis separator
                            expect(result).toContain('...');

                            // The result should follow the expected format
                            expect(result).toBe(
                                `${expectedPrefix}...${expectedSuffix}`
                            );
                        }),
                        { numRuns: 100 }
                    );
                });

                it('should use default prefix and suffix lengths when not provided', () => {
                    fc.assert(
                        fc.property(addressArbitrary, (address) => {
                            // Call with only the address (using defaults)
                            const result = DYNAMIC_TEXT.TRUNCATED_ADDRESS(address);

                            // Default prefixLength = 8, suffixLength = 10
                            const expectedPrefix = address.slice(0, 8);
                            const expectedSuffix = address.slice(-10);

                            expect(result).toBe(`${expectedPrefix}...${expectedSuffix}`);
                        }),
                        { numRuns: 100 }
                    );
                });
            });

            describe('PAGINATION_INFO', () => {
                it('should contain both page number and count in the output', () => {
                    fc.assert(
                        fc.property(
                            fc.integer({ min: 1, max: 1000 }),
                            positiveIntArbitrary,
                            (page, count) => {
                                const result = DYNAMIC_TEXT.PAGINATION_INFO(page, count);

                                // The result should be a string
                                expect(typeof result).toBe('string');

                                // The result should contain the original input values
                                expect(result).toContain(String(page));
                                expect(result).toContain(String(count));

                                // The result should follow the expected format
                                expect(result).toBe(`Page ${page} • ${count} transactions`);
                            }
                        ),
                        { numRuns: 100 }
                    );
                });
            });

            describe('GROWTH_PERCENT', () => {
                it('should contain the percent value with a plus sign', () => {
                    fc.assert(
                        fc.property(percentArbitrary, (percent) => {
                            const result = DYNAMIC_TEXT.GROWTH_PERCENT(percent);

                            // The result should be a string
                            expect(typeof result).toBe('string');

                            // The result should contain the original input value
                            expect(result).toContain(String(percent));

                            // The result should follow the expected format (always with + prefix)
                            expect(result).toBe(`+${percent}%`);
                        }),
                        { numRuns: 100 }
                    );
                });
            });

            describe('AMOUNT_WITH_PREFIX', () => {
                it('should return correct prefix based on isCredit boolean', () => {
                    fc.assert(
                        fc.property(fc.boolean(), (isCredit) => {
                            const result = DYNAMIC_TEXT.AMOUNT_WITH_PREFIX(isCredit);

                            // The result should be a string
                            expect(typeof result).toBe('string');

                            // The result should follow the expected format
                            if (isCredit) {
                                expect(result).toBe('+ ');
                            } else {
                                expect(result).toBe('- ');
                            }
                        }),
                        { numRuns: 100 }
                    );
                });
            });
        });
    });
});
