
import type { TaskDefinition } from "../types/inference";

export const TASKS: TaskDefinition[] = [
  {
    id: "BQA",
    title: "Binary Question Answering",
    description: "Action-related yes/no questions.",
    defaultBranch: "Vanilla",
  },
  {
    id: "MCQ",
    title: "Multiple-Choice Questions",
    description: "Action questions with four options.",
    defaultBranch: "Vanilla",
  },
  {
    id: "TSH",
    title: "Temporal Sequence Hallucination",
    description: "Questions about event ordering.",
    defaultBranch: "Vanilla",
  },
  {
    id: "STH",
    title: "Scene Transition Hallucination",
    description: "Questions about scene and location changes.",
    defaultBranch: "TA-AE",
  },
];

export const BRANCHES = [
  "Vanilla VideoLLaMA2",
  "DINO-HEAL",
  "TA-AE",
  "DINO-HEAL + TA-AE",
] as const;

export const BENCHMARK_RESULTS = [
  {
    task: "TSH",
    samples: "600 questions",
    baseline: "65.00%",
    method: "71.00%",
    note:
      "Frozen task-parser result. Not interchangeable with the different official-parser audit.",
    deployed: true,
  },
  {
    task: "STH",
    samples: "445 videos",
    baseline: "63.76%",
    method: "64.80%",
    note:
      "Small observed gain over TA-AE. The reported paired confidence interval includes zero.",
    deployed: true,
  },
  {
    task: "BQA",
    samples: "4,275 strict pairs",
    baseline: "51.98%",
    method: "53.61%",
    note:
      "Official strict-pair scoring. Different from individual-answer accuracy.",
    deployed: true,
  },
  {
    task: "MCQ",
    samples: "4,276 questions",
    baseline: "83.51%",
    method: "83.58%",
    note:
      "Candidate selector only; not adopted for deployment. Six questions used a separate repaired-frame protocol.",
    deployed: false,
  },
] as const;
