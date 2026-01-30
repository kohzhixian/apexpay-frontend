import type { ReactNode } from 'react';

export interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footer?: ReactNode;
  variant?: 'light' | 'dark';
  showLogoInCard?: boolean;
  copyright?: string;
}

export const AuthLayout = ({
  children,
  title,
  subtitle,
  footer,
  variant = 'light',
  showLogoInCard = false,
  copyright,
}: AuthLayoutProps) => {
  const isDark = variant === 'dark';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDark ? 'bg-[#101722]' : 'bg-slate-50 dark:bg-[#101722]'
      }`}>
      <div
        className={`${isDark ? 'absolute' : 'fixed'} inset-0 z-0 pointer-events-none ${isDark ? 'opacity-30' : 'opacity-30 dark:opacity-20'
          }`}
        style={{
          background: isDark
            ? 'radial-gradient(circle at 50% 0%, rgba(54, 128, 247, 0.2) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.2) 0%, transparent 40%)'
            : 'radial-gradient(circle at 50% 0%, #3680f7 0%, transparent 40%), radial-gradient(circle at 80% 80%, #223149 0%, transparent 40%)'
        }}
      />

      <div className={`relative z-10 w-full ${isDark ? 'max-w-[440px]' : 'max-w-[480px]'} flex flex-col gap-6`}>
        {!showLogoInCard && (
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-blue-500/10">
              <span className="material-symbols-outlined text-blue-500 text-4xl">
                account_balance_wallet
              </span>
            </div>
            <h1 className={`tracking-tight font-bold leading-tight text-center ${isDark ? 'text-white text-2xl' : 'text-slate-900 dark:text-white text-[32px]'
              }`}>
              {title}
            </h1>
            <p className={`font-normal leading-normal pt-2 text-center ${isDark ? 'text-slate-400 text-sm' : 'text-slate-500 dark:text-slate-400 text-base'
              }`}>
              {subtitle}
            </p>
          </div>
        )}

        <div className={`rounded-xl shadow-xl p-6 sm:p-8 ${isDark
          ? 'bg-[#1e293b]/70 backdrop-blur-xl border border-white/10 shadow-2xl'
          : 'bg-white dark:bg-[#182334] border border-slate-200 dark:border-[#304669]'
          }`}>
          {/* Logo / Brand Header - Inside card for dark variant */}
          {showLogoInCard && (
            <div className="flex flex-col items-center text-center gap-2 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 text-blue-500 mb-2">
                <span className="material-symbols-outlined text-[28px]">
                  account_balance_wallet
                </span>
              </div>
              <h1 className="text-white tracking-tight text-2xl font-bold leading-tight">
                {title}
              </h1>
              <p className="text-slate-400 text-sm font-normal leading-normal">
                {subtitle}
              </p>
            </div>
          )}

          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="text-center">
            {footer}
          </div>
        )}
      </div>

      {/* Copyright */}
      {copyright && (
        <div className="mt-8 text-slate-600 text-xs text-center">
          {copyright}
        </div>
      )}
    </div>
  );
};
