# Manage Agents: General ACPX coordination and Luna-only Operators

## Outcome

`manage-agents` gives every ACPX assignment a named session, a caller-owned sparse progress log, compact updates, and an assignment-bound receipt without loading the full event stream into context. Separately, every Operator uses OpenAI Luna at caller-selected `high` or `xhigh`, preferring native Codex dispatch and falling back to ACPX when native Luna is unavailable or rejected.

## Requirements

1. **Luna-only Operator policy**
   - The only valid Operator lineage is OpenAI Luna.
   - The only valid reasoning efforts are `high` and `xhigh`.
   - The calling agent selects `high` or `xhigh` for each assignment. The skill defines no default between them.
   - Do not substitute Terra, Sol, Cursor, or another model when Luna dispatch fails.

2. **Native-first runtime routing**
   - On Codex, first attempt native dispatch with the exact model `gpt-5.6-luna` and selected effort.
   - Native availability is proven by the dispatch result, not by model catalogs or documentation.
   - If native dispatch rejects or cannot select Luna, retry the same bounded packet through ACPX using the `codex` provider, exact model, effort, cwd, and permission boundary.
   - If ACPX also cannot prove the selected Luna model, report the Operator as blocked.

3. **General ACPX named-session identity**
   - Every ACPX assignment has one stable assignment name, assignment id, and explicitly named session. One-shot `exec` is not used.
   - Advisors and Sidekicks reuse their named relationship session when the continuity contract still matches; each assignment within it retains its own assignment id and progress log.
   - Delegates and Operators create a fresh named session for each independent assignment and never reuse an unrelated session.
   - Native Operator dispatch uses the same assignment name as its task identity.
   - The ACPX record id and provider-native `agentSessionId`, when exposed, are evidence fields. Neither is treated as a pointer to ACPX SQLite storage.

4. **General ACPX progress channel**
   - Native agents use the native runtime's update and completion channel.
   - Every ACPX dispatch creates one assignment-scoped sparse progress log under `tmp/agent-communications/<assignment-id>.jsonl`. The caller owns this file so read-only ACPX assignments do not gain workspace-write authority.
   - The ACPX agent emits meaningful progress through its normal ACP output. The caller consumes ACP `session/update` events from the live structured NDJSON stream, reduces them locally, and appends only sparse records to the shared log.
   - A sparse record contains the assignment id, timestamp, state, one-line delta, next action, and latest consumed event cursor. Valid states are `started`, `progress`, `blocked`, `failed`, and `complete`.
   - Append a record only at assignment start, a meaningful phase change, blocked decision, failure, or completion. Do not emit periodic model-generated heartbeats when nothing changed.
   - Suppress thought chunks, raw read output, repeated tool states, unchanged status, and low-value narration. Never send a follow-up model turn merely to request a status update.
   - `acpx ... status -s <name>` is liveness evidence only. Saved session history may recover missed output, but neither liveness nor history preview is a completion receipt.
   - An Operator reaching a judgment or authority boundary emits the existing decision packet and waits or continues only as that packet permits.

5. **Efficient observation and recovery**
   - Read the sparse progress log first. If its latest record is sufficient and current, do not read ACPX history or invoke the model.
   - When the log is stale or insufficient, compare its event cursor with the named session's saved event position. If no new events exist, stop sampling.
   - If events advanced, read only the unseen portion of the persisted NDJSON event stream, filter for meaningful `session/update`, error, and prompt-result events, reduce them locally, and append at most one new sparse record.
   - Direct event-stream sampling is a recovery path. The live ACP stream remains the primary update source.

6. **Receipt and lifecycle**
   - Completion requires an assignment-bound receipt containing the assignment id, runtime, exact model, effort, source or head version, procedure result, exit state, and unresolved conditions.
   - The parent verifies the receipt's scoped claims before accepting them.
   - After a Delegate or Operator receipt is collected, close its ACPX assignment session without pruning it. Closing ends active reuse; retained record and history remain available for audit or recovery.
   - Keep an Advisor or Sidekick relationship session open only while its continuity contract remains valid. Complete each assignment's sparse log and receipt independently of the relationship lifetime.

## General ACPX feedback flow

```text
create or resume named session
        |
        v
set and verify selected model + effort
        |
        v
submit bounded agent packet
        |
        v
live ACP session/update stream
        |
        +--> reduce meaningful delta --> sparse shared log
        |                                  |
        |                                  +--> compact parent update
        |
        +--> decision boundary -------> decision packet
        |
        v
prompt result / stop reason
        |
        v
assignment receipt --> parent verification --> close or retain by pattern
```

## Skill surface allocation

- `SKILL.md`: all-ACPX named-session/progress invariant, Luna-only Operator table, native-first then ACPX fallback rule, and receipt completion boundary.
- `references/acpx.md`: general named-session lifecycle, per-pattern reuse/close rules, sparse assignment logs, and structured progress consumption.
- `references/acpx-provider-codex.md`: Operator Luna model and effort encoding plus live model verification.
- `references/agent-job-packet.md`: caller-selected effort, sparse progress policy, event cursor, and final receipt fields.
- `references/session-ledger.md`: record the current assignment id, sparse-log path, and consumed event cursor for persistent Advisor and Sidekick relationships.
- Pressure scenarios: every ACPX pattern uses a named session and sparse assignment log; Advisor/Sidekick continuity reuses the correct session without merging assignment receipts; Delegate/Operator sessions are fresh and close after receipt; read-only ACPX work still receives a caller-owned log; noisy ACP events reduce to one sparse update; an unchanged cursor causes no model turn; liveness is not mistaken for completion; caller selects Operator `high`; caller selects Operator `xhigh`; native Luna succeeds; native Luna rejects and ACPX succeeds; both Luna routes reject.

## Non-goals

- Modifying Codex model catalogs or working around the native runtime internally.
- Depending on Codex or ACPX private SQLite schemas.
- Building a new daemon, broker, polling loop, or durable operator ledger.
- Granting an otherwise read-only ACPX agent write access merely to maintain progress state.
- Reusing one ACPX session across unrelated assignments or relationships.
- Preserving alternative Operator model fallbacks.

## Evidence anchors

- Codex issue [#36294](https://github.com/openai/codex/issues/36294) documents the open native Luna filtering mismatch and shows that catalog metadata is not sufficient proof of spawn availability.
- ACPX [sessions documentation](https://github.com/openclaw/acpx/blob/main/docs/sessions.md) defines named sessions, queue ownership, saved records, event history, status, and soft-close behavior.
- ACPX [output documentation](https://github.com/openclaw/acpx/blob/main/docs/output-formats.md) defines live `session/update` NDJSON events and structured output modes.
- ACPX source [event-log.ts](https://github.com/openclaw/acpx/blob/main/src/session/event-log.ts), [events.ts](https://github.com/openclaw/acpx/blob/main/src/session/events.ts), and [serialize.ts](https://github.com/openclaw/acpx/blob/main/src/session/persistence/serialize.ts) show JSON records, append-only NDJSON event streams, and the optional provider-native session id.

## Acceptance

The design is ready to implement when we agree that named sessions and sparse caller-owned assignment logs apply to every ACPX call, relationship sessions preserve only intentional Advisor/Sidekick continuity, the calling agent selects Operator `high` or `xhigh`, and direct reads of ACPX's event-stream file remain a recovery mechanism rather than the primary progress API.
