# Skill Security Review

Load trigger: a skill change involves scripts, hooks, assets, package scripts,
shell/network behavior, third-party skill/source adoption, private auth material,
privileged actions, or installed-cache/home mutation.

Carry in: sensitive surface, privileges, entry points, untrusted inputs,
intended mutation, changed resources, public docs/changelog surfaces, and proof
expectations.

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

## Procedure

1. Inventory the sensitive surfaces and entry points.
2. Identify untrusted inputs and privileged actions.
3. For third-party source or assets, record source, license or permission state,
   and copy-vs-adapt decision before anything is copied.
4. Decide `allowed`, `disallowed`, `blocked`, or `deferred`.
5. Require deterministic script tests for executable resources.
6. Require public-safe docs/changelog review for user-visible changes.
7. Defer installed-cache/home mutation unless release/refresh is explicitly in
   scope.
8. Escalate to `ops-security-review` only for an explicit security scan or
   vulnerability review, not routine authoring judgment.

## Return Artifact

Use these exact labels when returning the security branch, even in chat-only
review:

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

Completion criterion: no sensitive resource proceeds as normal prose work; every
allowed action has proof, third-party copying is blocked until rights are clear,
and every blocked/deferred action is explicit.

Source material adapted: repo security boundaries, Codex creator resource types,
Superpowers pressure proof, and public-safe changelog rules. Rejected:
install/cache mutation as ordinary validation. This branch does not duplicate
all-branch workflow state from `SKILL.md`.
