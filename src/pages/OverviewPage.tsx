
import {
  ArrowRight,
  Camera,
  FileVideo,
  GitBranch,
  ShieldCheck,
} from "lucide-react";
import { TASKS } from "../data/verifiedResearch";
import type { PageId } from "../types/inference";

interface Props {
  onNavigate: (page: PageId) => void;
}

export default function OverviewPage({
  onNavigate,
}: Props) {
  return (
    <div className="page-stack">
      <div className="page-kicker">
        FINAL YEAR CAPSTONE / CSE499B
      </div>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            VIDEO UNDERSTANDING · EVIDENCE GROUNDING
          </p>

          <h1>
            See the video.
            <br />
            <span>Examine the answer.</span>
          </h1>

          <p className="hero-description">
            A research demonstration exploring how
            task-specific inference policies can mitigate
            action and temporal hallucinations in Video
            Large Language Models.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={() => onNavigate("workspace")}
            >
              Open inference workspace
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="button button-secondary"
              onClick={() => onNavigate("research")}
            >
              View research evidence
            </button>
          </div>
        </div>

        <div className="hero-graphic" aria-hidden="true">
          <div className="graphic-ring graphic-ring-one" />
          <div className="graphic-ring graphic-ring-two" />

          <div className="graphic-center">
            <span>VIDEO INPUT</span>
            <GitBranch size={38} strokeWidth={1.2} />
            <strong>FOUR BRANCHES</strong>
            <small>FROZEN POLICY</small>
          </div>
        </div>
      </section>

      <div className="section-heading">
        <div>
          <p className="eyebrow">DEMONSTRATION MODES</p>
          <h2>Two ways to examine video evidence</h2>
        </div>
      </div>

      <div className="feature-grid">
        <button
          className="feature-card"
          onClick={() => onNavigate("workspace")}
        >
          <div className="feature-icon">
            <FileVideo size={23} strokeWidth={1.6} />
          </div>

          <span className="feature-number">01 / VIDEO INPUT</span>
          <h3>Upload recorded footage</h3>
          <p>
            Select a VRU-Accident video or a compatible
            local clip, then prepare a question for analysis.
          </p>
          <span className="feature-action">
            Open workspace <ArrowRight size={16} />
          </span>
        </button>

        <button
          className="feature-card"
          onClick={() => onNavigate("workspace")}
        >
          <div className="feature-icon">
            <Camera size={23} strokeWidth={1.6} />
          </div>

          <span className="feature-number">02 / LIVE INPUT</span>
          <h3>Capture a scene</h3>
          <p>
            Use your laptop webcam to record real
            surroundings for the same research workflow.
          </p>
          <span className="feature-action">
            Open camera workspace <ArrowRight size={16} />
          </span>
        </button>
      </div>

      <section className="section-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">RESEARCH COVERAGE</p>
            <h2>Four hallucination tasks</h2>
          </div>
          <ShieldCheck size={22} strokeWidth={1.5} />
        </div>

        <div className="task-grid">
          {TASKS.map((task) => (
            <div className="task-summary" key={task.id}>
              <span>{task.id}</span>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <small>
                Default branch: {task.defaultBranch}
              </small>
            </div>
          ))}
        </div>
      </section>

      <p className="research-disclaimer">
        The interface can preview videos and tasks without
        a backend. Actual model predictions require the
        original research pipeline to be connected and
        verified independently.
      </p>
    </div>
  );
}
