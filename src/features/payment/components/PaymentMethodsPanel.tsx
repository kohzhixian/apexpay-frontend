import { PaymentDevToolsText, DEFAULT_MOCK_PAYMENT_METHODS } from '../constants';
import type { MockPaymentMethod, PaymentMethodResponse } from '../types';

interface PaymentMethodsPanelProps {
    /** Currently selected payment method ID */
    selectedMethodId: string;
    /** Callback when payment method selection changes */
    onMethodChange: (methodId: string) => void;
    /** Real payment methods from the database */
    realPaymentMethods?: PaymentMethodResponse[];
    /** Whether real payment methods are loading */
    isLoadingRealMethods?: boolean;
    /** Custom mock methods to add */
    customMethods?: MockPaymentMethod[];
    /** Callback to add custom provider */
    onAddCustomProvider?: () => void;
}

/**
 * Returns the badge text and color based on token type
 */
const getTokenBadge = (tokenType: MockPaymentMethod['tokenType']) => {
    switch (tokenType) {
        case 'success':
            return { text: PaymentDevToolsText.SUCCESS_MOCK, color: 'text-emerald-400' };
        case 'error':
            return { text: PaymentDevToolsText.ERROR_MOCK, color: 'text-red-400' };
        case 'pending':
            return { text: PaymentDevToolsText.PENDING_MOCK, color: 'text-blue-400' };
    }
};

/**
 * Panel 2: Payment Methods & Mock Tokens - List of real and mock payment methods
 */
export const PaymentMethodsPanel = ({
    selectedMethodId,
    onMethodChange,
    realPaymentMethods = [],
    isLoadingRealMethods = false,
    customMethods = [],
    onAddCustomProvider,
}: PaymentMethodsPanelProps) => {
    const allMockMethods = [...DEFAULT_MOCK_PAYMENT_METHODS, ...customMethods];

    return (
        <div className="bg-[#0d1117] border border-slate-700/50 rounded-xl p-4 flex flex-col gap-3 flex-1 min-h-0 overflow-hidden">
            {/* Panel Header */}
            <div className="flex items-center gap-2">
                <span className="text-blue-400 font-mono text-sm">2</span>
                <h3 className="text-white font-semibold text-sm">{PaymentDevToolsText.PANEL2_TITLE}</h3>
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-auto min-h-0">
                {/* Real Payment Methods Section */}
                <div className="flex flex-col gap-1">
                    <span className="text-slate-400 text-xs font-medium tracking-wider">
                        {PaymentDevToolsText.SAVED_METHODS_LABEL}
                    </span>
                    {isLoadingRealMethods ? (
                        <div className="text-slate-500 text-xs py-2">{PaymentDevToolsText.LOADING_METHODS}</div>
                    ) : realPaymentMethods.length === 0 ? (
                        <div className="text-slate-500 text-xs py-2">{PaymentDevToolsText.NO_SAVED_METHODS}</div>
                    ) : (
                        <div className="flex flex-col gap-0.5">
                            {realPaymentMethods.map((method) => {
                                const isSelected = selectedMethodId === method.id;
                                return (
                                    <label
                                        key={method.id}
                                        className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method.id}
                                            checked={isSelected}
                                            onChange={() => onMethodChange(method.id)}
                                            className="mt-0.5 w-3.5 h-3.5 text-blue-500 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-offset-0"
                                        />
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-white font-medium text-sm">{method.displayName}</span>
                                                {method.isDefault && (
                                                    <span className="text-xs font-semibold text-blue-400">
                                                        {PaymentDevToolsText.DEFAULT_BADGE}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-slate-500 text-xs font-mono">
                                                {method.type === 'CARD' ? `${method.brand} •••• ${method.last4}` : `${method.bankName} •••• ${method.last4}`}
                                            </span>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Mock Tokens Section */}
                <div className="flex flex-col gap-1">
                    <span className="text-slate-400 text-xs font-medium tracking-wider">
                        {PaymentDevToolsText.MOCK_TOKENS_LABEL}
                    </span>
                    <div className="flex flex-col gap-0.5">
                        {allMockMethods.map((method) => {
                            const badge = getTokenBadge(method.tokenType);
                            const isSelected = selectedMethodId === method.id;

                            return (
                                <label
                                    key={method.id}
                                    className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.id}
                                        checked={isSelected}
                                        onChange={() => onMethodChange(method.id)}
                                        className="mt-0.5 w-3.5 h-3.5 text-blue-500 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-offset-0"
                                    />
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-white font-medium text-sm">{method.displayName}</span>
                                            <span className={`text-xs font-semibold ${badge.color}`}>
                                                {badge.text}
                                            </span>
                                        </div>
                                        <span className="text-slate-500 text-xs font-mono truncate">{method.token}</span>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Add Custom Provider */}
            <button
                onClick={onAddCustomProvider}
                className="text-slate-400 hover:text-white text-xs font-medium py-2 px-3 border border-dashed border-slate-700 rounded-lg hover:border-slate-600 transition-colors flex-shrink-0"
            >
                {PaymentDevToolsText.ADD_CUSTOM_PROVIDER}
            </button>
        </div>
    );
};
