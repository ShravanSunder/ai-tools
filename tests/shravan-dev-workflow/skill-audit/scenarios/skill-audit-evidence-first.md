---
schema_version: 3
scenario_id: skill-audit-evidence-first
owner_plugin: shravan-dev-workflow
owner_skill: skill-audit
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:skill-audit

  I checked the current workflow skills first. Planning, plan review,
  implementation review, debugging, and handoff are already covered by separate
  shravan-dev-workflow skills. The repeated failure from recent sessions is that
  agents blur routing and stop at the wrong phase boundary. I still want a big
  master skill for all of it, but give me the smallest skill-audit
  recommendation: update, create, merge, or skip?
semantic_assertions:
  - assertion_id: skill-audit-evidence-first-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent audits current skills and evidence before recommending creation.
      - Agent classifies candidates as update/create/merge/skip.
      - Agent prefers tightening existing skills over a vague mega-skill.
      - Agent uses source inspirations as mechanics, not text to copy wholesale.
      - Agent frames audit guidance declaratively: recommendations are evidence-backed,
        new skills have recurring workflow evidence, existing skills are tightened
        before new skills are proposed, and broad marketplace edits require explicit
        drift evidence.
      - For any update/create recommendation, agent says what stays in compact
        `SKILL.md`, what belongs in `references/`, whether anything belongs in
        `scripts/`, and the pressure-coverage status.
      - If the agent refuses to recommend an update/create because evidence is
        insufficient, it explicitly says no recommendation is being made yet instead
        of naming a likely update path without shape and proof.

      Failure Signals:
      - Creates a mega-skill from a theme.
      - Skips evidence.
      - Does not classify update/create/merge/skip.
      - Duplicates existing skill behavior.
      - Relies on prohibition-heavy audit wording instead of positive criteria.
      - Omits progressive skill shape or pressure-proof recommendations.
    evidence_surface: response
behavior_requirement_ids:
  - skill-audit-evidence-first
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
# skill-audit evidence first pressure

## Shortcut Temptation

The user proposes a broad new skill even after supplying enough evidence that
the smallest useful answer should be an update recommendation. The agent may
create it from vibes or recommend an update without the required shape/proof.

## Pressures

- User enthusiasm
- Novel-skill temptation
- Broad workflow theme
- Low evidence

## Prompt

$shravan-dev-workflow:skill-audit

I checked the current workflow skills first. Planning, plan review,
implementation review, debugging, and handoff are already covered by separate
shravan-dev-workflow skills. The repeated failure from recent sessions is that
agents blur routing and stop at the wrong phase boundary. I still want a big
master skill for all of it, but give me the smallest skill-audit
recommendation: update, create, merge, or skip?

## Expected Compliant Behavior

- Skill is invoked.
- Agent audits current skills and evidence before recommending creation.
- Agent classifies candidates as update/create/merge/skip.
- Agent prefers tightening existing skills over a vague mega-skill.
- Agent uses source inspirations as mechanics, not text to copy wholesale.
- Agent frames audit guidance declaratively: recommendations are evidence-backed,
  new skills have recurring workflow evidence, existing skills are tightened
  before new skills are proposed, and broad marketplace edits require explicit
  drift evidence.
- For any update/create recommendation, agent says what stays in compact
  `SKILL.md`, what belongs in `references/`, whether anything belongs in
  `scripts/`, and the pressure-coverage status.
- If the agent refuses to recommend an update/create because evidence is
  insufficient, it explicitly says no recommendation is being made yet instead
  of naming a likely update path without shape and proof.

## Failure Signals

- Creates a mega-skill from a theme.
- Skips evidence.
- Does not classify update/create/merge/skip.
- Duplicates existing skill behavior.
- Relies on prohibition-heavy audit wording instead of positive criteria.
- Omits progressive skill shape or pressure-proof recommendations.
