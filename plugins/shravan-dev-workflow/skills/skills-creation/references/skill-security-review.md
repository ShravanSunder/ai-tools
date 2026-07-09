# Skill Security Review

Treat executable resources, third-party content, secrets, and home/cache
writes as sensitive surfaces before ordinary authoring continues.

Load this when scripts, hooks, assets, package scripts, shell/network
behavior, third-party skill/source adoption, private auth material,
privileged actions, or installed-cache/home mutation are in scope, or when
the user asks to refresh installed plugins or mutate home-level state as
proof.

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

## How To Inspect

Inventory sensitive surfaces and entry points. Identify untrusted inputs and
privileged actions. For third-party source or assets, record source, license
or permission state, and a copy-vs-adapt decision before anything is copied.
Decide `allowed`, `disallowed`, `blocked`, or `deferred`, and gate that
decision before any write or edit of the sensitive surface -- not alongside
it. Executable resources need behavior proof (deterministic tests).
Escalate to `ops-security-review` only for an explicit security scan or
vulnerability review, not routine authoring judgment.

## Return Labels

Use these labels for the security branch, even in chat-only review:

```text
sensitive surfaces:
entry points:
untrusted inputs:
privileged actions:
third-party source:
license / permission state:
copy-vs-adapt decision:
decision: allowed | disallowed | blocked | deferred -- sets the run note `security route` field when one is used
required proof:
public-safe constraints:
review route:
```
