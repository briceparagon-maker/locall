"use client";

import { useEffect, useState } from "react";

export function useStickyLogoScale(maxScroll = 90, maxScale = 1.22) {
  const [scale, setScale] = useState(1);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      const y = Math.max(window.scrollY, 0);
      const t = Math.min(y, maxScroll) / maxScroll;
      setScale(1 + t * (maxScale - 1));
      setScrolled(y > 8);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [maxScroll, maxScale]);

  return { scale, scrolled };
}
