---
name: security-router
description: Use when the user asks for a security scan, security audit, threat model, vulnerability review, security diff scan, or remediation of one security finding; route to the installed official Codex Security plugin instead of recreating a scanner.
---

# Security Router

Route security-primary work to the narrowest appropriate official Codex Security workflow. This skill is a router and handoff layer, not a replacement scanner.

Core pipeline:

```text
security request
  -> authorization and scope check
  -> choose installed Codex Security skill
  -> prepare threat-model / scan packet
  -> invoke official skill or provide copy-paste prompt
  -> preserve report paths and remediation handoff
```

## Core Rules

- Only scan repositories, diffs, paths, or systems the user is authorized to assess.
- Keep scans read-only unless the user explicitly asks to fix one reviewed finding.
- Use the installed official Codex Security plugin when available in the current runtime.
- Do not fold full security scanning into `plan-review` or `implementation-review-swarm`.
- For ordinary plan or implementation review, use those skills' security lanes. Route here only when the user asks for a scan, audit, threat model, or security-specific remediation.
- Choose the narrowest scan that answers the request.
- Treat security findings as review inputs. Validate before fixing or merging.
- Record scope, report paths, and deferred proof gaps in handoff artifacts.

## Routing

- Use `$codex-security:security-diff-scan` for PRs, commits, branch diffs, or working-tree patches.
- Use `$codex-security:security-scan` for repository-wide or scoped-path security scans.
- Use `$codex-security:deep-security-scan` for authorized full-repo high-recall audits.
- Use `$codex-security:fix-finding` for one reviewed finding.
- Use `$codex-security:threat-model` when the user explicitly asks to create, update, or persist a repository threat model.

If Codex Security is not installed or not available, produce a copy-paste prompt that asks a new Codex thread to use the relevant official skill, and preserve the local scope/context.

## Workflow

1. Resolve security request type:
   - diff scan
   - repo/path scan
   - deep scan
   - threat model
   - fix one finding
2. Confirm authorization and scope.
3. Gather context:
   - repo path and branch
   - PR/commit/range/path
   - existing threat model or security guidance
   - sensitive surfaces and non-goals
   - desired output/report path, if provided
4. Choose route.
5. Prepare prompt or invocation.
6. After the scan:
   - preserve report paths
   - summarize report status, not all findings
   - route fixes through `$codex-security:fix-finding` or a bounded implementation plan

## Progressive Disclosure

- Load `references/routing.md` before preparing a prompt or deciding between scan modes.
- Load `references/threat-model-context.md` when preparing a threat model or packaging security context into another skill.

## Output Shape

Return:

- Selected security route and why.
- Authorization/scope statement.
- Threat-model context used or missing.
- Exact prompt/invocation for the official Codex Security skill.
- Expected reports or handoff paths.
- What not to broaden.
