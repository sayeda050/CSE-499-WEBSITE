import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Activity, ScanEye } from "lucide-react";
import Navigation from "./Navigation";
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

const routePaths = Array.from({ length: 7 }, (_, index) => {
  const lane = index - 3;
  return `M ${960 + lane * 10} 0
    C ${952 + lane * 10} 125, ${855 + lane * 11} 182, ${497 + lane * 10} 300
    S ${30 + lane * 12} 430, ${94 + lane * 12} 540
    S ${785 + lane * 11} 675, ${911 + lane * 13} 807
    S ${724 + lane * 15} 945, ${586 + lane * 16} 1000`;
});

function RouteStream() {
  return (
    <svg className="cv-page-stream cv-route-stream" viewBox="0 0 1000 1000"
      preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {routePaths.map((path, index) => (
        <g key={path} style={{ "--cv-lane": index } as CSSProperties}>
          <path className="cv-page-stream-bed" d={path} pathLength="100" />
          <path className="cv-page-stream-pulse" d={path} pathLength="100" />
        </g>
      ))}
    </svg>
  );
}

export default function AppShell({ children, page, onNavigate }: Props) {
  const content = useRef<HTMLElement>(null);

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
          {page !== "overview" && <RouteStream key={page} />}
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
