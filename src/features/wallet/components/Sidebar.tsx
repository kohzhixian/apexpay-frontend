import { Link, useLocation } from 'react-router-dom';
import type { NavigationItem } from '../types';

export interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    currentPath: string;
}

const navigationItems: NavigationItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        path: '/dashboard',
        requiresAuth: true,
    },
    {
        id: 'cards',
        label: 'Cards',
        icon: 'credit_card',
        path: '/cards',
        requiresAuth: true,
    },
    {
        id: 'transfer',
        label: 'Transfer',
        icon: 'send',
        path: '/dashboard/transfer',
        requiresAuth: true,
    },
    {
        id: 'history',
        label: 'History',
        icon: 'history',
        path: '/history',
        requiresAuth: true,
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: 'pie_chart',
        path: '/analytics',
        requiresAuth: true,
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: 'settings',
        path: '/settings',
        requiresAuth: true,
    },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const location = useLocation();

    const handleSignOut = () => {
        // TODO: Implement sign out logic
        console.log('Sign out clicked');
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed md:static inset-y-0 left-0 z-50
          w-72 flex flex-col border-r border-slate-800 
          bg-[#0f1419] h-full flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
            >
                <div className="p-6 flex flex-col h-full justify-between">
                    <div className="flex flex-col gap-8">
                        {/* Brand / Profile */}
                        <div className="flex items-center gap-4">
                            <div
                                className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-lg ring-2 ring-slate-700"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAXVSjfC7YTtjmF915pK9bisANgmpbaRUH-8BKgo2u_IHk3qLJ5MO2XBU_VlhrZsM8khBhFJoZGQsqP0uHVqYUwEaCdwxnJ9WA_TsQGtwHN1S1WKT7sHXa3DgYnMqzB5GM64Scet_IdcoPST2Z3qxZFr9RC5q19OridzcurN8ZL56sEN8Y1bZWYcMHdy360rZNW8RUzOLBjcOtQu0bSg6dS7j_HcE8p7q00pKXl0eJbgnAbNyB2tgMB1y0-VIwodaJzuzoS8SIh_w")',
                                }}
                            />
                            <div className="flex flex-col">
                                <h1 className="text-white text-lg font-bold leading-tight">
                                    ApexPay
                                </h1>
                                <p className="text-[#8fa6cc] text-xs font-medium uppercase tracking-wider">
                                    Wallet Dashboard
                                </p>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-col gap-2">
                            {navigationItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        onClick={() => onClose()}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${isActive
                                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                : 'text-[#8fa6cc] hover:bg-[#1e2a40] hover:text-white'
                                            }
                    `}
                                    >
                                        <span className="material-symbols-outlined text-[24px]">
                                            {item.icon}
                                        </span>
                                        <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Bottom Action - Sign Out */}
                    <div className="mt-auto">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[#8fa6cc] hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[24px]">logout</span>
                            <span className="text-sm font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};
