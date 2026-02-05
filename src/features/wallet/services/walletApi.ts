import { protectedApi, CACHE_DURATIONS } from '../../../store/api';
import type {
    CreateWalletRequest,
    CreateWalletResponse,
    TopUpWalletRequest,
    TopUpWalletResponse,
    TransferRequest,
    TransferResponse,
    GetBalanceResponse,
    TransactionHistoryItem,
    GetTransactionHistoryParams,
    ReserveFundsRequest,
    ReserveFundsResponse,
    ConfirmReservationRequest,
    CancelReservationRequest,
    ConfirmReservationResponse,
    CancelReservationResponse,
    GetWalletResponse,
    ActivityItem,
    UpdateWalletNameRequest,
    UpdateWalletNameResponse,
    GetMonthlySummaryResponse,
    GetMonthlyGrowthResponse,
} from '../types';

/** Base path for wallet API endpoints */
const WALLET_BASE_PATH = '/wallet';

// Inject wallet endpoints into the PROTECTED API (requires auth)
export const walletApi = protectedApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Creates a new wallet for the authenticated user
         */
        createWallet: builder.mutation<CreateWalletResponse, CreateWalletRequest>({
            query: (body) => ({
                url: WALLET_BASE_PATH,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Wallet'],
        }),

        /**
         * Updates the name of an existing wallet
         * @param walletId - The wallet ID to update (path variable)
         * @param walletName - The new wallet name (request body)
         */
        updateWalletName: builder.mutation<
            UpdateWalletNameResponse,
            { walletId: string } & UpdateWalletNameRequest
        >({
            query: ({ walletId, walletName }) => ({
                url: `${WALLET_BASE_PATH}/${walletId}/name`,
                method: 'PATCH',
                body: { walletName } as UpdateWalletNameRequest,
            }),
            invalidatesTags: ['Wallet'],
        }),

        /**
         * Tops up the wallet balance
         */
        topUpWallet: builder.mutation<TopUpWalletResponse, TopUpWalletRequest>({
            query: (body) => ({
                url: `${WALLET_BASE_PATH}/topup`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Wallet', 'Transaction', 'PaymentMethod'],
        }),

        /**
         * Transfers funds between wallets
         */
        transfer: builder.mutation<TransferResponse, TransferRequest>({
            query: (body) => ({
                url: `${WALLET_BASE_PATH}/transfer`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Wallet', 'Transaction'],
        }),

        /**
         * Gets the current balance for a wallet
         * @param walletId - The wallet ID to get balance for
         * 
         * Cache: SEMI_STABLE (300s / 5 minutes)
         * Wallet balances change occasionally (after transactions) but not constantly.
         * A 5-minute cache provides a good balance between freshness and reducing API calls.
         * Balance updates are also triggered by cache invalidation when transactions occur.
         */
        getBalance: builder.query<GetBalanceResponse, string>({
            query: (walletId) => `${WALLET_BASE_PATH}/${walletId}/balance`,
            providesTags: ['Wallet'],
            // Use SEMI_STABLE cache duration - balances change occasionally but not constantly
            keepUnusedDataFor: CACHE_DURATIONS.SEMI_STABLE,
        }),

        /**
         * Gets transaction history with optional wallet filter and pagination
         * @param walletId - Optional wallet ID to filter transactions
         * @param offset - Pagination offset (1-based, defaults to 1)
         * 
         * Cache: FREQUENT (60s / 1 minute) - uses default from protectedApi
         * Transactions update frequently as users make payments and transfers.
         * The default FREQUENT cache duration ensures users see recent activity
         * while still reducing unnecessary API calls.
         */
        getTransactionHistory: builder.query<
            TransactionHistoryItem[],
            GetTransactionHistoryParams
        >({
            query: ({ walletId, offset = 1 }) => {
                const params = new URLSearchParams();
                if (walletId) params.append('walletId', walletId);
                params.append('offset', offset.toString());
                return `${WALLET_BASE_PATH}/history?${params.toString()}`;
            },
            providesTags: ['Transaction'],
            // Uses default FREQUENT cache duration (60s) - transactions update frequently
        }),

        /**
         * Reserves funds for a pending payment
         * @param walletId - The wallet ID to reserve funds from
         */
        reserveFunds: builder.mutation<
            ReserveFundsResponse,
            { walletId: string; body: ReserveFundsRequest }
        >({
            query: ({ walletId, body }) => ({
                url: `${WALLET_BASE_PATH}/${walletId}/reserve`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Wallet', 'Transaction'],
        }),

        /**
         * Confirms a fund reservation after successful payment
         * @param walletId - The wallet ID with the reservation
         */
        confirmReservation: builder.mutation<
            ConfirmReservationResponse,
            { walletId: string; body: ConfirmReservationRequest }
        >({
            query: ({ walletId, body }) => ({
                url: `${WALLET_BASE_PATH}/${walletId}/confirm`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Wallet', 'Transaction'],
        }),

        /**
         * Cancels a fund reservation
         * @param walletId - The wallet ID with the reservation
         */
        cancelReservation: builder.mutation<
            CancelReservationResponse,
            { walletId: string; body: CancelReservationRequest }
        >({
            query: ({ walletId, body }) => ({
                url: `${WALLET_BASE_PATH}/${walletId}/cancel`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Wallet', 'Transaction'],
        }),

        /**
         * Gets wallet details for the authenticated user
         * User ID is extracted from the auth header by the backend
         * Returns an array of wallets
         * 
         * Cache: SEMI_STABLE (300s / 5 minutes)
         * Wallet details (name, currency, etc.) change infrequently.
         * A 5-minute cache reduces API calls while ensuring reasonable freshness.
         * Wallet updates are also triggered by cache invalidation on mutations.
         */
        getWallet: builder.query<GetWalletResponse[], void>({
            query: () => `${WALLET_BASE_PATH}/user`,
            providesTags: ['Wallet'],
            // Use SEMI_STABLE cache duration - wallet details change infrequently
            keepUnusedDataFor: CACHE_DURATIONS.SEMI_STABLE,
        }),

        /**
         * Gets recent transactions across all user wallets
         * Returns the 5 most recent transactions for display in activity summary
         * 
         * Cache: FREQUENT (60s / 1 minute) - uses default from protectedApi
         * Recent transactions need to stay fresh to show users their latest activity.
         * The default FREQUENT cache duration ensures timely updates.
         */
        getRecentTransactions: builder.query<ActivityItem[], void>({
            query: () => `${WALLET_BASE_PATH}/transactions/recent`,
            providesTags: ['Transaction'],
            // Uses default FREQUENT cache duration (60s) - recent activity updates frequently
        }),

        /**
         * Gets monthly summary stats (income and spending) for the current month
         * User ID is extracted from the auth header by the backend
         * 
         * Cache: SEMI_STABLE (300s / 5 minutes)
         * Monthly stats change with each transaction but don't need real-time updates.
         * Cache is invalidated when transactions occur.
         */
        getMonthlySummary: builder.query<GetMonthlySummaryResponse, void>({
            query: () => `${WALLET_BASE_PATH}/stats/monthly-summary`,
            providesTags: ['Transaction'],
            keepUnusedDataFor: CACHE_DURATIONS.SEMI_STABLE,
        }),

        /**
         * Gets monthly growth percentage for the user's wallets
         * User ID is extracted from the auth header by the backend
         * 
         * Cache: SEMI_STABLE (300s / 5 minutes)
         * Growth percentage changes with transactions but doesn't need real-time updates.
         * Cache is invalidated when transactions occur.
         */
        getMonthlyGrowth: builder.query<GetMonthlyGrowthResponse, void>({
            query: () => `${WALLET_BASE_PATH}/stats/monthly-growth`,
            providesTags: ['Transaction'],
            keepUnusedDataFor: CACHE_DURATIONS.SEMI_STABLE,
        }),
    }),
});

// Export auto-generated hooks
export const {
    useCreateWalletMutation,
    useUpdateWalletNameMutation,
    useTopUpWalletMutation,
    useTransferMutation,
    useGetBalanceQuery,
    useGetTransactionHistoryQuery,
    useReserveFundsMutation,
    useConfirmReservationMutation,
    useCancelReservationMutation,
    useGetWalletQuery,
    useGetRecentTransactionsQuery,
    useGetMonthlySummaryQuery,
    useGetMonthlyGrowthQuery,
} = walletApi;
