import type { ChartDataPoint, WalletColorVariant } from '../types';

interface MiniBarChartProps {
    /** Chart data points */
    data: ChartDataPoint[];
    /** Color variant for the bars */
    colorVariant: WalletColorVariant;
}

/** Color classes for each variant */
const colorClasses: Record<WalletColorVariant, string[]> = {
    blue: [
        'bg-white/5',
        'bg-white/5',
        'bg-white/5',
        'bg-blue-500/40',
        'bg-blue-500/60',
        'bg-blue-500',
        'bg-blue-500/80',
    ],
    emerald: [
        'bg-white/5',
        'bg-white/5',
        'bg-emerald-500/40',
        'bg-emerald-500/60',
        'bg-emerald-500',
        'bg-emerald-500/80',
        'bg-emerald-500/50',
    ],
    purple: [
        'bg-purple-500/20',
        'bg-purple-500/40',
        'bg-purple-500/60',
        'bg-purple-500/80',
        'bg-purple-500',
        'bg-purple-500/80',
        'bg-purple-500/60',
    ],
    orange: [
        'bg-white/5',
        'bg-orange-500/40',
        'bg-orange-500/60',
        'bg-orange-500/80',
        'bg-orange-500',
        'bg-orange-500/90',
        'bg-orange-500/70',
    ],
};

/**
 * Mini bar chart component for wallet cards
 * Displays a simple bar chart visualization
 */
export const MiniBarChart = ({ data, colorVariant }: MiniBarChartProps) => {
    const colors = colorClasses[colorVariant];
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className="mt-2 h-16 flex items-end gap-1 px-1">
            {data.map((point, index) => {
                const heightPercent = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
                const colorClass = colors[index % colors.length];

                return (
                    <div
                        key={index}
                        className={`flex-1 rounded-sm ${colorClass}`}
                        style={{ height: `${Math.max(heightPercent, 10)}%` }}
                    />
                );
            })}
        </div>
    );
};
