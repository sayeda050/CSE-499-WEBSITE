
import {
  ChartNoAxesCombined,
  Clapperboard,
  Columns2,
  LayoutDashboard,
} from "lucide-react";
import type { PageId } from "../types/inference";

interface Props {
  page: PageId;
  onNavigate: (page: PageId) => void;
}

const links = [
  {
    page: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    page: "workspace",
    label: "Inference workspace",
    icon: Clapperboard,
  },
  {
    page: "comparison",
    label: "Results comparison",
    icon: Columns2,
  },
  {
    page: "research",
    label: "Research evidence",
    icon: ChartNoAxesCombined,
  },
] as const;

export default function Navigation({
  page,
  onNavigate,
}: Props) {
  return (
    <nav aria-label="Main navigation" className="navigation">
      <p className="navigation-caption">WORKSPACE</p>

      {links.map(({ page: id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={`nav-item ${page === id ? "active" : ""}`}
          onClick={() => onNavigate(id)}
          aria-current={page === id ? "page" : undefined}
        >
          <Icon size={18} strokeWidth={1.7} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
