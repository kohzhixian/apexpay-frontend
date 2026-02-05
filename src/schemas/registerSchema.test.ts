import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { registerSchema } from './registerSchema';

/**
 * Property-based tests for Register Schema validation
 * 
 * **Validates: Requirements 2.3, 2.4, 2.5**
 * - Requirement 2.3: WHEN defining a registration schema, THE Validation_Schema SHALL require a username with minimum 3 characters and maximum 20 characters
 * - Requirement 2.4: WHEN defining a registration schema, THE Validation_Schema SHALL require a valid email format
 * - Requirement 2.5: WHEN defining a registration schema, THE Validation_Schema SHALL require a password with minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number
 */

// Custom generator for valid emails that Zod will accept
const validEmailArbitrary = fc
    .tuple(
        // Local part: alphanumeric only (avoiding dots and underscores to prevent edge cases)
        fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{1,15}$/),
        // Domain: lowercase alphanumeric
        fc.stringMatching(/^[a-z]{2,10}$/),
        // TLD: 2-4 lowercase letters
        fc.stringMatching(/^[a-z]{2,4}$/)
    )
    .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

// Custom generator for valid usernames (3-20 alphanumeric characters or underscores)
const validUsernameArbitrary = fc.stringMatching(/^[a-zA-Z0-9_]{3,20}$/);

// Custom generator for valid passwords (8+ chars with uppercase, lowercase, and number)
// Generate a password that guarantees all requirements are met
const validPasswordArbitrary = fc
    .tuple(
        fc.stringMatching(/^[A-Z]{1,5}$/),  // At least one uppercase
        fc.stringMatching(/^[a-z]{1,5}$/),  // At least one lowercase
        fc.stringMatching(/^[0-9]{1,5}$/),  // At least one number
        fc.stringMatching(/^[a-zA-Z0-9]{0,10}$/)  // Additional characters
    )
    .map(([upper, lower, num, extra]) => upper + lower + num + extra)
    .filter((s) => s.length >= 8);

