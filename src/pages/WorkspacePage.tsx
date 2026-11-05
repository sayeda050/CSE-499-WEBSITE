
import { useRef, useState } from "react";
import type { DragEvent } from "react";
import {
  ArrowRight,
  Camera,
  FileVideo,
  Upload,
} from "lucide-react";

import VideoPlayer from "../components/VideoPlayer";
import WebcamCapture from "../components/WebcamCapture";
import TaskSelector from "../components/TaskSelector";
import StatusIndicator from "../components/StatusIndicator";

import type {
  AnalysisForm,
  PageId,
  VideoAsset,
  VideoOrigin,
} from "../types/inference";

import { formatBytes } from "../services/videoValidation";

interface Props {
  video: VideoAsset | null;
  form: AnalysisForm;
  error: string;
  onFormChange: (form: AnalysisForm) => void;
  onVideoSelected: (file: File, origin: VideoOrigin) => void;
  onNavigate: (page: PageId) => void;
}

export default function WorkspacePage({
  video,
  form,
  error,
  onFormChange,
  onVideoSelected,
  onNavigate,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"upload" | "camera">(
    "upload",
  );
  const [dragging, setDragging] = useState(false);

  const ready =
    Boolean(video) &&
    form.question.trim().length > 0 &&
    (form.task !== "MCQ" ||
      form.options.every((option) => option.trim().length > 0));

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];

    if (file) {
      onVideoSelected(file, "upload");
    }
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">VIDEO ANALYSIS</p>
          <h1>Inference workspace</h1>
          <p>
            Prepare a video and task-specific question
            for the frozen research pipeline.
          </p>
        </div>
      </div>

      <StatusIndicator />

      <div className="workspace-grid">
        <section className="panel workspace-media">
          <div className="panel-header">
            <div>
              <span className="panel-index">01</span>
              <h2>Video source</h2>
            </div>
            <span className="panel-meta">LOCAL INPUT</span>
          </div>

          <div className="segmented">
            <button
              type="button"
              className={mode === "upload" ? "selected" : ""}
              onClick={() => setMode("upload")}
              aria-pressed={mode === "upload"}
            >
              <FileVideo size={16} />
              Upload video
            </button>

            <button
              type="button"
              className={mode === "camera" ? "selected" : ""}
              onClick={() => setMode("camera")}
              aria-pressed={mode === "camera"}
            >
              <Camera size={16} />
              Webcam capture
            </button>
          </div>

          {mode === "upload" ? (
            <div
              className={`upload-zone ${dragging ? "dragging" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <Upload size={26} strokeWidth={1.5} />
              <strong>Drop video footage here</strong>
              <p>Or select a file from your computer.</p>

              <input
                ref={fileRef}
                type="file"
                accept=".mp4,.webm,.mov,.m4v,video/*"
                hidden
                aria-label="Select video file"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    onVideoSelected(file, "upload");
                  }

                  event.target.value = "";
                }}
              />

              <button
                type="button"
                className="button button-secondary"
                onClick={() => fileRef.current?.click()}
              >
                Browse files
              </button>

              <small>
                MP4, WebM, MOV, M4V · 250 MB preview limit
              </small>
            </div>
          ) : (
            <WebcamCapture
              onCapture={(file) =>
                onVideoSelected(file, "webcam")
              }
            />
          )}

          {error && (
            <p className="inline-error" role="alert">
              {error}
            </p>
          )}

          <div className="preview-heading">
            <h3>Selected footage</h3>
            <span>
              {video
                ? video.origin === "webcam"
                  ? "WEBCAM RECORDING"
                  : "UPLOADED VIDEO"
                : "NO SOURCE"}
            </span>
          </div>

          <VideoPlayer video={video} />

          {video && (
            <div className="file-information">
              <span title={video.file.name}>
                {video.file.name}
              </span>
              <span>{formatBytes(video.file.size)}</span>
            </div>
          )}
        </section>

        <section className="panel workspace-question">
          <div className="panel-header">
            <div>
              <span className="panel-index">02</span>
              <h2>Research question</h2>
            </div>
            <span className="panel-meta">TASK CONFIGURATION</span>
          </div>

          <TaskSelector
            form={form}
            onChange={onFormChange}
          />

          <div className="workspace-actions">
            <button
              type="button"
              className="button button-primary button-wide"
              disabled
              title="Requires verified backend integration"
            >
              Run model inference
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="button button-secondary button-wide"
              disabled={!ready}
              onClick={() => onNavigate("comparison")}
            >
              Preview comparison layout
              <ArrowRight size={17} />
            </button>
          </div>

          <p className="microcopy">
            Model inference is intentionally disabled while
            the backend is disconnected. Preparing and
            previewing inputs does not run VideoLLaMA2.
          </p>
        </section>
      </div>
    </div>
  );
}
