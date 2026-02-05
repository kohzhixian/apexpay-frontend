import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { SuccessModal } from '../SuccessModal';

/**
 * Property-based tests for SuccessModal component
 *
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
 * - Property 2: SuccessModal renders all configured props
 *
 * Feature: codebase-improvements
 */

// Custom generators for SuccessModal props

// Generate non-empty strings for text fields (alphanumeric with spaces, reasonable length)
const nonEmptyStringArbitrary = fc
    .stringMatching(/^[a-zA-Z][a-zA-Z0-9 ]{0,29}$/)
    .filter((s) => s.trim().length > 0);

// Generate amount strings (numeric format)
// Using Math.fround to ensure 32-bit float compatibility
const amountArbitrary = fc
    .float({ min: Math.fround(0.01), max: Math.fround(999999), noNaN: true })
    .map((n) => Math.abs(n).toFixed(2));

// Generate currency codes (3 uppercase letters)
const currencyArbitrary = fc.constantFrom('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY');

// Generate transaction detail items
const transactionDetailArbitrary = fc.record({
    label: nonEmptyStringArbitrary,
    value: nonEmptyStringArbitrary,
    icon: fc.option(fc.constantFrom('schedule', 'credit_card', 'account_balance', 'receipt'), { nil: undefined }),
    copyable: fc.option(fc.boolean(), { nil: undefined }),
});

// Generate details array (0-5 items)
const detailsArrayArbitrary = fc.array(transactionDetailArbitrary, { minLength: 0, maxLength: 5 });

// Generate recipient object
const recipientArbitrary = fc.record({
    name: nonEmptyStringArbitrary,
    avatar: fc.option(fc.webUrl(), { nil: undefined }),
});

// Generate action button config
const actionArbitrary = fc.record({
    label: nonEmptyStringArbitrary,
    onClick: fc.constant(vi.fn()),
});

// Generate secondary action with optional icon
const secondaryActionArbitrary = fc.record({
    label: nonEmptyStringArbitrary,
    icon: fc.option(fc.constantFrom('share', 'download', 'print', 'email'), { nil: undefined }),
    onClick: fc.constant(vi.fn()),
});

// Generate footer link
const footerLinkArbitrary = fc.record({
    text: nonEmptyStringArbitrary,
    href: fc.webUrl(),
});

// Generate balance value (positive number)
// Using Math.fround to ensure 32-bit float compatibility
const balanceValueArbitrary = fc.float({ min: 0, max: Math.fround(999999), noNaN: true });

