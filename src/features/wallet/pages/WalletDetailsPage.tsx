import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { BalanceTrendsChart } from '../components/BalanceTrendsChart';
import { WalletOverviewPanel } from '../components/WalletOverviewPanel';
import { TechnicalMetadata } from '../components/TechnicalMetadata';
import { PortfolioInsights } from '../components/PortfolioInsights';
import { WalletDetailsTransactionTable } from '../components/WalletDetailsTransactionTable';
import type { WalletTransaction } from '../components/WalletDetailsTransactionTable';
import { EditWalletNameModal } from '../components/EditWalletNameModal';
import { TopUpModal } from '../components/TopUpModal';
import { APP_NAME, WALLET_DETAILS_TEXT, WALLET_DETAILS_PAGE_TEXT, DYNAMIC_TEXT } from '../constants/text';
import { useGetWalletQuery, useUpdateWalletNameMutation } from '../services/walletApi';
import { formatCurrency } from '../utils/formatters';

/** Mock data for wallet details (to be replaced with API data) */
const MOCK_WALLET_DETAILS = {
    totalIncome: 4250.0,
    totalSpent: 2650.0,
    apyGrowth: '4.2% Fixed',
    ledgerAddress: '0x71C7654321ABCDEF67890ABCDEF',
    creationDate: '2023-01-12T00:00:00Z',
    walletType: 'High-Yield',
    is2FAEnabled: true,
    isColdStorage: true,
    performancePercent: 15,
    chartData: [40, 55, 45, 70, 60, 85, 75],
};

/** Mock transactions for the details page */
const MOCK_TRANSACTIONS: WalletTransaction[] = [
    {
        id: '1',
        description: 'Apple Store',
        category: 'Shopping',
        icon: 'shopping_cart',
        date: '2023-10-24T10:30:00Z',
        status: 'completed',
        amount: 129.0,
        isCredit: false,
    },
    {
        id: '2',
        description: 'Salary Deposit',
        category: 'Income',
        icon: 'payments',
        date: '2023-10-23T09:00:00Z',
        status: 'completed',
        amount: 2400.0,
        isCredit: true,
    },
    {
        id: '3',
        description: 'Electric Bill',
        category: 'Utilities',
        icon: 'bolt',
        date: '2023-10-22T14:15:00Z',
        status: 'processing',
        amount: 85.4,
        isCredit: false,
    },
];

/**
 * Wallet details page showing comprehensive wallet information
 * Includes balance, trends, transactions, and technical metadata
 */
