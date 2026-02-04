import { PaymentDevToolsText } from '../constants';
import { PaymentStatusEnum } from '../types';
import type { PaymentStatusEnum as PaymentStatusEnumType, PaymentState } from '../types';

interface ProcessStatusPanelProps {
    paymentId: string | null;
    status: PaymentStatusEnumType | null;
    paymentState: PaymentState | null;
    initiatedAt: string | null;
    onCheckStatus: () => void;
    onVoid: () => void;
    isCheckingStatus: boolean;
}

/**
 * Returns status step configuration based on current status
 */
const getStatusSteps = (status: PaymentStatusEnumType | null, initiatedAt: string | null) => {
    const isTerminalStatus = status === PaymentStatusEnum.SUCCESS || status === PaymentStatusEnum.FAILED || status === PaymentStatusEnum.REFUNDED;
    const isSuccessfulStatus = status === PaymentStatusEnum.SUCCESS || status === PaymentStatusEnum.REFUNDED;

    const steps = [
        {
            id: 'initiated',
            label: PaymentDevToolsText.STATUS_INITIATED,
            sublabel: initiatedAt || '',
            isComplete: status !== null,
            isCurrent: status === PaymentStatusEnum.INITIATED,
            icon: 'check_circle',
        },
        {
            id: 'pending',
            label: PaymentDevToolsText.STATUS_PENDING,
            sublabel: status === PaymentStatusEnum.PENDING ? PaymentDevToolsText.AWAITING_PROVIDER_RESPONSE : '',
            isComplete: isTerminalStatus,
            isCurrent: status === PaymentStatusEnum.PENDING,
            icon: 'pending',
        },
        {
            id: 'settled',
            label: PaymentDevToolsText.STATUS_SETTLED,
            sublabel: status === null ? PaymentDevToolsText.OUTCOME_NOT_DETERMINED : '',
            isComplete: isSuccessfulStatus,
            isCurrent: isTerminalStatus,
            icon: status === PaymentStatusEnum.FAILED ? 'cancel' : 'check_circle',
        },
    ];
    return steps;
};

/**
 * Panel 3: Process & Real-time Status - Status timeline and raw JSON state
 */
export const ProcessStatusPanel = ({
    paymentId,
    status,
    paymentState,
    initiatedAt,
    onCheckStatus,
    onVoid,
    isCheckingStatus,
}: ProcessStatusPanelProps) => {
    const steps = getStatusSteps(status, initiatedAt);

    return (
        <div className="bg-[#0d1117] border border-slate-700/50 rounded-xl p-4 flex flex-col gap-4 h-full">
            {/* Panel Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-mono text-sm">3</span>
                    <h3 className="text-white font-semibold text-sm">{PaymentDevToolsText.PANEL3_TITLE}</h3>
                </div>
                {paymentId && (
                    <span className="text-slate-400 text-xs font-mono">
                        {PaymentDevToolsText.PID_PREFIX} {paymentId}
                    </span>
                )}
            </div>

            {/* Status Timeline */}
            <div className="flex flex-col gap-0">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-3">
                        {/* Timeline indicator */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${step.isComplete
                                    ? 'bg-emerald-500/20'
                                    : step.isCurrent
                                        ? 'bg-blue-500/20'
                                        : 'bg-slate-700/50'
                                    }`}
                            >
                                <span
                                    className={`material-symbols-outlined text-lg ${step.isComplete
                                        ? 'text-emerald-400'
                                        : step.isCurrent
                                            ? 'text-blue-400'
                                            : 'text-slate-500'
                                        }`}
                                >
                                    {step.icon}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`w-0.5 h-8 ${step.isComplete ? 'bg-emerald-500/50' : 'bg-slate-700'
                                        }`}
                                />
                            )}
                        </div>

                        {/* Step content */}
                        <div className="flex-1 pb-2">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`font-semibold text-sm ${step.isComplete || step.isCurrent ? 'text-white' : 'text-slate-500'
                                        }`}
                                >
                                    {step.label}
                                </span>
                                {step.isCurrent && status !== PaymentStatusEnum.SUCCESS && status !== PaymentStatusEnum.FAILED && (
                                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                                        {PaymentDevToolsText.CURRENT_STATE}
                                    </span>
                                )}
                            </div>
                            {step.sublabel && (
                                <p className="text-slate-400 text-xs mt-0.5">{step.sublabel}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Raw JSON State */}
            <div className="flex flex-col gap-2 flex-1 min-h-0">
                <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-medium tracking-wider">
                        {PaymentDevToolsText.RAW_JSON_TITLE}
                    </span>
                    {paymentState && (
                        <button
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(paymentState, null, 2))}
                            className="text-slate-500 hover:text-white transition-colors"
                            aria-label={PaymentDevToolsText.COPY_JSON_LABEL}
                        >
                            <span className="material-symbols-outlined text-base">content_copy</span>
                        </button>
                    )}
                </div>
                <div className="bg-[#161b22] border border-slate-700 rounded-lg p-3 font-mono text-xs overflow-auto flex-1 min-h-0">
                    {paymentState ? (
                        <pre className="text-slate-300">
                            <span className="text-slate-500">{'{'}</span>
                            {'\n'}
                            {'  '}<span className="text-slate-400">"id":</span> <span className="text-emerald-400">"{paymentState.id}"</span>,
                            {'\n'}
                            {'  '}<span className="text-slate-400">"status":</span> <span className="text-emerald-400">"{paymentState.status}"</span>,
                            {'\n'}
                            {'  '}<span className="text-slate-400">"amount":</span> <span className="text-blue-400">{paymentState.amount}</span>,
                            {'\n'}
                            {'  '}<span className="text-slate-400">"currency":</span> <span className="text-emerald-400">"{paymentState.currency}"</span>,
                            {'\n'}
                            {'  '}<span className="text-slate-400">"metadata":</span> <span className="text-slate-500">{'{'}</span>
                            {'\n'}
                            {'    '}<span className="text-slate-400">"test_mode":</span> <span className="text-orange-400">{paymentState.metadata.test_mode.toString()}</span>,
                            {'\n'}
                            {'    '}<span className="text-slate-400">"sdk_version":</span> <span className="text-emerald-400">"{paymentState.metadata.sdk_version}"</span>
                            {'\n'}
                            {'  '}<span className="text-slate-500">{'}'}</span>
                            {'\n'}
                            <span className="text-slate-500">{'}'}</span>
                        </pre>
                    ) : (
                        <span className="text-slate-500">{PaymentDevToolsText.NO_PAYMENT_STATE}</span>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-shrink-0">
                <button
                    onClick={onCheckStatus}
                    disabled={!paymentId || isCheckingStatus}
                    className="flex-1 bg-[#161b22] hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                >
                    {isCheckingStatus ? PaymentDevToolsText.CHECKING_STATUS_BUTTON : PaymentDevToolsText.CHECK_STATUS_BUTTON}
                </button>
                <button
                    onClick={onVoid}
                    disabled={!paymentId || status === PaymentStatusEnum.SUCCESS || status === PaymentStatusEnum.REFUNDED}
                    className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    {PaymentDevToolsText.VOID_BUTTON}
                </button>
            </div>
        </div>
    );
};
