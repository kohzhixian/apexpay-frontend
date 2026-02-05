import { WALLETS_TEXT } from '../constants/text';
import { formatCurrency } from '../utils/formatters';
import { Card } from '../../../components/ui/Card';

interface NetWorthCardProps {
    /** Total net worth amount */
    totalNetWorth: number;
    /** Currency code */
    currency: string;
    /** Monthly growth percentage */
    monthlyGrowth: number;
    /** Number of active currencies/assets */
    activeCurrencies: number;
}

/**
 * Net worth summary card component
 * Displays total net worth with growth and asset metrics
 */
export const NetWorthCard = ({
    totalNetWorth,
    currency,
    monthlyGrowth,
    activeCurrencies,
}: NetWorthCardProps) => {
    const isPositiveGrowth = monthlyGrowth >= 0;

    return (
        <Card variant="glass" className="flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-l-blue-500">
            {/* Net Worth */}
            <div className="flex items-center gap-6">
                <div className="icon-badge icon-badge-lg bg-blue-500/20 text-blue-500">
                    <span className="material-symbols-outlined text-3xl">account_balance</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                        {WALLETS_TEXT.TOTAL_NET_WORTH}
                    </span>
                    <span className="text-4xl font-black text-white">
                        {formatCurrency(totalNetWorth, currency)}
                    </span>
                </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-8 w-full md:w-auto">
                {/* Monthly Growth */}
                <div className="flex-1 md:flex-none flex flex-col border-l border-white/10 pl-6">
                    <span className="text-slate-400 text-xs">{WALLETS_TEXT.MONTHLY_GROWTH}</span>
                    <span
                        className={`font-bold flex items-center gap-1 ${isPositiveGrowth ? 'text-emerald-500' : 'text-rose-500'
                            }`}
                    >
                        <span className="material-symbols-outlined text-sm">
                            {isPositiveGrowth ? 'trending_up' : 'trending_down'}
                        </span>
                        {isPositiveGrowth ? '+' : ''}
                        {monthlyGrowth}%
                    </span>
                </div>

                {/* Active Assets */}
                <div className="flex-1 md:flex-none flex flex-col border-l border-white/10 pl-6">
                    <span className="text-slate-400 text-xs">{WALLETS_TEXT.ACTIVE_ASSETS}</span>
                    <span className="text-white font-bold">
                        {activeCurrencies} {WALLETS_TEXT.CURRENCIES_SUFFIX}
                    </span>
                </div>
            </div>
        </Card>
    );
};
