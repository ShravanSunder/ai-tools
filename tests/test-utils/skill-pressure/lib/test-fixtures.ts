import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface ScenarioFixture {
  readonly scenarioId: string;
  readonly relativePath: string;
  readonly body?: string;
}

export interface SkillFixture {
  readonly plugin: string;
  readonly skill: string;
  readonly scenarios?: readonly ScenarioFixture[];
}

export async function createRepositoryFixture(): Promise<string> {
  const repositoryRoot = await mkdtemp(join(tmpdir(), "skill-pressure-"));
  await mkdir(join(repositoryRoot, "tests"), { recursive: true });
  await mkdir(join(repositoryRoot, "plugins"), { recursive: true });
  return repositoryRoot;
}

export async function addSkillFixture(
  repositoryRoot: string,
  fixture: SkillFixture,
): Promise<void> {
  const testOwnerRoot = join(repositoryRoot, "tests", fixture.plugin, fixture.skill);
  const pluginSkillRoot = join(repositoryRoot, "plugins", fixture.plugin, "skills", fixture.skill);
  await mkdir(testOwnerRoot, { recursive: true });
  await mkdir(pluginSkillRoot, { recursive: true });
  await writeFile(join(pluginSkillRoot, "SKILL.md"), "# Fixture skill\n");

  for (const scenario of fixture.scenarios ?? []) {
    const scenarioPath = join(testOwnerRoot, scenario.relativePath);
    await mkdir(join(scenarioPath, ".."), { recursive: true });
    await writeFile(
      scenarioPath,
      scenario.body ?? scenarioContract({
        scenarioId: scenario.scenarioId,
        plugin: fixture.plugin,
        skill: fixture.skill,
      }),
    );
  }
}

export function scenarioContract(props: {
  readonly scenarioId: string;
  readonly plugin: string;
  readonly skill: string;
  readonly repetitions?: number;
  readonly baseline?: "no_skill" | "previous_revision";
  readonly baselineRevision?: string;
  readonly comparisonIntent?: "improvement" | "non_regression";
}): string {
  const baseline = props.baseline ?? "no_skill";
  const baselineRevision = props.baselineRevision === undefined ? "" : `baseline_revision: ${props.baselineRevision}\n`;
  return `---
schema_version: 2
scenario_id: ${props.scenarioId}
owner_plugin: ${props.plugin}
owner_skill: ${props.skill}
skill_type: discipline
prompt: Follow the requested workflow under time pressure.
hidden_rubric: The response must reject the shortcut and follow the workflow.
baseline: ${baseline}
${baselineRevision}comparison_intent: ${props.comparisonIntent ?? "improvement"}
repetitions: ${props.repetitions ?? 5}
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
`;
}
