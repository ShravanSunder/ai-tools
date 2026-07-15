---
name: plan-handoff
description: Use when packaging an existing implementation plan for another agent, CLI, machine, or future session, especially when the user asks for a copy-paste prompt, next-agent context, or portable plan packet.
---

# Plan Handoff

Package an existing implementation plan so another agent can review, execute, or continue planning without reconstructing the conversation. This is a portability boundary, not a completion boundary: handoff means the plan context is transferable, not that the plan is approved or implemented.

## Core Rules

- Use only when an implementation plan or plan artifact exists.
- If the source is spec/design context without an implementation plan, use `spec-handoff` for portability or `plan-creation-swarm` to write the plan.
- If the source is branch, diff, changed files, commits, validation, or blocker evidence, use `implementation-handoff`.
- Prefer repo-local temp artifacts: `<repo-root>/tmp/plan-workflows/<yyyy-mm-dd>-<repo>-<branch>-<plan-slug>/`.
- Include the repo/worktree, branch, source plan path, line count, coverage, referenced code/docs, open questions, and exact requested task.
- Include the requirements/proof matrix (path or excerpt) or the plan's stated compact proof line, plus evidence sources, freshness guards, proof layers, split triggers, open proof gaps, and the parent-verification rule for any downstream subagent/reviewer/driver evidence.
- Include security context when the plan touches auth, parsing, filesystem, network, secrets, subprocesses, plugins, MCP, CI, package scripts, dependencies, agents, or external services.
- If a plan file is available, read it end to end before packaging. Show `wc -l` and chunk coverage.
- Keep the handoff portable. Avoid local-only assumptions unless the target agent must inspect that local path.
- Show the copy-paste prompt in the final response and write the same prompt to a file.
- Do not make code changes unless the user separately asks to implement.

## Workflow

1. Resolve the repo root with `git rev-parse --show-toplevel` when possible.
2. Resolve the source plan artifact or plan packet.
   - If no implementation plan exists, route to `spec-handoff` or `plan-creation-swarm` instead of pretending a plan exists.
3. If a source file exists, count lines and read the whole file in chunks before summarizing.
4. Inspect only the secondary code/docs needed to make the handoff grounded.
5. Create the temp artifact directory. Include repo, branch/worktree, and plan slug in the path.
6. Write at least:
   - `plan-handoff.md`
   - `copy-paste-prompt.md`
7. Print a TUI-friendly response with:
   - artifact path
   - full clickable artifact links (absolute path + line)
   - coverage evidence
   - copy-paste prompt
   - what the next agent should inspect first

## Progressive Disclosure

Load `references/handoff-template.md` when writing the actual artifact or copy-paste prompt.

## Common Mistakes

- Handoff only says "continue from here" and omits source files.
- Chat response links the file but does not show the prompt the user can copy.
- Design/spec context is mislabeled as an existing implementation plan.
- The plan is summarized from headings without full-file coverage.
- The handoff hides uncertainty instead of listing exact open questions.
- The packet is overbroad and asks the next agent to understand the entire repo.
- Sensitive trust-boundary assumptions are omitted, forcing the next agent to invent a threat model.
- The requirements/proof matrix is omitted, forcing the next agent to infer how the plan will be proven.
- The handoff drops evidence sources, freshness guards, or parent-owned verification, letting the next agent treat delegated evidence as completion.
