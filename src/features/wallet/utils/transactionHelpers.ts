import { TransactionType, ReferenceTypeEnum, WalletTransactionStatusEnum } from '../types';
import { TRANSACTION_TYPE_LABELS } from '../constants/text';

/**
 * Gets the icon name for a transaction type
 * @param type - The transaction type
 * @returns Material icon name
 */
export const getTransactionTypeIcon = (type: TransactionType): string => {
    switch (type) {
        case TransactionType.SUBSCRIPTION:
            return 'shopping_bag';
        case TransactionType.TOP_UP:
            return 'add_circle';
        case TransactionType.TRANSFER:
            return 'arrow_forward';
        case TransactionType.EARNING:
            return 'account_balance';
        case TransactionType.EXCHANGE:
            return 'currency_exchange';
        default:
            return 'receipt';
    }
};

/**
 * Gets the display label for a transaction type
 * @param type - The transaction type
 * @returns Human-readable label
 */
export const getTransactionTypeLabel = (type: TransactionType): string => {
    return TRANSACTION_TYPE_LABELS[type.toUpperCase() as keyof typeof TRANSACTION_TYPE_LABELS] || 'Transaction';
};

/**
 * Gets icon configuration for a transaction type
 * @param type - The transaction type
 * @returns Icon config with icon name, background color, and icon color
 */
export const getTransactionTypeIconConfig = (type: TransactionType): {
    icon: string;
    bgColor: string;
    iconColor: string
} => {
    const iconMap = {
        [TransactionType.SUBSCRIPTION]: {
            icon: 'movie',
            bgColor: 'bg-red-100 dark:bg-red-500/20',
            iconColor: 'text-red-600 dark:text-red-400',
        },
        [TransactionType.TRANSFER]: {
            icon: 'person',
            bgColor: 'bg-blue-100 dark:bg-blue-500/20',
            iconColor: 'text-blue-600 dark:text-blue-400',
        },
        [TransactionType.EARNING]: {
            icon: 'work',
            bgColor: 'bg-green-100 dark:bg-green-500/20',
            iconColor: 'text-green-600 dark:text-green-400',
        },
        [TransactionType.TOP_UP]: {
            icon: 'add_circle',
            bgColor: 'bg-purple-100 dark:bg-purple-500/20',
            iconColor: 'text-purple-600 dark:text-purple-400',
        },
        [TransactionType.EXCHANGE]: {
            icon: 'currency_exchange',
            bgColor: 'bg-orange-100 dark:bg-orange-500/20',
            iconColor: 'text-orange-600 dark:text-orange-400',
        },
    };

    return iconMap[type] || iconMap[TransactionType.TRANSFER];
};

// ============================================
// Reference Type Helpers (for API response)
// ============================================

/**
 * Gets the icon name for a reference type
 * @param referenceType - The reference type from API
 * @returns Material icon name
 */
export const getReferenceTypeIcon = (referenceType: ReferenceTypeEnum): string => {
    switch (referenceType) {
        case ReferenceTypeEnum.TOPUP:
            return 'add_circle';
        case ReferenceTypeEnum.TRANSFER:
            return 'swap_horiz';
        case ReferenceTypeEnum.PAYMENT:
            return 'shopping_cart';
        case ReferenceTypeEnum.ORDER:
            return 'shopping_bag';
        case ReferenceTypeEnum.REFUND:
            return 'undo';
        case ReferenceTypeEnum.ADMIN_ADJUSTMENT:
            return 'admin_panel_settings';
        default:
            return 'receipt';
    }
};

/**
 * Gets the display label for a reference type
 * @param referenceType - The reference type from API
 * @returns Human-readable label
 */
export const getReferenceTypeLabel = (referenceType: ReferenceTypeEnum): string => {
    const labels: Record<ReferenceTypeEnum, string> = {
        [ReferenceTypeEnum.TOPUP]: 'Top Up',
        [ReferenceTypeEnum.TRANSFER]: 'Transfer',
        [ReferenceTypeEnum.PAYMENT]: 'Payment',
        [ReferenceTypeEnum.ORDER]: 'Order',
        [ReferenceTypeEnum.REFUND]: 'Refund',
        [ReferenceTypeEnum.ADMIN_ADJUSTMENT]: 'Adjustment',
    };
    return labels[referenceType] || 'Transaction';
};

// ============================================
// Status Helpers
// ============================================

/**
 * Gets the status badge configuration for wallet transaction status
 * Handles both uppercase (COMPLETED) and lowercase (completed) status values
 * @param status - The wallet transaction status
 * @returns Status config with background color, text color, and label
 */
export const getWalletTransactionStatusConfig = (status: WalletTransactionStatusEnum | string): {
    bgColor: string;
    textColor: string;
    label: string;
} => {
    // Normalize to uppercase for comparison
    const normalizedStatus = (typeof status === 'string' ? status.toUpperCase() : status) as WalletTransactionStatusEnum;

    switch (normalizedStatus) {
        case WalletTransactionStatusEnum.COMPLETED:
            return {
                bgColor: 'bg-green-500/10',
                textColor: 'text-green-500',
                label: 'Completed',
            };
        case WalletTransactionStatusEnum.PENDING:
            return {
                bgColor: 'bg-amber-500/10',
                textColor: 'text-amber-500',
                label: 'Pending',
            };
        case WalletTransactionStatusEnum.CANCELLED:
            return {
                bgColor: 'bg-red-500/10',
                textColor: 'text-red-500',
                label: 'Cancelled',
            };
        default:
            return {
                bgColor: 'bg-slate-500/10',
                textColor: 'text-slate-500',
                label: 'Unknown',
            };
    }
};
