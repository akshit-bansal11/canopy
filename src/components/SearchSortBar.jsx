import React from 'react';

function SearchSortBar({ searchQuery, onSearchChange, sortOrder, onSortChange }) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-[var(--text-muted)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search bookmarks..."
                    className="block w-full pl-10 pr-3 py-2 border border-[var(--border-main)] rounded-md leading-5 bg-[var(--bg-card)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-main)] focus:ring-2 focus:ring-[var(--accent-bg)] sm:text-sm transition-all duration-200"
                />
            </div>
            <div className="w-full sm:w-48">
                <select
                    value={sortOrder}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-[var(--border-main)] focus:outline-none focus:border-[var(--accent-main)] focus:ring-2 focus:ring-[var(--accent-bg)] sm:text-sm rounded-md bg-[var(--bg-card)] text-[var(--text-main)] transition-all duration-200"
                >
                    <option value="date-desc">Created (Newest)</option>
                    <option value="date-asc">Created (Oldest)</option>
                    <option value="alpha-asc">Name (A-Z)</option>
                    <option value="alpha-desc">Name (Z-A)</option>
                </select>
            </div>
        </div>
    );
}

export default SearchSortBar;
