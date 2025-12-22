import type { FormState } from '../types';

export function getStateFromUrl(): FormState {
  if (typeof window === 'undefined') {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const state: FormState = {};

  params.forEach((value, key) => {
    state[key] = value;
  });

  return state;
}

export function updateUrlFromState(state: FormState): void {
  if (typeof window === 'undefined') {
    return;
  }

  const params = new URLSearchParams();
  Object.entries(state).forEach(([key, value]) => {
    const trimmed = value.trim();
    if (trimmed) {
      params.set(key, trimmed);
    }
  });

  const query = params.toString();
  const nextUrl = window.location.pathname + (query ? `?${query}` : '');
  window.history.replaceState(null, '', nextUrl);
}

export function clearUrlState(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.history.replaceState(null, '', window.location.pathname);
}
