import React, { useState } from 'react';
import TagInput from './TagInput.jsx';

function BookmarkForm({ onAddBookmark, allTags }) {
    const [url, setUrl] = useState('');
    const [tags, setTags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url.trim()) return;
        setIsSubmitting(true);
        try {
            onAddBookmark({ url, tags });
            setUrl('');
            // Optional: Clear tags after submit? Users might want to add multiple similar ones. 
            // Let's clear them to be clean.
            setTags('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rounded-md border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-zinc-100 mb-4 uppercase tracking-wider text-[11px]">
                New Entry
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-end">
                <div className="w-full space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Target URL</label>
                    <input
                        type="url"
                        required
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full rounded bg-zinc-950 border border-zinc-800 px-3 py-2.5 text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                </div>

                <div className="w-full md:w-1/3 space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Tags</label>
                    <TagInput
                        value={tags}
                        onChange={setTags}
                        tags={allTags}
                        placeholder="dev, docs..."
                        className="w-full rounded bg-zinc-950 border border-zinc-800 px-3 py-2.5 text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto whitespace-nowrap px-6 py-2.5 rounded bg-zinc-100 text-zinc-950 text-sm font-bold hover:bg-indigo-500 hover:text-white disabled:opacity-50 disabled:hover:bg-zinc-100 disabled:hover:text-zinc-950 transition-colors"
                >
                    {isSubmitting ? '...' : '+ Add'}
                </button>
            </form>
        </div>
    );
}

export default BookmarkForm;