describe('Register Schema Property Tests', () => {
    // Feature: react-hook-form-integration, Property 1: Email Validation
    describe('Property 1: Email Validation', () => {
        /**
         * **Validates: Requirements 2.4**
         * 
         * For any string input, the email validation schema should accept valid email formats 
         * (containing @ and a domain) and reject invalid formats (missing @, missing domain, 
         * or malformed structure).
         */
        it('should accept valid email formats', () => {
            fc.assert(
                fc.property(
                    validEmailArbitrary,
                    (validEmail) => {
                        const result = registerSchema.safeParse({
                            username: 'validuser',
                            email: validEmail,
                            password: 'ValidPass1',
                        });
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject strings missing @ symbol', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 1 }).filter((s) => !s.includes('@')),
                    (invalidEmail) => {
                        const result = registerSchema.safeParse({
                            username: 'validuser',
                            email: invalidEmail,
                            password: 'ValidPass1',
                        });
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('email'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject strings with @ but missing domain', () => {
            fc.assert(
                fc.property(
                    // Generate strings that have @ but no valid domain (no dot after @)
                    fc.tuple(
                        fc.stringMatching(/^[a-zA-Z0-9]{1,10}$/),
                        fc.stringMatching(/^[a-zA-Z0-9]{0,10}$/)
                    ).map(([local, domain]) => `${local}@${domain}`),
                    (invalidEmail) => {
                        const result = registerSchema.safeParse({
                            username: 'validuser',
                            email: invalidEmail,
                            password: 'ValidPass1',
                        });
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('email'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject empty email strings', () => {
            const result = registerSchema.safeParse({
                username: 'validuser',
                email: '',
                password: 'ValidPass1',
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some((i) => i.path.includes('email'))
                ).toBe(true);
            }
        });
    });

    // Feature: react-hook-form-integration, Property 2: Username Length Validation
    describe('Property 2: Username Length Validation', () => {
        /**
         * **Validates: Requirements 2.3**
         * 
         * For any string input, the username validation schema should accept usernames 
         * between 3 and 20 characters (inclusive) and reject usernames outside this range.
         */
        it('should accept usernames between 3 and 20 characters', () => {
            fc.assert(
                fc.property(
                    validUsernameArbitrary,
                    (validUsername) => {
                        const result = registerSchema.safeParse({
                            username: validUsername,
                            email: 'test@example.com',
                            password: 'ValidPass1',
                        });
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject usernames with fewer than 3 characters', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9_]{0,2}$/),
                    (shortUsername) => {
                        const result = registerSchema.safeParse({
                            username: shortUsername,
                            email: 'test@example.com',
                            password: 'ValidPass1',
                        });
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('username'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject usernames with more than 20 characters', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9_]{21,40}$/),
                    (longUsername) => {
                        const result = registerSchema.safeParse({
                            username: longUsername,
                            email: 'test@example.com',
                            password: 'ValidPass1',
                        });
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('username'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should accept usernames at exactly 3 characters boundary', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9_]{3}$/),
                    (boundaryUsername) => {
                        const result = registerSchema.safeParse({
                            username: boundaryUsername,
                            email: 'test@example.com',
                            password: 'ValidPass1',
                        });
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should accept usernames at exactly 20 characters boundary', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9_]{20}$/),
                    (boundaryUsername) => {
                        const result = registerSchema.safeParse({
                            username: boundaryUsername,
                            email: 'test@example.com',
                            password: 'ValidPass1',
                        });
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject usernames at exactly 2 characters boundary', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9_]{2}$/),
                    (boundaryUsername) => {
                        const result = registerSchema.safeParse({
                            username: boundaryUsername,
                            email: 'test@example.com',
                            password: 'ValidPass1',
                        });
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('username'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject usernames at exactly 21 characters boundary', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9_]{21}$/),
                    (boundaryUsername) => {
                        const result = registerSchema.safeParse({
                            username: boundaryUsername,
                            email: 'test@example.com',
                            password: 'ValidPass1',
                        });
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('username'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    // Feature: react-hook-form-integration, Property 3: Password Complexity Validation
    describe('Property 3: Password Complexity Validation', () => {
        /**
         * **Validates: Requirements 2.5**
         * 
         * For any string input, the password validation schema should accept passwords that 
         * are at least 8 characters long AND contain at least one uppercase letter, one 
         * lowercase letter, and one number, and reject passwords that fail any of these requirements.
         */
        it('should accept passwords meeting all complexity requirements', () => {
            fc.assert(
                fc.property(
                    validPasswordArbitrary,
                    (validPassword) => {
                        const result = registerSchema.safeParse({
                            username: 'validuser',
                            email: 'test@example.com',
                            password: validPassword,
                        });
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject passwords with fewer than 8 characters', () => {
            fc.assert(
                fc.property(
                    // Generate short passwords that might otherwise meet complexity requirements
                    fc.stringMatching(/^[A-Z][a-z][0-9][a-zA-Z0-9]{0,4}$/).filter((s) => s.length < 8),
                    (shortPassword) => {
                        const result = registerSchema.safeParse({
                            username: 'validuser',
                            email: 'test@example.com',
                            password: shortPassword,
                        });
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('password'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject passwords without uppercase letters', () => {
            fc.assert(
                fc.property(
                    // Generate 8+ char passwords with lowercase and numbers but no uppercase
                    fc.stringMatching(/^[a-z0-9]{8,20}$/),
                    (noUpperPassword) => {
                        const result = registerSchema.safeParse({
                            username: 'validuser',
                            email: 'test@example.com',
                            password: noUpperPassword,
                        });
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('password'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject passwords without lowercase letters', () => {
            fc.assert(
                fc.property(
                    // Generate 8+ char passwords with uppercase and numbers but no lowercase
                    fc.stringMatching(/^[A-Z0-9]{8,20}$/),
                    (noLowerPassword) => {
                        const result = registerSchema.safeParse({
                            username: 'validuser',
                            email: 'test@example.com',
                            password: noLowerPassword,
                        });
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('password'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject passwords without numbers', () => {
            fc.assert(
                fc.property(
                    // Generate 8+ char passwords with uppercase and lowercase but no numbers
                    fc.stringMatching(/^[a-zA-Z]{8,20}$/),
                    (noNumberPassword) => {
                        const result = registerSchema.safeParse({
                            username: 'validuser',
                            email: 'test@example.com',
                            password: noNumberPassword,
                        });
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            expect(
                                result.error.issues.some((i) => i.path.includes('password'))
                            ).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should accept passwords at exactly 8 characters with all requirements', () => {
            fc.assert(
                fc.property(
                    // Generate exactly 8 char passwords meeting all requirements
                    fc.tuple(
                        fc.stringMatching(/^[A-Z]{1,2}$/),
                        fc.stringMatching(/^[a-z]{1,2}$/),
                        fc.stringMatching(/^[0-9]{1,2}$/),
                        fc.stringMatching(/^[a-zA-Z0-9]{2,4}$/)
                    )
                        .map(([upper, lower, num, extra]) => upper + lower + num + extra)
                        .filter((s) => s.length === 8 && /[A-Z]/.test(s) && /[a-z]/.test(s) && /[0-9]/.test(s)),
                    (boundaryPassword) => {
                        const result = registerSchema.safeParse({
                            username: 'validuser',
                            email: 'test@example.com',
                            password: boundaryPassword,
                        });
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    // Combined validation tests
    describe('Combined Field Validation', () => {
        it('should accept valid username, email, and password combinations', () => {
            fc.assert(
                fc.property(
                    validUsernameArbitrary,
                    validEmailArbitrary,
                    validPasswordArbitrary,
                    (validUsername, validEmail, validPassword) => {
                        const result = registerSchema.safeParse({
                            username: validUsername,
                            email: validEmail,
                            password: validPassword,
                        });
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject when all fields are invalid', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9_]{0,2}$/),  // Too short username
                    fc.string({ minLength: 1 }).filter((s) => !s.includes('@')),  // Invalid email
                    fc.stringMatching(/^[a-z]{0,7}$/),  // Too short, no uppercase, no number
                    (invalidUsername, invalidEmail, invalidPassword) => {
                        const result = registerSchema.safeParse({
                            username: invalidUsername,
                            email: invalidEmail,
                            password: invalidPassword,
                        });
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            // Should have errors for all fields
                            const hasUsernameError = result.error.issues.some((i) =>
                                i.path.includes('username')
                            );
                            const hasEmailError = result.error.issues.some((i) =>
                                i.path.includes('email')
                            );
                            const hasPasswordError = result.error.issues.some((i) =>
                                i.path.includes('password')
                            );
                            expect(hasUsernameError).toBe(true);
                            expect(hasEmailError).toBe(true);
                            expect(hasPasswordError).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});
