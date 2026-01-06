export function format(n) {
    return Number(n || 0).toLocaleString();
}

export function cacheSet(key, data) {
    localStorage.setItem(key, JSON.stringify({
        time: Date.now(),
        data
    }));
}

export function cacheGet(key, ttl = 120000) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (Date.now() - obj.time > ttl) return null;
    return obj.data;
}
