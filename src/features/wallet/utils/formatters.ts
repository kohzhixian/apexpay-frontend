// Currency formatting utility
export function formatCurrency(amount: number, currency: string = 'USD'): string {
    const currencySymbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
    };

    const symbol = currencySymbols[currency] || '$';
    const formattedAmount = Math.abs(amount).toFixed(2);
    const [whole, decimal] = formattedAmount.split('.');

    // Add thousand separators
    const wholeWithSeparators = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return `${symbol}${wholeWithSeparators}.${decimal}`;
}

// Date formatting utility
export function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };

        return date.toLocaleDateString('en-US', options);
    } catch {
        return 'Invalid date';
    }
}

// Time formatting utility
export function formatTime(dateString: string): string {
    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return 'Invalid time';
        }

        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };

        return date.toLocaleTimeString('en-US', options);
    } catch {
        return 'Invalid time';
    }
}

// Combined date and time formatting
export function formatDateTime(dateString: string): string {
    const date = formatDate(dateString);
    const time = formatTime(dateString);

    if (date === 'Invalid date' || time === 'Invalid time') {
        return 'Invalid date';
    }

    return `${date} • ${time}`;
}
