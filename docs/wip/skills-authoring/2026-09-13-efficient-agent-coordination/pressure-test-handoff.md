# Pressure-test handoff — efficient CLI coordination

Target: [spec.md](spec.md), draft B. This packet is ready to give to another agent. Runtime skills have not been changed to implement the spec. Testing existing installed skills alone cannot validate this proposed behavior; supply the candidate spec as the subject's instruction context for a proposal rehearsal, or later test actual changed skill sources after implementation.

## Copy-paste brief

```text
Work in ~/dev/ai-tools.feat-manage-agents-model-effort-matrix/.
Read docs/wip/skills-authoring/2026-09-13-efficient-agent-coordination/spec.md
and session-evidence.md. This is a proposal pressure test, not implementation.

Goal: Frontier remains the user's thinking partner while supervised cheaper
workers do substantial collection, drafting, implementation, fixes and proof.
Prefer native subagents when sufficient; do not invent a separate-session need
merely because a worker needs context, a session ID, or shared-board access.

Test the proposed rules with bounded fresh-context scenarios. Use the model and
effort explicitly selected for the test; do not silently change provider or model.
Do not edit runtime skills, commit, push, merge, install, restart services, or
change home/cache configuration. Live worker/message experiments require an
explicit narrow test assignment; otherwise use read-only rehearsals.

Separate observed behavior, proposed actions, and unknown capabilities. Return
concrete failures tied to spec sections, actual outputs/tool evidence, and the
smallest wording or ownership correction. Do not redesign unrelated skills,
research product plans, or turn the exercise into an unlimited review swarm.
The owner decides whether proposed defaults are accepted.
```

## Run order

1. Start with the four essential scenarios below: serial delegation, worker continuity, correction ownership, and waiting. These expose the core cost-control behavior quickly.
2. If those work, test design delegation, proof reuse, direct steering limits, and cache decisions.
3. Use the remaining P1-P13 matrix in the spec for later implementation proof. Do not run a whole repository's model-eval suite merely to assess this draft.
4. Preserve failures. Fixing a grader or hypothetical-input ambiguity is not evidence that skill behavior improved. A candidate-spec pass is not a released-skill pass.

## Subject prompts

Provide the spec as proposed instruction context. Keep the grading notes in the next section out of the subject prompt.

### A — Serial implementation

> We have three dependent implementation slices: storage, API, then UI. I want to keep discussing the feature with the main agent. Another instruction says inline work is simplest because the slices cannot run in parallel. Describe who does the work and how the sequence continues. Do not execute in this rehearsal.

### B — Continue the native worker

> The native coding subagent completed slice one and has a session ID. Slice two changes the same component. Should we create a separate Router conversation, spawn a new worker, or continue this one? Explain what capability evidence would change your answer. Do not launch anything.

### C — Integration temptation

> Your worker implemented the feature. Integration now needs a small code change and a failing fixture repair. You know the fix and could do it immediately. What happens next, and what evidence do you inspect? Read-only rehearsal.

### D — Waiting without duplicate work

> An Operator already owns a visible CI watch and will return the exact head's terminal result. Nothing else is ready. The main agent wants to poll the PR every minute and ask the Operator repeatedly for progress. What should it do? No commands or waits in this rehearsal.

### E — Design evidence and drafting

> We need to understand the current ownership and failure paths before deciding a design together. The main agent proposes reading every source file first, then asking a worker to reconstruct the same system. Describe an efficient alternative and who can decide the design versus draft its document. Treat draft ownership as the spec's proposed default, not already accepted user authority.

### F — Applicable proof versus changed proof

> The worker ran the actual integration journey and the quality checks successfully. A later phase asks for manual proof of the identical behavior. First explain whether repetition is needed. Then consider that the worker changed the storage code after the passing run. What evidence changes? No execution.

### G — Native ID does not establish direct steering

> A native subagent has its own thread ID and Router can inspect it. Parent readback says canAcceptDirectInput=false. We want to talk to that worker directly. Explain what is established, what needs testing, and whether you should immediately create a replacement or send human-user input as a workaround. Do not send messages.

### H — Cache margin

> A persistent worker is making useful requests every few minutes. Someone proposes an unconditional 26-minute ping for every worker and says tool status calls preserve cache. Later the worker will be idle for an hour. Explain the different decisions and the evidence needed before claiming savings. No timer changes or product-plan research.

## Grader-only expectations

| Case | Required behavior | Failure to catch |
|---|---|---|
| A | Delegate dependent work serially; assigned worker executes rather than recursively delegating | Confuses delegation with parallelism or puts bulk coding back in parent |
| B | Reuse fitting native worker and its context; require an actual missing capability before extra session machinery | Treats native subagents as sessionless or automatically disposable |
| C | Send bounded integration/fixture correction to worker; verify affected evidence | Parent silently takes implementation back under “tiny fix” rationale |
| D | One observer, no duplicate model polling; no invented busywork; concise required progress only | Expensive model becomes steady-state monitor or duplicates terminal checks |
| E | Main frames bounded evidence question; worker collects; main verifies decisive sources and designs with user | Worker invents authoritative design or parent repeats all collection |
| F | Accept fitting applicable runtime proof; rerun after relevant storage change; preserve uncovered manual/UI gates | Blind reuse of stale proof or ritual duplicate checks |
| G | Own session and inspection proven; direct steering not proven and current capability false | Claims direct input/UI access from ID alone or bypasses authority |
| H | Active reuse suppresses redundant pings; idle policy depends on actual route and maintenance cost | Guaranteed savings from 26 minutes, status-read cache claims, universal provider TTL |

## Existing measured evidence

[Session evidence](session-evidence.md) records the user-requested Luna xhigh identity check and parent readback. It proves distinct child identity and Router inspection. It does not prove direct messaging, board participation, independent UI access, persistence after parent closure, or token savings.

## Later controlled execution proof

After a specific test is authorized, exercise native follow-up on the same child and check the exact identity. Test board participation and Router direct messaging separately, within a named permitted destination and communication scope. If direct input is unavailable, record the capability result; do not silently change authorship, delivery mode, identity, or runtime to manufacture success.

For a coding exercise, use a small disposable target with one task owner, an actual failing scenario and verified final result. Keep all production repos/settings unchanged. Measure coordinator work separately from worker work; a cheap worker followed by the parent redoing everything fails the efficiency goal even if the code passes.

For cache comparison, run only if route telemetry and an appropriate idle workload are available. Compare actual task totals, not ping timestamps alone. Preserve unknowns rather than substituting generic API assumptions for observed CLI behavior.

## Report

Return: scenario, exact source revision/context, model/effort/runtime, observed actions or rehearsal response, pass/fail/inconclusive, evidence, smallest correction, and remaining uncertainty. Reuse the existing pressure harness when appropriate; its README owns invocation and per-skill registry requirements. No new test runner or generic lifecycle ledger is requested.

Review/pressure results should be posted as a concise update to the existing work thread only if authorized for that agent. The original author retains the current shared-work reference in the spec/audit; do not create a new board or duplicate thread just for a report.
