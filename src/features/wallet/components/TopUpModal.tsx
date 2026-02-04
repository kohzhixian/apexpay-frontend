import { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TopUpProcessingModal } from './TopUpProcessingModal';
import { TopUpSuccessModal } from './TopUpSuccessModal';
import { MODAL_TEXT, CURRENCIES, ICONS, TOP_UP_QUICK_AMOUNTS, PAYMENT_METHODS_TEXT } from '../constants/text';
import { AmountInput, Modal, ModalHeader, ModalBody, ModalFooter } from '../../../components/ui';
import { topUpSchema, type TopUpFormData } from '../../../schemas';
import { useTopUpWalletMutation, useGetWalletQuery } from '../services/walletApi';
import { useGetPaymentMethodsQuery } from '../../payment/services/paymentMethodApi';
import { PaymentMethodType } from '../../payment/types';
import type { CurrencyEnum } from '../types';
import { formatTransactionDateTime } from '../utils/formatters';

/** Minimum time (ms) to show the processing modal for better UX */
const MIN_PROCESSING_TIME_MS = 2000;

interface TopUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Optional wallet ID to top up - if not provided, uses first wallet */
    walletId?: string;
}

export const TopUpModal = ({ isOpen, onClose, walletId }: TopUpModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [newBalance, setNewBalance] = useState(0);
    const [transactionId, setTransactionId] = useState('');
    const [timestamp, setTimestamp] = useState('');

    // Track completion conditions for hybrid approach
    const [isApiComplete, setIsApiComplete] = useState(false);
    const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);

    // RTK Query hooks
    const { data: wallets } = useGetWalletQuery();
    const { data: paymentMethodsData, isLoading: isLoadingPaymentMethods } = useGetPaymentMethodsQuery();
    const [topUpWallet] = useTopUpWalletMutation();

    // Get the target wallet (provided walletId or first wallet)
    const targetWallet = walletId
        ? wallets?.find(w => w.walletId === walletId)
        : wallets?.[0];

    /**
     * Maps API payment methods to the UI format
     */
    const paymentMethods = useMemo(() => {
        if (!paymentMethodsData) return [];

        return paymentMethodsData.map((pm) => {
            const isCard = pm.type === PaymentMethodType.CARD;
            const expiryDisplay = pm.expiryMonth && pm.expiryYear
                ? `Expires ${String(pm.expiryMonth).padStart(2, '0')}/${String(pm.expiryYear).slice(-2)}`
                : '';
            const bankDisplay = pm.accountType && pm.last4
                ? `${pm.accountType} •••• ${pm.last4}`
                : '';

            return {
                id: pm.id,
                type: isCard ? 'card' as const : 'bank' as const,
                name: isCard
                    ? `${pm.brand || 'Card'} ending in ${pm.last4}`
                    : pm.bankName || pm.displayName,
                details: isCard ? expiryDisplay : bankDisplay,
                icon: isCard ? ICONS.CREDIT_CARD : ICONS.ACCOUNT_BALANCE,
                isDefault: pm.isDefault,
            };
        });
    }, [paymentMethodsData]);

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<TopUpFormData>({
        resolver: zodResolver(topUpSchema),
        defaultValues: {
            amount: '',
            currency: CURRENCIES.SGD,
            paymentMethodId: '',
        },
        mode: 'onBlur',
    });

    const amount = watch('amount');
    const currency = watch('currency');
    const selectedPaymentMethodId = watch('paymentMethodId');

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            reset();
            setIsApiComplete(false);
            setIsMinTimeElapsed(false);
        }
    }, [isOpen, reset]);

    // Set default payment method when modal opens and data is available
    useEffect(() => {
        if (isOpen && paymentMethods.length > 0) {
            const currentValue = selectedPaymentMethodId;
            // Only set if no payment method is selected
            if (!currentValue) {
                const defaultMethod = paymentMethods.find(pm => pm.isDefault) || paymentMethods[0];
                setValue('paymentMethodId', defaultMethod.id);
            }
        }
    }, [isOpen, paymentMethods, selectedPaymentMethodId, setValue]);

    // Transition to success when both API and minimum time are complete
    useEffect(() => {
        if (isApiComplete && isMinTimeElapsed && isProcessing) {
            setIsProcessing(false);
            setShowSuccess(true);
            setIsApiComplete(false);
            setIsMinTimeElapsed(false);
        }
    }, [isApiComplete, isMinTimeElapsed, isProcessing]);

    const handleQuickAmount = (value: number) => {
        setValue('amount', value.toString(), { shouldValidate: true });
    };

    const onSubmit = async (data: TopUpFormData) => {
        if (!targetWallet) {
            console.error('No wallet available for top up');
            return;
        }

        setIsProcessing(true);
        setIsApiComplete(false);
        setIsMinTimeElapsed(false);

        // Start minimum time timer
        setTimeout(() => {
            setIsMinTimeElapsed(true);
        }, MIN_PROCESSING_TIME_MS);

        try {
            const response = await topUpWallet({
                amount: parseFloat(data.amount),
                walletId: targetWallet.walletId,
                currency: data.currency as CurrencyEnum,
                paymentMethodId: data.paymentMethodId
            }).unwrap();

            // Calculate new balance for success modal
            setNewBalance(targetWallet.balance + parseFloat(data.amount));
            // Store transaction ID from response
            setTransactionId(response.transactionId || '');
            // Store timestamp from response using centralized formatter
            const formattedTimestamp = formatTransactionDateTime(
                response.createdAt || new Date().toISOString()
            );
            setTimestamp(formattedTimestamp);
            // Mark API as complete - will transition to success when min time also elapses
            setIsApiComplete(true);
        } catch (error) {
            console.error('Top up failed:', error);
            setIsProcessing(false);
        }
    };

    /**
     * Handles processing modal animation complete (no longer used for transition)
     * Kept for backwards compatibility with TopUpProcessingModal
     */
    const handleProcessingComplete = () => {
        // Transition is now handled by the useEffect watching isApiComplete and isMinTimeElapsed
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        onClose();
        reset();
    };

    const selectedMethod = paymentMethods.find((m) => m.id === selectedPaymentMethodId);
    const paymentMethodDisplay = selectedMethod
        ? `${selectedMethod.name.split(' ')[0]} **** ${selectedMethod.details.split(' ').pop()}`
        : 'Payment Method';

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
                <ModalHeader
                    icon={ICONS.ADD_CARD}
                    title={MODAL_TEXT.TOP_UP_TITLE}
                    subtitle={MODAL_TEXT.TOP_UP_SUBTITLE}
                    onClose={onClose}
                />

                <ModalBody>
                    <form id="topup-form" onSubmit={handleSubmit(onSubmit)}>
                        {/* Amount Input Section */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#90a4cb] ml-1">{MODAL_TEXT.ENTER_AMOUNT}</label>
                            <Controller
                                name="amount"
                                control={control}
                                render={({ field }) => (
                                    <AmountInput
                                        autoFocus
                                        value={field.value}
                                        onChange={field.onChange}
                                        currency={currency}
                                        onCurrencyChange={(val) => setValue('currency', val)}
                                        currencies={[CURRENCIES.SGD, CURRENCIES.USD, CURRENCIES.EUR, CURRENCIES.GBP]}
                                        placeholder={MODAL_TEXT.AMOUNT_PLACEHOLDER}
                                    />
                                )}
                            />
                            {errors.amount && (
                                <p className="text-red-500 text-xs ml-1">{errors.amount.message}</p>
                            )}

                            {/* Quick Amount Buttons */}
                            <div className="flex gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => handleQuickAmount(10)}
                                    className="px-4 py-2 bg-[#222f49] hover:bg-[#314368] text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    {TOP_UP_QUICK_AMOUNTS.TEN}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickAmount(50)}
                                    className="px-4 py-2 bg-[#222f49] hover:bg-[#314368] text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    {TOP_UP_QUICK_AMOUNTS.FIFTY}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickAmount(100)}
                                    className="px-4 py-2 bg-[#222f49] hover:bg-[#314368] text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    {TOP_UP_QUICK_AMOUNTS.HUNDRED}
                                </button>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="flex flex-col gap-3 mt-6">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-medium text-[#90a4cb]">{MODAL_TEXT.PAYMENT_METHOD}</label>
                                <button type="button" className="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">{ICONS.ADD}</span>
                                    {MODAL_TEXT.ADD_NEW}
                                </button>
                            </div>
                            <Controller
                                name="paymentMethodId"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid grid-cols-1 gap-3">
                                        {isLoadingPaymentMethods ? (
                                            // Loading skeleton
                                            <>
                                                {[1, 2].map((i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center p-4 rounded-xl border-2 border-[#314368] bg-[#101623] animate-pulse"
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-[#222f49] mr-4" />
                                                        <div className="flex-1">
                                                            <div className="h-4 bg-[#222f49] rounded w-32 mb-2" />
                                                            <div className="h-3 bg-[#222f49] rounded w-24" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : paymentMethods.length === 0 ? (
                                            // Empty state
                                            <div className="text-center py-6 text-[#90a4cb]">
                                                <span className="material-symbols-outlined text-3xl mb-2 block">credit_card_off</span>
                                                <p className="text-sm">{PAYMENT_METHODS_TEXT.NO_METHODS_AVAILABLE}</p>
                                            </div>
                                        ) : (
                                            // Payment method list
                                            paymentMethods.map((method) => (
                                                <label
                                                    key={method.id}
                                                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${field.value === method.id
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-[#314368] bg-[#101623] hover:border-[#4b5563]'
                                                        }`}
                                                >
                                                    <input
                                                        className="sr-only"
                                                        name="payment_method"
                                                        type="radio"
                                                        checked={field.value === method.id}
                                                        onChange={() => field.onChange(method.id)}
                                                    />
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#222f49] text-white mr-4 shrink-0 border border-[#314368]">
                                                        <span className="material-symbols-outlined">{method.icon}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-white font-medium text-sm">{method.name}</p>
                                                            {field.value === method.id ? (
                                                                <span className="text-primary material-symbols-outlined text-[20px] fill-1">
                                                                    {ICONS.CHECK_CIRCLE}
                                                                </span>
                                                            ) : (
                                                                <div className="w-5 h-5 rounded-full border border-[#4b5563]"></div>
                                                            )}
                                                        </div>
                                                        <p className="text-[#90a4cb] text-xs">{method.details}</p>
                                                    </div>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                )}
                            />
                            {errors.paymentMethodId && (
                                <p className="text-red-500 text-xs ml-1">{errors.paymentMethodId.message}</p>
                            )}
                        </div>
                    </form>
                </ModalBody>

                <ModalFooter>
                    <button
                        type="submit"
                        form="topup-form"
                        className="w-full h-12 bg-primary hover:bg-[#2563eb] text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                    >
                        {MODAL_TEXT.REVIEW_TRANSACTION}
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[18px]">
                            {ICONS.ARROW_FORWARD}
                        </span>
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-4 text-[#64748b]">
                        <span className="material-symbols-outlined text-[14px]">{ICONS.LOCK}</span>
                        <p className="text-[11px] font-medium uppercase tracking-wide">
                            {MODAL_TEXT.ENCRYPTED_PAYMENT}
                        </p>
                    </div>
                </ModalFooter>
            </Modal>

            {/* Processing Modal */}
            <TopUpProcessingModal
                isOpen={isProcessing}
                amount={amount || '0.00'}
                currency={currency}
                paymentMethod={paymentMethodDisplay}
                onComplete={handleProcessingComplete}
            />

            {/* Success Modal */}
            <TopUpSuccessModal
                isOpen={showSuccess}
                amount={amount || '0.00'}
                currency={currency}
                newBalance={newBalance}
                paymentMethod={paymentMethodDisplay}
                transactionId={transactionId || 'N/A'}
                timestamp={timestamp}
                onClose={handleSuccessClose}
            />
        </>
    );
};
