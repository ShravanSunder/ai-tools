---
name: implementation-handoff
description: Use when packaging implementation state for another agent, reviewer, CLI, or future session at any stage of work, especially when the user asks for a copy-paste blurb, reviewer prompt, Claude/Gemini/Codex handoff, unfinished-work handoff, or post-implementation review packet.
---

# Implementation Handoff

Package actual implementation state so another agent can review, continue, or audit the work without relying on chat history.

## Core Rules

- Works at any stage: `planned`, `in-progress`, `pre-review`, `post-review`, or `blocked`.
- Prefer repo-local temp artifacts: `<repo-root>/tmp/review-handoffs/<yyyy-mm-dd>-<repo>-<branch>-<slug>/`.
- Always write a file artifact and also print the copy-paste prompt in the response.
- Ground the handoff in current repo state: branch, diff, commits, changed files, validation commands, and known risks.
- Separate proven facts from claims, guesses, and unfinished work.
- Do not run reviewers automatically. This skill prepares the packet; `implementation-subagent-review` or a manual Claude/Gemini/Codex paste can consume it.
- If the handoff asks another agent to review only, the prompt must say "do not edit files".

## Workflow

1. Identify stage:
   - `planned`: intended implementation slice exists but work has not started.
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
4. Create the temp artifact directory.
5. Write:
   - `implementation-handoff.md`
   - `copy-paste-prompt.md`
6. Print a TUI-friendly response with:
   - artifact paths
   - stage
   - changed files
   - validation evidence
   - exact copy-paste prompt

## Stage Guidance

- `planned`: focus on intended files, constraints, and first action. Prefer `plan-handoff` if no implementation state exists.
- `in-progress`: include what changed, what is incomplete, what not to redo, and how to continue safely.
- `pre-review`: include diff range, changed files, tests run, review focus, and known risks.
- `post-review`: include reviewer feedback addressed, remaining disputed items, and what needs re-checking.
- `blocked`: include blocker evidence, failed commands, attempted fixes, and exact decision needed.

## Progressive Disclosure

- Load `references/handoff-template.md` when writing the artifact.
- Load `references/copy-paste-prompts.md` when producing a manual Claude/Gemini/Codex reviewer or continuation prompt.

## Common Mistakes

- Producing a vague "please review this" note without diff range or changed files.
- Hiding test failures or calling unverified work done.
- Giving a reviewer prompt that does not say read-only.
- Forgetting to print the copy-paste prompt in chat.
- Asking the next agent to infer current state from branch name alone.
