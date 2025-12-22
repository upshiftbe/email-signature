import type { ChangeEvent } from 'react';
import { useCallback } from 'react';
import { useFormState } from './hooks/useFormState';
import { useClipboard } from './hooks/useClipboard';
import { AppHeader } from './components/AppHeader';
import { SignatureForm } from './components/SignatureForm';
import { SignaturePreview } from './components/SignaturePreview';

function App() {
  const { formState, trimmedValues, updateField, resetForm, hydrated } = useFormState();
  const { previewRef, copySignature } = useClipboard();

  const handleFieldChange = useCallback(
    (id: string) => (event: ChangeEvent<HTMLInputElement>) => {
      updateField(id, event.target.value);
    },
    [updateField]
  );

  // Don't render until hydrated to avoid hydration mismatches
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 px-4 py-10 text-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 px-4 py-10 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <AppHeader />
        <div className="grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="space-y-6">
            <SignatureForm formState={formState} onFieldChange={handleFieldChange} onReset={resetForm} />
          </section>
          <aside className="space-y-6">
            <SignaturePreview
              values={trimmedValues}
              previewRef={previewRef}
              onReset={resetForm}
              onCopy={copySignature}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;
