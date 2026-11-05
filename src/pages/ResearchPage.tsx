
import { useState, type CSSProperties } from "react";
import {
  ArrowRight,
  GitBranch,
  Info,
  ShieldCheck,
} from "lucide-react";

import ScrollReveal from "../components/ScrollReveal";

import {
  BENCHMARK_RESULTS,
  BRANCHES,
} from "../data/verifiedResearch";

export default function ResearchPage() {
  const [focusedBranch, setFocusedBranch] =
    useState<number | null>(null);

  return (
    <div className="page-stack research-page">
      <div className="research-opening">
        <div className="research-opening-grid">
          <div>
            <p className="eyebrow">
              EXPERIMENTAL EVIDENCE
            </p>

            <h1 className="research-display-title">
              Research
              <span> methodology.</span>
            </h1>

            <p className="research-opening-description">
              Historical experimental results reported in
              the CSE499B weekly research documentation.
            </p>
          </div>

          <div
            className="research-opening-symbol"
            aria-hidden="true"
          >
            <div className="research-orbit orbit-outer" />
            <div className="research-orbit orbit-inner" />
            <GitBranch size={46} strokeWidth={1.15} />
          </div>
        </div>

        <div className="research-opening-footer">
          <span>FOUR-BRANCH ARCHITECTURE</span>
          <span>VIDHALLUC EVALUATION</span>
          <span>RESEARCH SAFEGUARDS</span>
        </div>
      </div>

      <ScrollReveal>
        <section className="panel research-panel research-architecture">
          <div className="panel-header">
            <div>
              <span className="panel-index">01</span>
              <h2>
                Four-branch research architecture
              </h2>
            </div>
            <GitBranch size={22} strokeWidth={1.5} />
          </div>

          <div className="research-diagram">
            <div className="research-diagram-label">
              INPUT
            </div>

            <div className="research-node research-input">
              VIDEO + QUESTION
            </div>

            <svg
              className="research-diagram-spine"
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className="research-diagram-path"
                d="M500 0 V35 H125 V100
                   M500 35 H375 V100
                   M500 35 H625 V100
                   M500 35 H875 V100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>

            <div className="research-diagram-label">
              FOUR FROZEN BRANCHES · PARALLEL
            </div>

            <div className="research-parallel-branches">
              {BRANCHES.map((branch, index) => (
                <button
                  type="button"
                  key={branch}
                  className={`research-branch ${
                    focusedBranch === index
                      ? "research-branch-focused"
                      : ""
                  }`}
                  onClick={() =>
                    setFocusedBranch(index)
                  }
                  aria-pressed={
                    focusedBranch === index
                  }
                  style={
                    {
                      "--branch-index": index,
                    } as CSSProperties
                  }
                >
                  <span className="research-branch-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="research-branch-name">
                    {branch}
                  </span>

                  <span className="research-branch-foot">
                    FROZEN BRANCH
                  </span>
                </button>
              ))}
            </div>

            <svg
              className="research-diagram-spine research-diagram-spine-bottom"
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className="research-diagram-path"
                d="M125 0 V64 H500 V100
                   M375 0 V64
                   M625 0 V64 H500
                   M875 0 V64 H500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>

            <div className="research-selection">
              <div className="research-node research-policy">
                TASK POLICY
              </div>

              <ArrowRight size={21} aria-hidden="true" />

              <div className="research-node research-answer">
                SELECTED ANSWER
              </div>
            </div>

            <div className="research-diagram-caption">
              {focusedBranch === null
                ? "Select a branch to inspect its position in the parallel architecture."
                : `Inspection focus: ${BRANCHES[focusedBranch]}. This selection is visual only and does not execute or change the research policy.`}
            </div>
          </div>

          <p className="microcopy">
            The research uses task-specific Charades-trained
            selection policies. The current interface does
            not retrain, implement, or alter those policies.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="panel research-panel research-results">
          <div className="panel-header">
            <div>
              <span className="panel-index">02</span>
              <h2>Reported VidHalluc results</h2>
            </div>

            <ShieldCheck size={22} strokeWidth={1.5} />
          </div>

          <div className="research-results-intro">
            <div>
              <p className="eyebrow">
                HISTORICAL EVALUATION
              </p>
              <h3>
                Baseline versus research policy
              </h3>
            </div>
            <p>
              Values shown below are the same historical
              results reported in the existing table,
              not new inference measurements.
            </p>
          </div>

          <div className="research-chart-legend">
            <span>
              <i className="legend-dot legend-baseline" />
              Same-run default
            </span>
            <span>
              <i className="legend-dot legend-method" />
              Router / candidate
            </span>
          </div>

          <div className="research-chart">
            <div className="research-chart-axis">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>

            {BENCHMARK_RESULTS.map((item, index) => {
              const baseline = parseFloat(item.baseline);
              const method = parseFloat(item.method);

              return (
                <div
                  className={`research-chart-row ${
                    !item.deployed
                      ? "research-chart-rejected"
                      : ""
                  }`}
                  key={item.task}
                  style={
                    {
                      "--chart-index": index,
                    } as CSSProperties
                  }
                >
                  <div className="research-chart-row-heading">
                    <div>
                      <strong>{item.task}</strong>
                      <span>{item.samples}</span>
                    </div>

                    <span className="research-chart-deployment">
                      {item.deployed
                        ? "Frozen router"
                        : "Candidate rejected"}
                    </span>
                  </div>

                  <div className="research-chart-comparison">
                    <div className="research-chart-track">
                      <span
                        className="research-chart-bar research-chart-bar-baseline"
                        style={
                          {
                            "--bar-width": `${baseline}%`,
                          } as CSSProperties
                        }
                      />
                    </div>
                    <strong>{item.baseline}</strong>
                  </div>

                  <div className="research-chart-comparison">
                    <div className="research-chart-track">
                      <span
                        className="research-chart-bar research-chart-bar-method"
                        style={
                          {
                            "--bar-width": `${method}%`,
                          } as CSSProperties
                        }
                      />
                    </div>
                    <strong>{item.method}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="research-chart-disclaimer">
            The chart uses a common 0–100% scale. MCQ is
            a rejected candidate, not an adopted policy.
            Task-specific evaluation protocols differ.
          </p>

          <div className="research-table-heading">
            <h3>Experimental results table</h3>
            <span>REPORTED VALUES</span>
          </div>

          <div className="benchmark-table-wrap">
            <table className="benchmark-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Evaluation set</th>
                  <th>Same-run default</th>
                  <th>Router / candidate</th>
                  <th>Deployment</th>
                </tr>
              </thead>

              <tbody>
                {BENCHMARK_RESULTS.map((item) => (
                  <tr key={item.task}>
                    <td>
                      <strong>{item.task}</strong>
                    </td>

                    <td>{item.samples}</td>

                    <td>{item.baseline}</td>

                    <td>{item.method}</td>

                    <td>
                      <span
                        className={
                          item.deployed
                            ? "deployment-status"
                            : "deployment-status deployment-rejected"
                        }
                      >
                        {item.deployed
                          ? "Frozen router"
                          : "Candidate rejected"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="research-notes">
            {BENCHMARK_RESULTS.map((item, index) => (
              <div
                key={item.task}
                style={
                  {
                    "--note-index": index,
                  } as CSSProperties
                }
              >
                <strong>{item.task}</strong>
                <span>{item.note}</span>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="panel research-panel research-safeguards">
          <div className="panel-header">
            <div>
              <span className="panel-index">03</span>
              <h2>Evaluation safeguards</h2>
            </div>

            <Info size={22} strokeWidth={1.5} />
          </div>

          <div className="safeguard-grid">
            <article>
              <div className="safeguard-number">01</div>

              <h3>Frozen methodology</h3>

              <p>
                Original checkpoints, feature contracts,
                prompts, parsing rules, and deployment
                decisions must be preserved.
              </p>
            </article>

            <article>
              <div className="safeguard-number">02</div>

              <h3>Independent references</h3>

              <p>
                Model disagreement alone is not proof of
                hallucination correction. Correctness needs
                independently verified evidence.
              </p>
            </article>

            <article>
              <div className="safeguard-number">03</div>

              <h3>Dataset separation</h3>

              <p>
                Historical VidHalluc performance must not
                be presented as performance measured on
                VRU-Accident or webcam recordings.
              </p>
            </article>

            <article>
              <div className="safeguard-number">04</div>

              <h3>Real deployment decisions</h3>

              <p>
                The MCQ selector candidate was rejected by
                the Charades development gate; its reported
                candidate score is not a deployed-policy score.
              </p>
            </article>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <p className="research-disclaimer">
          Source: CSE499B Group 5 Weekly Report 3. These
          figures are historical reported experimental
          outcomes, not live predictions from this frontend.
        </p>
      </ScrollReveal>
    </div>
  );
}
