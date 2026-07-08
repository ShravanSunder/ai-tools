---
name: skills-creation
description: Use when creating, updating, or evaluating one named skill; turning a repeated agent failure into skill guidance; deciding skill invocation, description wording, reference structure, or pressure proof. Not for repo-wide skill portfolio audits - use skill-audit.
---

# Skills Creation

## Stance

Work on exactly one named skill or accepted draft per run. Predictability
(the agent takes the same route every time, even when its output text
varies) is the target -- a great skill makes behavior steadier under
pressure, it does not read like a manual. Broad repo-wide inventory,
duplicate-surface archaeology, or "which skills should exist" belongs to
`skill-audit`; defer it once, here, and do not re-open it mid-run. Terms
below get a short gloss; `references/glossary.md` holds the fuller meaning.

## Authoring State

Show this compact block in the chat response at the start of every run --
including a chat-only run with no file edits -- and show it again, in full,
at run completion; at intermediate step boundaries, state only the fields
that changed since it was last shown. It is the only cross-branch state
artifact -- branch references may define their own labeled return blocks
that feed its fields -- and it replaces every other ledger, receipt, or
placement-audit table. Showing it is not optional narration; a run without
it is incomplete.

```text
classification: create | update | evaluate
target skill / owner plugin:
reusable job:
baseline: observed (update) | hypothesized (create) | review target (evaluate) -- what fails or is being judged
branches loaded:
security route: allowed | disallowed | blocked | deferred | n/a
proof status: RED | GREEN | REFACTOR | static-only | proof gap
shipping status: source-only | PR-ready | released
```

Use these exact field labels. One line per field is enough; expand a field
only when it is disputed or it changes the edit boundary.

## Steps

**1. Frame.** Classify the run; run an existing-surface check (does a skill
already own this reusable job?); name the reusable job in one sentence; state
the baseline -- observed (update: names the current failure) or
hypothesized (create: names the likely failure) or review target (evaluate:
names what is being judged). Completion: classification, owner plugin,
reusable job, and baseline are all named. Evaluating an existing skill or
draft routes straight to
`references/great-skill-evaluation.md`.

**2. Prove first.** A behavior-changing update needs a pressure scenario or
micro-test that already FAILS against the current skill before any edit is
made or described -- that is RED, and it comes before step 4, not after. A
create is due a scenario before it ships; a hypothesis is enough to draft
against. A mechanical or metadata-only change (typo, filename, version bump)
skips this and is noted as static-only instead. If an observed failure
cannot be reproduced after a bounded number of attempts, record the
baseline as hypothesized instead, cite the original observation, and
proceed. Completion: a named failing scenario or micro-test exists for
behavior-changing work, or the change is explicitly mechanical.

**3. Design the surface.** Invocation is a tradeoff between context load
(model-invoked, discovered every turn) and cognitive load (routed or
user-invoked, a human carries it). Write the description as trigger text --
when to load -- never a workflow summary. Placement rule (the one rule this
skill also teaches by example, stated here once): all-branch material stays in
`SKILL.md`; branch-only depth goes in exactly one reference (`<branch>.md`);
a contract shared by two or more independent consumers -- lanes, subagents,
other skills, copy-paste prompts -- becomes a `schema-<name>.md` of slots and
templates only, never judgment or policy prose; a schema used by only one
lane stays colocated inside that lane file instead of being promoted;
`glossary.md` holds terms and meaning only, never rules or field lists.
Before writing, hunt restatements of the same rule and collapse them into one
leading word -- a short, memorable phrase that carries the rule on its own
(for example "existing-surface check" or "RED-first") -- instead of repeating
the paragraph that explains it. When behavior needs to change, match the
observed failure to its guidance form instead of reaching for prose:

| observed failure | guidance form |
| --- | --- |
| known rule skipped under pressure | bright-line rule + rationalization table |
| wrong output shape | positive output contract or template |
| omitted element | required slot next to the output |
| conditional behavior mistake | observable predicate + action |
| shallow legwork | stronger completion criterion |
| wrong invocation | sharper description or user-invoked route |
| reference retrieval gap | stronger context pointer or inline material |

Completion: invocation choice and trigger-only description are decided, the
placement rule has been applied so nothing sits in two homes, and any wording
change cites a row above.

**4. Write or edit.** Sensitive resources -- scripts, hooks, assets, package
scripts, shell/network behavior, third-party skill/source adoption,
installed-cache/home-level mutation, or anything in that reference's
Sensitive Surfaces list -- route through
`references/skill-security-review.md` BEFORE editing starts, not alongside
it. Scaffolding, metadata, packaging, and platform-specific mechanics route
through `references/platform-mechanics.md`. A drafted or edited skill body --
including a chat-only draft -- obeys the placement rule on itself:
branch-only is a property of who consumes the material, not its length -- a
per-provider walkthrough, a per-case worked example, or a rubric for one path
becomes a named reference pointer (`references/<name>.md` plus one line on
when to load it) the first time it is drafted, short or not, never inline
body text pending later growth; the draft body itself carries only
all-branch material, and each step in that drafted body ends with a
checkable stop condition -- a `Completion:` line or a named gate section
such as `Stop Conditions` or `Removal Gate` -- the form is free, the slot is
not. Completion: every sensitive surface touched by this run
has an allowed, disallowed, blocked, or deferred decision, platform
scaffolding is handled or explicitly not-applicable, and any drafted skill
body inlines only all-branch material with branch depth behind named
reference pointers from the first draft.

**5. Prove behavior.** Behavior-changing guidance needs GREEN from
`references/pressure-testing.md` after the edit. Structural proof (files
valid, validator passes) is never relabeled behavior proof (behavior changes
under pressure) -- they are different claims, and both may be true at once.
A proof gap may only coexist with shipping status `source-only`; anything
`PR-ready` or `released` that
changes behavior requires GREEN, not a gap. Completion: proof status matches
shipping status under that rule.

**6. Prune and ship.** Run a deletion test per sentence: does removing it
change agent behavior versus the model's default? If not, it is a no-op --
delete it rather than smoothing it into nicer prose. Every rule keeps exactly
one home; a rule with two homes is unfinished pruning, not redundancy for
safety. When shipping, route the version bump, changelog entry, and
review/PR proof through `references/platform-mechanics.md`. Completion: no
duplicated all-branch material remains, and shipping routes are named or the
run is explicitly source-only.

## Completion Blockers

The run is not done while any of these hold:

- the Authoring State block was not shown in chat, or is incomplete on a
  field this run actually depends on;
- a behavior-changing update skipped RED-first -- an edit was made or
  described before a failing scenario or micro-test was named;
- a proof gap exists and shipping status is anything other than
  `source-only`;
- a sensitive surface was touched without an allowed/disallowed/blocked/
  deferred decision;
- any rule still has two homes;
- required platform static validation failed, or was skipped without a
  stated reason.
