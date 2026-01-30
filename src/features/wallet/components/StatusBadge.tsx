import { TransactionStatus } from '../types';
import { TRANSACTION_STATUS_LABELS } from '../constants/text';

interface StatusBadgeProps {
    status: TransactionStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    switch (status) {
        case TransactionStatus.SUCCESS:
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    {TRANSACTION_STATUS_LABELS.SUCCESS}
                </span>
            );
        case TransactionStatus.PENDING:
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
                    <span className="size-1.5 rounded-full bg-amber-400" />
                    {TRANSACTION_STATUS_LABELS.PENDING}
                </span>
            );
        case TransactionStatus.FAILED:
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-medium">
                    <span className="size-1.5 rounded-full bg-rose-400" />
                    {TRANSACTION_STATUS_LABELS.FAILED}
                </span>
            );
    }
};
