import { useCallback, useRef } from 'react';

type CopyResult = {
  success: boolean;
  error?: string;
};

export function useClipboard() {
  const previewRef = useRef<HTMLDivElement | null>(null);

  const copySignature = useCallback(async (): Promise<CopyResult> => {
    const preview = previewRef.current;
    if (!preview) {
      return { success: false, error: 'Preview not available' };
    }

    const htmlPayload = preview.outerHTML;
    const plainPayload = preview.innerText || '';

    // Try modern Clipboard API first
    if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([htmlPayload], { type: 'text/html' }),
            'text/plain': new Blob([plainPayload], { type: 'text/plain' }),
          }),
        ]);
        return { success: true };
      } catch (error) {
        console.warn('navigator.clipboard.write failed', error);
        // Fall through to execCommand fallback
      }
    }

    // Fallback to execCommand
    if (typeof document === 'undefined') {
      return { success: false, error: 'Document not available' };
    }

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    // Use textContent first, then innerHTML to prevent XSS
    tempContainer.textContent = '';
    tempContainer.innerHTML = htmlPayload;
    document.body.appendChild(tempContainer);

    const range = document.createRange();
    range.selectNodeContents(tempContainer);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    try {
      const success = document.execCommand('copy');
      selection?.removeAllRanges();
      document.body.removeChild(tempContainer);

      if (success) {
        return { success: true };
      } else {
        return { success: false, error: 'Copy command failed' };
      }
    } catch (error) {
      selection?.removeAllRanges();
      document.body.removeChild(tempContainer);
      console.warn('Copy command failed', error);
      return { success: false, error: 'Copy command failed' };
    }
  }, []);

  return {
    previewRef,
    copySignature,
  };
}
