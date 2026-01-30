import { TransactionType } from '../types';
import { TRANSACTION_TYPE_LABELS } from '../constants/text';

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

export const getTransactionTypeLabel = (type: TransactionType): string => {
    return TRANSACTION_TYPE_LABELS[type.toUpperCase() as keyof typeof TRANSACTION_TYPE_LABELS] || 'Transaction';
};

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
