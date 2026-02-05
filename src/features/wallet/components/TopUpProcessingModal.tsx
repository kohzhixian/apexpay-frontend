import { ProcessingModal } from '../../../components/ui/ProcessingModal';
import { MODAL_TEXT, PROCESSING_STEPS, ICONS } from '../constants/text';

interface TopUpProcessingModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Amount being topped up */
    amount: string;
    /** Currency code */
    currency: string;
    /** Payment method display name (e.g., "Visa •••• 4242") */
    paymentMethod: string;
    /** Callback when processing animation completes */
    onComplete: () => void;
}

/**
 * Processing modal for wallet top-up transactions.
 * Shows the flow from bank/payment method to ApexPay wallet.
 */
export const TopUpProcessingModal = ({
    isOpen,
    amount,
    currency,
    paymentMethod,
    onComplete,
}: TopUpProcessingModalProps) => {
    const timelineSteps = [
        {
            title: PROCESSING_STEPS.CONTACTING_BANK,
            description: PROCESSING_STEPS.CONTACTING_BANK_DESC,
            duration: PROCESSING_STEPS.CONTACTING_BANK_DURATION,
            status: 'completed' as const,
        },
        {
            title: PROCESSING_STEPS.VERIFYING_FUNDS,
            description: PROCESSING_STEPS.VERIFYING_FUNDS_DESC,
            duration: PROCESSING_STEPS.VERIFYING_FUNDS_DURATION,
            status: 'completed' as const,
        },
        {
            title: PROCESSING_STEPS.PREPARING_LEDGER,
            description: PROCESSING_STEPS.PREPARING_LEDGER_DESC,
            duration: PROCESSING_STEPS.PREPARING_LEDGER_DURATION,
            status: 'in-progress' as const,
        },
    ];

    return (
        <ProcessingModal
            isOpen={isOpen}
            title={MODAL_TEXT.TOP_UP_IN_PROGRESS}
            heading={MODAL_TEXT.PROCESSING_TRANSACTION}
            subtitle={MODAL_TEXT.TWO_PHASE_COMMIT}
            amount={amount}
            currency={currency}
            sourceIcon={ICONS.ACCOUNT_BALANCE}
            sourceLabel={MODAL_TEXT.CHASE_BANK_NAME}
            destinationIcon={ICONS.ACCOUNT_BALANCE_WALLET}
            destinationLabel={MODAL_TEXT.APEXPAY_WALLET}
            secondaryInfo={paymentMethod}
            secondaryInfoLabel="Via"
            secondaryInfoIcon={ICONS.CREDIT_CARD}
            phaseName={MODAL_TEXT.PHASE_2_COMMIT}
            progressSubtext={MODAL_TEXT.LOCKING_LEDGER}
            transactionId={MODAL_TEXT.TRANSACTION_ID_PREFIX}
            timelineSteps={timelineSteps}
            onComplete={onComplete}
        />
    );
};
