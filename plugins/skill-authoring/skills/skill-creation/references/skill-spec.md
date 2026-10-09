# Skill Spec

This reference owns the skill spec: the proposal for one skill change that steps 1–5 of `skill-creation` produce before any skill file changes. Return the spec in the conversation or as a doc, as the predicates below decide.

Expected inputs: the step 1–5 returns (classification, owner, reusable behavior, success definition, authoring basis and proof posture, surface allocation, trigger decision, main path, depth placement).

## Conversation or Doc

A proposal that meets none of the doc predicates below stays conversational: it lives in the run's messages, and the review packet carries it.

If the spec spans more than one run, carries user decisions a later run must honor, or must survive a session boundary, write it as a spec doc before commissioning review and make the doc the reviewed artifact; the review packet's `review target` carries the doc's path and revision. Home: the repository's skill-work location, or `docs/wip/skills-authoring/<yyyy-mm-dd-name>/spec.md` when the repository has none. The reviewer reviews the provided artifact and reports a missing required spec as blocked; it does not author the target. The doc is working memory that outlives the conversation, not durable truth: after its last run lands, the repository's own rules for working documents decide its disposition. The doc is one draft — acceptance covers it as a whole — and each run in its sequence names exactly one skill target; a run naming more is split before acceptance.

## Slots

```text
targets and owner plugin, with the runs in sequence
problem and evidence
success definition
decisions table — defaults taken with rationale; the user may strike any row
per-run surface allocation: trigger / main path / depth / proof
authoring basis and proof plan, with each run's proof posture
coordination: base branch and commit, pending edits, version and changelog landing
non-goals
run status: per run, proposed | implemented | reviewed | shipped
review record: accepted revision label, checks, statuses, verdict, semantic coverage, acceptance
```

Each decisions row records the default taken and its rationale so the user can strike it cheaply — after acceptance, striking a row is an edit like any other, and a row without a rationale gives the user nothing to strike against. A recorded decision is never rewritten: when the user strikes or changes one, keep the original row and add a dated row that names the row it supersedes, so the effective decision and its history both stay readable. Every problem or evidence claim names its source or is labeled a hypothesis. The coordination slot is read at implement and ship time: a slice run checks its base, pending edits, and version/changelog landing against it before editing.

## Run Status

Each run moves through one state at a time, and the spec shows the state it has actually reached:

```text
proposed     the spec names the run; no skill file changed yet
implemented  files changed inside the accepted boundary
reviewed     the implementation review for the run returned great
shipped      the change was released or merged as the user scoped
```

A run not shown as `shipped` is never reported as shipped, and `implemented` is never reported as reviewed. A mechanical change, or one whose implementation review the user explicitly skipped, moves from `implemented` to `shipped` with that boundary written beside it; it is never shown as `reviewed`. Whoever moves a run forward records the evidence beside the new state: the diff for `implemented`, the review result for `reviewed`, the release or merge for `shipped`.

Complete when: the form (conversation or doc) follows the predicates, and every slot carries what its consuming run can execute from without guessing, or its exact unknown; a slot holding TBD is neither.
