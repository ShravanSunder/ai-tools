# 2026-07-30 Spec And Program Design Routing Cutover

Plugin: `shravan-dev-workflow` 1.7.0

## User-visible behavior

- Adds three primary, independently invocable skills:
  - `spec-design` owns authoritative Why/What: problem, consumers, outcomes, requirements, observable contracts, constraints, failure obligations, and proof obligations.
  - `program-design` owns structural How: components, ownership, interfaces, state, flows, failure/recovery, concurrency/consistency, trust boundaries, compatibility realization, and proof seams.
  - `spec-program-review` owns reviewer-free local-review classification plus fresh independent specification-only, program-only, and pair review. It does not edit artifacts or accept a pair.
- Cuts generic spec/design/review routing over to those three skills. `spec-creation-swarm` and `spec-review-swarm` remain available as explicitly invoked legacy fixed-swarm workflows and now carry legacy display labels.
- Tightens the planning boundary: design-bearing work reaches `plan-creation-swarm` only with a current pair-mode `ready` review result bound to the exact current specification and program-design digests. Missing structural How routes to `program-design`; a complete but unreviewed or stale pair routes to `spec-program-review`.
- Retains a narrow implementation-mechanics-only planning bypass only when current source inspection positively proves that no design-bearing decision is required.
- Routes direct planning for one named runtime skill package through `skills-creation`; `plan-creation-swarm` may compose that work only from an exact explicit `skills-creation` parent packet/result identity.
- Carries that runtime-skill authorization through classification and fresh review re-entry, and allows one-shot Frontier Sol high/xhigh review assignments through the `manage-agents` Delegate pattern without weakening fresh-context or read-only review independence.
- Makes representative call-path analysis part of `program-design`: reconstruct current entrypoint-to-effect caller/callee paths from source and available runtime evidence, then return a normalized source-anchored target call graph or sequence; raw stack traces remain evidence rather than the design artifact.
- Encourages diagram-led shared understanding in both design stages: `spec-design` visualizes Why/What relationships without hiding normative meaning, while `program-design` renders applicable component, call, state, data, failure, trust, and proof views. Durable Markdown prefers Mermaid when supported; chat/terminal explanation routes through `tui-presentation`.
- Applies the same planning-readiness check to `plan-improve-repo`: it may vet findings before readiness is established, but writes or marks an executable plan `ready` only from a current exact-digest pair-ready result with current required local review coverage or a positively proven implementation-mechanics-only classification. Direct work on one named runtime skill package routes through `skills-creation`.
- Updates handoff, README, trigger-eval, and smoke guidance to preserve the same exact-digest gate; to route generic grilling and unmade decisions to `discuss-pathfinding`; to reserve `discuss-clarify-mental-models` for explicit drift/reconvergence; to route named-skill-package work through `skills-creation`; and to keep standalone threat models with `ops-security-review`.

## Changed surfaces

- New skill trees and OpenAI metadata for `spec-design`, `program-design`, and `spec-program-review`, plus the Frontier Sol one-shot review category in `manage-agents`.
- `plan-creation-swarm`, `spec-handoff`, plugin README, and trigger-eval routing.
- `plan-improve-repo` entry routing, executable-plan readiness, plan template, validation checklist, and OpenAI metadata.
- Legacy `spec-creation-swarm` and `spec-review-swarm` OpenAI display metadata.
- Codex and Claude plugin/marketplace metadata for `shravan-dev-workflow` 1.7.0.
- Root skill inventory and accepted three-skill specification set.
- Release smoke reference and historical WIP supersession banners.
- No command or hook behavior changed.

## Validation status

- Accepted design status: the three-skill specification set is `accepted-to-implement`; the earlier four-skill proposal is historical provenance only.
- The July 30 implementation review is baseline evidence for the original cutover commit. Its receipt expired when the July 31 remediation changed reviewed behavior text; the current parent reduction and final Sol xhigh completion receipt are recorded in [2026-07-31-spec-program-design-fable5-review-findings.md](../wip/skills-authoring/2026-07-31-spec-program-design-fable5-review-findings.md). The current ship decision is a PR-ready candidate at the static/source layer with behavior proof explicitly deferred.
- Integrated static checks passed:
  - Codex quick validation passed for all three new skill folders with PyYAML available;
  - four relevant JSON manifests and all 24 OpenAI YAML metadata files parsed successfully;
  - every referenced Markdown file in the three new skill trees resolves;
  - topology checks confirm exactly three new runtime skills, both legacy skills retained, and no runtime `specification-design` directory;
  - Codex and Claude plugin metadata target `1.7.0`, Claude marketplace metadata targets `1.7.0`, and the Codex marketplace source points to `./plugins/shravan-dev-workflow`;
  - `claude plugin validate .` passed;
  - `git diff --check` passed;
  - Codex marketplace readback succeeded and reports the installed `shravan-dev-workflow` cache at `1.6.72`.
- Static checks and review receipts are structural/source evidence only; they do not prove model routing behavior or release behavior.
- Pressure testing and behavioral smoke execution were deferred by user direction. No pressure scenarios were added or updated for these three skills, and no behavior proof is claimed; scenario authoring and execution remain an explicit open gap. The unexecuted smoke matrix is recorded in [references/shravan-dev-workflow-smoke.md](references/shravan-dev-workflow-smoke.md).
- The full parent reduction and proof boundary are recorded in [2026-07-30-spec-program-design-implementation-review.md](../wip/skills-authoring/2026-07-30-spec-program-design-implementation-review.md).

## Refresh / reinstall

- Source metadata targets `1.7.0`.
- Installed readback remains `1.6.72`.
- No Codex or Claude refresh/reinstall was performed for this source update.
