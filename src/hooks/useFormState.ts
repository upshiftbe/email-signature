import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormState, TrimmedValues } from '../types';
import { FORM_FIELDS, PREFILL_VALUES } from '../config/formConfig';
import { readStoredState, persistState, clearStoredState } from '../lib/storage';
import { getStateFromUrl, updateUrlFromState, clearUrlState } from '../lib/urlState';
import { validateField, validateForm } from '../lib/validation';

function createDefaultState(): FormState {
  return FORM_FIELDS.reduce<FormState>(
    (state, field) => ({
      ...state,
      [field.id]: PREFILL_VALUES[field.id] ?? '',
    }),
    {} as FormState
  );
}

function initializeState(): FormState {
  if (typeof window === 'undefined') {
    return createDefaultState();
  }

  const params = getStateFromUrl();
  const stored = readStoredState();

  return FORM_FIELDS.reduce<FormState>((acc, field) => {
    // Priority: URL params > localStorage > prefill > empty
    if (params[field.id]) {
      return { ...acc, [field.id]: params[field.id] };
    }

    if (stored[field.id]) {
      return { ...acc, [field.id]: stored[field.id] };
    }

    if (PREFILL_VALUES[field.id]) {
      return { ...acc, [field.id]: PREFILL_VALUES[field.id] };
    }

    return { ...acc, [field.id]: '' };
  }, {});
}

export function useFormState() {
  const [formState, setFormState] = useState<FormState>(initializeState);
  const [hydrated, setHydrated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Hydrate on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const initialState = initializeState();
    setFormState(initialState);
    setHydrated(true);
  }, []);

  // Sync state to URL and localStorage
  useEffect(() => {
    if (!hydrated) {
      return;
    }

    updateUrlFromState(formState);
    persistState(formState);
  }, [formState, hydrated]);

  const updateField = useCallback(
    (id: string, value: string) => {
      setFormState((prev) => ({
        ...prev,
        [id]: value,
      }));

      // Validate field if it has been touched
      if (touched[id]) {
        const error = validateField(id, value);
        setErrors((prev) => {
          if (error) {
            return { ...prev, [id]: error };
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...rest } = prev;
          return rest;
        });
      }
    },
    [touched]
  );

  const setFieldTouched = useCallback(
    (id: string) => {
      setTouched((prev) => ({ ...prev, [id]: true }));
      const error = validateField(id, formState[id] || '');
      setErrors((prev) => {
        if (error) {
          return { ...prev, [id]: error };
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    },
    [formState]
  );

  const resetForm = useCallback(() => {
    const defaultState = createDefaultState();
    setFormState(defaultState);
    setErrors({});
    setTouched({});
    clearStoredState();
    clearUrlState();
  }, []);

  const trimmedValues = useMemo((): TrimmedValues => {
    const getValue = (key: string) => (formState[key] || '').trim();
    const websiteUrl = getValue('input-website');
    return {
      name: getValue('input-naam'),
      role: getValue('input-functie'),
      phone: getValue('input-gsm'),
      email: getValue('input-email'),
      location1: getValue('input-locatie-1'),
      location2: getValue('input-locatie-2'),
      websiteUrl,
      websiteLabel: websiteUrl ? websiteUrl.replace(/^https?:\/\//, '') : '',
      facebook: getValue('input-facebook'),
      linkedin: getValue('input-linkedin'),
      instagram: getValue('input-instagram'),
      logoUrl: getValue('input-logo-url'),
    };
  }, [formState]);

  const isValid = useMemo(() => {
    const validation = validateForm(formState);
    return validation.isValid;
  }, [formState]);

  return {
    formState,
    trimmedValues,
    updateField,
    setFieldTouched,
    resetForm,
    hydrated,
    errors,
    isValid,
  };
}
