import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sidebar, MobileHeader } from '../components';
import { TransactionTypeEnum } from '../types';
import { useGetTransactionHistoryQuery, useGetWalletQuery } from '../services/walletApi';
import { getReferenceTypeIcon, getReferenceTypeLabel, getWalletTransactionStatusConfig } from '../utils/transactionHelpers';
import { formatDate, formatTime, formatCurrency } from '../utils/formatters';
import {
    HISTORY_TEXT,
    TABLE_HEADERS,
    ICONS,
    TRANSACTION_HISTORY_TEXT,
    DYNAMIC_TEXT,
} from '../constants';

/**
 * Transaction History Page
 * Displays paginated transaction history with optional wallet filtering
 * Supports URL query param ?walletId=xxx for filtering by specific wallet
 */
export const TransactionHistoryPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Get walletId from URL query params (optional filter)
    const walletIdFilter = searchParams.get('walletId') || undefined;

    // Fetch wallet data to get wallet name for filter display
    const { data: wallets } = useGetWalletQuery();
    const selectedWallet = walletIdFilter
        ? wallets?.find((w) => w.walletId === walletIdFilter)
        : undefined;

    // Fetch transaction history with optional wallet filter
    const {
        data: transactions = [],
        isLoading,
        isError,
        refetch,
    } = useGetTransactionHistoryQuery({
        walletId: walletIdFilter,
        offset: currentPage,
    });

    // Filter transactions by search query (client-side)
    const filteredTransactions = transactions.filter((txn) =>
        txn.transactionReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.walletName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /**
     * Clears the wallet filter and shows all transactions
     */
    const handleClearWalletFilter = () => {
        setSearchParams({});
        setCurrentPage(1);
    };

    /**
     * Handles page change for pagination
     * @param page - The page number to navigate to
     */
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentPath="/history"
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0a0f1a]">
                {/* Mobile Header */}
                <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Page Content */}
                <div className="container mx-auto max-w-7xl px-4 md:px-8 py-8 flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-bold text-white">{HISTORY_TEXT.PAGE_TITLE}</h1>
                            {selectedWallet && (
                                <p className="text-sm text-slate-400">
                                    {TRANSACTION_HISTORY_TEXT.SHOWING_TRANSACTIONS_FOR(selectedWallet.name)}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-[#161E2C] hover:bg-[#1e2a3c] border border-slate-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">{ICONS.DOWNLOAD}</span>
                                {HISTORY_TEXT.EXPORT_CSV}
                            </button>
                        </div>
                    </div>

                    {/* Wallet Filter Chip */}
                    {selectedWallet && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400">{TRANSACTION_HISTORY_TEXT.FILTERED_BY}</span>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                <span className="material-symbols-outlined text-blue-500 text-[16px]">
                                    account_balance_wallet
                                </span>
                                <span className="text-sm font-medium text-blue-500">
                                    {selectedWallet.name}
                                </span>
                                <button
                                    onClick={handleClearWalletFilter}
                                    className="p-0.5 hover:bg-blue-500/20 rounded-full transition-colors"
                                    aria-label="Clear wallet filter"
                                >
                                    <span className="material-symbols-outlined text-blue-500 text-[16px]">
                                        close
                                    </span>
                                </button>
                            </div>
                            <Link
                                to={`/wallets/${walletIdFilter}`}
                                className="text-sm text-slate-400 hover:text-blue-500 transition-colors"
                            >
                                {TRANSACTION_HISTORY_TEXT.VIEW_WALLET}
                            </Link>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                                {ICONS.SEARCH}
                            </span>
                            <input
                                type="text"
                                placeholder={HISTORY_TEXT.SEARCH_PLACEHOLDER}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-[#161E2C] border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Transaction Table */}
                    <div className="bg-[#161E2C] rounded-xl border border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-800">
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {TABLE_HEADERS.DATE}
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {TABLE_HEADERS.TRANSACTION_ID}
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {TABLE_HEADERS.TYPE}
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {TRANSACTION_HISTORY_TEXT.WALLET_HEADER}
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {TABLE_HEADERS.DESCRIPTION}
                                        </th>
                                        <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {TABLE_HEADERS.AMOUNT}
                                        </th>
                                        <th className="text-center px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {TABLE_HEADERS.STATUS}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center">
                                                <div className="flex items-center justify-center gap-2 text-slate-400">
                                                    <span className="material-symbols-outlined animate-spin">
                                                        progress_activity
                                                    </span>
                                                    {TRANSACTION_HISTORY_TEXT.LOADING}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : isError ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <span className="material-symbols-outlined text-red-500">
                                                        error
                                                    </span>
                                                    <p>{TRANSACTION_HISTORY_TEXT.FAILED_TO_LOAD}</p>
                                                    <button
                                                        onClick={() => refetch()}
                                                        className="text-blue-500 hover:underline text-sm"
                                                    >
                                                        {TRANSACTION_HISTORY_TEXT.TRY_AGAIN}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredTransactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                                {HISTORY_TEXT.NO_TRANSACTIONS}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTransactions.map((txn) => {
                                            const statusConfig = getWalletTransactionStatusConfig(txn.status);
                                            const isCredit = txn.transactionType === TransactionTypeEnum.CREDIT;

                                            return (
                                                <tr key={txn.transactionId} className="hover:bg-[#1a2538] transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-white">
                                                                {formatDate(txn.createdAt)}
                                                            </span>
                                                            <span className="text-xs text-slate-400">
                                                                {formatTime(txn.createdAt)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-mono text-blue-400">
                                                            {txn.transactionReference}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-[20px] text-slate-400">
                                                                {getReferenceTypeIcon(txn.referenceType)}
                                                            </span>
                                                            <span className="text-sm text-white">
                                                                {getReferenceTypeLabel(txn.referenceType)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            to={`/wallets/${txn.walletId}`}
                                                            className="text-sm text-slate-300 hover:text-blue-400 transition-colors"
                                                        >
                                                            {txn.walletName}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-white">
                                                            {txn.description}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`text-sm font-semibold ${isCredit ? 'text-green-400' : 'text-white'}`}>
                                                            {isCredit ? '+' : '-'}
                                                            {formatCurrency(Math.abs(txn.amount), txn.currency)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                                            <span className="size-1.5 rounded-full bg-current" />
                                                            {statusConfig.label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {filteredTransactions.length > 0 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">
                                {DYNAMIC_TEXT.PAGINATION_INFO(currentPage, filteredTransactions.length)}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-[#161E2C] hover:bg-[#1e2a3c] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1 border border-slate-700"
                                >
                                    <span className="material-symbols-outlined text-[18px]">{ICONS.CHEVRON_LEFT}</span>
                                    {HISTORY_TEXT.PREVIOUS}
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={filteredTransactions.length < 10}
                                    className="px-4 py-2 bg-[#161E2C] hover:bg-[#1e2a3c] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1 border border-slate-700"
                                >
                                    {HISTORY_TEXT.NEXT}
                                    <span className="material-symbols-outlined text-[18px]">{ICONS.CHEVRON_RIGHT}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
