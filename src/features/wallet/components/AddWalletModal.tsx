import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import type { CreateWalletFormData } from '../types';
import { ADD_WALLET_MODAL_TEXT, CURRENCY_OPTIONS } from '../constants/text';
import { positiveNumberHandlers } from '../../../utils/inputHelpers';

interface AddWalletModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when modal is closed */
    onClose: () => void;
    /** Callback when wallet is created */
    onCreateWallet: (data: CreateWalletFormData) => void;
    /** Loading state for create action */
    isCreating?: boolean;
}

/**
 * Modal component for adding a new wallet
 * Single-step form with wallet configuration fields
 */
export const AddWalletModal = ({
    isOpen,
    onClose,
    onCreateWallet,
    isCreating = false,
}: AddWalletModalProps) => {
    const [formData, setFormData] = useState<CreateWalletFormData>({
        name: '',
        currency: 'SGD',
        initialBalance: 0,
    });

    /**
     * Resets form state when modal closes
     */
    const handleClose = () => {
        setFormData({
            name: '',
            currency: 'SGD',
            initialBalance: 0,
        });
        onClose();
    };

    /**
     * Handles form field changes
     */
    const handleInputChange = (
        field: keyof CreateWalletFormData,
        value: string | number
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    /**
     * Validates form data
     */
    const isFormValid = () => {
        return formData.name.trim().length > 0;
    };

    /**
     * Handles wallet creation
     */
    const handleCreateWallet = () => {
        if (isFormValid()) {
            onCreateWallet(formData);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} maxWidth="md">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-500">
                        <span className="material-symbols-outlined text-xl">
                            account_balance_wallet
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white leading-none">
                            {ADD_WALLET_MODAL_TEXT.TITLE}
                        </h2>
                        <p className="text-slate-400 text-xs mt-1">
                            {ADD_WALLET_MODAL_TEXT.SUBTITLE}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label="Close modal"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            {/* Body */}
            <div className="p-8">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {/* Wallet Name */}
                    <div className="space-y-2">
                        <label
                            className="block text-sm font-semibold text-slate-300"
                            htmlFor="wallet-name"
                        >
                            {ADD_WALLET_MODAL_TEXT.WALLET_NAME_LABEL}
                        </label>
                        <input
                            id="wallet-name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder={ADD_WALLET_MODAL_TEXT.WALLET_NAME_PLACEHOLDER}
                            className="bg-white/5 border border-white/10 text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 placeholder:text-slate-500"
                        />
                    </div>

                    {/* Currency */}
                    <div className="space-y-2">
                        <label
                            className="block text-sm font-semibold text-slate-300"
                            htmlFor="currency"
                        >
                            {ADD_WALLET_MODAL_TEXT.CURRENCY_LABEL}
                        </label>
                        <div className="relative">
                            <select
                                id="currency"
                                value={formData.currency}
                                onChange={(e) => handleInputChange('currency', e.target.value)}
                                className="bg-white/5 border border-white/10 text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 pr-10 appearance-none"
                            >
                                {CURRENCY_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                        className="bg-slate-800"
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">
                                expand_more
                            </span>
                        </div>
                    </div>

                    {/* Initial Balance */}
                    <div className="space-y-2">
                        <label
                            className="block text-sm font-semibold text-slate-300"
                            htmlFor="initial-balance"
                        >
                            {ADD_WALLET_MODAL_TEXT.INITIAL_BALANCE_LABEL}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 font-medium">$</span>
                            </div>
                            <input
                                id="initial-balance"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.initialBalance || ''}
                                onChange={(e) =>
                                    handleInputChange(
                                        'initialBalance',
                                        parseFloat(e.target.value) || 0
                                    )
                                }
                                {...positiveNumberHandlers}
                                placeholder={ADD_WALLET_MODAL_TEXT.INITIAL_BALANCE_PLACEHOLDER}
                                className="bg-white/5 border border-white/10 text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 pl-8 placeholder:text-slate-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/5 border-t border-white/10 flex items-center justify-between">
                <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-xl text-slate-400 font-semibold hover:bg-white/5 transition-all"
                >
                    {ADD_WALLET_MODAL_TEXT.CANCEL}
                </button>
                <button
                    onClick={handleCreateWallet}
                    disabled={!isFormValid() || isCreating}
                    className="bg-blue-500 hover:bg-blue-600 px-8 py-2.5 rounded-xl text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        {isCreating ? 'progress_activity' : 'add_circle'}
                    </span>
                    {isCreating ? 'Creating...' : ADD_WALLET_MODAL_TEXT.CREATE_WALLET}
                </button>
            </div>
        </Modal>
    );
};
