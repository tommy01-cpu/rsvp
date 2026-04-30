"use client";

import { useEffect } from 'react';

const LEGACY_ANIMATION_MAP: Record<string, string> = {
  'animate-fade-in-up': 'reveal-up',
  'animate-fade-in': 'reveal-fade',
  'slide-in-left': 'reveal-left',
  'slide-in-right': 'reveal-right',
};

const KNOWN_ANIMATIONS = [
  'reveal-fade',
  'reveal-up',
  'reveal-left',
  'reveal-right',
  'zoom-in',
  'reveal-blur-up',
  'reveal-rotate-in',
  'reveal-flip-up',
  'reveal-fall-letters',
  'reveal-image-rise',
  'reveal-image-zoom',
  'animate-fade-in-up',
  'animate-fade-in',
  'slide-in-left',
  'slide-in-right',
];

function restoreOriginalText(el: HTMLElement) {
  const originalHtml = el.dataset.originalHtml;
  if (typeof originalHtml === 'string' && el.dataset.fallApplied === '1') {
    el.innerHTML = originalHtml;
    delete el.dataset.fallApplied;
    return;
  }
  const originalText = el.dataset.originalText;
  if (typeof originalText === 'string' && el.dataset.fallApplied === '1') {
    el.textContent = originalText;
    delete el.dataset.fallApplied;
  }
}

function isTextOnlyElement(el: HTMLElement) {
  // Letter-by-letter animation should not rewrite structured containers.
  // It is safe only when the element has no child elements.
  if (el.children.length === 0) return true;
  // Opt-in escape hatch for specific heading/text elements that intentionally
  // provide a plain-text source via data-original-text.
  const allows = el.dataset.allowFallLetters === '1';
  const hasSource = typeof el.dataset.originalText === 'string' && el.dataset.originalText.length > 0;
  return allows && hasSource;
}

function applyFallingLetters(el: HTMLElement, durationMs: number, delayMs: number) {
  const sourceText = (el.dataset.originalText ?? el.textContent ?? '').toString();
  if (!el.dataset.originalHtml) {
    el.dataset.originalHtml = el.innerHTML;
  }
  if (!el.dataset.originalText) {
    el.dataset.originalText = sourceText;
  }

  el.innerHTML = '';
  const frag = document.createDocumentFragment();
  const stagger = 35;
  const highlightChar = (el.dataset.highlightChar || '').trim();
  const highlightColor = (el.dataset.highlightColor || '').trim();
  const parts = sourceText.split(/(\s+)/);
  let letterIndex = 0;

  parts.forEach((part) => {
    if (!part) return;
    if (/^\s+$/.test(part)) {
      frag.appendChild(document.createTextNode(part));
      return;
    }
    const word = document.createElement('span');
    word.style.whiteSpace = 'nowrap';
    word.style.display = 'inline-block';

    Array.from(part).forEach((char) => {
      const span = document.createElement('span');
      span.className = 'fall-letter';
      span.textContent = char;
      const normalizedChar = char.trim();
      const normalizedHighlight = highlightChar.trim();
      if (normalizedHighlight && normalizedChar === normalizedHighlight) {
        span.classList.add('fall-letter-highlight');
        if (highlightColor) span.style.color = highlightColor;
      }
      span.style.animationDuration = `${Math.max(220, durationMs)}ms`;
      span.style.animationDelay = `${Math.max(0, delayMs + letterIndex * stagger)}ms`;
      word.appendChild(span);
      letterIndex += 1;
    });

    frag.appendChild(word);
  });

  el.appendChild(frag);
  el.classList.add('reveal-fall-letters');
  el.style.opacity = '1';
  el.style.transform = 'none';
  el.dataset.fallApplied = '1';
}

function normalizeAnimation(raw?: string) {
  const value = (raw || '').trim();
  if (!value) return 'reveal-fade';
  return LEGACY_ANIMATION_MAP[value] || value;
}

