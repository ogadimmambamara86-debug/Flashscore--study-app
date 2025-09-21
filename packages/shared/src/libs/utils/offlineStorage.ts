export type StoredData = Record<string, any>;

const STORAGE_KEY_PREFIX = 'myApp_'; // Avoid conflicts with other localStorage keys

/** Save any data locally */
export const saveOffline = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn('Failed to save offline data:', err);
  }
};

/** Retrieve stored data */
export const getOffline = <T = any>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

/** Remove stored data */
export const removeOffline = (key: string) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_PREFIX + key);
};