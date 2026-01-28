/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/lib/firebase";
import { normalizeUrl, getDomainFromUrl } from "@/lib/utils";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

// Components
import Header from "@/components/Header";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkGrid from "@/components/BookmarkGrid";
import TagFilter from "@/components/TagFilter";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast from "@/components/Toast";
import SearchSortBar from "@/components/SearchSortBar";
import AuthPage from "@/components/AuthPage";

// Types
interface BookmarkPayload {
  title: string;
  description: string;
  tags: string[];
}

interface AddBookmarkPayload {
  url: string;
  tags: string;
  description: string;
}

interface BookmarkItem {
  id: string;
  uid: string;
  title: string;
  url: string;
  faviconUrl: string;
  description: string;
  tags: string[];
  createdAt: number;
}

export default function Home() {
  const { currentUser, logout, loading: authLoading } = useAuth()!;

  // 🔁 Bookmarks now come from Firestore
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("created_at-desc");

  // -- Modal State --
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState<string | null>(null);

  // -- Tag Delete Modal State --
  const [isTagDeleteModalOpen, setIsTagDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);

  // -- Add Bookmark Modal State --
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // -- Toast State --
  const [toast, setToast] = useState({ visible: false, message: "" });

  // Optional: loading state
  const [dataLoading, setDataLoading] = useState(true);

  // 🔥 Subscribe to Firestore `bookmarks` collection in real-time
  useEffect(() => {
    if (!currentUser) {
      setBookmarks([]);
      setDataLoading(false);
      return;
    }

    const colRef = collection(db, "bookmarks");
    const q = query(colRef, where("uid", "==", currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((d) => d.data() as BookmarkItem);

      // Keep newest first like you were doing with [...prev]
      docs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setBookmarks(docs);
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 🔥 Add bookmark → write to Firestore
  const handleAddBookmark = async ({
    url,
    tags,
    description,
  }: AddBookmarkPayload) => {
    if (!currentUser) return;

    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) return;

    // Check for duplicates
    const isDuplicate = bookmarks.some((b) => b.url === normalizedUrl);
    if (isDuplicate) {
      setToast({ visible: true, message: "This link has already been added." });
      return;
    }

    const id =
      (window.crypto && crypto.randomUUID && crypto.randomUUID()) ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const domain = getDomainFromUrl(normalizedUrl);

    const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(
      normalizedUrl,
    )}`;

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newBookmark: BookmarkItem = {
      id, // 👈 we use this as the Firestore doc id too
      uid: currentUser.uid, // Link to user
      url: normalizedUrl,
      title: domain,
      faviconUrl,
      description: description || "",
      tags: tagArray,
      createdAt: Date.now(), // stored as number, easy to sort
    };

    const colRef = collection(db, "bookmarks");
    const docRef = doc(colRef, id);

    // setDoc with custom ID so Firestore doc id === bookmark.id
    await setDoc(docRef, newBookmark);

    // Close modal after successful add
    setIsAddModalOpen(false);
  };

  // Ask for delete (open modal)
  const requestDelete = (id: string) => {
    setBookmarkToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // 🔥 Confirm delete → delete from Firestore
  const confirmDelete = async () => {
    if (bookmarkToDelete) {
      const docRef = doc(db, "bookmarks", bookmarkToDelete);
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
  const handleUpdateBookmark = async (id: string, updates: BookmarkPayload) => {
    const docRef = doc(db, "bookmarks", id);
    // Using Type Assertion or Partial update as Firestore updateDoc supports Partial
    await updateDoc(docRef, updates as any);
    // Again, onSnapshot will reflect changes
  };

  // --- Tag Management ---

  const handleEditTag = async (oldTag: string, newTag: string) => {
    if (!newTag || !newTag.trim() || oldTag === newTag) return;
    const trimmedNewTag = newTag.trim();

    const bookmarksWithTag = bookmarks.filter((b) =>
      (b.tags || []).includes(oldTag),
    );

    // Batch updates or parallel promises
    const updatePromises = bookmarksWithTag.map((b) => {
      const newTags = (b.tags || []).map((t) =>
        t === oldTag ? trimmedNewTag : t,
      );
      // Remove duplicates if any
      const uniqueTags = [...new Set(newTags)];

      const docRef = doc(db, "bookmarks", b.id);
      return updateDoc(docRef, { tags: uniqueTags });
    });

    await Promise.all(updatePromises);

    // Update active tags if needed
    if (activeTags.includes(oldTag)) {
      setActiveTags((prev) =>
        prev.map((t) => (t === oldTag ? trimmedNewTag : t)),
      );
    }
  };

  const handleDeleteTag = (tag: string) => {
    setTagToDelete(tag);
    setIsTagDeleteModalOpen(true);
  };

  const confirmDeleteTag = async () => {
    if (!tagToDelete) return;

    const bookmarksWithTag = bookmarks.filter((b) =>
      (b.tags || []).includes(tagToDelete),
    );

    const updatePromises = bookmarksWithTag.map((b) => {
      const newTags = (b.tags || []).filter((t) => t !== tagToDelete);
      const docRef = doc(db, "bookmarks", b.id);
      return updateDoc(docRef, { tags: newTags });
    });

    await Promise.all(updatePromises);

    // Remove from active tags
    if (activeTags.includes(tagToDelete)) {
      setActiveTags((prev) => prev.filter((t) => t !== tagToDelete));
    }

    setIsTagDeleteModalOpen(false);
    setTagToDelete(null);
  };

  const cancelDeleteTag = () => {
    setIsTagDeleteModalOpen(false);
    setTagToDelete(null);
  };

  const allTags = useMemo(() => {
    const set = new Set<string>();
    bookmarks.forEach((b) => {
      (b.tags || []).forEach((t) => set.add(t));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [bookmarks]);

  const filteredBookmarks = useMemo(() => {
    let result = bookmarks;

    // 1. Filter by Tags
    if (activeTags.length > 0) {
      result = result.filter((b) =>
        activeTags.every((t) => (b.tags || []).includes(t)),
      );
    }

    // 2. Filter by Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          (b.title || "").toLowerCase().includes(query) ||
          (b.description || "").toLowerCase().includes(query),
      );
    }

    // 3. Sort
    return [...result].sort((a, b) => {
      switch (sortOrder) {
        case "name-asc":
          return (a.title || "").localeCompare(b.title || "");
        case "name-desc":
          return (b.title || "").localeCompare(a.title || "");
        case "created_at-asc":
          return (a.createdAt || 0) - (b.createdAt || 0);
        case "created_at-desc":
        default:
          return (b.createdAt || 0) - (a.createdAt || 0);
      }
    });
  }, [bookmarks, activeTags, searchQuery, sortOrder]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearTags = () => setActiveTags([]);

  // Check for invalid bookmarks (tags > 5)
  const hasInvalidBookmarks = useMemo(() => {
    return bookmarks.some((b) => (b.tags || []).length > 5);
  }, [bookmarks]);

  // --- Render Logic ---

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <div className="text-[var(--text-muted)] text-sm animate-pulse">
          Initializing...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage />;
  }

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
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  disabled={hasInvalidBookmarks}
                  className={`px-4 py-2 text-sm font-bold rounded transition-colors ${hasInvalidBookmarks
                      ? "bg-red-500/10 text-red-500 border border-red-500/20 cursor-not-allowed hover:bg-red-500/20"
                      : "bg-[var(--text-main)] text-[var(--bg-main)] hover:bg-[var(--accent-main)] hover:text-white"
                    }`}
                  title={
                    hasInvalidBookmarks
                      ? "Please fix bookmarks with excessive tags (>5) before adding new ones."
                      : "Add New Bookmark"
                  }
                >
                  {hasInvalidBookmarks ? "⚠️ Fix Invalid Tags" : "+ Add Bookmark"}
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
                {dataLoading && (
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
