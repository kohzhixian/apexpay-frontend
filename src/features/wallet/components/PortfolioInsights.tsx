import { WALLET_DETAILS_TEXT, PORTFOLIO_INSIGHTS_TEXT } from '../constants/text';

interface PortfolioInsightsProps {
    /** Wallet name for personalized message */
    walletName: string;
    /** Performance percentage compared to average */
    performancePercent: number;
    /** Callback when Review Optimizer is clicked */
    onReviewOptimizer?: () => void;
}

/**
 * Portfolio insights card with performance summary
 * Displays personalized recommendations based on wallet performance
 */
export const PortfolioInsights = ({
    walletName,
    performancePercent,
    onReviewOptimizer,
}: PortfolioInsightsProps) => {
    return (
        <section className="bg-[#161E2C] border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="relative z-10">
                {/* Icon */}
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
                    <span className="material-symbols-outlined text-white text-xl">
                        trending_up
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-white mb-2">
                    {WALLET_DETAILS_TEXT.PORTFOLIO_INSIGHTS}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    {PORTFOLIO_INSIGHTS_TEXT.PERFORMANCE_MESSAGE(walletName, performancePercent)}
                </p>

                {/* CTA Button */}
                <button
                    onClick={onReviewOptimizer}
                    className="text-blue-500 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                    {WALLET_DETAILS_TEXT.REVIEW_OPTIMIZER}
                    <span className="material-symbols-outlined text-sm">
                        arrow_forward
                    </span>
                </button>
            </div>

            {/* Background Icon */}
            <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-7xl text-blue-500/5 select-none pointer-events-none">
                insights
            </span>
        </section>
    );
};
