import { PaymentDevToolsText } from '../constants';
import type { GetWalletResponse } from '../../wallet/types';

interface InitiatePaymentPanelProps {
    wallets: GetWalletResponse[];
    selectedWalletId: string;
    onWalletChange: (walletId: string) => void;
    amount: string;
    onAmountChange: (amount: string) => void;
    clientRequestId: string;
    onRefreshRequestId: () => void;
    onCreateIntent: () => void;
    onProcessPayment: () => void;
    isPaymentInitiated: boolean;
    isProcessing: boolean;
    /** Whether the current payment flow is complete (SUCCESS, FAILED, REFUNDED) */
    isPaymentComplete: boolean;
    /** Whether the initiate API call is in progress */
    isInitiating: boolean;
}

/**
 * Panel 1: Initiate Payment - Source wallet, amount, currency, and action buttons
 */
export const InitiatePaymentPanel = ({
    wallets,
    selectedWalletId,
    onWalletChange,
    amount,
    onAmountChange,
    clientRequestId,
    onRefreshRequestId,
    onCreateIntent,
    onProcessPayment,
    isPaymentInitiated,
    isProcessing,
    isPaymentComplete,
    isInitiating,
}: InitiatePaymentPanelProps) => {
    const selectedWallet = wallets.find(w => w.walletId === selectedWalletId);

    // Disable create intent button only when payment is initiated but not yet complete
    const isCreateIntentDisabled = isInitiating || (isPaymentInitiated && !isPaymentComplete);

    return (
        <div className="bg-[#0d1117] border border-slate-700/50 rounded-xl p-4 flex flex-col gap-3">
            {/* Panel Header */}
            <div className="flex items-center gap-2">
                <span className="text-blue-400 font-mono text-sm">1</span>
                <h3 className="text-white font-semibold text-sm">{PaymentDevToolsText.PANEL1_TITLE}</h3>
            </div>

            {/* Source Wallet */}
            <div className="flex flex-col gap-1">
                <label className="text-slate-400 text-xs font-medium tracking-wider">
                    {PaymentDevToolsText.SOURCE_WALLET_LABEL}
                </label>
                <div className="relative">
                    <select
                        value={selectedWalletId}
                        onChange={(e) => onWalletChange(e.target.value)}
                        className="w-full bg-[#161b22] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                        {wallets.map((wallet) => (
                            <option key={wallet.walletId} value={wallet.walletId}>
                                {wallet.name} (***{wallet.walletId.slice(-4)})
                            </option>
                        ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
                        unfold_more
                    </span>
                </div>
                {selectedWallet && (
                    <p className="text-slate-400 text-xs">
                        {PaymentDevToolsText.AVAILABLE_BALANCE_PREFIX} <span className="text-white">${selectedWallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </p>
                )}
            </div>

            {/* Amount & Currency */}
            <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-slate-400 text-xs font-medium tracking-wider">
                        {PaymentDevToolsText.AMOUNT_LABEL}
                    </label>
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => onAmountChange(e.target.value)}
                        placeholder={PaymentDevToolsText.AMOUNT_PLACEHOLDER}
                        className="w-full bg-[#161b22] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
                <div className="w-24 flex flex-col gap-1">
                    <label className="text-slate-400 text-xs font-medium tracking-wider">
                        {PaymentDevToolsText.CURRENCY_LABEL}
                    </label>
                    <div className="bg-[#161b22] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm">
                        {PaymentDevToolsText.CURRENCY_SGD}
                    </div>
                </div>
            </div>

            {/* Client Request ID */}
            <div className="flex flex-col gap-1">
                <label className="text-slate-400 text-xs font-medium tracking-wider">
                    {PaymentDevToolsText.CLIENT_REQUEST_ID_LABEL}
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={clientRequestId}
                        readOnly
                        className="flex-1 bg-[#161b22] border border-slate-700 rounded-lg px-3 py-2 text-slate-400 font-mono text-xs focus:outline-none"
                    />
                    <button
                        onClick={onRefreshRequestId}
                        className="p-2 bg-[#161b22] border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                        aria-label={PaymentDevToolsText.REFRESH_REQUEST_ID_LABEL}
                    >
                        <span className="material-symbols-outlined text-lg">refresh</span>
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-1">
                <button
                    onClick={onCreateIntent}
                    disabled={isCreateIntentDisabled}
                    className={`w-full font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm ${isCreateIntentDisabled
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                >
                    {isInitiating ? PaymentDevToolsText.CREATING_BUTTON : PaymentDevToolsText.CREATE_INTENT_BUTTON}
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>

                {isPaymentInitiated && !isPaymentComplete && (
                    <button
                        onClick={onProcessPayment}
                        disabled={isProcessing}
                        className={`w-full font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm ${isProcessing
                            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                    >
                        {isProcessing ? PaymentDevToolsText.PROCESSING_BUTTON : PaymentDevToolsText.PROCESS_PAYMENT_BUTTON}
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                )}
            </div>
        </div>
    );
};
