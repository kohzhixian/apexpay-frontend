import { protectedApi, CACHE_DURATIONS } from '../../../store/api';
import type { PaymentMethodResponse } from '../types';

/** Base path for payment method API endpoints */
const PAYMENT_METHOD_BASE_PATH = '/payment-methods';

/**
 * RTK Query API for payment method operations.
 * Injected into the protected API (requires authentication).
 */
export const paymentMethodApi = protectedApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Gets all payment methods for the authenticated user.
         * Returns payment methods ordered by last used timestamp (most recent first).
         * The first payment method in the list is marked as the default.
         * 
         * Cache duration: STABLE (600 seconds / 10 minutes)
         * Payment methods rarely change, so we use a longer cache duration to reduce API calls.
         */
        getPaymentMethods: builder.query<PaymentMethodResponse[], void>({
            query: () => PAYMENT_METHOD_BASE_PATH,
            providesTags: ['PaymentMethod'],
            // Payment methods rarely change - use STABLE cache duration (10 minutes)
            keepUnusedDataFor: CACHE_DURATIONS.STABLE,
        }),

        /**
         * Deletes a payment method for the authenticated user.
         * @param paymentMethodId - The ID of the payment method to delete
         */
        deletePaymentMethod: builder.mutation<void, string>({
            query: (paymentMethodId) => ({
                url: `${PAYMENT_METHOD_BASE_PATH}/${paymentMethodId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['PaymentMethod'],
        }),
    }),
});

// Export auto-generated hooks
export const {
    useGetPaymentMethodsQuery,
    useDeletePaymentMethodMutation,
} = paymentMethodApi;
