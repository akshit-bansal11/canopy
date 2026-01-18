import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import TagInput from './TagInput.jsx';

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

function DescriptionText({ description }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef(null);

    useLayoutEffect(() => {
        if (textRef.current) {
            const { scrollHeight, clientHeight } = textRef.current;
            setIsOverflowing(scrollHeight > clientHeight);
        }
    }, [description]);

    return (
        <>
            <p
                ref={textRef}
                className={`text-xs text-[var(--text-muted)] ${!isExpanded ? 'line-clamp-2' : ''}`}
            >
                {description}
            </p>
            {(isOverflowing || isExpanded) && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className="text-[10px] text-[var(--accent-main)] hover:underline mt-1 font-medium"
                >
                    {isExpanded ? 'Show Less' : 'Show More'}
                </button>
            )}
        </>
    );
}

function BookmarkCard({ bookmark, onDelete, onUpdate, allTags }) {
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
        <article className="group relative flex flex-col gap-3 rounded-md border border-[var(--border-main)] bg-[var(--bg-card)] p-4 transition-all hover:border-[var(--accent-main)] hover:shadow-lg hover:shadow-black/40">
            <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-[var(--accent-main)] opacity-0 transition-opacity group-hover:opacity-100" />

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
                        <div className="h-5 w-5 rounded-sm bg-[var(--bg-hover)]" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <input
                            className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded px-2 py-1 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-main)]"
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
                                className="text-sm font-bold text-[var(--text-main)] truncate hover:text-[var(--accent-main)] transition-colors"
                            >
                                {title || shortenUrl(url)}
                            </a>
                            <span className="text-[10px] font-mono text-[var(--text-muted)] truncate group-hover:text-[var(--text-main)] transition-colors">
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
                            className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded px-2 py-1 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-main)] min-h-[60px]"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description notes..."
                        />

                        <TagInput
                            value={editTags}
                            onChange={setEditTags}
                            tags={allTags}
                            placeholder="tags, csv"
                            className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded px-2 py-1 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-main)] font-mono"
                        />

                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 bg-[var(--accent-main)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1 bg-[var(--bg-hover)] hover:bg-[var(--border-main)] text-[var(--text-muted)] text-xs rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {description && (
                            <div className="mb-3 border-l border-[var(--border-main)] pl-2">
                                <DescriptionText description={description} />
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-1 h-6">
                            <div className="flex flex-wrap gap-1.5">
                                {(tags || []).map((tag) => (
                                    <span key={tag} className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-main)] px-1.5 py-0.5 rounded border border-[var(--border-main)]">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {!isEditing && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-card)]/80 backdrop-blur-sm rounded p-1">
                    <button onClick={() => setIsEditing(true)} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                        </svg>
                    </button>
                    <button onClick={() => onDelete(id)} className="p-1.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-950/50 rounded">
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