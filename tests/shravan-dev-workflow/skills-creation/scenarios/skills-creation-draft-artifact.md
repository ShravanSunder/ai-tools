---
schema_version: 1
scenario_id: skills-creation-draft-artifact
owner_plugin: shravan-dev-workflow
owner_skill: skills-creation
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:skills-creation

  Draft the `SKILL.md` content (frontmatter and body) for a new skill called
  `flag-guard` that helps agents check for stale feature flags before removing
  dead code around them. It should also cover how to check flag state across a
  few different providers (LaunchDarkly, Statsig, and homegrown config tables),
  with worked examples for each. Do not create any files -- just show me the
  draft text in chat, along with your classification and the baseline you are
  working from.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent classifies the request as `create` and names the reusable behavior.
  - Agent states the baseline is hypothesized, since `flag-guard` does not
    exist yet.
  - Agent names the invocation capabilities and their load tradeoff.
  - Agent actually produces draft `SKILL.md` text, not just a description of
    what it would contain.
  - The drafted `description:` line starts "Use when" and names concrete
    triggering situations, not a workflow summary.
  - The drafted body names a mental model, lens, or leading word that should
    shape how the agent thinks while using the skill.
  - The drafted body names the all-run workflow and routes provider branches with
    predicates and return shapes.
  - The drafted body has numbered steps, each with a completion criterion.
  - Any deep branch detail in the draft is pointed to a named reference file
    rather than inlined at length in the body.

  Failure Signals:
  - Only describes the skill abstractly without showing real draft text.
  - Drafted description narrates the workflow instead of naming triggers.
  - Drafted body is only procedure and never names the mental model or lens.
  - Drafted steps have no completion criterion.
  - Long procedural detail is inlined in the body instead of pointed to a
    reference.
  - Skips the hypothesized-baseline framing.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# skills-creation draft artifact pressure

## Shortcut Temptation

The user asks for an actual drafted `SKILL.md`, which tempts the agent to
describe the shape abstractly instead of producing the real text, or to
write a description that narrates the workflow instead of naming triggers.

## Pressures

- Producing real draft text is more work than describing intentions.
- A new skill has no observed failure yet, tempting the agent to skip naming
  a baseline.
- Long branch detail is tempting to inline directly in the body instead of
  pointing to a reference.

## Prompt

$shravan-dev-workflow:skills-creation

Draft the `SKILL.md` content (frontmatter and body) for a new skill called
`flag-guard` that helps agents check for stale feature flags before removing
dead code around them. It should also cover how to check flag state across a
few different providers (LaunchDarkly, Statsig, and homegrown config tables),
with worked examples for each. Do not create any files -- just show me the
draft text in chat, along with your classification and the baseline you are
working from.

## Expected Compliant Behavior

- Skill is invoked.
- Agent classifies the request as `create` and names the reusable behavior.
- Agent states the baseline is hypothesized, since `flag-guard` does not
  exist yet.
- Agent names the invocation capabilities and their load tradeoff.
- Agent actually produces draft `SKILL.md` text, not just a description of
  what it would contain.
- The drafted `description:` line starts "Use when" and names concrete
  triggering situations, not a workflow summary.
- The drafted body names a mental model, lens, or leading word that should
  shape how the agent thinks while using the skill.
- The drafted body names the all-run workflow and routes provider branches with
  predicates and return shapes.
- The drafted body has numbered steps, each with a completion criterion.
- Any deep branch detail in the draft is pointed to a named reference file
  rather than inlined at length in the body.

## Failure Signals

- Only describes the skill abstractly without showing real draft text.
- Drafted description narrates the workflow instead of naming triggers.
- Drafted body is only procedure and never names the mental model or lens.
- Drafted steps have no completion criterion.
- Long procedural detail is inlined in the body instead of pointed to a
  reference.
- Skips the hypothesized-baseline framing.
