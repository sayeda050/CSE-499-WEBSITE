import { useEffect, type RefObject } from "react";

const CARDS = ".cv-input-card, .cv-task, .cv-workflow, .cv-branches, .cv-section > header, .panel, .answer-card, .research-branch, .safeguard-grid > article, .page-heading, .research-opening";
const ICON_HOSTS = ".cv-input-card > button, .cv-task, .cv-section > header, .cv-tagline, .cv-note, .cv-branches, .answer-card, .research-branch, .safeguard-grid > article, .page-heading, .research-opening-symbol, .upload-zone, .panel-header, .cv-workflow summary > span:first-child, .research-node, .question-readout, .file-information";
const CONTROLS = "input, textarea, select, video, [contenteditable=true], .upload-zone, .camera-preview, .video-stage";
const VARIABLES = ["--cg-rx", "--cg-ry", "--cg-lift", "--cg-x", "--cg-y"];

function pose(x: number, y: number, width: number, height: number) {
  const nx = Math.max(-1, Math.min(1, x / Math.max(1, width) * 2 - 1));
  const ny = Math.max(-1, Math.min(1, y / Math.max(1, height) * 2 - 1));
  const strength = height > 650 ? 1.5 : width > 1000 ? 2.4 : 4;
  return { rx: -ny * strength, ry: nx * strength, x: (nx + 1) * 50, y: (ny + 1) * 50 };
}

/** Delegated pointer motion; only the card under the pointer gets frame updates. */
export default function useGlassTilt(root: RefObject<HTMLElement | null>, route: string) {
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const cards = new Set<HTMLElement>();
    const icons = new Set<HTMLElement>();
    const iconObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add("icon-in-view");
        else entry.target.classList.remove("icon-in-view");
      }
    }, { threshold: .05 });
    let current: HTMLElement | null = null;
    let bounds: DOMRect | null = null;
    let frame = 0;
    let clientX = 0, clientY = 0;
    let pressed = false;
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0;
      if (current) {
        current.classList.remove("glass-active");
        VARIABLES.forEach(name => current?.style.removeProperty(name));
      }
      current = null; bounds = null; pressed = false;
    };
    const mark = () => {
      for (const card of cards) {
        if (!host.contains(card)) { card.classList.remove("glass-interactive"); cards.delete(card); if (current === card) reset(); }
      }
      host.querySelectorAll<HTMLElement>(CARDS).forEach(card => { cards.add(card); card.classList.add("glass-interactive"); });
      for (const icon of icons) {
        if (!host.contains(icon)) { iconObserver.unobserve(icon); icon.classList.remove("icon-in-view"); icons.delete(icon); }
      }
      host.querySelectorAll<HTMLElement>(ICON_HOSTS).forEach(icon => {
        if (!icons.has(icon)) { icons.add(icon); iconObserver.observe(icon); }
      });
    };
    const draw = () => {
      frame = 0;
      if (!current || !bounds) return;
      const p = pose(clientX - bounds.left, clientY - bounds.top, bounds.width, bounds.height);
      current.style.setProperty("--cg-rx", `${p.rx.toFixed(2)}deg`);
      current.style.setProperty("--cg-ry", `${p.ry.toFixed(2)}deg`);
      current.style.setProperty("--cg-x", `${p.x.toFixed(1)}%`);
      current.style.setProperty("--cg-y", `${p.y.toFixed(1)}%`);
      current.style.setProperty("--cg-lift", pressed ? "-1px" : "-5px");
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const move = (event: PointerEvent) => {
      if (reduced.matches || !fine.matches || event.pointerType === "touch" || document.hidden) { reset(); return; }
      const target = event.target instanceof Element ? event.target : null;
      const editing = document.activeElement instanceof Element && document.activeElement.matches(CONTROLS) && host.contains(document.activeElement);
      if (!target || target.closest(CONTROLS) || editing) { reset(); return; }
      const card = target.closest<HTMLElement>(CARDS);
      if (!card || !host.contains(card)) { reset(); return; }
      if (card !== current) {
        reset(); current = card;
        bounds = card.getBoundingClientRect();
        card.classList.add("glass-active");
      }
      clientX = event.clientX; clientY = event.clientY; schedule();
    };
    const out = (event: PointerEvent) => {
      if (current && (!(event.relatedTarget instanceof Node) || !current.contains(event.relatedTarget))) reset();
    };
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (event.target instanceof Element && event.target.closest(CONTROLS)) { reset(); return; }
      if (current) { pressed = true; schedule(); }
    };
    const up = () => { if (current) { pressed = false; schedule(); } };
    const visibility = () => {
      if (document.hidden) { reset(); host.classList.add("icons-paused"); }
      else host.classList.remove("icons-paused");
    };
    mark();
    visibility();
    const observer = new MutationObserver(mark);
    observer.observe(host, { childList: true, subtree: true });
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerout", out, { passive: true });
    host.addEventListener("pointerleave", reset);
    host.addEventListener("pointerdown", down, { passive: true });
    host.addEventListener("pointercancel", reset);
    host.addEventListener("dragstart", reset);
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("scroll", reset, { passive: true, capture: true });
    window.addEventListener("resize", reset);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", reset); fine.addEventListener("change", reset);
    return () => {
      reset(); observer.disconnect(); iconObserver.disconnect();
      icons.forEach(icon => icon.classList.remove("icon-in-view"));
      host.classList.remove("icons-paused");
      host.removeEventListener("pointermove", move); host.removeEventListener("pointerout", out);
      host.removeEventListener("pointerleave", reset); host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointercancel", reset); host.removeEventListener("dragstart", reset);
      window.removeEventListener("pointerup", up); window.removeEventListener("scroll", reset, true);
      window.removeEventListener("resize", reset); document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", reset); fine.removeEventListener("change", reset);
      cards.forEach(card => { card.classList.remove("glass-interactive", "glass-active"); VARIABLES.forEach(name => card.style.removeProperty(name)); });
    };
  }, [root, route]);
}
