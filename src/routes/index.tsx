import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginForm, RegisterForm } from '../features/auth/components';
import { DashboardPage, TransactionHistoryPage, WalletsPage, WalletDetailsPage } from '../features/wallet/pages';
import { PaymentDevToolsPage } from '../features/payment/pages';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '/login',
        element: <LoginForm />,
    },
    {
        path: '/register',
        element: <RegisterForm />,
    },
    {
        path: '/dashboard',
        element: <DashboardPage />,
    },
    {
        path: '/dashboard/top-up',
        element: <div className="p-8 text-center">Top Up Page (Coming Soon)</div>,
    },
    {
        path: '/dashboard/transfer',
        element: <Navigate to="/wallets" replace />,
    },
    {
        path: '/dashboard/exchange',
        element: <div className="p-8 text-center">Exchange Page (Coming Soon)</div>,
    },
    {
        path: '/cards',
        element: <div className="p-8 text-center">Cards Page (Coming Soon)</div>,
    },
    {
        path: '/wallets',
        element: <WalletsPage />,
    },
    {
        path: '/wallets/new',
        element: <div className="p-8 text-center">Add New Wallet Page (Coming Soon)</div>,
    },
    {
        path: '/wallets/:walletId',
        element: <WalletDetailsPage />,
    },
    {
        path: '/payment',
        element: <PaymentDevToolsPage />,
    },
    {
        path: '/history',
        element: <TransactionHistoryPage />,
    },
    {
        path: '/analytics',
        element: <div className="p-8 text-center">Analytics Page (Coming Soon)</div>,
    },
    {
        path: '/settings',
        element: <div className="p-8 text-center">Settings Page (Coming Soon)</div>,
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
]);
