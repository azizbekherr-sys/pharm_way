"use client";

import { useReportWebVitals } from "next/web-vitals";

// Pushes Core Web Vitals into the GTM dataLayer (only when a dataLayer exists,
// i.e. GTM is configured). No-op otherwise.
export default function WebVitals() {
  useReportWebVitals((metric) => {
    const w = window as unknown as { dataLayer?: unknown[] };
    if (!Array.isArray(w.dataLayer)) return;
    w.dataLayer.push({
      event: "web-vitals",
      metric_name: metric.name,
      metric_id: metric.id,
      metric_value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      metric_rating: metric.rating,
    });
  });
  return null;
}
