import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginForm, RegisterForm } from '../features/auth/components';
import { DashboardPage, TransferPage, TransactionHistoryPage } from '../features/wallet/pages';

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
        element: <TransferPage />,
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
