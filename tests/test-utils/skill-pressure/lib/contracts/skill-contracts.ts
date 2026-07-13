import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { parseDocument } from "yaml";

import { scenarioInputSchema } from "./contract-schema.js";
import type { ScenarioContract, SkillOwner } from "./contract-types.js";

export class ContractValidationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "ContractValidationError";
  }
}

export interface LoadScenarioContractProps {
  readonly scenarioPath: string;
  readonly expectedOwner?: SkillOwner;
}

export async function loadScenarioContract(
  props: LoadScenarioContractProps,
): Promise<ScenarioContract> {
  const scenarioPath = resolve(props.scenarioPath);
  const source = await readFile(scenarioPath, "utf8");
  const frontmatter = /^---\s*\n([\s\S]*?)\n---(?:\s*\n|$)/u.exec(source)?.[1];
  if (frontmatter === undefined) {
    throw new ContractValidationError(`scenario contract is missing YAML frontmatter: ${scenarioPath}`);
  }
  const document = parseDocument(frontmatter, {
    prettyErrors: false,
    strict: true,
    uniqueKeys: true,
  });
  if (document.errors.length > 0) {
    throw new ContractValidationError(
      `scenario contract has invalid YAML at ${scenarioPath}: ${document.errors.map((error) => error.message).join("; ")}`,
    );
  }
  const input = scenarioInputSchema.safeParse(document.toJS({ maxAliasCount: 0 }));
  if (!input.success) {
    throw new ContractValidationError(`scenario contract is invalid at ${scenarioPath}: ${input.error.message}`);
  }
  if (
    props.expectedOwner !== undefined &&
    (input.data.owner_plugin !== props.expectedOwner.plugin || input.data.owner_skill !== props.expectedOwner.skill)
  ) {
    throw new ContractValidationError(`scenario owner fields do not match owner path: ${scenarioPath}`);
  }

  return {
    schemaVersion: 1,
    scenarioId: input.data.scenario_id,
    plugin: input.data.owner_plugin,
    skill: input.data.owner_skill,
    skillType: input.data.skill_type,
    prompt: input.data.prompt,
    hiddenRubric: input.data.hidden_rubric,
    baseline: input.data.baseline,
    repetitions: input.data.repetitions,
    risk: input.data.risk,
    fixtureRequirements: input.data.fixture_requirements,
    allowedTools: input.data.allowed_tools,
    allowedWritePaths: input.data.allowed_write_paths,
    deterministicChecks: input.data.deterministic_checks.map((check) => ({
      checkId: check.check_id,
      fact: check.fact,
      operator: check.operator,
      ...(check.expected === undefined ? {} : { expected: check.expected }),
    })),
    expectedArtifacts: input.data.expected_artifacts.map((artifact) => ({
      artifactId: artifact.artifact_id,
      path: artifact.path,
      fileType: artifact.file_type,
      contentContract: artifact.content_contract,
    })),
    scenarioPath,
    contractDigest: `sha256:${createHash("sha256").update(source).digest("hex")}`,
  };
}
