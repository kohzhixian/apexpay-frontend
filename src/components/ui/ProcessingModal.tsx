import { useEffect, useState, useRef } from 'react';

interface ProcessingModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Modal title displayed at top (uppercase) */
    title: string;
    /** Main heading text */
    heading: string;
    /** Subtitle below heading */
    subtitle: string;
    /** Amount being processed */
    amount: string;
    /** Currency code */
    currency: string;
    /** Icon for source node (material icon name) */
    sourceIcon: string;
    /** Label for source node */
    sourceLabel: string;
    /** Icon for destination node (material icon name) */
    destinationIcon: string;
    /** Label for destination node */
    destinationLabel: string;
    /** Secondary info text (payment method, recipient email, etc.) */
    secondaryInfo: string;
    /** Label for secondary info (e.g., "To", "Via") */
    secondaryInfoLabel: string;
    /** Icon for secondary info chip */
    secondaryInfoIcon: string;
    /** Current phase name to display */
    phaseName: string;
    /** Text below progress bar */
    progressSubtext: string;
    /** Animation duration in milliseconds (default 5000) */
    animationDurationMs?: number;
    /** Callback when processing animation completes */
    onComplete: () => void;
    /** Transaction ID to display in footer */
    transactionId?: string;
    /** Timeline steps to display */
    timelineSteps?: TimelineStep[];
}

interface TimelineStep {
    /** Step title */
    title: string;
    /** Step description */
    description: string;
    /** Duration text to display */
    duration: string;
    /** Step status */
    status: 'completed' | 'in-progress' | 'pending';
}

/**
 * A reusable processing modal component for displaying transaction progress.
 * Shows a visualizer with source → destination animation, progress bar,
 * timeline steps, and transaction details.
 */
