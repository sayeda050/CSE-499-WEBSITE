
import { ArrowLeft, GitCompareArrows } from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";
import AnswerComparison from "../components/AnswerComparison";

import type {
  AnalysisForm,
  InferenceResult,
  PageId,
  VideoAsset,
} from "../types/inference";

interface Props {
  video: VideoAsset | null;
  form: AnalysisForm;
  result: InferenceResult | null;
  onNavigate: (page: PageId) => void;
}

export default function ComparisonPage({
  video,
  form,
  result,
  onNavigate,
}: Props) {
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">INFERENCE EVIDENCE</p>
          <h1>Results comparison</h1>
          <p>
            Compare the unmodified VideoLLaMA2 response
            with the actual frozen-policy output.
          </p>
        </div>
      </div>

      <div className="status-notice">
        <GitCompareArrows size={18} />
        <span>
          {result
            ? "Inference record loaded."
            : "Preview only. No model inference has been performed."}
        </span>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="panel-index">01</span>
            <h2>Visual evidence</h2>
          </div>

          <span className="panel-meta">
            {form.task} / VIDEO INPUT
          </span>
        </div>

        <VideoPlayer video={video} />

        <div className="question-readout">
          <span>SELECTED QUESTION</span>
          <strong>
            {form.question || "No question configured"}
          </strong>

          {form.task === "MCQ" && (
            <div className="readout-options">
              {form.options.map((option, index) => (
                <div key={index}>
                  <span>{String.fromCharCode(65 + index)}</span>
                  <p>{option || "Not provided"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="panel-index">02</span>
            <h2>Answer comparison</h2>
          </div>

          <span className="panel-meta">
            VANILLA / FROZEN POLICY
          </span>
        </div>

        <AnswerComparison result={result} />
      </section>

      <button
        type="button"
        className="button button-secondary back-button"
        onClick={() => onNavigate("workspace")}
      >
        <ArrowLeft size={17} />
        Return to workspace
      </button>
    </div>
  );
}
