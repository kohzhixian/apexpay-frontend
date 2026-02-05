import { formatCurrency } from '../utils/formatters';
import { Card } from '../../../components/ui/Card';

interface MonthlySummaryCardProps {
    /** Total income for the month */
    income: number;
    /** Total spending for the month */
    spending: number;
    /** Currency code */
    currency: string;
    /** Whether data is loading */
    isLoading?: boolean;
}

/**
 * Displays monthly income and spending summary in a card format.
 * Shows the current month with income (green) and spending (red) amounts.
 */
export const MonthlySummaryCard = ({
    income,
    spending,
    currency,
    isLoading = false,
}: MonthlySummaryCardProps) => {
    /**
     * Gets the current month and year formatted as "Month YYYY"
     */
    const getCurrentMonthYear = (): string => {
        const now = new Date();
        return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <Card variant="dark" className="h-[160px] animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-40 mb-2" />
                <div className="h-4 bg-slate-700 rounded w-28 mb-6" />
                <div className="h-5 bg-slate-700 rounded w-full mb-3" />
                <div className="h-5 bg-slate-700 rounded w-full" />
            </Card>
        );
    }

    return (
        <Card variant="dark" className="flex flex-col justify-between h-[160px]">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-white text-lg font-semibold">Monthly Summary</h3>
                    <p className="text-slate-400 text-sm">{getCurrentMonthYear()}</p>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-2xl">
                    monitoring
                </span>
            </div>

            {/* Income & Spending Rows */}
            <div className="flex flex-col gap-2">
                {/* Income Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="icon-badge icon-badge-sm bg-emerald-500/20">
                            <span className="material-symbols-outlined text-emerald-400 text-lg">
                                arrow_upward
                            </span>
                        </div>
                        <span className="text-slate-300 text-sm font-medium">Income</span>
                    </div>
                    <span className="text-emerald-400 font-semibold">
                        + {formatCurrency(income, currency)}
                    </span>
                </div>

                {/* Spending Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="icon-badge icon-badge-sm bg-red-500/20">
                            <span className="material-symbols-outlined text-red-400 text-lg">
                                arrow_downward
                            </span>
                        </div>
                        <span className="text-slate-300 text-sm font-medium">Spending</span>
                    </div>
                    <span className="text-red-400 font-semibold">
                        - {formatCurrency(spending, currency)}
                    </span>
                </div>
            </div>
        </Card>
    );
};
