import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import { TopUpModal } from './TopUpModal';

/**
 * Property-based tests for TopUpModal submission
 * 
 * **Validates: Requirements 5.5, 5.6**
 * - Property 9: Form Submission Prevention - invalid data should prevent submission
 * - Property 10: Form Submission Success - valid data should call submit handler
 */

// Mock the processing and success modals
vi.mock('./TopUpProcessingModal', () => ({
    TopUpProcessingModal: ({ isOpen }: { isOpen: boolean }) => {
        if (isOpen) {
            return <div data-testid="processing-modal">Processing...</div>;
        }
        return null;
    },
}));

vi.mock('./TopUpSuccessModal', () => ({
    TopUpSuccessModal: ({ isOpen }: { isOpen: boolean }) => {
        if (isOpen) {
            return <div data-testid="success-modal">Success!</div>;
        }
        return null;
    },
}));

// Custom generators
const validAmountArbitrary = fc
    .float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true })
    .map((n) => n.toFixed(2));

const invalidAmountArbitrary = fc.oneof(
    fc.constant(''),
    fc.constant('0'),
    fc.constant('-1'),
    fc.constant('-100'),
    fc.float({ min: Math.fround(-1000), max: Math.fround(0), noNaN: true }).map((n) => n.toFixed(2))
);

describe('TopUpModal Property Tests', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    // Feature: react-hook-form-integration, Property 9: Form Submission Prevention
    describe('Property 9: Form Submission Prevention', () => {
        /**
         * **Validates: Requirements 5.5**
         * 
         * For any form and any invalid amount, when the form is submitted, 
         * the submit handler should not be called and validation errors should 
         * be displayed.
         */
        it('should prevent submission with invalid amount', async () => {
            await fc.assert(
                fc.asyncProperty(
                    invalidAmountArbitrary,
                    async (invalidAmount) => {
                        cleanup();
                        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
                        const user = userEvent.setup();
                        render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

                        const amountInput = screen.getByPlaceholderText('0.00');

                        if (invalidAmount) {
                            await user.clear(amountInput);
                            await user.type(amountInput, invalidAmount);
                        }

                        const submitButton = screen.getByRole('button', { name: /review transaction/i });
                        await user.click(submitButton);

                        await waitFor(() => {
                            const hasAmountError =
                                screen.queryByText(/amount is required/i) !== null ||
                                screen.queryByText(/amount must be greater than 0/i) !== null;
                            expect(hasAmountError).toBe(true);
                        });

                        // Should not have logged submission
                        expect(consoleSpy).not.toHaveBeenCalledWith('Top up submitted:', expect.anything());
                        consoleSpy.mockRestore();
                    }
                ),
                { numRuns: 10 }
            );
        }, 30000);
    });

    // Feature: react-hook-form-integration, Property 10: Form Submission Success
    describe('Property 10: Form Submission Success', () => {
        /**
         * **Validates: Requirements 5.6**
         * 
         * For any form and any valid amount, when the form is submitted, 
         * the submit handler should be called with the validated data.
         */
        it('should submit successfully with valid amount', async () => {
            await fc.assert(
                fc.asyncProperty(
                    validAmountArbitrary,
                    async (validAmount) => {
                        cleanup();
                        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
                        const user = userEvent.setup();
                        render(<TopUpModal isOpen={true} onClose={mockOnClose} />);

                        const amountInput = screen.getByPlaceholderText('0.00');
                        await user.type(amountInput, validAmount);

                        const submitButton = screen.getByRole('button', { name: /review transaction/i });
                        await user.click(submitButton);

                        await waitFor(() => {
                            expect(consoleSpy).toHaveBeenCalledWith('Top up submitted:', expect.objectContaining({
                                currency: 'SGD',
                                paymentMethod: 'card1',
                            }));
                            // Verify amount is close to expected (may have trailing zeros stripped)
                            const calls = consoleSpy.mock.calls;
                            const submitCall = calls.find(call => call[0] === 'Top up submitted:');
                            expect(submitCall).toBeDefined();
                            const submittedAmount = parseFloat(submitCall![1].amount);
                            const expectedAmount = parseFloat(validAmount);
                            expect(submittedAmount).toBeCloseTo(expectedAmount, 2);
                        });

                        consoleSpy.mockRestore();
                    }
                ),
                { numRuns: 10 }
            );
        }, 30000);
    });
});
