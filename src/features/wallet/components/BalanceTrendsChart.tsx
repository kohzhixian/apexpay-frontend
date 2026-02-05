import { useState } from 'react';
import { WALLET_DETAILS_TEXT } from '../constants/text';
import { formatCurrency } from '../utils/formatters';

type TimePeriod = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

interface BalanceTrendsChartProps {
    /** Current balance to display on tooltip */
    currentBalance: number;
    /** Currency code */
    currency: string;
    /** Chart data - array of values for each bar */
    data?: number[];
}

/** Default mock data for the chart */
const DEFAULT_DATA = [40, 55, 45, 70, 60, 85, 75];

/**
 * Balance trends chart with time period selector
 * Displays a bar chart showing balance history over time
 */
export const BalanceTrendsChart = ({
    currentBalance,
    currency,
    data = DEFAULT_DATA,
}: BalanceTrendsChartProps) => {
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('WEEK');

    const periods: TimePeriod[] = ['DAY', 'WEEK', 'MONTH', 'YEAR'];
    const maxValue = Math.max(...data);

    // Find the index of the highest bar for tooltip positioning
    const highestIndex = data.indexOf(maxValue);

    return (
        <section className="bg-[#161E2C] border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-base text-white">
                    {WALLET_DETAILS_TEXT.BALANCE_TRENDS}
                </h3>
                <div className="flex bg-slate-800 p-0.5 rounded-lg">
                    {periods.map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${selectedPeriod === period
                                    ? 'bg-slate-700 text-white'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {WALLET_DETAILS_TEXT.TIME_PERIODS[period]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Area */}
            <div className="h-48 relative flex items-end justify-between gap-1 mt-4">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="border-b border-slate-800 w-full h-0"
                        />
                    ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-between px-4">
                    {data.map((value, index) => {
                        const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
                        const isHighest = index === highestIndex;

                        return (
                            <div
                                key={index}
                                className={`w-1 rounded-t-full transition-all duration-300 ${isHighest
                                        ? 'bg-blue-500 shadow-[0_-8px_16px_rgba(59,130,246,0.3)]'
                                        : 'bg-blue-500/20'
                                    } ${isHighest ? 'ring-2 ring-blue-500' : ''}`}
                                style={{ height: `${heightPercent}%` }}
                            />
                        );
                    })}
                </div>

                {/* Tooltip on highest bar */}
                <div
                    className="absolute bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-xs font-mono shadow-xl z-20"
                    style={{
                        left: `${((highestIndex + 0.5) / data.length) * 100}%`,
                        bottom: `${(data[highestIndex] / maxValue) * 100 + 8}%`,
                        transform: 'translateX(-50%)',
                    }}
                >
                    {formatCurrency(currentBalance, currency)}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                </div>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {WALLET_DETAILS_TEXT.DAYS_OF_WEEK.map((day) => (
                    <span key={day}>{day}</span>
                ))}
            </div>
        </section>
    );
};
