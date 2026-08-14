/**
 * Robust storage utilities handling localStorage quota limits and IndexedDB persistent storage.
 */

const DB_NAME = "YouTubePlaythroughPlannerDB";
const STORE_NAME = "appState";
const SERIES_KEY = "youtube_playthrough_series";

// Open IndexedDB connection
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Recursively strips or truncates large base64 Data URIs to fit into localStorage limits.
 */
export function sanitizeDataForLocalStorage(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    // Only strip extremely large base64 data URIs (e.g. multi-megabyte canvas snapshots over 250KB)
    // Lightweight hero avatar images (~10-50KB) are retained safely in localStorage
    if (obj.startsWith("data:image/") && obj.length > 250000) {
      return ""; // Omit giant inline images from localStorage, IndexedDB retains them
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeDataForLocalStorage(item));
  }

  if (typeof obj === "object") {
    const cleaned: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      cleaned[key] = sanitizeDataForLocalStorage(obj[key]);
    }
    return cleaned;
  }

  return obj;
}

/**
 * Safely saves data to localStorage with quota-exceeded fallback handling.
 */
export function safeSetLocalStorage(key: string, data: any): boolean {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    console.warn(`localStorage.setItem failed for key "${key}" (possibly quota exceeded). Sanitizing...`, err);
    try {
      // Sanitize large base64 data URIs
      const sanitized = sanitizeDataForLocalStorage(data);
      const serialized = JSON.stringify(sanitized);
      localStorage.setItem(key, serialized);
      console.log(`Successfully saved sanitized state to localStorage for key "${key}".`);
      return true;
    } catch (secondErr) {
      console.error(`Failed to save even sanitized state to localStorage for key "${key}".`, secondErr);
      return false;
    }
  }
}

/**
 * Safely reads data from localStorage.
 */
export function safeGetLocalStorage<T = any>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) return defaultValue;
    try {
      return JSON.parse(item) as T;
    } catch {
      // Return raw string value if legacy unquoted string was saved in localStorage
      return item as unknown as T;
    }
  } catch (err) {
    console.error(`Error reading key "${key}" from localStorage`, err);
    return defaultValue;
  }
}

/**
 * Asynchronously saves full state (including base64 images) to IndexedDB.
 */
export async function saveToIndexedDB(key: string, data: any): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB save error:", err);
    return false;
  }
}

/**
 * Asynchronously loads state from IndexedDB.
 */
export async function loadFromIndexedDB<T = any>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB load error:", err);
    return null;
  }
}
