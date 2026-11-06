import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowRight, Camera, FileVideo, GitBranch } from "lucide-react";
import "../styles/capstone-overview.css";
import { BRANCHES, TASKS } from "../data/verifiedResearch";
import type { PageId } from "../types/inference";

interface Props {
  onNavigate: (page: PageId) => void;
}

const tagline = ["Look at the evidence.", "Then examine the answer."];

const streamPaths = Array.from({ length: 15 }, (_, index) => {
  const lane = index - 7;
  return `M 930 ${106 + lane * 13}
    C 655 ${98 + lane * 9}, 485 ${160 + lane * 6}, 345 ${275 + lane * 3}
    S 192 ${394 + lane * 1.5}, 286 ${426 + lane * 4}
    S 665 ${466 + lane * 9}, 930 ${531 + lane * 12}`;
});

const pagePaths = Array.from({ length: 9 }, (_, index) => {
  const lane = index - 4;
  return `M ${845 + lane * 14} 0
    C ${982 + lane * 14} 84, ${966 + lane * 14} 190, ${760 + lane * 12} 250
    S ${155 + lane * 10} 360, ${115 + lane * 12} 465
    S ${410 + lane * 10} 575, ${744 + lane * 12} 647
    S ${991 + lane * 13} 787, ${807 + lane * 14} 869
    S ${195 + lane * 12} 960, ${68 + lane * 13} 1000`;
});

function PageStream() {
  return (
    <svg className="cv-page-stream" viewBox="0 0 1000 1000" preserveAspectRatio="none"
      aria-hidden="true" focusable="false">
      {pagePaths.map((path, index) => (
        <g key={path} style={{ "--cv-lane": index } as CSSProperties}>
          <path className="cv-page-stream-bed" d={path} pathLength="100" />
          <path className="cv-page-stream-thread" d={path} pathLength="100" />
          <path className="cv-page-stream-pulse" d={path} pathLength="100" />
        </g>
      ))}
    </svg>
  );
}

function EvidenceStream() {
  return (
    <div className="cv-stream-stage">
      <svg className="cv-stream-art" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice"
        aria-hidden="true" focusable="false">
        {streamPaths.map((path, index) => (
          <g key={path} style={{ "--cv-lane": index } as CSSProperties}>
            <path className="cv-stream-line" d={path} pathLength="100" />
            <path className="cv-stream-pulse" d={path} pathLength="100" />
          </g>
        ))}
      </svg>

      <details className="cv-workflow" open>
        <summary>
          <span><GitBranch aria-hidden="true" size={16} /> Research workflow</span>
          <span className="cv-workflow-chevron" aria-hidden="true" />
        </summary>
        <div className="cv-workflow-body">
          <span className="cv-workflow-node">Video + question</span>
          <div className="cv-workflow-connector" aria-hidden="true" />
          <div className="cv-workflow-tasks" aria-label="Research tasks">
            {TASKS.map((task) => (
              <span key={task.id} title={task.title}>{task.id}</span>
            ))}
          </div>
          <div className="cv-workflow-connector" aria-hidden="true" />
          <span className="cv-workflow-node">Four branches · Frozen policy</span>
        </div>
      </details>
    </div>
  );
}

