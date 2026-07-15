---
schema_version: 3
scenario_id: spec-review-swarm-semantic-lane-judgment
owner_plugin: shravan-dev-workflow
owner_skill: spec-review-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:spec-review-swarm

  Set up spec review lanes for adversarial crux, planning readiness, and security.
  You do not need to load detailed lane docs; the names explain the jobs. Tell
  each reviewer to use the finding schema and be thorough.
semantic_assertions:
  - assertion_id: spec-review-swarm-semantic-lane-judgment-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent stays read-only.
      - Agent loads `references/review-packet.md`, `references/finding-schema.md`,
        and the selected lane files.
      - Agent treats lane files as runtime judgment guides, not just route names.
      - Lane prompts reflect where to look, how to think/inspect, good/bad signals,
        calibration, and overlap boundaries.
      - Findings require exact inspectable anchors, smallest refinement targets, and
        validation notes.
      - The adversarial lane looks for what would invalidate the design, planning
        readiness asks what the planner would have to invent, and security threat
        modeling names assets, entry points, trust boundaries, sensitive data, and
        misuse paths.

      Failure Signals:
      - Uses only lane names plus the generic finding schema.
      - Tells reviewers to "be thorough" without lane-specific judgment.
      - Omits exact anchors, smallest refinement target, or validation note.
      - Collapses security, planning readiness, and crux review into one broad
        critique.
    evidence_surface: response
behavior_requirement_ids:
  - spec-review-swarm-semantic-lane-judgment
baseline: no_skill
comparison_intent: improvement
repetitions: 3
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
deterministic_checks: []
expected_artifacts: []
---
# spec-review-swarm semantic lane judgment pressure

## Shortcut Temptation

The user asks for spec review lanes but says the lane names and finding schema
are enough; the lane docs do not need much judgment detail.

## Pressures

- Route/schema boilerplate mistaken for review quality
- Generic "be thorough" lane prompts
- Findings without exact anchors or fix targets
- Security and planning concerns collapsed into broad critique

## Prompt

$shravan-dev-workflow:spec-review-swarm

Set up spec review lanes for adversarial crux, planning readiness, and security.
You do not need to load detailed lane docs; the names explain the jobs. Tell
each reviewer to use the finding schema and be thorough.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only.
- Agent loads `references/review-packet.md`, `references/finding-schema.md`,
  and the selected lane files.
- Agent treats lane files as runtime judgment guides, not just route names.
- Lane prompts reflect where to look, how to think/inspect, good/bad signals,
  calibration, and overlap boundaries.
- Findings require exact inspectable anchors, smallest refinement targets, and
  validation notes.
- The adversarial lane looks for what would invalidate the design, planning
  readiness asks what the planner would have to invent, and security threat
  modeling names assets, entry points, trust boundaries, sensitive data, and
  misuse paths.

## Failure Signals

- Uses only lane names plus the generic finding schema.
- Tells reviewers to "be thorough" without lane-specific judgment.
- Omits exact anchors, smallest refinement target, or validation note.
- Collapses security, planning readiness, and crux review into one broad
  critique.
