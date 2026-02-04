import { useState, useCallback, useEffect } from 'react';
import { InitiatePaymentPanel } from '../components/InitiatePaymentPanel';
import { PaymentMethodsPanel } from '../components/PaymentMethodsPanel';
import { ProcessStatusPanel } from '../components/ProcessStatusPanel';
import { DebugPanel } from '../components/DebugPanel';
import { StatsBar } from '../components/StatsBar';
import { Sidebar } from '../../wallet/components/Sidebar';
import { MobileHeader } from '../../wallet/components/MobileHeader';
import { useGetWalletQuery } from '../../wallet/services/walletApi';
import { useInitiatePaymentMutation, useProcessPaymentMutation } from '../services/paymentApi';
import { useGetPaymentMethodsQuery } from '../services/paymentMethodApi';
import { DEFAULT_MOCK_PAYMENT_METHODS, PaymentDevToolsText } from '../constants';
import { CurrencyEnum } from '../../wallet/types';
import { PaymentStatusEnum } from '../types';
import type { PaymentStatusEnum as PaymentStatusEnumType, PaymentState, DebugLogEntry } from '../types';

/**
 * Generates a random request ID for idempotency
 */
const generateRequestId = () => `${PaymentDevToolsText.REQUEST_ID_PREFIX}${Math.random().toString(36).substring(2, 15)}`;

/**
 * Gets current timestamp in HH:MM:SS.ms format
 */
