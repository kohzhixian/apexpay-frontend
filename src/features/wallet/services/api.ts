import type { BalanceData, Transaction } from '../types';

const API_BASE_URL = '/api/wallet';
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Helper function to handle fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Fetch balance data
export async function fetchBalance(): Promise<BalanceData> {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/balance`);

        if (response.status === 401) {
            // Redirect to login on authentication error
            window.location.href = '/login';
            throw new Error('Authentication required');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please try again.');
            }
            throw error;
        }
        throw new Error('An unexpected error occurred');
    }
}

// Fetch transactions
export async function fetchTransactions(limit: number = 10, offset: number = 0): Promise<{
    transactions: Transaction[];
    total: number;
    hasMore: boolean;
}> {
    try {
        const response = await fetchWithTimeout(
            `${API_BASE_URL}/transactions?limit=${limit}&offset=${offset}`
        );

        if (response.status === 401) {
            // Redirect to login on authentication error
            window.location.href = '/login';
            throw new Error('Authentication required');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please try again.');
            }
            throw error;
        }
        throw new Error('An unexpected error occurred');
    }
}
