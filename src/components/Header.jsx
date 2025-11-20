import React from 'react';

function Header() {
    return (
        <header className="border-b border-zinc-800 bg-zinc-950">
            <div className="mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
                <div className="flex items-center gap-3">
                    {/* Logo Icon */}
                    <div className="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                            <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z" clipRule="evenodd" />
                        </svg>
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className="text-lg font-bold text-zinc-100 tracking-tight uppercase">
                            BOOK-IT <span className="text-zinc-600">BRUH!</span>
                        </h1>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-zinc-500">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-zinc-700 rounded-full"></div>
                        <span>OFFLINE_MODE</span>
                    </div>
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