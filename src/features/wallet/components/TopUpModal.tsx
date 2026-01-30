import { useState } from 'react';
import { TopUpProcessingModal } from './TopUpProcessingModal';
import { TopUpSuccessModal } from './TopUpSuccessModal';
import { MODAL_TEXT, PAYMENT_METHOD_TEXT, CURRENCIES, ICONS } from '../constants/text';
import { AmountInput, Modal, ModalHeader, ModalBody, ModalFooter } from '../../../components/ui';

interface PaymentMethod {
    id: string;
    type: 'card' | 'bank';
    name: string;
    details: string;
    icon: string;
}

interface TopUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TopUpModal = ({ isOpen, onClose }: TopUpModalProps) => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState<string>(CURRENCIES.SGD);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card1');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const paymentMethods: PaymentMethod[] = [
        {
            id: 'card1',
            type: 'card',
            name: PAYMENT_METHOD_TEXT.VISA_ENDING,
            details: PAYMENT_METHOD_TEXT.VISA_EXPIRES,
            icon: ICONS.CREDIT_CARD,
        },
        {
            id: 'bank1',
            type: 'bank',
            name: PAYMENT_METHOD_TEXT.CHASE_BANK,
            details: PAYMENT_METHOD_TEXT.CHASE_CHECKING,
            icon: ICONS.ACCOUNT_BALANCE,
        },
    ];

    const transactionRef = 'APX-8921-MNQ-772';

    const handleQuickAmount = (value: number) => {
        setAmount(value.toString());
    };

    const handleCopyReference = () => {
        navigator.clipboard.writeText(transactionRef);
    };

    const handleSubmit = () => {
        console.log('Top up submitted:', { amount, currency, selectedPaymentMethod });
        setIsProcessing(true);
    };

    const handleProcessingComplete = () => {
        setIsProcessing(false);
        setShowSuccess(true);
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        onClose();
        // Reset form
        setAmount('');
        setSelectedPaymentMethod('card1');
    };

    const selectedMethod = paymentMethods.find((m) => m.id === selectedPaymentMethod);
    const paymentMethodDisplay = selectedMethod
        ? `${selectedMethod.name.split(' ')[0]} **** ${selectedMethod.details.split(' ').pop()}`
        : `${PAYMENT_METHOD_TEXT.CHASE_BANK} **** 1234`;

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
                    {/* Amount Input Section */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[#90a4cb] ml-1">{MODAL_TEXT.ENTER_AMOUNT}</label>
                        <AmountInput
                            autoFocus
                            value={amount}
                            onChange={setAmount}
                            currency={currency}
                            onCurrencyChange={setCurrency}
                            currencies={[CURRENCIES.SGD, CURRENCIES.USD, CURRENCIES.EUR, CURRENCIES.GBP]}
                            placeholder={MODAL_TEXT.AMOUNT_PLACEHOLDER}
                        />

                        {/* Quick Amount Buttons */}
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => handleQuickAmount(10)}
                                className="px-4 py-2 bg-[#222f49] hover:bg-[#314368] text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                +$10.00
                            </button>
                            <button
                                onClick={() => handleQuickAmount(50)}
                                className="px-4 py-2 bg-[#222f49] hover:bg-[#314368] text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                +$50.00
                            </button>
                            <button
                                onClick={() => handleQuickAmount(100)}
                                className="px-4 py-2 bg-[#222f49] hover:bg-[#314368] text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                +$100.00
                            </button>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-sm font-medium text-[#90a4cb]">{MODAL_TEXT.PAYMENT_METHOD}</label>
                            <button className="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">{ICONS.ADD}</span>
                                {MODAL_TEXT.ADD_NEW}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {paymentMethods.map((method) => (
                                <label
                                    key={method.id}
                                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPaymentMethod === method.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-[#314368] bg-[#101623] hover:border-[#4b5563]'
                                        }`}
                                >
                                    <input
                                        className="sr-only"
                                        name="payment_method"
                                        type="radio"
                                        checked={selectedPaymentMethod === method.id}
                                        onChange={() => setSelectedPaymentMethod(method.id)}
                                    />
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#222f49] text-white mr-4 shrink-0 border border-[#314368]">
                                        <span className="material-symbols-outlined">{method.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-white font-medium text-sm">{method.name}</p>
                                            {selectedPaymentMethod === method.id ? (
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
                            ))}
                        </div>
                    </div>

                    {/* Transaction Reference */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[#90a4cb] ml-1">{MODAL_TEXT.TRANSACTION_REFERENCE}</label>
                        <div className="flex items-center bg-[#101623] border border-[#314368] rounded-lg px-3 py-2.5">
                            <span className="material-symbols-outlined text-[#90a4cb] text-[18px] mr-2">
                                {ICONS.FINGERPRINT}
                            </span>
                            <span className="text-sm text-white font-mono flex-1 tracking-wider">
                                {transactionRef}
                            </span>
                            <button
                                onClick={handleCopyReference}
                                className="text-[#90a4cb] hover:text-white"
                                title="Copy Reference"
                            >
                                <span className="material-symbols-outlined text-[18px]">{ICONS.CONTENT_COPY}</span>
                            </button>
                        </div>
                        <p className="text-[11px] text-[#90a4cb] ml-1">
                            {MODAL_TEXT.REFERENCE_HELP}
                        </p>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <button
                        onClick={handleSubmit}
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
                newBalance={5420.0}
                paymentMethod={paymentMethodDisplay}
                transactionId="#TRX-882910-APX"
                onClose={handleSuccessClose}
            />
        </>
    );
};
