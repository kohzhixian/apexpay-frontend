import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Transaction, ActivityItem } from '../types';
import { TransactionStatus, TransactionType, WalletTransactionStatusEnum } from '../types';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { BalanceCard } from '../components/BalanceCard';
import { MonthlySummaryCard } from '../components/MonthlySummaryCard';
import { QuickActionButton } from '../components/QuickActionButton';
import { TransactionTable } from '../components/TransactionTable';
import { TopUpModal } from '../components/TopUpModal';
import { LoadingSkeleton } from '../../../components/ui/LoadingSkeleton';
import { APP_NAME, DASHBOARD_TEXT, QUICK_ACTIONS, QUICK_ACTION_ICONS } from '../constants/text';
import { useGetWalletQuery, useGetMonthlySummaryQuery, useGetRecentTransactionsQuery } from '../services/walletApi';
import { useGetUserDetailsQuery } from '../../user/services/userApi';

/**
 * Maps backend WalletTransactionStatusEnum to UI TransactionStatus
 */
const mapStatus = (status: WalletTransactionStatusEnum): TransactionStatus => {
    switch (status) {
        case WalletTransactionStatusEnum.COMPLETED:
            return TransactionStatus.SUCCESS;
        case WalletTransactionStatusEnum.PENDING:
            return TransactionStatus.PENDING;
        case WalletTransactionStatusEnum.CANCELLED:
            return TransactionStatus.FAILED;
        default:
            return TransactionStatus.PENDING;
    }
};

/**
 * Maps backend activity item to UI transaction type based on description/reference
 */
const mapTransactionType = (item: ActivityItem): TransactionType => {
    const desc = item.description.toLowerCase();
    if (desc.includes('top up') || desc.includes('topup')) return TransactionType.TOP_UP;
    if (desc.includes('transfer')) return TransactionType.TRANSFER;
    if (desc.includes('earning') || desc.includes('income')) return TransactionType.EARNING;
    if (desc.includes('subscription')) return TransactionType.SUBSCRIPTION;
    if (desc.includes('exchange')) return TransactionType.EXCHANGE;
    // Default based on credit/debit
    return item.isCredit ? TransactionType.EARNING : TransactionType.TRANSFER;
};

/**
 * Maps ActivityItem from API to Transaction for UI components
 */
const mapActivityToTransaction = (item: ActivityItem): Transaction => ({
    id: item.walletTransactionId,
    date: item.datetime,
    description: item.description,
    amount: item.isCredit ? item.amount : -item.amount,
    currency: 'SGD', // Default currency
    status: mapStatus(item.status),
    type: mapTransactionType(item),
});

export const DashboardPage = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

    // Fetch user details and wallet data
    const { data: user, isLoading: isLoadingUser } = useGetUserDetailsQuery();
    const { data: wallets, isLoading: isLoadingWallet } = useGetWalletQuery();
    const { data: monthlySummary, isLoading: isLoadingMonthlySummary } = useGetMonthlySummaryQuery();
    const {
        data: recentActivity,
        isLoading: isLoadingTransactions,
        error: transactionsError,
        refetch: refetchTransactions,
    } = useGetRecentTransactionsQuery();

    // Get the primary wallet (first wallet in the array)
    const wallet = wallets?.[0];

    // Calculate total balance across all wallets
    const totalBalance = wallets?.reduce((sum, w) => sum + w.balance, 0) ?? 0;

    // Map API activity items to UI transaction format
    const transactions: Transaction[] = recentActivity?.map(mapActivityToTransaction) ?? [];

    const handleTopUp = () => {
        setIsTopUpModalOpen(true);
    };

    const handleTransfer = () => {
        navigate('/dashboard/transfer');
    };

    const handleExchange = () => {
        navigate('/dashboard/exchange');
    };

    const handleRetryTransactions = () => {
        refetchTransactions();
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentPath="/dashboard"
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-[#1a202c]">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-[#1a202c] border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-500 size-8 rounded-lg flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <span className="font-bold text-lg text-white">{APP_NAME}</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-white p-2"
                    >
                        <span className="material-symbols-outlined">{DASHBOARD_TEXT.MENU}</span>
                    </button>
                </div>

                {/* Dashboard Content */}
                <div className="container mx-auto max-w-6xl px-4 md:px-8 py-8 flex flex-col gap-8">
                    {/* Page Heading */}
                    <DashboardHeader userName={user?.username ?? 'User'} />

                    {/* Balance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isLoadingWallet || isLoadingUser ? (
                            <>
                                <LoadingSkeleton variant="card" height="160px" />
                                <LoadingSkeleton variant="card" height="160px" />
                            </>
                        ) : wallet ? (
                            <>
                                <BalanceCard
                                    title={DASHBOARD_TEXT.AVAILABLE_BALANCE}
                                    amount={totalBalance}
                                    currency={wallet.currency}
                                    variant="available"
                                />
                                <MonthlySummaryCard
                                    income={monthlySummary?.income ?? 0}
                                    spending={monthlySummary?.spending ?? 0}
                                    currency={monthlySummary?.currency ?? wallet.currency}
                                    isLoading={isLoadingMonthlySummary}
                                />
                            </>
                        ) : null}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-4">
                        <QuickActionButton icon={QUICK_ACTION_ICONS.TOP_UP} label={QUICK_ACTIONS.TOP_UP} onClick={handleTopUp} />
                        <QuickActionButton icon={QUICK_ACTION_ICONS.TRANSFER} label={QUICK_ACTIONS.TRANSFER} onClick={handleTransfer} />
                        <QuickActionButton icon={QUICK_ACTION_ICONS.EXCHANGE} label={QUICK_ACTIONS.EXCHANGE} onClick={handleExchange} />
                        <button className="h-14 w-14 bg-[#2d3748] border border-slate-700 hover:bg-[#374151] transition-all rounded-xl flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">{DASHBOARD_TEXT.MORE_OPTIONS}</span>
                        </button>
                    </div>

                    {/* Recent Transactions */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-xl font-bold text-white">
                                {DASHBOARD_TEXT.RECENT_TRANSACTIONS}
                            </h2>
                            <a
                                href="#"
                                className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                            >
                                {DASHBOARD_TEXT.VIEW_ALL}{' '}
                                <span className="material-symbols-outlined text-[16px]">{QUICK_ACTION_ICONS.ARROW_FORWARD}</span>
                            </a>
                        </div>
                        <TransactionTable
                            transactions={transactions}
                            isLoading={isLoadingTransactions}
                            error={transactionsError ? 'Failed to load transactions' : null}
                            onRetry={handleRetryTransactions}
                        />
                    </div>
                </div>
            </main>

            {/* Top Up Modal */}
            <TopUpModal
                isOpen={isTopUpModalOpen}
                onClose={() => setIsTopUpModalOpen(false)}
            />
        </div>
    );
};
