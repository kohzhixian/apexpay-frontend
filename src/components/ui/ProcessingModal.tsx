import { useEffect } from 'react';

interface ProcessingStep {
    /** Unique step ID */
    id: string;
    /** Step title */
    title: string;
    /** Step description */
    description: string;
    /** Step status */
    status: 'pending' | 'in-progress' | 'completed';
    /** Optional progress percentage (0-100) */
    progress?: number;
    /** Optional badges to display */
    badges?: string[];
    /** Optional duration display */
    duration?: string;
}

interface LogEntry {
    /** Timestamp string */
    timestamp: string;
    /** Log status */
    status: 'OK' | 'INFO' | 'PROC' | 'ERROR';
    /** Log message */
    message: string;
}

interface ProcessingModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Modal title */
    title: string;
    /** Modal subtitle */
    subtitle?: string;
    /** Amount being processed */
    amount: string;
    /** Currency code */
    currency: string;
    /** Processing steps to display */
    steps?: ProcessingStep[];
    /** Log entries to display */
    logs?: LogEntry[];
    /** Optional header badges */
    headerBadges?: string[];
    /** Optional transaction ID display */
    transactionId?: string;
    /** Callback when processing completes (for animation timing) */
    onComplete?: () => void;
}

/**
 * A reusable processing modal component for displaying transaction progress.
 * Supports configurable title, subtitle, amount, currency, processing steps
 * with status indicators, log entries, header badges, and transaction ID.
 *
 * **Validates: Requirements 3.1, 3.2, 3.3**
 */
