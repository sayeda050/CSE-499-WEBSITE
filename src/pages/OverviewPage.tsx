import { useEffect, useRef, useState } from "react";
import { ArrowRight, Camera, FileVideo, Pause, Play } from "lucide-react";
import "../styles/capstone-overview.css";
import { BRANCHES, TASKS } from "../data/verifiedResearch";
import type { PageId } from "../types/inference";

interface Props {
  onNavigate: (page: PageId) => void;
}

function FootageControl() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const footage = document.querySelector<HTMLVideoElement>(".cinematic-film video");
    if (!footage) return;
    const events = new AbortController();
    const update = () => {
      setAvailable(footage.readyState >= 2 && !footage.error);
      setPlaying(!footage.paused);
    };
    const options = { signal: events.signal };
    for (const event of ["play", "pause", "canplay", "error"]) {
      footage.addEventListener(event, update, options);
    }
    video.current = footage;
    queueMicrotask(() => {
      if (!events.signal.aborted) update();
    });
    return () => events.abort();
  }, []);

  if (!available) return null;
  return (
    <button className="cv-footage-button" type="button"
      aria-label={playing ? "Pause background footage" : "Play background footage"}
      title={playing ? "Pause background footage" : "Play background footage"}
      onClick={() => {
        const footage = video.current;
        if (!footage) return;
        if (footage.paused) void footage.play().catch(() => setPlaying(false));
        else footage.pause();
      }}>
      {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
    </button>
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

  return (
    <div className="cv-overview" ref={page}>
      <section className="cv-stage" aria-labelledby="overview-title">
        <div className="cv-intro">
          <h1 className="cv-heading-1" id="overview-title">
            <span>See the video.</span>{" "}<span>Examine the answer.</span>
          </h1>
          <p className="cv-body">
            A research demonstration exploring how task-specific inference policies can
            mitigate action and temporal hallucinations in Video Large Language Models.
          </p>
          <button className="cv-primary" type="button" onClick={() => onNavigate("workspace")}>
            Open inference workspace <ArrowRight aria-hidden="true" size={18} />
          </button>
        </div>
        <FootageControl />
      </section>

      <section className="cv-section" aria-labelledby="input-title">
        <header data-cv-reveal>
          <p className="cv-caption">Demonstration modes</p>
          <h2 className="cv-heading-2" id="input-title">Two ways to examine video evidence</h2>
        </header>
        <div className="cv-inputs">
          <article className="cv-input-card" data-cv-reveal>
            <button type="button" onClick={() => onNavigate("workspace")}>
              <span className="cv-card-art cv-film-art" aria-hidden="true">
                <span className="cv-film-track"><i /><i /><i /></span>
                <FileVideo size={28} />
              </span>
              <span className="cv-caption">01 / Video input</span>
              <span className="cv-heading-3">Upload recorded footage</span>
              <span className="cv-body">Select a VRU-Accident video or a compatible local clip, then prepare a question for analysis.</span>
              <span className="cv-card-link">Open workspace <ArrowRight aria-hidden="true" size={16} /></span>
            </button>
          </article>
          <article className="cv-input-card" data-cv-reveal>
            <button type="button" onClick={() => onNavigate("workspace")}>
              <span className="cv-card-art cv-camera-art" aria-hidden="true">
                <span className="cv-lens cv-lens-outer" /><span className="cv-lens cv-lens-inner" />
                <Camera size={28} />
              </span>
              <span className="cv-caption">02 / Live input</span>
              <span className="cv-heading-3">Capture a scene</span>
              <span className="cv-body">Use your laptop webcam to record real surroundings for the same research workflow.</span>
              <span className="cv-card-link">Open camera workspace <ArrowRight aria-hidden="true" size={16} /></span>
            </button>
          </article>
        </div>
      </section>

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
      </section>

      <section className="cv-branch-diagram" aria-labelledby="branch-title" data-cv-reveal>
        <h2 className="cv-branch-hub" id="branch-title">Four branches / Frozen policy</h2>
        <ul className="cv-branch-nodes">
          {BRANCHES.map((branch) => <li key={branch}>{branch}</li>)}
        </ul>
        <button className="cv-secondary" type="button" onClick={() => onNavigate("research")}>
          View research evidence <ArrowRight aria-hidden="true" size={16} />
        </button>
      </section>
    </div>
  );
}
