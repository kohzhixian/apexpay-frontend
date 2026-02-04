import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { loginSchema } from './loginSchema';

/**
 * Property-based tests for Login Schema validation
 * 
 * **Validates: Requirements 2.1, 2.2**
 * - Requirement 2.1: WHEN defining a login schema, THE Validation_Schema SHALL require a valid email format
 * - Requirement 2.2: WHEN defining a login schema, THE Validation_Schema SHALL require a password with minimum 8 characters
 */

// Custom generator for valid emails that Zod will accept
// Zod's email validation is stricter - no consecutive dots, no special chars at start/end
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

// Custom generator for valid passwords (8+ alphanumeric characters)
const validPasswordArbitrary = fc.stringMatching(/^[a-zA-Z0-9]{8,50}$/);

describe('Login Schema Property Tests', () => {
    // Feature: react-hook-form-integration, Property 1: Email Validation
    describe('Property 1: Email Validation', () => {
        /**
         * **Validates: Requirements 2.1**
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
                        const result = loginSchema.safeParse({
                            email: validEmail,
                            password: 'ValidPass123',
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
                        const result = loginSchema.safeParse({
                            email: invalidEmail,
                            password: 'ValidPass123',
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
                        const result = loginSchema.safeParse({
                            email: invalidEmail,
                            password: 'ValidPass123',
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
            const result = loginSchema.safeParse({
                email: '',
                password: 'ValidPass123',
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some((i) => i.path.includes('email'))
                ).toBe(true);
            }
        });

        it('should reject emails with only whitespace', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[ \t]{1,20}$/),
                    (whitespaceEmail) => {
                        const result = loginSchema.safeParse({
                            email: whitespaceEmail,
                            password: 'ValidPass123',
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
    });

    // Feature: react-hook-form-integration, Property 3: Password Complexity Validation
    describe('Property 3: Password Complexity Validation (Login - Minimum Length Only)', () => {
        /**
         * **Validates: Requirements 2.2**
         * 
         * For the login schema, password only requires 8 characters minimum.
         * (Full complexity requirements with uppercase, lowercase, and number are for register schema)
         */
        it('should accept passwords with 8 or more characters', () => {
            fc.assert(
                fc.property(
                    validPasswordArbitrary,
                    (validPassword) => {
                        const result = loginSchema.safeParse({
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
                    fc.stringMatching(/^[a-zA-Z0-9]{0,7}$/),
                    (shortPassword) => {
                        const result = loginSchema.safeParse({
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

        it('should accept passwords at exactly 8 characters boundary', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9]{8}$/),
                    (boundaryPassword) => {
                        const result = loginSchema.safeParse({
                            email: 'test@example.com',
                            password: boundaryPassword,
                        });
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject passwords at exactly 7 characters boundary', () => {
            fc.assert(
                fc.property(
                    fc.stringMatching(/^[a-zA-Z0-9]{7}$/),
                    (boundaryPassword) => {
                        const result = loginSchema.safeParse({
                            email: 'test@example.com',
                            password: boundaryPassword,
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
    });

    // Combined validation tests
    describe('Combined Email and Password Validation', () => {
        it('should accept valid email and password combinations', () => {
            fc.assert(
                fc.property(
                    validEmailArbitrary,
                    validPasswordArbitrary,
                    (validEmail, validPassword) => {
                        const result = loginSchema.safeParse({
                            email: validEmail,
                            password: validPassword,
                        });
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject when both email and password are invalid', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 1 }).filter((s) => !s.includes('@')),
                    fc.stringMatching(/^[a-zA-Z0-9]{0,7}$/),
                    (invalidEmail, invalidPassword) => {
                        const result = loginSchema.safeParse({
                            email: invalidEmail,
                            password: invalidPassword,
                        });
                        expect(result.success).toBe(false);
                        if (!result.success) {
                            // Should have errors for both fields
                            const hasEmailError = result.error.issues.some((i) =>
                                i.path.includes('email')
                            );
                            const hasPasswordError = result.error.issues.some((i) =>
                                i.path.includes('password')
                            );
                            expect(hasEmailError).toBe(true);
                            expect(hasPasswordError).toBe(true);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    // Optional rememberMe field tests
    describe('Optional rememberMe Field', () => {
        it('should accept valid form data with rememberMe as true', () => {
            fc.assert(
                fc.property(
                    validEmailArbitrary,
                    validPasswordArbitrary,
                    (validEmail, validPassword) => {
                        const result = loginSchema.safeParse({
                            email: validEmail,
                            password: validPassword,
                            rememberMe: true,
                        });
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should accept valid form data with rememberMe as false', () => {
            fc.assert(
                fc.property(
                    validEmailArbitrary,
                    validPasswordArbitrary,
                    (validEmail, validPassword) => {
                        const result = loginSchema.safeParse({
                            email: validEmail,
                            password: validPassword,
                            rememberMe: false,
                        });
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should accept valid form data without rememberMe field', () => {
            fc.assert(
                fc.property(
                    validEmailArbitrary,
                    validPasswordArbitrary,
                    (validEmail, validPassword) => {
                        const result = loginSchema.safeParse({
                            email: validEmail,
                            password: validPassword,
                        });
                        expect(result.success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});
