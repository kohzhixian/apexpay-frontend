import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BalanceData, Transaction } from '../types';
import { TransactionStatus, TransactionType } from '../types';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { BalanceCard } from '../components/BalanceCard';
import { QuickActionButton } from '../components/QuickActionButton';
import { TransactionTable } from '../components/TransactionTable';
import { TopUpModal } from '../components/TopUpModal';
import { APP_NAME, DASHBOARD_TEXT, QUICK_ACTIONS, QUICK_ACTION_ICONS } from '../constants/text';

export const DashboardPage = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoadingBalance, setIsLoadingBalance] = useState(true);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
    const [transactionsError, setTransactionsError] = useState<string | null>(null);

    // Mock data for now (will be replaced with API calls)
    useEffect(() => {
        // Set balance data immediately
        setBalanceData({
            availableBalance: 12450.0,
            reservedBalance: 450.0,
            currency: 'USD',
            availableChangePercent: 2.5,
            isReservedLocked: true,
            lastUpdated: new Date().toISOString(),
        });
        setIsLoadingBalance(false);

        // Set transactions immediately
        setTransactions([
            {
                id: '1',
                date: '2023-02-24T10:42:00Z',
                description: 'Netflix Subscription',
                amount: -15.99,
                currency: 'USD',
                status: TransactionStatus.SUCCESS,
                type: TransactionType.SUBSCRIPTION,
            },
            {
                id: '2',
                date: '2023-02-23T20:15:00Z',
                description: 'John Doe Transfer',
                amount: 500.0,
                currency: 'USD',
                status: TransactionStatus.PENDING,
                type: TransactionType.TRANSFER,
            },
            {
                id: '3',
                date: '2023-02-21T15:30:00Z',
                description: 'Server Cost',
                amount: -120.0,
                currency: 'USD',
                status: TransactionStatus.FAILED,
                type: TransactionType.SUBSCRIPTION,
            },
            {
                id: '4',
                date: '2023-02-20T11:00:00Z',
                description: 'Upwork Earnings',
                amount: 1200.0,
                currency: 'USD',
                status: TransactionStatus.SUCCESS,
                type: TransactionType.EARNING,
            },
            {
                id: '5',
                date: '2023-02-18T09:12:00Z',
                description: 'Spotify',
                amount: -9.99,
                currency: 'USD',
                status: TransactionStatus.SUCCESS,
                type: TransactionType.SUBSCRIPTION,
            },
        ]);
        setIsLoadingTransactions(false);
    }, []);

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
        setTransactionsError(null);
        setIsLoadingTransactions(true);
        // Retry logic here
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
                    <DashboardHeader userName="Alex" />

                    {/* Balance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isLoadingBalance ? (
                            <>
                                <div className="h-40 bg-slate-700 animate-pulse rounded-2xl" />
                                <div className="h-40 bg-slate-700 animate-pulse rounded-2xl" />
                            </>
                        ) : balanceData ? (
                            <>
                                <BalanceCard
                                    title={DASHBOARD_TEXT.AVAILABLE_BALANCE}
                                    amount={balanceData.availableBalance}
                                    currency={balanceData.currency}
                                    changePercent={balanceData.availableChangePercent}
                                    variant="available"
                                />
                                <BalanceCard
                                    title={DASHBOARD_TEXT.RESERVED_BALANCE}
                                    amount={balanceData.reservedBalance}
                                    currency={balanceData.currency}
                                    isLocked={balanceData.isReservedLocked}
                                    variant="reserved"
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
                            error={transactionsError}
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
