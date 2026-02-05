import { formatCurrency } from '../utils/formatters';
import { BALANCE_CARD_TEXT } from '../constants/text';
import { Card } from '../../../components/ui/Card';

export interface BalanceCardProps {
    title: string;
    amount: number;
    currency: string;
    changePercent?: number;
    isLocked?: boolean;
    variant: 'available' | 'reserved';
}

export const BalanceCard = ({
    title,
    amount,
    currency,
    changePercent,
    isLocked,
    variant,
}: BalanceCardProps) => {
    const formattedAmount = formatCurrency(amount, currency);
    const isPositiveChange = changePercent !== undefined && changePercent >= 0;

    return (
        <Card variant="dark" className="flex flex-col justify-between h-[160px]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined">
                        {variant === 'available' ? 'account_balance_wallet' : 'lock'}
                    </span>
                    <span className="text-sm font-semibold uppercase tracking-wider">
                        {title}
                    </span>
                </div>

                {isLocked ? (
                    <div className="px-2 py-1 rounded-lg bg-slate-700/50 flex items-center gap-1">
                        <span className="material-symbols-outlined text-slate-400 text-[16px]">
                            lock_clock
                        </span>
                        <span className="text-slate-400 text-xs font-bold">
                            {BALANCE_CARD_TEXT.LOCKED}
                        </span>
                    </div>
                ) : changePercent !== undefined ? (
                    <div
                        className={`px-2 py-1 rounded-lg ${isPositiveChange
                            ? 'bg-emerald-500/10'
                            : 'bg-red-500/10'
                            } flex items-center gap-1`}
                    >
                        <span
                            className={`material-symbols-outlined ${isPositiveChange ? 'text-emerald-500' : 'text-red-500'
                                } text-[16px]`}
                        >
                            {isPositiveChange ? 'trending_up' : 'trending_down'}
                        </span>
                        <span
                            className={`${isPositiveChange ? 'text-emerald-500' : 'text-red-500'
                                } text-xs font-bold`}
                        >
                            {isPositiveChange ? '+' : ''}
                            {changePercent.toFixed(1)}%
                        </span>
                    </div>
                ) : null}
            </div>

            <div className="flex flex-col">
                <span className="text-4xl font-bold text-white tracking-tight">
                    {formattedAmount}
                </span>
            </div>
        </Card>
    );
};
