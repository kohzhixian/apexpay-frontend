import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { TopUpProcessingModal } from '../TopUpProcessingModal';

/**
 * Property-based tests for TopUpProcessingModal component
 *
 * Feature: unused-components-integration, Property 1: TopUpProcessingModal uses ProcessingModal as base
 * **Validates: Requirements 1.1**
 *
 * Feature: unused-components-integration, Property 3: TopUpProcessingModal props passthrough
 * **Validates: Requirements 1.3**
 */

// Custom generators for TopUpProcessingModal props

// Generate amount strings (numeric format with 2 decimal places)
const amountArbitrary = fc
    .float({ min: Math.fround(0.01), max: Math.fround(999999), noNaN: true })
    .map((n) => Math.abs(n).toFixed(2));

// Generate currency codes (3 uppercase letters)
const currencyArbitrary = fc.constantFrom('SGD', 'USD', 'EUR', 'GBP');

// Generate payment method strings (realistic payment method names)
const paymentMethodArbitrary = fc.constantFrom(
    'Chase Bank',
    'Visa ending in 4242',
    'Mastercard ending in 5555',
    'Bank of America',
    'Wells Fargo',
    'PayPal'
);

describe('TopUpProcessingModal Property Tests', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllTimers();
    });

    // Feature: unused-components-integration, Property 1: TopUpProcessingModal uses ProcessingModal as base
    describe('Property 1: TopUpProcessingModal uses ProcessingModal as base', () => {
        /**
         * **Validates: Requirements 1.1**
         *
         * For any render of TopUpProcessingModal with valid props, the resulting DOM
         * should contain the ProcessingModal component's expected structure
         * (identified by data-testid="processing-modal").
         */
        it('should render ProcessingModal base component for any valid props when isOpen is true', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    paymentMethodArbitrary,
                    async (amount, currency, paymentMethod) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TopUpProcessingModal
                                isOpen={true}
                                amount={amount}
                                currency={currency}
                                paymentMethod={paymentMethod}
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
         * **Validates: Requirements 1.1**
         *
         * Verify that the ProcessingModal backdrop is rendered when TopUpProcessingModal is open.
         */
        it('should render ProcessingModal backdrop for any valid props when isOpen is true', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    paymentMethodArbitrary,
                    async (amount, currency, paymentMethod) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TopUpProcessingModal
                                isOpen={true}
                                amount={amount}
                                currency={currency}
                                paymentMethod={paymentMethod}
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
         * **Validates: Requirements 1.1**
         *
         * Verify that TopUpProcessingModal does not render ProcessingModal when isOpen is false.
         */
        it('should not render ProcessingModal when isOpen is false', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    paymentMethodArbitrary,
                    async (amount, currency, paymentMethod) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TopUpProcessingModal
                                isOpen={false}
                                amount={amount}
                                currency={currency}
                                paymentMethod={paymentMethod}
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
         * **Validates: Requirements 1.1**
         *
         * Verify that the modal title is rendered correctly.
         */
        it('should render the modal title', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    paymentMethodArbitrary,
                    async (amount, currency, paymentMethod) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TopUpProcessingModal
                                isOpen={true}
                                amount={amount}
                                currency={currency}
                                paymentMethod={paymentMethod}
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
         * **Validates: Requirements 1.1**
         *
         * Verify that the modal heading is rendered correctly.
         */
        it('should render the modal heading', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    paymentMethodArbitrary,
                    async (amount, currency, paymentMethod) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TopUpProcessingModal
                                isOpen={true}
                                amount={amount}
                                currency={currency}
                                paymentMethod={paymentMethod}
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

    // Feature: unused-components-integration, Property 3: TopUpProcessingModal props passthrough
    describe('Property 3: TopUpProcessingModal props passthrough', () => {
        /**
         * **Validates: Requirements 1.3**
         *
         * For any valid amount string, currency string, and payment method string passed to
         * TopUpProcessingModal, the rendered output should contain those exact values in the
         * appropriate display elements.
         */
        it('should display the exact amount and currency in the transaction chips', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    paymentMethodArbitrary,
                    async (amount, currency, paymentMethod) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TopUpProcessingModal
                                isOpen={true}
                                amount={amount}
                                currency={currency}
                                paymentMethod={paymentMethod}
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
         * **Validates: Requirements 1.3**
         *
         * For any valid payment method string passed to TopUpProcessingModal, the rendered
         * output should contain that exact value in the secondary info display element.
         */
        it('should display the exact payment method in the secondary info chip', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    paymentMethodArbitrary,
                    async (amount, currency, paymentMethod) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TopUpProcessingModal
                                isOpen={true}
                                amount={amount}
                                currency={currency}
                                paymentMethod={paymentMethod}
                                onComplete={onComplete}
                            />
                        );

                        // The secondary info element should contain the exact payment method value
                        const secondaryInfoElement = screen.getByTestId('processing-modal-secondary-info');
                        expect(secondaryInfoElement).toBeInTheDocument();
                        expect(secondaryInfoElement.textContent).toContain(paymentMethod);

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 1.3**
         *
         * Combined property test: For any valid combination of amount, currency, and payment
         * method, all three values should be correctly passed through and displayed.
         */
        it('should pass through all props (amount, currency, paymentMethod) correctly', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    paymentMethodArbitrary,
                    async (amount, currency, paymentMethod) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TopUpProcessingModal
                                isOpen={true}
                                amount={amount}
                                currency={currency}
                                paymentMethod={paymentMethod}
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

                        // Secondary info element should contain exact payment method
                        expect(secondaryInfoElement.textContent).toContain(paymentMethod);

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 1.3**
         *
         * Verify that props are not displayed when the modal is closed.
         */
        it('should not display props when modal is closed', async () => {
            await fc.assert(
                fc.asyncProperty(
                    amountArbitrary,
                    currencyArbitrary,
                    paymentMethodArbitrary,
                    async (amount, currency, paymentMethod) => {
                        cleanup();
                        vi.useFakeTimers();

                        const onComplete = vi.fn();

                        render(
                            <TopUpProcessingModal
                                isOpen={false}
                                amount={amount}
                                currency={currency}
                                paymentMethod={paymentMethod}
                                onComplete={onComplete}
                            />
                        );

                        // When modal is closed, the amount and secondary info elements should not be present
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
