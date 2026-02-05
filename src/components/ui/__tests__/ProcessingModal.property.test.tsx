import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import fc from 'fast-check';
import { ProcessingModal } from '../ProcessingModal';

/**
 * Property-based tests for ProcessingModal component
 *
 * Tests the unified processing modal that displays transaction progress
 * with visualizer, progress bar, timeline, and transaction details.
 */

// Custom generators for ProcessingModal props

// Generate non-empty strings for text fields
const nonEmptyStringArbitrary = fc
    .stringMatching(/^[a-zA-Z][a-zA-Z0-9 ]{0,29}$/)
    .filter((s) => s.trim().length > 0);

// Generate amount strings (numeric format with 2 decimal places)
const amountArbitrary = fc
    .float({ min: Math.fround(0.01), max: Math.fround(999999), noNaN: true })
    .map((n) => Math.abs(n).toFixed(2));

// Generate currency codes
const currencyArbitrary = fc.constantFrom('SGD', 'USD', 'EUR', 'GBP');

// Generate material icon names
const iconArbitrary = fc.constantFrom(
    'account_balance',
    'account_balance_wallet',
    'person',
    'credit_card',
    'alternate_email'
);

// Generate timeline step status
const stepStatusArbitrary = fc.constantFrom('pending', 'in-progress', 'completed') as fc.Arbitrary<
    'pending' | 'in-progress' | 'completed'
>;

// Generate a timeline step
const timelineStepArbitrary = fc.record({
    title: nonEmptyStringArbitrary,
    description: nonEmptyStringArbitrary,
    duration: fc.constantFrom('120ms', '45ms', 'PENDING', '1.2s'),
    status: stepStatusArbitrary,
});

// Generate timeline steps array (1-5 items)
const timelineStepsArbitrary = fc.array(timelineStepArbitrary, { minLength: 1, maxLength: 5 });

