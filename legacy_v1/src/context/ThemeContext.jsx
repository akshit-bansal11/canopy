import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const THEMES = [
    { id: 'default', name: 'Default', color: '#6366f1' }, // Indigo
    { id: 'midnight', name: 'Midnight', color: '#06b6d4' }, // Cyan
    { id: 'forest', name: 'Forest', color: '#34d399' }, // Emerald
    { id: 'sunset', name: 'Sunset', color: '#fb7185' }, // Rose
    { id: 'nebula', name: 'Nebula', color: '#d8b4fe' }, // Purple
    { id: 'light', name: 'Light', color: '#3b82f6' }, // Blue
    { id: 'paper', name: 'Paper', color: '#d97706' }, // Amber
    { id: 'mint', name: 'Mint', color: '#0d9488' }, // Teal
    { id: 'berry', name: 'Berry', color: '#e11d48' }, // Rose Red
    { id: 'cyber', name: 'Cyber', color: '#00ff00' }, // Neon Green
    { id: 'coffee', name: 'Coffee', color: '#8d6e63' }, // Brown
    { id: 'ocean', name: 'Ocean', color: '#0ea5e9' }, // Sky Blue
    { id: 'dracula', name: 'Dracula', color: '#ff79c6' }, // Pink
];

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('app-theme');
        return saved || 'default';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'default') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme);
        }
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
