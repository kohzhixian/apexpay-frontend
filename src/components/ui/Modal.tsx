import type { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
    closeOnBackdropClick?: boolean;
}

const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-[520px]',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
};

export const Modal = ({
    isOpen,
    onClose,
    children,
    maxWidth = 'md',
    showCloseButton = false,
    closeOnBackdropClick = true,
}: ModalProps) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnBackdropClick && onClose && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div
                className={`w-full ${maxWidthClasses[maxWidth]} bg-[#1e293b] rounded-2xl shadow-2xl border border-[#314368] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 relative`}
            >
                {showCloseButton && onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 text-[#90a4cb] hover:text-white transition-colors rounded-lg hover:bg-white/5 p-1"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
                {children}
            </div>
        </div>
    );
};

interface ModalHeaderProps {
    icon?: string;
    title: string;
    subtitle?: string;
    onClose?: () => void;
}

export const ModalHeader = ({ icon, title, subtitle, onClose }: ModalHeaderProps) => {
    return (
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#314368] bg-[#1e293b]">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[24px]">{icon}</span>
                    </div>
                )}
                <div>
                    <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>
                    {subtitle && <p className="text-[#90a4cb] text-xs">{subtitle}</p>}
                </div>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-[#90a4cb] hover:text-white transition-colors rounded-lg hover:bg-white/5 p-1"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            )}
        </div>
    );
};

interface ModalBodyProps {
    children: ReactNode;
    className?: string;
}

export const ModalBody = ({ children, className = '' }: ModalBodyProps) => {
    return <div className={`p-6 flex flex-col gap-6 ${className}`}>{children}</div>;
};

interface ModalFooterProps {
    children: ReactNode;
    className?: string;
}

export const ModalFooter = ({ children, className = '' }: ModalFooterProps) => {
    return (
        <div className={`p-6 pt-2 bg-[#1e293b] border-t border-transparent ${className}`}>
            {children}
        </div>
    );
};