export const ProcessingModal = ({
    isOpen,
    title,
    subtitle,
    amount,
    currency,
    steps = [],
    logs = [],
    headerBadges = [],
    transactionId,
    onComplete,
}: ProcessingModalProps) => {
    // Call onComplete when all steps are completed
    useEffect(() => {
        if (!isOpen) return;

        const allCompleted = steps.length > 0 && steps.every((step) => step.status === 'completed');
        if (allCompleted) {
            onComplete?.();
        }
    }, [isOpen, steps, onComplete]);

    if (!isOpen) return null;

    /**
     * Returns the appropriate icon for a step based on its status
     * @param status - The step status
     * @returns Material icon name
     */
    const getStepIcon = (status: ProcessingStep['status']): string => {
        switch (status) {
            case 'completed':
                return 'check';
            case 'in-progress':
                return 'sync';
            case 'pending':
            default:
                return 'schedule';
        }
    };

    /**
     * Returns the appropriate styling classes for a step icon based on status
     * @param status - The step status
     * @returns Tailwind CSS classes
     */
    const getStepIconClasses = (status: ProcessingStep['status']): string => {
        switch (status) {
            case 'completed':
                return 'bg-[#10B981]/10 border border-[#10B981] text-[#10B981]';
            case 'in-progress':
                return 'bg-[#3B82F6] text-white';
            case 'pending':
            default:
                return 'bg-white/5 border border-white/10 text-[#64748B]';
        }
    };

    /**
     * Returns the appropriate styling classes for a log entry status
     * @param status - The log status
     * @returns Tailwind CSS classes
     */
    const getLogStatusClasses = (status: LogEntry['status']): string => {
        switch (status) {
            case 'OK':
                return 'text-[#10B981]/70';
            case 'INFO':
                return 'text-[#3B82F6]';
            case 'PROC':
                return 'text-[#3B82F6] animate-pulse';
            case 'ERROR':
                return 'text-[#EF4444]';
            default:
                return 'text-[#64748B]';
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-sm p-4"
            data-testid="processing-modal-backdrop"
        >
            {/* Background blur effect */}
            <div className="absolute inset-0 z-0 opacity-20 filter blur-2xl scale-110 pointer-events-none">
                <div className="flex h-full flex-col">
                    <header className="flex items-center justify-between px-10 py-4 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="size-8 bg-[#3B82F6] rounded-lg"></div>
                            <div className="h-4 w-32 bg-white/10 rounded"></div>
                        </div>
                        <div className="flex gap-8">
                            <div className="h-3 w-16 bg-white/10 rounded"></div>
                            <div className="h-3 w-16 bg-white/10 rounded"></div>
                        </div>
                    </header>
                    <main className="p-10 grid grid-cols-3 gap-6">
                        <div className="h-64 bg-white/5 rounded-xl border border-white/5"></div>
                        <div className="h-64 bg-white/5 rounded-xl border border-white/5"></div>
                        <div className="h-64 bg-white/5 rounded-xl border border-white/5"></div>
                        <div className="col-span-3 h-96 bg-white/5 rounded-xl border border-white/5"></div>
                    </main>
                </div>
            </div>

            {/* Main Modal */}
            <div
                className="relative w-full max-w-[600px] bg-[#1e293b]/40 backdrop-blur-[24px] border border-white/8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden"
                data-testid="processing-modal"
            >
                {/* Header */}
                <div className="p-8 border-b border-white/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1
                                className="text-white text-xl font-semibold tracking-tight"
                                data-testid="processing-modal-title"
                            >
                                {title}
                            </h1>
                            {subtitle && (
                                <p
                                    className="text-[#64748B] text-[10px] font-mono mt-1 uppercase tracking-widest"
                                    data-testid="processing-modal-subtitle"
                                >
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        <div className="text-right">
                            {transactionId && (
                                <p
                                    className="text-[#64748B] text-[10px] uppercase font-mono tracking-tighter"
                                    data-testid="processing-modal-transaction-id"
                                >
                                    {transactionId}
                                </p>
                            )}
                            <p
                                className="text-white text-sm font-semibold mt-1"
                                data-testid="processing-modal-amount"
                            >
                                {amount} {currency}
                            </p>
                        </div>
                    </div>

                    {/* Header Badges */}
                    {headerBadges.length > 0 && (
                        <div
                            className="flex gap-2 mt-4"
                            data-testid="processing-modal-header-badges"
                        >
                            {headerBadges.map((badge) => (
                                <span
                                    key={badge}
                                    className="text-[9px] bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 px-2 py-0.5 rounded font-mono"
                                    data-testid={`header-badge-${badge}`}
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Steps Timeline */}
                {steps.length > 0 && (
                    <div className="p-8 space-y-2" data-testid="processing-modal-steps">
                        <div className="grid grid-cols-[40px_1fr] gap-x-6">
                            {steps.map((step, index) => (
                                <div key={step.id} className="contents">
                                    {/* Icon Column */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`size-10 rounded-full flex items-center justify-center ${getStepIconClasses(step.status)}`}
                                            data-testid={`step-icon-${step.id}`}
                                        >
                                            {step.status === 'in-progress' ? (
                                                <span className="material-symbols-outlined text-[22px] animate-spin">
                                                    {getStepIcon(step.status)}
                                                </span>
                                            ) : (
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {getStepIcon(step.status)}
                                                </span>
                                            )}
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`w-px h-10 ${step.status === 'completed'
                                                    ? 'bg-[#10B981]/30'
                                                    : 'bg-white/10'
                                                    }`}
                                            ></div>
                                        )}
                                    </div>

                                    {/* Content Column */}
                                    <div
                                        className={`flex flex-col py-1 ${index < steps.length - 1 ? 'pb-6' : ''}`}
                                        data-testid={`step-content-${step.id}`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <p
                                                    className={`text-sm font-medium ${step.status === 'pending'
                                                        ? 'text-white/40'
                                                        : 'text-white'
                                                        }`}
                                                    data-testid={`step-title-${step.id}`}
                                                >
                                                    {step.title}
                                                </p>
                                                {step.status === 'in-progress' && (
                                                    <span className="text-[#3B82F6] text-[10px] font-mono animate-pulse">
                                                        SYNCING
                                                    </span>
                                                )}
                                            </div>
                                            {step.duration && (
                                                <span
                                                    className={`text-xs font-mono ${step.status === 'completed'
                                                        ? 'text-emerald-400'
                                                        : step.status === 'in-progress'
                                                            ? 'text-primary animate-pulse'
                                                            : 'text-[#64748B]'
                                                        }`}
                                                    data-testid={`step-duration-${step.id}`}
                                                >
                                                    {step.duration}
                                                </span>
                                            )}
                                        </div>
                                        <p
                                            className={`text-xs mt-1 ${step.status === 'pending'
                                                ? 'text-[#64748B]/40'
                                                : 'text-[#64748B]'
                                                }`}
                                            data-testid={`step-description-${step.id}`}
                                        >
                                            {step.description}
                                        </p>

                                        {/* Step Badges */}
                                        {step.badges && step.badges.length > 0 && (
                                            <div
                                                className="flex gap-2 mt-3"
                                                data-testid={`step-badges-${step.id}`}
                                            >
                                                {step.badges.map((badge) => (
                                                    <span
                                                        key={badge}
                                                        className="text-[9px] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-2 py-0.5 rounded font-mono"
                                                    >
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Progress Bar */}
                                        {step.status === 'in-progress' &&
                                            step.progress !== undefined && (
                                                <div
                                                    className="mt-4 bg-black/20 rounded-lg p-3 border border-white/5"
                                                    data-testid={`step-progress-${step.id}`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] text-[#64748B] font-mono">
                                                            PEER_HANDSHAKE
                                                        </span>
                                                        <span className="text-[10px] text-[#3B82F6] font-mono">
                                                            {step.progress}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-[#3B82F6] h-full rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-300"
                                                            style={{ width: `${step.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Log Console */}
                {logs.length > 0 && (
                    <div
                        className="p-6 bg-black/30 border-t border-white/5 font-mono text-[11px]"
                        data-testid="processing-modal-logs"
                    >
                        <div className="flex flex-col gap-1.5 text-[#64748B]">
                            {logs.map((entry, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3"
                                    data-testid={`log-entry-${index}`}
                                >
                                    <span className="opacity-40">[{entry.timestamp}]</span>
                                    <span className={getLogStatusClasses(entry.status)}>
                                        {entry.status}
                                    </span>
                                    <span
                                        className={entry.status === 'PROC' ? 'text-white/60' : ''}
                                    >
                                        {entry.message}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="p-8 pt-4">
                    <button
                        className="w-full flex items-center justify-center gap-3 bg-white/5 text-[#64748B] py-4 rounded-xl font-semibold cursor-not-allowed border border-[#3B82F6]/40"
                        disabled
                    >
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                        Awaiting Network Confirmation
                    </button>
                    <p className="text-center text-[10px] text-[#64748B]/60 mt-4 uppercase tracking-[0.15em] font-medium">
                        Atomic swap: transaction is non-reversible
                    </p>
                </div>
            </div>
        </div>
    );
};
