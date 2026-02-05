import { useState, useEffect } from 'react';
import { EDIT_WALLET_MODAL_TEXT, DYNAMIC_TEXT } from '../constants/text';

/** Maximum character length for wallet names */
const MAX_WALLET_NAME_LENGTH = 50;

interface EditWalletNameModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when modal is closed */
    onClose: () => void;
    /** Callback when save is clicked */
    onSave: (name: string) => void;
    /** Current wallet name */
    currentName: string;
    /** Whether save is in progress */
    isSaving?: boolean;
}

/**
 * Modal for editing wallet name with glass effect styling
 */
export const EditWalletNameModal = ({
    isOpen,
    onClose,
    onSave,
    currentName,
    isSaving = false,
}: EditWalletNameModalProps) => {
    const [name, setName] = useState(currentName);

    // Sync internal state when currentName changes
    useEffect(() => {
        setName(currentName);
    }, [currentName]);

    /**
     * Handles save button click
     */
    const handleSave = () => {
        if (name.trim()) {
            onSave(name.trim());
        }
    };

    /**
     * Handles key down for enter to submit
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isSaving) {
            handleSave();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="modal-glass max-w-[480px] animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="icon-badge icon-badge-md bg-blue-500/10">
                            <span className="material-symbols-outlined text-blue-500 text-[22px]">edit</span>
                        </div>
                        <h2 className="text-xl font-semibold text-white">{EDIT_WALLET_MODAL_TEXT.TITLE}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors group"
                        aria-label="Close modal"
                    >
                        <span className="material-symbols-outlined text-slate-500 group-hover:text-slate-300">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="wallet-name"
                                className="block text-sm font-medium text-slate-400"
                            >
                                {EDIT_WALLET_MODAL_TEXT.WALLET_NAME_LABEL}
                            </label>
                            <span className={`text-xs ${name.length >= MAX_WALLET_NAME_LENGTH ? 'text-red-400' : 'text-slate-500'}`}>
                                {DYNAMIC_TEXT.CHARACTER_COUNT(name.length, MAX_WALLET_NAME_LENGTH)}
                            </span>
                        </div>
                        <input
                            id="wallet-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value.slice(0, MAX_WALLET_NAME_LENGTH))}
                            onKeyDown={handleKeyDown}
                            maxLength={MAX_WALLET_NAME_LENGTH}
                            placeholder={EDIT_WALLET_MODAL_TEXT.WALLET_NAME_PLACEHOLDER}
                            className="input-dark"
                        />
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">info</span>
                            {EDIT_WALLET_MODAL_TEXT.HELP_TEXT}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 bg-white/5">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="btn-secondary h-10 px-5 text-sm font-semibold text-slate-400 hover:text-white disabled:opacity-50"
                    >
                        {EDIT_WALLET_MODAL_TEXT.CANCEL}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !name.trim()}
                        className="btn-primary h-10 px-8 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? EDIT_WALLET_MODAL_TEXT.SAVING : EDIT_WALLET_MODAL_TEXT.SAVE_CHANGES}
                    </button>
                </div>
            </div>
        </div>
    );
};
