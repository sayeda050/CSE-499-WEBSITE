
export type TaskId = "BQA" | "MCQ" | "TSH" | "STH";
export type VideoOrigin = "upload" | "webcam";

export type PageId =
  | "overview"
  | "workspace"
  | "comparison"
  | "research";

export interface VideoAsset {
  file: File;
  url: string;
  origin: VideoOrigin;
}

export interface AnalysisForm {
  task: TaskId;
  question: string;
  options: [string, string, string, string];
}

export interface ModelAnswer {
  answer: string;
  branch: string;
}

export interface VerifiedReference {
  answer: string;
  source: "dataset" | "human_review";
  verified: boolean;
  description?: string;
}

export type EvaluationOutcome =
  | "corrected"
  | "preserved"
  | "regressed"
  | "both_incorrect"
  | "unverified";

export interface InferenceResult {
  runId: string;
  task: TaskId;
  vanilla: ModelAnswer;
  selected: ModelAnswer;
  switchedFromDefault: boolean;
  reference?: VerifiedReference;
  outcome: EvaluationOutcome;
  executionMilliseconds?: number;
  protocolId: string;
  modelId: string;
}

export interface TaskDefinition {
  id: TaskId;
  title: string;
  description: string;
  defaultBranch: string;
}
