// apps/frontend/src/utils/storage.utils.ts

import { STORAGE_EXPIRY } from '../constants';

/**
 * Storage item with expiry
 */
interface StorageItem<T> {
  value: T;
  expiry?: number;
}

/**
 * Set item in localStorage with optional expiry
 */
export const setLocalStorage = <T>(key: string, value: T, expiryDays?: number): void => {
  try {
    const item: StorageItem<T> = {
      value,
      expiry: expiryDays ? Date.now() + (expiryDays * 24 * 60 * 60 * 1000) : undefined
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};

/**
 * Get item from localStorage with expiry check
 */
export const getLocalStorage = <T>(key: string): T | null => {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    const item: StorageItem<T> = JSON.parse(itemStr);
    
    // Check if item has expired
    if (item.expiry && Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return null;
  }
};

/**
 * Remove item from localStorage
 */
export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage:', error);
  }
};

/**
 * Clear all localStorage
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Set item in sessionStorage
 */
export const setSessionStorage = <T>(key: string, value: T): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting sessionStorage:', error);
  }
};

/**
 * Get item from sessionStorage
 */
export const getSessionStorage = <T>(key: string): T | null => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting sessionStorage:', error);
    return null;
  }
};

/**
 * Remove item from sessionStorage
 */
export const removeSessionStorage = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing sessionStorage:', error);
  }
};

/**
 * Clear all sessionStorage
 */
export const clearSessionStorage = (): void => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
  }
};

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if sessionStorage is available
 */
export const isSessionStorageAvailable = (): boolean => {
  try {
    const test = '__sessionStorage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get storage size in bytes
 */
export const getStorageSize = (storage: Storage): number => {
  let size = 0;
  for (const key in storage) {
    if (storage.hasOwnProperty(key)) {
      size += storage[key].length + key.length;
    }
  }
  return size;
};

/**
 * Clear expired items from localStorage
 */
export const clearExpiredItems = (): void => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    try {
      const itemStr = localStorage.getItem(key);
      if (itemStr) {
        const item = JSON.parse(itemStr);
        if (item.expiry && Date.now() > item.expiry) {
          localStorage.removeItem(key);
        }
      }
    } catch {
      // Skip invalid items
    }
  });
};