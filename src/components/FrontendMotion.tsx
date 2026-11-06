import { useEffect } from "react";

const revealTargets = [
  ".hero-copy", ".hero-actions", ".reel-hero-index", ".reel-briefing",
  ".page-heading", ".section-heading", ".panel", ".section-panel",
  ".feature-card", ".task-summary", ".answer-card", ".status-notice",
  ".research-opening", ".research-branch", ".research-node",
  ".research-chart-bar", ".safeguard-grid > *", ".research-disclaimer",
].map((selector) => `main ${selector}`).join(", ");

export default function FrontendMotion() {
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root || !("IntersectionObserver" in window)) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet<HTMLElement>();
    const headings = new Map<HTMLElement, string>();
    const words = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        target.classList.add("motion-word-lit");
        words.unobserve(target);
      }
    }, { rootMargin: "0px 0px -12% 0px" });

    function show(element: HTMLElement, animate: boolean) {
      element.classList.remove("motion-pending");
      element.classList.toggle("motion-in", animate);
      cards.unobserve(element);
    }

    const cards = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting && target instanceof HTMLElement) {
          show(target, !reducedMotion.matches);
        }
      }
    }, { threshold: 0.01 });

    function scan() {
      if (reducedMotion.matches || !root) return;

      root.querySelectorAll<HTMLElement>(revealTargets)
        .forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          const siblings = Array.from(element.parentElement?.children ?? []);
          element.style.setProperty("--motion-delay", `${Math.min(siblings.indexOf(element), 5) * 55}ms`);
          if (!element.contains(document.activeElement)) {
            element.classList.add("motion-pending");
            cards.observe(element);
          }
        });

      for (const heading of headings.keys()) {
        if (!heading.isConnected) headings.delete(heading);
      }

      // Reuse the existing mid-page heading as the tagline. Keep its exact text.
      const heading = Array.from(root.querySelectorAll<HTMLElement>(".section-heading h2"))
        .find((element) => element.textContent === "Two ways to examine video evidence");

      if (!heading || headings.has(heading)) return;
      const text = heading.textContent;
      headings.set(heading, text);
      const parts = text.split(/(\s+)/);
      const fragment = document.createDocumentFragment();
      parts.forEach((part, index) => {
        if (!part.trim()) {
          fragment.append(part);
          return;
        }
        const word = document.createElement("span");
        word.className = "motion-word";
        word.textContent = part;
        word.style.setProperty("--motion-delay", `${Math.floor(index / 2) * 75}ms`);
        fragment.append(word);
        words.observe(word);
      });
      heading.replaceChildren(fragment);
    }

    function showFocused(event: FocusEvent) {
      if (!(event.target instanceof HTMLElement)) return;
      let pending = event.target.closest<HTMLElement>(".motion-pending");
      while (pending) {
        show(pending, false);
        pending = pending.parentElement?.closest<HTMLElement>(".motion-pending") ?? null;
      }
    }

    function updatePreference() {
      if (reducedMotion.matches) {
        root?.querySelectorAll<HTMLElement>(".motion-pending, .motion-in").forEach((element) => show(element, false));
      } else {
        scan();
      }
    }

    const changes = new MutationObserver(scan);
    changes.observe(root, { childList: true, subtree: true });
    root.addEventListener("focusin", showFocused);
    reducedMotion.addEventListener("change", updatePreference);
    scan();

    return () => {
      changes.disconnect();
      cards.disconnect();
      words.disconnect();
      root.removeEventListener("focusin", showFocused);
      reducedMotion.removeEventListener("change", updatePreference);
      root.querySelectorAll<HTMLElement>(".motion-pending, .motion-in").forEach((element) => show(element, false));
      for (const [heading, text] of headings) heading.textContent = text;
    };
  }, []);

  return null;
}
