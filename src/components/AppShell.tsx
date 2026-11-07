import { useEffect, useRef, type ReactNode } from "react";
import { Activity, ScanEye } from "lucide-react";
import Navigation from "./Navigation";
import LimeStream from "./LimeStream";
import useGlassTilt from "../hooks/useGlassTilt";
import "../styles/capstone-overview.css";
import type { PageId } from "../types/inference";

interface Props {
  children: ReactNode;
  page: PageId;
  onNavigate: (page: PageId) => void;
}

const pageNames: Record<PageId, string> = {
  overview: "Overview",
  workspace: "Inference workspace",
  comparison: "Results comparison",
  research: "Research evidence",
};

export default function AppShell({ children, page, onNavigate }: Props) {
  const content = useRef<HTMLElement>(null);
  useGlassTilt(content, page);

  useEffect(() => {
    const main = content.current;
    if (page === "overview" || !main || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        target.classList.add("cv-route-arrived");
        observer.unobserve(target);
      }
    }, { threshold: 0.05 });

    main.querySelectorAll(".page-heading, .research-opening, .panel").forEach((element) => {
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [page]);

  return (
    <div className="application reel-shell" data-page={page}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="reel-header">
        <div className="brand">
          <div className="brand-icon">
            <ScanEye size={21} strokeWidth={1.65} aria-hidden="true" />
          </div>
          <div>
            <strong>VIDEO GROUNDING</strong>
            <span>RESEARCH LAB / CSE499B</span>
          </div>
        </div>

        <Navigation page={page} onNavigate={onNavigate} />

        <div className="system-status">
          <Activity size={15} aria-hidden="true" />
          <span>FRONTEND PREVIEW</span>
        </div>
      </header>

      <div className="main-shell">
        <div className="topbar-location reel-location">
          <span>CSE499B</span>
          <span className="breadcrumb-slash" aria-hidden="true">/</span>
          <strong>{pageNames[page]}</strong>
        </div>
        <main id="main-content" className="main-content" ref={content}>
          <LimeStream variant="route" key={page} />
          {children}
        </main>
      </div>

      <footer className="reel-footer">
        <p>VideoLLaMA2 · Frozen-method research</p>
        <span>Local frontend demonstration</span>
      </footer>
    </div>
  );
}
