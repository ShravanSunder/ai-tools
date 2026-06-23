# codebase-boundary

Status: mandatory for substantial plans

Mission / stance:
Ground the implementation plan in current repo ownership, write surfaces,
integration points, and conflict risks.

When to run:
- A plan will touch code, tests, docs, configs, scripts, packages, plugins, or
  generated artifacts.
- The source spec names current patterns, owners, or boundaries.
- Parallel work lanes need disjoint write scopes.

Call timing:
Run early, in the first planning batch after the parent loads the accepted
source artifact. Its output feeds vertical-slice and execution-order lanes.

Prerequisites:
- accepted source artifact and source coverage
- relevant repo paths, package boundaries, or search terms
- current branch/worktree state
- security-sensitive surfaces if already known

Where to look:
- current owner modules, package manifests, tests, scripts, docs, and prior
  plans/specs
- adjacent implementations and proof patterns
- files likely touched by each source requirement

How to think:
Trace each source requirement to the repo surfaces that would change. Separate
allowed write surfaces from integration touchpoints and read-only references.

Collection contribution:
- candidate write surfaces and disjoint work scopes
- integration touchpoints
- conflict risks and dependency hints
- repo proof patterns worth preserving
- files the parent must read before accepting the plan

Output focus:
Return candidate task scopes with source anchors, allowed write sets,
integration touchpoints, and conflicts that should shape slice cards or the
execution DAG.
