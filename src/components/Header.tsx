"use client";

import React from "react";
// import Icon from '../assets/IconThemed.svg?react'; // TODO: Handle SVGR or icon import
import { LogOut, User, Download } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import { User as FirebaseUser } from "firebase/auth";
import CanopyLogo from "./CanopyLogo";

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
}

interface HeaderProps {
  onLogout: () => void;
  user: FirebaseUser | null;
  bookmarks?: BookmarkItem[];
}

function Header({ onLogout, user, bookmarks = [] }: HeaderProps) {
  const handleExport = () => {
    if (!bookmarks.length) return;

    const content = [
      `# My Bookmarks`,
      `Generated on ${new Date().toLocaleDateString()}`,
      "",
      ...bookmarks.map((b) => {
        const tags = (b.tags || []).map((t) => `#${t}`).join(" ");
        return [
          `## [${b.title || "Untitled"}](${b.url})`,
          b.description ? `> ${b.description}\n` : "",
          tags ? `Tags: ${tags}\n` : "",
          "---",
        ]
          .filter(Boolean)
          .join("\n");
      }),
    ].join("\n");

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookmarks-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="border-b border-[var(--border-main)] bg-[var(--bg-main)] transition-colors duration-300">
      <div className="mx-auto px-6 py-2 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-1.5">
          {/* Logo Icon */}
          <div className="h-10 w-[52px] flex items-center justify-center">
            <CanopyLogo className="h-full w-full" />
          </div>

          {/* Title */}
          <div className="flex items-center pt-0.5">
            <h1 className="text-[28px] font-normal text-[var(--text-main)] font-[family-name:var(--font-brand)] leading-none select-none tracking-[-0.01em]">
              Canopy
            </h1>
          </div>
        </div>

        {/* Status Indicators & Auth */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-[var(--text-muted)]">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[var(--accent-main)] rounded-full animate-pulse"></div>
              <span>SYSTEM_ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-main)]">
            <ThemeSwitcher />

            {user && (
              <>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-main)]">
                  <User className="w-3.5 h-3.5 text-[var(--accent-main)]" />
                  <span className="text-xs font-medium text-[var(--text-muted)]">
                    {user.displayName || user.email}
                  </span>
                </div>

                <button
                  onClick={handleExport}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-main)] hover:bg-[var(--accent-bg)] rounded-lg transition-all"
                  title="Export Bookmarks"
                >
                  <Download className="w-5 h-5" />
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
