import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Cache duration constants (in seconds) for RTK Query endpoints.
 * These values determine how long unused data remains in the cache before being garbage collected.
 * 
 * Usage guidelines:
 * - STABLE: Use for data that rarely changes (payment methods, user profile)
 * - SEMI_STABLE: Use for data that changes occasionally (wallet list, contacts)
 * - FREQUENT: Use for data that changes often (transactions, balances) - this is the default
 */
export const CACHE_DURATIONS = {
    /** Stable data that rarely changes (payment methods, user profile) - 10 minutes */
    STABLE: 600,
    /** Semi-stable data (wallet list, contacts) - 5 minutes */
    SEMI_STABLE: 300,
    /** Frequently changing data (transactions, balances) - 1 minute (default) */
    FREQUENT: 60,
} as const;

/** Mutex to prevent multiple simultaneous token refresh attempts */
const mutex = new Mutex();

const baseQueryWithCredentials = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
});

/**
 * Base query wrapper that automatically refreshes access token on 401 errors.
 * Uses a mutex to prevent race conditions when multiple requests fail simultaneously.
 * @param args - The request arguments (URL string or FetchArgs object)
 * @param api - The RTK Query API object
 * @param extraOptions - Additional options passed to the base query
 * @returns The query result
 */
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    // Wait if another request is currently refreshing the token
    await mutex.waitForUnlock();

    let result = await baseQueryWithCredentials(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Check if another request is already refreshing
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();

            try {
                // Attempt to refresh the token
                const refreshResult = await baseQueryWithCredentials(
                    { url: '/auth/refresh', method: 'POST' },
                    api,
                    extraOptions
                );

                if (!refreshResult.error) {
                    // Token refreshed successfully - retry the original request
                    result = await baseQueryWithCredentials(args, api, extraOptions);
                } else {
                    // Refresh failed - user needs to log in again
                    // TODO: Dispatch logout action when auth slice is implemented
                    // api.dispatch(logout());
                }
            } finally {
                release();
            }
        } else {
            // Another request already refreshed the token - wait and retry
            await mutex.waitForUnlock();
            result = await baseQueryWithCredentials(args, api, extraOptions);
        }
    }

    return result;
};

// Public API - no authentication required, but needs credentials for cookie handling
export const publicApi = createApi({
    reducerPath: 'publicApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: 'include', // Required to receive and store Set-Cookie headers
    }),
    tagTypes: [],
    endpoints: () => ({}),
});

// Protected API - requires authentication with automatic token refresh
// Default cache duration is set to FREQUENT (60 seconds) since most protected endpoints
// deal with frequently changing data like transactions and balances.
// Individual endpoints can override this with longer durations for stable data.
export const protectedApi = createApi({
    reducerPath: 'protectedApi',
    baseQuery: baseQueryWithReauth,
    // Default cache duration for most endpoints - use FREQUENT for transaction/balance data
    keepUnusedDataFor: CACHE_DURATIONS.FREQUENT,
    tagTypes: ['User', 'Wallet', 'Transaction', 'Contact', 'PaymentMethod'],
    endpoints: () => ({}),
});
