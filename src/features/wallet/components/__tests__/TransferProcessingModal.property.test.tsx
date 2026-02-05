import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { TransferProcessingModal } from '../TransferProcessingModal';

/**
 * Property-based tests for TransferProcessingModal component
 *
 * Feature: unused-components-integration, Property 2: TransferProcessingModal uses ProcessingModal as base
 * **Validates: Requirements 2.1**
 *
 * Feature: unused-components-integration, Property 4: TransferProcessingModal props passthrough
 * **Validates: Requirements 2.3**
 */

// Custom generators for TransferProcessingModal props

// Generate amount strings (numeric format with 2 decimal places)
const amountArbitrary = fc
    .float({ min: Math.fround(0.01), max: Math.fround(999999), noNaN: true })
    .map((n) => Math.abs(n).toFixed(2));

// Generate currency codes (3 uppercase letters)
const currencyArbitrary = fc.constantFrom('SGD', 'USD', 'EUR', 'GBP');

// Generate recipient strings (email or name)
const recipientArbitrary = fc.oneof(
    fc.emailAddress(),
    fc.string({ minLength: 2, maxLength: 30 }).filter((s) => s.trim().length > 0)
);

describe('TransferProcessingModal Property Tests', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllTimers();
    });

    // Feature: unused-components-integration, Property 2: TransferProcessingModal uses ProcessingModal as base
    describe('Property 2: TransferProcessingModal uses ProcessingModal as base', () => {
        /**
         * **Validates: Requirements 2.1**
         *
         * For any render of TransferProcessingModal with valid props, the resulting DOM
         * should contain the ProcessingModal component's expected structure
         * (identified by data-testid="processing-modal").
         */
        it('should render ProcessingModal base component for any valid props when isOpen is true', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    recipientArbitrary,
                    async (amount, currency, recipient) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TransferProcessingModal
                                isOpen={true}
                                amount={amount}
                                currency={currency}
                                recipient={recipient}
                                onComplete={onComplete}
                            />
                        );

                        // The ProcessingModal base component should be present
                        const processingModal = screen.getByTestId('processing-modal');
                        expect(processingModal).toBeInTheDocument();

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 2.1**
         *
         * Verify that the ProcessingModal backdrop is rendered when TransferProcessingModal is open.
         */
        it('should render ProcessingModal backdrop for any valid props when isOpen is true', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    recipientArbitrary,
                    async (amount, currency, recipient) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TransferProcessingModal
                                isOpen={true}
                                amount={amount}
                                currency={currency}
                                recipient={recipient}
                                onComplete={onComplete}
                            />
                        );

                        // The ProcessingModal backdrop should be present
                        const backdrop = screen.getByTestId('processing-modal-backdrop');
                        expect(backdrop).toBeInTheDocument();

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 2.1**
         *
         * Verify that TransferProcessingModal does not render ProcessingModal when isOpen is false.
         */
        it('should not render ProcessingModal when isOpen is false', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    recipientArbitrary,
                    async (amount, currency, recipient) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TransferProcessingModal
                                isOpen={false}
                                amount={amount}
                                currency={currency}
                                recipient={recipient}
                                onComplete={onComplete}
                            />
                        );

                        // The ProcessingModal should not be present when closed
                        const processingModal = screen.queryByTestId('processing-modal');
                        expect(processingModal).not.toBeInTheDocument();

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 2.1**
         *
         * Verify that the modal title is rendered correctly.
         */
        it('should render the modal title', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    recipientArbitrary,
                    async (amount, currency, recipient) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TransferProcessingModal
                                isOpen={true}
                                amount={amount}
                                currency={currency}
                                recipient={recipient}
                                onComplete={onComplete}
                            />
                        );

                        // The title should be rendered
                        const title = screen.getByTestId('processing-modal-title');
                        expect(title).toBeInTheDocument();

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 2.1**
         *
         * Verify that the modal heading is rendered correctly.
         */
        it('should render the modal heading', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    recipientArbitrary,
                    async (amount, currency, recipient) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TransferProcessingModal
                                isOpen={true}
                                amount={amount}
                                currency={currency}
                                recipient={recipient}
                                onComplete={onComplete}
                            />
                        );

                        // The heading should be rendered
                        const heading = screen.getByTestId('processing-modal-heading');
                        expect(heading).toBeInTheDocument();

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });

    // Feature: unused-components-integration, Property 4: TransferProcessingModal props passthrough
    describe('Property 4: TransferProcessingModal props passthrough', () => {
        /**
         * **Validates: Requirements 2.3**
         *
         * For any valid amount string and currency string passed to TransferProcessingModal,
         * the rendered output should contain those exact values in the appropriate display elements.
         */
        it('should display amount and currency in the processing modal for any valid props', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    recipientArbitrary,
                    async (amount, currency, recipient) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TransferProcessingModal
                                isOpen={true}
                                amount={amount}
                                currency={currency}
                                recipient={recipient}
                                onComplete={onComplete}
                            />
                        );

                        // The amount element should contain the exact amount and currency values
                        const amountElement = screen.getByTestId('processing-modal-amount');
                        expect(amountElement).toBeInTheDocument();
                        expect(amountElement.textContent).toContain(amount);
                        expect(amountElement.textContent).toContain(currency);

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 2.3**
         *
         * Verify that the recipient value is passed through correctly.
         */
        it('should display recipient in the secondary info chip', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    recipientArbitrary,
                    async (amount, currency, recipient) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TransferProcessingModal
                                isOpen={true}
                                amount={amount}
                                currency={currency}
                                recipient={recipient}
                                onComplete={onComplete}
                            />
                        );

                        // The secondary info element should contain the recipient
                        const secondaryInfoElement = screen.getByTestId('processing-modal-secondary-info');
                        expect(secondaryInfoElement).toBeInTheDocument();
                        expect(secondaryInfoElement.textContent).toContain(recipient);

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 2.3**
         *
         * Combined property test: For any valid combination of amount, currency, and recipient,
         * all values should be correctly passed through and displayed.
         */
        it('should pass through all props (amount, currency, recipient) correctly', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    recipientArbitrary,
                    async (amount, currency, recipient) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TransferProcessingModal
                                isOpen={true}
                                amount={amount}
                                currency={currency}
                                recipient={recipient}
                                onComplete={onComplete}
                            />
                        );

                        // Verify all props are passed through correctly
                        const amountElement = screen.getByTestId('processing-modal-amount');
                        const secondaryInfoElement = screen.getByTestId('processing-modal-secondary-info');

                        // Amount element should contain both amount and currency
                        const amountText = amountElement.textContent || '';
                        expect(amountText).toContain(amount);
                        expect(amountText).toContain(currency);

                        // Secondary info element should contain recipient
                        expect(secondaryInfoElement.textContent).toContain(recipient);

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 2.3**
         *
         * Verify that props are not displayed when modal is closed.
         */
        it('should not display props when modal is closed', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    recipientArbitrary,
                    async (amount, currency, recipient) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TransferProcessingModal
                                isOpen={false}
                                amount={amount}
                                currency={currency}
                                recipient={recipient}
                                onComplete={onComplete}
                            />
                        );

                        // When modal is closed, the elements should not be present
                        const amountElement = screen.queryByTestId('processing-modal-amount');
                        const secondaryInfoElement = screen.queryByTestId('processing-modal-secondary-info');

                        expect(amountElement).not.toBeInTheDocument();
                        expect(secondaryInfoElement).not.toBeInTheDocument();

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });
});
