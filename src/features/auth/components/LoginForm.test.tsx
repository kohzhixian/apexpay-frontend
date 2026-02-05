import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from './LoginForm';

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

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initial Render', () => {
        /**
         * **Validates: Requirements 3.1**
         * WHEN the LoginForm renders, THE Form_System SHALL initialize with empty email and password fields
         */
        it('should render with empty fields', () => {
            renderLoginForm();

            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);

            expect(emailInput).toHaveValue('');
            expect(passwordInput).toHaveValue('');
        });

        it('should render all form elements', () => {
            renderLoginForm();

            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
            expect(screen.getByRole('checkbox')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
        });
    });

    describe('Email Validation', () => {
        /**
         * **Validates: Requirements 3.2, 3.3**
         * WHEN a user types in the email field, THE Form_System SHALL validate the email format on blur
         * WHEN the email is invalid, THE DarkInput SHALL display a Validation_Error message
         */
        it('should display error for invalid email on blur', async () => {
            const user = userEvent.setup();
            renderLoginForm();

            const emailInput = screen.getByLabelText(/email/i);

            await user.type(emailInput, 'invalid-email');
            await user.tab(); // Trigger blur

            await waitFor(() => {
                expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
            });
        });

        it('should display error for empty email on blur', async () => {
            const user = userEvent.setup();
            renderLoginForm();

            const emailInput = screen.getByLabelText(/email/i);

            await user.click(emailInput);
            await user.tab(); // Trigger blur without typing

            await waitFor(() => {
                expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
            });
        });

        it('should not display error for valid email', async () => {
            const user = userEvent.setup();
            renderLoginForm();

            const emailInput = screen.getByLabelText(/email/i);

            await user.type(emailInput, 'test@example.com');
            await user.tab();

            await waitFor(() => {
                expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
                expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('Password Validation', () => {
        /**
         * **Validates: Requirements 3.4, 3.5**
         * WHEN a user types in the password field, THE Form_System SHALL validate the password length on blur
         * WHEN the password is invalid, THE DarkInput SHALL display a Validation_Error message
         */
        it('should display error for short password on blur', async () => {
            const user = userEvent.setup();
            renderLoginForm();

            const passwordInput = screen.getByLabelText(/password/i);

            await user.type(passwordInput, 'short');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
            });
        });

        it('should not display error for valid password', async () => {
            const user = userEvent.setup();
            renderLoginForm();

            const passwordInput = screen.getByLabelText(/password/i);

            await user.type(passwordInput, 'validpassword123');
            await user.tab();

            await waitFor(() => {
                expect(screen.queryByText(/password must be at least 8 characters/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('Password Visibility Toggle', () => {
        /**
         * **Validates: Requirements 9.3**
         * WHEN the password visibility toggle is clicked, THE Form_System SHALL toggle password visibility as before
         */
        it('should toggle password visibility', async () => {
            const user = userEvent.setup();
            renderLoginForm();

            const passwordInput = screen.getByLabelText(/password/i);

            // Initially password should be hidden
            expect(passwordInput).toHaveAttribute('type', 'password');

            // Find and click the visibility toggle button
            const toggleButton = screen.getByRole('button', { name: /visibility/i });
            await user.click(toggleButton);

            // Password should now be visible
            expect(passwordInput).toHaveAttribute('type', 'text');

            // Click again to hide
            await user.click(toggleButton);
            expect(passwordInput).toHaveAttribute('type', 'password');
        });
    });


    describe('Form Submission with Invalid Data', () => {
        /**
         * **Validates: Requirements 3.6, 7.1, 7.3**
         * WHEN a user submits the form with invalid data, THE Form_System SHALL prevent submission and display all Validation_Error messages
         */
        it('should prevent submission and display errors for invalid data', async () => {
            const user = userEvent.setup();
            renderLoginForm();

            const submitButton = screen.getByRole('button', { name: /sign in/i });

            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
            });

            // Should not navigate
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('should display multiple validation errors simultaneously', async () => {
            const user = userEvent.setup();
            renderLoginForm();

            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);

            await user.type(emailInput, 'invalid');
            await user.type(passwordInput, 'short');

            const submitButton = screen.getByRole('button', { name: /sign in/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
                expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
            });
        });
    });

    describe('Form Submission with Valid Data', () => {
        /**
         * **Validates: Requirements 3.7**
         * WHEN a user submits the form with valid data, THE Form_System SHALL call the submit handler with validated data
         */
        it('should submit form and navigate with valid data', async () => {
            const user = userEvent.setup();
            renderLoginForm();

            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);

            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'validpassword123');

            const submitButton = screen.getByRole('button', { name: /sign in/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            });
        });

        it('should clear form after successful submission', async () => {
            const user = userEvent.setup();
            renderLoginForm();

            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);

            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'validpassword123');

            const submitButton = screen.getByRole('button', { name: /sign in/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(emailInput).toHaveValue('');
                expect(passwordInput).toHaveValue('');
            });
        });
    });

    describe('Remember Me Checkbox', () => {
        it('should toggle remember me checkbox', async () => {
            const user = userEvent.setup();
            renderLoginForm();

            const checkbox = screen.getByRole('checkbox');

            expect(checkbox).not.toBeChecked();

            await user.click(checkbox);
            expect(checkbox).toBeChecked();

            await user.click(checkbox);
            expect(checkbox).not.toBeChecked();
        });
    });
});
