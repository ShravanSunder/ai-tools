---
name: plan-handoff
description: Use when packaging an existing implementation plan for another agent, CLI, machine, or future session, especially when the user asks for a copy-paste prompt, next-agent context, or portable plan packet.
---

# Plan Handoff

Package an existing implementation plan so another agent can review, execute, or continue planning without reconstructing the conversation. This is a portability boundary, not a completion boundary: handoff means the plan context is transferable, not that the plan is approved or implemented.

## Core Rules

- Use only when an implementation plan or plan artifact exists.
- If the source is spec/design context without an implementation plan, use `spec-handoff` for portability. If the caller wants a plan and carries current ready three-artifact design authority, route to `plan-implementation`; never create the plan inside the handoff.
- If the source is branch, diff, changed files, commits, validation, or blocker evidence, use `implementation-handoff`.
- Prefer repo-local temp artifacts: `<repo-root>/tmp/plan-workflows/<yyyy-mm-dd>-<repo>-<branch>-<plan-slug>/`.
- Include the repo/worktree, branch, source plan path, referenced code/docs, open questions, and exact requested task.
- Include the plan's obligation-to-slice-to-proof mapping (path or excerpt) or its compact proof line, plus evidence sources, freshness guards, proof layers, split triggers, open proof gaps, and the parent-verification rule for any downstream subagent/reviewer/driver evidence.
- When the plan touches auth, parsing, filesystem, network, secrets, subprocesses, plugins, MCP, CI, package scripts, dependencies, agents, or external services, include the applicable entry points, trust boundaries, invariants, non-goals, and proof. Otherwise record only `Security: not applicable`.
- If a plan file is available, read it end to end before packaging. Do not require a separate reading receipt.
- Keep the handoff portable. Avoid local-only assumptions unless the target agent must inspect that local path.
- Show the copy-paste prompt in the final response and write the same prompt to a file.
- Do not make code changes unless the user separately asks to implement.

## Workflow

1. Resolve the repo root with `git rev-parse --show-toplevel` when possible.
2. Resolve the source plan artifact or plan packet. If none exists, apply the core routing rule and stop.
3. If a source file exists, read the whole file before summarizing. A heading search, path listing, or user summary is not a substitute for the plan contents.
4. MUST load `../../shared-references/canonical-implementation-plan.md` to validate the existing completed plan and preserve it without re-authoring or approval, and return the unchanged plan record, separate approval-evidence record or explicit absence, and any blocking discrepancy for the handoff packet.
5. Inspect only the secondary code/docs needed to make the handoff grounded.
6. Create the temp artifact directory. Include repo, branch/worktree, and plan slug in the path.
7. Write at least:
   - `plan-handoff.md`
   - `copy-paste-prompt.md`
8. Print a TUI-friendly response with:
   - artifact path
   - full clickable artifact links (absolute path + line)
   - copy-paste prompt
   - what the next agent should inspect first

## Progressive Disclosure

IF writing the handoff artifact or copy-paste prompt, load `references/handoff-template.md` and return both filled artifacts with the unchanged plan record and approval evidence or explicit absence.

## Common Mistakes

- Handoff only says "continue from here" and omits source files.
- Chat response links the file but does not show the prompt the user can copy.
- Design/spec context is mislabeled as an existing implementation plan.
- The plan is summarized from headings without being read.
- The handoff hides uncertainty instead of listing exact open questions.
- The packet is overbroad and asks the next agent to understand the entire repo.
- Sensitive trust-boundary assumptions are omitted, forcing the next agent to invent a threat model.
- The obligation/slice/proof mapping is omitted, forcing the next agent to infer how the plan will be proven.
- The handoff drops evidence sources, freshness guards, or parent-owned verification, letting the next agent treat delegated evidence as completion.
- The handoff changes the plan record, treats `draft` as approval, or omits the separate approval-evidence record or explicit absence.
