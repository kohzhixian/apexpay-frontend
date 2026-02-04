import { useState } from 'react';

interface TransactionDetail {
    /** Label for the detail row */
    label: string;
    /** Value to display */
    value: string;
    /** Optional icon name */
    icon?: string;
    /** Whether the value can be copied */
    copyable?: boolean;
}

interface SuccessModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when modal is closed */
    onClose: () => void;
    /** Modal title */
    title: string;
    /** Modal subtitle */
    subtitle?: string;
    /** Main amount to display */
    amount: string;
    /** Currency code */
    currency: string;
    /** Optional balance display label (e.g., "Updated Balance") */
    balanceLabel?: string;
    /** Optional balance value */
    balanceValue?: number;
    /** Optional recipient info */
    recipient?: {
        name: string;
        avatar?: string;
    };
    /** Transaction details to display */
    details: TransactionDetail[];
    /** Primary action button config */
    primaryAction: {
        label: string;
        onClick: () => void;
    };
    /** Optional secondary action button */
    secondaryAction?: {
        label: string;
        icon?: string;
        onClick: () => void;
    };
    /** Optional footer text */
    footerText?: string;
    /** Optional footer link */
    footerLink?: {
        text: string;
        href: string;
    };
}

/**
 * A reusable success modal component for displaying transaction confirmations.
 * Supports configurable title, subtitle, amount, currency, recipient info,
 * transaction details, action buttons, and footer content.
 */
