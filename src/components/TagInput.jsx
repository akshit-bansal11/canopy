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
        const val = e.target.value;
        onChange(val);

        const last = getLastTag(val);
        // Get current full tags to avoid suggesting what's already there
        const currentTags = val.split(',').map(t => t.trim().toLowerCase());

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
        parts.push(tag);
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
                <ul className="absolute bottom-full mb-1 left-0 w-full max-h-48 overflow-y-auto rounded border border-zinc-700 bg-zinc-900 shadow-xl z-50 scrollbar-hide">
                    {filteredTags.map((tag, index) => (
                        <li
                            key={tag}
                            onClick={() => addTag(tag)}
                            className={`px-3 py-2 text-xs cursor-pointer transition-colors ${index === focusedIndex
                                    ? 'bg-zinc-800 text-indigo-400 font-medium'
                                    : 'text-zinc-300 hover:bg-zinc-800'
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