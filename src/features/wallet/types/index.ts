// ============================================
// Enums (as const objects for verbatimModuleSyntax compatibility)
// ============================================

/** Supported currencies */
export const CurrencyEnum = {
    SGD: 'SGD',
} as const;

export type CurrencyEnum = (typeof CurrencyEnum)[keyof typeof CurrencyEnum];

/** Transaction type indicating fund flow direction */
export const TransactionTypeEnum = {
    /** Funds added to wallet (top-up, transfer received) */
    CREDIT: 'CREDIT',
    /** Funds deducted from wallet (transfer sent, payment) */
    DEBIT: 'DEBIT',
    /** Funds reserved for pending payment */
    RESERVE: 'RESERVE',
} as const;

export type TransactionTypeEnum = (typeof TransactionTypeEnum)[keyof typeof TransactionTypeEnum];

/** Reference type indicating the source/reason for transaction */
export const ReferenceTypeEnum = {
    /** Transaction related to a payment */
    PAYMENT: 'PAYMENT',
    /** Transaction related to an order */
    ORDER: 'ORDER',
    /** Transaction related to a refund */
    REFUND: 'REFUND',
    /** Transaction from an administrative adjustment */
    ADMIN_ADJUSTMENT: 'ADMIN_ADJUSTMENT',
    /** Transaction related to a wallet-to-wallet transfer */
    TRANSFER: 'TRANSFER',
    /** Transaction related to a wallet top-up */
    TOPUP: 'TOPUP',
} as const;

export type ReferenceTypeEnum = (typeof ReferenceTypeEnum)[keyof typeof ReferenceTypeEnum];

/** Wallet transaction status from backend */
export const WalletTransactionStatusEnum = {
    /** Transaction created but not yet finalized (e.g., reserved funds) */
    PENDING: 'PENDING',
    /** Transaction successfully completed */
    COMPLETED: 'COMPLETED',
    /** Transaction was cancelled and funds released */
    CANCELLED: 'CANCELLED',
} as const;

export type WalletTransactionStatusEnum = (typeof WalletTransactionStatusEnum)[keyof typeof WalletTransactionStatusEnum];

// UI-specific enums (kept for backward compatibility with existing components)
export const TransactionStatus = {
    SUCCESS: 'success',
    PENDING: 'pending',
    FAILED: 'failed',
} as const;

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];

export const TransactionType = {
    SUBSCRIPTION: 'subscription',
    TRANSFER: 'transfer',
    EARNING: 'earning',
    TOP_UP: 'top_up',
    EXCHANGE: 'exchange',
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

// ============================================
// API Request Types
// ============================================

/** Request to create a new wallet */
export interface CreateWalletRequest {
    name: string;
    balance: number;
    currency: CurrencyEnum;
}

/** Request to update wallet name (body payload) */
export interface UpdateWalletNameRequest {
    walletName: string;
}

/** Response after updating wallet name */
export interface UpdateWalletNameResponse {
    message: string;
}

/** Request to top up wallet balance */
export interface TopUpWalletRequest {
    amount: number;
    walletId: string;
    currency: CurrencyEnum;
    paymentMethodId: string;
}

/** Request to transfer funds between wallets */
export interface TransferRequest {
    payerWalletId: string;
    recipientEmail: string;
    amount: number;
    currency: CurrencyEnum;
}

/** Request to reserve funds for a pending payment */
export interface ReserveFundsRequest {
    amount: number;
    currency: CurrencyEnum;
    paymentId: string;
}

/** Request to confirm a fund reservation */
export interface ConfirmReservationRequest {
    walletTransactionId: string;
    providerTransactionId: string;
    externalProvider: string;
}

/** Request to cancel a fund reservation */
export interface CancelReservationRequest {
    walletTransactionId: string;
}

// ============================================
// API Response Types
// ============================================

/** Response after creating a wallet */
export interface CreateWalletResponse {
    message: string;
}

/** Response after topping up wallet */
export interface TopUpWalletResponse {
    message: string;
    transactionId: string;
    amount: number;
    newBalance: number;
    createdAt: string;
}

/** Response after transferring funds */
export interface TransferResponse {
    message: string;
    recipientName: string;
    payerTransactionReference: string;
    timestamp: string;
    paymentMethod: string;
    amount: number;
}

/** Response after confirming a reservation */
export interface ConfirmReservationResponse {
    message: string;
}

/** Response after cancelling a reservation */
export interface CancelReservationResponse {
    message: string;
}

/** Response for wallet balance query */
export interface GetBalanceResponse {
    balance: number;
}

/** Single transaction history item from API */
export interface TransactionHistoryItem {
    transactionId: string;
    transactionReference: string;
    amount: number;
    currency: CurrencyEnum;
    transactionType: TransactionTypeEnum;
    referenceType: ReferenceTypeEnum;
    referenceId: string;
    status: WalletTransactionStatusEnum;
    walletId: string;
    walletName: string;
    createdAt: string;
    description: string;
}

/** Request params for transaction history query */
export interface GetTransactionHistoryParams {
    walletId?: string;
    offset?: number;
}

/** Response after reserving funds */
export interface ReserveFundsResponse {
    walletTransactionId: string;
    walletId: string;
    amountReserved: number;
    remainingBalance: number;
}

/** Response for get wallet by user ID */
export interface GetWalletResponse {
    walletId: string;
    name: string;
    balance: number;
    currency: CurrencyEnum;
}

// ============================================
// UI/Component Types (for existing components)
// ============================================

export interface BalanceData {
    availableBalance: number;
    reservedBalance: number;
    currency: string;
    availableChangePercent?: number;
    reservedChangePercent?: number;
    isReservedLocked: boolean;
    lastUpdated: string; // ISO 8601 timestamp
}

export interface Transaction {
    id: string;
    date: string; // ISO 8601 timestamp
    description: string;
    amount: number;
    currency: string;
    status: TransactionStatus;
    type: TransactionType;
}

export interface NavigationItem {
    id: string;
    label: string;
    icon: string;
    path: string;
    requiresAuth: boolean;
}

// ============================================
// Wallets Page Types
// ============================================

/** Color variant for wallet cards */
export type WalletColorVariant = 'blue' | 'emerald' | 'purple' | 'orange';

/** Chart data point for mini bar charts */
export interface ChartDataPoint {
    value: number;
}

/** Wallet summary for the wallets list page */
export interface WalletSummary {
    id: string;
    name: string;
    balance: number;
    currency: string;
    icon: string;
    colorVariant: WalletColorVariant;
    chartData: ChartDataPoint[];
}

/** Activity item for recent distribution activity */
export interface ActivityItem {
    walletTransactionId: string;
    datetime: string;
    description: string;
    walletName: string;
    amount: number;
    isCredit: boolean;
    status: WalletTransactionStatusEnum;
}

/** Wallet purpose type */
export type WalletPurpose = 'personal' | 'business' | 'savings' | 'trading';

/** Form data for creating a new wallet */
export interface CreateWalletFormData {
    name: string;
    currency: string;
    initialBalance: number;
}

/** Response for monthly summary stats */
export interface GetMonthlySummaryResponse {
    /** Total credited amount for the month */
    income: number;
    /** Total debited amount for the month */
    spending: number;
    /** Currency of the amounts */
    currency: CurrencyEnum;
}
