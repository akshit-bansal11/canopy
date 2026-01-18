"use client";

import React from "react";
import BookmarkCard from "./BookmarkCard";

interface BookmarkPayload {
  title: string;
  description: string;
  tags: string[];
}

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  faviconUrl?: string;
  description?: string;
  tags?: string[];
  createdAt?: number;
  uid?: string;
}

interface BookmarkGridProps {
  bookmarks: BookmarkItem[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: BookmarkPayload) => void;
  allTags: string[];
}

function BookmarkGrid({
  bookmarks,
  onDelete,
  onUpdate,
  allTags,
}: BookmarkGridProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-md bg-zinc-900/50">
        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 mb-4">
          <span className="text-xl text-zinc-700">∅</span>
        </div>
        <p className="text-sm text-zinc-500 font-mono">DATABASE_EMPTY</p>
        <p className="text-xs text-zinc-600 mt-1">
          Initialize by adding a URL above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {bookmarks.map((b) => (
        <BookmarkCard
          key={b.id}
          bookmark={b}
          onDelete={onDelete}
          onUpdate={onUpdate}
          allTags={allTags}
        />
      ))}
    </div>
  );
}

export default BookmarkGrid;
