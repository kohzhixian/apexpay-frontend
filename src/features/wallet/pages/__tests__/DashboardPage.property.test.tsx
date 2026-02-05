import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { DashboardPage } from '../DashboardPage';

/**
 * Property-based tests for DashboardPage loading state
 *
 * **Validates: Requirements 3.1, 3.2**
 * - Property 6: Loading state displays LoadingSkeleton (DashboardPage portion)
 * - Property 7: Card variant for card-like placeholders (DashboardPage portion)
 *
 * Feature: unused-components-integration
 */

// Mock RTK Query hooks
const mockGetWalletQuery = vi.fn();
const mockGetUserDetailsQuery = vi.fn();
const mockGetMonthlySummaryQuery = vi.fn();

vi.mock('../../services/walletApi', () => ({
    useGetWalletQuery: () => mockGetWalletQuery(),
    useGetMonthlySummaryQuery: () => mockGetMonthlySummaryQuery(),
}));

vi.mock('../../../user/services/userApi', () => ({
    useGetUserDetailsQuery: () => mockGetUserDetailsQuery(),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// Mock child components that are not relevant to loading state tests
vi.mock('../../components/Sidebar', () => ({
    Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock('../../components/DashboardHeader', () => ({
    DashboardHeader: ({ userName }: { userName: string }) => (
        <div data-testid="dashboard-header">Welcome, {userName}</div>
    ),
}));

vi.mock('../../components/BalanceCard', () => ({
    BalanceCard: () => <div data-testid="balance-card">Balance Card</div>,
}));

vi.mock('../../components/QuickActionButton', () => ({
    QuickActionButton: () => <div data-testid="quick-action-button">Quick Action</div>,
}));

vi.mock('../../components/TransactionTable', () => ({
    TransactionTable: () => <div data-testid="transaction-table">Transaction Table</div>,
}));

vi.mock('../../components/MonthlySummaryCard', () => ({
    MonthlySummaryCard: () => <div data-testid="monthly-summary-card">Monthly Summary Card</div>,
}));

vi.mock('../../components/TopUpModal', () => ({
    TopUpModal: () => null,
}));

// Generators for property tests
const loadingStateArbitrary = fc.record({
    isLoadingWallet: fc.boolean(),
    isLoadingUser: fc.boolean(),
});

// Generator for wallet data
const walletDataArbitrary = fc.record({
    walletId: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 50 }),
    balance: fc.float({ min: 0, max: 100000, noNaN: true }),
    currency: fc.constantFrom('SGD', 'USD', 'EUR', 'GBP'),
});

// Generator for user data
const userDataArbitrary = fc.record({
    userId: fc.uuid(),
    username: fc.string({ minLength: 1, maxLength: 30 }),
    email: fc.emailAddress(),
});

describe('DashboardPage Property Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock for monthly summary (not loading)
        mockGetMonthlySummaryQuery.mockReturnValue({
            data: { income: 1000, spending: 500, currency: 'SGD' },
            isLoading: false,
        });
    });

    afterEach(() => {
        cleanup();
    });

    // Feature: unused-components-integration, Property 6: Loading state displays LoadingSkeleton
    describe('Property 6: Loading state displays LoadingSkeleton (DashboardPage portion)', () => {
        /**
         * **Validates: Requirements 3.1**
         *
         * For any component with a loading state, when the loading flag is `true`,
         * the rendered output should contain at least one `LoadingSkeleton` component
         * (identified by `data-testid="loading-skeleton"`).
         */
        it('should display LoadingSkeleton when wallet data is loading', async () => {
            await fc.assert(
                fc.asyncProperty(userDataArbitrary, async (userData) => {
                    cleanup();

                    // Setup: wallet is loading, user data is available
                    mockGetWalletQuery.mockReturnValue({
                        data: undefined,
                        isLoading: true,
                    });
                    mockGetUserDetailsQuery.mockReturnValue({
                        data: userData,
                        isLoading: false,
                    });

                    render(<DashboardPage />);

                    // Verify: LoadingSkeleton components are displayed
                    const skeletons = screen.getAllByTestId('loading-skeleton');
                    expect(skeletons.length).toBeGreaterThanOrEqual(1);
                }),
                { numRuns: 100 }
            );
        }, 60000);

        it('should display LoadingSkeleton when user data is loading', async () => {
            await fc.assert(
                fc.asyncProperty(walletDataArbitrary, async (walletData) => {
                    cleanup();

                    // Setup: user is loading, wallet data is available
                    mockGetWalletQuery.mockReturnValue({
                        data: [walletData],
                        isLoading: false,
                    });
                    mockGetUserDetailsQuery.mockReturnValue({
                        data: undefined,
                        isLoading: true,
                    });

                    render(<DashboardPage />);

                    // Verify: LoadingSkeleton components are displayed
                    const skeletons = screen.getAllByTestId('loading-skeleton');
                    expect(skeletons.length).toBeGreaterThanOrEqual(1);
                }),
                { numRuns: 100 }
            );
        }, 60000);

        it('should display LoadingSkeleton when both wallet and user data are loading', async () => {
            await fc.assert(
                fc.asyncProperty(fc.constant(null), async () => {
                    cleanup();

                    // Setup: both are loading
                    mockGetWalletQuery.mockReturnValue({
                        data: undefined,
                        isLoading: true,
                    });
                    mockGetUserDetailsQuery.mockReturnValue({
                        data: undefined,
                        isLoading: true,
                    });

                    render(<DashboardPage />);

                    // Verify: LoadingSkeleton components are displayed
                    const skeletons = screen.getAllByTestId('loading-skeleton');
                    expect(skeletons.length).toBeGreaterThanOrEqual(1);
                }),
                { numRuns: 100 }
            );
        }, 60000);

        it('should display exactly 2 LoadingSkeleton components for balance cards when loading', async () => {
            await fc.assert(
                fc.asyncProperty(fc.constant(null), async () => {
                    cleanup();

                    // Setup: loading state
                    mockGetWalletQuery.mockReturnValue({
                        data: undefined,
                        isLoading: true,
                    });
                    mockGetUserDetailsQuery.mockReturnValue({
                        data: undefined,
                        isLoading: true,
                    });

                    render(<DashboardPage />);

                    // Verify: exactly 2 LoadingSkeleton components for the 2 balance cards
                    const skeletons = screen.getAllByTestId('loading-skeleton');
                    expect(skeletons).toHaveLength(2);
                }),
                { numRuns: 100 }
            );
        }, 60000);

        it('should NOT display LoadingSkeleton when data is loaded', async () => {
            await fc.assert(
                fc.asyncProperty(
                    walletDataArbitrary,
                    userDataArbitrary,
                    async (walletData, userData) => {
                        cleanup();

                        // Setup: data is loaded
                        mockGetWalletQuery.mockReturnValue({
                            data: [walletData],
                            isLoading: false,
                        });
                        mockGetUserDetailsQuery.mockReturnValue({
                            data: userData,
                            isLoading: false,
                        });

                        render(<DashboardPage />);

                        // Verify: no LoadingSkeleton components are displayed
                        const skeletons = screen.queryAllByTestId('loading-skeleton');
                        expect(skeletons).toHaveLength(0);
                    }
                ),
                { numRuns: 100 }
            );
        }, 60000);
    });

    // Feature: unused-components-integration, Property 7: Card variant for card-like placeholders
    describe('Property 7: Card variant for card-like placeholders (DashboardPage portion)', () => {
        /**
         * **Validates: Requirements 3.2**
         *
         * For any loading skeleton used as a placeholder for card-like content,
         * the `data-variant` attribute should be `"card"`.
         */
        it('should use card variant for wallet card placeholders', async () => {
            await fc.assert(
                fc.asyncProperty(fc.constant(null), async () => {
                    cleanup();

                    // Setup: loading state
                    mockGetWalletQuery.mockReturnValue({
                        data: undefined,
                        isLoading: true,
                    });
                    mockGetUserDetailsQuery.mockReturnValue({
                        data: undefined,
                        isLoading: true,
                    });

                    render(<DashboardPage />);

                    // Verify: all LoadingSkeleton components have card variant
                    const skeletons = screen.getAllByTestId('loading-skeleton');
                    skeletons.forEach((skeleton) => {
                        expect(skeleton).toHaveAttribute('data-variant', 'card');
                    });
                }),
                { numRuns: 100 }
            );
        }, 60000);

        it('should use card variant for all balance card placeholders regardless of loading source', async () => {
            await fc.assert(
                fc.asyncProperty(loadingStateArbitrary, async ({ isLoadingWallet, isLoadingUser }) => {
                    // Skip if neither is loading (no skeletons expected)
                    if (!isLoadingWallet && !isLoadingUser) {
                        return;
                    }

                    cleanup();

                    // Setup: at least one is loading
                    mockGetWalletQuery.mockReturnValue({
                        data: isLoadingWallet ? undefined : [{ walletId: '1', name: 'Test', balance: 100, currency: 'SGD' }],
                        isLoading: isLoadingWallet,
                    });
                    mockGetUserDetailsQuery.mockReturnValue({
                        data: isLoadingUser ? undefined : { userId: '1', username: 'Test', email: 'test@test.com' },
                        isLoading: isLoadingUser,
                    });

                    render(<DashboardPage />);

                    // Verify: all LoadingSkeleton components have card variant
                    const skeletons = screen.getAllByTestId('loading-skeleton');
                    expect(skeletons.length).toBeGreaterThanOrEqual(1);
                    skeletons.forEach((skeleton) => {
                        expect(skeleton).toHaveAttribute('data-variant', 'card');
                    });
                }),
                { numRuns: 100 }
            );
        }, 60000);

        it('should have correct height for card placeholders (160px for balance cards)', async () => {
            await fc.assert(
                fc.asyncProperty(fc.constant(null), async () => {
                    cleanup();

                    // Setup: loading state
                    mockGetWalletQuery.mockReturnValue({
                        data: undefined,
                        isLoading: true,
                    });
                    mockGetUserDetailsQuery.mockReturnValue({
                        data: undefined,
                        isLoading: true,
                    });

                    render(<DashboardPage />);

                    // Verify: LoadingSkeleton components have correct height
                    const skeletons = screen.getAllByTestId('loading-skeleton');
                    skeletons.forEach((skeleton) => {
                        expect(skeleton.style.height).toBe('160px');
                    });
                }),
                { numRuns: 100 }
            );
        }, 60000);
    });
});