const getTimestamp = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(2, '0').substring(0, 2)}`;
};

/**
 * Gets current datetime in ISO format for display
 */
const getISODateTime = () => {
    return new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
};

/**
 * Payment DevTools Page - Payment testing interface
 */
export const PaymentDevToolsPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Fetch user's wallets from API
    const { data: wallets = [], isLoading: isLoadingWallets } = useGetWalletQuery();

    // Initiate payment mutation
    const [initiatePayment, { isLoading: isInitiating }] = useInitiatePaymentMutation();

    // Process payment mutation
    const [processPayment, { isLoading: isProcessingPayment }] = useProcessPaymentMutation();

    // Fetch real payment methods
    const { data: realPaymentMethods = [], isLoading: isLoadingPaymentMethods } = useGetPaymentMethodsQuery();

    // Panel 1 state
    const [selectedWalletId, setSelectedWalletId] = useState<string>('');
    const [amount, setAmount] = useState('100.00');
    const [clientRequestId, setClientRequestId] = useState(generateRequestId());

    // Set default selected wallet when wallets are loaded
    useEffect(() => {
        if (wallets.length > 0 && !selectedWalletId) {
            setSelectedWalletId(wallets[0].walletId);
        }
    }, [wallets, selectedWalletId]);

    // Panel 2 state - default to first real payment method if available, otherwise first mock
    const [selectedMethodId, setSelectedMethodId] = useState<string>('');

    // Set default selected payment method when methods are loaded
    // Wait for real payment methods to finish loading before setting default
    useEffect(() => {
        if (!selectedMethodId && !isLoadingPaymentMethods) {
            if (realPaymentMethods.length > 0) {
                setSelectedMethodId(realPaymentMethods[0].id);
            } else if (DEFAULT_MOCK_PAYMENT_METHODS.length > 0) {
                setSelectedMethodId(DEFAULT_MOCK_PAYMENT_METHODS[0].id);
            }
        }
    }, [realPaymentMethods, selectedMethodId, isLoadingPaymentMethods]);

    // Panel 3 state
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [status, setStatus] = useState<PaymentStatusEnumType | null>(null);
    const [paymentState, setPaymentState] = useState<PaymentState | null>(null);
    const [initiatedAt, setInitiatedAt] = useState<string | null>(null);

    // Processing states
    const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);

    // Debug logs
    const [logs, setLogs] = useState<DebugLogEntry[]>([]);
    const [filterTag, setFilterTag] = useState('');

    /**
     * Adds a new log entry
     */
    const addLog = useCallback((log: Omit<DebugLogEntry, 'id'>) => {
        setLogs(prev => [...prev, { ...log, id: `log_${Date.now()}_${Math.random()}` }]);
    }, []);

    /**
     * Handles creating a payment intent via API
     */
    const handleCreateIntent = useCallback(async () => {
        const amountNum = parseFloat(amount) || 0;

        // Log the API request
        addLog({
            timestamp: getTimestamp(),
            type: 'POST',
            title: PaymentDevToolsText.API_PAYMENT_ENDPOINT,
            details: PaymentDevToolsText.LOG_INITIATING_PAYMENT(amountNum.toFixed(2), PaymentDevToolsText.CURRENCY_SGD),
        });

        try {
            const response = await initiatePayment({
                amount: amountNum,
                walletId: selectedWalletId,
                currency: CurrencyEnum.SGD,
                clientRequestId,
            }).unwrap();

            // Log successful initiation
            addLog({
                timestamp: getTimestamp(),
                type: 'WALLET_RESERVE',
                title: PaymentDevToolsText.LOG_PAYMENT_INITIATED(response.paymentId),
                subDetails: [
                    { label: PaymentDevToolsText.LOG_DETAIL_AMOUNT, value: `${amountNum.toFixed(2)}` },
                    { label: PaymentDevToolsText.LOG_DETAIL_STATUS, value: PaymentDevToolsText.STATUS_INITIATED, status: 'success' },
                ],
            });

            // Update state with response data
            setPaymentId(response.paymentId);
            setStatus(PaymentStatusEnum.INITIATED);
            setInitiatedAt(getISODateTime());
            setIsPaymentInitiated(true);
            setPaymentState({
                id: response.paymentId,
                status: 'initiated',
                amount: amountNum * 100,
                currency: PaymentDevToolsText.CURRENCY_SGD,
                metadata: {
                    test_mode: false,
                    sdk_version: '3.4.1',
                },
            });
        } catch (error) {
            console.error('Failed to initiate payment:', error);
            addLog({
                timestamp: getTimestamp(),
                type: 'POST',
                title: `${PaymentDevToolsText.API_PAYMENT_ENDPOINT} - FAILED`,
                details: PaymentDevToolsText.LOG_FAILED_TO_INITIATE,
            });
        }
    }, [selectedWalletId, amount, clientRequestId, initiatePayment, addLog]);


    /**
     * Handles processing the payment via API
     */
    const handleProcessPayment = useCallback(async () => {
        if (!paymentId) return;

        console.log('[DEBUG] handleProcessPayment called with:', {
            paymentId,
            selectedMethodId,
            selectedWalletId,
        });

        // Log the process request
        addLog({
            timestamp: getTimestamp(),
            type: 'POST',
            title: PaymentDevToolsText.API_PROCESS_ENDPOINT(paymentId),
            details: PaymentDevToolsText.LOG_PROCESSING_WITH_METHOD(selectedMethodId),
        });

        try {
            console.log('[DEBUG] Calling processPayment mutation...');
            const response = await processPayment({
                paymentId,
                paymentMethodId: selectedMethodId,
            }).unwrap();

            console.log('[DEBUG] processPayment response:', response);
            console.log('[DEBUG] response.status:', response.status);
            console.log('[DEBUG] response.status type:', typeof response.status);
            console.log('[DEBUG] PaymentStatusEnum.SUCCESS:', PaymentStatusEnum.SUCCESS);
            console.log('[DEBUG] Are they equal?:', response.status === PaymentStatusEnum.SUCCESS);

            // Find selected wallet to calculate new balance
            const selectedWallet = wallets.find(w => w.walletId === selectedWalletId);
            const previousBalance = selectedWallet?.balance ?? 0;
            // Use response amount if available, otherwise fall back to the input amount
            const paymentAmount = response.amount ?? parseFloat(amount) ?? 0;
            const newBalance = previousBalance - paymentAmount;

            console.log('[DEBUG] Wallet calculation:', {
                selectedWallet,
                previousBalance,
                newBalance,
                responseAmount: response.amount,
                fallbackAmount: paymentAmount,
            });

            // Log based on response status
            if (response.status === PaymentStatusEnum.SUCCESS) {
                console.log('[DEBUG] Status matched SUCCESS, adding success log');
                addLog({
                    timestamp: getTimestamp(),
                    type: 'WALLET_CONFIRM',
                    title: PaymentDevToolsText.LOG_PAYMENT_COMPLETED,
                    subDetails: [
                        { label: PaymentDevToolsText.LOG_DETAIL_AMOUNT, value: `${paymentAmount.toFixed(2)}`, isAmount: true },
                        { label: PaymentDevToolsText.LOG_DETAIL_NEW_BALANCE, value: `${newBalance.toFixed(2)} ${PaymentDevToolsText.CURRENCY_SGD}` },
                        { label: PaymentDevToolsText.LOG_DETAIL_STATUS, value: PaymentStatusEnum.SUCCESS, status: 'success' },
                    ],
                });
            } else if (response.status === PaymentStatusEnum.PENDING) {
                console.log('[DEBUG] Status matched PENDING');
                addLog({
                    timestamp: getTimestamp(),
                    type: 'PROVIDER_MOCK',
                    title: PaymentDevToolsText.LOG_PAYMENT_PENDING,
                    details: PaymentDevToolsText.AWAITING_PROVIDER_RESPONSE,
                });
            } else if (response.status === PaymentStatusEnum.FAILED) {
                console.log('[DEBUG] Status matched FAILED');
                addLog({
                    timestamp: getTimestamp(),
                    type: 'WEBHOOK_SENT',
                    title: PaymentDevToolsText.LOG_PAYMENT_FAILED,
                    details: response.message || PaymentDevToolsText.LOG_PAYMENT_DECLINED,
                });
            } else {
                console.log('[DEBUG] Status did not match any known status:', response.status);
            }

            // Update state with response data
            console.log('[DEBUG] Updating state with status:', response.status);
            setStatus(response.status);
            setPaymentState(prev => prev ? {
                ...prev,
                status: response.status.toLowerCase(),
            } : null);
        } catch (error) {
            console.error('[DEBUG] Caught error in processPayment:', error);
            console.error('[DEBUG] Error type:', typeof error);
            console.error('[DEBUG] Error stringified:', JSON.stringify(error, null, 2));
            addLog({
                timestamp: getTimestamp(),
                type: 'POST',
                title: PaymentDevToolsText.API_PROCESS_FAILED_ENDPOINT(paymentId),
                details: PaymentDevToolsText.LOG_FAILED_TO_PROCESS,
            });
            setStatus(PaymentStatusEnum.FAILED);
            setPaymentState(prev => prev ? {
                ...prev,
                status: 'failed',
            } : null);
        }
    }, [paymentId, selectedMethodId, processPayment, addLog, wallets, selectedWalletId, amount]);

    /**
     * Handles checking payment status
     */
    const handleCheckStatus = useCallback(() => {
        setIsCheckingStatus(true);

        addLog({
            timestamp: getTimestamp(),
            type: 'GET',
            title: PaymentDevToolsText.API_STATUS_ENDPOINT,
            details: PaymentDevToolsText.LOG_STATUS_QUERIED(String(status)),
        });

        setTimeout(() => {
            setIsCheckingStatus(false);
        }, 500);
    }, [status, addLog]);

    /**
     * Handles voiding the payment
     */
    const handleVoid = useCallback(() => {
        setStatus(PaymentStatusEnum.REFUNDED);
        setPaymentState(prev => prev ? { ...prev, status: 'refunded' } : null);

        addLog({
            timestamp: getTimestamp(),
            type: 'POST',
            title: PaymentDevToolsText.API_VOID_ENDPOINT,
            details: PaymentDevToolsText.LOG_PAYMENT_VOIDED(paymentId || ''),
        });
    }, [paymentId, addLog]);

    /**
     * Refreshes the client request ID
     */
    const handleRefreshRequestId = useCallback(() => {
        setClientRequestId(generateRequestId());
    }, []);

    // Show loading state while fetching wallets
    if (isLoadingWallets) {
        return (
            <div className="flex h-screen bg-[#0a0e14] overflow-hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    currentPath="/payment"
                />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-slate-400">{PaymentDevToolsText.LOADING_WALLETS}</div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#0a0e14] overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentPath="/payment"
            />

            <main className="flex-1 flex flex-col overflow-hidden">
                <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

                <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
                    {/* Main Grid Layout */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
                        {/* Left Column: Panel 1 & 2 */}
                        <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
                            <InitiatePaymentPanel
                                wallets={wallets}
                                selectedWalletId={selectedWalletId}
                                onWalletChange={setSelectedWalletId}
                                amount={amount}
                                onAmountChange={setAmount}
                                clientRequestId={clientRequestId}
                                onRefreshRequestId={handleRefreshRequestId}
                                onCreateIntent={handleCreateIntent}
                                onProcessPayment={handleProcessPayment}
                                isPaymentInitiated={isPaymentInitiated}
                                isProcessing={isProcessingPayment}
                                isPaymentComplete={status === PaymentStatusEnum.SUCCESS || status === PaymentStatusEnum.FAILED || status === PaymentStatusEnum.REFUNDED}
                                isInitiating={isInitiating}
                            />
                            <PaymentMethodsPanel
                                selectedMethodId={selectedMethodId}
                                onMethodChange={setSelectedMethodId}
                                realPaymentMethods={realPaymentMethods}
                                isLoadingRealMethods={isLoadingPaymentMethods}
                            />
                        </div>

                        {/* Middle Column: Panel 3 */}
                        <div className="lg:col-span-5 min-h-0">
                            <ProcessStatusPanel
                                paymentId={paymentId}
                                status={status}
                                paymentState={paymentState}
                                initiatedAt={initiatedAt}
                                onCheckStatus={handleCheckStatus}
                                onVoid={handleVoid}
                                isCheckingStatus={isCheckingStatus}
                            />
                        </div>

                        {/* Right Column: Panel 4 */}
                        <div className="lg:col-span-4 min-h-0">
                            <DebugPanel
                                logs={logs}
                                filterTag={filterTag}
                                onFilterChange={setFilterTag}
                            />
                        </div>
                    </div>

                    {/* Bottom Stats Bar */}
                    <StatsBar />
                </div>
            </main>
        </div>
    );
};
