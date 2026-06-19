export type SkillPressureMode = "fast" | "integration" | "baseline";

export interface ParseScenarioMarkdownProps {
  readonly filePath: string;
  readonly markdown: string;
}

export interface SkillPressureScenario {
  readonly filePath: string;
  readonly scenarioId: string;
  readonly skillUnderTest: string;
  readonly mode: SkillPressureMode;
  readonly expectReadOnly: boolean;
  readonly expectArtifact: boolean;
  readonly expectDecisionRegexes: readonly string[];
  readonly expectProofRegexes: readonly string[];
  readonly expectForbiddenRegexes: readonly string[];
  readonly prompt: string;
  readonly expectedCompliantBehavior: string;
  readonly failureSignals: string;
}

const DEFAULT_DECISION_REGEXES = ["."] as const;

export function parseScenarioMarkdown(
  props: ParseScenarioMarkdownProps,
): SkillPressureScenario {
  const metadata = parseMetadata(props.markdown);
  const sections = parseSections(props.markdown);

  const scenarioId = firstMetadataValue(metadata, "scenario_id");
  if (!scenarioId) {
    throw new Error(`Scenario is missing scenario_id: ${props.filePath}`);
  }

  const skillUnderTest = firstMetadataValue(metadata, "skill_under_test");
  if (!skillUnderTest) {
    throw new Error(`Scenario is missing skill_under_test: ${props.filePath}`);
  }

  const prompt = sections.get("Prompt")?.trim();
  if (!prompt) {
    throw new Error(`Scenario is missing ## Prompt section: ${props.filePath}`);
  }

  return {
    filePath: props.filePath,
    scenarioId,
    skillUnderTest,
    mode: parseMode(firstMetadataValue(metadata, "mode")),
    expectReadOnly: parseBooleanMetadata(
      firstMetadataValue(metadata, "expect_read_only"),
      true,
    ),
    expectArtifact: parseBooleanMetadata(
      firstMetadataValue(metadata, "expect_artifact"),
      false,
    ),
    expectDecisionRegexes:
      metadata.get("expect_decision_regex") ?? DEFAULT_DECISION_REGEXES,
    expectProofRegexes: metadata.get("expect_proof_regex") ?? [],
    expectForbiddenRegexes: metadata.get("expect_forbidden_regex") ?? [],
    prompt,
    expectedCompliantBehavior:
      sections.get("Expected Compliant Behavior")?.trim() ?? "",
    failureSignals: sections.get("Failure Signals")?.trim() ?? "",
  };
}

function parseMetadata(markdown: string): Map<string, string[]> {
  const metadata = new Map<string, string[]>();
  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith("## ")) {
      break;
    }
    const separatorIndex = line.indexOf(": ");
    if (separatorIndex === -1) {
      continue;
    }
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 2).trim();
    const existingValues = metadata.get(key) ?? [];
    existingValues.push(value);
    metadata.set(key, existingValues);
  }
  return metadata;
}

function parseSections(markdown: string): Map<string, string> {
  const sections = new Map<string, string>();
  let currentHeading: string | undefined;
  let currentLines: string[] = [];

  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith("## ")) {
      if (currentHeading !== undefined) {
        sections.set(currentHeading, currentLines.join("\n"));
      }
      currentHeading = line.slice(3).trim();
      currentLines = [];
      continue;
    }
    if (currentHeading !== undefined) {
      currentLines.push(line);
    }
  }

  if (currentHeading !== undefined) {
    sections.set(currentHeading, currentLines.join("\n"));
  }

  return sections;
}

function firstMetadataValue(
  metadata: ReadonlyMap<string, readonly string[]>,
  key: string,
): string | undefined {
  return metadata.get(key)?.[0];
}

function parseMode(value: string | undefined): SkillPressureMode {
  if (value === undefined || value === "") {
    return "fast";
  }
  if (value === "fast" || value === "integration" || value === "baseline") {
    return value;
  }
  throw new Error(`Unsupported skill pressure mode: ${value}`);
}

function parseBooleanMetadata(
  value: string | undefined,
  defaultValue: boolean,
): boolean {
  if (value === undefined || value === "") {
    return defaultValue;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  throw new Error(`Expected boolean metadata value, received: ${value}`);
}
