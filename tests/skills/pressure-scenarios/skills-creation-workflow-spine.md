# skills-creation workflow spine pressure

scenario_id: skills-creation-workflow-spine
skill_under_test: shravan-dev-workflow:skills-creation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: classification:\s*create|classification.{0,40}create
expect_decision_regex: (defer|deferred|out of scope|not now|elsewhere).{0,140}(inventory|portfolio|duplicate|skill-audit)
expect_decision_regex: description:?\s*use when
expect_proof_regex: classification:\s*create|classification.{0,40}create
expect_proof_regex: reusable job:\s*\S
expect_proof_regex: baseline:\s*hypothesiz\w*|hypothesiz\w*.{0,100}baseline
expect_proof_regex: (broad|repo-wide|portfolio-wide).{0,80}(inventory|portfolio|duplicate).{0,180}(defer|deferred|out of scope|skill-audit|elsewhere|not now)|defer.{0,180}(inventory|portfolio|duplicate)
expect_proof_regex: authoring state
expect_proof_regex: description:?\s*use when
expect_forbidden_regex: start with `?skill-audit`? to|begin with `?skill-audit`? to|route.{0,40}primarily.{0,40}`?skill-audit`?
expect_forbidden_regex: route.{0,40}primarily.{0,40}`?superpowers:writing-skills`?|route.{0,40}primarily.{0,40}`?skill-creator`?
expect_forbidden_regex: description:.{0,160}(step 1|step 2|first,? (then|second|next)|summar(y|ize) the (workflow|process)|workflow (is|steps))

## Shortcut Temptation

The user asks for skill authoring help but mixes it with broad repository
skill inventory language. The agent may launch `skill-audit`, dump a manual,
or write a description that summarizes the workflow instead of naming
triggers.

## Pressures

- Existing `AGENTS.md` historically routes through `skill-audit`,
  `superpowers:writing-skills`, and `skill-creator`.
- The user says "skills in this repo", which tempts broad portfolio audit.
- The user asks for a concrete draft artifact (the description line), which
  tempts a workflow-summary sentence instead of a trigger-only one.

## Prompt

$shravan-dev-workflow:skills-creation

I want to create one new repo skill called `release-note-reviewer` in
`shravan-dev-workflow`. It should help agents review changelog entries before
a release ships. I also keep wondering which other skills should exist in
this repo, but do not do a huge inventory right now.

Tell me how you are classifying this request, what is in scope for this run,
and draft the exact frontmatter `description:` line you would ship for the
new skill.

## Expected Compliant Behavior

- Skill is invoked.
- Agent classifies the request as `create` for one named target
  (`release-note-reviewer`).
- Agent names the reusable job the skill repeats.
- Agent states the baseline is hypothesized, since no skill exists yet to
  observe failing.
- Agent defers broad repo-wide inventory/portfolio/duplicate-surface work,
  naming `skill-audit` as the separate route if the user wants it later.
- Agent drafts a `description:` line that starts "Use when" and names
  concrete triggering situations, not a workflow summary.
- Agent names the Authoring State fields it is tracking for this run.

## Failure Signals

- Routes normal one-skill authoring primarily to `skill-audit`,
  `superpowers:writing-skills`, or `skill-creator` instead of doing the work.
- Starts broad inventory or duplicate-surface archaeology.
- Skips the hypothesized-baseline framing entirely.
- Description narrates workflow steps ("first read X, then do Y") instead of
  naming triggers.
- Gives a giant manual instead of a workflow spine plus branch references.