function applyAnimation(el: HTMLElement, raw?: string) {
  const anim = normalizeAnimation(raw);
  const durationRaw = Number(el.dataset.animDuration || '');
  const delayRaw = Number(el.dataset.animDelay || '');
  const durationMs = Number.isFinite(durationRaw) && durationRaw > 0 ? durationRaw : 850;
  const delayMs = Number.isFinite(delayRaw) && delayRaw >= 0 ? delayRaw : 0;

  if (anim !== 'reveal-fall-letters') {
    restoreOriginalText(el);
  }
  // Reset previous animation state so newly selected admin animation always replays.
  el.style.animation = 'none';
  KNOWN_ANIMATIONS.forEach((cls) => el.classList.remove(cls));
  // Force reflow before applying the next animation class.
  void el.offsetWidth;
  el.style.animation = '';
  el.classList.remove('opacity-0');
  if (anim === 'reveal-fall-letters' && isTextOnlyElement(el)) {
    applyFallingLetters(el, durationMs, delayMs);
  } else {
    // Fallback for non-text containers to preserve layout and child markup.
    const fallbackAnim = anim === 'reveal-fall-letters' ? 'reveal-fade' : anim;
    el.classList.add(anim);
    if (fallbackAnim !== anim) {
      el.classList.remove(anim);
      el.classList.add(fallbackAnim);
    }
    el.style.animationDuration = `${durationMs}ms`;
    el.style.animationDelay = `${delayMs}ms`;
  }
  el.style.willChange = 'transform, opacity';
}

export default function ScrollReveal() {
  useEffect(() => {
    // Use a conservative rootMargin and threshold to avoid triggering
    // animations prematurely on mobile (prevents page jumping/rumble).
    const options: IntersectionObserverInit = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 };
    let initialMount = true;
    // helper to animate elements that are already visible
    const elsObserved = new Set<HTMLElement>();

    const checkAndAnimate = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal-on-scroll'));
      els.forEach((el) => {
        if (elsObserved.has(el)) return; // already handled
        const rect = el.getBoundingClientRect();
        const vh = (window.innerHeight || document.documentElement.clientHeight) || 0;
        const isVisiblyWithin = rect.top < vh && rect.bottom > 0;
        if (isVisiblyWithin) {
          applyAnimation(el, el.dataset.animate as string);
          elsObserved.add(el);
          const onAnimEnd = () => {
            el.removeEventListener('animationend', onAnimEnd);
          };
          el.addEventListener('animationend', onAnimEnd);
        }
      });
    };

    const onUserInteraction = () => {
      initialMount = false;
      checkAndAnimate();
      window.removeEventListener('scroll', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
    };

    // After a short timeout, allow animations even if user didn't scroll (fallback)
    const initialTimeout = window.setTimeout(() => { initialMount = false; checkAndAnimate(); }, 900);

    window.addEventListener('scroll', onUserInteraction, { passive: true });
    window.addEventListener('touchstart', onUserInteraction, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        // Additional bounding rect check to ensure element is actually within viewport
        const rect = entry.boundingClientRect;
        const vh = (window.innerHeight || document.documentElement.clientHeight) || 0;
        const isVisiblyWithin = rect.top < vh && rect.bottom > 0;

        // Skip animating elements that are already visible during the initial mount phase
        if (initialMount && entry.isIntersecting && isVisiblyWithin) {
          // do not animate yet; keep observing until user interacts or timeout
          return;
        }

        // require a minimum intersectionRatio and bounding rect overlap
        if (entry.isIntersecting && entry.intersectionRatio >= 0.12 && isVisiblyWithin) {
          applyAnimation(el, el.dataset.animate as string);

          // don't immediately unobserve until animation finishes to avoid abrupt layout changes
          const onAnimEnd = () => {
            observer.unobserve(el);
            el.removeEventListener('animationend', onAnimEnd);
          };
          el.addEventListener('animationend', onAnimEnd);
        }
      });
    }, options);

    const els = document.querySelectorAll<HTMLElement>('.reveal-on-scroll');
    els.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      window.clearTimeout(initialTimeout);
      window.removeEventListener('scroll', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
    };
  }, []);

  return null;
}
