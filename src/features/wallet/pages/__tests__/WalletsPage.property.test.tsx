import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { WalletsPage } from '../WalletsPage';

/**
 * Property-based tests for WalletsPage loading state
 *
 * **Validates: Requirements 4.1, 4.2**
 * - Property 6: Loading state displays LoadingSkeleton (WalletsPage portion)
 * - Property 7: Card variant for card-like placeholders (WalletsPage portion)
 *
 * Feature: unused-components-integration
 */

// Mock RTK Query hooks
const mockGetWalletQuery = vi.fn();
const mockGetRecentTransactionsQuery = vi.fn();
const mockCreateWalletMutation = vi.fn();
const mockUpdateWalletNameMutation = vi.fn();

vi.mock('../../services/walletApi', () => ({
    useGetWalletQuery: () => mockGetWalletQuery(),
    useGetRecentTransactionsQuery: () => mockGetRecentTransactionsQuery(),
    useCreateWalletMutation: () => mockCreateWalletMutation(),
    useUpdateWalletNameMutation: () => mockUpdateWalletNameMutation(),
}));

// Mock child components that are not relevant to loading state tests
vi.mock('../../components/Sidebar', () => ({
    Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock('../../components/NetWorthCard', () => ({
    NetWorthCard: () => <div data-testid="net-worth-card">Net Worth Card</div>,
}));

vi.mock('../../components/WalletCard', () => ({
    WalletCard: ({ wallet }: { wallet: { id: string; name: string } }) => (
        <div data-testid="wallet-card">{wallet.name}</div>
    ),
}));

vi.mock('../../components/ActivityTable', () => ({
    ActivityTable: () => <div data-testid="activity-table">Activity Table</div>,
}));

vi.mock('../../components/AddWalletModal', () => ({
    AddWalletModal: () => null,
}));

vi.mock('../../components/TransferModal', () => ({
    TransferModal: () => null,
}));

vi.mock('../../components/TopUpModal', () => ({
    TopUpModal: () => null,
}));

vi.mock('../../components/EditWalletNameModal', () => ({
    EditWalletNameModal: () => null,
}));

// Generator for wallet data
const walletDataArbitrary = fc.record({
    walletId: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 50 }),
    balance: fc.float({ min: 0, max: 100000, noNaN: true }),
    currency: fc.constantFrom('SGD', 'USD', 'EUR', 'GBP'),
});

// Generator for transaction data
const transactionDataArbitrary = fc.record({
    id: fc.uuid(),
    type: fc.constantFrom('deposit', 'withdrawal', 'transfer'),
    amount: fc.float({ min: 0, max: 10000, noNaN: true }),
    currency: fc.constantFrom('SGD', 'USD', 'EUR', 'GBP'),
    date: fc.date().map((d) => d.toISOString()),
    description: fc.string({ minLength: 1, maxLength: 100 }),
});

// Generator for loading state combinations
const loadingStateArbitrary = fc.record({
    isLoadingWallet: fc.boolean(),
    isLoadingActivities: fc.boolean(),
});

describe('WalletsPage Property Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock for mutations (not loading)
        mockCreateWalletMutation.mockReturnValue([vi.fn(), { isLoading: false }]);
        mockUpdateWalletNameMutation.mockReturnValue([vi.fn(), { isLoading: false }]);
    });

    afterEach(() => {
        cleanup();
    });

    // Feature: unused-components-integration, Property 6: Loading state displays LoadingSkeleton
    describe('Property 6: Loading state displays LoadingSkeleton (WalletsPage portion)', () => {
        /**
         * **Validates: Requirements 4.1**
         *
         * For any component with a loading state, when the loading flag is `true`,
         * the rendered output should contain at least one `LoadingSkeleton` component
         * (identified by `data-testid="loading-skeleton"`).
         */
        it('should display LoadingSkeleton when wallet data is loading', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.array(transactionDataArbitrary, { minLength: 0, maxLength: 5 }),
                    async (transactions) => {
                        cleanup();

                        // Setup: wallet is loading, activities are available
                        mockGetWalletQuery.mockReturnValue({
                            data: undefined,
                            isLoading: true,
                            refetch: vi.fn(),
                        });
                        mockGetRecentTransactionsQuery.mockReturnValue({
                            data: transactions,
                            isLoading: false,
                        });

                        render(<WalletsPage />);

                        // Verify: LoadingSkeleton components are displayed
                        const skeletons = screen.getAllByTestId('loading-skeleton');
                        expect(skeletons.length).toBeGreaterThanOrEqual(1);
                    }
                ),
                { numRuns: 100 }
            );
        }, 60000);

        it('should display at least 1 LoadingSkeleton for wallet card placeholder when loading', async () => {
            await fc.assert(
                fc.asyncProperty(fc.constant(null), async () => {
                    cleanup();

                    // Setup: loading state
                    mockGetWalletQuery.mockReturnValue({
                        data: undefined,
                        isLoading: true,
                        refetch: vi.fn(),
                    });
                    mockGetRecentTransactionsQuery.mockReturnValue({
                        data: [],
                        isLoading: false,
                    });

                    render(<WalletsPage />);

                    // Verify: at least 1 LoadingSkeleton component for wallet card placeholder
                    const skeletons = screen.getAllByTestId('loading-skeleton');
                    expect(skeletons.length).toBeGreaterThanOrEqual(1);
                }),
                { numRuns: 100 }
            );
        }, 60000);

        it('should NOT display LoadingSkeleton when wallet data is loaded', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.array(walletDataArbitrary, { minLength: 1, maxLength: 5 }),
                    fc.array(transactionDataArbitrary, { minLength: 0, maxLength: 5 }),
                    async (wallets, transactions) => {
                        cleanup();

                        // Setup: data is loaded
                        mockGetWalletQuery.mockReturnValue({
                            data: wallets,
                            isLoading: false,
                            refetch: vi.fn(),
                        });
                        mockGetRecentTransactionsQuery.mockReturnValue({
                            data: transactions,
                            isLoading: false,
                        });

                        render(<WalletsPage />);

                        // Verify: no LoadingSkeleton components are displayed
                        const skeletons = screen.queryAllByTestId('loading-skeleton');
                        expect(skeletons).toHaveLength(0);
                    }
                ),
                { numRuns: 100 }
            );
        }, 60000);

        it('should display LoadingSkeleton only when isLoadingWallet is true', async () => {
            await fc.assert(
                fc.asyncProperty(loadingStateArbitrary, async ({ isLoadingWallet, isLoadingActivities }) => {
                    cleanup();

                    // Setup: variable loading states
                    mockGetWalletQuery.mockReturnValue({
                        data: isLoadingWallet ? undefined : [{ walletId: '1', name: 'Test', balance: 100, currency: 'SGD' }],
                        isLoading: isLoadingWallet,
                        refetch: vi.fn(),
                    });
                    mockGetRecentTransactionsQuery.mockReturnValue({
                        data: isLoadingActivities ? undefined : [],
                        isLoading: isLoadingActivities,
                    });

                    render(<WalletsPage />);

                    // Verify: LoadingSkeleton is displayed only when wallet is loading
                    const skeletons = screen.queryAllByTestId('loading-skeleton');
                    if (isLoadingWallet) {
                        expect(skeletons.length).toBeGreaterThanOrEqual(1);
                    } else {
                        expect(skeletons).toHaveLength(0);
                    }
                }),
                { numRuns: 100 }
            );
        }, 60000);
    });

    // Feature: unused-components-integration, Property 7: Card variant for card-like placeholders
    describe('Property 7: Card variant for card-like placeholders (WalletsPage portion)', () => {
        /**
         * **Validates: Requirements 4.2**
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
                        refetch: vi.fn(),
                    });
                    mockGetRecentTransactionsQuery.mockReturnValue({
                        data: [],
                        isLoading: false,
                    });

                    render(<WalletsPage />);

                    // Verify: all LoadingSkeleton components have card variant
                    const skeletons = screen.getAllByTestId('loading-skeleton');
                    skeletons.forEach((skeleton) => {
                        expect(skeleton).toHaveAttribute('data-variant', 'card');
                    });
                }),
                { numRuns: 100 }
            );
        }, 60000);

        it('should use card variant for all wallet card placeholders regardless of activity loading state', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.boolean(),
                    async (isLoadingActivities) => {
                        cleanup();

                        // Setup: wallet is loading, activities may or may not be loading
                        mockGetWalletQuery.mockReturnValue({
                            data: undefined,
                            isLoading: true,
                            refetch: vi.fn(),
                        });
                        mockGetRecentTransactionsQuery.mockReturnValue({
                            data: isLoadingActivities ? undefined : [],
                            isLoading: isLoadingActivities,
                        });

                        render(<WalletsPage />);

                        // Verify: all LoadingSkeleton components have card variant
                        const skeletons = screen.getAllByTestId('loading-skeleton');
                        expect(skeletons.length).toBeGreaterThanOrEqual(1);
                        skeletons.forEach((skeleton) => {
                            expect(skeleton).toHaveAttribute('data-variant', 'card');
                        });
                    }
                ),
                { numRuns: 100 }
            );
        }, 60000);

        it('should have correct height for card placeholders (192px for wallet cards)', async () => {
            await fc.assert(
                fc.asyncProperty(fc.constant(null), async () => {
                    cleanup();

                    // Setup: loading state
                    mockGetWalletQuery.mockReturnValue({
                        data: undefined,
                        isLoading: true,
                        refetch: vi.fn(),
                    });
                    mockGetRecentTransactionsQuery.mockReturnValue({
                        data: [],
                        isLoading: false,
                    });

                    render(<WalletsPage />);

                    // Verify: LoadingSkeleton components have correct height (192px as per design)
                    const skeletons = screen.getAllByTestId('loading-skeleton');
                    skeletons.forEach((skeleton) => {
                        expect(skeleton.style.height).toBe('192px');
                    });
                }),
                { numRuns: 100 }
            );
        }, 60000);
    });
});
