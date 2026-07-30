# Spec, Program Design, And Review Skills — Implementation Review

Date: 2026-07-30

Status: static/source review complete; behavior proof deferred by user direction

## Review Target

The accepted design is implemented as exactly three new runtime skills:

- `spec-design`: authoritative Why/What;
- `program-design`: structural How;
- `spec-program-review`: independent local-review classification and specification-only, program-only, or pair review.

There is no runtime `specification-design` skill and no fourth orchestration skill. `spec-creation-swarm` and `spec-review-swarm` remain on disk as explicit-invocation legacy workflows.

The reviewed change also cuts generic routing over to the three new skills, preserves exact-digest pair-readiness before design-bearing planning, retains the positively proven implementation-mechanics-only admission, and routes one named runtime-skill package through `skills-creation` unless an exact parent packet/result authorizes composition.

## Governing Boundary

- Accepted umbrella: [2026-07-28-spec-design-workflow.md](../../specs/2026-07-28-spec-design-workflow/2026-07-28-spec-design-workflow.md)
- Accepted Why/What design: [2026-07-28-spec-design.md](../../specs/2026-07-28-spec-design-workflow/2026-07-28-spec-design.md)
- Accepted structural How design: [2026-07-28-program-design.md](../../specs/2026-07-28-spec-design-workflow/2026-07-28-program-design.md)
- Accepted independent review design: [2026-07-28-spec-program-review.md](../../specs/2026-07-28-spec-design-workflow/2026-07-28-spec-program-review.md)
- Authoring and review rubric: `skills-creation`
- Reviewer runtime and receipt handling: `manage-agents`

Implementation was compared with the accepted boundary. Deviations: none.

## Changed-File Coverage

Reviewed semantically:

- every file under `plugins/shravan-dev-workflow/skills/spec-design/`;
- every file under `plugins/shravan-dev-workflow/skills/program-design/`;
- every file under `plugins/shravan-dev-workflow/skills/spec-program-review/`;
- all changed active routing surfaces in `AGENTS.md`, the plugin README, trigger evaluations, adjacent workflow skills, planning and handoff skills, plan-review and implementation-review references, and retained legacy skill metadata;
- the four accepted specification files and the deletion of the superseded `2026-07-28-specification-design.md`;
- both plugin manifests and both marketplace manifests.

Static-only:

- this implementation-review record;
- the dated changelog entry and changelog index;
- historical WIP supersession banners;
- the release-smoke reference, which records unexecuted cases rather than behavior evidence.

Out of scope:

- `docs/wip/skills-authoring/2026-07-29-spec-design-workflow-skills-creation-re-review.md`, which is unrelated user-owned work and was neither edited nor included in the review;
- ignored `tmp/` advisor packets, ledgers, and review packets, which are not shipping artifacts.

## Review Lanes And Receipts

The implementation review covered the full behavior-changing surface rather than treating the new skill trees as metadata:

| Lane | Terminal state | Parent result |
| --- | --- | --- |
| `trigger-routing` | complete | Accepted trigger and adjacent-route defects were remediated. |
| `mental-model-fit` | complete | The Why/What, structural How, and independent review identities remain distinct. |
| `placement-and-calls` | complete | Accepted call ordering, lane-packet, dispatch-contract, and one-owner defects were remediated. |
| `steering-strength` | complete | Accepted terminal-state, completion, verdict, and reviewer-independence defects were remediated. |
| `rule-agreement` | complete | Accepted freshness, source-coverage, classifier, planning-admission, and cross-reference defects were remediated. |
| `depth-coverage` | complete | Promised stages have teaching owners with inspection method, good/bad signals, and stop conditions. |
| `no-op-pruning` | complete | No remaining source sentence was identified as behavior-neutral padding. |
| `claim-vs-evidence` | complete | Static/source claims are separated from deferred behavior proof. |
| `sensitive-surface` | not dispatched | No sensitive surface from the `skills-creation` security gate changed. |

Silence was not counted as clean coverage. Earlier receipts expired when remediation changed their reviewed text.

## Parent Reduction

Accepted findings were reduced into these correction groups:

1. Complete stage-relative lane packets and review dispatch contracts.
2. Exact immutable governing-source coverage, classifier defaults, terminal re-entry, and freshness semantics.
3. Exact-digest pair-ready planning admission, including `plan-improve-repo`, with only a positively proven implementation-mechanics-only alternative.
4. Reciprocal near-miss routing for named skill packages, drift/reconvergence, discussion/pathfinding, standalone security work, and typed plan handoffs.
5. Executable terminal/verdict production rules and reviewer independence before dispatch.
6. Reference-call ordering, single semantic owners for proof/traceability, and mandatory external-evidence acquisition when a load-bearing contract requires it.
7. Visible historical supersession, plugin versioning, marketplace metadata, changelog, and legacy display labels without deleting the old skills.

