
/**
 * Safe localStorage utility that handles SSR and storage errors
 */
export class ClientStorage {
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  static getItem<T>(key: string, defaultValue: T): T {
    if (!this.isClient()) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Failed to get item from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  static setItem<T>(key: string, value: T): boolean {
    if (!this.isClient()) {
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Failed to set item in localStorage (${key}):`, error);
      return false;
    }
  }

  static removeItem(key: string): boolean {
    if (!this.isClient()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove item from localStorage (${key}):`, error);
      return false;
    }
  }

  static clear(): boolean {
    if (!this.isClient()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  }
}

/**
 * React hook for localStorage with SSR safety
 */
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const value = ClientStorage.getItem(key, initialValue);
    setStoredValue(value);
  }, [key, initialValue]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (isClient) {
        ClientStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn(`Failed to update localStorage (${key}):`, error);
    }
  };

  return [storedValue, setValue];
}
