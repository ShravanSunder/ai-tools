# Review Packet

Use this skill-local packet contract for spec-review subagent prompts or copy-paste prompts. Load only the selected `references/lanes/*.md` files for lane-specific behavior. This file owns spec-review packet anatomy, source-truth handling, artifact coverage fields, refinement-shaped output contract, receipts, parent reducer boundaries, and review-specific route-back rules. It intentionally does not define named lane overlays. Use `references/finding-schema.md` as the canonical per-finding schema for every review lane.

For substantial review swarms, the parent preserves an inspectable artifact trail in the existing review workflow home. If review artifacts live beside the source workflow instead, the parent ledger must point to that source workflow and to each parent-written lane artifact path. Lane files are candidate findings; the parent ledger is the reducer synthesis; the reviewed spec/design remains the accepted phase artifact only after parent verification.

Do not pass accumulated session history as lane context. Give each lane a fresh, bounded packet with source anchors, source/file inventory, and the exact decision target. Do not ask a lane to "understand the repo" or "review everything" unless that broad audit is the named task and the inspect list explains why.

For substantial review, include a first-class `whole-spec-coverage` lane. It receives the target spec artifact, source anchors, research lane files or ledger entries, slice inventory when present, and the focused-lane decision surface. Focused lanes do not replace it.

Do not pre-judge findings for a lane. The parent packet must not tell a lane to treat a category as minor, avoid flagging a concern, or confirm the parent's preferred answer. Lanes return candidate findings; the parent reducer verifies and ranks them after reading the evidence.

If a claim cannot be verified from the supplied artifact, source anchors, or one named focused check, return it as open or unresolved. Do not broaden into a repo crawl to rescue an under-specified spec.

If a shortcut or missing artifact prevents live dispatch, the parent still names the mandatory `whole-spec-coverage` lane in the blocked response. Do not describe it only as generic whole-picture or whole-artifact coverage.

```text
You are a spec/design review swarmer.
Review only; do not implement. Do not edit files.

Repo: <absolute repo path>
Branch/worktree: <branch or detached/head state>
Target artifact: <path or chat-only>
Coverage from controller: <line count + chunk ranges, or packet files>
Primary artifact inputs:
- target spec/design artifact: <path, required sections, and coverage>
- source/research artifacts: <research ledger, lane files, source docs, or not applicable with reason>
Required source anchors:
- <product intent / requirement / contract / boundary / proof expectation / slice route>: <why this constrains the lane>
Lane: <selected lane name>
Selected lane reference: <references/lanes/<lane>.md>
Reasoning effort: high | xhigh
Decision target: <spec readiness decision, finding class, proof expectation, refinement input, or route-back decision this lane informs>

Security context: <applicable | not applicable>
- If not applicable: <short reason>
- If applicable: <pointer to parent security context plus lane deltas, or
  assets/entry points/untrusted inputs/trust boundaries/sensitive data/
  privileged actions/security non-goals>

Claim / artifact / contract:
- Claim: <what the spec says>
- Artifact evidence: <spec section / code path / docs>
- Contract to test against: <user goal, existing API, product rule, security invariant>

Source-of-truth inputs:
- <spec section, requirement, user decision, code path, or docs>: <why this constrains the lane>

Relevant files/docs:
- <path>: <why>

Focus:
<lane-specific focus from references/lanes/<lane>.md>

Inspect:
- <spec section, code path, source artifact, command output, or docs>: <why>

Non-goals:
- Do not edit files, implement code, decide accepted findings, or route the
  final workflow state.

Contradiction handling:
- Report conflicts with source artifacts, live repo evidence, sibling-lane
  findings, or user decisions; the parent reducer resolves them.

Return:
- lane name
- verdict: ready | needs revision | blocked | decision-needed
- candidate findings only, grouped by blocker | important | question | nit
- for every substantive finding:
  - use the exact schema in `references/finding-schema.md`
  - include an exact inspectable anchor, preferably `path:line`; if line
    numbers are unavailable, name the smallest durable heading/section and why
  - name the smallest refinement target and validation note; do not say only
    "add more detail" or "clarify"
- contested tradeoffs
- open questions
- evidence paths or sections
- proof expectation or validation evidence needed by a later plan
- proposed artifact path and candidate lane-file content, or
  "chat-only/no-files exception: <reason>"
- completion receipt: answered | blocked, with source anchors and proposed
  artifact path; parent writes lane files for read-only lanes
- confidence: high | medium | low

Do not include speculative findings without a concrete failure path.
Prefer one strong finding over several weak findings.
Do not mark findings accepted. Parent verification decides accepted,
contested, open, rejected, or deferred.
```

Review means pressure-testing the spec. Refinement is the output shape for every lane, not a separate phase or one isolated lane.
