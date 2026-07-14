---
schema_version: 1
scenario_id: skills-creation-workflow-spine
owner_plugin: shravan-dev-workflow
owner_skill: skills-creation
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:skills-creation

  I want to create one new repo skill called `release-note-reviewer` in
  `shravan-dev-workflow`. It should help agents review changelog entries before
  a release ships. I also keep wondering which other skills should exist in
  this repo, but do not do a huge inventory right now.

  Tell me how you are classifying this request, what is in scope for this run,
  and draft the exact frontmatter `description:` line you would ship for the
  new skill.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent classifies the request as `create` for one named target
    (`release-note-reviewer`).
  - Agent names the reusable behavior the skill repeats.
  - Agent states the baseline is hypothesized, since no skill exists yet to
    observe failing.
  - Agent names the invocation capabilities and their load tradeoff.
  - Agent defers broad repo-wide inventory/portfolio/duplicate-surface work,
    naming `skill-audit` as the separate route if the user wants it later.
  - Agent drafts a `description:` line that starts "Use when" and names
    concrete triggering situations, not a workflow summary.
  - Agent treats YAML/frontmatter as the trigger surface and names how the skill
    body will carry the mental model or main path.

  Failure Signals:
  - Routes normal one-skill authoring primarily to `skill-audit`,
    `superpowers:writing-skills`, or `skill-creator` instead of doing the work.
  - Starts broad inventory or duplicate-surface archaeology.
  - Skips the hypothesized-baseline framing entirely.
  - Description narrates workflow steps ("first read X, then do Y") instead of
    naming triggers.
  - Gives a giant manual or proof-status ritual instead of a compact great-skill
    model plus branch references.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: classification:\s*create|classification.{0,40}create
  - check_id: decision-2
    fact: visible_response
    operator: matches
    expected: (defer|deferred|out of scope|not now|elsewhere).{0,140}(inventory|portfolio|duplicate|skill-audit)
  - check_id: decision-3
    fact: visible_response
    operator: matches
    expected: description:?\s*use when
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: classification:\s*create|classification.{0,40}create
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: reusable (job|behavior):\s*\S
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: baseline( or review target)?:\s*hypothesiz\w*|hypothesiz\w*.{0,100}baseline
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: invocation:?\s*(model-invocable|user-invocable)|invocation (mode|capabilit(y|ies)).{0,120}(model-invocable|user-invocable)
  - check_id: proof-5
    fact: visible_response
    operator: matches
    expected: (broad|repo-wide|portfolio-wide).{0,80}(inventory|portfolio|duplicate).{0,180}(defer|deferred|out of scope|skill-audit|elsewhere|not now)|defer.{0,180}(inventory|portfolio|duplicate)
  - check_id: proof-6
    fact: visible_response
    operator: matches
    expected: (trigger surface|yaml|frontmatter|description).{0,200}(when|load|trigger)
  - check_id: proof-7
    fact: visible_response
    operator: matches
    expected: (mental model|leading word|latent space|main path)
  - check_id: proof-8
    fact: visible_response
    operator: matches
    expected: description:?\s*use when
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: start with `?skill-audit`? to|begin with `?skill-audit`? to|route.{0,40}primarily.{0,40}`?skill-audit`?
  - check_id: forbidden-2
    fact: visible_response
    operator: not_matches
    expected: route.{0,40}primarily.{0,40}`?superpowers:writing-skills`?|route.{0,40}primarily.{0,40}`?skill-creator`?
  - check_id: forbidden-3
    fact: visible_response
    operator: not_matches
    expected: description:.{0,160}(step 1|step 2|first,? (then|second|next)|summar(y|ize) the (workflow|process)|workflow (is|steps))
expected_artifacts: []
---
# skills-creation workflow spine pressure

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
- Agent names the reusable behavior the skill repeats.
- Agent states the baseline is hypothesized, since no skill exists yet to
  observe failing.
- Agent names the invocation capabilities and their load tradeoff.
- Agent defers broad repo-wide inventory/portfolio/duplicate-surface work,
  naming `skill-audit` as the separate route if the user wants it later.
- Agent drafts a `description:` line that starts "Use when" and names
  concrete triggering situations, not a workflow summary.
- Agent treats YAML/frontmatter as the trigger surface and names how the skill
  body will carry the mental model or main path.

## Failure Signals

- Routes normal one-skill authoring primarily to `skill-audit`,
  `superpowers:writing-skills`, or `skill-creator` instead of doing the work.
- Starts broad inventory or duplicate-surface archaeology.
- Skips the hypothesized-baseline framing entirely.
- Description narrates workflow steps ("first read X, then do Y") instead of
  naming triggers.
- Gives a giant manual or proof-status ritual instead of a compact great-skill
  model plus branch references.
