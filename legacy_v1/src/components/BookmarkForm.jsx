import React, { useState } from 'react';
import TagInput from './TagInput.jsx';
import Toast from './Toast.jsx';

function BookmarkForm({ onAddBookmark, allTags }) {
    const [url, setUrl] = useState('');
    const [tags, setTags] = useState('');
    const [description, setDescription] = useState('');
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: '' });

    const DESCRIPTION_LIMIT = 1000;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url.trim()) return;
        setIsSubmitting(true);
        try {
            onAddBookmark({ url, tags, description });
            setUrl('');
            setDescription('');
            setIsDescriptionOpen(false);
            setTags('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDescriptionChange = (e) => {
        const val = e.target.value;
        if (val.length <= DESCRIPTION_LIMIT) {
            setDescription(val);
        } else {
            // Show toast if trying to exceed
            if (!toast.visible) {
                setToast({ visible: true, message: 'Description cannot exceed 1000 characters.' });
            }
        }
    };

    return (
        <div className="rounded-md border border-[var(--border-main)] bg-[var(--bg-card)] p-5">
            <h2 className="text-sm font-semibold text-[var(--text-main)] mb-4 uppercase tracking-wider text-[11px]">
                New Entry
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-3 items-end">
                    <div className="w-full space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Target URL</label>
                        <input
                            type="url"
                            required
                            placeholder="https://..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full rounded bg-[var(--bg-main)] border border-[var(--border-main)] px-3 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-main)] focus:ring-1 focus:ring-[var(--accent-main)] transition-all"
                        />
                    </div>

                    <div className="w-full md:w-1/3 space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Tags</label>
                        <TagInput
                            value={tags}
                            onChange={setTags}
                            tags={allTags}
                            placeholder="dev, docs..."
                            className="w-full rounded bg-[var(--bg-main)] border border-[var(--border-main)] px-3 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-main)] focus:ring-1 focus:ring-[var(--accent-main)] transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto whitespace-nowrap px-6 py-2.5 rounded bg-[var(--text-main)] text-[var(--bg-main)] text-sm font-bold hover:bg-[var(--accent-main)] hover:text-white disabled:opacity-50 disabled:hover:bg-[var(--text-main)] disabled:hover:text-[var(--bg-main)] transition-colors"
                    >
                        {isSubmitting ? '...' : '+ Add'}
                    </button>
                </div>

                <div className="w-full">
                    {!isDescriptionOpen ? (
                        <button
                            type="button"
                            onClick={() => setIsDescriptionOpen(true)}
                            className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1 transition-colors"
                        >
                            <span>+ ADD DESCRIPTION</span>
                        </button>
                    ) : (
                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Description</label>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] font-mono ${DESCRIPTION_LIMIT - description.length < 50 ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                                        {DESCRIPTION_LIMIT - description.length} chars left
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setIsDescriptionOpen(false)}
                                        className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-main)]"
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={description}
                                onChange={handleDescriptionChange}
                                placeholder="Add a note about this bookmark..."
                                rows={2}
                                className="w-full rounded bg-[var(--bg-main)] border border-[var(--border-main)] px-3 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-main)] focus:ring-1 focus:ring-[var(--accent-main)] transition-all resize-none"
                            />
                        </div>
                    )}
                </div>
            </form>

            <Toast
                message={toast.message}
                isVisible={toast.visible}
                onClose={() => setToast({ ...toast, visible: false })}
            />
        </div>
    );
}

export default BookmarkForm;