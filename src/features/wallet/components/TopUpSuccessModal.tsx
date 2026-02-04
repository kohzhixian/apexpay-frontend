import { SuccessModal } from '../../../components/ui/SuccessModal';
import { MODAL_TEXT, ICONS } from '../constants/text';

interface TopUpSuccessModalProps {
    isOpen: boolean;
    amount: string;
    currency: string;
    newBalance: number;
    paymentMethod: string;
    transactionId: string;
    timestamp: string;
    onClose: () => void;
}

/**
 * Modal displayed after a successful top-up transaction.
 * Uses the reusable SuccessModal component with top-up specific configuration.
 */
export const TopUpSuccessModal = ({
    isOpen,
    amount,
    currency,
    newBalance,
    paymentMethod,
    transactionId,
    timestamp,
    onClose,
}: TopUpSuccessModalProps) => {
    /**
     * Truncates a UUID to show first 8 and last 4 characters
     * @param id - The full transaction ID
     * @returns Truncated string (e.g., "d27c7937...5745d")
     */
    const truncateTransactionId = (id: string): string => {
        if (id.length <= 16) return id;
        return `${id.slice(0, 8)}...${id.slice(-5)}`;
    };

    // Build transaction details array for SuccessModal
    const transactionDetails = [
        {
            label: MODAL_TEXT.TOP_UP_AMOUNT,
            value: `+ $${amount} ${currency}`,
        },
        {
            label: MODAL_TEXT.TRANSACTION_ID,
            value: truncateTransactionId(transactionId),
            copyable: true,
        },
        {
            label: MODAL_TEXT.TIMESTAMP,
            value: timestamp,
        },
        {
            label: MODAL_TEXT.PAYMENT_METHOD,
            value: paymentMethod,
            icon: ICONS.CREDIT_CARD,
        },
    ];

    return (
        <SuccessModal
            isOpen={isOpen}
            onClose={onClose}
            title={MODAL_TEXT.FUNDS_ADDED}
            subtitle={MODAL_TEXT.WALLET_TOPPED_UP}
            amount={amount}
            currency={currency}
            balanceLabel={MODAL_TEXT.UPDATED_BALANCE}
            balanceValue={newBalance}
            details={transactionDetails}
            primaryAction={{
                label: MODAL_TEXT.DONE,
                onClick: onClose,
            }}
            footerLink={{
                text: `${MODAL_TEXT.NEED_HELP} ${MODAL_TEXT.CONTACT_SUPPORT}`,
                href: '#',
            }}
        />
    );
};
