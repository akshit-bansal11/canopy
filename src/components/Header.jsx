import React from 'react';
import Icon from '../assets/Icon.svg?react';


function Header() {
    return (
        <header className="border-b border-zinc-800 bg-zinc-950">
            <div className="mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
                <div className="flex items-center gap-3">
                    {/* Logo Icon */}
                    <div className="h-8 w-8 rounded flex items-center justify-center shadow-inner">
                        <Icon className="h-10 w-10 text-indigo-500" />
                    </div>


                    {/* Title */}
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight uppercase">
                            BooK_It <span className="text-zinc-600">BRUH!</span>
                        </h1>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-zinc-500">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        <span>SYSTEM_ACTIVE</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;