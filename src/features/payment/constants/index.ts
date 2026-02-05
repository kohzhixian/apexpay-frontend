import type { MockPaymentMethod, DevToolsStats } from '../types';

// ============================================
// Mock Provider Constants
// ============================================

export const PROVIDER_NAME = 'MOCK';
export const TRANSACTION_ID_PREFIX = 'mock_ch_';

// Test tokens for deterministic testing
export const MockTokens = {
    VISA_SUCCESS: 'tok_visa_success',
    CARD_DECLINED: 'tok_card_declined',
    INSUFFICIENT_FUNDS: 'tok_insufficient_funds',
    EXPIRED_CARD: 'tok_expired_card',
    INVALID_CARD: 'tok_invalid_card',
    FRAUD_SUSPECTED: 'tok_fraud_suspected',
    NETWORK_ERROR: 'tok_network_error',
    PROVIDER_UNAVAILABLE: 'tok_provider_unavailable',
    RATE_LIMITED: 'tok_rate_limited',
    SLOW_RESPONSE: 'tok_slow_response',
    PENDING: 'tok_pending',
} as const;

// Failure messages
export const MockMessages = {
    CARD_DECLINED: 'Your card was declined',
    CARD_DECLINED_BY_BANK: 'Card was declined by issuing bank',
    INSUFFICIENT_FUNDS: 'Insufficient funds on card',
    INSUFFICIENT_FUNDS_SHORT: 'Insufficient funds',
    CARD_EXPIRED: 'Card has expired',
    INVALID_CARD: 'Card number is invalid',
    FRAUD_SUSPECTED: 'Transaction flagged for potential fraud',
    NETWORK_TIMEOUT: 'Network timeout connecting to payment processor',
    NETWORK_TIMEOUT_SHORT: 'Network timeout',
    PROVIDER_UNAVAILABLE: 'Payment provider is temporarily unavailable',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
    RATE_LIMITED: 'Rate limit exceeded',
    TRANSACTION_NOT_FOUND: 'Transaction not found: %s',
} as const;

// ============================================
// Default Mock Payment Methods
// ============================================

export const DEFAULT_MOCK_PAYMENT_METHODS: MockPaymentMethod[] = [
    {
        id: 'mock_card_declined',
        displayName: 'Test Card (Declined)',
        token: MockTokens.CARD_DECLINED,
        tokenType: 'error',
    },
    {
        id: 'mock_insufficient_funds',
        displayName: 'Test Card (Insufficient Funds)',
        token: MockTokens.INSUFFICIENT_FUNDS,
        tokenType: 'error',
    },
    {
        id: 'mock_pending',
        displayName: 'Bank Transfer (Delayed)',
        token: MockTokens.PENDING,
        tokenType: 'pending',
    },
];

// ============================================
// Default Stats
// ============================================

export const DEFAULT_STATS: DevToolsStats = {
    latency: 24,
    apiRequests: '1.2k',
    errorRate: '0.04%',
    region: 'SG',
};

// ============================================
// UI Text Constants
// ============================================

