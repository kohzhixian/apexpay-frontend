import type { Transaction } from '../types';
import { TransactionRow } from './TransactionRow';
import { Alert } from '../../../components/ui/Alert';
import { LoadingSkeleton } from '../../../components/ui/LoadingSkeleton';
import { TABLE_HEADERS, TABLE_STATES, TABLE_ICONS } from '../constants/text';

export interface TransactionTableProps {
    transactions: Transaction[];
    isLoading: boolean;
    error: string | null;
    onRetry?: () => void;
}

export const TransactionTable = ({
    transactions,
    isLoading,
    error,
    onRetry,
}: TransactionTableProps) => {
    // Loading state
    if (isLoading) {
        return (
            <div className="overflow-hidden rounded-2xl border border-[#304669] bg-[#162032] shadow-sm">
                <div className="p-8 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <LoadingSkeleton variant="rectangle" count={5} height="56px" gap="8px" />
                        <p className="text-[#8fa6cc] text-sm">{TABLE_STATES.LOADING}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="overflow-hidden rounded-2xl border border-[#304669] bg-[#162032] shadow-sm">
                <div className="p-8">
                    <Alert
                        variant="error"
                        title={TABLE_STATES.FAILED_TO_LOAD}
                        message={error}
                    />
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            {TABLE_STATES.RETRY}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Empty state
    if (transactions.length === 0) {
        return (
            <div className="overflow-hidden rounded-2xl border border-[#304669] bg-[#162032] shadow-sm">
                <div className="p-12 flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-slate-600 text-[48px]">
                        {TABLE_ICONS.RECEIPT_LONG}
                    </span>
                    <p className="text-[#8fa6cc] text-sm font-medium">
                        {TABLE_STATES.NO_TRANSACTIONS}
                    </p>
                </div>
            </div>
        );
    }

    // Table with data
    return (
        <div className="overflow-hidden rounded-2xl border border-[#304669] bg-[#162032] shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#182334] border-b border-[#304669]">
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8fa6cc]">
                                {TABLE_HEADERS.DATE}
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8fa6cc]">
                                {TABLE_HEADERS.DESCRIPTION}
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8fa6cc]">
                                {TABLE_HEADERS.AMOUNT}
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8fa6cc] text-right">
                                {TABLE_HEADERS.STATUS}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#304669]">
                        {transactions.map((transaction) => (
                            <TransactionRow key={transaction.id} transaction={transaction} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