export const WalletDetailsPage = () => {
    const { walletId } = useParams<{ walletId: string }>();
    const navigate = useNavigate();

    // UI State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

    // RTK Query hooks
    const { data: wallets, isLoading: isLoadingWallet } = useGetWalletQuery();
    const [updateWalletName, { isLoading: isUpdatingName }] = useUpdateWalletNameMutation();

    // Find the current wallet from the list
    const wallet = wallets?.find((w) => w.walletId === walletId);

    // Calculate growth percentage (mock for now)
    const growthPercent = 12.4;

    /**
     * Handles opening the edit name modal
     */
    const handleEditName = () => {
        setIsEditModalOpen(true);
    };

    /**
     * Handles saving the new wallet name
     * @param newName - The new name for the wallet
     */
    const handleSaveWalletName = async (newName: string) => {
        if (!walletId) return;

        try {
            await updateWalletName({
                walletId,
                walletName: newName,
            }).unwrap();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Failed to update wallet name:', error);
        }
    };

    /**
     * Handles opening the top up modal
     */
    const handleTopUp = () => {
        setIsTopUpModalOpen(true);
    };

    /**
     * Handles export CSV action
     */
    const handleExportCSV = () => {
        console.log('Export CSV clicked');
    };

    // Loading state
    if (isLoadingWallet) {
        return (
            <div className="flex h-screen w-full overflow-hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    currentPath="/wallets"
                />
                <main className="flex-1 flex items-center justify-center bg-[#0a0f1a]">
                    <div className="text-white">{WALLET_DETAILS_PAGE_TEXT.LOADING}</div>
                </main>
            </div>
        );
    }

    // Wallet not found
    if (!wallet) {
        return (
            <div className="flex h-screen w-full overflow-hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    currentPath="/wallets"
                />
                <main className="flex-1 flex flex-col items-center justify-center bg-[#0a0f1a] gap-4">
                    <span className="material-symbols-outlined text-6xl text-slate-500">
                        account_balance_wallet
                    </span>
                    <p className="text-white text-lg">{WALLET_DETAILS_PAGE_TEXT.NOT_FOUND}</p>
                    <button
                        onClick={() => navigate('/wallets')}
                        className="text-blue-500 hover:underline"
                    >
                        {WALLET_DETAILS_PAGE_TEXT.BACK_TO_WALLETS}
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentPath="/wallets"
            />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 bg-[#0a0f1a]">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between mb-6">
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

                {/* Header with Breadcrumb and Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <nav className="flex items-center gap-2 text-sm text-slate-500">
                        <Link to="/wallets" className="hover:text-blue-500 transition-colors">
                            {WALLET_DETAILS_TEXT.BREADCRUMB_WALLETS}
                        </Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-white font-medium">
                            {wallet.name}
                        </span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportCSV}
                            className="px-4 py-2 bg-[#161E2C] border border-slate-700 rounded-lg text-sm font-medium hover:border-blue-500 transition-colors flex items-center gap-2 text-slate-300"
                        >
                            <span className="material-symbols-outlined text-base">
                                file_download
                            </span>
                            {WALLET_DETAILS_TEXT.EXPORT_CSV}
                        </button>
                        <button
                            onClick={handleTopUp}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-base">add</span>
                            {WALLET_DETAILS_TEXT.TOP_UP}
                        </button>
                    </div>
                </div>

                {/* Main Wallet Card + Overview Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-6">
                    {/* Main Wallet Card - Takes 3 columns */}
                    <div className="lg:col-span-3 relative p-6 rounded-2xl bg-[#161E2C] overflow-hidden group">
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all" />

                        <div className="relative z-10">
                            {/* Wallet Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-11 h-11 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/10">
                                    <span className="material-symbols-outlined text-white text-2xl">
                                        account_balance_wallet
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white tracking-tight">
                                        {wallet.name}
                                    </h1>
                                    <p className="text-slate-400 text-xs flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        {WALLET_DETAILS_TEXT.ACTIVE}
                                    </p>
                                </div>
                                <div className="ml-auto flex gap-2">
                                    <button
                                        onClick={handleEditName}
                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                                        aria-label="Edit wallet name"
                                    >
                                        <span className="material-symbols-outlined text-xl">edit</span>
                                    </button>
                                    <button
                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                                        aria-label="More options"
                                    >
                                        <span className="material-symbols-outlined text-xl">more_vert</span>
                                    </button>
                                </div>
                            </div>

                            {/* Balance Display */}
                            <div className="flex flex-col mb-6">
                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-1">
                                    {WALLET_DETAILS_TEXT.CURRENT_BALANCE}
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-extrabold text-white tracking-tight">
                                        {formatCurrency(wallet.balance, wallet.currency)}
                                    </span>
                                    <span className="text-green-400 font-medium text-base">
                                        {DYNAMIC_TEXT.GROWTH_PERCENT(growthPercent)}
                                    </span>
                                </div>
                            </div>

                            {/* Mini Progress Bars */}
                            <div className="flex items-end gap-2 h-2">
                                {MOCK_WALLET_DETAILS.chartData.map((value, index) => {
                                    const isLast = index === MOCK_WALLET_DETAILS.chartData.length - 1;
                                    const widthPercent = (value / 100) * 100;
                                    return (
                                        <div
                                            key={index}
                                            className={`flex-1 bg-white/5 rounded-full overflow-hidden ${isLast ? 'ring-1 ring-blue-500' : ''
                                                }`}
                                        >
                                            <div
                                                className="bg-blue-500 h-full transition-all duration-300"
                                                style={{ width: `${widthPercent}%` }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Overview Panel - Takes 1 column */}
                    <div className="lg:col-span-1">
                        <WalletOverviewPanel
                            totalIncome={MOCK_WALLET_DETAILS.totalIncome}
                            totalSpent={MOCK_WALLET_DETAILS.totalSpent}
                            apyGrowth={MOCK_WALLET_DETAILS.apyGrowth}
                            currency={wallet.currency}
                        />
                    </div>
                </div>

                {/* Balance Trends + Sidebar Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                    {/* Left Column - Chart + Transactions (3 columns) */}
                    <div className="lg:col-span-3 space-y-5">
                        <BalanceTrendsChart
                            currentBalance={wallet.balance}
                            currency={wallet.currency}
                            data={MOCK_WALLET_DETAILS.chartData}
                        />

                        <WalletDetailsTransactionTable
                            transactions={MOCK_TRANSACTIONS}
                            currency={wallet.currency}
                            walletId={walletId}
                        />
                    </div>

                    {/* Right Column - Metadata + Insights (1 column) */}
                    <div className="lg:col-span-1 space-y-5">
                        <TechnicalMetadata
                            ledgerAddress={MOCK_WALLET_DETAILS.ledgerAddress}
                            creationDate={MOCK_WALLET_DETAILS.creationDate}
                            walletType={MOCK_WALLET_DETAILS.walletType}
                            is2FAEnabled={MOCK_WALLET_DETAILS.is2FAEnabled}
                            isColdStorage={MOCK_WALLET_DETAILS.isColdStorage}
                        />

                        <PortfolioInsights
                            walletName={wallet.name}
                            performancePercent={MOCK_WALLET_DETAILS.performancePercent}
                        />
                    </div>
                </div>
            </main>

            {/* Edit Name Modal */}
            <EditWalletNameModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveWalletName}
                currentName={wallet.name}
                isSaving={isUpdatingName}
            />

            {/* Top Up Modal */}
            <TopUpModal
                isOpen={isTopUpModalOpen}
                onClose={() => setIsTopUpModalOpen(false)}
                walletId={walletId}
            />
        </div>
    );
};
