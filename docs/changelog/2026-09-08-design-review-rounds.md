# Design review rounds (2.9.0)

- Prefer one spec/design review-and-correction round. Allow a second only for a concrete, source-backed substantive issue remaining or introduced within the agreed design. A third requires explicit user approval.
- Pedantic, stylistic, already-satisfied, and reassurance-only reruns do not qualify. Parent verification closes resolved findings without automatic rereview.
- Shortens orchestration recovery and terminal prose while preserving independent review, unknown history, correction limits, and owner-decision stops.
- Spec and program design defer to the canonical spec-program-review policy. Implementation-review and skill-authoring budgets remain unchanged; no new counters or logging machinery.
- Validation: independent source review, 121 unit tests, typecheck, five skill validators, plugin validation, and all five affected Luna decision/classification cases pass. PR #54 merged as the 2.9.0 release.
- Refresh: Codex and Claude installed/enabled at 2.9.0; Cursor local plugin source resolves to 2.9.0 and its ai-tools marketplace was re-indexed. Updated skill files match the merged source. Start new chats or reload clients to pick up instructions.
