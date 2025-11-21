import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import BookmarkForm from './components/BookmarkForm.jsx';
import BookmarkGrid from './components/BookmarkGrid.jsx';
import TagFilter from './components/TagFilter.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import TagInput from './components/TagInput.jsx';

// 🔥 Firestore imports
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// ----- Helpers -----
function normalizeUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function getDomainFromUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function App() {
  // 🔁 Bookmarks now come from Firestore
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTags, setActiveTags] = useState([]);

  // -- Modal State --
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState(null);

  // -- Tag Delete Modal State --
  const [isTagDeleteModalOpen, setIsTagDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);

  // Optional: loading state
  const [loading, setLoading] = useState(true);

  // 🔥 Subscribe to Firestore `bookmarks` collection in real-time
  useEffect(() => {
    const colRef = collection(db, 'bookmarks');

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const docs = snapshot.docs.map((d) => d.data());

      // Keep newest first like you were doing with [...prev]
      docs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setBookmarks(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Add bookmark → write to Firestore
  const handleAddBookmark = async ({ url, tags, description }) => {
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) return;

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

    // No need to manually update state, onSnapshot will fire
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
    return bookmarks.filter((b) => {
      if (
        activeTags.length > 0 &&
        !activeTags.every((t) => (b.tags || []).includes(t))
      ) {
        return false;
      }
      return true;
    });
  }, [bookmarks, activeTags]);

  const toggleTag = (tag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearTags = () => setActiveTags([]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <div className="relative flex-1 flex flex-col z-10">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 flex flex-col gap-6 p-6 overflow-hidden max-w-7xl mx-auto w-full">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="flex-1">
                <BookmarkForm onAddBookmark={handleAddBookmark} allTags={allTags} />
              </div>

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
            </div>

            <div className="h-px bg-zinc-800/50 w-full my-2" />

            {/* Optional tiny loading state */}
            {loading && (
              <div className="text-[11px] text-zinc-500 mb-2">
                Syncing bookmarks from the cloud…
              </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2">
              <BookmarkGrid
                bookmarks={filteredBookmarks}
                onDelete={requestDelete}
                onUpdate={handleUpdateBookmark}
                allTags={allTags}
              />
            </div>
          </main>
        </div>
      </div>

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
    </div>
  );
}

export default App;