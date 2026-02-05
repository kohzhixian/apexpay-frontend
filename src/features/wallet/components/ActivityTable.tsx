import type { ActivityItem } from '../types';
import { WalletTransactionStatusEnum } from '../types';
import { ACTIVITY_TABLE_HEADERS, ACTIVITY_TABLE_TEXT } from '../constants/text';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { StatusVariant } from '../../../components/ui/StatusBadge';

interface ActivityTableProps {
    /** Activity items to display */
    activities: ActivityItem[];
    /** Loading state */
    isLoading?: boolean;
}

/** Status badge styles mapped to backend enum */
const statusVariants: Record<WalletTransactionStatusEnum, StatusVariant> = {
    [WalletTransactionStatusEnum.COMPLETED]: 'success',
    [WalletTransactionStatusEnum.PENDING]: 'pending',
    [WalletTransactionStatusEnum.CANCELLED]: 'cancelled',
};

/** Status labels mapped to backend enum */
const statusLabels: Record<WalletTransactionStatusEnum, string> = {
    [WalletTransactionStatusEnum.COMPLETED]: 'Success',
    [WalletTransactionStatusEnum.PENDING]: 'Pending',
    [WalletTransactionStatusEnum.CANCELLED]: 'Cancelled',
};

/**
 * Activity table component for recent distribution activity
 * Displays transactions with date, description, wallet, amount, and status
 */
export const ActivityTable = ({ activities, isLoading }: ActivityTableProps) => {
    if (isLoading) {
        return (
            <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-900/50 shadow-sm">
                <div className="p-8 text-center text-slate-400">{ACTIVITY_TABLE_TEXT.LOADING}</div>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-900/50 shadow-sm">
                <div className="p-8 text-center text-slate-400">{ACTIVITY_TABLE_TEXT.NO_ACTIVITY}</div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-900/50 shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {ACTIVITY_TABLE_HEADERS.DATE}
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {ACTIVITY_TABLE_HEADERS.DESCRIPTION}
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {ACTIVITY_TABLE_HEADERS.WALLET}
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {ACTIVITY_TABLE_HEADERS.AMOUNT}
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">
                                {ACTIVITY_TABLE_HEADERS.STATUS}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {activities.map((activity) => {
                            const date = formatDate(activity.datetime);
                            const time = formatTime(activity.datetime);
                            const amountColor = activity.isCredit
                                ? 'text-emerald-500'
                                : 'text-white';
                            const amountPrefix = activity.isCredit ? '+ ' : '- ';

                            return (
                                <tr
                                    key={activity.walletTransactionId}
                                    className="hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium text-sm">
                                                {date}
                                            </span>
                                            <span className="text-slate-500 text-xs">{time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-200 font-medium text-sm">
                                            {activity.description}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-400 text-xs px-2 py-1 rounded bg-white/5">
                                            {activity.walletName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`font-bold text-sm ${amountColor}`}>
                                            {amountPrefix}
                                            {formatCurrency(Math.abs(activity.amount), 'USD')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <StatusBadge
                                            variant={statusVariants[activity.status]}
                                            label={statusLabels[activity.status]}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
