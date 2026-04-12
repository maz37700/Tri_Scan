const HISTORY_KEY = 'triscan_history';
const MAX_HISTORY = 50;

export function loadHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(entry) {
  const history = loadHistory();
  // Don't store full base64 images in history (too large)
  // Instead store a thumbnail or null
  const saved = {
    id: Date.now(),
    date: new Date().toISOString(),
    dateDisplay: new Date().toLocaleString('fr-FR'),
    result: entry.result,
    label: entry.label || null,
    hasImage: !!entry.image,
    // Store a tiny thumbnail (optional, could be removed for space)
    thumbnail: entry.image ? createThumbnail(entry.image) : null,
  };
  const updated = [saved, ...history].slice(0, MAX_HISTORY);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Storage full — remove oldest entries
    const reduced = updated.slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(reduced));
  }
  return updated;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

function createThumbnail(dataUrl) {
  // In a real app, resize to tiny thumbnail
  // For now, return null to save space
  return null;
}

// ── Settings persistence ──
const SETTINGS_KEY = 'triscan_settings';

export function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : getDefaultSettings();
  } catch {
    return getDefaultSettings();
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

function getDefaultSettings() {
  return {
    postalCode: '',
    apiKey: '',
    notifications: false,
  };
}
