"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const STAGGER_GRIDS =
  ".feature-grid,.service-grid,.benefit-grid,.steps-grid,.stat-grid,.result-mini-grid,.problem-items,.roadmap,.format-grid,.team-grid,.logo-grid,.list-grid,.risk-grid,.geo-list,.quote-grid,.float-cards,.process-stack,.faq-list,.bento-grid,.blog-grid";
const ANIM_SEL = ".reveal,.rise,.line-in";

/**
 * Dizayndagi (pharm-way-site) interaktivlik: kirish animatsiyalari (sarlavhalar serverda bo'lingan),
 * hisoblagichlar, logotip lentasi, jarayon/FAQ akkordeonlari va kategoriya filtrlari.
 * Sahifalar server komponentlari bo'lgani uchun DOM'ga har sahifa almashganda ulanadi.
 */
export default function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const ac = new AbortController();
    const on = <K extends keyof HTMLElementEventMap>(el: Element | Window | Document, type: K | string, fn: (e: Event) => void, opts?: AddEventListenerOptions) =>
      el.addEventListener(type, fn as EventListener, { ...opts, signal: ac.signal });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scope = document.querySelector<HTMLElement>(".site-view") ?? document.body;
    const rafs: number[] = [];
    let marqueeRaf = 0;

    // Stagger indekslari
    scope.querySelectorAll<HTMLElement>(STAGGER_GRIDS).forEach((grid) => {
      grid.classList.add("stagger");
      Array.from(grid.children).forEach((child, i) => (child as HTMLElement).style.setProperty("--i", String(i)));
    });

    // Kirish animatsiyalari
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px -20% 0px" },
    );
    scope.querySelectorAll(ANIM_SEL).forEach((el) => (reduce ? el.classList.add("in") : io.observe(el)));

    // Hisoblagichlar
    const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ");
    const counterIo = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          counterIo.unobserve(el);
          const target = parseFloat(el.dataset.count || "");
          const suffix = el.dataset.suffix || "";
          if (Number.isNaN(target)) return;
          if (reduce) {
            el.textContent = fmt(target) + suffix;
            return;
          }
          const start = performance.now();
          const tick = (now: number) => {
            const k = Math.min((now - start) / 1800, 1);
            el.textContent = fmt(target * (1 - (1 - k) * (1 - k))) + suffix;
            if (k < 1) rafs.push(requestAnimationFrame(tick));
          };
          rafs.push(requestAnimationFrame(tick));
        }),
      { threshold: 0.4 },
    );
    scope.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      el.textContent = "0" + (el.dataset.suffix || "");
      counterIo.observe(el);
    });

    // Logotip lentasi (server ikki nusxani allaqachon chiqargan)
    scope.querySelectorAll<HTMLElement>(".marquee-wrap").forEach((wrap) => {
      const track = wrap.querySelector<HTMLElement>(".marquee-track");
      if (!track) return;
      wrap.classList.add("ready");
      if (reduce) return;
      let offset = 0,
        half = track.scrollWidth / 2,
        boost = 0,
        dir = 1,
        paused = false,
        lastY = window.scrollY;
      on(window, "resize", () => (half = track.scrollWidth / 2));
      on(wrap, "mouseenter", () => (paused = true));
      on(wrap, "mouseleave", () => (paused = false));
      on(window, "scroll", () => {
        const d = window.scrollY - lastY;
        lastY = window.scrollY;
        if (d) dir = d > 0 ? 1 : -1;
        boost = Math.min(Math.abs(d) * 0.6, 26);
      }, { passive: true });
      const frame = () => {
        if (ac.signal.aborted) return;
        boost *= 0.92;
        if (!paused && half) {
          offset += (0.55 + boost) * dir;
          if (offset <= -half) offset += half;
          if (offset > 0) offset -= half;
          track.style.transform = `translate3d(${offset}px,0,0)`;
        }
        marqueeRaf = requestAnimationFrame(frame);
      };
      marqueeRaf = requestAnimationFrame(frame);
    });

    // "Yondashuv" kartalari
    scope.querySelectorAll(".approach-toggle").forEach((btn) =>
      on(btn, "click", () => {
        const item = btn.closest(".approach-item");
        item?.parentElement?.querySelectorAll(".approach-item").forEach((x) => x !== item && x.classList.remove("open"));
        item?.classList.toggle("open");
      }),
    );

    // Jarayon akkordeoni — bir vaqtda bitta bosqich ochiq
    scope.querySelectorAll(".process-stack").forEach((stack, s) => {
      stack.querySelectorAll(".process-item").forEach((item, i) => {
        const btn = item.querySelector(".process-head");
        const body = item.querySelector(".process-body");
        if (!btn || !body) return;
        body.id = `process-panel-${s}-${i}`;
        btn.setAttribute("aria-controls", body.id);
        btn.setAttribute("aria-expanded", item.classList.contains("open") ? "true" : "false");
        on(btn, "click", () => {
          const willOpen = !item.classList.contains("open");
          stack.querySelectorAll(".process-item").forEach((x) => {
            x.classList.remove("open");
            x.querySelector(".process-head")?.setAttribute("aria-expanded", "false");
          });
          if (willOpen) {
            item.classList.add("open");
            btn.setAttribute("aria-expanded", "true");
          }
        });
      });
    });

    // FAQ akkordeoni
    scope.querySelectorAll(".faq-list").forEach((list, li) => {
      list.querySelectorAll(".faq-item").forEach((item, i) => {
        const btn = item.querySelector<HTMLElement>(".faq-button");
        const answer = item.querySelector<HTMLElement>(".faq-answer");
        if (!btn || !answer) return;
        const uid = `faq-${li}-${i}`;
        btn.id = `${uid}-btn`;
        answer.id = `${uid}-panel`;
        answer.setAttribute("role", "region");
        answer.setAttribute("aria-labelledby", btn.id);
        btn.setAttribute("aria-controls", answer.id);
        btn.setAttribute("aria-expanded", item.classList.contains("open") ? "true" : "false");
        on(btn, "click", () => {
          list.querySelectorAll(".faq-item").forEach((x) => {
            if (x !== item) {
              x.classList.remove("open");
              x.querySelector(".faq-button")?.setAttribute("aria-expanded", "false");
            }
          });
          btn.setAttribute("aria-expanded", item.classList.toggle("open") ? "true" : "false");
        });
      });
    });

    // Kategoriya filtrlari (FAQ va blog)
    scope.querySelectorAll<HTMLElement>("[data-filter-group]").forEach((group) => {
      const chips = Array.from(group.querySelectorAll<HTMLElement>(".chip"));
      const items = Array.from(
        scope.querySelectorAll<HTMLElement>(`[data-filter-target="${group.dataset.filterGroup}"] [data-cat]`),
      );
      chips.forEach((chip) =>
        on(chip, "click", () => {
          const f = chip.dataset.filter;
          chips.forEach((c) => {
            c.classList.toggle("active", c === chip);
            c.setAttribute("aria-pressed", c === chip ? "true" : "false");
          });
          let n = 0;
          items.forEach((item) => {
            const show = f === "all" || (item.dataset.cat || "").split("|").includes(f || "");
            item.hidden = !show;
            if (!show) return;
            n += 1;
            const num = item.querySelector(".faq-number");
            if (num) num.textContent = String(n).padStart(2, "0");
          });
        }),
      );
    });

    return () => {
      ac.abort();
      io.disconnect();
      counterIo.disconnect();
      rafs.forEach((id) => cancelAnimationFrame(id));
      cancelAnimationFrame(marqueeRaf);
    };
  }, [pathname]);

  return null;
}
