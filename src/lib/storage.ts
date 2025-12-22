import type { FormState } from '../types';
import { STORAGE_KEY } from '../config/formConfig';

export function readStoredState(): FormState {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FormState) : {};
  } catch (error) {
    console.warn('Unable to read localStorage', error);
    return {};
  }
}

export function persistState(state: FormState): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Unable to persist localStorage', error);
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
