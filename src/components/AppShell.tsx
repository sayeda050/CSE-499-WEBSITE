
import type { ReactNode } from "react";
import { Activity, ScanEye } from "lucide-react";
import Navigation from "./Navigation";
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

export default function AppShell({
  children,
  page,
  onNavigate,
}: Props) {
  return (
    <div className="application">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <ScanEye size={22} strokeWidth={1.7} />
          </div>

          <div>
            <strong>VIDEO GROUNDING</strong>
            <span>RESEARCH LAB / CSE499B</span>
          </div>
        </div>

        <Navigation
          page={page}
          onNavigate={onNavigate}
        />

        <div className="sidebar-bottom">
          <div className="sidebar-divider" />
          <p>VideoLLaMA2 · Frozen-method research</p>
          <span>Local frontend demonstration</span>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-location">
            <span>CSE499B</span>
            <span className="breadcrumb-slash">/</span>
            <strong>{pageNames[page]}</strong>
          </div>

          <div className="system-status">
            <Activity size={15} />
            <span>FRONTEND PREVIEW</span>
          </div>
        </header>

        <main id="main-content" className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
