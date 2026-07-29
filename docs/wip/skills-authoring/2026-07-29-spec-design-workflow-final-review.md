# Spec Design Workflow Skills — Final Review

Date: 2026-07-29

Status: proposal accepted to implement; runtime implementation waits for authorized `origin/master` integration

## Decision

The four-skill decomposition is accepted:

```text
spec-design
  owns lifecycle, routing, freshness, remediation, pair acceptance
  calls
    specification-design
      owns authoritative Why / What craft
    program-design
      owns structural How craft
    spec-program-review
      owns review-requirement classification and independent review judgment
```

The four skills remain independently invocable. `spec-design` composes them without absorbing their domain teaching. Bounded research, modeling, section-writing, and review delegation remain available; fixed swarm topology is not part of the design. Existing `spec-creation-swarm` and `spec-review-swarm` remain on disk as explicit legacy workflows.

## Reviewed Artifacts

| Artifact | SHA-256 |
| --- | --- |
| `2026-07-28-spec-design-workflow.md` | `ef998a3b9fc3125d0dc3de0d7bf5b22e6a2d687a99433c3ba541d5b2ddce2a6e` |
| `2026-07-28-specification-design.md` | `48a24e72364da6b45df555937dec133a87b0c1255c7c9f2a5dddc3b2729a247c` |
| `2026-07-28-program-design.md` | `4c49e419418cb11ea521bc8b670e68bf23eb7dc64667a9fcece2b57b1be53d34` |
| `2026-07-28-spec-program-review.md` | `70c921b01e82ad90115be734364ebdb2abdc621cd9095b093522c46d48bbe570` |
| `2026-07-29-spec-design-source-classification.md` | `e07067c77e5233d3ff0cd92f43ffa2be65fce78b20dbf1d09b22c39965c4a454` |

Review base HEAD: `d732a242551743392347643d057370abf7f98322`

Governing contract: installed `shravan-dev-workflow:skills-creation` 1.6.72. `manage-agents` governed ACPX identity, model, access, packet, ledger, and receipt handling only.

## Source Classification and Advisors

The source-classification pass compared the current legacy creation, review, and planning skills, historical proposal craft at `48b5206` and `7142c0a`, and directly relevant skill-authoring sources. Three fresh advisors—OpenAI Sol xhigh, Cursor Fable high, and Cursor Kimi K3—converged on the same boundary:

- keep four semantic owners rather than one collapsed skill;
- preserve the old skills' useful craft while dropping fixed fan-out;
- put specification construction, program construction, and review judgment in their own complete teaching spines;
- let orchestration own lifecycle state and pair acceptance only;
- keep planning downstream of accepted Why/What and structural How.

## V8 Formal Review

Fresh-context read-only ACPX `gpt-5.6-sol` xhigh reviews were bound to the then-current digest of each changed named skill.

| Target | ACPX relationship | V8 verdict |
| --- | --- | --- |
| `spec-design` | `019faf2a-5381-7341-ad44-d90d9bdeb9be` | `targeted-revision` |
| `specification-design` | unchanged after V7 `great` | `great` |
| `program-design` | `019faf2a-54c2-7101-a199-e3a0f7f0b36b` | `targeted-revision` |
| `spec-program-review` | `019faf2a-57b6-7211-9e75-d3f44e93dfd9` | `targeted-revision` |

Accepted findings and closure:

### `spec-design`

- Closed: planning classification is now the transaction admission gate.
- Closed: the classifier derives a complete scoped governing-source inventory before deciding.
- Closed: imported author/classification/review results carry immutable exact source coverage; the canonical record references it instead of copying it.
- Closed: blocked, deferred, and accepted records have explicit re-entry and source-revalidation transitions.

### `specification-design`

- Closed: its callable result exposes exact immutable governing-source coverage for orchestration freshness checks.

### `program-design`

- Closed: its trigger reciprocally excludes the full lifecycle and routes that work to `spec-design`.
- Closed: its shared lane packet is stage-relative, so early evidence/alternatives lanes do not require a nonexistent program-design digest or selected direction.
- Closed: compatibility, migration, and cutover construction belongs to the existing state/calls/flows owner and teaches phase authority, version skew, transition, rollback/reconciliation, failure behavior, and proof seams.

### `spec-program-review`

- Closed: review-mode outputs/completion no longer conflict with the reviewer-free classifier result.
- Closed: classifier input/result carries immutable governing-source coverage.
- Closed: the ordered classifier is total; every remaining semantic change conservatively returns `review-required`.

## V9 Acceptance Review

ACPX relationship: `019faf3a-a8ad-75d3-9a2b-89715104d34f`

Provider session: `019faf3a-f200-7722-98b6-6bb61999cbd2`

Configuration: fresh context, read-only, no terminal, `gpt-5.6-sol`, adapter-confirmed `reasoning_effort=xhigh`.

Receipt:

- assignment: `spec-design-workflow-v9-acceptance`;
- all five bound digests matched;
- all eleven V8 findings verified closed;
- `mental-model-fit`: complete, no findings;
- `trigger-routing`: complete, no findings;
- `rule-agreement`: complete, no findings;
- `depth-coverage`: complete, no findings;
- new blockers: none;
- blocker overrides: none;
- verdict: `great`;
- implementation decision: `accepted-to-implement`.

Parent reduction accepted the receipt. No candidate finding remains open, contested, or unverified.

## Main Takeaways

1. The missing spine is now explicit. Specification design constructs authoritative observable obligations; program design constructs the executable system model that realizes them; review independently attacks both; orchestration keeps the lifecycle closed.
2. Program design is not a heading list. Its required route covers current-system grounding, alternatives and falsifiers, an integrated component/ownership tree, interfaces, state/lifecycle, calls and flows, failure/recovery, concurrency/consistency, compatibility/cutover, cross-cutting realization, and proof architecture.
3. Review is not generic coherence checking. It owns deterministic local-review classification, complete-read adversarial reconstruction, authority and traceability checks, mode-complete review, predicate-selected focused depth, parent reduction, and an explicit non-acceptance boundary.
4. Delegation remains useful when a bounded mission earns it. The rejected mechanism is mandatory swarm fan-out, not subagents.
5. The old skills are retained as prior art and explicit legacy workflows. This proposal does not delete or retire them.

## Validation and Proof Boundary

Static validation completed:

```text
shasum -a 256 <four specs> <source classification>  # matched bound digests
git diff --check                                      # exit 0
```

Pressure tests were intentionally not run. Static review is not behavior proof. Trigger, resume, stale-source, remediation, classifier, delegation, and planning-handoff behavior proof remains an implementation-stage obligation under `skills-creation` after the pressure harness is ready.

## Implementation Gate

The specifications are accepted. The current branch is still based on `d732a242551743392347643d057370abf7f98322`; refreshed `origin/master` is `060632df4f76d367b7463b054a0a754c4bb14e82`, with the worktree branch 6 commits ahead and 10 behind before this publication commit.

Runtime skill implementation must not begin against that stale base. Integrating `origin/master` is a history write and requires explicit user authorization. After integration, implementation proceeds one named skill at a time under `skills-creation`, preserving these accepted boundaries and the explicit deferred-proof gap.
