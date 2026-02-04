import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import fc from 'fast-check';
import { LoginForm } from './LoginForm';

/**
 * Property-based tests for LoginForm submission
 * 
 * **Validates: Requirements 3.6, 3.7**
 * - Property 9: Form Submission Prevention - invalid data should prevent submission
 * - Property 10: Form Submission Success - valid data should call submit handler
 */

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderLoginForm = () => {
    return render(
        <BrowserRouter>
            <LoginForm />
        </BrowserRouter>
    );
};

// Custom generators
const validEmailArbitrary = fc
    .tuple(
        fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{1,15}$/),
        fc.stringMatching(/^[a-z]{2,10}$/),
        fc.stringMatching(/^[a-z]{2,4}$/)
    )
    .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

const validPasswordArbitrary = fc.stringMatching(/^[a-zA-Z0-9]{8,20}$/);

const invalidEmailArbitrary = fc.oneof(
    fc.constant(''),
    fc.stringMatching(/^[a-zA-Z0-9]{1,20}$/).filter((s) => !s.includes('@')),
    fc.stringMatching(/^[a-zA-Z0-9]{1,10}@$/)
);

const invalidPasswordArbitrary = fc.stringMatching(/^[a-zA-Z0-9]{0,7}$/);

describe('LoginForm Property Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    // Feature: react-hook-form-integration, Property 9: Form Submission Prevention
    describe('Property 9: Form Submission Prevention', () => {
        /**
         * **Validates: Requirements 3.6**
         * 
         * For any form and any invalid form data, when the form is submitted, 
         * the submit handler should not be called and validation errors should 
         * be displayed for all invalid fields.
         */
        it('should prevent submission with invalid email', async () => {
            await fc.assert(
                fc.asyncProperty(
                    invalidEmailArbitrary,
                    validPasswordArbitrary,
                    async (invalidEmail, validPassword) => {
                        cleanup();
                        mockNavigate.mockClear();
                        const user = userEvent.setup();
                        renderLoginForm();

                        const emailInput = screen.getByLabelText(/email/i);
                        const passwordInput = screen.getByLabelText(/password/i);
                        const submitButton = screen.getByRole('button', { name: /sign in/i });

                        if (invalidEmail) {
                            await user.type(emailInput, invalidEmail);
                        }
                        await user.type(passwordInput, validPassword);
                        await user.click(submitButton);

                        await waitFor(() => {
                            const hasEmailError =
                                screen.queryByText(/email is required/i) !== null ||
                                screen.queryByText(/please enter a valid email address/i) !== null;
                            expect(hasEmailError).toBe(true);
                        });

                        expect(mockNavigate).not.toHaveBeenCalled();
                    }
                ),
                { numRuns: 10 } // Reduced for UI tests
            );
        }, 30000);

        it('should prevent submission with invalid password', async () => {
            await fc.assert(
                fc.asyncProperty(
                    validEmailArbitrary,
                    invalidPasswordArbitrary,
                    async (validEmail, invalidPassword) => {
                        cleanup();
                        mockNavigate.mockClear();
                        const user = userEvent.setup();
                        renderLoginForm();

                        const emailInput = screen.getByLabelText(/email/i);
                        const passwordInput = screen.getByLabelText(/password/i);
                        const submitButton = screen.getByRole('button', { name: /sign in/i });

                        await user.type(emailInput, validEmail);
                        if (invalidPassword) {
                            await user.type(passwordInput, invalidPassword);
                        }
                        await user.click(submitButton);

                        await waitFor(() => {
                            expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
                        });

                        expect(mockNavigate).not.toHaveBeenCalled();
                    }
                ),
                { numRuns: 10 }
            );
        }, 30000);
    });

    // Feature: react-hook-form-integration, Property 10: Form Submission Success
    describe('Property 10: Form Submission Success', () => {
        /**
         * **Validates: Requirements 3.7**
         * 
         * For any form and any valid form data, when the form is submitted, 
         * the submit handler should be called exactly once with the validated 
         * data matching the input data.
         */
        it('should submit successfully with valid data', async () => {
            await fc.assert(
                fc.asyncProperty(
                    validEmailArbitrary,
                    validPasswordArbitrary,
                    async (validEmail, validPassword) => {
                        cleanup();
                        mockNavigate.mockClear();
                        const user = userEvent.setup();
                        renderLoginForm();

                        const emailInput = screen.getByLabelText(/email/i);
                        const passwordInput = screen.getByLabelText(/password/i);
                        const submitButton = screen.getByRole('button', { name: /sign in/i });

                        await user.type(emailInput, validEmail);
                        await user.type(passwordInput, validPassword);
                        await user.click(submitButton);

                        await waitFor(() => {
                            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
                        });

                        // Should be called exactly once
                        expect(mockNavigate).toHaveBeenCalledTimes(1);
                    }
                ),
                { numRuns: 10 }
            );
        }, 30000);
    });
});
