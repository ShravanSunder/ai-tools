---
name: plan-handoff
description: Use when preparing a plan, design, spec, or implementation brief for another agent, CLI, machine, or future session, especially when the user asks for a copy-paste prompt, handoff, next-agent context, or portable review packet.
---

# Plan Handoff

Package a plan so another agent can start with the right context instead of reconstructing it from chat history. The output must be useful both as a file artifact and as a copy-paste prompt shown in the response.

## Core Rules

- Prefer repo-local temp artifacts: `<repo-root>/tmp/plan-workflows/<yyyy-mm-dd>-<repo>-<branch>-<plan-slug>/`.
- Include the repo/worktree, branch, source plan path, line count, coverage, referenced code/docs, open questions, and exact requested task.
- Include security context when the plan touches auth, parsing, filesystem, network, secrets, subprocesses, plugins, MCP, CI, package scripts, dependencies, agents, or external services.
- If a plan file is available, read it end to end before packaging. Show `wc -l` and chunk coverage.
- Keep the handoff portable. Avoid local-only assumptions unless the target agent must inspect that local path.
- Show the copy-paste prompt in the final response and write the same prompt to a file.
- Do not make code changes unless the user separately asks to implement.

## Workflow

1. Resolve the repo root with `git rev-parse --show-toplevel` when possible.
2. Resolve the source artifact: plan/spec/design file, chat summary, or current task state.
3. If a source file exists, count lines and read the whole file in chunks before summarizing.
4. Inspect only the secondary code/docs needed to make the handoff grounded.
5. Create the temp artifact directory. Include repo, branch/worktree, and plan slug in the path.
6. Write at least:
   - `plan-handoff.md`
   - `copy-paste-prompt.md`
7. Print a TUI-friendly response with:
   - artifact path
   - coverage evidence
   - copy-paste prompt
   - what the next agent should inspect first

## Progressive Disclosure

Load `references/handoff-template.md` when writing the actual artifact or copy-paste prompt.

## Common Mistakes

- Handoff only says "continue from here" and omits source files.
- Chat response links the file but does not show the prompt the user can copy.
- The plan is summarized from headings without full-file coverage.
- The handoff hides uncertainty instead of listing exact open questions.
- The packet is overbroad and asks the next agent to understand the entire repo.
- Sensitive trust-boundary assumptions are omitted, forcing the next agent to invent a threat model.
