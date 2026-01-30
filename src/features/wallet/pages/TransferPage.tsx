import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ContactsModal } from '../components/ContactsModal';
import { TransferProcessingModal } from '../components/TransferProcessingModal';
import { TransferSuccessModal } from '../components/TransferSuccessModal';
import { APP_NAME, TRANSFER_TEXT, ICONS } from '../constants/text';
import { DarkInput, DarkTextarea } from '../../../components/ui';

interface QuickContact {
    id: string;
    name: string;
    avatar: string;
    isOnline?: boolean;
}

interface RecentTransaction {
    id: string;
    name: string;
    icon: string;
    date: string;
    amount: number;
}

export const TransferPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    const quickContacts: QuickContact[] = [
        {
            id: '1',
            name: 'Sarah',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpYFkk4Ak5iCuwKmOldO-35B7EveBbFxbyGvHauD7ZGZBVWCNDElP41MF4cxbrHnIdNwjFRXnEVACvNOzbmrHUPD3e673XK7jehpr7oIaMo8RTFRldwyw4eGM9LIzmWImJI0OJfC6JqAzdjNBvO7olnDV_KQ70ThbBanXPHA3zfAEkmHIF1RYi7zst-Yaw8Hijdb5mcAHtCpZFolzy3y0HZ6HCD7gwJM54W2LMgmByHmkO6fxVvLdOPznJ2VqQSQ-GHWTmI84T5A',
            isOnline: true,
        },
        {
            id: '2',
            name: 'Mike',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXHiNcZjvPQjsqx5WapClV4DoSK2l52B_0u7BEu_YUD5do6upg0CICOV_miCsbfOCat7OmPwvp6f1QhoftA7n1lAdZNYzjiO8k-Ena9zs-tB86hhu3Lr-4GyqTLw42s0K5fq_HWrUC6gxt4r2yPx87_hCuRT25BX_e4dkU5uaG_-QS6XiJj6NsFBk85ggHS1L9hPTLEuAfh4M_YXDChxtLFVAR9uTv0VtoQBWDSAxPD-uiR4-IcVT4f8bOW-i1ZGDH7PuUGY5aFQ',
        },
        {
            id: '3',
            name: 'Jessica',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhRHPRnNlZcsxOH4LQeR8R0i0-u7lvK-hB9YGIEREYjR8M5p4lw2P7xUUu6gM9Zlxh9MVNrPGP6hpZ-CxuThFHwJbb7D6nrjqfnVMPLd6TF5MAWmOJ0bg1TqIjFyZq_vagGigV0xWH1BHzHZGUcshoPDgf50XavXcMFrk2UMXgzdImLmkWbobZwriH23dS8Kc-5KXgkfZQ3K83gUSH3t5doUDqGT1PuMH6Kv12_7SjA0RtvQ-ly-5caNmcGOTsfS86hWHtM4xo5Q',
            isOnline: true,
        },
        {
            id: '4',
            name: 'David',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzJeOl3dyfgW4tRv9hWshmh0Ji-a9N7FL9i_-o5qt44SH_1vxaTo22CF_AFuuxlduoONbyuD225vNn6A0XbPj7EQsh3IPzmW5eNaCjq-jJ7h00_MB12oXstSHvTkD8LQqqO_ypsDhu-iU2sZTDVv7IT7U6fOhKjBFsdHCPUq6YTvJwcBX683YUl2dC3fHbh3NHCcngUF2RTnudSReefOugCX59XMBdFFZU7xEKSH0E4m0LblDOTcrszDkmFmHl9gULp8cwPib3hg',
        },
    ];

    const recentTransactions: RecentTransaction[] = [
        { id: '1', name: 'Apple Store', icon: 'shopping_bag', date: 'Today, 10:23 AM', amount: -1299.0 },
        { id: '2', name: 'Michael T.', icon: 'person', date: 'Yesterday', amount: 450.0 },
        { id: '3', name: 'Netflix', icon: 'movie', date: 'Oct 24, 2023', amount: -15.99 },
        { id: '4', name: 'Uber', icon: 'local_taxi', date: 'Oct 22, 2023', amount: -24.5 },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Transfer submitted:', { recipient, amount, note });
        setIsProcessing(true);
    };

    const handleProcessingComplete = () => {
        setIsProcessing(false);
        setShowSuccess(true);
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        // Reset form
        setRecipient('');
        setAmount('');
        setNote('');
    };

    const handleMaxAmount = () => {
        setAmount('14250.00');
    };

    const totalDeduction = amount ? parseFloat(amount) : 0;

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentPath="/dashboard/transfer"
            />

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
                        <span className="material-symbols-outlined">{ICONS.MENU}</span>
                    </button>
                </div>

                {/* Top Navbar */}
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#223149] bg-[#101723]/90 px-6 backdrop-blur-md lg:px-10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[#8fa6cc] text-sm font-medium">
                            <span>{TRANSFER_TEXT.DASHBOARD}</span>
                            <span className="material-symbols-outlined text-[16px]">{ICONS.CHEVRON_RIGHT}</span>
                            <span className="text-white">{TRANSFER_TEXT.PAGE_TITLE}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fa6cc] material-symbols-outlined text-[20px]">
                                {ICONS.SEARCH}
                            </span>
                            <input
                                className="h-10 w-64 rounded-xl border-none bg-[#223149] pl-10 text-sm text-white placeholder-[#8fa6cc] focus:ring-2 focus:ring-primary outline-none focus:outline-none"
                                placeholder={TRANSFER_TEXT.SEARCH_TRANSACTIONS}
                                type="text"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#223149] text-white hover:bg-[#304669] transition-colors">
                                <span className="material-symbols-outlined text-[20px]">{ICONS.NOTIFICATIONS}</span>
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#223149] text-white hover:bg-[#304669] transition-colors">
                                <span className="material-symbols-outlined text-[20px]">{ICONS.HELP}</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto max-w-6xl p-6 lg:p-10">
                    {/* Page Header */}
                    <div className="mb-8 flex flex-col gap-2">
                        <h2 className="text-3xl font-bold tracking-tight text-white">{TRANSFER_TEXT.PAGE_TITLE}</h2>
                        <p className="text-[#8fa6cc]">
                            {TRANSFER_TEXT.PAGE_DESCRIPTION}
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                        {/* Balance Card */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#2563eb] p-6 shadow-lg shadow-blue-500/20">
                            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-100 font-medium">{TRANSFER_TEXT.AVAILABLE_BALANCE}</span>
                                    <span className="material-symbols-outlined text-blue-100">{ICONS.ACCOUNT_BALANCE}</span>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-white">$14,250.00</h3>
                                    <p className="text-blue-200 text-sm mt-1">{TRANSFER_TEXT.LAST_UPDATED}</p>
                                </div>
                            </div>
                        </div>

                        {/* Limit Card */}
                        <div className="rounded-2xl bg-[#2d3748] border border-[#304669] p-6">
                            <div className="flex flex-col gap-4 h-full justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[#8fa6cc] font-medium">{TRANSFER_TEXT.DAILY_LIMIT}</span>
                                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-400">
                                        {TRANSFER_TEXT.DAILY_LIMIT_ACTIVE}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-end gap-2">
                                        <h3 className="text-2xl font-bold text-white">$2,400</h3>
                                        <span className="text-[#8fa6cc] text-sm mb-1">/ $20,000</span>
                                    </div>
                                    <div className="mt-3 h-2 w-full rounded-full bg-[#101723]">
                                        <div className="h-2 w-[12%] rounded-full bg-emerald-500"></div>
                                    </div>
                                    <p className="mt-2 text-xs text-[#8fa6cc]">12% {TRANSFER_TEXT.DAILY_LIMIT_USED}</p>
                                </div>
                            </div>
                        </div>

                        {/* Exchange Rates Card */}
                        <div className="hidden lg:flex rounded-2xl bg-[#2d3748] border border-[#304669] p-6 flex-col justify-center items-center text-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <span className="material-symbols-outlined">{ICONS.CURRENCY_EXCHANGE}</span>
                            </div>
                            <div>
                                <p className="text-white font-medium">{TRANSFER_TEXT.EXCHANGE_RATES}</p>
                                <p className="text-[#8fa6cc] text-sm">{TRANSFER_TEXT.EXCHANGE_RATES_DESC}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid Layout */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Left Column: Transfer Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Quick Contacts */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">{TRANSFER_TEXT.QUICK_TRANSFER}</h3>
                                    <button
                                        onClick={() => setIsContactsModalOpen(true)}
                                        className="text-sm font-medium text-primary hover:text-blue-400"
                                    >
                                        {TRANSFER_TEXT.VIEW_ALL}
                                    </button>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {/* Add New */}
                                    <button className="group flex flex-col items-center gap-2 min-w-[80px]">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-[#304669] bg-[#101723] text-[#8fa6cc] transition-colors group-hover:border-primary group-hover:text-primary">
                                            <span className="material-symbols-outlined">{ICONS.ADD}</span>
                                        </div>
                                        <span className="text-xs font-medium text-[#8fa6cc] group-hover:text-white">
                                            {TRANSFER_TEXT.NEW_CONTACT}
                                        </span>
                                    </button>

                                    {/* Quick Contacts */}
                                    {quickContacts.map((contact) => (
                                        <button
                                            key={contact.id}
                                            className="group flex flex-col items-center gap-2 min-w-[80px]"
                                        >
                                            <div className="relative">
                                                <div
                                                    className="h-14 w-14 rounded-full bg-cover bg-center border-2 border-transparent group-hover:border-primary transition-all"
                                                    style={{ backgroundImage: `url('${contact.avatar}')` }}
                                                />
                                                {contact.isOnline && (
                                                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[#101723]"></div>
                                                )}
                                            </div>
                                            <span className="text-xs font-medium text-white truncate max-w-full">
                                                {contact.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Form Card */}
                            <div className="bg-[#2d3748] rounded-2xl p-6 lg:p-8 border border-[#304669]">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    {/* Recipient Field */}
                                    <DarkInput
                                        variant="modal"
                                        label={TRANSFER_TEXT.RECIPIENT_LABEL}
                                        leftIcon="alternate_email"
                                        placeholder={TRANSFER_TEXT.RECIPIENT_PLACEHOLDER}
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        rightIcon="qr_code_scanner"
                                        onRightIconClick={() => console.log('QR Scanner')}
                                    />

                                    {/* Amount Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#8fa6cc]">{TRANSFER_TEXT.AMOUNT_LABEL}</label>
                                        <div className="flex items-center rounded-xl px-4 py-4 bg-[#101723]/60 border border-[#304669]/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                            <span className="text-white text-2xl font-semibold mr-1">$</span>
                                            <input
                                                autoComplete="off"
                                                className="w-full bg-transparent border-none p-0 text-3xl font-bold text-white placeholder-[#304669] focus:ring-0 outline-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                placeholder={TRANSFER_TEXT.AMOUNT_PLACEHOLDER}
                                                type="number"
                                                step="0.01"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                            <div className="flex items-center gap-2 border-l border-[#304669] pl-4 ml-2">
                                                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                                    <img
                                                        alt="Singapore Flag"
                                                        className="h-full w-full object-cover"
                                                        src="https://flagcdn.com/w40/sg.png"
                                                    />
                                                </div>
                                                <span className="text-sm font-bold text-white">SGD</span>
                                                <span className="material-symbols-outlined text-[#8fa6cc] text-sm">
                                                    {ICONS.EXPAND_MORE}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-[#8fa6cc] flex justify-between">
                                            <span>{TRANSFER_TEXT.BALANCE_PREFIX}: $14,250.00</span>
                                            <button
                                                type="button"
                                                onClick={handleMaxAmount}
                                                className="text-primary hover:underline"
                                            >
                                                {TRANSFER_TEXT.MAX_AMOUNT}
                                            </button>
                                        </p>
                                    </div>

                                    {/* Note Field */}
                                    <DarkTextarea
                                        variant="modal"
                                        label={TRANSFER_TEXT.NOTE_LABEL}
                                        leftIcon="description"
                                        placeholder={TRANSFER_TEXT.NOTE_PLACEHOLDER}
                                        rows={2}
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />

                                    {/* Breakdown */}
                                    <div className="rounded-xl bg-[#101723]/50 p-4 space-y-3 border border-[#304669]/30">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#8fa6cc]">{TRANSFER_TEXT.TRANSFER_FEE}</span>
                                            <span className="text-white font-medium">$0.00</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#8fa6cc]">{TRANSFER_TEXT.ARRIVAL_TIME}</span>
                                            <span className="text-white font-medium">{TRANSFER_TEXT.ARRIVAL_TIME_VALUE}</span>
                                        </div>
                                        <div className="h-px w-full bg-[#304669]/50 my-2"></div>
                                        <div className="flex justify-between items-center text-base">
                                            <span className="text-white font-semibold">{TRANSFER_TEXT.TOTAL_DEDUCTION}</span>
                                            <span className="text-xl font-bold text-white">
                                                ${totalDeduction.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        className="w-full rounded-xl bg-primary py-4 text-center text-base font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-600 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                                        type="submit"
                                    >
                                        <span>{TRANSFER_TEXT.SEND_TRANSFER}</span>
                                        <span className="material-symbols-outlined text-[20px]">{ICONS.ARROW_FORWARD}</span>
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right Column: Recent/Security */}
                        <div className="space-y-6">
                            {/* Recent Transactions Mini */}
                            <div className="bg-[#2d3748] rounded-2xl p-6 border border-[#304669]">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-white">{TRANSFER_TEXT.RECENT}</h3>
                                    <a className="text-xs font-medium text-primary hover:text-blue-400" href="#">
                                        {TRANSFER_TEXT.VIEW_ALL}
                                    </a>
                                </div>
                                <div className="space-y-5">
                                    {recentTransactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-[#223149] flex items-center justify-center text-white border border-[#304669] group-hover:border-primary transition-colors">
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        {transaction.icon}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">
                                                        {transaction.name}
                                                    </p>
                                                    <p className="text-xs text-[#8fa6cc]">{transaction.date}</p>
                                                </div>
                                            </div>
                                            <span
                                                className={`text-sm font-bold ${transaction.amount > 0 ? 'text-emerald-400' : 'text-white'
                                                    }`}
                                            >
                                                {transaction.amount > 0 ? '+' : ''}$
                                                {Math.abs(transaction.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="rounded-2xl bg-indigo-900/20 border border-indigo-500/20 p-5">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-indigo-400 mt-0.5">
                                        {ICONS.SHIELD_LOCK}
                                    </span>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">{TRANSFER_TEXT.SECURE_TRANSFER}</h4>
                                        <p className="text-xs text-[#8fa6cc] mt-1 leading-relaxed">
                                            {TRANSFER_TEXT.SECURE_TRANSFER_DESC}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Contacts Modal */}
            <ContactsModal
                isOpen={isContactsModalOpen}
                onClose={() => setIsContactsModalOpen(false)}
                onSelectContact={(contact) => {
                    setRecipient(contact.email || contact.phone || contact.handle);
                }}
            />

            {/* Transfer Processing Modal */}
            <TransferProcessingModal
                isOpen={isProcessing}
                amount={amount || '0.00'}
                currency="SGD"
                onComplete={handleProcessingComplete}
            />

            {/* Transfer Success Modal */}
            <TransferSuccessModal
                isOpen={showSuccess}
                amount={amount || '0.00'}
                currency="SGD"
                recipient={recipient || 'Alex Thompson'}
                transactionHash="0x71c...3e21"
                timestamp={new Date().toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })}
                onClose={handleSuccessClose}
            />
        </div>
    );
};
