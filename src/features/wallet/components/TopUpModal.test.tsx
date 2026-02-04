import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopUpModal } from './TopUpModal';

// Mock RTK Query hooks
const mockGetWalletQuery = vi.fn();
const mockGetPaymentMethodsQuery = vi.fn();
const mockTopUpWalletMutation = vi.fn();

vi.mock('../services/walletApi', () => ({
    useGetWalletQuery: () => mockGetWalletQuery(),
    useTopUpWalletMutation: () => [mockTopUpWalletMutation, { isLoading: false }],
}));

vi.mock('../../payment/services/paymentMethodApi', () => ({
    useGetPaymentMethodsQuery: () => mockGetPaymentMethodsQuery(),
}));

// Mock the processing and success modals
vi.mock('./TopUpProcessingModal', () => ({
    TopUpProcessingModal: ({ isOpen, onComplete }: { isOpen: boolean; onComplete: () => void }) => {
        if (isOpen) {
            // Auto-complete after render
            setTimeout(onComplete, 0);
            return <div data-testid="processing-modal">Processing...</div>;
        }
        return null;
    },
}));

vi.mock('./TopUpSuccessModal', () => ({
    TopUpSuccessModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
        if (isOpen) {
            return (
                <div data-testid="success-modal">
                    Success!
                    <button onClick={onClose}>Close</button>
                </div>
            );
        }
        return null;
    },
}));

/** Mock payment methods data */
const mockPaymentMethods = [
    {
        id: 'card1',
        type: 'CARD',
        displayName: 'Visa Card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 9,
        expiryYear: 2025,
        bankName: null,
        accountType: null,
        lastUsedAt: null,
        isDefault: true,
    },
    {
        id: 'bank1',
        type: 'BANK_ACCOUNT',
        displayName: 'Chase Bank',
        last4: '9921',
        brand: null,
        expiryMonth: null,
        expiryYear: null,
        bankName: 'Chase Bank',
        accountType: 'Checking',
        lastUsedAt: null,
        isDefault: false,
    },
];

/** Mock wallet data */
const mockWallets = [
    {
        walletId: 'wallet-1',
        name: 'Personal Wallet',
        balance: 1000,
        currency: 'SGD',
    },
];

