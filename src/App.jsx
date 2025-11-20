import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import BookmarkForm from './components/BookmarkForm.jsx';
import BookmarkGrid from './components/BookmarkGrid.jsx';
import TagFilter from './components/TagFilter.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import TagInput from './components/TagInput.jsx';

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
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('toolspace-bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTags, setActiveTags] = useState([]);

  // -- Modal State --
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem('toolspace-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleAddBookmark = ({ url, tags }) => {
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
      id,
      url: normalizedUrl,
      title: domain,
      faviconUrl,
      description: '',
      tags: tagArray,
      createdAt: Date.now(),
    };

    setBookmarks((prev) => [newBookmark, ...prev]);
  };

  // 1. Instead of deleting immediately, we open the modal
  const requestDelete = (id) => {
    setBookmarkToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // 2. This actually deletes the item
  const confirmDelete = () => {
    if (bookmarkToDelete) {
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkToDelete));
    }
    setIsDeleteModalOpen(false);
    setBookmarkToDelete(null);
  };

  // 3. Close modal without deleting
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setBookmarkToDelete(null);
  };

  const handleUpdateBookmark = (id, updates) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
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
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
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
                {/* Pass allTags here */}
                <BookmarkForm
                  onAddBookmark={handleAddBookmark}
                  allTags={allTags}
                />
              </div>
              <div className="w-full lg:w-72">
                <TagFilter
                  tags={allTags}
                  activeTags={activeTags}
                  onToggleTag={toggleTag}
                  onClear={clearTags}
                />
              </div>
            </div>
            <div className="h-px bg-zinc-800/50 w-full my-2" />
            <div className="flex-1 overflow-y-auto pr-2">
              {/* Pass allTags here too */}
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

      {/* Render Modal Outside Main Flow */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default App;