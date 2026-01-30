import { MODAL_TEXT, ICONS } from '../constants/text';

interface TransferSuccessModalProps {
    isOpen: boolean;
    amount: string;
    currency: string;
    recipient: string;
    recipientAvatar?: string;
    transactionHash: string;
    timestamp: string;
    onClose: () => void;
}

export const TransferSuccessModal = ({
    isOpen,
    amount,
    currency,
    recipient,
    recipientAvatar,
    transactionHash,
    timestamp,
    onClose,
}: TransferSuccessModalProps) => {
    const handleCopyHash = () => {
        navigator.clipboard.writeText(transactionHash);
    };

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            {/* Main Modal */}
            <div className="relative w-full max-w-[520px] bg-[#1e293b] rounded-2xl shadow-2xl border border-[#314368] overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Success Icon & Title */}
                <div className="pt-12 pb-8 flex flex-col items-center px-6">
                    <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
                        <span className="material-symbols-outlined text-4xl fill-1">{ICONS.CHECK_CIRCLE}</span>
                    </div>
                    <h1 className="text-white text-2xl font-bold text-center">
                        {MODAL_TEXT.TRANSFER_SUCCESSFUL}
                    </h1>
                    <p className="text-[#8fa6cc] text-sm mt-2">{MODAL_TEXT.TRANSACTION_COMPLETED}</p>
                </div>

                {/* Recipient & Amount Card */}
                <div className="px-6 pb-6">
                    <div className="bg-[#101623] rounded-xl p-8 flex flex-col items-center border border-[#314368]">
                        <div
                            className="w-16 h-16 rounded-full bg-cover bg-center mb-4 border-2 border-[#314368]"
                            style={{
                                backgroundImage: recipientAvatar
                                    ? `url('${recipientAvatar}')`
                                    : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAiUCpEoe65uAenGOVq1jFR70HAhcBjnEPy3yCF41DoBXcro53lNhw2TfT5tS1jDOpLgfHP9Xh6ha6zIFHPKI8sxX0_T5JK_zHXgSshO6VshtEjb-p-SyK_vxIJz2JIi7wLitW_H7MiYKuEn75d_9w1Bx1FgjJMlUSLJysn01U1xH1uxOogN1cqAcDY9MDVl3vfgKFFSdDocSozdMauuLmvYs0wt1FQOHiDSq2MTzy_LGJoC6yx3O8svCSelpmrEy2e-X37ge3I0hQ')",
                            }}
                        ></div>
                        <p className="text-[#8fa6cc] text-xs uppercase tracking-wider font-medium mb-3">
                            {MODAL_TEXT.SENT_TO} {recipient}
                        </p>
                        <p className="text-white text-5xl font-bold leading-tight">
                            ${amount}{' '}
                            <span className="text-xl font-medium text-[#8fa6cc]">{currency}</span>
                        </p>
                    </div>
                </div>

                {/* Transaction Details */}
                <div className="px-6 py-4 space-y-0">
                    {/* Transaction Hash */}
                    <div className="flex justify-between items-center py-4 border-b border-[#314368]">
                        <p className="text-[#8fa6cc] text-sm">{MODAL_TEXT.TRANSACTION_HASH}</p>
                        <div className="flex items-center gap-2">
                            <p className="text-white text-sm font-mono">{transactionHash}</p>
                            <button
                                onClick={handleCopyHash}
                                className="text-[#8fa6cc] hover:text-white transition-colors p-1"
                            >
                                <span className="material-symbols-outlined text-[18px]">{ICONS.CONTENT_COPY}</span>
                            </button>
                        </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex justify-between items-center py-4 border-b border-[#314368]">
                        <p className="text-[#8fa6cc] text-sm">{MODAL_TEXT.TIMESTAMP}</p>
                        <p className="text-white text-sm">{timestamp}</p>
                    </div>

                    {/* Payment Method */}
                    <div className="flex justify-between items-center py-4 border-b border-[#314368]">
                        <p className="text-[#8fa6cc] text-sm">{MODAL_TEXT.PAYMENT_METHOD}</p>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#8fa6cc] text-[20px]">
                                {ICONS.ACCOUNT_BALANCE_WALLET}
                            </span>
                            <p className="text-white text-sm">{MODAL_TEXT.APEX_WALLET(currency)}</p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between items-center py-4">
                        <p className="text-[#8fa6cc] text-sm">{MODAL_TEXT.STATUS}</p>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <div className="size-2 rounded-full bg-emerald-500"></div>
                            <p className="text-emerald-500 text-xs font-bold uppercase tracking-wide">
                                {MODAL_TEXT.COMPLETED}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 pt-4 flex flex-col gap-3">
                    <button
                        onClick={onClose}
                        className="w-full flex items-center justify-center h-12 bg-primary text-white rounded-xl font-semibold hover:bg-[#2563eb] transition-all shadow-lg shadow-primary/20"
                    >
                        {MODAL_TEXT.BACK_TO_DASHBOARD}
                    </button>
                    <button className="w-full flex items-center justify-center h-12 border border-[#314368] text-white rounded-xl font-medium hover:bg-[#314368]/30 transition-all gap-2">
                        <span className="material-symbols-outlined text-[20px]">{ICONS.DOWNLOAD}</span>
                        {MODAL_TEXT.DOWNLOAD_RECEIPT}
                    </button>
                </div>

                {/* Footer */}
                <div className="bg-[#101623] py-4 text-center border-t border-[#314368]">
                    <div className="flex items-center justify-center gap-2 text-[11px] text-[#8fa6cc] uppercase tracking-wider font-medium">
                        <span className="material-symbols-outlined text-[16px]">{ICONS.SHIELD}</span>
                        {MODAL_TEXT.ENCRYPTED_TRANSACTION}
                    </div>
                </div>
            </div>
        </div>
    );
};