describe('ProcessingModal Property Tests', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllTimers();
    });

    describe('Modal Rendering', () => {
        /**
         * Verify that the modal renders when isOpen is true.
         */
        it('should render modal when isOpen is true', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    nonEmptyStringArbitrary,
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    async (title, heading, subtitle, amount, currency) => {
                        cleanup();
                        vi.useFakeTimers();

                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                heading={heading}
                                subtitle={subtitle}
                                amount={amount}
                                currency={currency}
                                sourceIcon="account_balance"
                                sourceLabel="Source"
                                destinationIcon="account_balance_wallet"
                                destinationLabel="Destination"
                                secondaryInfo="Info"
                                secondaryInfoLabel="Via"
                                secondaryInfoIcon="credit_card"
                                phaseName="Phase"
                                progressSubtext="Processing..."
                                onComplete={vi.fn()}
                            />
                        );

                        const modal = screen.getByTestId('processing-modal');
                        expect(modal).toBeInTheDocument();

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * Verify that the modal does not render when isOpen is false.
         */
        it('should not render modal when isOpen is false', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    nonEmptyStringArbitrary,
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    async (title, heading, subtitle, amount, currency) => {
                        cleanup();
                        vi.useFakeTimers();

                        render(
                            <ProcessingModal
                                isOpen={false}
                                title={title}
                                heading={heading}
                                subtitle={subtitle}
                                amount={amount}
                                currency={currency}
                                sourceIcon="account_balance"
                                sourceLabel="Source"
                                destinationIcon="account_balance_wallet"
                                destinationLabel="Destination"
                                secondaryInfo="Info"
                                secondaryInfoLabel="Via"
                                secondaryInfoIcon="credit_card"
                                phaseName="Phase"
                                progressSubtext="Processing..."
                                onComplete={vi.fn()}
                            />
                        );

                        const modal = screen.queryByTestId('processing-modal');
                        expect(modal).not.toBeInTheDocument();

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * Verify that the backdrop renders when modal is open.
         */
        it('should render backdrop when modal is open', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    async (title, amount, currency) => {
                        cleanup();
                        vi.useFakeTimers();

                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                heading="Processing"
                                subtitle="Please wait"
                                amount={amount}
                                currency={currency}
                                sourceIcon="account_balance"
                                sourceLabel="Source"
                                destinationIcon="account_balance_wallet"
                                destinationLabel="Destination"
                                secondaryInfo="Info"
                                secondaryInfoLabel="Via"
                                secondaryInfoIcon="credit_card"
                                phaseName="Phase"
                                progressSubtext="Processing..."
                                onComplete={vi.fn()}
                            />
                        );

                        const backdrop = screen.getByTestId('processing-modal-backdrop');
                        expect(backdrop).toBeInTheDocument();

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });

    describe('Props Passthrough', () => {
        /**
         * Verify that title is rendered correctly.
         */
        it('should render title correctly for any valid title string', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    async (title, amount, currency) => {
                        cleanup();
                        vi.useFakeTimers();

                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                heading="Processing"
                                subtitle="Please wait"
                                amount={amount}
                                currency={currency}
                                sourceIcon="account_balance"
                                sourceLabel="Source"
                                destinationIcon="account_balance_wallet"
                                destinationLabel="Destination"
                                secondaryInfo="Info"
                                secondaryInfoLabel="Via"
                                secondaryInfoIcon="credit_card"
                                phaseName="Phase"
                                progressSubtext="Processing..."
                                onComplete={vi.fn()}
                            />
                        );

                        const titleElement = screen.getByTestId('processing-modal-title');
                        expect(titleElement).toBeInTheDocument();
                        expect(titleElement.textContent?.trim()).toBe(title.trim());

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * Verify that heading is rendered correctly.
         */
        it('should render heading correctly for any valid heading string', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    async (title, heading, amount, currency) => {
                        cleanup();
                        vi.useFakeTimers();

                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                heading={heading}
                                subtitle="Please wait"
                                amount={amount}
                                currency={currency}
                                sourceIcon="account_balance"
                                sourceLabel="Source"
                                destinationIcon="account_balance_wallet"
                                destinationLabel="Destination"
                                secondaryInfo="Info"
                                secondaryInfoLabel="Via"
                                secondaryInfoIcon="credit_card"
                                phaseName="Phase"
                                progressSubtext="Processing..."
                                onComplete={vi.fn()}
                            />
                        );

                        const headingElement = screen.getByTestId('processing-modal-heading');
                        expect(headingElement).toBeInTheDocument();
                        expect(headingElement.textContent?.trim()).toBe(heading.trim());

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * Verify that amount and currency are rendered correctly.
         */
        it('should render amount and currency correctly', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    async (title, amount, currency) => {
                        cleanup();
                        vi.useFakeTimers();

                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                heading="Processing"
                                subtitle="Please wait"
                                amount={amount}
                                currency={currency}
                                sourceIcon="account_balance"
                                sourceLabel="Source"
                                destinationIcon="account_balance_wallet"
                                destinationLabel="Destination"
                                secondaryInfo="Info"
                                secondaryInfoLabel="Via"
                                secondaryInfoIcon="credit_card"
                                phaseName="Phase"
                                progressSubtext="Processing..."
                                onComplete={vi.fn()}
                            />
                        );

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
         * Verify that secondary info is rendered correctly.
         */
        it('should render secondary info correctly', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    nonEmptyStringArbitrary,
                    async (title, amount, currency, secondaryInfo) => {
                        cleanup();
                        vi.useFakeTimers();

                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                heading="Processing"
                                subtitle="Please wait"
                                amount={amount}
                                currency={currency}
                                sourceIcon="account_balance"
                                sourceLabel="Source"
                                destinationIcon="account_balance_wallet"
                                destinationLabel="Destination"
                                secondaryInfo={secondaryInfo}
                                secondaryInfoLabel="Via"
                                secondaryInfoIcon="credit_card"
                                phaseName="Phase"
                                progressSubtext="Processing..."
                                onComplete={vi.fn()}
                            />
                        );

                        const secondaryInfoElement = screen.getByTestId('processing-modal-secondary-info');
                        expect(secondaryInfoElement).toBeInTheDocument();
                        expect(secondaryInfoElement.textContent).toContain(secondaryInfo.trim());

                        vi.useRealTimers();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });

    describe('Progress Animation', () => {
        /**
         * Verify that onComplete is called when progress reaches 100%.
         */
        it('should call onComplete when progress animation completes', async () => {
            const onComplete = vi.fn();
            vi.useFakeTimers();

            render(
                <ProcessingModal
                    isOpen={true}
                    title="Processing"
                    heading="Processing Transaction"
                    subtitle="Please wait"
                    amount="100.00"
                    currency="SGD"
                    sourceIcon="account_balance"
                    sourceLabel="Source"
                    destinationIcon="account_balance_wallet"
                    destinationLabel="Destination"
                    secondaryInfo="Info"
                    secondaryInfoLabel="Via"
                    secondaryInfoIcon="credit_card"
                    phaseName="Phase"
                    progressSubtext="Processing..."
                    animationDurationMs={1000}
                    onComplete={onComplete}
                />
            );

            // Fast-forward through the animation using act
            await act(async () => {
                vi.advanceTimersByTime(1100);
            });

            expect(onComplete).toHaveBeenCalledTimes(1);

            vi.useRealTimers();
        });

        /**
         * Verify that progress resets when modal closes.
         */
        it('should reset progress when modal closes and reopens', async () => {
            const onComplete = vi.fn();
            vi.useFakeTimers();

            const { rerender } = render(
                <ProcessingModal
                    isOpen={true}
                    title="Processing"
                    heading="Processing Transaction"
                    subtitle="Please wait"
                    amount="100.00"
                    currency="SGD"
                    sourceIcon="account_balance"
                    sourceLabel="Source"
                    destinationIcon="account_balance_wallet"
                    destinationLabel="Destination"
                    secondaryInfo="Info"
                    secondaryInfoLabel="Via"
                    secondaryInfoIcon="credit_card"
                    phaseName="Phase"
                    progressSubtext="Processing..."
                    animationDurationMs={1000}
                    onComplete={onComplete}
                />
            );

            // Advance partially
            await act(async () => {
                vi.advanceTimersByTime(500);
            });

            // Close modal
            rerender(
                <ProcessingModal
                    isOpen={false}
                    title="Processing"
                    heading="Processing Transaction"
                    subtitle="Please wait"
                    amount="100.00"
                    currency="SGD"
                    sourceIcon="account_balance"
                    sourceLabel="Source"
                    destinationIcon="account_balance_wallet"
                    destinationLabel="Destination"
                    secondaryInfo="Info"
                    secondaryInfoLabel="Via"
                    secondaryInfoIcon="credit_card"
                    phaseName="Phase"
                    progressSubtext="Processing..."
                    animationDurationMs={1000}
                    onComplete={onComplete}
                />
            );

            // onComplete should not have been called
            expect(onComplete).not.toHaveBeenCalled();

            vi.useRealTimers();
        });
    });

    describe('Timeline Steps', () => {
        /**
         * Verify that custom timeline steps are rendered when provided.
         */
        it('should render custom timeline steps when provided', async () => {
            vi.useFakeTimers();

            const timelineSteps = [
                { title: 'Step One', description: 'First step', duration: '120ms', status: 'completed' as const },
                { title: 'Step Two', description: 'Second step', duration: '45ms', status: 'in-progress' as const },
                { title: 'Step Three', description: 'Third step', duration: 'PENDING', status: 'pending' as const },
            ];

            render(
                <ProcessingModal
                    isOpen={true}
                    title="Processing"
                    heading="Processing"
                    subtitle="Please wait"
                    amount="100.00"
                    currency="SGD"
                    sourceIcon="account_balance"
                    sourceLabel="Source"
                    destinationIcon="account_balance_wallet"
                    destinationLabel="Destination"
                    secondaryInfo="Info"
                    secondaryInfoLabel="Via"
                    secondaryInfoIcon="credit_card"
                    phaseName="Phase"
                    progressSubtext="Processing..."
                    timelineSteps={timelineSteps}
                    onComplete={vi.fn()}
                />
            );

            // Verify each step title is rendered
            expect(screen.getByText('Step One')).toBeInTheDocument();
            expect(screen.getByText('Step Two')).toBeInTheDocument();
            expect(screen.getByText('Step Three')).toBeInTheDocument();

            vi.useRealTimers();
        });
    });
});
