import React from 'react';

function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    description = "Are you sure you want to remove this bookmark? This action cannot be undone and the data will be lost."
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[var(--bg-main)]/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-md border border-[var(--border-main)] bg-[var(--bg-card)] shadow-2xl shadow-black">
                {/* Red Warning Strip */}
                <div className="h-1 w-full bg-red-600" />

                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-red-900/20 border border-red-900/30 text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide">
                                {title}
                            </h3>
                            <p className="mt-2 text-sm text-[var(--text-muted)]">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded border border-[var(--border-main)] bg-transparent px-4 py-2 text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors"
                        >
                            CANCEL
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="rounded bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all"
                        >
                            DELETE PERMANENTLY
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;