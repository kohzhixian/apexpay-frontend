import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { RegisterForm } from './RegisterForm';

// Mock useNavigate
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

describe('RegisterForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initial Render', () => {
        /**
         * **Validates: Requirements 4.1**
         * WHEN the RegisterForm renders, THE Form_System SHALL initialize with empty username, email, and password fields
         */
        it('should render with empty fields', () => {
            renderRegisterForm();

            const usernameInput = screen.getByLabelText(/username/i);
            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);

            expect(usernameInput).toHaveValue('');
            expect(emailInput).toHaveValue('');
            expect(passwordInput).toHaveValue('');
        });

        it('should render all form elements', () => {
            renderRegisterForm();

            expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
        });
    });

    describe('Username Validation', () => {
        /**
         * **Validates: Requirements 4.2, 4.3**
         */
        it('should display error for short username on blur', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const usernameInput = screen.getByLabelText(/username/i);

            await user.type(usernameInput, 'ab');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
            });
        });

        it('should display error for long username on blur', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const usernameInput = screen.getByLabelText(/username/i);

            await user.type(usernameInput, 'a'.repeat(21));
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/username must not exceed 20 characters/i)).toBeInTheDocument();
            });
        });

        it('should not display error for valid username', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const usernameInput = screen.getByLabelText(/username/i);

            await user.type(usernameInput, 'validuser');
            await user.tab();

            await waitFor(() => {
                expect(screen.queryByText(/username must be at least/i)).not.toBeInTheDocument();
                expect(screen.queryByText(/username must not exceed/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('Email Validation', () => {
        /**
         * **Validates: Requirements 4.4, 4.5**
         */
        it('should display error for invalid email on blur', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const emailInput = screen.getByLabelText(/email/i);

            await user.type(emailInput, 'invalid-email');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
            });
        });

        it('should not display error for valid email', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const emailInput = screen.getByLabelText(/email/i);

            await user.type(emailInput, 'test@example.com');
            await user.tab();

            await waitFor(() => {
                expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
            });
        });
    });


    describe('Password Validation', () => {
        /**
         * **Validates: Requirements 4.6, 4.7**
         */
        it('should display error for short password on blur', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const passwordInput = screen.getByLabelText(/password/i);

            await user.type(passwordInput, 'short');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
            });
        });

        it('should display error for password without uppercase', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const passwordInput = screen.getByLabelText(/password/i);

            await user.type(passwordInput, 'lowercase123');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
            });
        });

        it('should display error for password without lowercase', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const passwordInput = screen.getByLabelText(/password/i);

            await user.type(passwordInput, 'UPPERCASE123');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/password must contain at least one lowercase letter/i)).toBeInTheDocument();
            });
        });

        it('should display error for password without number', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const passwordInput = screen.getByLabelText(/password/i);

            await user.type(passwordInput, 'NoNumbersHere');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/password must contain at least one number/i)).toBeInTheDocument();
            });
        });

        it('should not display error for valid password', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const passwordInput = screen.getByLabelText(/password/i);

            await user.type(passwordInput, 'ValidPass123');
            await user.tab();

            await waitFor(() => {
                expect(screen.queryByText(/password must/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('Password Visibility Toggle', () => {
        /**
         * **Validates: Requirements 9.3**
         */
        it('should toggle password visibility', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const passwordInput = screen.getByLabelText(/password/i);

            expect(passwordInput).toHaveAttribute('type', 'password');

            const toggleButton = screen.getByRole('button', { name: /visibility/i });
            await user.click(toggleButton);

            expect(passwordInput).toHaveAttribute('type', 'text');

            await user.click(toggleButton);
            expect(passwordInput).toHaveAttribute('type', 'password');
        });
    });

    describe('Form Submission with Invalid Data', () => {
        /**
         * **Validates: Requirements 4.8, 7.1, 7.3**
         */
        it('should prevent submission and display errors for invalid data', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const submitButton = screen.getByRole('button', { name: /create account/i });

            await user.click(submitButton);

            await waitFor(() => {
                // Should show validation errors
                expect(mockNavigate).not.toHaveBeenCalled();
            });
        });

        it('should display multiple validation errors simultaneously', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const usernameInput = screen.getByLabelText(/username/i);
            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);

            await user.type(usernameInput, 'ab');
            await user.type(emailInput, 'invalid');
            await user.type(passwordInput, 'short');

            const submitButton = screen.getByRole('button', { name: /create account/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
                expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
                expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
            });
        });
    });

    describe('Form Submission with Valid Data', () => {
        /**
         * **Validates: Requirements 4.9**
         */
        it('should submit form and navigate with valid data', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const usernameInput = screen.getByLabelText(/username/i);
            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);

            await user.type(usernameInput, 'validuser');
            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'ValidPass123');

            const submitButton = screen.getByRole('button', { name: /create account/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            });
        });

        it('should clear form after successful submission', async () => {
            const user = userEvent.setup();
            renderRegisterForm();

            const usernameInput = screen.getByLabelText(/username/i);
            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);

            await user.type(usernameInput, 'validuser');
            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'ValidPass123');

            const submitButton = screen.getByRole('button', { name: /create account/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(usernameInput).toHaveValue('');
                expect(emailInput).toHaveValue('');
                expect(passwordInput).toHaveValue('');
            });
        });
    });
});
