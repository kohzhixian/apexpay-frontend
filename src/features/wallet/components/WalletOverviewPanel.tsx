import { WALLET_DETAILS_TEXT } from '../constants/text';
import { formatCurrency } from '../utils/formatters';

interface OverviewItem {
    label: string;
    value: string;
    icon: string;
    iconBgClass: string;
    iconTextClass: string;
}

interface WalletOverviewPanelProps {
    /** Total income amount */
    totalIncome: number;
    /** Total spent amount */
    totalSpent: number;
    /** APY growth percentage */
    apyGrowth: string;
    /** Currency code */
    currency: string;
    /** Callback when View Full Report is clicked */
    onViewReport?: () => void;
}

/**
 * Overview panel showing income, spending, and APY stats
 */
export const WalletOverviewPanel = ({
    totalIncome,
    totalSpent,
    apyGrowth,
    currency,
    onViewReport,
}: WalletOverviewPanelProps) => {
    const items: OverviewItem[] = [
        {
            label: WALLET_DETAILS_TEXT.TOTAL_INCOME,
            value: formatCurrency(totalIncome, currency),
            icon: 'south_west',
            iconBgClass: 'bg-green-500/10',
            iconTextClass: 'text-green-500',
        },
        {
            label: WALLET_DETAILS_TEXT.TOTAL_SPENT,
            value: formatCurrency(totalSpent, currency),
            icon: 'north_east',
            iconBgClass: 'bg-red-500/10',
            iconTextClass: 'text-red-500',
        },
        {
            label: WALLET_DETAILS_TEXT.APY_GROWTH,
            value: apyGrowth,
            icon: 'percent',
            iconBgClass: 'bg-blue-500/10',
            iconTextClass: 'text-blue-500',
        },
    ];

    return (
        <div className="bg-[#161E2C] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between h-full">
            <div>
                <h3 className="font-bold text-base text-white mb-4">
                    {WALLET_DETAILS_TEXT.OVERVIEW}
                </h3>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-9 h-9 rounded-lg ${item.iconBgClass} flex items-center justify-center ${item.iconTextClass}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {item.icon}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-[11px] text-slate-500">
                                        {item.label}
                                    </div>
                                    <div className="font-bold text-sm text-white">
                                        {item.value}
                                    </div>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 text-[18px]">
                                chevron_right
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={onViewReport}
                className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-300 transition-colors"
            >
                {WALLET_DETAILS_TEXT.VIEW_FULL_REPORT}
            </button>
        </div>
    );
};
