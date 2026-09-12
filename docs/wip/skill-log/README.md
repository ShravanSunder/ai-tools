# Skill Failure Log

Brief intake for recurring skill or agent failures. Follow [FORMAT.md](FORMAT.md), reuse matching entries, and keep this index current. Deeper diagnosis belongs in [skills-investigation](../skills-investigation/session-failure-intake.md).

## Entries

| Date | Skill/workflow | Symptom | Status | Entry |
| --- | --- | --- | --- | --- |
| 2026-09-11 | manage-agents / Operator | Supplied PATH lost `/bin`, invalidating a VM reproduction | captured | [Command PATH drift](2026-09-11-operator-command-path-drift.md) |
| 2026-09-10 | manage-agents / Operator | CI watch checkpoints were not parent-visible across head changes | captured | [Watch checkpoint visibility](2026-09-10-watch-checkpoints-not-parent-visible.md) |
| 2026-09-10 | manage-agents / Delegate | Leaf assignments spawned extra lanes despite no-delegation constraint | captured | [Unrequested nested delegation](2026-09-10-unrequested-nested-delegation.md) |
| 2026-09-10 | Codex source investigation | Unquoted globs and guessed paths aborted source reads | captured | [Unquoted search globs](2026-09-07-unquoted-zsh-search-globs.md) |
| 2026-09-10 | track-show-me-your-work / Luna Operator | Rendered view misstates facts/ownership or re-roots detail links | captured | [Trail freshness and links](2026-09-09-trail-view-freshness-and-links.md) |
| 2026-09-09 | manage-agents / Operator | Live watch ended at a short observation timeout | captured | [Premature watch completion](2026-09-09-operator-watch-ended-before-terminal.md) |
| 2026-09-09 | manage-agents / Operator | Preflight stop incorrectly included cleanup of an existing proof Host | captured | [Preflight cleanup scope](2026-09-09-operator-preflight-cleanup.md) |
| 2026-09-09 | manage-agents / Operator and Delegate | Commands, tests, and packaged-marker proof used wrong checkout despite explicit workdir | captured | [Wrong worktree execution](2026-09-08-operator-wrong-worktree.md) |
| 2026-09-08 | manage-agents / relevance audit | Count-complete hunk ledger misclassifies new test scenarios | captured | [Semantic inventory mismatch](2026-09-08-hunk-inventory-semantic-misclassification.md) |
| 2026-09-07 | manage-agents / Operator | Requested proof logs omitted from two receipts | captured | [Missing proof logs](2026-09-07-operator-proof-not-retained.md) |
| 2026-09-07 | implement-plan / delegated removal | Shared tests and reference detail removed with obsolete fixtures | captured | [Shared proof loss](2026-09-07-feature-removal-shared-proof-loss.md) |
| 2026-09-07 | manage-agents / Codex ACPX | Read-only preset permits workspace writes | captured | [Read-only adapter preset](2026-09-07-codex-acpx-read-only-preset.md) |
