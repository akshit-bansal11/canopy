import React, { useState } from 'react';

function TagFilter({ tags, activeTags, onToggleTag, onClear, onEditTag, onDeleteTag }) {
    const [isManageMode, setIsManageMode] = useState(false);

    const handleEditClick = (tag) => {
        const newTag = window.prompt("Edit tag name:", tag);
        if (newTag !== null) {
            onEditTag(tag, newTag);
        }
    };

    return (
        <div className="h-full">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Filter Data
                </h2>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setIsManageMode(!isManageMode)}
                        className={`text-[10px] font-mono transition-colors ${isManageMode ? 'text-[var(--accent-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                            }`}
                    >
                        {isManageMode ? 'DONE' : 'MANAGE'}
                    </button>
                    <button
                        type="button"
                        onClick={onClear}
                        disabled={activeTags.length === 0}
                        className="text-[10px] font-mono text-[var(--accent-main)] hover:text-[var(--accent-hover)] disabled:opacity-0 transition-opacity"
                    >
                        RESET_ALL
                    </button>
                </div>
            </div>

            {tags.length === 0 ? (
                <div className="rounded border border-dashed border-[var(--border-main)] p-4 text-center">
                    <p className="text-xs text-[var(--text-muted)]">No tags indexed.</p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                        const isActive = activeTags.includes(tag);
                        return (
                            <div
                                key={tag}
                                onClick={() => !isManageMode && onToggleTag(tag)}
                                className={`group flex items-center gap-2 px-2.5 py-1 rounded text-xs font-medium border transition-all ${!isManageMode ? 'cursor-pointer' : 'cursor-default'
                                    } ${isActive
                                        ? 'bg-[var(--bg-hover)] border-[var(--border-main)] text-[var(--accent-main)]'
                                        : 'bg-transparent border-[var(--border-main)] text-[var(--text-muted)] hover:border-[var(--accent-main)] hover:text-[var(--text-main)]'
                                    }`}
                            >
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive
                                            ? 'bg-[var(--accent-main)]'
                                            : 'bg-[var(--border-main)] group-hover:bg-[var(--accent-main)]'
                                            }`}
                                    />
                                    {tag}
                                </div>

                                {isManageMode && (
                                    <div className="flex items-center gap-1 ml-1 pl-2 border-l border-[var(--border-main)]">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClick(tag);
                                            }}
                                            className="p-0.5 text-[var(--text-muted)] hover:text-[var(--accent-main)] transition-colors"
                                            title="Edit Tag"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-3.5 h-3.5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                                />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteTag(tag);
                                            }}
                                            className="p-0.5 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                                            title="Delete Tag"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-3.5 h-3.5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default TagFilter;