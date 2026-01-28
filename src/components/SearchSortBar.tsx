"use client";

import React from "react";

interface SearchSortBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;
}

import { ArrowUp, ArrowDown } from "lucide-react";

function SearchSortBar({
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
}: SearchSortBarProps) {
  const [field, direction] = sortOrder.split("-");

  const handleFieldChange = (newField: string) => {
    onSortChange(`${newField}-${direction}`);
  };

  const toggleDirection = () => {
    const newDirection = direction === "asc" ? "desc" : "asc";
    onSortChange(`${field}-${newDirection}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
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

      <div className="flex w-full sm:w-auto shrink-0">
        <div className="flex items-center w-full bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg focus-within:ring-2 focus-within:ring-[var(--accent-main)]/20 focus-within:border-[var(--accent-main)] transition-all duration-300">
          <div className="relative flex-1 flex items-center">
            <select
              value={field}
              onChange={(e) => handleFieldChange(e.target.value)}
              className="appearance-none w-full bg-transparent pl-4 pr-8 py-2 text-sm font-medium text-[var(--text-main)] focus:outline-none cursor-pointer"
            >
              <option value="created_at" className="bg-[var(--bg-card)]">
                created_at
              </option>
              <option value="name" className="bg-[var(--bg-card)]">
                name
              </option>
            </select>
            <div className="absolute right-2 pointer-events-none text-[var(--text-muted)] opacity-40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="w-[1px] h-5 bg-[var(--border-main)] shrink-0" />

          <button
            onClick={toggleDirection}
            className="flex items-center justify-center px-4 py-2.5 text-[var(--text-muted)] hover:text-[var(--accent-main)] hover:bg-[var(--accent-bg)] transition-all duration-200 shrink-0"
            title={direction === "asc" ? "Ascending" : "Descending"}
          >
            {direction === "asc" ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchSortBar;
