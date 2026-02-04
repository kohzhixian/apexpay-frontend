import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WalletSummary } from '../types';
import { MiniBarChart } from './MiniBarChart';
import { WALLETS_TEXT, WALLET_CARD_TEXT } from '../constants/text';
import { formatCurrency } from '../utils/formatters';
import { DropdownMenu, type DropdownMenuItem } from '../../../components/ui/DropdownMenu';

interface WalletCardProps {
    /** Wallet data to display */
    wallet: WalletSummary;
    /** Callback when edit name is clicked */
    onEditName?: (walletId: string) => void;
    /** Callback when top up is clicked */
    onTopUp?: (walletId: string) => void;
    /** Callback when transfer is clicked */
    onTransfer?: (walletId: string) => void;
}

/** Icon background and text color classes for each variant */
const iconColorClasses = {
    blue: 'bg-blue-500/10 text-blue-400',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    purple: 'bg-purple-500/10 text-purple-400',
    orange: 'bg-orange-500/10 text-orange-400',
};

/**
 * Wallet card component displaying wallet info with mini chart
 * Includes dropdown menu for edit and view details actions
 */
export const WalletCard = ({ wallet, onEditName, onTopUp, onTransfer }: WalletCardProps) => {
    const navigate = useNavigate();

    /**
     * Builds the dropdown menu items for wallet actions
     */
    const menuItems: DropdownMenuItem[] = useMemo(() => [
        {
            id: 'top-up',
            label: WALLET_CARD_TEXT.TOP_UP,
            icon: 'add',
            onClick: () => onTopUp?.(wallet.id),
        },
        {
            id: 'transfer',
            label: WALLET_CARD_TEXT.TRANSFER,
            icon: 'send',
            onClick: () => onTransfer?.(wallet.id),
        },
        {
            id: 'edit-name',
            label: WALLETS_TEXT.EDIT_NAME,
            icon: 'edit',
            onClick: () => onEditName?.(wallet.id),
        },
        {
            id: 'view-details',
            label: WALLETS_TEXT.VIEW_DETAILS,
            icon: 'visibility',
            onClick: () => navigate(`/wallets/${wallet.id}`),
        },
        {
            id: 'view-history',
            label: WALLETS_TEXT.VIEW_HISTORY,
            icon: 'history',
            onClick: () => navigate(`/history?walletId=${wallet.id}`),
        },
    ], [wallet.id, onTopUp, onTransfer, onEditName, navigate]);

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-xl p-6 hover:border-white/20 transition-all group flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div
                        className={`size-10 rounded-xl flex items-center justify-center ${iconColorClasses[wallet.colorVariant]}`}
                    >
                        <span className="material-symbols-outlined">{wallet.icon}</span>
                    </div>
                    <h3 className="font-bold text-white truncate max-w-[180px]" title={wallet.name}>
                        {wallet.name}
                    </h3>
                </div>

                {/* Dropdown Menu */}
                <DropdownMenu
                    items={menuItems}
                    dividerAfter={[1]}
                    triggerLabel="Wallet options"
                    align="right"
                    width="md"
                />
            </div>

            {/* Balance */}
            <div className="flex flex-col">
                <span className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">
                    {WALLETS_TEXT.CURRENT_BALANCE}
                </span>
                <span className="text-2xl font-black text-white">
                    {formatCurrency(wallet.balance, wallet.currency)}
                </span>
            </div>

            {/* Mini Chart */}
            <MiniBarChart data={wallet.chartData} colorVariant={wallet.colorVariant} />
        </div>
    );
};
