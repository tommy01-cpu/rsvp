"use client";

import { useEffect } from 'react';

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
          const anim = (el.dataset.animate as string) || 'animate-fade-in-up';
          el.classList.remove('opacity-0');
          el.classList.add(anim);
          el.style.willChange = 'transform, opacity';
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
          const anim = (el.dataset.animate as string) || 'animate-fade-in-up';
            el.classList.remove('opacity-0');
            el.classList.add(anim);
          // hint the browser to composite transforms/opacities on GPU
          el.style.willChange = 'transform, opacity';

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
