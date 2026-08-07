---
name: implementation-handoff
description: Use when packaging implementation state for another agent, reviewer, CLI, or future session at any stage of work, especially when the user asks for a copy-paste blurb, reviewer prompt, Claude/Gemini/Codex handoff, unfinished-work handoff, or post-implementation review packet.
---

# Implementation Handoff

Package actual implementation state so another agent can review, continue, or audit the work without relying on chat history. This is an evidence packet, not a status update: preserve facts, claims, risks, validation, and the exact next decision. The packet's spine is its implementation proof section; a handoff without proof forces the reviewer to reconstruct it.

## Core Rules

- Use only when implementation state exists: branch/diff/changed files, commits, failed commands, validation evidence, blocker evidence, or implementation risk.
- If no implementation state exists, use `plan-handoff` instead.
- Works at any implementation stage: `in-progress`, `pre-review`, `post-review`, or `blocked`.
- Prefer repo-local temp artifacts: `<repo-root>/tmp/review-handoffs/<yyyy-mm-dd>-<repo>-<branch>-<slug>/`.
- Always write a file artifact and also print the copy-paste prompt in the response.
- Ground the handoff in current repo state: branch, diff, commits, changed files, validation commands, and known risks.
- Include implementation proof: requirements/tasks claimed complete, commands and exit codes, red/green evidence or exception, skipped layers, blockers, and split/replan status.
- Preserve security state when the implementation touches sensitive surfaces: changed trust boundaries, fixed findings, unvalidated risks, security proofs, report paths, and accepted risks.
- Separate proven facts from claims, guesses, and unfinished work.
- Do not run reviewers automatically. For `pre-review` or post-remediation review, classify `general-domain | runtime-skill-package`, prepare the complete admission packet, and recommend exactly `review-implementation` for general-domain work or `skills-creation` for runtime skill-package work; never perform or launch review here.
- If the handoff asks another agent to review only, the prompt must say "do not edit files".
- IF the implementation or review state derives from an extant completed canonical plan, load `../../shared-references/canonical-implementation-plan.md` to validate and preserve that plan without re-authoring or approval, and return the unchanged complete tuple, result-specific payload, separate approval-evidence record or explicit absence, and any blocking discrepancy for the handoff packet. Otherwise record `plan identity: none` plus the non-plan governing request or ticket identity and do not fabricate a plan tuple.

## Workflow

1. Identify stage:
   - `in-progress`: partial changes exist and another agent may continue.
   - `pre-review`: implementation is believed ready for review.
   - `post-review`: review feedback was addressed or needs another pass.
   - `blocked`: work cannot continue without a decision or missing evidence.
2. Inventory current state:
   - repo root, branch/worktree, base/head when available
   - `git status --short`
   - changed files and diff summary
   - commits since base when relevant
   - plan/ticket/request source
3. Inspect enough code/tests/docs to make the handoff accurate.
4. Preserve the returned canonical tuple and approval evidence when present, then bind implementation proof to that exact identity.
5. Create the temp artifact directory.
6. Write:
   - `implementation-handoff.md`
   - `copy-paste-prompt.md`
7. Print a TUI-friendly response with:
   - artifact paths
   - full clickable artifact links (absolute path + line)
   - stage
   - changed files
   - validation evidence
   - exact copy-paste prompt

## Stage Guidance

- `in-progress`: include what changed, what is incomplete, what not to redo, and how to continue safely.
- For an approved canonical `draft` with incomplete implementation, recommend `implement-plan`; for `revision-requested`, `blocked`, absent approval, or a tuple discrepancy, preserve the exact route and do not recommend execution.
- `pre-review`: include diff range, changed files, tests run, review focus, and known risks.
- `post-review`: include reviewer feedback addressed, remaining disputed items, and what needs re-checking.
- `blocked`: include blocker evidence, failed commands, attempted fixes, and exact decision needed.

## Progressive Disclosure

- MUST load `references/handoff-template.md` and return the filled `implementation-handoff.md` artifact with current implementation evidence and preserved governing authority.
- MUST load `references/copy-paste-prompts.md` and return the context-free manual Claude/Gemini/Codex reviewer or continuation prompt with preserved governing authority, implementation proof, gaps, and exact next route.

## Common Mistakes

- Producing a vague "please review this" note without diff range or changed files.
- Producing an implementation handoff before implementation state exists.
- Hiding test failures or calling unverified work done.
- Giving a reviewer prompt that does not say read-only.
- Forgetting to print the copy-paste prompt in chat.
- Asking the next agent to infer current state from branch name alone.
- Omitting changed trust boundaries or unvalidated security risks from a handoff.
- Omitting implementation proof and forcing the reviewer to reconstruct proof from chat or branch state.
