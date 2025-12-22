import { useCallback, useRef } from 'react';

export function useClipboard() {
  const previewRef = useRef<HTMLDivElement | null>(null);

  const copySignature = useCallback(async () => {
    const preview = previewRef.current;
    if (!preview) {
      return;
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
        return;
      } catch (error) {
        console.warn('navigator.clipboard.write failed', error);
      }
    }

    // Fallback to execCommand
    if (typeof document === 'undefined') {
      return;
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
      document.execCommand('copy');
    } catch (error) {
      console.warn('Copy command failed', error);
    }

    selection?.removeAllRanges();
    document.body.removeChild(tempContainer);
  }, []);

  return {
    previewRef,
    copySignature,
  };
}
