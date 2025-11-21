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
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Filter Data
                </h2>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setIsManageMode(!isManageMode)}
                        className={`text-[10px] font-mono transition-colors ${isManageMode ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        {isManageMode ? 'DONE' : 'MANAGE'}
                    </button>
                    <button
                        type="button"
                        onClick={onClear}
                        disabled={activeTags.length === 0}
                        className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 disabled:opacity-0 transition-opacity"
                    >
                        RESET_ALL
                    </button>
                </div>
            </div>

            {tags.length === 0 ? (
                <div className="rounded border border-dashed border-zinc-800 p-4 text-center">
                    <p className="text-xs text-zinc-600">No tags indexed.</p>
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
                                        ? 'bg-zinc-800 border-zinc-700 text-indigo-400'
                                        : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                                    }`}
                            >
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive
                                            ? 'bg-indigo-500'
                                            : 'bg-zinc-700 group-hover:bg-indigo-500'
                                            }`}
                                    />
                                    {tag}
                                </div>

                                {isManageMode && (
                                    <div className="flex items-center gap-1 ml-1 pl-2 border-l border-zinc-500/50">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClick(tag);
                                            }}
                                            className="p-0.5 text-zinc-500 hover:text-indigo-400 transition-colors"
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
                                            className="p-0.5 text-zinc-500 hover:text-red-500 transition-colors"
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