import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { ProcessingModal } from '../ProcessingModal';

/**
 * Property-based tests for ProcessingModal component
 *
 * **Validates: Requirements 3.1, 3.2, 3.3**
 * - Property 3: ProcessingModal renders all configured props
 *
 * Feature: codebase-improvements
 */

// Custom generators for ProcessingModal props

// Generate non-empty strings for text fields (alphanumeric with spaces, reasonable length)
const nonEmptyStringArbitrary = fc
    .stringMatching(/^[a-zA-Z][a-zA-Z0-9 ]{0,29}$/)
    .filter((s) => s.trim().length > 0);

// Generate step ID strings (alphanumeric, no spaces)
const stepIdArbitrary = fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,14}$/);

// Generate amount strings (numeric format)
const amountArbitrary = fc
    .float({ min: Math.fround(0.01), max: Math.fround(999999), noNaN: true })
    .map((n) => Math.abs(n).toFixed(2));

// Generate currency codes (3 uppercase letters)
const currencyArbitrary = fc.constantFrom('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY');

// Generate step status
const stepStatusArbitrary = fc.constantFrom('pending', 'in-progress', 'completed') as fc.Arbitrary<
    'pending' | 'in-progress' | 'completed'
>;

// Generate progress percentage (0-100)
const progressArbitrary = fc.integer({ min: 0, max: 100 });

// Generate duration string (e.g., "1.2s", "0.5s")
const durationArbitrary = fc
    .float({ min: Math.fround(0.1), max: Math.fround(9.9), noNaN: true })
    .map((n) => `${Math.abs(n).toFixed(1)}s`);

// Generate badge strings
const badgeArbitrary = fc.stringMatching(/^[A-Z][A-Z0-9_]{0,9}$/);

// Generate badges array (0-3 items)
const badgesArrayArbitrary = fc.array(badgeArbitrary, { minLength: 0, maxLength: 3 });

// Generate a processing step
const processingStepArbitrary = fc.record({
    id: stepIdArbitrary,
    title: nonEmptyStringArbitrary,
    description: nonEmptyStringArbitrary,
    status: stepStatusArbitrary,
    progress: fc.option(progressArbitrary, { nil: undefined }),
    badges: fc.option(badgesArrayArbitrary, { nil: undefined }),
    duration: fc.option(durationArbitrary, { nil: undefined }),
});

// Generate steps array with unique IDs (0-5 items)
const stepsArrayArbitrary = fc
    .array(processingStepArbitrary, { minLength: 0, maxLength: 5 })
    .map((steps) => {
        // Ensure unique IDs by appending index
        return steps.map((step, index) => ({
            ...step,
            id: `${step.id}_${index}`,
        }));
    });

// Generate log status
const logStatusArbitrary = fc.constantFrom('OK', 'INFO', 'PROC', 'ERROR') as fc.Arbitrary<
    'OK' | 'INFO' | 'PROC' | 'ERROR'
>;

// Generate timestamp string (HH:MM:SS format)
const timestampArbitrary = fc
    .tuple(
        fc.integer({ min: 0, max: 23 }),
        fc.integer({ min: 0, max: 59 }),
        fc.integer({ min: 0, max: 59 })
    )
    .map(([h, m, s]) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);

// Generate a log entry
const logEntryArbitrary = fc.record({
    timestamp: timestampArbitrary,
    status: logStatusArbitrary,
    message: nonEmptyStringArbitrary,
});

// Generate logs array (0-5 items)
const logsArrayArbitrary = fc.array(logEntryArbitrary, { minLength: 0, maxLength: 5 });

// Generate header badges array (0-3 items)
const headerBadgesArbitrary = fc.array(badgeArbitrary, { minLength: 0, maxLength: 3 });

// Generate transaction ID string
const transactionIdArbitrary = fc.stringMatching(/^TX[A-Z0-9]{6,10}$/);

