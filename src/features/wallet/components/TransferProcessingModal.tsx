import { useEffect } from 'react';
import { MODAL_TEXT, ICONS, TRANSFER_PROCESSING_STEPS, TRANSFER_LOG_ENTRIES } from '../constants/text';

interface ProcessingStep {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'processing' | 'pending';
    badges?: readonly string[];
    progress?: number;
}

interface LogEntry {
    timestamp: string;
    status: 'OK' | 'INFO' | 'PROC';
    message: string;
}

interface TransferProcessingModalProps {
    isOpen: boolean;
    amount: string;
    currency: string;
    onComplete: () => void;
}

export const TransferProcessingModal = ({
    isOpen,
    amount,
    currency,
    onComplete,
}: TransferProcessingModalProps) => {
    const steps: ProcessingStep[] = [
        {
            ...TRANSFER_PROCESSING_STEPS[0],
            status: 'completed',
        },
        {
            ...TRANSFER_PROCESSING_STEPS[1],
            status: 'processing',
        },
        {
            ...TRANSFER_PROCESSING_STEPS[2],
            status: 'pending',
        },
    ];

    const logEntries = TRANSFER_LOG_ENTRIES;

    useEffect(() => {
        if (!isOpen) return;

        const timer = window.setTimeout(() => {
            onComplete();
        }, 5000);

        return () => clearTimeout(timer);
    }, [isOpen, onComplete]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-sm p-4">
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
            <div className="relative w-full max-w-[600px] bg-[#1e293b]/40 backdrop-blur-[24px] border border-white/8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-white/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-white text-xl font-semibold tracking-tight">
                                {MODAL_TEXT.PROCESSING_TRANSFER}
                            </h1>
                            <p className="text-[#64748B] text-[10px] font-mono mt-1 uppercase tracking-widest">
                                {MODAL_TEXT.PROTOCOL_ENGINE}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[#64748B] text-[10px] uppercase font-mono tracking-tighter">
                                {MODAL_TEXT.TXID_PREFIX}
                            </p>
                            <p className="text-white text-sm font-semibold mt-1">
                                {amount} {currency}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="p-8 space-y-2">
                    <div className="grid grid-cols-[40px_1fr] gap-x-6">
                        {steps.map((step, index) => (
                            <div key={step.id} className="contents">
                                {/* Icon Column */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`size-10 rounded-full flex items-center justify-center ${step.status === 'completed'
                                            ? 'bg-[#10B981]/10 border border-[#10B981] text-[#10B981]'
                                            : step.status === 'processing'
                                                ? 'bg-[#3B82F6] text-white'
                                                : 'bg-white/5 border border-white/10 text-[#64748B]'
                                            }`}
                                    >
                                        {step.status === 'completed' ? (
                                            <span className="material-symbols-outlined text-[20px]">{ICONS.CHECK}</span>
                                        ) : step.status === 'processing' ? (
                                            <span className="material-symbols-outlined text-[22px] animate-spin">
                                                {ICONS.SYNC}
                                            </span>
                                        ) : (
                                            <span className="material-symbols-outlined text-[20px]">{ICONS.SCHEDULE}</span>
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
                                <div className={`flex flex-col py-1 ${index < steps.length - 1 ? 'pb-6' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <p
                                            className={`text-sm font-medium ${step.status === 'pending' ? 'text-white/40' : 'text-white'
                                                }`}
                                        >
                                            {step.title}
                                        </p>
                                        {step.status === 'processing' && (
                                            <span className="text-[#3B82F6] text-[10px] font-mono animate-pulse">
                                                {MODAL_TEXT.SYNCING}
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className={`text-xs mt-1 ${step.status === 'pending' ? 'text-[#64748B]/40' : 'text-[#64748B]'
                                            }`}
                                    >
                                        {step.description}
                                    </p>

                                    {/* Badges */}
                                    {step.badges && (
                                        <div className="flex gap-2 mt-3">
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
                                    {step.status === 'processing' && step.progress !== undefined && (
                                        <div className="mt-4 bg-black/20 rounded-lg p-3 border border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] text-[#64748B] font-mono">
                                                    {MODAL_TEXT.PEER_HANDSHAKE}
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

                {/* Log Console */}
                <div className="p-6 bg-black/30 border-t border-white/5 font-mono text-[11px]">
                    <div className="flex flex-col gap-1.5 text-[#64748B]">
                        {logEntries.map((entry, index) => (
                            <div key={index} className="flex gap-3">
                                <span className="opacity-40">[{entry.timestamp}]</span>
                                <span
                                    className={
                                        entry.status === 'OK'
                                            ? 'text-[#10B981]/70'
                                            : entry.status === 'INFO'
                                                ? 'text-[#3B82F6]'
                                                : 'text-[#3B82F6] animate-pulse'
                                    }
                                >
                                    {entry.status}
                                </span>
                                <span className={entry.status === 'PROC' ? 'text-white/60' : ''}>
                                    {entry.message}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Button */}
                <div className="p-8 pt-4">
                    <button
                        className="w-full flex items-center justify-center gap-3 bg-white/5 text-[#64748B] py-4 rounded-xl font-semibold cursor-not-allowed border border-[#3B82F6]/40"
                        disabled
                    >
                        <span className="material-symbols-outlined text-[20px]">{ICONS.LOCK}</span>
                        {MODAL_TEXT.AWAITING_CONFIRMATION}
                    </button>
                    <p className="text-center text-[10px] text-[#64748B]/60 mt-4 uppercase tracking-[0.15em] font-medium">
                        {MODAL_TEXT.ATOMIC_SWAP}
                    </p>
                </div>
            </div>
        </div>
    );
};
