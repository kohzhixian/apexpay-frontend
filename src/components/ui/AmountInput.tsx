interface AmountInputProps {
    value: string;
    onChange: (value: string) => void;
    currency?: string;
    onCurrencyChange?: (currency: string) => void;
    currencies?: readonly string[];
    placeholder?: string;
    showCurrencySelector?: boolean;
    autoFocus?: boolean;
    className?: string;
}

export const AmountInput = ({
    value,
    onChange,
    currency = 'SGD',
    onCurrencyChange,
    currencies = ['SGD', 'USD', 'EUR', 'GBP'],
    placeholder = '0.00',
    showCurrencySelector = true,
    autoFocus = false,
    className = '',
}: AmountInputProps) => {
    return (
        <div className={`relative flex items-center group ${className}`}>
            <div className="absolute left-0 inset-y-0 flex items-center pl-4 pointer-events-none z-10">
                <span className="text-[#90a4cb] text-2xl font-medium">$</span>
            </div>
            <input
                autoFocus={autoFocus}
                autoComplete="off"
                className="w-full bg-[#101623] text-white text-3xl font-bold py-4 pl-10 pr-24 rounded-xl border border-[#314368] focus:border-primary focus:ring-1 focus:ring-primary placeholder-[#314368] transition-all outline-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder={placeholder}
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {showCurrencySelector && onCurrencyChange && (
                <div className="absolute right-2 inset-y-2">
                    <select
                        className="h-full bg-[#222f49] text-white text-sm font-medium border-none rounded-lg focus:ring-0 outline-none focus:outline-none px-3 cursor-pointer hover:bg-[#314368] transition-colors appearance-none"
                        value={currency}
                        onChange={(e) => onCurrencyChange(e.target.value)}
                    >
                        {currencies.map((curr) => (
                            <option key={curr} value={curr}>
                                {curr}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};
