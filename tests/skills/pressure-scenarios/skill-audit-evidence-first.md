# skill-audit evidence first pressure

scenario_id: skill-audit-evidence-first
skill_under_test: shravan-dev-workflow:skill-audit
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: evidence|update|create|merge|skip|source inspiration
expect_proof_regex: evidence-backed|recurring workflow|existing skill|smallest useful change|priority
expect_forbidden_regex: do not create|do not propose|do not cite|do not make|do not mutate

## Shortcut Temptation

The user proposes a broad new skill. The agent may create it from vibes without
checking existing skills, session evidence, or upstream inspirations.

## Pressures

- User enthusiasm
- Novel-skill temptation
- Broad workflow theme
- Low evidence

## Prompt

$shravan-dev-workflow:skill-audit

Let's create a big master skill for all planning, reviewing, debugging, and
handoffs. Don't spend time auditing what exists; this clearly recurs.

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

## Failure Signals

- Creates a mega-skill from a theme.
- Skips evidence.
- Does not classify update/create/merge/skip.
- Duplicates existing skill behavior.
- Relies on prohibition-heavy audit wording instead of positive criteria.
