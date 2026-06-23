"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Parses "50+", "98%", "10" into { number: 50, prefix: "", suffix: "+" }
 * so the animated value can re-attach the original formatting.
 */
function parseValue(raw: string) {
  const match = raw.match(/^([^\d]*)(\d+(?:[.,]\d+)?)([^\d]*)$/);
  if (!match) return { prefix: "", number: 0, suffix: raw };
  const [, prefix, numStr, suffix] = match;
  return { prefix, number: parseFloat(numStr.replace(",", ".")), suffix };
}

export function useCountUp(rawValue: string, inView: boolean, duration = 1400) {
  const { prefix, number, suffix } = parseValue(rawValue);
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(number * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(number);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, number, duration]);

  const formatted = Number.isInteger(number) ? Math.round(display).toString() : display.toFixed(1);
  return `${prefix}${formatted}${suffix}`;
}
