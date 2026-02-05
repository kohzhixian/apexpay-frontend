import type { Transaction } from '../types';
import { TransactionStatus, TransactionType } from '../types';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

export interface TransactionRowProps {
    transaction: Transaction;
}

const getIconForType = (type: TransactionType): { icon: string; bgColor: string; iconColor: string } => {
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

const getStatusBadge = (status: TransactionStatus) => {
    const statusMap = {
        [TransactionStatus.SUCCESS]: {
            label: 'Success',
            bgColor: 'bg-emerald-100 dark:bg-emerald-500/10',
            textColor: 'text-emerald-700 dark:text-emerald-400',
            borderColor: 'border-emerald-200 dark:border-emerald-500/20',
            icon: 'check_circle',
            showDot: true,
        },
        [TransactionStatus.PENDING]: {
            label: 'Pending',
            bgColor: 'bg-slate-100 dark:bg-slate-500/10',
            textColor: 'text-slate-600 dark:text-slate-400',
            borderColor: 'border-slate-200 dark:border-slate-500/20',
            icon: null,
            showDot: true,
        },
        [TransactionStatus.FAILED]: {
            label: 'Failed',
            bgColor: 'bg-rose-100 dark:bg-rose-500/10',
            textColor: 'text-rose-600 dark:text-rose-400',
            borderColor: 'border-rose-200 dark:border-rose-500/20',
            icon: 'error',
            showDot: false,
        },
    };

    return statusMap[status] || statusMap[TransactionStatus.PENDING];
};

export const TransactionRow = ({ transaction }: TransactionRowProps) => {
    const { icon, bgColor, iconColor } = getIconForType(transaction.type);
    const statusBadge = getStatusBadge(transaction.status);
    const isPositive = transaction.amount >= 0;
    const formattedAmount = formatCurrency(Math.abs(transaction.amount), transaction.currency);

    return (
        <tr className="group hover:bg-[#1e2a40] transition-colors">
            {/* Date Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <span className="text-white font-medium text-sm">
                        {formatDate(transaction.date)}
                    </span>
                    <span className="text-slate-500 text-xs">
                        {formatTime(transaction.date)}
                    </span>
                </div>
            </td>

            {/* Description Column */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-full ${bgColor} flex items-center justify-center ${iconColor}`}>
                        <span className="material-symbols-outlined text-[18px]">{icon}</span>
                    </div>
                    <span className="text-slate-200 font-medium text-sm">
                        {transaction.description}
                    </span>
                </div>
            </td>

            {/* Amount Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <span
                    className={`font-bold text-sm ${isPositive
                        ? 'text-emerald-400'
                        : 'text-red-400'
                        }`}
                >
                    {isPositive ? '+ ' : '- '}
                    {formattedAmount}
                </span>
            </td>

            {/* Status Column */}
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bgColor} ${statusBadge.textColor} border ${statusBadge.borderColor}`}
                >
                    {statusBadge.showDot && (
                        <span
                            className={`size-1.5 rounded-full ${transaction.status === TransactionStatus.SUCCESS
                                ? 'bg-emerald-500'
                                : 'bg-slate-400 animate-pulse'
                                }`}
                        />
                    )}
                    {statusBadge.icon && (
                        <span className="material-symbols-outlined text-[14px]">{statusBadge.icon}</span>
                    )}
                    {statusBadge.label}
                </span>
            </td>
        </tr>
    );
};
