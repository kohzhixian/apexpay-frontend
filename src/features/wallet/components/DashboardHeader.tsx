import { useState, useEffect } from 'react';
import { DASHBOARD_TEXT } from '../constants/text';
import { formatDate, formatTime } from '../utils/formatters';

export interface DashboardHeaderProps {
    userName: string;
}

export const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    // updates the current time every minute
    useEffect(() => {
        // Update time every minute
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                    {DASHBOARD_TEXT.WELCOME_BACK_USER(userName)}
                </h1>
                <p className="text-[#8fa6cc] text-base font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    {formatDate(currentTime.toISOString())} • {formatTime(currentTime.toISOString())}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button className="size-10 rounded-full bg-[#2d3748] border border-slate-700 flex items-center justify-center text-white hover:bg-[#374151] transition-colors relative">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-[#2d3748]"></span>
                </button>
            </div>
        </div>
    );
};
