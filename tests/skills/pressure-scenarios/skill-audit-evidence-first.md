# skill-audit evidence first pressure

scenario_id: skill-audit-evidence-first
skill_under_test: shravan-dev-workflow:skill-audit
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: evidence|update|create|merge|skip|source inspiration

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

## Failure Signals

- Creates a mega-skill from a theme.
- Skips evidence.
- Does not classify update/create/merge/skip.
- Duplicates existing skill behavior.