describe('ProcessingModal Property Tests', () => {
    afterEach(() => {
        cleanup();
    });

    // Feature: codebase-improvements, Property 3: ProcessingModal renders all configured props
    describe('Property 3: ProcessingModal renders all configured props', () => {
        /**
         * **Validates: Requirements 3.1**
         *
         * THE Reusable_Component SHALL display a configurable title and subtitle
         * during processing.
         */
        it('should render title correctly for any valid title string', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    async (title, amount, currency) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                amount={amount}
                                currency={currency}
                            />
                        );

                        const titleElement = screen.getByTestId('processing-modal-title');
                        expect(titleElement).toBeInTheDocument();
                        expect(titleElement.textContent?.trim()).toBe(title.trim());
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render subtitle when provided', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    async (title, subtitle, amount, currency) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                subtitle={subtitle}
                                amount={amount}
                                currency={currency}
                            />
                        );

                        const subtitleElement = screen.getByTestId('processing-modal-subtitle');
                        expect(subtitleElement).toBeInTheDocument();
                        expect(subtitleElement.textContent?.trim()).toBe(subtitle.trim());
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should not render subtitle when not provided', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    async (title, amount, currency) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                amount={amount}
                                currency={currency}
                            />
                        );

                        const subtitleElement = screen.queryByTestId('processing-modal-subtitle');
                        expect(subtitleElement).not.toBeInTheDocument();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render amount and currency correctly', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    async (title, amount, currency) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                amount={amount}
                                currency={currency}
                            />
                        );

                        const amountElement = screen.getByTestId('processing-modal-amount');
                        expect(amountElement).toBeInTheDocument();
                        expect(amountElement.textContent).toContain(amount);
                        expect(amountElement.textContent).toContain(currency);
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render transaction ID when provided', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    transactionIdArbitrary,
                    async (title, amount, currency, transactionId) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                amount={amount}
                                currency={currency}
                                transactionId={transactionId}
                            />
                        );

                        const transactionIdElement = screen.getByTestId('processing-modal-transaction-id');
                        expect(transactionIdElement).toBeInTheDocument();
                        expect(transactionIdElement.textContent).toContain(transactionId);
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render header badges when provided', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    headerBadgesArbitrary.filter((badges) => badges.length > 0),
                    async (title, amount, currency, headerBadges) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                amount={amount}
                                currency={currency}
                                headerBadges={headerBadges}
                            />
                        );

                        const badgesContainer = screen.getByTestId('processing-modal-header-badges');
                        expect(badgesContainer).toBeInTheDocument();

                        // Verify each badge is rendered
                        headerBadges.forEach((badge) => {
                            const badgeElement = screen.getByTestId(`header-badge-${badge}`);
                            expect(badgeElement).toBeInTheDocument();
                            expect(badgeElement.textContent).toBe(badge);
                        });
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 3.2**
         *
         * WHEN processing steps are provided, THE Reusable_Component SHALL render
         * a progress timeline with step status indicators.
         */
        it('should render all processing steps with titles and descriptions', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    stepsArrayArbitrary.filter((steps) => steps.length > 0),
                    async (title, amount, currency, steps) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                amount={amount}
                                currency={currency}
                                steps={steps}
                            />
                        );

                        const stepsContainer = screen.getByTestId('processing-modal-steps');
                        expect(stepsContainer).toBeInTheDocument();

                        // Verify each step is rendered with title and description
                        steps.forEach((step) => {
                            const stepTitle = screen.getByTestId(`step-title-${step.id}`);
                            expect(stepTitle).toBeInTheDocument();
                            expect(stepTitle.textContent?.trim()).toBe(step.title.trim());

                            const stepDescription = screen.getByTestId(`step-description-${step.id}`);
                            expect(stepDescription).toBeInTheDocument();
                            expect(stepDescription.textContent?.trim()).toBe(step.description.trim());
                        });
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render step status icons correctly', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    stepsArrayArbitrary.filter((steps) => steps.length > 0),
                    async (title, amount, currency, steps) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                amount={amount}
                                currency={currency}
                                steps={steps}
                            />
                        );

                        // Verify each step has an icon element
                        steps.forEach((step) => {
                            const stepIcon = screen.getByTestId(`step-icon-${step.id}`);
                            expect(stepIcon).toBeInTheDocument();
                        });
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render step duration when provided', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    stepsArrayArbitrary
                        .filter((steps) => steps.length > 0)
                        .map((steps) =>
                            steps.map((step, index) => ({
                                ...step,
                                duration: `${(index + 1) * 0.5}s`,
                            }))
                        ),
                    async (title, amount, currency, steps) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                amount={amount}
                                currency={currency}
                                steps={steps}
                            />
                        );

                        // Verify each step has duration displayed
                        steps.forEach((step) => {
                            const durationElement = screen.getByTestId(`step-duration-${step.id}`);
                            expect(durationElement).toBeInTheDocument();
                            expect(durationElement.textContent).toContain(step.duration);
                        });
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render step badges when provided', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    stepsArrayArbitrary
                        .filter((steps) => steps.length > 0)
                        .map((steps) =>
                            steps.map((step) => ({
                                ...step,
                                badges: ['BADGE1', 'BADGE2'],
                            }))
                        ),
                    async (title, amount, currency, steps) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                amount={amount}
                                currency={currency}
                                steps={steps}
                            />
                        );

                        // Verify each step has badges container
                        steps.forEach((step) => {
                            const badgesContainer = screen.getByTestId(`step-badges-${step.id}`);
                            expect(badgesContainer).toBeInTheDocument();
                        });
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render progress bar for in-progress steps with progress value', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    progressArbitrary,
                    async (title, amount, currency, progress) => {
                        cleanup();
                        const steps = [
                            {
                                id: 'step1',
                                title: 'Processing',
                                description: 'In progress step',
                                status: 'in-progress' as const,
                                progress,
                            },
                        ];

                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                amount={amount}
                                currency={currency}
                                steps={steps}
                            />
                        );

                        const progressElement = screen.getByTestId('step-progress-step1');
                        expect(progressElement).toBeInTheDocument();
                        // Progress percentage should be displayed
                        expect(progressElement.textContent).toContain(`${progress}%`);
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should not render steps container when steps array is empty', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    async (title, amount, currency) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                amount={amount}
                                currency={currency}
                                steps={[]}
                            />
                        );

                        const stepsContainer = screen.queryByTestId('processing-modal-steps');
                        expect(stepsContainer).not.toBeInTheDocument();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 3.3**
         *
         * THE Reusable_Component SHALL support optional log entries display
         * for technical feedback.
         */
        it('should render all log entries with timestamp, status, and message', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    logsArrayArbitrary.filter((logs) => logs.length > 0),
                    async (title, amount, currency, logs) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                amount={amount}
                                currency={currency}
                                logs={logs}
                            />
                        );

                        const logsContainer = screen.getByTestId('processing-modal-logs');
                        expect(logsContainer).toBeInTheDocument();

                        // Verify each log entry is rendered
                        logs.forEach((log, index) => {
                            const logEntry = screen.getByTestId(`log-entry-${index}`);
                            expect(logEntry).toBeInTheDocument();
                            expect(logEntry.textContent).toContain(log.timestamp);
                            expect(logEntry.textContent).toContain(log.status);
                            expect(logEntry.textContent).toContain(log.message.trim());
                        });
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should not render logs container when logs array is empty', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    async (title, amount, currency) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                amount={amount}
                                currency={currency}
                                logs={[]}
                            />
                        );

                        const logsContainer = screen.queryByTestId('processing-modal-logs');
                        expect(logsContainer).not.toBeInTheDocument();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * Modal visibility test
         */
        it('should not render when isOpen is false', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    async (title, amount, currency) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={false}
                                title={title}
                                amount={amount}
                                currency={currency}
                            />
                        );

                        const modal = screen.queryByTestId('processing-modal');
                        expect(modal).not.toBeInTheDocument();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * Combined test: Verify all props render together correctly
         */
        it('should render complete modal with all optional props', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    fc.option(nonEmptyStringArbitrary, { nil: undefined }),
                    amountArbitrary,
                    currencyArbitrary,
                    stepsArrayArbitrary,
                    logsArrayArbitrary,
                    headerBadgesArbitrary,
                    fc.option(transactionIdArbitrary, { nil: undefined }),
                    async (title, subtitle, amount, currency, steps, logs, headerBadges, transactionId) => {
                        cleanup();
                        render(
                            <ProcessingModal
                                isOpen={true}
                                title={title}
                                subtitle={subtitle}
                                amount={amount}
                                currency={currency}
                                steps={steps}
                                logs={logs}
                                headerBadges={headerBadges}
                                transactionId={transactionId}
                            />
                        );

                        // Modal should be rendered
                        const modal = screen.getByTestId('processing-modal');
                        expect(modal).toBeInTheDocument();

                        // Title should always be present
                        const titleElement = screen.getByTestId('processing-modal-title');
                        expect(titleElement.textContent?.trim()).toBe(title.trim());

                        // Amount should always be present
                        const amountElement = screen.getByTestId('processing-modal-amount');
                        expect(amountElement.textContent).toContain(amount);
                        expect(amountElement.textContent).toContain(currency);

                        // Subtitle should be present only if provided
                        if (subtitle) {
                            const subtitleElement = screen.getByTestId('processing-modal-subtitle');
                            expect(subtitleElement.textContent?.trim()).toBe(subtitle.trim());
                        } else {
                            expect(screen.queryByTestId('processing-modal-subtitle')).not.toBeInTheDocument();
                        }

                        // Transaction ID should be present only if provided
                        if (transactionId) {
                            const txIdElement = screen.getByTestId('processing-modal-transaction-id');
                            expect(txIdElement.textContent).toContain(transactionId);
                        } else {
                            expect(screen.queryByTestId('processing-modal-transaction-id')).not.toBeInTheDocument();
                        }

                        // Header badges should be present only if provided and non-empty
                        if (headerBadges.length > 0) {
                            const badgesContainer = screen.getByTestId('processing-modal-header-badges');
                            expect(badgesContainer).toBeInTheDocument();
                        } else {
                            expect(screen.queryByTestId('processing-modal-header-badges')).not.toBeInTheDocument();
                        }

                        // Steps should be present only if provided and non-empty
                        if (steps.length > 0) {
                            const stepsContainer = screen.getByTestId('processing-modal-steps');
                            expect(stepsContainer).toBeInTheDocument();

                            steps.forEach((step) => {
                                const stepTitle = screen.getByTestId(`step-title-${step.id}`);
                                expect(stepTitle.textContent?.trim()).toBe(step.title.trim());

                                const stepDescription = screen.getByTestId(`step-description-${step.id}`);
                                expect(stepDescription.textContent?.trim()).toBe(step.description.trim());
                            });
                        } else {
                            expect(screen.queryByTestId('processing-modal-steps')).not.toBeInTheDocument();
                        }

                        // Logs should be present only if provided and non-empty
                        if (logs.length > 0) {
                            const logsContainer = screen.getByTestId('processing-modal-logs');
                            expect(logsContainer).toBeInTheDocument();

                            logs.forEach((log, index) => {
                                const logEntry = screen.getByTestId(`log-entry-${index}`);
                                expect(logEntry.textContent).toContain(log.timestamp);
                                expect(logEntry.textContent).toContain(log.status);
                            });
                        } else {
                            expect(screen.queryByTestId('processing-modal-logs')).not.toBeInTheDocument();
                        }
                    }
                ),
                { numRuns: 100 }
            );
        }, 60000);
    });
});