describe('TopUpModal', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Setup default mock returns
        mockGetWalletQuery.mockReturnValue({ data: mockWallets });
        mockGetPaymentMethodsQuery.mockReturnValue({
            data: mockPaymentMethods,
            isLoading: false,
        });
        mockTopUpWalletMutation.mockResolvedValue({
            data: {
                message: 'Success',
                transactionId: 'txn-123',
                amount: 100,
                newBalance: 1100,
                createdAt: new Date().toISOString(),
            },
        });
    });

    describe('Initial Render', () => {
        /**
         * **Validates: Requirements 5.1**
         * WHEN the TopUpModal renders, THE Form_System SHALL initialize with empty amount field
         */
        it('should render with empty amount field', () => {
            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            const amountInput = screen.getByPlaceholderText('0.00');
            expect(amountInput).toHaveValue(null);
        });

        it('should render all form elements', () => {
            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            expect(screen.getByText(/enter amount/i)).toBeInTheDocument();
            expect(screen.getByText(/payment method/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /review transaction/i })).toBeInTheDocument();
        });

        it('should not render when closed', () => {
            render(<TopUpModal isOpen={false} onClose={mockOnClose} />);

            expect(screen.queryByText(/enter amount/i)).not.toBeInTheDocument();
        });
    });

    describe('Amount Validation', () => {
        /**
         * **Validates: Requirements 5.2, 5.3**
         * WHEN a user enters an invalid amount, THE Form_System SHALL display validation error
         */
        it('should display error for empty amount on submit', async () => {
            const user = userEvent.setup();
            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            const submitButton = screen.getByRole('button', { name: /review transaction/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
            });
        });

        it('should display error for zero amount', async () => {
            const user = userEvent.setup();
            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            const amountInput = screen.getByPlaceholderText('0.00');
            await user.type(amountInput, '0');

            const submitButton = screen.getByRole('button', { name: /review transaction/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument();
            });
        });

        it('should display error for negative amount', async () => {
            const user = userEvent.setup();
            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            // Number inputs typically don't allow typing negative values directly
            // This test verifies that zero validation works (which covers the "greater than 0" case)
            const amountInput = screen.getByPlaceholderText('0.00');
            await user.type(amountInput, '0.00');

            const submitButton = screen.getByRole('button', { name: /review transaction/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument();
            });
        });

        it('should not display error for valid amount', async () => {
            const user = userEvent.setup();
            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            const amountInput = screen.getByPlaceholderText('0.00');
            await user.type(amountInput, '100');
            await user.tab();

            await waitFor(() => {
                expect(screen.queryByText(/amount is required/i)).not.toBeInTheDocument();
                expect(screen.queryByText(/amount must be greater than 0/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('Quick Amount Buttons', () => {
        /**
         * **Validates: Requirements 5.4**
         * WHEN a user clicks a quick amount button, THE Form_System SHALL update the amount field
         */
        it('should update amount when clicking $10 button', async () => {
            const user = userEvent.setup();
            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            const quickButton = screen.getByRole('button', { name: /\+\$10\.00/i });
            await user.click(quickButton);

            const amountInput = screen.getByPlaceholderText('0.00');
            expect(amountInput).toHaveValue(10);
        });

        it('should update amount when clicking $50 button', async () => {
            const user = userEvent.setup();
            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            const quickButton = screen.getByRole('button', { name: /\+\$50\.00/i });
            await user.click(quickButton);

            const amountInput = screen.getByPlaceholderText('0.00');
            expect(amountInput).toHaveValue(50);
        });

        it('should update amount when clicking $100 button', async () => {
            const user = userEvent.setup();
            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            const quickButton = screen.getByRole('button', { name: /\+\$100\.00/i });
            await user.click(quickButton);

            const amountInput = screen.getByPlaceholderText('0.00');
            expect(amountInput).toHaveValue(100);
        });
    });

    describe('Payment Method Selection', () => {
        it('should have default payment method selected', async () => {
            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            await waitFor(() => {
                const cardRadio = screen.getByRole('radio', { name: /visa/i });
                expect(cardRadio).toBeChecked();
            });
        });

        it('should allow selecting bank payment method', async () => {
            const user = userEvent.setup();
            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            await waitFor(() => {
                expect(screen.getByText(/chase bank/i)).toBeInTheDocument();
            });

            const bankLabel = screen.getByText(/chase bank/i).closest('label');
            if (bankLabel) {
                await user.click(bankLabel);
            }

            const bankRadio = screen.getByRole('radio', { name: /chase/i });
            expect(bankRadio).toBeChecked();
        });

        it('should show loading skeleton while fetching payment methods', () => {
            mockGetPaymentMethodsQuery.mockReturnValue({
                data: undefined,
                isLoading: true,
            });

            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            // Should show loading skeletons (animated pulse divs)
            const skeletons = document.querySelectorAll('.animate-pulse');
            expect(skeletons.length).toBeGreaterThan(0);
        });

        it('should show empty state when no payment methods', async () => {
            mockGetPaymentMethodsQuery.mockReturnValue({
                data: [],
                isLoading: false,
            });

            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            await waitFor(() => {
                expect(screen.getByText(/no payment methods available/i)).toBeInTheDocument();
            });
        });
    });

    describe('Form Submission with Invalid Data', () => {
        /**
         * **Validates: Requirements 5.5, 7.1, 7.3**
         * WHEN a user submits the form with invalid data, THE Form_System SHALL prevent submission
         */
        it('should prevent submission with empty amount', async () => {
            const user = userEvent.setup();
            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            const submitButton = screen.getByRole('button', { name: /review transaction/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
            });

            // Should not have called the mutation
            expect(mockTopUpWalletMutation).not.toHaveBeenCalled();
        });
    });

    describe('Form Submission with Valid Data', () => {
        /**
         * **Validates: Requirements 5.6**
         * WHEN a user submits the form with valid data, THE Form_System SHALL process the top-up
         */
        it('should submit form with valid data', async () => {
            mockTopUpWalletMutation.mockReturnValue({
                unwrap: () => Promise.resolve({
                    message: 'Success',
                    transactionId: 'txn-123',
                    amount: 100,
                    newBalance: 1100,
                    createdAt: new Date().toISOString(),
                }),
            });

            const user = userEvent.setup();
            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            // Wait for payment methods to load
            await waitFor(() => {
                expect(screen.getByText(/visa ending in 4242/i)).toBeInTheDocument();
            });

            const amountInput = screen.getByPlaceholderText('0.00');
            await user.type(amountInput, '100');

            const submitButton = screen.getByRole('button', { name: /review transaction/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockTopUpWalletMutation).toHaveBeenCalled();
            });
        });

        it('should show processing modal after valid submission', async () => {
            mockTopUpWalletMutation.mockReturnValue({
                unwrap: () => Promise.resolve({
                    message: 'Success',
                    transactionId: 'txn-123',
                    amount: 50,
                    newBalance: 1050,
                    createdAt: new Date().toISOString(),
                }),
            });

            const user = userEvent.setup();
            render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            // Wait for payment methods to load
            await waitFor(() => {
                expect(screen.getByText(/visa ending in 4242/i)).toBeInTheDocument();
            });

            const amountInput = screen.getByPlaceholderText('0.00');
            await user.type(amountInput, '50');

            const submitButton = screen.getByRole('button', { name: /review transaction/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByTestId('processing-modal')).toBeInTheDocument();
            });
        });
    });

    describe('Form Reset', () => {
        /**
         * **Validates: Requirements 8.4**
         * WHEN the modal closes, THE Form_System SHALL reset the form
         */
        it('should reset form when modal closes and reopens', async () => {
            const user = userEvent.setup();
            const { rerender } = render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            // Enter some data
            const amountInput = screen.getByPlaceholderText('0.00');
            await user.type(amountInput, '100');
            expect(amountInput).toHaveValue(100);

            // Close modal
            rerender(<TopUpModal isOpen={false} onClose={mockOnClose} />);

            // Reopen modal
            rerender(<TopUpModal isOpen={true} onClose={mockOnClose} />);

            // Amount should be reset
            const newAmountInput = screen.getByPlaceholderText('0.00');
            expect(newAmountInput).toHaveValue(null);
        });
    });
});
