# Router collaboration skill pruning

- Bumped `agent-router` to `0.11.0` and pinned canonical collaboration guidance to Router commit `23b2f6caa8609cd44bb41802cba84fc6a00b952a`.
- Reduced the vendored runtime skill from seven files to `SKILL.md` and the shared board reference.
- MCP schemas and CLI help remain on demand; the board reference is mandatory for board actions.
- Preserved vendor-only agent metadata and the canonical source ownership boundary.
- Independent review was waived for user PR review; pressure testing remains deferred.
- Validation: Router and vendored quick validators, canonical-copy/link/deletion/JSON checks, `claude plugin validate .`, Codex discovery, and `git diff --check` passed.
- Runtime behavior and cost or benchmark changes are not claimed. No cache or home apply was performed.
