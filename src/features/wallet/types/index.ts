// Enums as const objects (for verbatimModuleSyntax compatibility)
export const TransactionStatus = {
    SUCCESS: 'success',
    PENDING: 'pending',
    FAILED: 'failed'
} as const;

export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

export const TransactionType = {
    SUBSCRIPTION: 'subscription',
    TRANSFER: 'transfer',
    EARNING: 'earning',
    TOP_UP: 'top_up',
    EXCHANGE: 'exchange'
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

// Interfaces
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
