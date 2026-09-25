# Capability revamp PR 1: proof notes

## Harness

- Cause: ACPX `--approve-reads` auto-approves only `read` and `search` permission kinds; the pinned `codex-acp@1.6.2` adapter can request `execute` for a shell command that only reads a file, and `--non-interactive-permissions fail` aborted the turn. The runner now passes `deny`: unknown kinds are denied, never approved; the read-only sandbox is unchanged.
- Live: `track-show-me-your-work-historical-view` passed all five evaluators on the patched runner (2026-09-25 19:19Z) with three recorded `read` tool events (skill, reference, fixture). The deny path itself was not exercised in that run.

## Behavior evals

- 2026-09-25 19:29Z: seven scenarios (`agent-collaboration-tool-manual-vs-practice-routing` and six `practices-collaboration-*`) failed in the subject turn with `usageLimitExceeded` ("Your workspace is out of credits"). This is an environment gap, not a scenario result. Not retried.
- The renamed `practices-show-me-your-work-*` scenarios, the four new trace scenarios, and the `manage-agents` scenarios were not run for the same reason. Claim level for runs 1-4: drafted from user intent; behavior not yet evaluated.

## Effort key

- `acpx --agent "npx -y @agentclientprotocol/codex-acp@1.6.2" ... set -s <scratch> reasoning_effort high` returned `config set: reasoning_effort=high (5 options)`. `set ... effort high` and `set ... reasoning_effort bogus` were rejected with ACP `-32602` (Invalid params).

## Static

- Layering: `agent-collaboration` names no workflow skill; `practices-collaboration` names only `agent-collaboration`; `practices-show-me-your-work` names `practices-collaboration` and `agent-collaboration`; `manage-agents` names both practices and `agent-collaboration`. No upward or cyclic edge among the PR 1 skills.
- Renamed-name search (hidden directories included, excluding `docs/` history and `tmp/`) returns no active `track-show-me-your-work` occurrence.
## Re-vendor

- The canonical agent-router `agent-collaboration` tree at commit `f6eb23cd7cf2363529344a520a4cd13e043e3d23` (codex-router PR #77, merged 2026-09-25, verified on `origin/main`) was copied byte-for-byte into `plugins/agent-router/skills/agent-collaboration/`, excluding the preserved vendor-only `agents/openai.yaml`. The tree was read with `git archive f6eb23cd agent-skills/agent-collaboration`, not the working tree. `plugin-sources.json` pins that exact commit.
- `diff -r <f6eb23cd tree> plugins/agent-router/skills/agent-collaboration -x agents` printed nothing (exit 0). The content matched the previously vendored copy at `e6ada0cd`; no vendored file was absent upstream, so none was removed.
- Security gate, third-party source adoption: allowed (owner-owned repository, verbatim copy at a pinned merged commit, `diff -r` clean).
