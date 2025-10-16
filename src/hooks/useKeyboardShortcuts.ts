import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useKeyboardShortcuts = () => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement || 
          event.target instanceof HTMLSelectElement) {
        return;
      }

      const { ctrlKey, altKey, shiftKey, key } = event;

      // File menu shortcuts
      if (ctrlKey && !altKey && !shiftKey) {
        switch (key) {
          case 'n':
            event.preventDefault();
            router.push('/quotations');
            break;
          case 's':
            event.preventDefault();
            // Trigger save if available
            document.dispatchEvent(new CustomEvent('save-shortcut'));
            break;
          case 'p':
            event.preventDefault();
            window.print();
            break;
          case 'f':
            event.preventDefault();
            document.dispatchEvent(new CustomEvent('search-shortcut'));
            break;
          case '1':
            event.preventDefault();
            router.push('/dashboard');
            break;
          case '2':
            event.preventDefault();
            router.push('/customers');
            break;
          case '3':
            event.preventDefault();
            router.push('/products');
            break;
          case '4':
            event.preventDefault();
            router.push('/quotations');
            break;
          case '5':
            event.preventDefault();
            router.push('/orders');
            break;
          case '0':
            event.preventDefault();
            document.body.style.zoom = '1';
            break;
          case '=':
          case '+':
            event.preventDefault();
            document.body.style.zoom = (parseFloat(document.body.style.zoom || '1') + 0.1).toString();
            break;
          case '-':
            event.preventDefault();
            document.body.style.zoom = (parseFloat(document.body.style.zoom || '1') - 0.1).toString();
            break;
        }
      }

      // Ctrl+Shift shortcuts
      if (ctrlKey && shiftKey && !altKey) {
        switch (key) {
          case 'C':
            event.preventDefault();
            router.push('/customers');
            break;
          case 'P':
            event.preventDefault();
            router.push('/products');
            break;
          case 'O':
            event.preventDefault();
            router.push('/orders');
            break;
        }
      }

      // Function keys
      if (!ctrlKey && !altKey && !shiftKey) {
        switch (key) {
          case 'F5':
            event.preventDefault();
            window.location.reload();
            break;
          case 'F11':
            event.preventDefault();
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
            break;
          case 'F1':
            event.preventDefault();
            router.push('/manual');
            break;
        }
      }

      // Alt shortcuts
      if (altKey && !ctrlKey && !shiftKey) {
        switch (key) {
          case 'F4':
            event.preventDefault();
            window.close();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);
};