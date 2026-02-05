import { useRef, useEffect } from 'react';
import { PaymentDevToolsText } from '../constants';
import type { DebugLogEntry } from '../types';

interface DebugPanelProps {
    logs: DebugLogEntry[];
    filterTag?: string;
    onFilterChange?: (tag: string) => void;
}

/**
 * Returns color class based on log type
 */
const getLogTypeColor = (type: DebugLogEntry['type']) => {
    switch (type) {
        case 'POST':
            return 'text-blue-400';
        case 'GET':
            return 'text-blue-400';
        case 'WALLET_RESERVE':
            return 'text-orange-400';
        case 'WEBHOOK_SENT':
            return 'text-purple-400';
        case 'PROVIDER_MOCK':
            return 'text-emerald-400';
        case 'WALLET_CONFIRM':
            return 'text-emerald-400';
        case 'RETRY_POLICY':
            return 'text-slate-400';
        default:
            return 'text-slate-400';
    }
};

/**
 * Panel 4: Debug Panel - Live logs of API calls and events
 */
export const DebugPanel = ({ logs, filterTag, onFilterChange }: DebugPanelProps) => {
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="bg-[#0d1117] border border-slate-700/50 rounded-xl p-4 flex flex-col gap-3 h-full">
            {/* Panel Header */}
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-mono text-sm">4</span>
                    <h3 className="text-white font-semibold text-sm">{PaymentDevToolsText.PANEL4_TITLE}</h3>
                </div>
                <span className="text-slate-400 text-xs">{PaymentDevToolsText.LIVE_LOGS}</span>
            </div>

            {/* Logs Container */}
            <div className="flex-1 overflow-auto min-h-0 space-y-2 pr-1">
                {logs.length === 0 ? (
                    <div className="text-slate-500 text-xs text-center py-6">
                        {PaymentDevToolsText.NO_LOGS_MESSAGE}
                    </div>
                ) : (
                    logs.map((log) => (
                        <div
                            key={log.id}
                            className="border-l-2 border-slate-700 pl-2 py-0.5"
                        >
                            {/* Timestamp */}
                            <div className="text-slate-500 text-xs font-mono">
                                {log.timestamp}
                            </div>

                            {/* Log Type & Title */}
                            <div className={`font-semibold text-xs ${getLogTypeColor(log.type)}`}>
                                {log.type.replace('_', ' ')}
                            </div>
                            <div className="text-slate-300 text-xs">{log.title}</div>

                            {/* Details */}
                            {log.details && (
                                <div className="text-slate-500 text-xs mt-0.5 font-mono truncate">
                                    "{log.details}"
                                </div>
                            )}

                            {/* Sub-details (for wallet operations) */}
                            {log.subDetails && (
                                <div className="mt-1 bg-[#161b22] rounded p-2 space-y-0.5">
                                    {log.subDetails.map((detail, idx) => (
                                        <div key={idx} className="flex justify-between text-xs">
                                            <span className="text-slate-400">{detail.label}</span>
                                            <span
                                                className={
                                                    detail.isAmount
                                                        ? 'text-emerald-400 font-semibold'
                                                        : detail.status
                                                            ? 'text-blue-400'
                                                            : 'text-slate-300'
                                                }
                                            >
                                                {detail.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
                <div ref={logsEndRef} />
            </div>

            {/* Filter Input */}
            <div className="relative flex-shrink-0">
                <input
                    type="text"
                    value={filterTag || ''}
                    onChange={(e) => onFilterChange?.(e.target.value)}
                    placeholder={PaymentDevToolsText.FILTER_PLACEHOLDER}
                    className="w-full bg-[#161b22] border border-slate-700 rounded-lg px-3 py-1.5 text-slate-400 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-base">tune</span>
                </button>
            </div>
        </div>
    );
};
