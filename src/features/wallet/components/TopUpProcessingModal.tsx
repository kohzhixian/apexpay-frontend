import { useEffect, useState } from 'react';
import { MODAL_TEXT, PROCESSING_STEPS, ICONS } from '../constants/text';

interface ProcessingStep {
    id: string;
    title: string;
    description: string;
    duration: string;
    status: 'completed' | 'processing' | 'pending';
}

interface TopUpProcessingModalProps {
    isOpen: boolean;
    amount: string;
    currency: string;
    paymentMethod: string;
    onComplete: () => void;
}

export const TopUpProcessingModal = ({
    isOpen,
    amount,
    currency,
    paymentMethod,
    onComplete,
}: TopUpProcessingModalProps) => {
    const [progress, setProgress] = useState(0);
    const currentPhase = MODAL_TEXT.PHASE_2_COMMIT;

    const steps: ProcessingStep[] = [
        {
            id: '1',
            title: PROCESSING_STEPS.CONTACTING_BANK,
            description: PROCESSING_STEPS.CONTACTING_BANK_DESC,
            duration: PROCESSING_STEPS.CONTACTING_BANK_DURATION,
            status: 'completed',
        },
        {
            id: '2',
            title: PROCESSING_STEPS.VERIFYING_FUNDS,
            description: PROCESSING_STEPS.VERIFYING_FUNDS_DESC,
            duration: PROCESSING_STEPS.VERIFYING_FUNDS_DURATION,
            status: 'completed',
        },
        {
            id: '3',
            title: PROCESSING_STEPS.PREPARING_LEDGER,
            description: PROCESSING_STEPS.PREPARING_LEDGER_DESC,
            duration: PROCESSING_STEPS.PREPARING_LEDGER_DURATION,
            status: 'processing',
        },
    ];

    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    onComplete();
                    return 100;
                }
                return prev + 1;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [isOpen, onComplete]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-sm">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[80px]"></div>
            </div>

            {/* Main Modal Container */}
            <div className="relative w-full max-w-[520px] bg-[#182234] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#314368] overflow-hidden flex flex-col">
                {/* Header Section with Visualizer */}
                <div className="p-8 pb-4 flex flex-col items-center border-b border-[#314368]/50 bg-[#141c2c]">
                    <h1 className="text-[#90a4cb] text-sm font-medium tracking-wide uppercase mb-8">
                        {MODAL_TEXT.TOP_UP_IN_PROGRESS}
                    </h1>

                    {/* Two-Phase Visualizer */}
                    <div className="w-full flex items-center justify-between px-4 mb-8">
                        {/* Node 1: Bank (Completed) */}
                        <div className="flex flex-col items-center gap-3 relative z-10">
                            <div className="w-14 h-14 rounded-full bg-[#182234] border-2 border-primary flex items-center justify-center text-primary shadow-lg">
                                <span className="material-symbols-outlined text-[28px]">{ICONS.ACCOUNT_BALANCE}</span>
                            </div>
                            <span className="text-white text-xs font-medium">{MODAL_TEXT.CHASE_BANK_NAME}</span>
                        </div>

                        {/* Connection Line */}
                        <div className="flex-1 h-[2px] bg-[#314368] mx-[-10px] relative -top-4">
                            {/* Animated gradient bar simulating data transfer */}
                            <div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-blue-300 h-full rounded-full shadow-[0_0_8px_rgba(61,122,245,0.8)] transition-all duration-300"
                                style={{ width: `${progress * 0.75}%` }}
                            ></div>
                        </div>

                        {/* Node 2: ApexPay (Processing) */}
                        <div className="flex flex-col items-center gap-3 relative z-10">
                            <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 border-2 border-white/10">
                                <span className="material-symbols-outlined text-[28px] animate-pulse">
                                    {ICONS.ACCOUNT_BALANCE_WALLET}
                                </span>
                            </div>
                            <span className="text-white text-xs font-medium">{MODAL_TEXT.APEXPAY_WALLET}</span>
                        </div>
                    </div>

                    <div className="text-center space-y-2 mb-2">
                        <p className="text-white text-2xl font-bold leading-tight tracking-tight">
                            {MODAL_TEXT.PROCESSING_TRANSACTION}
                        </p>
                        <p className="text-[#90a4cb] text-sm">
                            {MODAL_TEXT.TWO_PHASE_COMMIT}
                        </p>
                    </div>
                </div>

                {/* Transaction Details Chips */}
                <div className="flex justify-center gap-3 py-4 bg-[#182234]">
                    <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#222f49] pl-3 pr-4 border border-[#314368]/50">
                        <span className="material-symbols-outlined text-primary text-[18px]">{ICONS.ADD_CIRCLE}</span>
                        <p className="text-white text-sm font-semibold font-mono tracking-tight">
                            ${amount} {currency}
                        </p>
                    </div>
                    <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#222f49] pl-3 pr-4 border border-[#314368]/50">
                        <span className="material-symbols-outlined text-[#90a4cb] text-[18px]">{ICONS.CREDIT_CARD}</span>
                        <p className="text-[#90a4cb] text-sm font-medium">{paymentMethod}</p>
                    </div>
                </div>

                {/* Phase Progress Bar */}
                <div className="px-8 py-4 bg-[#182234]">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-6 justify-between items-end">
                            <p className="text-white text-sm font-semibold">{currentPhase}</p>
                            <p className="text-primary text-xs font-mono">{progress}%</p>
                        </div>
                        <div className="rounded-full bg-[#222f49] overflow-hidden h-2">
                            <div
                                className="h-full rounded-full bg-primary shadow-[0_0_10px_rgba(61,122,245,0.5)] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-[#90a4cb] text-xs font-normal">{MODAL_TEXT.LOCKING_LEDGER}</p>
                    </div>
                </div>

                {/* Timeline Log */}
                <div className="px-8 py-2 bg-[#182234]">
                    <div className="grid grid-cols-[32px_1fr] gap-x-3">
                        {steps.map((step, index) => (
                            <div key={step.id} className="contents">
                                {/* Icon Column */}
                                <div className="flex flex-col items-center gap-1 pt-1">
                                    {step.status === 'completed' ? (
                                        <div className="text-primary bg-primary/10 rounded-full p-0.5">
                                            <span className="material-symbols-outlined text-[20px]">
                                                {ICONS.CHECK_CIRCLE}
                                            </span>
                                        </div>
                                    ) : step.status === 'processing' ? (
                                        <div className="text-white bg-white/5 rounded-full p-0.5 animate-spin">
                                            <span className="material-symbols-outlined text-[20px]">
                                                {ICONS.PROGRESS_ACTIVITY}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-[#90a4cb] bg-[#222f49] rounded-full p-0.5">
                                            <span className="material-symbols-outlined text-[20px]">
                                                {ICONS.RADIO_BUTTON_UNCHECKED}
                                            </span>
                                        </div>
                                    )}
                                    {index < steps.length - 1 && (
                                        <div className="w-[1px] bg-[#314368] h-full grow my-1"></div>
                                    )}
                                </div>

                                {/* Content Column */}
                                <div className={`flex flex-1 flex-col ${index < steps.length - 1 ? 'pb-6' : 'pb-2'} pt-${index === 0 ? '1' : '0.5'}`}>
                                    <div className="flex justify-between items-start">
                                        <p className="text-white text-sm font-medium leading-none">{step.title}</p>
                                        <span
                                            className={`text-xs font-mono ${step.status === 'completed'
                                                ? 'text-emerald-400'
                                                : step.status === 'processing'
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

                {/* Footer / MetaText */}
                <div className="bg-[#101623] px-8 py-4 border-t border-[#314368] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#90a4cb]">
                        <span className="material-symbols-outlined text-[16px]">{ICONS.LOCK}</span>
                        <span className="text-[11px] font-mono uppercase tracking-wider">{MODAL_TEXT.AES_ENCRYPTED}</span>
                    </div>
                    <span className="text-[#90a4cb] text-[11px] font-mono">{MODAL_TEXT.TRANSACTION_ID_PREFIX}</span>
                </div>
            </div>
        </div>
    );
};
