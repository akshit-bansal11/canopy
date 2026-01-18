import React, { useEffect, useMemo, useState } from 'react';
import Header from './Header.jsx';
import BookmarkForm from './BookmarkForm.jsx';
import BookmarkGrid from './BookmarkGrid.jsx';
import TagFilter from './TagFilter.jsx';
import DeleteConfirmModal from './DeleteConfirmModal.jsx';
import Toast from './Toast.jsx';
import SearchSortBar from './SearchSortBar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../firebase';
import { normalizeUrl, getDomainFromUrl } from '../utils';
import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    deleteDoc,
    updateDoc,
    query,
    where
} from 'firebase/firestore';

function AuthenticatedApp() {
    const { currentUser, logout } = useAuth();

    // 🔁 Bookmarks now come from Firestore
    const [bookmarks, setBookmarks] = useState([]);
    const [activeTags, setActiveTags] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('date-desc');

    // -- Modal State --
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookmarkToDelete, setBookmarkToDelete] = useState(null);

    // -- Tag Delete Modal State --
    const [isTagDeleteModalOpen, setIsTagDeleteModalOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);

    // -- Add Bookmark Modal State --
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // -- Toast State --
    const [toast, setToast] = useState({ visible: false, message: '' });

    // Optional: loading state
    const [loading, setLoading] = useState(true);

    // 🔥 Subscribe to Firestore `bookmarks` collection in real-time
    useEffect(() => {
        if (!currentUser) return;

        const colRef = collection(db, 'bookmarks');
        const q = query(colRef, where("uid", "==", currentUser.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map((d) => d.data());

            // Keep newest first like you were doing with [...prev]
            docs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

            setBookmarks(docs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // 🔥 Add bookmark → write to Firestore
    const handleAddBookmark = async ({ url, tags, description }) => {
        if (!currentUser) return;

        const normalizedUrl = normalizeUrl(url);
        if (!normalizedUrl) return;

        // Check for duplicates
        const isDuplicate = bookmarks.some(b => b.url === normalizedUrl);
        if (isDuplicate) {
            setToast({ visible: true, message: 'This link has already been added.' });
            return;
        }

        const id =
            (window.crypto && crypto.randomUUID && crypto.randomUUID()) ||
            `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        const domain = getDomainFromUrl(normalizedUrl);

        const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(
            normalizedUrl
        )}`;

        const tagArray = tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);

        const newBookmark = {
            id, // 👈 we use this as the Firestore doc id too
            uid: currentUser.uid, // Link to user
            url: normalizedUrl,
            title: domain,
            faviconUrl,
            description: description || '',
            tags: tagArray,
            createdAt: Date.now(), // stored as number, easy to sort
        };

        const colRef = collection(db, 'bookmarks');
        const docRef = doc(colRef, id);

        // setDoc with custom ID so Firestore doc id === bookmark.id
        await setDoc(docRef, newBookmark);

        // Close modal after successful add
        setIsAddModalOpen(false);
    };

    // Ask for delete (open modal)
    const requestDelete = (id) => {
        setBookmarkToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // 🔥 Confirm delete → delete from Firestore
    const confirmDelete = async () => {
        if (bookmarkToDelete) {
            const docRef = doc(db, 'bookmarks', bookmarkToDelete);
            await deleteDoc(docRef);
            // onSnapshot will update UI
        }
        setIsDeleteModalOpen(false);
        setBookmarkToDelete(null);
    };

    // Close modal without deleting
    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setBookmarkToDelete(null);
    };

    // 🔥 Update bookmark → update Firestore doc
    const handleUpdateBookmark = async (id, updates) => {
        const docRef = doc(db, 'bookmarks', id);
        await updateDoc(docRef, updates);
        // Again, onSnapshot will reflect changes
    };

    // --- Tag Management ---

    const handleEditTag = async (oldTag, newTag) => {
        if (!newTag || !newTag.trim() || oldTag === newTag) return;
        const trimmedNewTag = newTag.trim();

        const bookmarksWithTag = bookmarks.filter(b => (b.tags || []).includes(oldTag));

        // Batch updates or parallel promises
        const updatePromises = bookmarksWithTag.map(b => {
            const newTags = (b.tags || []).map(t => t === oldTag ? trimmedNewTag : t);
            // Remove duplicates if any
            const uniqueTags = [...new Set(newTags)];

            const docRef = doc(db, 'bookmarks', b.id);
            return updateDoc(docRef, { tags: uniqueTags });
        });

        await Promise.all(updatePromises);

        // Update active tags if needed
        if (activeTags.includes(oldTag)) {
            setActiveTags(prev => prev.map(t => t === oldTag ? trimmedNewTag : t));
        }
    };

    const handleDeleteTag = (tag) => {
        setTagToDelete(tag);
        setIsTagDeleteModalOpen(true);
    };

    const confirmDeleteTag = async () => {
        if (!tagToDelete) return;

        const bookmarksWithTag = bookmarks.filter(b => (b.tags || []).includes(tagToDelete));

        const updatePromises = bookmarksWithTag.map(b => {
            const newTags = (b.tags || []).filter(t => t !== tagToDelete);
            const docRef = doc(db, 'bookmarks', b.id);
            return updateDoc(docRef, { tags: newTags });
        });

        await Promise.all(updatePromises);

        // Remove from active tags
        if (activeTags.includes(tagToDelete)) {
            setActiveTags(prev => prev.filter(t => t !== tagToDelete));
        }

        setIsTagDeleteModalOpen(false);
        setTagToDelete(null);
    };

    const cancelDeleteTag = () => {
        setIsTagDeleteModalOpen(false);
        setTagToDelete(null);
    };

    const allTags = useMemo(() => {
        const set = new Set();
        bookmarks.forEach((b) => {
            (b.tags || []).forEach((t) => set.add(t));
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [bookmarks]);

    const filteredBookmarks = useMemo(() => {
        let result = bookmarks;

        // 1. Filter by Tags
        if (activeTags.length > 0) {
            result = result.filter(b => activeTags.every(t => (b.tags || []).includes(t)));
        }

        // 2. Filter by Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(b =>
                (b.title || '').toLowerCase().includes(query) ||
                (b.url || '').toLowerCase().includes(query) ||
                (b.description || '').toLowerCase().includes(query)
            );
        }

        // 3. Sort
        return [...result].sort((a, b) => {
            switch (sortOrder) {
                case 'alpha-asc':
                    return (a.title || '').localeCompare(b.title || '');
                case 'alpha-desc':
                    return (b.title || '').localeCompare(a.title || '');
                case 'date-asc':
                    return (a.createdAt || 0) - (b.createdAt || 0);
                case 'date-desc':
                default:
                    return (b.createdAt || 0) - (a.createdAt || 0);
            }
        });
    }, [bookmarks, activeTags, searchQuery, sortOrder]);

    const toggleTag = (tag) => {
        setActiveTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const clearTags = () => setActiveTags([]);

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-sans selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)] transition-colors duration-300">
            {/* Technical Grid Background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

            <div className="relative flex-1 flex flex-col z-10">
                <Header onLogout={logout} user={currentUser} bookmarks={bookmarks} />
                <div className="flex flex-1 overflow-hidden">
                    <main className="flex-1 flex flex-col gap-6 p-6 overflow-hidden max-w-7xl mx-auto w-full">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                            <div className="flex-1 flex justify-between items-center">
                                <h1 className="text-xl font-bold tracking-tight">Bookmarks</h1>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="px-4 py-2 bg-[var(--text-main)] text-[var(--bg-main)] text-sm font-bold rounded hover:bg-[var(--accent-main)] hover:text-white transition-colors"
                                >
                                    + Add Bookmark
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                            <div className="w-full lg:w-72">
                                <TagFilter
                                    tags={allTags}
                                    activeTags={activeTags}
                                    onToggleTag={toggleTag}
                                    onClear={clearTags}
                                    onEditTag={handleEditTag}
                                    onDeleteTag={handleDeleteTag}
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2">
                                {/* Optional tiny loading state */}
                                {loading && (
                                    <div className="text-[11px] text-[var(--text-muted)] mb-2">
                                        Syncing bookmarks from the cloud…
                                    </div>
                                )}
                                <SearchSortBar
                                    searchQuery={searchQuery}
                                    onSearchChange={setSearchQuery}
                                    sortOrder={sortOrder}
                                    onSortChange={setSortOrder}
                                />
                                <BookmarkGrid
                                    bookmarks={filteredBookmarks}
                                    onDelete={requestDelete}
                                    onUpdate={handleUpdateBookmark}
                                    allTags={allTags}
                                />
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Add Bookmark Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl relative">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute -top-10 right-0 text-white/70 hover:text-white"
                        >
                            Close
                        </button>
                        <BookmarkForm onAddBookmark={handleAddBookmark} allTags={allTags} />
                    </div>
                </div>
            )}

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                description="Are you sure you want to remove this bookmark? This action cannot be undone and the data will be lost."
            />

            <DeleteConfirmModal
                isOpen={isTagDeleteModalOpen}
                onClose={cancelDeleteTag}
                onConfirm={confirmDeleteTag}
                title="Delete Tag"
                description={`Are you sure you want to delete the tag "${tagToDelete}"? It will be removed from all bookmarks.`}
            />

            <Toast
                message={toast.message}
                isVisible={toast.visible}
                onClose={() => setToast({ ...toast, visible: false })}
            />
        </div>
    );
}

export default AuthenticatedApp;
