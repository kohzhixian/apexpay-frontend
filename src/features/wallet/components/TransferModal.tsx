import { useState, useEffect, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../../components/ui/Modal';
import { Alert } from '../../../components/ui/Alert';
import { TransferProcessingModal } from './TransferProcessingModal';
import { TransferSuccessModal } from './TransferSuccessModal';
import { TRANSFER_MODAL_TEXT, CURRENCY_OPTIONS } from '../constants/text';
import { createTransferSchema, type TransferFormData } from '../../../schemas';
import { positiveNumberHandlers } from '../../../utils/inputHelpers';
import { useGetContactsQuery } from '../../user/services/contactsApi';
import { useTransferMutation } from '../services/walletApi';
import type { WalletSummary, TransferResponse } from '../types';
import { CurrencyEnum } from '../types';

/** Avatar color options for contacts */
const AVATAR_COLORS = [
    'bg-indigo-600',
    'bg-blue-600',
    'bg-emerald-600',
    'bg-pink-600',
    'bg-orange-600',
    'bg-purple-600',
    'bg-teal-600',
    'bg-rose-600',
];

/**
 * Generates initials from a name
 * @param name - Full name to extract initials from
 * @returns Two-letter initials
 */
const getInitials = (name: string): string => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Generates a consistent avatar color based on contact ID
 * @param id - Contact ID to generate color for
 * @returns Tailwind background color class
 */
const getAvatarColor = (id: string): string => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

interface TransferModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when modal is closed */
    onClose: () => void;
    /** The source wallet for the transfer */
    sourceWallet: WalletSummary | null;
    /** All available wallets for selection */
    wallets: WalletSummary[];
    /** Callback when source wallet changes */
    onWalletChange?: (walletId: string) => void;
}

/**
 * Modal component for initiating fund transfers
 * Allows users to transfer funds from their wallet to another recipient
 */
