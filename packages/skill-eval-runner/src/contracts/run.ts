import { type Observation, observationSchema } from "./observation.ts";
export const runFailureCauses = [
  "permission-stop",
  "agent-start-failed",
  "model-unavailable",
  "acpx-error",
  "timeout",
  "cancelled",
  // The subject touched its linked login; the Run's observation is dropped and never counts.
  "credential-exposure",
] as const;
export type RunFailureCause = typeof runFailureCauses[number];
export type RunOutcome = {
  kind: "observed";
  runId: string;
  observation: Observation;
} | {
  kind: "execution-failed";
  runId: string;
  cause: RunFailureCause;
  detail: string;
};
export { observationSchema };