describe('SuccessModal Property Tests', () => {
    afterEach(() => {
        cleanup();
    });

    // Feature: codebase-improvements, Property 2: SuccessModal renders all configured props
    describe('Property 2: SuccessModal renders all configured props', () => {
        /**
         * **Validates: Requirements 2.1**
         *
         * THE Reusable_Component SHALL accept configurable props for title, subtitle,
         * amount, currency, and transaction details.
         */
        it('should render title correctly for any valid title string', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    actionArbitrary,
                    async (title, amount, currency, primaryAction) => {
                        cleanup();
                        render(
                            <SuccessModal
                                isOpen={true}
                                onClose={vi.fn()}
                                title={title}
                                amount={amount}
                                currency={currency}
                                details={[]}
                                primaryAction={primaryAction}
                            />
                        );

                        const titleElement = screen.getByTestId('success-modal-title');
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
                    actionArbitrary,
                    async (title, subtitle, amount, currency, primaryAction) => {
                        cleanup();
                        render(
                            <SuccessModal
                                isOpen={true}
                                onClose={vi.fn()}
                                title={title}
                                subtitle={subtitle}
                                amount={amount}
                                currency={currency}
                                details={[]}
                                primaryAction={primaryAction}
                            />
                        );

                        const subtitleElement = screen.getByTestId('success-modal-subtitle');
                        expect(subtitleElement).toBeInTheDocument();
                        expect(subtitleElement.textContent?.trim()).toBe(subtitle.trim());
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
                    actionArbitrary,
                    async (title, amount, currency, primaryAction) => {
                        cleanup();
                        render(
                            <SuccessModal
                                isOpen={true}
                                onClose={vi.fn()}
                                title={title}
                                amount={amount}
                                currency={currency}
                                details={[]}
                                primaryAction={primaryAction}
                            />
                        );

                        const amountElement = screen.getByTestId('success-modal-amount');
                        expect(amountElement).toBeInTheDocument();
                        // The amount element should contain both the amount and currency
                        expect(amountElement.textContent).toContain(amount);
                        expect(amountElement.textContent).toContain(currency);
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 2.2**
         *
         * WHEN displaying transaction details, THE Reusable_Component SHALL render
         * a configurable list of key-value pairs.
         */
        it('should render all transaction details with labels and values', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    detailsArrayArbitrary,
                    actionArbitrary,
                    async (title, amount, currency, details, primaryAction) => {
                        cleanup();
                        render(
                            <SuccessModal
                                isOpen={true}
                                onClose={vi.fn()}
                                title={title}
                                amount={amount}
                                currency={currency}
                                details={details}
                                primaryAction={primaryAction}
                            />
                        );

                        if (details.length > 0) {
                            const detailsContainer = screen.getByTestId('success-modal-details');
                            expect(detailsContainer).toBeInTheDocument();

                            // Verify each detail is rendered
                            details.forEach((detail, index) => {
                                const detailElement = screen.getByTestId(`success-modal-detail-${index}`);
                                expect(detailElement).toBeInTheDocument();
                                expect(detailElement.textContent).toContain(detail.label.trim());
                                expect(detailElement.textContent).toContain(detail.value.trim());
                            });
                        } else {
                            // When no details, the details container should not be rendered
                            const detailsContainer = screen.queryByTestId('success-modal-details');
                            expect(detailsContainer).not.toBeInTheDocument();
                        }
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 2.3**
         *
         * THE Reusable_Component SHALL support optional recipient information
         * with avatar display.
         */
        it('should render recipient name when recipient is provided', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    recipientArbitrary,
                    actionArbitrary,
                    async (title, amount, currency, recipient, primaryAction) => {
                        cleanup();
                        render(
                            <SuccessModal
                                isOpen={true}
                                onClose={vi.fn()}
                                title={title}
                                amount={amount}
                                currency={currency}
                                details={[]}
                                recipient={recipient}
                                primaryAction={primaryAction}
                            />
                        );

                        const recipientElement = screen.getByTestId('success-modal-recipient-name');
                        expect(recipientElement).toBeInTheDocument();
                        expect(recipientElement.textContent).toContain(recipient.name.trim());

                        // Avatar should also be rendered
                        const avatarElement = screen.getByTestId('success-modal-recipient-avatar');
                        expect(avatarElement).toBeInTheDocument();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 2.4**
         *
         * THE Reusable_Component SHALL provide configurable primary and secondary
         * action buttons.
         */
        it('should render primary action button with correct label', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    actionArbitrary,
                    async (title, amount, currency, primaryAction) => {
                        cleanup();
                        render(
                            <SuccessModal
                                isOpen={true}
                                onClose={vi.fn()}
                                title={title}
                                amount={amount}
                                currency={currency}
                                details={[]}
                                primaryAction={primaryAction}
                            />
                        );

                        const primaryButton = screen.getByTestId('success-modal-primary-action');
                        expect(primaryButton).toBeInTheDocument();
                        expect(primaryButton.textContent?.trim()).toBe(primaryAction.label.trim());
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render secondary action button when provided', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    actionArbitrary,
                    secondaryActionArbitrary,
                    async (title, amount, currency, primaryAction, secondaryAction) => {
                        cleanup();
                        render(
                            <SuccessModal
                                isOpen={true}
                                onClose={vi.fn()}
                                title={title}
                                amount={amount}
                                currency={currency}
                                details={[]}
                                primaryAction={primaryAction}
                                secondaryAction={secondaryAction}
                            />
                        );

                        const secondaryButton = screen.getByTestId('success-modal-secondary-action');
                        expect(secondaryButton).toBeInTheDocument();
                        expect(secondaryButton.textContent).toContain(secondaryAction.label.trim());
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should not render secondary action button when not provided', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    actionArbitrary,
                    async (title, amount, currency, primaryAction) => {
                        cleanup();
                        render(
                            <SuccessModal
                                isOpen={true}
                                onClose={vi.fn()}
                                title={title}
                                amount={amount}
                                currency={currency}
                                details={[]}
                                primaryAction={primaryAction}
                            />
                        );

                        const secondaryButton = screen.queryByTestId('success-modal-secondary-action');
                        expect(secondaryButton).not.toBeInTheDocument();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        /**
         * **Validates: Requirements 2.5**
         *
         * WHEN the modal is closed, THE Reusable_Component SHALL call the provided
         * onClose callback.
         */
        it('should not render when isOpen is false', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    actionArbitrary,
                    async (title, amount, currency, primaryAction) => {
                        cleanup();
                        render(
                            <SuccessModal
                                isOpen={false}
                                onClose={vi.fn()}
                                title={title}
                                amount={amount}
                                currency={currency}
                                details={[]}
                                primaryAction={primaryAction}
                            />
                        );

                        const modal = screen.queryByTestId('success-modal');
                        expect(modal).not.toBeInTheDocument();
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render footer text when provided', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    actionArbitrary,
                    nonEmptyStringArbitrary,
                    async (title, amount, currency, primaryAction, footerText) => {
                        cleanup();
                        render(
                            <SuccessModal
                                isOpen={true}
                                onClose={vi.fn()}
                                title={title}
                                amount={amount}
                                currency={currency}
                                details={[]}
                                primaryAction={primaryAction}
                                footerText={footerText}
                            />
                        );

                        const footerElement = screen.getByTestId('success-modal-footer-text');
                        expect(footerElement).toBeInTheDocument();
                        expect(footerElement.textContent).toContain(footerText.trim());
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render footer link when provided', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    actionArbitrary,
                    footerLinkArbitrary,
                    async (title, amount, currency, primaryAction, footerLink) => {
                        cleanup();
                        render(
                            <SuccessModal
                                isOpen={true}
                                onClose={vi.fn()}
                                title={title}
                                amount={amount}
                                currency={currency}
                                details={[]}
                                primaryAction={primaryAction}
                                footerLink={footerLink}
                            />
                        );

                        const linkElement = screen.getByTestId('success-modal-footer-link');
                        expect(linkElement).toBeInTheDocument();
                        expect(linkElement.textContent?.trim()).toBe(footerLink.text.trim());
                        expect(linkElement).toHaveAttribute('href', footerLink.href);
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should render balance value when provided without recipient', async () => {
            await fc.assert(
                fc.asyncProperty(
                    nonEmptyStringArbitrary,
                    amountArbitrary,
                    currencyArbitrary,
                    actionArbitrary,
                    nonEmptyStringArbitrary,
                    balanceValueArbitrary,
                    async (title, amount, currency, primaryAction, balanceLabel, balanceValue) => {
                        cleanup();
                        render(
                            <SuccessModal
                                isOpen={true}
                                onClose={vi.fn()}
                                title={title}
                                amount={amount}
                                currency={currency}
                                details={[]}
                                primaryAction={primaryAction}
                                balanceLabel={balanceLabel}
                                balanceValue={balanceValue}
                            />
                        );

                        const balanceElement = screen.getByTestId('success-modal-balance');
                        expect(balanceElement).toBeInTheDocument();
                        // Balance should be formatted with $ and .toFixed(2)
                        expect(balanceElement.textContent).toContain(balanceValue.toFixed(2));
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
                    detailsArrayArbitrary,
                    actionArbitrary,
                    fc.option(secondaryActionArbitrary, { nil: undefined }),
                    fc.option(nonEmptyStringArbitrary, { nil: undefined }),
                    fc.option(footerLinkArbitrary, { nil: undefined }),
                    async (
                        title,
                        subtitle,
                        amount,
                        currency,
                        details,
                        primaryAction,
                        secondaryAction,
                        footerText,
                        footerLink
                    ) => {
                        cleanup();
                        render(
                            <SuccessModal
                                isOpen={true}
                                onClose={vi.fn()}
                                title={title}
                                subtitle={subtitle}
                                amount={amount}
                                currency={currency}
                                details={details}
                                primaryAction={primaryAction}
                                secondaryAction={secondaryAction}
                                footerText={footerText}
                                footerLink={footerLink}
                            />
                        );

                        // Modal should be rendered
                        const modal = screen.getByTestId('success-modal');
                        expect(modal).toBeInTheDocument();

                        // Title should always be present
                        const titleElement = screen.getByTestId('success-modal-title');
                        expect(titleElement.textContent?.trim()).toBe(title.trim());

                        // Subtitle should be present only if provided
                        if (subtitle) {
                            const subtitleElement = screen.getByTestId('success-modal-subtitle');
                            expect(subtitleElement.textContent?.trim()).toBe(subtitle.trim());
                        } else {
                            expect(screen.queryByTestId('success-modal-subtitle')).not.toBeInTheDocument();
                        }

                        // Primary action should always be present
                        const primaryButton = screen.getByTestId('success-modal-primary-action');
                        expect(primaryButton.textContent?.trim()).toBe(primaryAction.label.trim());

                        // Secondary action should be present only if provided
                        if (secondaryAction) {
                            const secondaryButton = screen.getByTestId('success-modal-secondary-action');
                            expect(secondaryButton.textContent).toContain(secondaryAction.label.trim());
                        } else {
                            expect(screen.queryByTestId('success-modal-secondary-action')).not.toBeInTheDocument();
                        }

                        // Footer text should be present only if provided
                        if (footerText) {
                            const footerElement = screen.getByTestId('success-modal-footer-text');
                            expect(footerElement.textContent).toContain(footerText.trim());
                        }

                        // Footer link should be present only if provided
                        if (footerLink) {
                            const linkElement = screen.getByTestId('success-modal-footer-link');
                            expect(linkElement.textContent?.trim()).toBe(footerLink.text.trim());
                        }

                        // Details should be rendered correctly
                        if (details.length > 0) {
                            details.forEach((detail, index) => {
                                const detailElement = screen.getByTestId(`success-modal-detail-${index}`);
                                expect(detailElement.textContent).toContain(detail.label.trim());
                                expect(detailElement.textContent).toContain(detail.value.trim());
                            });
                        }
                    }
                ),
                { numRuns: 100 }
            );
        }, 60000);
    });
});
