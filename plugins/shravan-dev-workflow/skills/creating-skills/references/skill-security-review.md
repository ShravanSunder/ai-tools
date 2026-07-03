# Skill Security Review

Mission / stance:
Treat executable resources, third-party content, secrets, and home/cache writes
as sensitive surfaces before ordinary authoring continues.

When to use:
- Scripts, hooks, assets, package scripts, shell/network behavior, third-party
  skill/source adoption, private auth material, privileged actions, or
  installed-cache/home mutation are in scope.
- The user asks to refresh installed plugins or mutate home-level state as proof.

## Sensitive Surfaces

- `scripts/`
- hooks
- `assets/`
- package scripts
- shell commands or subprocess behavior
- network access
- third-party source or skill adoption
- private auth material, tokens, or sensitive-value paths
- installed Codex/Claude cache refresh
- home-level writes

How to inspect:
Inventory sensitive surfaces and entry points. Identify untrusted inputs and
privileged actions. For third-party source or assets, record source, license or
permission state, and copy-vs-adapt decision before anything is copied. Decide
`allowed`, `disallowed`, `blocked`, or `deferred`. Escalate to
`ops-security-review` only for an explicit security scan or vulnerability
review, not routine authoring judgment.

Good signals:
- sensitive-resource gate runs before write/edit
- executable resources require deterministic tests
- third-party copying is blocked until rights are clear
- installed-cache/home mutation is deferred unless scoped
- public docs/changelog stay free of secrets, local paths, and private config

Bad signals:
- treating scripts/hooks/assets as normal prose
- unconditional package scripts that mutate installed caches
- copying source wholesale without license/permission check
- static validation claimed as executable-resource proof

Unique return labels:
Use these labels for the security branch, even in chat-only review:

```text
sensitive surfaces:
entry points:
untrusted inputs:
privileged actions:
third-party source:
license / permission state:
copy-vs-adapt decision:
decision: allowed | disallowed | blocked | deferred
required proof:
public-safe constraints:
review route:
```
