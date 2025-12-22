import type { FormState } from '../types';
import { STORAGE_KEY } from '../config/formConfig';

// Maximum size for localStorage (5MB is typical browser limit, we use 1MB to be safe)
const MAX_STORAGE_SIZE = 1024 * 1024; // 1MB

/**
 * Estimates the size of a string in bytes
 */
function estimateSize(str: string): number {
  return new Blob([str]).size;
}

export function readStoredState(): FormState {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    // Check size before parsing
    if (estimateSize(raw) > MAX_STORAGE_SIZE) {
      console.warn('localStorage data too large, clearing...');
      clearStoredState();
      return {};
    }

    return JSON.parse(raw) as FormState;
  } catch (error) {
    console.warn('Unable to read localStorage', error);
    // Clear corrupted data
    clearStoredState();
    return {};
  }
}

export function persistState(state: FormState): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const serialized = JSON.stringify(state);
    const size = estimateSize(serialized);

    // Check size before storing
    if (size > MAX_STORAGE_SIZE) {
      console.warn('Form state too large to persist, skipping localStorage save');
      return;
    }

    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    // Handle quota exceeded errors
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, clearing old data...');
      try {
        // Try to clear and retry
        clearStoredState();
        const serialized = JSON.stringify(state);
        if (estimateSize(serialized) <= MAX_STORAGE_SIZE) {
          localStorage.setItem(STORAGE_KEY, serialized);
        }
      } catch (retryError) {
        console.warn('Unable to persist localStorage after cleanup', retryError);
      }
    } else {
      console.warn('Unable to persist localStorage', error);
    }
  }
}

export function clearStoredState(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to clear localStorage', error);
  }
}