export const ProcessingModal = ({
    isOpen,
    title,
    heading,
    subtitle,
    amount,
    currency,
    sourceIcon,
    sourceLabel,
    destinationIcon,
    destinationLabel,
    secondaryInfo,
    secondaryInfoLabel,
    secondaryInfoIcon,
    phaseName,
    progressSubtext,
    animationDurationMs = 5000,
    onComplete,
    transactionId = 'ID: #TXN-9982-ALPHA',
    timelineSteps,
}: ProcessingModalProps) => {
    const [progress, setProgress] = useState(0);
    const hasCalledOnComplete = useRef(false);

    // Default timeline steps if none provided
    const defaultTimelineSteps: TimelineStep[] = [
        {
            title: 'Contacting Bank Gateway',
            description: 'Handshake established with API',
            duration: '120ms',
            status: 'completed',
        },
        {
            title: 'Verifying Funds Availability',
            description: 'Pre-authorization token received',
            duration: '45ms',
            status: 'completed',
        },
        {
            title: 'Preparing Ledger Entry',
            description: 'Writing to distributed node shard #4...',
            duration: 'PENDING',
            status: 'in-progress',
        },
    ];

    const steps = timelineSteps || defaultTimelineSteps;

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setProgress(0);
            hasCalledOnComplete.current = false;
        }
    }, [isOpen]);

    // Progress animation
    useEffect(() => {
        if (!isOpen) return;

        const intervalMs = animationDurationMs / 100;
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    if (!hasCalledOnComplete.current) {
                        hasCalledOnComplete.current = true;
                        onComplete();
                    }
                    return 100;
                }
                return prev + 1;
            });
        }, intervalMs);

        return () => clearInterval(interval);
    }, [isOpen, animationDurationMs, onComplete]);

    if (!isOpen) return null;

    /**
     * Returns the appropriate icon for a timeline step based on its status
     */
    const getStepIcon = (status: TimelineStep['status']): string => {
        switch (status) {
            case 'completed':
                return 'check_circle';
            case 'in-progress':
                return 'progress_activity';
            case 'pending':
            default:
                return 'radio_button_unchecked';
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
                className="relative w-full max-w-[600px] bg-[#1e293b]/40 backdrop-blur-[24px] border border-[#3B82F6]/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden"
                data-testid="processing-modal"
            >
                {/* Header with Visualizer */}
                <div className="p-8 pb-4 flex flex-col items-center border-b border-[#314368]/50 bg-[#141c2c]">
                    <h1
                        className="text-[#90a4cb] text-sm font-medium tracking-wide uppercase mb-8"
                        data-testid="processing-modal-title"
                    >
                        {title}
                    </h1>

                    {/* Two-Phase Visualizer */}
                    <div className="w-full flex items-center justify-between px-4 mb-8">
                        {/* Source Node */}
                        <div className="flex flex-col items-center gap-3 relative z-10">
                            <div className="w-14 h-14 rounded-full bg-[#182234] border-2 border-primary flex items-center justify-center text-primary shadow-lg">
                                <span className="material-symbols-outlined text-[28px]">{sourceIcon}</span>
                            </div>
                            <span className="text-white text-xs font-medium">{sourceLabel}</span>
                        </div>

                        {/* Connection Line */}
                        <div className="flex-1 h-[2px] bg-[#314368] mx-[-10px] relative -top-4">
                            <div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-blue-300 h-full rounded-full shadow-[0_0_8px_rgba(61,122,245,0.8)] transition-all duration-300"
                                style={{ width: `${progress * 0.75}%` }}
                            ></div>
                        </div>

                        {/* Destination Node */}
                        <div className="flex flex-col items-center gap-3 relative z-10">
                            <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 border-2 border-white/10">
                                <span className="material-symbols-outlined text-[28px] animate-pulse">
                                    {destinationIcon}
                                </span>
                            </div>
                            <span className="text-white text-xs font-medium">{destinationLabel}</span>
                        </div>
                    </div>

                    <div className="text-center space-y-2 mb-2">
                        <p
                            className="text-white text-2xl font-bold leading-tight tracking-tight"
                            data-testid="processing-modal-heading"
                        >
                            {heading}
                        </p>
                        <p className="text-[#90a4cb] text-sm">{subtitle}</p>
                    </div>
                </div>

                {/* Transaction Chips */}
                <div className="flex justify-center gap-3 py-4 bg-[#182234]">
                    <div className="chip">
                        <span className="material-symbols-outlined text-primary text-[18px]">add_circle</span>
                        <p
                            className="text-sm tracking-tight"
                            data-testid="processing-modal-amount"
                        >
                            <span className="text-[#90a4cb] font-medium">Amount: </span>
                            <span className="text-white font-semibold font-mono">${amount} {currency}</span>
                        </p>
                    </div>
                    <div className="chip">
                        <span className="material-symbols-outlined text-[#90a4cb] text-[18px]">
                            {secondaryInfoIcon}
                        </span>
                        <p
                            className="text-sm"
                            data-testid="processing-modal-secondary-info"
                        >
                            <span className="text-[#90a4cb] font-medium">{secondaryInfoLabel}: </span>
                            <span className="text-white font-medium">{secondaryInfo}</span>
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="px-8 py-4 bg-[#182234]">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-6 justify-between items-end">
                            <p className="text-white text-sm font-semibold">{phaseName}</p>
                            <p className="text-primary text-xs font-mono">{progress}%</p>
                        </div>
                        <div className="rounded-full bg-[#222f49] overflow-hidden h-2">
                            <div
                                className="h-full rounded-full bg-primary shadow-[0_0_10px_rgba(61,122,245,0.5)] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-[#90a4cb] text-xs font-normal">{progressSubtext}</p>
                    </div>
                </div>

                {/* Timeline */}
                <div className="px-8 py-2 bg-[#182234]">
                    <div className="grid grid-cols-[32px_1fr] gap-x-3">
                        {steps.map((step, index) => (
                            <div key={index} className="contents">
                                {/* Icon Column */}
                                <div className="flex flex-col items-center gap-1 pt-1">
                                    {step.status === 'completed' ? (
                                        <div className="text-primary bg-primary/10 rounded-full p-0.5">
                                            <span className="material-symbols-outlined text-[20px]">
                                                {getStepIcon(step.status)}
                                            </span>
                                        </div>
                                    ) : step.status === 'in-progress' ? (
                                        <div className="text-white bg-white/5 rounded-full p-0.5 animate-spin">
                                            <span className="material-symbols-outlined text-[20px]">
                                                {getStepIcon(step.status)}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-[#90a4cb] bg-[#222f49] rounded-full p-0.5">
                                            <span className="material-symbols-outlined text-[20px]">
                                                {getStepIcon(step.status)}
                                            </span>
                                        </div>
                                    )}
                                    {index < steps.length - 1 && (
                                        <div className="w-[1px] bg-[#314368] h-full grow my-1"></div>
                                    )}
                                </div>

                                {/* Content Column */}
                                <div
                                    className={`flex flex-1 flex-col ${index < steps.length - 1 ? 'pb-6' : 'pb-2'} ${index === 0 ? 'pt-1' : 'pt-0.5'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="text-white text-sm font-medium leading-none">{step.title}</p>
                                        <span
                                            className={`text-xs font-mono ${step.status === 'completed'
                                                ? 'text-emerald-400'
                                                : step.status === 'in-progress'
                                                    ? 'text-primary animate-pulse'
                                                    : 'text-[#90a4cb]'
                                                }`}
                                        >
                                            {step.duration}
                                        </span>
                                    </div>
                                    <p className="text-[#90a4cb] text-xs mt-1">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-[#101623] px-8 py-4 border-t border-[#314368] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#90a4cb]">
                        <span className="material-symbols-outlined text-[16px]">lock</span>
                        <span className="text-[11px] font-mono uppercase tracking-wider">AES-256 Encrypted</span>
                    </div>
                    <span className="text-[#90a4cb] text-[11px] font-mono">{transactionId}</span>
                </div>
            </div>
        </div>
    );
};
