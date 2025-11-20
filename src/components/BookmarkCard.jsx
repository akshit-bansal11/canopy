import React, { useEffect, useState } from 'react';
import TagInput from './TagInput.jsx'; // Import here

// ... keep shortenUrl function ...
function shortenUrl(url) {
    try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, '');
        return host + u.pathname.replace(/\/$/, '');
    } catch {
        return url;
    }
}

function BookmarkCard({ bookmark, onDelete, onUpdate, allTags }) {
    // ... existing state ...
    const { id, title, url, faviconUrl, description, tags } = bookmark;

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(title || '');
    const [editDescription, setEditDescription] = useState(description || '');
    const [editTags, setEditTags] = useState((tags || []).join(', '));

    useEffect(() => {
        setEditTitle(title || '');
        setEditDescription(description || '');
        setEditTags((tags || []).join(', '));
    }, [title, description, tags]);

    const handleSave = () => {
        const parsedTags = editTags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);

        onUpdate(id, {
            title: editTitle.trim() || shortenUrl(url),
            description: editDescription.trim(),
            tags: parsedTags,
        });

        setIsEditing(false);
    };

    return (
        <article className="group relative flex flex-col gap-3 rounded-md border border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-zinc-600 hover:shadow-lg hover:shadow-black/40">
            <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />

            {/* ... Header Section (unchanged) ... */}
            <header className="flex items-start gap-3 pl-2">
                <div className="shrink-0 mt-0.5">
                    {faviconUrl ? (
                        <img
                            src={faviconUrl}
                            alt=""
                            className="h-5 w-5 rounded-sm bg-white/10 grayscale group-hover:grayscale-0 transition-all"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <div className="h-5 w-5 rounded-sm bg-zinc-800" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <input
                            className="w-full bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Title"
                            autoFocus
                        />
                    ) : (
                        <div className="flex flex-col">
                            <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-bold text-zinc-200 truncate hover:text-indigo-400 transition-colors"
                            >
                                {title || shortenUrl(url)}
                            </a>
                            <span className="text-[10px] font-mono text-zinc-600 truncate group-hover:text-zinc-500 transition-colors">
                                {shortenUrl(url)}
                            </span>
                        </div>
                    )}
                </div>
            </header>

            <div className="pl-10">
                {isEditing ? (
                    <div className="space-y-2 mt-2">
                        <textarea
                            className="w-full bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 min-h-[60px]"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description notes..."
                        />

                        {/* REPLACED INPUT WITH TAGINPUT */}
                        <TagInput
                            value={editTags}
                            onChange={setEditTags}
                            tags={allTags}
                            placeholder="tags, csv"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 font-mono"
                        />

                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* ... View Mode (unchanged) ... */}
                        {description && (
                            <p className="text-xs text-zinc-400 line-clamp-2 mb-3 border-l border-zinc-800 pl-2">
                                {description}
                            </p>
                        )}

                        <div className="flex items-center justify-between mt-1 h-6">
                            <div className="flex flex-wrap gap-1.5">
                                {(tags || []).map((tag) => (
                                    <span key={tag} className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {/* ... Actions (unchanged) ... */}
            {!isEditing && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/80 backdrop-blur-sm rounded p-1">
                    <button onClick={() => setIsEditing(true)} className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded">
                        {/* Edit Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                        </svg>
                    </button>
                    <button onClick={() => onDelete(id)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/50 rounded">
                        {/* Delete Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}
        </article>
    );
}

export default BookmarkCard;