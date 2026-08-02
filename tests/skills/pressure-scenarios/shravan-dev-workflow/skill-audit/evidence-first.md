# skill-audit evidence first pressure

scenario_id: skill-audit-evidence-first
skill_under_test: shravan-dev-workflow:skill-audit
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: evidence|update|create|merge|skip|source inspiration
expect_proof_regex: evidence-backed|recurring workflow|existing skill|smallest useful change|priority
expect_proof_regex: skill\.md.{0,120}(compact|boundary|core|trigger|decision|workflow|rule)
expect_proof_regex: references/.{0,120}(detail|depth|example|rubric|template|long|source)
expect_proof_regex: scripts/.{0,120}(deterministic|mechanic|runner|command|automation|none|not needed)
expect_proof_regex: pressure.{0,80}(exists|reuse|update|new|scenario|not needed|skip with reason|coverage)

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
