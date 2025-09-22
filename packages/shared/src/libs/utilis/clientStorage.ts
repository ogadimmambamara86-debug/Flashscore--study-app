/**
 * Safe localStorage utility that handles SSR and storage errors
 */
export class ClientStorage {
  private static prefix = "app_"; // optional prefix to avoid collisions

  static isClient(): boolean {
    return typeof window !== "undefined";
  }

  static getItem<T>(key: string, defaultValue: T): T {
    if (!this.isClient()) return defaultValue;

    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Failed to get item from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  static setItem<T>(key: string, value: T): boolean {
    if (!this.isClient()) return false;

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Failed to set item in localStorage (${key}):`, error);
      return false;
    }
  }

  static removeItem(key: string): boolean {
    if (!this.isClient()) return false;

    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove item from localStorage (${key}):`, error);
      return false;
    }
  }

  static clear(): boolean {
    if (!this.isClient()) return false;

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
      return false;
    }
  }
}

/**
 * React hook for localStorage with SSR safety & sync across tabs
 */
import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Lazy initialization (runs only once)
  const [storedValue, setStoredValue] = useState<T>(() => {
    return ClientStorage.getItem(key, initialValue);
  });

  // Sync changes across multiple tabs/windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === ClientStorage.prefix + key) {
        setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, initialValue]);

  // Setter with functional updates
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const newValue =
          value instanceof Function ? (value as (prev: T) => T)(prev) : value;
        ClientStorage.setItem(key, newValue);
        return newValue;
      });
    } catch (error) {
      console.warn(`Failed to update localStorage (${key}):`, error);
    }
  };

  return [storedValue, setValue];
}