export default function OverviewPage({ onNavigate }: Props) {
  const page = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = page.current;
    if (!element || !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        target.classList.add("cv-visible");
        observer.unobserve(target);
      }
    }, { threshold: 0.08 });
    element.querySelectorAll("[data-cv-reveal]").forEach((item) => {
      item.classList.add("cv-observed");
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const body = page.current?.querySelector<HTMLElement>(".cv-depth-body");
    if (!body) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | undefined;

    function draw() {
      frame = undefined;
      if (!body) return;
      if (motion.matches) {
        body.style.removeProperty("--cv-stream-progress");
        return;
      }
      const { top, height } = body.getBoundingClientRect();
      const readingLine = window.innerHeight * 0.76;
      const progress = Math.max(0, Math.min(100, (readingLine - top) / Math.max(1, height) * 100));
      body.style.setProperty("--cv-stream-progress", progress.toFixed(2));
    }

    function schedule() {
      if (frame === undefined) frame = window.requestAnimationFrame(draw);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    const resize = "ResizeObserver" in window ? new ResizeObserver(schedule) : null;
    resize?.observe(body);
    draw();

    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      resize?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <div className="cv-overview" ref={page}>
      <section className="cv-stage" aria-labelledby="overview-title">
        <div className="cv-intro">
          <p className="cv-caption">Final year capstone / CSE499B</p>
          <h1 className="cv-heading-1" id="overview-title">
            See the video.<br />Examine the answer.
          </h1>
          <p className="cv-body">
            A research demonstration exploring how task-specific inference policies can
            mitigate action and temporal hallucinations in Video Large Language Models.
          </p>
          <button className="cv-primary" type="button" onClick={() => onNavigate("workspace")}>
            Open inference workspace <ArrowRight aria-hidden="true" size={18} />
          </button>
        </div>
        <EvidenceStream />
      </section>

      <div className="cv-depth-body">
        <PageStream />
        <section className="cv-section" aria-labelledby="input-title">
          <header data-cv-reveal>
            <p className="cv-caption">Demonstration modes</p>
            <h2 className="cv-heading-2" id="input-title">Two ways to examine video evidence</h2>
          </header>
          <div className="cv-inputs">
            <article className="cv-input-card" data-cv-reveal>
              <button type="button" onClick={() => onNavigate("workspace")}>
                <FileVideo aria-hidden="true" size={40} />
                <span className="cv-caption">01 / Video input</span>
                <span className="cv-heading-3">Upload recorded footage</span>
                <span className="cv-body">Select a VRU-Accident video or a compatible local clip, then prepare a question for analysis.</span>
                <span className="cv-card-link">Open workspace <ArrowRight aria-hidden="true" size={16} /></span>
              </button>
            </article>
            <article className="cv-input-card" data-cv-reveal>
              <button type="button" onClick={() => onNavigate("workspace")}>
                <Camera aria-hidden="true" size={40} />
                <span className="cv-caption">02 / Live input</span>
                <span className="cv-heading-3">Capture a scene</span>
                <span className="cv-body">Use your laptop webcam to record real surroundings for the same research workflow.</span>
                <span className="cv-card-link">Open camera workspace <ArrowRight aria-hidden="true" size={16} /></span>
              </button>
            </article>
          </div>
        </section>

        <h2 className="cv-tagline cv-heading-2" data-cv-reveal aria-label={tagline.join(" ")}>
          {tagline.map((line, row) => (
            <span className="cv-tagline-line" key={line} aria-hidden="true">
              {line.split(" ").map((word, index) => (
                <span className="cv-word" key={word} style={{ transitionDelay: `${(row * 4 + index) * 75}ms` }}>{word}{" "}</span>
              ))}
            </span>
          ))}
        </h2>

        <section className="cv-section" aria-labelledby="coverage-title">
          <header data-cv-reveal>
            <p className="cv-caption">Research coverage</p>
            <h2 className="cv-heading-2" id="coverage-title">Four hallucination tasks</h2>
          </header>
          <div className="cv-tasks">
            {TASKS.map((task) => (
              <article className="cv-task" key={task.id} data-cv-reveal>
                <span className="cv-task-id">{task.id}</span>
                <h3 className="cv-title">{task.title}</h3>
                <p className="cv-body">{task.description}</p>
                <small className="cv-caption">Default branch: {task.defaultBranch}</small>
              </article>
            ))}
          </div>
          <div className="cv-branches" data-cv-reveal>
            <div>
              <p className="cv-caption">Four branches / Frozen policy</p>
              <ul>{BRANCHES.map((branch) => <li key={branch}>{branch}</li>)}</ul>
            </div>
            <button className="cv-secondary" type="button" onClick={() => onNavigate("research")}>
              View research evidence <ArrowRight aria-hidden="true" size={16} />
            </button>
          </div>
          <p className="cv-note cv-body">The interface can preview videos and tasks without a backend. Actual model predictions require the original research pipeline to be connected and verified independently.</p>
        </section>
      </div>
    </div>
  );
}