Rejected findings:

- rewriting or removing the retained legacy workflows; the accepted contract preserves them as explicit-invocation prior art;
- adding a fourth orchestration skill; the accepted design has three complete runtime skills;
- treating static validation or review receipts as behavior proof.

Unverified findings: none at the static/source layer.

## Final Fresh Review

A fresh read-only ACPX OpenAI Sol review used `gpt-5.6-sol` with adapter-confirmed `reasoning_effort=xhigh`, no inherited authoring conversation, and candidate-only authority.

The full pass was bound to:

```text
HEAD:                      9390bb4d33463df4fdce3a8a7d8cf491e9d365c5
tracked diff SHA-256:      4879faaeddc15b1a74ee321e595f9d676324d4ece2ac336bd17ffe024214033e
status-set SHA-256:        b3bbf5b8cd4df72cabd6d1ef18249e76e0a279cbc315af23f9fc12fdb65fae8c
ACPX record:               019fb45c-8f4c-77e0-867f-1689007bfb32
```

It found one important cross-surface planning-summary defect. The parent rejected its proposed widening into legacy internals, accepted the narrow summary defect, and corrected `AGENTS.md`, `discuss-clarify-mental-models/SKILL.md`, and `orchestrator-goal/SKILL.md`.

The required focused re-review was bound to the corrected digests:

```text
assignment:                final-routing-focused-sol-review-20260730
ACPX record:               019fb46b-cad6-7b02-b746-4a13cc743a89
HEAD:                      9390bb4d33463df4fdce3a8a7d8cf491e9d365c5
tracked diff SHA-256:      4879faaeddc15b1a74ee321e595f9d676324d4ece2ac336bd17ffe024214033e
status-set SHA-256:        b3bbf5b8cd4df72cabd6d1ef18249e76e0a279cbc315af23f9fc12fdb65fae8c
receipt:                   complete
worktree changed:          no
pressure tests:            not run
behavior proof:            unverified/deferred
surviving findings:        none
```

The reviewer confirmed that the three public summaries preserve the planner-owned exact-digest pair-ready or positively proven implementation-mechanics-only admission predicate, do not transfer admission ownership to routing skills, and keep the legacy workflows explicit-only.

## Static Validation

Passed:

```text
uv run --with pyyaml python <quick_validate.py> plugins/shravan-dev-workflow/skills/spec-design
uv run --with pyyaml python <quick_validate.py> plugins/shravan-dev-workflow/skills/program-design
uv run --with pyyaml python <quick_validate.py> plugins/shravan-dev-workflow/skills/spec-program-review
  -> 3/3 valid

JSON parse
  -> 4/4 relevant manifests valid

YAML parse
  -> 24/24 OpenAI agent metadata files valid

new-skill reference resolution
  -> all referenced Markdown files present

skill topology
  -> 3 new runtime skills present
  -> 2 legacy skills retained
  -> no runtime specification-design directory

version/source consistency
  -> Codex plugin 1.7.0
  -> Claude plugin 1.7.0
  -> Claude marketplace 1.7.0
  -> Codex marketplace source points to ./plugins/shravan-dev-workflow

claude plugin validate .
  -> validation passed

git diff --check
  -> exit 0

codex plugin list --marketplace ai-tools --available --json
  -> source readback succeeded
  -> installed shravan-dev-workflow remains 1.6.72
```

One compound validation command returned exit 127 after its successful reference-resolution and topology assertions because `rg` was unavailable in that subprocess. Its unexecuted version tail was replaced by the passing deterministic JSON version/source check above; it is not counted as a validation pass.

## Proof Boundary And Ship Decision

Authoring basis: user-directed intent grounded in the accepted specifications and prior-art review.

Proof posture: static-only with an explicit user-accepted proof gap.

Pressure tests and behavioral smoke were not run because the harness is not ready and the user explicitly deferred them. No claim is made that model invocation, routing, compaction resistance, stale-source recovery, delegation, or pair-review behavior has been demonstrated at runtime.

Implementation decision: accepted-to-implement and implemented.

Ship decision: PR-ready candidate at the static/source layer; not behavior-proven and not released.
