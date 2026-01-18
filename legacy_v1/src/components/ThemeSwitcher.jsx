import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function ThemeSwitcher() {
    const { theme, setTheme, themes } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-main)] hover:bg-[var(--accent-bg)] rounded-lg transition-all"
                title="Change Theme"
            >
                <Palette className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg shadow-xl overflow-hidden z-50 py-1">
                    <div className="px-3 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        Select Theme
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setTheme(t.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-sm flex items-center gap-3 transition-colors
                                    ${theme === t.id
                                        ? 'bg-[var(--accent-bg)] text-[var(--accent-main)]'
                                        : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                                    }`}
                            >
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: t.color }}
                                />
                                <span className="flex-1 text-left">{t.name}</span>
                                {theme === t.id && <Check className="w-3.5 h-3.5" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ThemeSwitcher;
