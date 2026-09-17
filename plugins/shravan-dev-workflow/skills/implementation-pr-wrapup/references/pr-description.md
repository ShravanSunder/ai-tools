# PR Description

this reference owns: writing the GitHub PR body from the current diff
expected inputs: PR number or create-intent, base, head SHA, diff identity, existing body, related URLs only if already supplied, never-publish rules from `public-artifact-safety.md`
return: tmp markdown path, `included_views`, head SHA, `complete | partial | blocked`
complete when: the tmp file is the template below, filled, with only the views this diff needs

The caller owns when this runs, Mini Worker dispatch, mechanical parent checks, and Operator `gh pr edit`. Do not push, merge, claim ready, reply to comments, or run `gh pr edit`.

MUST load `public-artifact-safety.md` and return redactions or refuse-to-publish.
MUST load `pr-outline-views.md` and return the views used in Change outline.

- Write one tmp file under project `tmp/` or `/tmp`. No other edits.
- Copy the template. Keep `## Why the change`, `## Special things to note`, and `## Change outline` exact. Do not use Summary, Test plan, `## Why`, `## Notes`, or `## Outline`.
- Related links on the first line only when the packet already has URLs. Otherwise start at `## Why the change`.
- Open the diff to write Why. Stop and rewrite if Why is a title echo, a file list, "various fixes", or more than one sentence.
- Stop if Special things to note is empty, filler ("please review carefully"), or a restatement of Why.
- Omit unused outline views. No file-list changelog (`- path — note` as the outline). No screenshots, GIFs, HTML, or `.humanlayer/` paths.
- Stop and return `blocked` if head SHA or diff identity is missing, or public-artifact-safety forbids publish.

Fill this template. Brace text is the instruction. Drop any view whose fence you do not fill.

````markdown
[{link}]({url}) | [{link}]({url})

## Why the change

{Exactly one sentence explaining the problem this PR solves and what becomes possible after it ships.}

## Special things to note

- {1-3 reviewer-relevant warnings, migrations, constraints, deliberate omissions, or surprising decisions. Use `- None.` when there are none.}

## Change outline

{Smallest combination of the views below that explains this implementation. Prefer `diff` for an existing shape and a complete block when most of it is new. Do not include views that did not change. Order them so a reviewer can follow the change — files first, or a type / table / contract first. Write as one human to another.}

{short line of what this view shows}

```sql
{Changed SQL tables, important columns and relationships, and endpoint request/response contracts.}
```

{short line of what this view shows}

```ts
{Key data structures / types.}
```

{short line of what this view shows}

```diff
{Concise pseudocode for the changed behavior.}
```

{short line of what this view shows}

```diff
{Shallow file tree with changed responsibilities.}
```

{short line of what this view shows}

```diff
{Changed component trees, important hooks or state, and package boundaries.}
```

{short line of what this view shows}

```diff
{Changed call trees, control flow, or data flow.}
```
````

## Packet

```text
pr number or create-intent:
base:
head SHA:
diff identity:
existing body:
related URLs: <only those already supplied>
never-publish rules: <step-2 return>
```

## Receipt

```text
receipt: complete | partial | blocked
tmp path:
head SHA:
included_views: <subset of sql-api, types, file-tree, component-tree, call-flow>
stop condition: met | not met, with what remains
```

`complete` when Why is one sentence, notes are 1–3 bullets or `- None.`, Change outline has at least one view from the diff, unused views are omitted, and the file is public-artifact-safe.

`partial` when the file exists but Why is weak, notes are filler, a needed view is missing, or a leftover unused view remains.

`blocked` when diff identity or head SHA is missing, or public-artifact-safety forbids publish.
