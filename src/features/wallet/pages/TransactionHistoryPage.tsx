import { useState } from 'react';
import { Sidebar, StatusBadge, MobileHeader } from '../components';
import type { Transaction } from '../types';
import { TransactionStatus, TransactionType } from '../types';
import { getTransactionTypeIcon, getTransactionTypeLabel } from '../utils/transactionHelpers';
import { formatDate, formatTime } from '../utils/formatters';
import {
    HISTORY_TEXT,
    TABLE_HEADERS,
    FILTER_TEXT,
    TRANSACTION_STATUS_LABELS,
    TRANSACTION_TYPE_LABELS,
    ICONS,
} from '../constants';

export const TransactionHistoryPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const transactions: Transaction[] = [
        {
            id: 'TXN-88291-ABX',
            date: '2023-10-24T14:20:12Z',
            description: 'Amazon.com Services',
            amount: -124.5,
            currency: 'USD',
            status: TransactionStatus.SUCCESS,
            type: TransactionType.SUBSCRIPTION,
        },
        {
            id: 'TXN-99102-QRT',
            date: '2023-10-24T12:05:44Z',
            description: 'Mastercard ****4421',
            amount: 500.0,
            currency: 'USD',
            status: TransactionStatus.SUCCESS,
            type: TransactionType.TOP_UP,
        },
        {
            id: 'TXN-77210-LMN',
            date: '2023-10-23T09:15:30Z',
            description: 'Alice Johnson',
            amount: -50.0,
            currency: 'USD',
            status: TransactionStatus.PENDING,
            type: TransactionType.TRANSFER,
        },
        {
            id: 'TXN-66192-XYZ',
            date: '2023-10-22T18:44:10Z',
            description: 'Steam Store',
            amount: -29.99,
            currency: 'USD',
            status: TransactionStatus.FAILED,
            type: TransactionType.SUBSCRIPTION,
        },
        {
            id: 'TXN-55018-JKL',
            date: '2023-10-22T11:30:05Z',
            description: '0x71C7...5aE2',
            amount: -200.0,
            currency: 'USD',
            status: TransactionStatus.SUCCESS,
            type: TransactionType.TRANSFER,
        },
    ];

    const filteredTransactions = transactions.filter((txn) =>
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredTransactions.length / 10);
    const startIndex = (currentPage - 1) * 10;
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + 10);

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentPath="/history"
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#1a202c]">
                {/* Mobile Header */}
                <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Page Content */}
                <div className="container mx-auto max-w-7xl px-4 md:px-8 py-8 flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold text-white">{HISTORY_TEXT.PAGE_TITLE}</h1>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-[#2d3748] hover:bg-[#3d4758] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">{ICONS.DOWNLOAD}</span>
                                {HISTORY_TEXT.EXPORT_CSV}
                            </button>
                            <button className="px-4 py-2 bg-[#0df2f2] hover:bg-[#0dd9d9] text-[#0a0f1a] rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">{ICONS.ADD}</span>
                                {HISTORY_TEXT.NEW_TRANSACTION}
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                                {ICONS.SEARCH}
                            </span>
                            <input
                                type="text"
                                placeholder={HISTORY_TEXT.SEARCH_PLACEHOLDER}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-[#2d3748] border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0df2f2] focus:border-transparent"
                            />
                        </div>

                        {/* Filter Dropdowns */}
                        <select className="px-4 py-2.5 bg-[#2d3748] border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0df2f2] focus:border-transparent cursor-pointer">
                            <option>{FILTER_TEXT.ALL_DATES}</option>
                            <option>{FILTER_TEXT.TODAY}</option>
                            <option>{FILTER_TEXT.LAST_7_DAYS}</option>
                            <option>{FILTER_TEXT.LAST_30_DAYS}</option>
                            <option>{FILTER_TEXT.LAST_90_DAYS}</option>
                        </select>

                        <select className="px-4 py-2.5 bg-[#2d3748] border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0df2f2] focus:border-transparent cursor-pointer">
                            <option>{FILTER_TEXT.ALL_STATUS}</option>
                            <option>{TRANSACTION_STATUS_LABELS.SUCCESS}</option>
                            <option>{TRANSACTION_STATUS_LABELS.PENDING}</option>
                            <option>{TRANSACTION_STATUS_LABELS.FAILED}</option>
                        </select>

                        <select className="px-4 py-2.5 bg-[#2d3748] border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0df2f2] focus:border-transparent cursor-pointer">
                            <option>{FILTER_TEXT.ALL_TYPES}</option>
                            <option>{TRANSACTION_TYPE_LABELS.SUBSCRIPTION}</option>
                            <option>{TRANSACTION_TYPE_LABELS.TOP_UP}</option>
                            <option>{TRANSACTION_TYPE_LABELS.TRANSFER}</option>
                            <option>{TRANSACTION_TYPE_LABELS.EARNING}</option>
                        </select>
                    </div>

                    {/* Transaction Table */}
                    <div className="bg-[#162032] rounded-xl border border-slate-800 overflow-hidden">
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
                                            {TABLE_HEADERS.RECIPIENT_SOURCE}
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
                                    {paginatedTransactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                                {HISTORY_TEXT.NO_TRANSACTIONS}
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedTransactions.map((txn) => (
                                            <tr key={txn.id} className="hover:bg-[#1a2538] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-white">
                                                            {formatDate(txn.date)}
                                                        </span>
                                                        <span className="text-xs text-slate-400">
                                                            {formatTime(txn.date)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-mono text-[#0df2f2]">
                                                        {txn.id}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[20px] text-slate-400">
                                                            {getTransactionTypeIcon(txn.type)}
                                                        </span>
                                                        <span className="text-sm text-white">
                                                            {getTransactionTypeLabel(txn.type)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-white">
                                                        {txn.description}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`text-sm font-semibold ${txn.amount >= 0 ? 'text-emerald-400' : 'text-white'}`}>
                                                        {txn.amount >= 0 ? '+' : ''}{txn.amount.toFixed(2)} {txn.currency}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <StatusBadge status={txn.status} />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {filteredTransactions.length > 0 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">
                                {HISTORY_TEXT.SHOWING} {startIndex + 1} {HISTORY_TEXT.TO} {Math.min(startIndex + 10, filteredTransactions.length)} {HISTORY_TEXT.OF} {filteredTransactions.length} {HISTORY_TEXT.TRANSACTIONS}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-[#2d3748] hover:bg-[#3d4758] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-[18px]">{ICONS.CHEVRON_LEFT}</span>
                                    {HISTORY_TEXT.PREVIOUS}
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`size-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                ? 'bg-[#0df2f2] text-[#0a0f1a]'
                                                : 'bg-[#2d3748] hover:bg-[#3d4758] text-white'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-[#2d3748] hover:bg-[#3d4758] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
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
