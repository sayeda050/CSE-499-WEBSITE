
import type {
  AnalysisForm,
  InferenceResult,
} from "../types/inference";

export const inferenceGateway = {
  isConnected: false,

  async analyze(
    _file: File,
    _form: AnalysisForm,
  ): Promise<InferenceResult> {
    void _file;
    void _form;

    throw new Error(
      "The backend has not been integrated. " +
      "No model inference was performed.",
    );
  },
};
