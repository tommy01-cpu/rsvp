"use client";

import { useEffect } from 'react';

export default function ScrollRestoration() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      try {
        // Ask browser not to restore scroll on history navigation/refresh
        history.scrollRestoration = 'manual';
      } catch (e) {
        // ignore (some browsers may throw in sandboxed contexts)
      }
    }

    // Ensure we start at top on first mount
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    const onBeforeUnload = () => {
      // restore default behavior before leaving so navigation works normally
      try {
        if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
      } catch (e) {}
    };

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      try {
        if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
      } catch (e) {}
    };
  }, []);

  return null;
}
