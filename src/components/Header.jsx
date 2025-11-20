import React from 'react';

function Header() {
    return (
        <header className="border-b border-zinc-800 bg-zinc-950">
            <div className="mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
                <div className="flex items-center gap-3">
                    {/* Logo Icon */}
                    <div className="h-8 w-8 rounded bg-zinc-900 flex items-center justify-center shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 344 432"><path fill="#615fff" d="M299 3q17 0 29.5 12.5T341 45v342q0 17-12.5 29.5T299 429H43q-18 0-30.5-12.5T0 387V45q0-17 12.5-29.5T43 3h256zM43 45v171l53-32l53 32V45H43z" /></svg>
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight uppercase">
                            BOOK-IT <span className="text-zinc-600">BRUH!</span>
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