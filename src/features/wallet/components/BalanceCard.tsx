import { formatCurrency } from '../utils/formatters';

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
        <div className="relative overflow-hidden rounded-2xl p-8 flex flex-col gap-4 border border-white/5 bg-[#2d3748] backdrop-blur-xl shadow-xl group">
            <div
                className={`absolute ${variant === 'available' ? '-top-10 -right-10' : '-bottom-10 -left-10'
                    } w-40 h-40 ${variant === 'available' ? 'bg-blue-500/20' : 'bg-purple-500/10'
                    } rounded-full blur-3xl pointer-events-none ${variant === 'available'
                        ? 'group-hover:bg-blue-500/30'
                        : 'group-hover:bg-purple-500/20'
                    } transition-all duration-500`}
            />

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-[#8fa6cc]">
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
                            Locked
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

            <div className="flex flex-col relative z-10">
                <span className="text-5xl font-black text-white tracking-tight">
                    {formattedAmount}
                </span>
            </div>
        </div>
    );
};
