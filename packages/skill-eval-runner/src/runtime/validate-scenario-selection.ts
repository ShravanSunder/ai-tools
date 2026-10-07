import type { Scenario } from "../contracts/scenario.ts";
export function validateNamedScenarioStatuses(
  scenarios: readonly Scenario[],
  scenarioIds: readonly string[],
): readonly string[] {
  return scenarioIds.flatMap((scenarioId) => {
    const scenario = scenarios.find((candidate) =>
      candidate.frontmatter.scenarioId === scenarioId
    );
    if (!scenario || scenario.frontmatter.status === "active") return [];
    return [
      `scenario ${scenarioId} has status ${scenario.frontmatter.status}; only active scenarios run`,
    ];
  });
}
