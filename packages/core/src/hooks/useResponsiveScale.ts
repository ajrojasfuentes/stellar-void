import { useState, useEffect } from 'react';

/**
 * A hook that returns a responsive scale multiplier based on the window's width.
 * Useful for scaling down heavy particle sizes on mobile devices without hardcoding sizes in tsParticles config.
 * 
 * @returns {number} A multiplier (e.g. 1.0 for desktop, 0.6 for mobile)
 */
export function useResponsiveScale(): number {
  // If SSR or window is undefined, assume desktop scale by default
  const [scale, setScale] = useState<number>(typeof window !== 'undefined' && window.innerWidth < 768 ? 0.6 : 1.0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: number;

    const handleResize = () => {
      // Debounce the resize event slightly to avoid spamming re-renders
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const width = window.innerWidth;
        if (width < 480) {
          setScale(0.5); // Mobile
        } else if (width < 768) {
          setScale(0.6); // Tablet/Large Mobile
        } else if (width < 1024) {
          setScale(0.8); // Small Desktop
        } else {
          setScale(1.0); // Desktop
        }
      }, 150);
    };

    // Initial check (in case it wasn't correct on first render)
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return scale;
}
