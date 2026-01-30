import { MODAL_TEXT, ICONS } from '../constants/text';

interface TopUpSuccessModalProps {
    isOpen: boolean;
    amount: string;
    currency: string;
    newBalance: number;
    paymentMethod: string;
    transactionId: string;
    onClose: () => void;
}

export const TopUpSuccessModal = ({
    isOpen,
    amount,
    currency,
    newBalance,
    paymentMethod,
    transactionId,
    onClose,
}: TopUpSuccessModalProps) => {
    const handleCopyTransactionId = () => {
        navigator.clipboard.writeText(transactionId);
    };

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            onClick={handleBackdropClick}
        >
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center opacity-40 blur-sm"
                    style={{
                        backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAXRHOtftHpTN8u8qIQek-30jW3gfh0Hpo_TffS17aZDHD-WlnaJzg6UwCjwMB_zz2ncFyn9nXjsXhc2bOaBkjDbmQcwSgdy-Oy0GO-GOw5X3xOFWH7lAlSpaCdXMnDN4ot1jdLh8HzgWqo9BOU6_9_abJ0oEEyu3A2NGAGgJU9T9qhWQNcNtdPDYZGKbcGfE9Xkz5dE1WdXFazpWIaTnFdPQhDi732z5Evy_d0jRPp_ED9Yz7Z8UAlQRKdLTsWMgPM0bpbxDjvZQ')",
                    }}
                ></div>
                <div className="absolute inset-0 bg-[#0F172A]/90"></div>
            </div>

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md px-4 animate-in zoom-in-95 duration-400">
                <div className="bg-white/5 backdrop-blur-xl border border-[#64748B]/30 rounded-xl shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-white/5">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#13ec80] to-transparent opacity-70"></div>

                    <div className="p-8 flex flex-col items-center">
                        {/* Success Icon */}
                        <div className="mb-6 relative group">
                            <div className="absolute inset-0 bg-[#13ec80]/20 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative bg-[#0F172A]/80 rounded-full p-2 border border-[#13ec80]/30 shadow-lg">
                                <span
                                    className="material-symbols-outlined text-6xl text-[#13ec80]"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    {ICONS.CHECK_CIRCLE}
                                </span>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-white text-[28px] font-bold leading-tight text-center mb-2 tracking-tight">
                            {MODAL_TEXT.FUNDS_ADDED}
                        </h2>
                        <p className="text-[#64748B] text-base font-normal leading-normal text-center mb-8">
                            {MODAL_TEXT.WALLET_TOPPED_UP}
                        </p>

                        {/* Updated Balance */}
                        <div className="w-full bg-black/20 border border-[#64748B]/20 rounded-lg p-5 flex flex-col items-center justify-center mb-8 shadow-inner">
                            <p className="text-[#64748B] text-xs font-semibold uppercase tracking-widest mb-2">
                                {MODAL_TEXT.UPDATED_BALANCE}
                            </p>
                            <p className="text-white tracking-tight text-4xl font-bold leading-none">
                                ${newBalance.toFixed(2)}
                            </p>
                        </div>

                        {/* Transaction Details */}
                        <div className="w-full space-y-1 mb-8">
                            {/* Top Up Amount */}
                            <div className="flex justify-between items-center py-3 border-b border-dashed border-[#64748B]/20">
                                <p className="text-[#64748B] text-sm font-normal">{MODAL_TEXT.TOP_UP_AMOUNT}</p>
                                <p className="text-[#13ec80] text-sm font-semibold">
                                    + ${amount} {currency}
                                </p>
                            </div>

                            {/* Transaction ID */}
                            <div className="flex justify-between items-center py-3 border-b border-dashed border-[#64748B]/20">
                                <p className="text-[#64748B] text-sm font-normal">{MODAL_TEXT.TRANSACTION_ID}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-white text-sm font-mono tracking-wide">{transactionId}</p>
                                    <button
                                        onClick={handleCopyTransactionId}
                                        aria-label={MODAL_TEXT.COPY_ID_ARIA}
                                        className="text-[#64748B] hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">{ICONS.CONTENT_COPY}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="flex justify-between items-center py-3 border-b border-dashed border-[#64748B]/20">
                                <p className="text-[#64748B] text-sm font-normal">{MODAL_TEXT.PAYMENT_METHOD}</p>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-white text-sm">{ICONS.CREDIT_CARD}</span>
                                    <p className="text-white text-sm">{paymentMethod}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button className="flex-1 h-12 rounded-lg border border-[#64748B] text-slate-300 text-sm font-medium hover:bg-white/5 hover:text-white hover:border-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500/50">
                                {MODAL_TEXT.VIEW_RECEIPT}
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 h-12 rounded-lg bg-[#3B82F6] text-white text-sm font-bold hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-center gap-2 group"
                            >
                                <span>{MODAL_TEXT.DONE}</span>
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">
                                    {ICONS.ARROW_FORWARD}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Support Link */}
                <p className="text-center text-[#64748B] text-xs mt-6">
                    {MODAL_TEXT.NEED_HELP}{' '}
                    <a
                        className="text-[#3B82F6] hover:text-blue-400 hover:underline transition-colors"
                        href="#"
                    >
                        {MODAL_TEXT.CONTACT_SUPPORT}
                    </a>
                </p>
            </div>
        </div>
    );
};
