
import { useEffect, useRef, useState } from "react";

import BackgroundVideo from "./components/BackgroundVideo";


import AppShell from "./components/AppShell";
import ErrorBoundary from "./components/ErrorBoundary";

import OverviewPage from "./pages/OverviewPage";
import WorkspacePage from "./pages/WorkspacePage";
import ComparisonPage from "./pages/ComparisonPage";
import ResearchPage from "./pages/ResearchPage";

import { validateVideo } from "./services/videoValidation";

import type {
  AnalysisForm,
  InferenceResult,
  PageId,
  VideoAsset,
  VideoOrigin,
} from "./types/inference";

const DEFAULT_FORM: AnalysisForm = {
  task: "BQA",
  question: "",
  options: ["", "", "", ""],
};

export default function App() {
  const [page, setPage] = useState<PageId>("overview");
  const [video, setVideo] = useState<VideoAsset | null>(
    null,
  );
  const [form, setForm] = useState<AnalysisForm>(
    DEFAULT_FORM,
  );
  const [videoError, setVideoError] = useState("");

  const objectUrlRef = useRef<string | null>(null);

  // No inference is fabricated while the backend is absent.
  const result: InferenceResult | null = null;

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  function selectVideo(
    file: File,
    origin: VideoOrigin,
  ) {
    const error = validateVideo(file);

    if (error) {
      setVideoError(error);
      return;
    }

    setVideoError("");

    const previousUrl = objectUrlRef.current;
    const nextUrl = URL.createObjectURL(file);

    objectUrlRef.current = nextUrl;

    setVideo({
      file,
      url: nextUrl,
      origin,
    });

    if (previousUrl) {
      URL.revokeObjectURL(previousUrl);
    }
  }

  function navigate(nextPage: PageId) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  let content;

  switch (page) {
    case "workspace":
      content = (
        <WorkspacePage
          video={video}
          form={form}
          error={videoError}
          onFormChange={setForm}
          onVideoSelected={selectVideo}
          onNavigate={navigate}
        />
      );
      break;

    case "comparison":
      content = (
        <ComparisonPage
          video={video}
          form={form}
          result={result}
          onNavigate={navigate}
        />
      );
      break;

    case "research":
      content = <ResearchPage />;
      break;

    default:
      content = (
        <OverviewPage onNavigate={navigate} />
      );
  }

  
  return (
    <ErrorBoundary>
      <BackgroundVideo />

      <div className="cinematic-ui">
        <AppShell
          page={page}
          onNavigate={navigate}
        >
          <div
            key={page}
            className="cinematic-route"
          >
            {content}
          </div>
        </AppShell>
      </div>
    </ErrorBoundary>
  );
}

