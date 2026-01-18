export function normalizeUrl(url) {
    if (!url) return '';
    let trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
        trimmed = `https://${trimmed}`;
    }
    try {
        const u = new URL(trimmed);
        // Ensure consistent trailing slash handling
        // URL.href always adds a trailing slash to the domain if path is empty
        // e.g. new URL('https://google.com').href === 'https://google.com/'
        return u.href;
    } catch {
        return trimmed;
    }
}

export function getDomainFromUrl(url) {
    try {
        const u = new URL(url);
        return u.hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
}
