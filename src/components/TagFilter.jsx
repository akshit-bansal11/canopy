import React from 'react';

function TagFilter({ tags, activeTags, onToggleTag, onClear }) {
    return (
        <div className="h-full">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Filter Data
                </h2>
                <button
                    type="button"
                    onClick={onClear}
                    disabled={activeTags.length === 0}
                    className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 disabled:opacity-0 transition-opacity"
                >
                    RESET_ALL
                </button>
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
                            <button
                                key={tag}
                                type="button"
                                onClick={() => onToggleTag(tag)}
                                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-all ${isActive
                                        ? 'bg-zinc-800 border-zinc-700 text-indigo-400'
                                        : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                                    }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-500' : 'bg-zinc-700 group-hover:bg-zinc-500'}`} />
                                {tag}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default TagFilter;