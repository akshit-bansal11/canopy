import React, { useState, useEffect, useRef } from 'react';

function TagInput({ value, onChange, tags = [], placeholder, className, autoFocus }) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredTags, setFilteredTags] = useState([]);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef(null);

    // Parse the last segment being typed (e.g. "dev, de" -> "de")
    const getLastTag = (str) => {
        const parts = str.split(',');
        return parts[parts.length - 1].trim();
    };

    const handleInputChange = (e) => {
        const rawValue = e.target.value;

        // Split by comma to handle each tag individually
        const parts = rawValue.split(',');
        const processedParts = parts.map((part, index) => {
            // We want to preserve the leading space if it exists (standard separator)
            let content = part;
            let prefix = '';

            // If it's not the first tag, it might have a leading space.
            if (index > 0 && content.startsWith(' ')) {
                prefix = ' ';
                content = content.substring(1);
            }

            // Replace spaces in the content with underscores
            content = content.replace(/ /g, '_');

            // Limit to 15 chars
            if (content.length > 15) {
                content = content.substring(0, 15);
            }

            return prefix + content.toLowerCase();
        });

        const newValue = processedParts.join(',');
        onChange(newValue);

        const last = getLastTag(newValue);
        // Get current full tags to avoid suggesting what's already there
        const currentTags = newValue.split(',').map(t => t.trim().toLowerCase());

        if (last.length > 0) {
            const matches = tags.filter(t =>
                t.toLowerCase().includes(last.toLowerCase()) &&
                !currentTags.includes(t.toLowerCase())
            );
            setFilteredTags(matches);
            setShowSuggestions(matches.length > 0);
            setFocusedIndex(0); // Auto-select first match
        } else {
            setShowSuggestions(false);
        }
    };

    const addTag = (tag) => {
        const parts = value.split(',');
        parts.pop(); // Remove partial
        parts.push(tag.toLowerCase());
        // Reconstruct string with clean formatting
        const newValue = parts.join(', ') + ', ';
        onChange(newValue);
        setShowSuggestions(false);
        setFocusedIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex(prev => (prev + 1) % filteredTags.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex(prev => (prev - 1 + filteredTags.length) % filteredTags.length);
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            if (focusedIndex >= 0 && filteredTags[focusedIndex]) {
                e.preventDefault();
                addTag(filteredTags[focusedIndex]);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={containerRef}>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={className}
                placeholder={placeholder}
                autoFocus={autoFocus}
                autoComplete="off"
            />
            {showSuggestions && (
                <ul className="absolute bottom-full mb-1 left-0 w-full max-h-48 overflow-y-auto rounded border border-[var(--border-main)] bg-[var(--bg-card)] shadow-xl z-50 scrollbar-hide">
                    {filteredTags.map((tag, index) => (
                        <li
                            key={tag}
                            onClick={() => addTag(tag)}
                            className={`px-3 py-2 text-xs cursor-pointer transition-colors ${index === focusedIndex
                                ? 'bg-[var(--bg-hover)] text-[var(--accent-main)] font-medium'
                                : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                                }`}
                        >
                            #{tag}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TagInput;