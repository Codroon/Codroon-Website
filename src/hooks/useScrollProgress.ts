"use client";
import { useEffect, useRef, useState } from "react";

/**
 * useScrollProgress — tracks scroll progress (0 → 1).
 *
 * - No target: progress of the whole document.
 * - With the returned `ref` attached to an element: progress of that
 *   element travelling through the viewport (0 = just entering bottom,
 *   1 = just left the top).
 *
 * Uses requestAnimationFrame + passive listeners; cleans up on unmount.
 */
export function useScrollProgress<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const compute = () => {
      frame = 0;
      const el = ref.current;

      if (!el) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
        return;
      }

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const passed = vh - rect.top;
      setProgress(Math.min(1, Math.max(0, passed / total)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, progress };
}

export default useScrollProgress;