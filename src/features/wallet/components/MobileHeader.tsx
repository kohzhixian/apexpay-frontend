import { APP_NAME } from '../constants/text';

interface MobileHeaderProps {
    onMenuClick: () => void;
}

export const MobileHeader = ({ onMenuClick }: MobileHeaderProps) => {
    return (
        <div className="md:hidden flex items-center justify-between p-4 bg-[#1a202c] border-b border-slate-800">
            <div className="flex items-center gap-2">
                <div className="bg-blue-500 size-8 rounded-lg flex items-center justify-center text-white font-bold">
                    A
                </div>
                <span className="font-bold text-lg text-white">{APP_NAME}</span>
            </div>
            <button
                onClick={onMenuClick}
                className="text-white p-2"
                aria-label="Open menu"
            >
                <span className="material-symbols-outlined">menu</span>
            </button>
        </div>
    );
};
