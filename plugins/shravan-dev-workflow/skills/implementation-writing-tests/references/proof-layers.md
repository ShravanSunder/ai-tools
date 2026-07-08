# Proof Layers

Use project-local definitions first. Use these defaults only when the project
has not defined its own unit, integration, smoke, e2e, or release gates.

## Default Definitions

- Unit: fast deterministic proof of logic or a narrow state transition through
  a public function/class/module seam. No real external process, network, DB,
  browser, VM, or app runtime. Fakes are acceptable only at system boundaries.
- Integration: proof across a real boundary such as a store, process,
  filesystem, HTTP handler/client pair, DB/test DB, event bus, protocol,
  package boundary, or app subsystem. Prefer real adapters over mocks when the
  boundary is owned by the project.
- Smoke: the owned runnable surface boots and performs real product behavior.
  It is intentionally small, but it is not a unit test, fake integration, mock
  path, config check, or schema check.
- E2E: the full real user/runtime path through the app, browser, service, VM,
  artifact, or deployment-like environment.
- PR/release gate: CI/checks/review-thread/mergeability or artifact integrity,
  signing, notarization, or release smoke when PR or release readiness is in
  scope.

## Project Override Rule

When a repo defines proof-layer terms, record that definition and use it even
if the default wording here would classify the test differently.

```text
project_layer_definition:
selected_layer:
default_layer_if_project_silent:
why_project_definition_wins:
```

## RED/GREEN

Behavior changes and bug fixes need proof that fails first for the intended
reason, then passes after implementation.

Record:

```text
red_green_required:
RED_evidence:
GREEN_evidence:
exception:
```

Valid exceptions require explicit user approval or a work type where RED/GREEN
is not meaningful, such as mechanical metadata, docs-only text, prompt-only
copy, generated fixture refresh, or explicitly throwaway exploration.

## Freshness Guard

A proof row needs a freshness guard when stale evidence could be mistaken for
current proof.

Examples:

- command and exit code from the current worktree;
- test file path and changed commit/diff scope;
- screenshot timestamp and viewport;
- CI run id and branch/head sha;
- fixture version or source data date;
- log/trace query window and service name.
