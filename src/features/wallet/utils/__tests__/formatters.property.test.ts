import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
    formatDate,
    formatTime,
    formatDateTime,
    formatTransactionDateTime,
} from '../formatters';

/**
 * Property-based tests for date/time formatter error handling
 *
 * **Validates: Requirements 8.4**
 * - Property 14: Formatter handles invalid dates gracefully
 *
 * Feature: codebase-improvements
 */

/**
 * Helper function to check if a string produces an invalid Date
 * JavaScript's Date constructor is very lenient and will auto-correct many "invalid" dates
 * (e.g., "2000-02-30" becomes "Mar 1, 2000")
 * We only want to test inputs that truly result in NaN dates
 */
const isActuallyInvalidDate = (input: string): boolean => {
    const date = new Date(input);
    return isNaN(date.getTime());
};

/**
 * Generator for strings that are guaranteed to produce invalid Date objects
 * These are strings that JavaScript's Date constructor cannot parse at all
 */
const trulyInvalidDateStringArbitrary = fc.oneof(
    // Random strings that don't look like dates at all
    fc.constantFrom(
        'not-a-date',
        'abc-def-ghi',
        'invalid',
        '---',
        'NaN',
        'Infinity',
        '-Infinity',
        'undefined',
        'null',
        'true',
        'false',
        '[object Object]',
        '',
        '   ',
        '\n\t',
        '🗓️',
        '<script>alert("xss")</script>',
        'hello world',
        'YYYY-MM-DD',
        'date goes here',
        '????',
        '12345abc',
        'abc12345',
        'foo/bar/baz',
        'xx-xx-xxxx',
        'Invalid Date',
        'not a valid date string'
    ),
    // Random alphanumeric strings that won't parse as dates
    fc.stringMatching(/^[a-zA-Z]{3,20}$/).filter(isActuallyInvalidDate),
    // Random strings with special characters
    fc.stringMatching(/^[!@#$%^&*()_+=\[\]{}|;:'"<>?,./\\-]{1,10}$/).filter(isActuallyInvalidDate)
);

/**
 * Generator for empty or whitespace-only strings (always invalid)
 */
const emptyOrWhitespaceArbitrary = fc.oneof(
    fc.constant(''),
    fc.array(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1, maxLength: 10 }).map((chars) => chars.join(''))
);

/**
 * Combined generator for all types of truly invalid date inputs
 * All generated values are verified to produce NaN when passed to Date constructor
 */
const invalidDateInputArbitrary = fc.oneof(
    trulyInvalidDateStringArbitrary,
    emptyOrWhitespaceArbitrary
).filter(isActuallyInvalidDate);

describe('Formatter Error Handling Property Tests', () => {
    // Feature: codebase-improvements, Property 14: Formatter handles invalid dates gracefully
    describe('Property 14: Formatter handles invalid dates gracefully', () => {
        /**
         * **Validates: Requirements 8.4**
         *
         * For any invalid date input (null, undefined, malformed string, invalid Date object),
         * the date formatting functions SHALL return a consistent fallback string
         * ("Invalid date" or "Invalid time") without throwing an error.
         */

        describe('formatDate', () => {
            it('should return "Invalid date" for truly invalid date strings without throwing', () => {
                fc.assert(
                    fc.property(invalidDateInputArbitrary, (invalidInput) => {
                        // Verify our generator is producing truly invalid dates
                        expect(isActuallyInvalidDate(invalidInput)).toBe(true);

                        // Should not throw
                        let result: string;
                        let didThrow = false;

                        try {
                            result = formatDate(invalidInput);
                        } catch {
                            didThrow = true;
                            result = '';
                        }

                        // The function should not throw
                        expect(didThrow).toBe(false);

                        // The result should be the fallback string
                        expect(result).toBe('Invalid date');

                        // The result should be a string
                        expect(typeof result).toBe('string');
                    }),
                    { numRuns: 100 }
                );
            });

            it('should return "Invalid date" for empty strings', () => {
                fc.assert(
                    fc.property(emptyOrWhitespaceArbitrary, (emptyInput) => {
                        const result = formatDate(emptyInput);

                        expect(result).toBe('Invalid date');
                        expect(typeof result).toBe('string');
                    }),
                    { numRuns: 100 }
                );
            });
        });

        describe('formatTime', () => {
            it('should return "Invalid time" for truly invalid date strings without throwing', () => {
                fc.assert(
                    fc.property(invalidDateInputArbitrary, (invalidInput) => {
                        // Verify our generator is producing truly invalid dates
                        expect(isActuallyInvalidDate(invalidInput)).toBe(true);

                        // Should not throw
                        let result: string;
                        let didThrow = false;

                        try {
                            result = formatTime(invalidInput);
                        } catch {
                            didThrow = true;
                            result = '';
                        }

                        // The function should not throw
                        expect(didThrow).toBe(false);

                        // The result should be the fallback string
                        expect(result).toBe('Invalid time');

                        // The result should be a string
                        expect(typeof result).toBe('string');
                    }),
                    { numRuns: 100 }
                );
            });

            it('should return "Invalid time" for empty strings', () => {
                fc.assert(
                    fc.property(emptyOrWhitespaceArbitrary, (emptyInput) => {
                        const result = formatTime(emptyInput);

                        expect(result).toBe('Invalid time');
                        expect(typeof result).toBe('string');
                    }),
                    { numRuns: 100 }
                );
            });
        });

        describe('formatDateTime', () => {
            it('should return "Invalid date" for truly invalid date strings without throwing', () => {
                fc.assert(
                    fc.property(invalidDateInputArbitrary, (invalidInput) => {
                        // Verify our generator is producing truly invalid dates
                        expect(isActuallyInvalidDate(invalidInput)).toBe(true);

                        // Should not throw
                        let result: string;
                        let didThrow = false;

                        try {
                            result = formatDateTime(invalidInput);
                        } catch {
                            didThrow = true;
                            result = '';
                        }

                        // The function should not throw
                        expect(didThrow).toBe(false);

                        // The result should be the fallback string
                        expect(result).toBe('Invalid date');

                        // The result should be a string
                        expect(typeof result).toBe('string');
                    }),
                    { numRuns: 100 }
                );
            });

            it('should return "Invalid date" for empty strings', () => {
                fc.assert(
                    fc.property(emptyOrWhitespaceArbitrary, (emptyInput) => {
                        const result = formatDateTime(emptyInput);

                        expect(result).toBe('Invalid date');
                        expect(typeof result).toBe('string');
                    }),
                    { numRuns: 100 }
                );
            });
        });

        describe('formatTransactionDateTime', () => {
            it('should return "Invalid date" for truly invalid date strings without throwing', () => {
                fc.assert(
                    fc.property(invalidDateInputArbitrary, (invalidInput) => {
                        // Verify our generator is producing truly invalid dates
                        expect(isActuallyInvalidDate(invalidInput)).toBe(true);

                        // Should not throw
                        let result: string;
                        let didThrow = false;

                        try {
                            result = formatTransactionDateTime(invalidInput);
                        } catch {
                            didThrow = true;
                            result = '';
                        }

                        // The function should not throw
                        expect(didThrow).toBe(false);

                        // The result should be the fallback string
                        expect(result).toBe('Invalid date');

                        // The result should be a string
                        expect(typeof result).toBe('string');
                    }),
                    { numRuns: 100 }
                );
            });

            it('should return "Invalid date" for empty strings', () => {
                fc.assert(
                    fc.property(emptyOrWhitespaceArbitrary, (emptyInput) => {
                        const result = formatTransactionDateTime(emptyInput);

                        expect(result).toBe('Invalid date');
                        expect(typeof result).toBe('string');
                    }),
                    { numRuns: 100 }
                );
            });
        });

        describe('All formatters consistency', () => {
            it('should all handle the same invalid input consistently without throwing', () => {
                fc.assert(
                    fc.property(invalidDateInputArbitrary, (invalidInput) => {
                        // Verify our generator is producing truly invalid dates
                        expect(isActuallyInvalidDate(invalidInput)).toBe(true);

                        // All formatters should handle invalid input gracefully
                        const results: { fn: string; result: string; threw: boolean }[] = [];

                        // Test formatDate
                        try {
                            results.push({ fn: 'formatDate', result: formatDate(invalidInput), threw: false });
                        } catch {
                            results.push({ fn: 'formatDate', result: '', threw: true });
                        }

                        // Test formatTime
                        try {
                            results.push({ fn: 'formatTime', result: formatTime(invalidInput), threw: false });
                        } catch {
                            results.push({ fn: 'formatTime', result: '', threw: true });
                        }

                        // Test formatDateTime
                        try {
                            results.push({ fn: 'formatDateTime', result: formatDateTime(invalidInput), threw: false });
                        } catch {
                            results.push({ fn: 'formatDateTime', result: '', threw: true });
                        }

                        // Test formatTransactionDateTime
                        try {
                            results.push({ fn: 'formatTransactionDateTime', result: formatTransactionDateTime(invalidInput), threw: false });
                        } catch {
                            results.push({ fn: 'formatTransactionDateTime', result: '', threw: true });
                        }

                        // None should throw
                        for (const r of results) {
                            expect(r.threw).toBe(false);
                        }

                        // All should return their respective fallback strings
                        expect(results.find((r) => r.fn === 'formatDate')?.result).toBe('Invalid date');
                        expect(results.find((r) => r.fn === 'formatTime')?.result).toBe('Invalid time');
                        expect(results.find((r) => r.fn === 'formatDateTime')?.result).toBe('Invalid date');
                        expect(results.find((r) => r.fn === 'formatTransactionDateTime')?.result).toBe('Invalid date');
                    }),
                    { numRuns: 100 }
                );
            });
        });
    });
});
