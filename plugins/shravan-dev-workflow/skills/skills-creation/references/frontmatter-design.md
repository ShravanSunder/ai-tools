# Frontmatter Design

Design YAML/frontmatter as the trigger surface. Its job is to help the agent
decide whether to load the skill, not to teach the workflow.

This reference owns description wording, adjacent-skill boundaries, invocation
tradeoffs, and "why did this skill load?" diagnosis. Return a concise trigger
description and any adjacent-skill boundary that changes routing.

## Required Shape

```text
name: required; max 64 characters; lowercase letters, numbers, and hyphens
only; must match the parent folder name exactly.

description: required; max 1024 characters; action-oriented trigger phrase
that tells the agent when to invoke the skill.
```

## Invocation Controls

First decide whether the skill is model-invocable, user-invocable, or both.
Do not add platform-specific invocation-control frontmatter by default.
When a client-specific control is needed, route the exact encoding through
`references/platform-mechanics.md`.

## Good Description

A good `description`:

- starts with `Use when` unless the platform requires another shape;
- names the situation, symptom, user request, repo event, or failure that
  should trigger the skill;
- uses searchable words the user, codebase, docs, or logs actually use;
- includes a succinct why only when it improves routing;
- names adjacent boundaries only when another skill is easy to confuse with it;
- stays compact because this text is always-visible context;
- avoids workflow steps, tool lists, implementation detail, and generic virtue.

The description should survive both true and near-miss prompts. If it loads for
everything, it is not a trigger. If the human must remember too much to invoke
it, the cognitive load is too high.

## Description Pattern

```text
Use when <observable trigger>, especially <specific symptoms or decisions>,
so the agent <succinct payoff>. Not for <adjacent boundary>.
```

Use the payoff and boundary clauses only when they sharpen routing. A short
description with a clear trigger is better than a complete sentence that
summarizes the workflow.

## Bad Shapes

- Workflow summary: "Reads files, checks X, updates Y, and reports Z."
- Generic virtue: "Helps write better code."
- Tool list: "Uses grep, tests, and GitHub."
- Ownerless umbrella: "Use for releases" when several release skills exist.
- Negative-only routing: "Do not use when..." without a strong positive load
  condition.

## Repair Moves

- Wrong invocation: sharpen the loading condition or make the skill
  user-invocable.
- Over-broad trigger: add adjacent-skill boundaries or concrete symptoms.
- Under-triggering: add user words and repo/code signals.
- Workflow summary: move process detail into `SKILL.md`.
- Hidden payoff: add a short "so that..." phrase only if it improves routing.
