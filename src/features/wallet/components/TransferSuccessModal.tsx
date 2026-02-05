import { SuccessModal } from '../../../components/ui/SuccessModal';
import { MODAL_TEXT, ICONS } from '../constants/text';
import { formatTransactionDateTime } from '../utils/formatters';

interface TransferSuccessModalProps {
    isOpen: boolean;
    amount: string;
    currency: string;
    recipient: string;
    recipientAvatar?: string;
    transactionReference: string;
    timestamp: string;
    paymentMethod: string;
    onClose: () => void;
}

/**
 * Modal displayed after a successful transfer transaction.
 * Uses the reusable SuccessModal component with transfer-specific configuration.
 */
export const TransferSuccessModal = ({
    isOpen,
    amount,
    currency,
    recipient,
    recipientAvatar,
    transactionReference,
    timestamp,
    paymentMethod,
    onClose,
}: TransferSuccessModalProps) => {
    // Build transaction details array for SuccessModal
    const transactionDetails = [
        {
            label: MODAL_TEXT.TRANSACTION_REFERENCE,
            value: transactionReference,
            copyable: true,
        },
        {
            label: MODAL_TEXT.TIMESTAMP,
            value: formatTransactionDateTime(timestamp),
        },
        {
            label: MODAL_TEXT.PAYMENT_METHOD,
            value: paymentMethod,
            icon: ICONS.ACCOUNT_BALANCE_WALLET,
        },
        {
            label: MODAL_TEXT.STATUS,
            value: MODAL_TEXT.COMPLETED,
        },
    ];

    return (
        <SuccessModal
            isOpen={isOpen}
            onClose={onClose}
            title={MODAL_TEXT.TRANSFER_SUCCESSFUL}
            subtitle={MODAL_TEXT.TRANSACTION_COMPLETED}
            amount={amount}
            currency={currency}
            recipient={{
                name: recipient,
                avatar: recipientAvatar,
            }}
            details={transactionDetails}
            primaryAction={{
                label: MODAL_TEXT.DONE,
                onClick: onClose,
            }}
            secondaryAction={{
                label: MODAL_TEXT.DOWNLOAD_RECEIPT,
                icon: ICONS.DOWNLOAD,
                onClick: () => {
                    // Download receipt functionality - placeholder for now
                },
            }}
            footerText={MODAL_TEXT.ENCRYPTED_TRANSACTION}
        />
    );
};
