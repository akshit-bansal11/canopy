"use client";

import React, { useState, useRef, useEffect } from "react";
import { Palette, Check, Sun, Moon } from "lucide-react";
import { useTheme, Mode } from "@/components/providers/ThemeProvider";

function ThemeSwitcher() {
  const { theme, setTheme, mode, setMode, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const modes: { id: Mode; name: string; icon: React.ReactNode }[] = [
    { id: "light", name: "Light", icon: <Sun className="w-3.5 h-3.5" /> },
    { id: "dark", name: "Dark", icon: <Moon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-main)] hover:bg-[var(--accent-bg)] rounded-lg transition-all flex items-center gap-2"
        title="Customize Appearance"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg shadow-xl overflow-hidden z-50 p-3 flex flex-col gap-4">
          {/* Mode Selector */}
          <div>
            <div className="mb-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Mode
            </div>
            <div className="grid grid-cols-2 gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-all border
                    ${
                      mode === m.id
                        ? "bg-[var(--accent-bg)] text-[var(--accent-main)] border-[var(--accent-main)]"
                        : "text-[var(--text-main)] hover:bg-[var(--bg-hover)] border-[var(--border-main)]"
                    }`}
                >
                  {m.icon}
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <div className="mb-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Theme Palette
            </div>
            <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all
                    ${
                      theme === t.id
                        ? "bg-[var(--accent-bg)] text-[var(--accent-main)] border border-[var(--accent-main)]/30"
                        : "text-[var(--text-main)] hover:bg-[var(--bg-hover)] border border-transparent"
                    }`}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeSwitcher;