export const SuccessModal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    amount,
    currency,
    balanceLabel,
    balanceValue,
    recipient,
    details,
    primaryAction,
    secondaryAction,
    footerText,
    footerLink,
}: SuccessModalProps) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    /**
     * Copies a value to clipboard and shows visual feedback
     * @param value - The value to copy
     * @param label - The label used to identify which item was copied
     */
    const handleCopy = (value: string, label: string) => {
        navigator.clipboard.writeText(value);
        setCopiedId(label);
        setTimeout(() => setCopiedId(null), 2000);
    };

    /**
     * Handles backdrop click to close modal
     */
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const defaultAvatar =
        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAiUCpEoe65uAenGOVq1jFR70HAhcBjnEPy3yCF41DoBXcro53lNhw2TfT5tS1jDOpLgfHP9Xh6ha6zIFHPKI8sxX0_T5JK_zHXgSshO6VshtEjb-p-SyK_vxIJz2JIi7wLitW_H7MiYKuEn75d_9w1Bx1FgjJMlUSLJysn01U1xH1uxOogN1cqAcDY9MDVl3vfgKFFSdDocSozdMauuLmvYs0wt1FQOHiDSq2MTzy_LGJoC6yx3O8svCSelpmrEy2e-X37ge3I0hQ')";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
            data-testid="success-modal-backdrop"
        >
            {/* Main Modal */}
            <div
                className="relative w-full max-w-[520px] bg-[#1e293b] rounded-2xl shadow-2xl border border-[#314368] overflow-hidden animate-in zoom-in-95 duration-300"
                data-testid="success-modal"
            >
                {/* Success Icon & Title */}
                <div className="pt-12 pb-8 flex flex-col items-center px-6">
                    <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
                        <span className="material-symbols-outlined text-4xl fill-1">check_circle</span>
                    </div>
                    <h1 className="text-white text-2xl font-bold text-center" data-testid="success-modal-title">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-[#8fa6cc] text-sm mt-2" data-testid="success-modal-subtitle">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Recipient & Amount Card OR Balance Card */}
                <div className="px-6 pb-6">
                    <div className="bg-[#101623] rounded-xl p-8 flex flex-col items-center border border-[#314368]">
                        {recipient ? (
                            <>
                                <div
                                    className="w-16 h-16 rounded-full bg-cover bg-center mb-4 border-2 border-[#314368]"
                                    style={{
                                        backgroundImage: recipient.avatar
                                            ? `url('${recipient.avatar}')`
                                            : defaultAvatar,
                                    }}
                                    data-testid="success-modal-recipient-avatar"
                                />
                                <p
                                    className="text-[#8fa6cc] text-xs uppercase tracking-wider font-medium mb-3"
                                    data-testid="success-modal-recipient-name"
                                >
                                    Sent to {recipient.name}
                                </p>
                            </>
                        ) : balanceLabel ? (
                            <p className="text-[#8fa6cc] text-xs font-semibold uppercase tracking-widest mb-2">
                                {balanceLabel}
                            </p>
                        ) : null}

                        {balanceValue !== undefined && !recipient ? (
                            <p
                                className="text-white tracking-tight text-4xl font-bold leading-none"
                                data-testid="success-modal-balance"
                            >
                                ${balanceValue.toFixed(2)}
                            </p>
                        ) : (
                            <p
                                className="text-white text-5xl font-bold leading-tight"
                                data-testid="success-modal-amount"
                            >
                                ${amount}{' '}
                                <span className="text-xl font-medium text-[#8fa6cc]">{currency}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Transaction Details */}
                {details.length > 0 && (
                    <div className="px-6 py-4 space-y-0" data-testid="success-modal-details">
                        {details.map((detail, index) => (
                            <div
                                key={detail.label}
                                className={`flex justify-between items-center py-4 ${index < details.length - 1 ? 'border-b border-[#314368]' : ''
                                    }`}
                                data-testid={`success-modal-detail-${index}`}
                            >
                                <p className="text-[#8fa6cc] text-sm">{detail.label}</p>
                                <div className="flex items-center gap-2">
                                    {detail.icon && (
                                        <span className="material-symbols-outlined text-[#8fa6cc] text-[20px]">
                                            {detail.icon}
                                        </span>
                                    )}
                                    <p
                                        className={`text-sm ${detail.copyable ? 'font-mono' : ''
                                            } text-white`}
                                    >
                                        {detail.value}
                                    </p>
                                    {detail.copyable && (
                                        <button
                                            onClick={() => handleCopy(detail.value, detail.label)}
                                            className="text-[#8fa6cc] hover:text-white transition-colors p-1"
                                            aria-label={`Copy ${detail.label}`}
                                            data-testid={`copy-button-${index}`}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                {copiedId === detail.label ? 'check' : 'content_copy'}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="p-6 pt-4 flex flex-col gap-3">
                    <button
                        onClick={primaryAction.onClick}
                        className="w-full flex items-center justify-center h-12 bg-primary text-white rounded-xl font-semibold hover:bg-[#2563eb] transition-all shadow-lg shadow-primary/20"
                        data-testid="success-modal-primary-action"
                    >
                        {primaryAction.label}
                    </button>
                    {secondaryAction && (
                        <button
                            onClick={secondaryAction.onClick}
                            className="w-full flex items-center justify-center h-12 border border-[#314368] text-white rounded-xl font-medium hover:bg-[#314368]/30 transition-all gap-2"
                            data-testid="success-modal-secondary-action"
                        >
                            {secondaryAction.icon && (
                                <span className="material-symbols-outlined text-[20px]">
                                    {secondaryAction.icon}
                                </span>
                            )}
                            {secondaryAction.label}
                        </button>
                    )}
                </div>

                {/* Footer */}
                {(footerText || footerLink) && (
                    <div className="bg-[#101623] py-4 text-center border-t border-[#314368]">
                        {footerText && (
                            <div
                                className="flex items-center justify-center gap-2 text-[11px] text-[#8fa6cc] uppercase tracking-wider font-medium"
                                data-testid="success-modal-footer-text"
                            >
                                <span className="material-symbols-outlined text-[16px]">shield</span>
                                {footerText}
                            </div>
                        )}
                        {footerLink && (
                            <p className="text-center text-[#64748B] text-xs mt-2">
                                <a
                                    className="text-[#3B82F6] hover:text-blue-400 hover:underline transition-colors"
                                    href={footerLink.href}
                                    data-testid="success-modal-footer-link"
                                >
                                    {footerLink.text}
                                </a>
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
