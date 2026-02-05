import { Link } from 'react-router-dom';
import { WALLET_DETAILS_TEXT, WALLET_TRANSACTION_TABLE_TEXT } from '../constants/text';
import { formatCurrency, formatDate } from '../utils/formatters';

/** Transaction status type */
type TransactionStatus = 'completed' | 'processing' | 'failed';

/** Transaction item for the details page */
interface WalletTransaction {
    id: string;
    description: string;
    category: string;
    icon: string;
    date: string;
    status: TransactionStatus;
    amount: number;
    isCredit: boolean;
}

interface WalletDetailsTransactionTableProps {
    /** Array of transactions to display */
    transactions: WalletTransaction[];
    /** Currency code */
    currency: string;
    /** Wallet ID for "View All" link */
    walletId?: string;
    /** Whether data is loading */
    isLoading?: boolean;
}

/** Status badge styles by status type */
const statusStyles: Record<TransactionStatus, { bg: string; text: string; label: string }> = {
    completed: {
        bg: 'bg-green-500/10',
        text: 'text-green-500',
        label: WALLET_TRANSACTION_TABLE_TEXT.STATUS_COMPLETED,
    },
    processing: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-500',
        label: WALLET_TRANSACTION_TABLE_TEXT.STATUS_PROCESSING,
    },
    failed: {
        bg: 'bg-red-500/10',
        text: 'text-red-500',
        label: WALLET_TRANSACTION_TABLE_TEXT.STATUS_FAILED,
    },
};

/**
 * Transaction table for wallet details page
 * Shows recent transactions with status badges
 */
export const WalletDetailsTransactionTable = ({
    transactions,
    currency,
    walletId,
    isLoading = false,
}: WalletDetailsTransactionTableProps) => {
    // Build the "View All" link with optional walletId filter
    const viewAllLink = walletId ? `/history?walletId=${walletId}` : '/history';

    if (isLoading) {
        return (
            <div className="bg-[#161E2C] border border-slate-800 rounded-2xl p-6">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 bg-slate-800 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section>
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base text-white">
                    {WALLET_DETAILS_TEXT.RECENT_TRANSACTIONS}
                </h3>
                <Link
                    to={viewAllLink}
                    className="text-blue-500 text-sm font-medium hover:underline"
                >
                    {WALLET_DETAILS_TEXT.VIEW_ALL}
                </Link>
            </div>

            <div className="bg-[#161E2C] border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                            <th className="px-5 py-3">{WALLET_TRANSACTION_TABLE_TEXT.TRANSACTION}</th>
                            <th className="px-5 py-3">{WALLET_TRANSACTION_TABLE_TEXT.DATE}</th>
                            <th className="px-5 py-3">{WALLET_TRANSACTION_TABLE_TEXT.STATUS}</th>
                            <th className="px-5 py-3 text-right">{WALLET_TRANSACTION_TABLE_TEXT.AMOUNT}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {transactions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-5 py-10 text-center text-slate-500 text-sm"
                                >
                                    {WALLET_TRANSACTION_TABLE_TEXT.NO_TRANSACTIONS}
                                </td>
                            </tr>
                        ) : (
                            transactions.map((transaction) => {
                                const status = statusStyles[transaction.status];
                                return (
                                    <tr
                                        key={transaction.id}
                                        className="hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-slate-400 text-lg">
                                                        {transaction.icon}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm text-white">
                                                        {transaction.description}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500">
                                                        {transaction.category}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-slate-400">
                                            {formatDate(transaction.date)}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${status.bg} ${status.text} rounded-full`}
                                            >
                                                {status.label}
                                            </span>
                                        </td>
                                        <td
                                            className={`px-5 py-3 text-sm font-bold text-right ${transaction.isCredit
                                                ? 'text-green-500'
                                                : 'text-white'
                                                }`}
                                        >
                                            {transaction.isCredit ? '+' : '-'}
                                            {formatCurrency(Math.abs(transaction.amount), currency)}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export type { WalletTransaction, TransactionStatus };
