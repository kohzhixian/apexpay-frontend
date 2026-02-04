import { protectedApi } from '../../../store/api';
import type {
    InitiatePaymentRequest,
    InitiatePaymentResponse,
    ProcessPaymentRequest,
    PaymentResponse,
} from '../types';

/** Base path for payment API endpoints */
const PAYMENT_BASE_PATH = '/payment';

/**
 * RTK Query API for payment operations.
 * Handles payment initiation, processing, and status checking.
 * Injected into the protected API (requires authentication).
 */
export const paymentApi = protectedApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Initiates a new payment request.
         * Creates a payment record in INITIATED status.
         * This endpoint is idempotent - if a payment with the same clientRequestId
         * already exists for the user, returns the existing payment.
         * @param request - The payment initiation request
         * @returns Response containing paymentId and version for subsequent processing
         */
        initiatePayment: builder.mutation<InitiatePaymentResponse, InitiatePaymentRequest>({
            query: (request) => ({
                url: PAYMENT_BASE_PATH,
                method: 'POST',
                body: request,
            }),
        }),

        /**
         * Processes an initiated payment through the full payment flow.
         * Executes the two-phase commit pattern:
         * 1. Validates the payment method belongs to the user
         * 2. Reserves funds in the user's wallet
         * 3. Charges the external payment provider
         * 4. Confirms or cancels the reservation based on charge result
         * 5. Updates the payment method's lastUsedAt on success
         * @param paymentId - The ID of the payment to process
         * @param paymentMethodId - The ID of the saved payment method to charge
         * @returns Response with final payment status (SUCCESS, PENDING, or FAILED)
         */
        processPayment: builder.mutation<PaymentResponse, { paymentId: string } & ProcessPaymentRequest>({
            query: ({ paymentId, paymentMethodId }) => ({
                url: `${PAYMENT_BASE_PATH}/${paymentId}/process`,
                method: 'POST',
                body: { paymentMethodId },
            }),
            invalidatesTags: ['Wallet', 'Transaction', 'PaymentMethod'],
        }),

        /**
         * Checks the status of a pending payment with the payment provider.
         * Used to poll for status updates when a payment is in PENDING state.
         * Queries the payment provider for the current transaction status.
         * @param paymentId - The ID of the payment to check
         * @returns Response with current payment status
         */
        checkPaymentStatus: builder.query<PaymentResponse, string>({
            query: (paymentId) => `${PAYMENT_BASE_PATH}/${paymentId}/status`,
        }),
    }),
});

// Export auto-generated hooks
export const {
    useInitiatePaymentMutation,
    useProcessPaymentMutation,
    useCheckPaymentStatusQuery,
    useLazyCheckPaymentStatusQuery,
} = paymentApi;
