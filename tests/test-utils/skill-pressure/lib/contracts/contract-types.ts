export interface SkillOwner {
  readonly plugin: string;
  readonly skill: string;
}

export type SkillType = "discipline" | "technique" | "pattern" | "reference";
export type ScenarioRisk = "standard" | "high";
export type ScenarioBaseline = "no_skill" | "previous_revision";
export type ComparisonIntent = "improvement" | "non_regression";

export interface ExpectedArtifact {
  readonly artifactId: string;
  readonly path: string;
  readonly fileType: "file" | "directory";
  readonly contentContract: string;
}

export interface DeterministicCheck {
  readonly checkId: string;
  readonly fact:
    | "tool_observations"
    | `path:${string}`
    | `artifact:${string}`;
  readonly operator: "equals" | "contains" | "excludes" | "matches" | "not_matches" | "exists" | "absent";
  readonly expected?: unknown;
}
