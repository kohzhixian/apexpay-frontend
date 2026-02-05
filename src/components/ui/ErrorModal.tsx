interface ErrorDetail {
    /** Label for the detail row */
    label: string;
    /** Value to display */
    value: string;
    /** Currency code (optional) */
    currency?: string;
    /** Optional icon name */
    icon?: string;
}

interface ErrorModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when modal is closed */
    onClose: () => void;
    /** Modal title */
    title: string;
    /** Modal subtitle/description */
    subtitle?: string;
    /** Optional error details to display */
    details?: ErrorDetail[];
    /** Primary action button config (e.g., "Try Again") */
    primaryAction?: {
        label: string;
        onClick: () => void;
    };
    /** Secondary action button config (e.g., "Close") */
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
    /** Optional footer text */
    footerText?: string;
    /** Optional support link */
    supportLink?: {
        text: string;
        href: string;
    };
}

/**
 * A reusable error modal component for displaying transaction failures.
 * Features glassmorphism design with error styling.
 */
export const ErrorModal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    details,
    primaryAction,
    secondaryAction,
    footerText,
    supportLink,
}: ErrorModalProps) => {
    /**
     * Handles backdrop click to close modal
     */
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
            data-testid="error-modal-backdrop"
        >
            {/* Main Modal */}
            <div
                className="max-w-md w-full bg-[#0F172A]/90 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200"
                data-testid="error-modal"
            >
                {/* Content */}
                <div className="p-8 flex flex-col items-center text-center">
                    {/* Error Icon with Glow */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                        <div className="relative w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-red-500 text-5xl">
                                error_outline
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <h2
                        className="text-2xl font-bold text-white mb-3 tracking-tight"
                        data-testid="error-modal-title"
                    >
                        {title}
                    </h2>

                    {/* Subtitle */}
                    {subtitle && (
                        <p
                            className="text-slate-400 text-base leading-relaxed mb-8 max-w-[320px]"
                            data-testid="error-modal-subtitle"
                        >
                            {subtitle}
                        </p>
                    )}

                    {/* Details Card */}
                    {details && details.length > 0 && (
                        <div className="w-full space-y-3 mb-8" data-testid="error-modal-details">
                            {details.map((detail, index) => (
                                <div
                                    key={detail.label}
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between"
                                    data-testid={`error-modal-detail-${index}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {detail.icon && (
                                            <span className="material-symbols-outlined text-slate-500 text-xl">
                                                {detail.icon}
                                            </span>
                                        )}
                                        <span className="text-sm font-medium text-slate-400">
                                            {detail.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg font-bold text-white">
                                            {detail.value}
                                        </span>
                                        {detail.currency && (
                                            <span className="text-xs font-semibold text-slate-500 mt-0.5">
                                                {detail.currency}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="w-full space-y-3">
                        {primaryAction && (
                            <button
                                onClick={primaryAction.onClick}
                                className="w-full py-3.5 px-6 bg-primary hover:bg-blue-600 text-white font-semibold rounded-full transition-all duration-200 shadow-lg shadow-blue-500/25 active:scale-[0.98]"
                                data-testid="error-modal-primary-action"
                            >
                                {primaryAction.label}
                            </button>
                        )}
                        {secondaryAction && (
                            <button
                                onClick={secondaryAction.onClick}
                                className="w-full py-3.5 px-6 bg-transparent hover:bg-slate-800 text-slate-400 font-semibold border border-slate-700 rounded-full transition-all duration-200 active:scale-[0.98]"
                                data-testid="error-modal-secondary-action"
                            >
                                {secondaryAction.label}
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {(footerText || supportLink) && (
                    <div className="bg-slate-900/50 border-t border-slate-800 py-4 text-center">
                        <p
                            className="text-sm text-slate-500"
                            data-testid="error-modal-footer"
                        >
                            {footerText}{' '}
                            {supportLink && (
                                <a
                                    href={supportLink.href}
                                    className="text-primary hover:underline font-medium"
                                >
                                    {supportLink.text}
                                </a>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
