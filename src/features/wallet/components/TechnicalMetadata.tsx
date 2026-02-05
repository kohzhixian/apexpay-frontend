import { useState } from 'react';
import { WALLET_DETAILS_TEXT, DYNAMIC_TEXT } from '../constants/text';
import { formatDate } from '../utils/formatters';

interface TechnicalMetadataProps {
    /** Ledger address (truncated for display) */
    ledgerAddress: string;
    /** Wallet creation date (ISO string) */
    creationDate: string;
    /** Wallet type label */
    walletType: string;
    /** Whether 2FA is enabled */
    is2FAEnabled: boolean;
    /** Whether cold storage is enabled */
    isColdStorage: boolean;
}

/**
 * Technical metadata section showing wallet details
 * Includes ledger address with copy functionality
 */
export const TechnicalMetadata = ({
    ledgerAddress,
    creationDate,
    walletType,
    is2FAEnabled,
    isColdStorage,
}: TechnicalMetadataProps) => {
    const [isCopied, setIsCopied] = useState(false);

    /**
     * Copies ledger address to clipboard
     */
    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText(ledgerAddress);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy address:', error);
        }
    };

    /**
     * Truncates address for display
     */
    const truncatedAddress = DYNAMIC_TEXT.TRUNCATED_ADDRESS(ledgerAddress);

    return (
        <section className="bg-[#161E2C] border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-base text-white mb-4">
                {WALLET_DETAILS_TEXT.TECHNICAL_METADATA}
            </h3>

            <div className="space-y-4">
                {/* Ledger Address */}
                <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">
                        {WALLET_DETAILS_TEXT.LEDGER_ADDRESS}
                    </label>
                    <div className="flex items-center gap-2 p-2.5 bg-slate-800/50 rounded-lg border border-slate-700 font-mono text-xs">
                        <span className="text-slate-400 truncate">
                            {truncatedAddress}
                        </span>
                        <button
                            onClick={handleCopyAddress}
                            className="ml-auto p-1 hover:bg-slate-700 rounded transition-colors flex-shrink-0"
                            aria-label="Copy ledger address"
                        >
                            <span className="material-symbols-outlined text-sm text-slate-400">
                                {isCopied ? 'check' : 'content_copy'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Creation Date & Wallet Type */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1 block">
                            {WALLET_DETAILS_TEXT.CREATION_DATE}
                        </label>
                        <div className="font-medium text-sm text-white">
                            {formatDate(creationDate)}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1 block">
                            {WALLET_DETAILS_TEXT.WALLET_TYPE}
                        </label>
                        <div className="font-medium text-sm text-white flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            {walletType}
                        </div>
                    </div>
                </div>

                {/* Security Features */}
                <div className="pt-3 border-t border-slate-800">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
                        {WALLET_DETAILS_TEXT.SECURITY_FEATURES}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {is2FAEnabled && (
                            <span className="px-2.5 py-1 bg-slate-800 rounded-md text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-xs text-green-500">
                                    verified_user
                                </span>
                                {WALLET_DETAILS_TEXT.TWO_FA_ENABLED}
                            </span>
                        )}
                        {isColdStorage && (
                            <span className="px-2.5 py-1 bg-slate-800 rounded-md text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-xs text-green-500">
                                    lock
                                </span>
                                {WALLET_DETAILS_TEXT.COLD_STORAGE}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
