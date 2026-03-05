import { ReactNode } from "react";

export function IconButton({
    icon, 
    onClick, 
    activated
}: {
    icon: ReactNode,
    onClick: () => void,
    activated: boolean
}) {
    return (
        <button 
            className={`
                p-2 rounded-lg transition-all duration-200 group
                flex items-center justify-center
                ${activated 
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-105" 
                    : "bg-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }
            `} 
            onClick={onClick}
        >
            <div className="w-5 h-5 flex items-center justify-center group-active:scale-90 transition-transform">
                {icon}
            </div>
        </button>
    );
}
