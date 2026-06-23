# vertical-slice-decomposition

Status: mandatory for substantial plans

Mission / stance:
Turn an accepted spec/design/goal into coherent implementation units. A plan
unit is not "edit file X"; it is a vertical slice of behavior or capability
that can be implemented, integrated, and proven against the source artifact.

When to run:
- The source artifact has multiple requirements, contracts, protocols, UI/API
  surfaces, or proof gates.
- The work could be split across subagents or staged behind checkpoints.
- A large ticket needs several plans or several plan sections.

Call timing:
Run after source coverage exists and after initial codebase/proof evidence is
available. Its output feeds `execution-order` and `scope-and-proof-fit`.

Prerequisites:
- accepted source artifact and source anchors
- initial owner/write-surface evidence from `codebase-boundary`
- proof expectations or initial proof rows from `validation-proof`
- security/reliability constraints when applicable

Where to look:
- accepted source spec/design/goal/handoff and required source anchors
- requirements/proof expectations and non-goals
- slice specs, protocol contracts, ownership maps, and diagrams
- current code owners, tests, package boundaries, and integration points
- research or review ledgers only when they constrain the accepted source

How to think:
Trace source requirement -> user/system behavior -> owner boundary -> files or
interfaces likely touched -> proof that behavior works. The slice is good only
when those pieces stay together. Do not split implementation away from the
proof that validates it.

Good slice signals:
- one clear behavior or capability
- source requirement and contract anchors
- allowed write surface and integration touchpoint
- dependencies and parallelization safety are explicit
- proof gate is meaningful for that behavior, not generic test boilerplate
- checkpoint tells the parent what to inspect before moving on

Bad slice signals:
- "update docs", "add tests", or "refactor module" as isolated work when the
  source requirement is behavioral
- proof detached into a later generic validation task
- a slice crosses several owners without an integration gate
- a subagent would need to reread the whole spec to know its job
- a test exists only because something changed, not because it proves a source
  obligation

Testing and proof judgment:
Use the testing pyramid as a design tool, not a slogan. For each slice, choose
the smallest proof layers that actually prove the requirement:
- unit: deterministic logic, state transitions, parsing, pure policy
- integration: real stores, filesystem, HTTP, process, protocol, event, or DB
  boundaries
- smoke: runnable surface boots and performs a representative behavior
- e2e/manual/visual: user workflow, browser/native UI, screenshots, DOM state,
  data/state inspection, metrics, logs, traces, or OTel evidence
- CI/PR/release: required when mergeability, artifact integrity, or release
  behavior is part of the goal

Calibration:
Prefer fewer, stronger slices over many tiny tasks. Split when ownership,
dependency order, proof, or risk needs a separate checkpoint. Do not split only
by file type or by "implementation then tests".

Collection contribution:
Candidate source-owned slice cards, dependencies, local proof units, and
split/replan triggers for parent reduction into the implementation plan.

Output focus:
Return candidate slice cards:
- slice name
- source anchors
- behavior/capability
- allowed write surface
- dependencies and parallelization notes
- checkpoint/integration gate
- proof gate by pyramid layer and evidence source
- split/replan trigger