export const PaymentDevToolsText = {
    HEADER_TITLE: 'ApexPay',
    HEADER_VERSION: 'DevTools v2.4',
    SANDBOX_BADGE: 'Sandbox Environment',

    // Panel 1
    PANEL1_TITLE: 'Initiate Payment',
    SOURCE_WALLET_LABEL: 'SOURCE WALLET',
    AMOUNT_LABEL: 'AMOUNT',
    AMOUNT_PLACEHOLDER: '0.00',
    CURRENCY_LABEL: 'CURRENCY',
    CURRENCY_SGD: 'SGD',
    CLIENT_REQUEST_ID_LABEL: 'CLIENT REQUEST ID',
    CREATE_INTENT_BUTTON: 'Create Payment Intent',
    CREATING_BUTTON: 'Creating...',
    PROCESS_PAYMENT_BUTTON: 'Process Payment',
    PROCESSING_BUTTON: 'Processing...',
    AVAILABLE_BALANCE_PREFIX: 'Available:',
    REFRESH_REQUEST_ID_LABEL: 'Refresh request ID',

    // Panel 2
    PANEL2_TITLE: 'Payment Methods & Mock Tokens',
    SAVED_METHODS_LABEL: 'SAVED PAYMENT METHODS',
    MOCK_TOKENS_LABEL: 'MOCK TOKENS (TESTING)',
    LOADING_METHODS: 'Loading payment methods...',
    NO_SAVED_METHODS: 'No saved payment methods',
    DEFAULT_BADGE: 'DEFAULT',
    ADD_CUSTOM_PROVIDER: '+ Add Custom Mock Provider',
    SUCCESS_MOCK: 'SUCCESS MOCK',
    ERROR_MOCK: 'ERROR MOCK',
    PENDING_MOCK: 'PENDING MOCK',

    // Panel 3
    PANEL3_TITLE: 'Process & Real-time Status',
    PID_PREFIX: 'PID:',
    STATUS_INITIATED: 'INITIATED',
    STATUS_PENDING: 'PENDING VERIFICATION',
    STATUS_SETTLED: 'SETTLED / COMPLETED',
    CURRENT_STATE: 'CURRENT STATE',
    OUTCOME_NOT_DETERMINED: 'Outcome not yet determined',
    AWAITING_PROVIDER_RESPONSE: 'Awaiting provider response...',
    RAW_JSON_TITLE: 'RAW PAYMENT STATE (JSON)',
    NO_PAYMENT_STATE: 'No payment state available',
    CHECK_STATUS_BUTTON: 'CHECK STATUS',
    CHECKING_STATUS_BUTTON: 'Checking...',
    VOID_BUTTON: 'VOID',
    COPY_JSON_LABEL: 'Copy JSON',

    // Panel 4
    PANEL4_TITLE: 'Debug Panel',
    LIVE_LOGS: 'Live Logs',
    NO_LOGS_MESSAGE: 'No logs yet. Create a payment intent to see activity.',
    FILTER_PLACEHOLDER: 'filter: tags:ledger,auth',

    // Stats
    LATENCY_LABEL: 'LATENCY',
    LATENCY_UNIT: 'ms',
    API_REQUESTS_LABEL: 'API REQUESTS',
    API_REQUESTS_UNIT: '/hr',
    ERROR_RATE_LABEL: 'ERROR RATE',
    REGION_LABEL: 'REGION',

    // Loading states
    LOADING_WALLETS: 'Loading wallets...',

    // Debug log messages
    LOG_INITIATING_PAYMENT: (amount: string, currency: string) => `Initiating payment for ${amount} ${currency}`,
    LOG_PAYMENT_INITIATED: (paymentId: string) => `Payment initiated [${paymentId}]`,
    LOG_PAYMENT_COMPLETED: 'Payment completed successfully',
    LOG_PAYMENT_PENDING: 'Payment pending',
    LOG_PAYMENT_FAILED: 'Payment failed',
    LOG_PAYMENT_DECLINED: 'Payment was declined',
    LOG_PAYMENT_VOIDED: (paymentId: string) => `Payment ${paymentId} voided`,
    LOG_STATUS_QUERIED: (status: string) => `Status queried: ${status}`,
    LOG_PROCESSING_WITH_METHOD: (methodId: string) => `Processing with payment method: ${methodId.substring(0, 20)}...`,
    LOG_FAILED_TO_INITIATE: 'Failed to initiate payment',
    LOG_FAILED_TO_PROCESS: 'Failed to process payment',

    // Debug log detail labels
    LOG_DETAIL_AMOUNT: 'Amount:',
    LOG_DETAIL_STATUS: 'Status:',
    LOG_DETAIL_NEW_BALANCE: 'New Balance:',

    // API endpoints (for debug logging)
    API_PAYMENT_ENDPOINT: '/v1/payment',
    API_STATUS_ENDPOINT: '/v1/STATUS',
    API_VOID_ENDPOINT: '/v1/void',
    API_PROCESS_ENDPOINT: (paymentId: string) => `/v1/payment/${paymentId}/process`,
    API_PROCESS_FAILED_ENDPOINT: (paymentId: string) => `/v1/payment/${paymentId}/process - FAILED`,

    // Request ID prefix
    REQUEST_ID_PREFIX: 'req_live_',
} as const;
