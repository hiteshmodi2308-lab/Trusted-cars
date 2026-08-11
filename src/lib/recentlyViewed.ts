const RECENTLY_VIEWED_KEY = 'trusted_cars_recently_viewed';
const MAX_ITEMS = 5;

export function getRecentlyViewedCarIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((id) => typeof id === 'string' && id.trim() !== '').slice(0, MAX_ITEMS);
    }
  } catch (err) {
    console.error('Failed to read recently viewed car IDs:', err);
  }
  return [];
}

export function addRecentlyViewedCarId(carId: string): void {
  if (!carId || typeof window === 'undefined') return;
  try {
    const current = getRecentlyViewedCarIds();
    // Ensure no duplicates by filtering out existing instance of carId
    const filtered = current.filter((id) => id !== carId);
    // Add to front (most recent) and limit to MAX_ITEMS (5)
    const updated = [carId, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('recentlyViewedChanged', { detail: updated }));
  } catch (err) {
    console.error('Failed to save recently viewed car ID:', err);
  }
}

export function clearRecentlyViewedCarIds(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
    window.dispatchEvent(new CustomEvent('recentlyViewedChanged', { detail: [] }));
  } catch (err) {
    console.error('Failed to clear recently viewed car IDs:', err);
  }
}
