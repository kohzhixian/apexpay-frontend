import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import fc from 'fast-check';
import { RegisterForm } from './RegisterForm';

/**
 * Property-based tests for RegisterForm submission
 * 
 * **Validates: Requirements 4.8, 4.9**
 * - Property 9: Form Submission Prevention - invalid data should prevent submission
 * - Property 10: Form Submission Success - valid data should call submit handler
 */

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderRegisterForm = () => {
    return render(
        <BrowserRouter>
            <RegisterForm />
        </BrowserRouter>
    );
};

// Custom generators
const validUsernameArbitrary = fc.stringMatching(/^[a-zA-Z0-9_]{3,20}$/);

const validEmailArbitrary = fc
    .tuple(
        fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{1,15}$/),
        fc.stringMatching(/^[a-z]{2,10}$/),
        fc.stringMatching(/^[a-z]{2,4}$/)
    )
    .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

const validPasswordArbitrary = fc
    .tuple(
        fc.stringMatching(/^[A-Z]{1,3}$/),
        fc.stringMatching(/^[a-z]{1,3}$/),
        fc.stringMatching(/^[0-9]{1,3}$/),
        fc.stringMatching(/^[a-zA-Z0-9]{0,5}$/)
    )
    .map(([upper, lower, num, extra]) => upper + lower + num + extra)
    .filter((s) => s.length >= 8);

const invalidUsernameArbitrary = fc.oneof(
    fc.constant(''),
    fc.stringMatching(/^[a-zA-Z0-9_]{1,2}$/),
    fc.stringMatching(/^[a-zA-Z0-9_]{21,30}$/)
);

const invalidPasswordArbitrary = fc.oneof(
    fc.stringMatching(/^[a-zA-Z0-9]{0,7}$/),
    fc.stringMatching(/^[a-z0-9]{8,15}$/),
    fc.stringMatching(/^[A-Z0-9]{8,15}$/),
    fc.stringMatching(/^[a-zA-Z]{8,15}$/)
);

describe('RegisterForm Property Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    // Feature: react-hook-form-integration, Property 9: Form Submission Prevention
    describe('Property 9: Form Submission Prevention', () => {
        /**
         * **Validates: Requirements 4.8**
         */
        it('should prevent submission with invalid username', async () => {
            await fc.assert(
                fc.asyncProperty(
                    invalidUsernameArbitrary,
                    validEmailArbitrary,
                    validPasswordArbitrary,
                    async (invalidUsername, validEmail, validPassword) => {
                        cleanup();
                        mockNavigate.mockClear();
                        const user = userEvent.setup();
                        renderRegisterForm();

                        const usernameInput = screen.getByLabelText(/username/i);
                        const emailInput = screen.getByLabelText(/email/i);
                        const passwordInput = screen.getByLabelText(/password/i);
                        const submitButton = screen.getByRole('button', { name: /create account/i });

                        if (invalidUsername) {
                            await user.type(usernameInput, invalidUsername);
                        }
                        await user.type(emailInput, validEmail);
                        await user.type(passwordInput, validPassword);
                        await user.click(submitButton);

                        await waitFor(() => {
                            const hasUsernameError =
                                screen.queryByText(/username must be at least/i) !== null ||
                                screen.queryByText(/username must not exceed/i) !== null;
                            expect(hasUsernameError).toBe(true);
                        });

                        expect(mockNavigate).not.toHaveBeenCalled();
                    }
                ),
                { numRuns: 10 }
            );
        }, 30000);

        it('should prevent submission with invalid password', async () => {
            await fc.assert(
                fc.asyncProperty(
                    validUsernameArbitrary,
                    validEmailArbitrary,
                    invalidPasswordArbitrary,
                    async (validUsername, validEmail, invalidPassword) => {
                        cleanup();
                        mockNavigate.mockClear();
                        const user = userEvent.setup();
                        renderRegisterForm();

                        const usernameInput = screen.getByLabelText(/username/i);
                        const emailInput = screen.getByLabelText(/email/i);
                        const passwordInput = screen.getByLabelText(/password/i);
                        const submitButton = screen.getByRole('button', { name: /create account/i });

                        await user.type(usernameInput, validUsername);
                        await user.type(emailInput, validEmail);
                        if (invalidPassword) {
                            await user.type(passwordInput, invalidPassword);
                        }
                        await user.click(submitButton);

                        await waitFor(() => {
                            const hasPasswordError =
                                screen.queryByText(/password must/i) !== null;
                            expect(hasPasswordError).toBe(true);
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
         * **Validates: Requirements 4.9**
         */
        it('should submit successfully with valid data', async () => {
            await fc.assert(
                fc.asyncProperty(
                    validUsernameArbitrary,
                    validEmailArbitrary,
                    validPasswordArbitrary,
                    async (validUsername, validEmail, validPassword) => {
                        cleanup();
                        mockNavigate.mockClear();
                        const user = userEvent.setup();
                        renderRegisterForm();

                        const usernameInput = screen.getByLabelText(/username/i);
                        const emailInput = screen.getByLabelText(/email/i);
                        const passwordInput = screen.getByLabelText(/password/i);
                        const submitButton = screen.getByRole('button', { name: /create account/i });

                        await user.type(usernameInput, validUsername);
                        await user.type(emailInput, validEmail);
                        await user.type(passwordInput, validPassword);
                        await user.click(submitButton);

                        await waitFor(() => {
                            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
                        });

                        expect(mockNavigate).toHaveBeenCalledTimes(1);
                    }
                ),
                { numRuns: 10 }
            );
        }, 30000);
    });
});
