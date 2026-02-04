import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { NetWorthCard } from '../components/NetWorthCard';
import { WalletCard } from '../components/WalletCard';
import { ActivityTable } from '../components/ActivityTable';
import { AddWalletModal } from '../components/AddWalletModal';
import { TransferModal } from '../components/TransferModal';
import { TopUpModal } from '../components/TopUpModal';
import { EditWalletNameModal } from '../components/EditWalletNameModal';
import { APP_NAME, WALLETS_TEXT, WALLETS_PAGE_TEXT } from '../constants/text';
import { useCreateWalletMutation, useGetWalletQuery, useGetRecentTransactionsQuery, useUpdateWalletNameMutation } from '../services/walletApi';
import type { WalletSummary, CreateWalletFormData, CurrencyEnum } from '../types';

/**
 * Wallets page component
 * Displays all user wallets with net worth summary and recent activity
 */
export const WalletsPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState<WalletSummary | null>(null);
    const [selectedWallet, setSelectedWallet] = useState<WalletSummary | null>(null);

    // RTK Query for fetching wallet data
    const { data: walletData, isLoading: isLoadingWallet, refetch: refetchWallet } = useGetWalletQuery();

    // RTK Query for fetching recent transactions
    const { data: recentActivities, isLoading: isLoadingActivities } = useGetRecentTransactionsQuery();

    // RTK Query mutation for creating wallet
    const [createWallet, { isLoading: isCreatingWallet }] = useCreateWalletMutation();

    // RTK Query mutation for updating wallet name
    const [updateWalletName, { isLoading: isUpdatingWalletName }] = useUpdateWalletNameMutation();

    /**
     * Transforms API wallet data to WalletSummary format for display
     */
    const wallets: WalletSummary[] = walletData
        ? walletData.map((wallet) => ({
            id: wallet.walletId,
            name: wallet.name,
            balance: wallet.balance,
            currency: wallet.currency,
            icon: 'account_balance_wallet',
            colorVariant: 'blue' as const,
            chartData: [
                { value: 0 },
                { value: 0 },
                { value: 0 },
                { value: 0 },
                { value: 0 },
                { value: 0 },
                { value: wallet.balance > 0 ? 100 : 0 },
            ],
        }))
        : [];

    // Calculate total net worth
    const totalNetWorth = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

    /**
     * Opens the add new wallet modal
     */
    const handleAddNewWallet = () => {
        setIsAddWalletModalOpen(true);
    };

    /**
     * Handles creating a new wallet
     * @param data - Form data for the new wallet
     */
    const handleCreateWallet = async (data: CreateWalletFormData) => {
        try {
            await createWallet({
                name: data.name,
                balance: data.initialBalance,
                currency: data.currency as CurrencyEnum,
            }).unwrap();

            // Refetch wallet data to show the newly created wallet
            refetchWallet();
            setIsAddWalletModalOpen(false);
        } catch (error) {
            // Error handling - RTK Query will handle the error state
            console.error('Failed to create wallet:', error);
        }
    };

    /**
     * Opens edit name modal for a wallet
     * @param walletId - ID of wallet to edit
     */
    const handleEditName = (walletId: string) => {
        const wallet = wallets.find((w) => w.id === walletId);
        if (wallet) {
            setEditingWallet(wallet);
            setIsEditModalOpen(true);
        }
    };

    /**
     * Saves the edited wallet name
     * @param newName - The new name for the wallet
     */
    const handleSaveWalletName = async (newName: string) => {
        if (editingWallet) {
            try {
                await updateWalletName({
                    walletId: editingWallet.id,
                    walletName: newName,
                }).unwrap();
                setIsEditModalOpen(false);
                setEditingWallet(null);
            } catch (error) {
                console.error('Failed to update wallet name:', error);
            }
        }
    };

    /**
     * Closes the edit modal
     */
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingWallet(null);
    };

    /**
     * Opens the transfer modal for a specific wallet
     * @param walletId - ID of the source wallet
     */
    const handleTransfer = (walletId: string) => {
        const wallet = wallets.find((w) => w.id === walletId);
        if (wallet) {
            setSelectedWallet(wallet);
            setIsTransferModalOpen(true);
        }
    };

    /**
 * Opens the top up modal for a specific wallet
 * @param walletId - ID of the wallet to top up
 */
    const handleTopUp = (walletId: string) => {
        const wallet = wallets.find((w) => w.id === walletId);
        if (wallet) {
            setSelectedWallet(wallet);
            setIsTopUpModalOpen(true);
        }
    };

    /**
     * Handles wallet change in transfer modal
     * @param walletId - ID of the newly selected wallet
     */
    const handleWalletChange = (walletId: string) => {
        const wallet = wallets.find((w) => w.id === walletId);
        if (wallet) {
            setSelectedWallet(wallet);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentPath="/wallets"
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0a0f1a]">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-[#0a0f1a] border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-500 size-8 rounded-lg flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <span className="font-bold text-lg text-white">{APP_NAME}</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-white p-2"
                        aria-label="Open menu"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>

                {/* Page Content */}
                <div className="container mx-auto max-w-6xl px-6 py-8 flex flex-col gap-8">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-black tracking-tight text-white">
                                {WALLETS_TEXT.PAGE_TITLE}
                            </h1>
                            <p className="text-slate-400 text-sm">
                                {WALLETS_TEXT.PAGE_DESCRIPTION}
                            </p>
                        </div>
                        <button
                            onClick={handleAddNewWallet}
                            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined">add_circle</span>
                            {WALLETS_TEXT.ADD_NEW_WALLET}
                        </button>
                    </div>

                    {/* Net Worth Summary */}
                    <NetWorthCard
                        totalNetWorth={totalNetWorth}
                        currency="SGD"
                        monthlyGrowth={0}
                        activeCurrencies={wallets.length}
                    />

                    {/* Wallet Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoadingWallet ? (
                            <div className="h-48 bg-slate-800/50 animate-pulse rounded-2xl" />
                        ) : wallets.length > 0 ? (
                            wallets.map((wallet) => (
                                <WalletCard
                                    key={wallet.id}
                                    wallet={wallet}
                                    onEditName={handleEditName}
                                    onTopUp={handleTopUp}
                                    onTransfer={handleTransfer}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-2 block">
                                    account_balance_wallet
                                </span>
                                <p>{WALLETS_PAGE_TEXT.NO_WALLETS}</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-xl font-bold text-white">
                                {WALLETS_TEXT.RECENT_ACTIVITY}
                            </h2>
                            <a
                                href="/history"
                                className="text-sm font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
                            >
                                {WALLETS_TEXT.ACTIVITY_LOGS}
                                <span className="material-symbols-outlined text-[16px]">
                                    arrow_forward
                                </span>
                            </a>
                        </div>
                        <ActivityTable
                            activities={recentActivities ?? []}
                            isLoading={isLoadingActivities}
                        />
                    </div>
                </div>
            </main>

            {/* Edit Name Modal */}
            <EditWalletNameModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSaveWalletName}
                currentName={editingWallet?.name ?? ''}
                isSaving={isUpdatingWalletName}
            />

            {/* Add Wallet Modal */}
            <AddWalletModal
                isOpen={isAddWalletModalOpen}
                onClose={() => setIsAddWalletModalOpen(false)}
                onCreateWallet={handleCreateWallet}
                isCreating={isCreatingWallet}
            />

            {/* Transfer Modal */}
            <TransferModal
                isOpen={isTransferModalOpen}
                onClose={() => {
                    setIsTransferModalOpen(false);
                    setSelectedWallet(null);
                }}
                sourceWallet={selectedWallet}
                wallets={wallets}
                onWalletChange={handleWalletChange}
            />

            {/* Top Up Modal */}
            <TopUpModal
                isOpen={isTopUpModalOpen}
                onClose={() => {
                    setIsTopUpModalOpen(false);
                    setSelectedWallet(null);
                }}
                walletId={selectedWallet?.id}
            />
        </div>
    );
};