export const TransferModal = ({
    isOpen,
    onClose,
    sourceWallet,
    wallets,
    onWalletChange,
}: TransferModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
    const [isContactsDropdownOpen, setIsContactsDropdownOpen] = useState(false);
    const [transferResult, setTransferResult] = useState<TransferResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Track completion conditions for hybrid approach (min time + API complete)
    const [isApiComplete, setIsApiComplete] = useState(false);
    const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);

    const contactsDropdownRef = useRef<HTMLDivElement>(null);

    /** Minimum time (ms) to show the processing modal for better UX */
    const MIN_PROCESSING_TIME_MS = 2000;

    // Fetch contacts from API
    const { data: contactsData, isLoading: isLoadingContacts } = useGetContactsQuery();
    const contacts = contactsData?.contacts ?? [];

    // Transfer mutation
    const [transfer] = useTransferMutation();

    const availableBalance = sourceWallet?.balance ?? 0;
    const transferSchema = createTransferSchema(availableBalance);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<TransferFormData>({
        resolver: zodResolver(transferSchema),
        defaultValues: {
            recipient: '',
            amount: '',
            note: '',
        },
        mode: 'onBlur',
    });

    const recipient = watch('recipient');
    const amount = watch('amount');

    /** Filtered contacts based on recipient input value */
    const filteredContacts = useMemo(() => {
        const query = (recipient || '').toLowerCase();
        return contacts.filter((contact) =>
            contact.username.toLowerCase().includes(query) ||
            contact.email.toLowerCase().includes(query)
        );
    }, [contacts, recipient]);

    // Reset form when modal opens (ensures clean state on re-open)
    useEffect(() => {
        if (isOpen) {
            reset({
                recipient: '',
                amount: '',
                note: '',
            });
            setIsWalletDropdownOpen(false);
            setIsContactsDropdownOpen(false);
            setErrorMessage(null);
            setTransferResult(null);
            setIsApiComplete(false);
            setIsMinTimeElapsed(false);
        }
    }, [isOpen, reset]);

    // Transition to success when both API and minimum time are complete
    useEffect(() => {
        if (isApiComplete && isMinTimeElapsed && isProcessing) {
            setIsProcessing(false);
            setShowSuccess(true);
            setIsApiComplete(false);
            setIsMinTimeElapsed(false);
        }
    }, [isApiComplete, isMinTimeElapsed, isProcessing]);

    // Close contacts dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contactsDropdownRef.current && !contactsDropdownRef.current.contains(event.target as Node)) {
                setIsContactsDropdownOpen(false);
            }
        };

        if (isContactsDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isContactsDropdownOpen]);

    /**
     * Handles modal close with form reset
     */
    const handleClose = () => {
        reset();
        setIsWalletDropdownOpen(false);
        setIsContactsDropdownOpen(false);
        setErrorMessage(null);
        setTransferResult(null);
        onClose();
    };

    /**
     * Handles form submission
     */
    const onSubmit = async (data: TransferFormData) => {
        if (!sourceWallet) return;

        setErrorMessage(null);
        setIsProcessing(true);
        setIsApiComplete(false);
        setIsMinTimeElapsed(false);

        // Start minimum time timer
        setTimeout(() => {
            setIsMinTimeElapsed(true);
        }, MIN_PROCESSING_TIME_MS);

        try {
            const result = await transfer({
                payerWalletId: sourceWallet.id,
                recipientEmail: data.recipient,
                amount: parseFloat(data.amount),
                currency: CurrencyEnum.SGD,
            }).unwrap();

            setTransferResult(result);
            // Mark API as complete - will transition to success when min time also elapses
            setIsApiComplete(true);
        } catch (error) {
            setIsProcessing(false);
            setIsApiComplete(false);
            setIsMinTimeElapsed(false);
            const errorMsg = error instanceof Error
                ? error.message
                : (error as { data?: { message?: string } })?.data?.message ?? 'Transfer failed. Please try again.';
            setErrorMessage(errorMsg);
        }
    };

    /**
     * Handles processing completion
     * Kept for backwards compatibility with TransferProcessingModal
     */
    const handleProcessingComplete = () => {
        // Transition is now handled by the useEffect watching isApiComplete and isMinTimeElapsed
    };

    /**
     * Handles success modal close
     */
    const handleSuccessClose = () => {
        setShowSuccess(false);
        handleClose();
    };

    /**
     * Handles wallet selection from dropdown
     */
    const handleWalletSelect = (walletId: string) => {
        onWalletChange?.(walletId);
        setIsWalletDropdownOpen(false);
    };

    /**
     * Handles contact selection from dropdown
     * Sets the recipient field to the selected contact's email
     */
    const handleContactSelect = (contact: { email: string }) => {
        reset({ ...watch(), recipient: contact.email });
        setIsContactsDropdownOpen(false);
    };

    /**
     * Formats currency amount for display
     */
    const formatCurrency = (value: number, currency: string): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        }).format(value);
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} maxWidth="md">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-blue-500 text-sm">bolt</span>
                            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                                {TRANSFER_MODAL_TEXT.STEP_INDICATOR}
                            </span>
                        </div>
                        <h1 className="text-white text-2xl font-bold leading-tight">
                            {TRANSFER_MODAL_TEXT.TITLE}
                        </h1>
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
                <div className="p-8 space-y-6">
                    {/* Error Alert */}
                    {errorMessage && (
                        <Alert
                            variant="error"
                            title={TRANSFER_MODAL_TEXT.TRANSFER_FAILED}
                            message={errorMessage}
                            onDismiss={() => setErrorMessage(null)}
                        />
                    )}

                    <form id="transfer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Source Wallet Selector */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 ml-1">
                                {TRANSFER_MODAL_TEXT.SOURCE_WALLET_LABEL}
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                                    className="w-full group bg-gradient-to-r from-blue-500/10 to-slate-700/50 border border-blue-500/30 hover:border-blue-500/60 rounded-xl p-4 flex items-center justify-between transition-all outline-none text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-500/20 p-2 rounded-lg">
                                            <span className="material-symbols-outlined text-blue-500">
                                                account_balance_wallet
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">
                                                {sourceWallet?.name ?? TRANSFER_MODAL_TEXT.SELECT_WALLET}
                                            </p>
                                            <p className="text-xs text-blue-500/80 font-medium">
                                                {sourceWallet
                                                    ? `${formatCurrency(sourceWallet.balance, sourceWallet.currency)} ${TRANSFER_MODAL_TEXT.AVAILABLE_SUFFIX}`
                                                    : TRANSFER_MODAL_TEXT.NO_WALLET_SELECTED}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {wallets.length > 1 && (
                                            <span className="text-[10px] uppercase font-bold text-blue-500 tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">
                                                {TRANSFER_MODAL_TEXT.CHANGE_WALLET}
                                            </span>
                                        )}
                                        <span className="material-symbols-outlined text-slate-400 text-lg group-hover:text-white">
                                            expand_more
                                        </span>
                                    </div>
                                </button>

                                {/* Wallet Dropdown */}
                                {isWalletDropdownOpen && wallets.length > 1 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-10 shadow-xl">
                                        {wallets.map((wallet) => (
                                            <button
                                                key={wallet.id}
                                                type="button"
                                                onClick={() => handleWalletSelect(wallet.id)}
                                                className={`w-full p-4 flex items-center gap-4 hover:bg-slate-700/50 transition-colors text-left ${wallet.id === sourceWallet?.id ? 'bg-blue-500/10' : ''
                                                    }`}
                                            >
                                                <div className="bg-blue-500/20 p-2 rounded-lg">
                                                    <span className="material-symbols-outlined text-blue-500">
                                                        account_balance_wallet
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white font-medium">{wallet.name}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {formatCurrency(wallet.balance, wallet.currency)}
                                                    </p>
                                                </div>
                                                {wallet.id === sourceWallet?.id && (
                                                    <span className="material-symbols-outlined text-blue-500">check</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recipient Field - Search Dropdown */}
                        <div className="space-y-2" ref={contactsDropdownRef}>
                            <label className="text-sm font-medium text-slate-400 ml-1">
                                {TRANSFER_MODAL_TEXT.RECIPIENT_LABEL}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-lg">
                                        alternate_email
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    placeholder={TRANSFER_MODAL_TEXT.RECIPIENT_PLACEHOLDER}
                                    className={`w-full bg-white/5 border ${errors.recipient ? 'border-red-500' : 'border-white/10 focus:border-blue-500'
                                        } focus:ring-1 focus:ring-blue-500 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 transition-all outline-none`}
                                    {...register('recipient')}
                                    onFocus={() => setIsContactsDropdownOpen(true)}
                                    autoComplete="off"
                                />

                                {/* Contacts Dropdown */}
                                {isContactsDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-20 shadow-xl">
                                        <div className="max-h-[156px] overflow-y-auto scrollbar-hide">
                                            {isLoadingContacts ? (
                                                <div className="p-4 text-center text-slate-400 text-sm">
                                                    {TRANSFER_MODAL_TEXT.LOADING_CONTACTS}
                                                </div>
                                            ) : filteredContacts.length > 0 ? (
                                                filteredContacts.map((contact) => (
                                                    <button
                                                        key={contact.contactId}
                                                        type="button"
                                                        onClick={() => handleContactSelect(contact)}
                                                        className="w-full p-3 flex items-center gap-3 hover:bg-slate-700/50 transition-colors text-left"
                                                    >
                                                        <div className={`w-8 h-8 rounded-full ${getAvatarColor(contact.contactId)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                                            {getInitials(contact.username)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-white truncate">{contact.username}</p>
                                                            <p className="text-xs text-slate-400 truncate">{contact.email}</p>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-slate-400 text-sm">
                                                    {TRANSFER_MODAL_TEXT.NO_CONTACTS_FOUND}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {errors.recipient && (
                                <p className="text-red-400 text-xs ml-1">{errors.recipient.message}</p>
                            )}
                        </div>

                        {/* Amount and Currency */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">
                                    {TRANSFER_MODAL_TEXT.AMOUNT_LABEL}
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder={TRANSFER_MODAL_TEXT.AMOUNT_PLACEHOLDER}
                                    {...positiveNumberHandlers}
                                    className={`w-full bg-white/5 border ${errors.amount ? 'border-red-500' : 'border-white/10 focus:border-blue-500'
                                        } focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-white text-xl font-bold placeholder:text-slate-500 transition-all outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                    {...register('amount')}
                                />
                                {errors.amount && (
                                    <p className="text-red-400 text-xs ml-1">{errors.amount.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">
                                    {TRANSFER_MODAL_TEXT.CURRENCY_LABEL}
                                </label>
                                <div className="relative">
                                    <select
                                        disabled
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-[15px] px-4 text-white transition-all outline-none appearance-none disabled:opacity-70"
                                    >
                                        {CURRENCY_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value} className="bg-slate-800">
                                                {option.value}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                    <button
                        type="submit"
                        form="transfer-form"
                        disabled={!sourceWallet}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {TRANSFER_MODAL_TEXT.CONFIRM_TRANSFER}
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-none bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-xl transition-all border border-white/10"
                    >
                        {TRANSFER_MODAL_TEXT.CANCEL}
                    </button>
                </div>

                {/* Security Footer */}
                <div className="pb-6 text-center">
                    <div className="inline-flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                        {TRANSFER_MODAL_TEXT.ENCRYPTED_TRANSFER}
                    </div>
                </div>
            </Modal>

            {/* Processing Modal */}
            <TransferProcessingModal
                isOpen={isProcessing}
                amount={amount || '0.00'}
                currency={sourceWallet?.currency ?? 'SGD'}
                recipient={recipient || 'Recipient'}
                onComplete={handleProcessingComplete}
            />

            {/* Success Modal */}
            <TransferSuccessModal
                isOpen={showSuccess}
                amount={transferResult?.amount?.toString() ?? '0.00'}
                currency={sourceWallet?.currency ?? 'SGD'}
                recipient={transferResult?.recipientName ?? recipient ?? 'Recipient'}
                transactionReference={transferResult?.payerTransactionReference ?? ''}
                timestamp={transferResult?.timestamp ?? new Date().toISOString()}
                paymentMethod={transferResult?.paymentMethod ?? ''}
                onClose={handleSuccessClose}
            />
        </>
    );
};
