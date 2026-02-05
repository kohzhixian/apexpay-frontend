import { PaymentDevToolsText, DEFAULT_STATS } from '../constants';
import type { DevToolsStats } from '../types';

interface StatsBarProps {
    stats?: DevToolsStats;
}

/**
 * Bottom stats bar showing latency, API requests, error rate, and region
 */
export const StatsBar = ({ stats = DEFAULT_STATS }: StatsBarProps) => {
    return (
        <div className="grid grid-cols-4 gap-3 flex-shrink-0">
            {/* Latency */}
            <div className="bg-[#0d1117] border border-slate-700/50 rounded-xl p-3">
                <div className="text-slate-400 text-xs font-medium tracking-wider mb-0.5">
                    {PaymentDevToolsText.LATENCY_LABEL}
                </div>
                <div className="text-xl font-bold text-emerald-400 font-mono">
                    {stats.latency}<span className="text-xs text-slate-400 ml-1">ms</span>
                </div>
            </div>

            {/* API Requests */}
            <div className="bg-[#0d1117] border border-slate-700/50 rounded-xl p-3">
                <div className="text-slate-400 text-xs font-medium tracking-wider mb-0.5">
                    {PaymentDevToolsText.API_REQUESTS_LABEL}
                </div>
                <div className="text-xl font-bold text-white font-mono">
                    {stats.apiRequests}<span className="text-xs text-slate-400 ml-1">/hr</span>
                </div>
            </div>

            {/* Error Rate */}
            <div className="bg-[#0d1117] border border-slate-700/50 rounded-xl p-3">
                <div className="text-slate-400 text-xs font-medium tracking-wider mb-0.5">
                    {PaymentDevToolsText.ERROR_RATE_LABEL}
                </div>
                <div className="text-xl font-bold text-emerald-400 font-mono">
                    {stats.errorRate}
                </div>
            </div>

            {/* Region */}
            <div className="bg-[#0d1117] border border-slate-700/50 rounded-xl p-3">
                <div className="text-slate-400 text-xs font-medium tracking-wider mb-0.5">
                    {PaymentDevToolsText.REGION_LABEL}
                </div>
                <div className="text-xl font-bold text-white font-mono tracking-wider">
                    {stats.region}
                </div>
            </div>
        </div>
    );
};
