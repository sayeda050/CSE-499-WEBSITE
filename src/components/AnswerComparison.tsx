
import { CircleAlert, ShieldCheck } from "lucide-react";
import type { InferenceResult } from "../types/inference";

interface Props {
  result: InferenceResult | null;
}

export default function AnswerComparison({
  result,
}: Props) {
  const verified = Boolean(
    result?.reference?.verified &&
    result.reference.source,
  );

  const outcome = verified
    ? result?.outcome ?? "unverified"
    : "unverified";

  const outcomeLabels: Record<string, string> = {
    corrected: "Verified correction",
    preserved: "Correct answer preserved",
    regressed: "Incorrect intervention",
    both_incorrect: "Both answers incorrect",
    unverified: "Not independently verified",
  };

  return (
    <div className="comparison-content">
      <div className="answer-grid">
        <article className="answer-card">
          <div className="answer-label">
            <span>01 / WITHOUT INTERVENTION</span>
            <span className="answer-indicator neutral" />
          </div>

          <h3>Vanilla VideoLLaMA2</h3>

          <div className="answer-value">
            {result?.vanilla.answer ||
              "No model prediction available"}
          </div>

          <p className="answer-footer">
            Original model output
          </p>
        </article>

        <article className="answer-card answer-card-selected">
          <div className="answer-label">
            <span>02 / RESEARCH POLICY</span>
            <span className="answer-indicator accent" />
          </div>

          <h3>Frozen policy output</h3>

          <div className="answer-value">
            {result?.selected.answer ||
              "No model prediction available"}
          </div>

          <p className="answer-footer">
            Selected branch:{" "}
            {result?.selected.branch || "Awaiting inference"}
          </p>
        </article>
      </div>

      <div className="verification-panel">
        <div className="verification-heading">
          {verified ? (
            <ShieldCheck size={19} />
          ) : (
            <CircleAlert size={19} />
          )}

          <div>
            <strong>
              {outcomeLabels[outcome]}
            </strong>
            <p>
              {verified
                ? "Compared against the supplied independently verified reference."
                : "No independently verified reference result is available for this run."}
            </p>
          </div>
        </div>

        <dl className="result-metadata">
          <div>
            <dt>Reference answer</dt>
            <dd>
              {verified
                ? result?.reference?.answer
                : "Not available"}
            </dd>
          </div>
          <div>
            <dt>Task</dt>
            <dd>{result?.task || "Not executed"}</dd>
          </div>
          <div>
            <dt>Branch switching</dt>
            <dd>
              {result
                ? result.switchedFromDefault
                  ? "Switched from task default"
                  : "Retained task default"
                : "Not executed"}
            </dd>
          </div>
          <div>
            <dt>Measured inference time</dt>
            <dd>
              {result?.executionMilliseconds !== undefined
                ? `${(result.executionMilliseconds / 1000).toFixed(2)} s`
                : "Not measured"}
            </dd>
          </div>
          <div>
            <dt>Inference protocol</dt>
            <dd>{result?.protocolId || "Not available"}</dd>
          </div>
          <div>
            <dt>Model identity</dt>
            <dd>{result?.modelId || "Not available"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
