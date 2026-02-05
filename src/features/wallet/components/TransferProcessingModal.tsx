import { ProcessingModal } from '../../../components/ui/ProcessingModal';
import { MODAL_TEXT, ICONS } from '../constants/text';

interface TransferProcessingModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Amount being transferred */
    amount: string;
    /** Currency code */
    currency: string;
    /** Recipient display name or email */
    recipient: string;
    /** Callback when processing animation completes */
    onComplete: () => void;
}

/**
 * Processing modal for wallet transfer transactions.
 * Shows the flow from user's wallet to recipient.
 */
export const TransferProcessingModal = ({
    isOpen,
    amount,
    currency,
    recipient,
    onComplete,
}: TransferProcessingModalProps) => {
    const timelineSteps = [
        {
            title: 'Locking Sender Funds',
            description: 'Phase 1: Preparation Complete',
            duration: '120ms',
            status: 'completed' as const,
        },
        {
            title: 'Verifying Recipient Ledger',
            description: 'Phase 2: Verification in progress',
            duration: '45ms',
            status: 'completed' as const,
        },
        {
            title: 'Finalizing Atomic Swap',
            description: 'Phase 3: Commit Pending',
            duration: 'PENDING',
            status: 'in-progress' as const,
        },
    ];

    return (
        <ProcessingModal
            isOpen={isOpen}
            title={MODAL_TEXT.PROCESSING_TRANSFER}
            heading={MODAL_TEXT.PROCESSING_TRANSACTION}
            subtitle={MODAL_TEXT.TWO_PHASE_COMMIT}
            amount={amount}
            currency={currency}
            sourceIcon={ICONS.ACCOUNT_BALANCE_WALLET}
            sourceLabel="My Wallet"
            destinationIcon="person"
            destinationLabel={recipient}
            secondaryInfo={recipient}
            secondaryInfoLabel="To"
            secondaryInfoIcon={ICONS.ALTERNATE_EMAIL}
            phaseName={MODAL_TEXT.PHASE_2_COMMIT}
            progressSubtext={MODAL_TEXT.LOCKING_LEDGER}
            transactionId={MODAL_TEXT.TXID_PREFIX}
            timelineSteps={timelineSteps}
            onComplete={onComplete}
        />
    );
};
