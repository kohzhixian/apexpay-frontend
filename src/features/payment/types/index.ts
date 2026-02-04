import type { CurrencyEnum } from '../../wallet/types';

// ============================================
// Payment Method Types
// ============================================

/** Payment method type enum */
export const PaymentMethodType = {
    CARD: 'CARD',
    BANK_ACCOUNT: 'BANK_ACCOUNT',
} as const;

export type PaymentMethodType = (typeof PaymentMethodType)[keyof typeof PaymentMethodType];

// ============================================
// Payment API Types
// ============================================

/**
 * Request to initiate a new payment.
 * Creates a payment record in INITIATED status.
 */
export interface InitiatePaymentRequest {
    /** The payment amount (must be positive) */
    amount: number;
    /** The wallet ID to charge for the payment */
    walletId: string;
    /** The currency of the payment */
    currency: CurrencyEnum;
    /** A unique identifier provided by the client for idempotency */
    clientRequestId: string;
}

/**
 * Response from initiating a payment.
 * Contains the payment ID and version for subsequent processing.
 */
export interface InitiatePaymentResponse {
    /** Human-readable message about the operation */
    message: string;
    /** The ID of the payment (newly created or existing) */
    paymentId: string;
    /** Current version of the payment entity (for optimistic locking) */
    version: number;
    /** True if a new payment was created, false if returning existing (idempotent) */
    isNewPayment: boolean;
}

/**
 * Request to process an initiated payment.
 * Triggers the full payment flow with the specified payment method.
 */
export interface ProcessPaymentRequest {
    /** The ID of the saved payment method to charge */
    paymentMethodId: string;
}

/**
 * Response from payment operations (process and status check).
 * Contains the final payment status and details.
 */
export interface PaymentResponse {
    /** The payment ID */
    paymentId: string;
    /** Current payment status */
    status: PaymentStatusEnum;
    /** Human-readable message about the payment result */
    message: string;
    /** The payment amount */
    amount: number;
    /** The currency of the payment */
    currency: CurrencyEnum;
    /** Timestamp when the payment was created */
    createdAt: string;
    /** Timestamp when the payment was last updated */
    updatedAt: string;
}

/** Response from GET /api/v1/payment-methods */
export interface PaymentMethodResponse {
    /** Unique identifier for the payment method */
    id: string;
    /** Type of payment method (CARD or BANK_ACCOUNT) */
    type: PaymentMethodType;
    /** Display name for the payment method */
    displayName: string;
    /** Last 4 digits of card/account number */
    last4: string;
    /** Card brand (e.g., Visa, Mastercard) - only for CARD type */
    brand: string | null;
    /** Card expiry month (1-12) - only for CARD type */
    expiryMonth: number | null;
    /** Card expiry year (e.g., 2025) - only for CARD type */
    expiryYear: number | null;
    /** Bank name - only for BANK_ACCOUNT type */
    bankName: string | null;
    /** Account type (e.g., Checking, Savings) - only for BANK_ACCOUNT type */
    accountType: string | null;
    /** Timestamp of last usage */
    lastUsedAt: string | null;
    /** Whether this is the default payment method */
    isDefault: boolean;
}

// ============================================
// Payment DevTools Types
// ============================================

/** Payment status enum matching backend */
export const PaymentStatusEnum = {
    /** Payment record created, awaiting processing */
    INITIATED: 'INITIATED',
    /** Payment successfully completed */
    SUCCESS: 'SUCCESS',
    /** Funds reserved, payment provider charge in progress */
    PENDING: 'PENDING',
    /** Payment failed (provider declined, insufficient funds, etc.) */
    FAILED: 'FAILED',
    /** Payment was successfully refunded */
    REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatusEnum = (typeof PaymentStatusEnum)[keyof typeof PaymentStatusEnum];

/** Mock token type for testing */
export type MockTokenType = 'success' | 'error' | 'pending';

/** Mock payment method for DevTools */
export interface MockPaymentMethod {
    id: string;
    displayName: string;
    token: string;
    tokenType: MockTokenType;
    last4?: string;
}

/** Debug log entry */
export interface DebugLogEntry {
    id: string;
    timestamp: string;
    type: 'POST' | 'GET' | 'WALLET_RESERVE' | 'WEBHOOK_SENT' | 'PROVIDER_MOCK' | 'WALLET_CONFIRM' | 'RETRY_POLICY';
    title: string;
    details?: string;
    highlight?: boolean;
    subDetails?: {
        label: string;
        value: string;
        isAmount?: boolean;
        status?: string;
    }[];
}

/** Payment state for raw JSON display */
export interface PaymentState {
    id: string;
    status: string;
    amount: number;
    currency: string;
    metadata: {
        test_mode: boolean;
        sdk_version: string;
    };
}

/** Stats for bottom bar */
export interface DevToolsStats {
    latency: number;
    apiRequests: string;
    errorRate: string;
    region: string;
}
