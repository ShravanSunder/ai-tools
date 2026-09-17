# PR outline views

this reference owns: the Change outline views for a wrap-up PR body
expected inputs: the current PR diff against the base
return: the filled outline views to paste under `## Change outline`, plus which view tokens were used
complete when: every included view traces to a diff hunk, and every omitted view has no hunk

The caller is `pr-description.md`. Pick the smallest view that makes the implementation clear. Place each view next to the short line it supports. Keep only the calls, files, types, states, and boundaries a reviewer needs.

- Include a view only when this diff actually changed that shape. Omit the rest. Do not fill the catalog for completeness.
- Prefer a `diff` fence when the surrounding shape already exists. Show the complete target shape when most of it is new, or when diff notation hides ownership or order.
- Do not use a bullet list of file paths as the outline.

- Show changed SQL tables, important columns and relationships, and endpoint request/response contracts:

```sql
-- sessions
--   id uuid pk
--   prompt text
POST /sessions { prompt } -> { id, status }
```

- Show key data structures / types:

```ts
type ExpandResult = {
  skillName: string
  prompt: string
}
```

- Show changed behavior as compact pseudocode:

```text
on(save)
  if content is unchanged
    return cached result
  write new content
  return fresh result
```

- Show file responsibility or a broad refactor as a shallow file tree:

```text
src/
├── commands/       # parses user actions
├── sessions/       # owns session state
└── transport/      # sends API requests
```

- Show UI structure as a component tree, including hooks, state, and package boundaries that matter:

```tsx
<SessionPage> (apps/example/src/routes/session.tsx)
  useSessionEvents()
  <SessionToolbar>
    <RunSkillButton> (packages/ui)
```

- Show runtime control flow as a call tree:

```text
submitForm
  createSession
    persistPrompt
    launchAgent
  navigateToSession
```

- Use `diff` when the point is what changed:

```diff
 <SessionPage>
   useSessionEvents()
   <SessionToolbar>
+    <RunSkillButton />
   <SessionTimeline>
+    <SkillResultCard />
```

```diff
 src/
 ├── commands/
+│   └── describe-pr.ts
 ├── sessions/
-└── transport.ts
+└── transport/
+    ├── client.ts
+    └── stream.ts
```

```diff
 submitForm
   createSession
     persistPrompt
+    expandSkillMention
     launchAgent
-  navigateToSession
+  navigateToSession
+    subscribeToEvents
```

```diff
 on(save)
-  write content
+  if content is unchanged
+    return cached result
+  write new content
+  invalidate cache
```

- Show the whole block when most of it is new:

```ts
function expandSkill(command: string): string {
  const skillName = command.slice(1)
  return `use the ${skillName} skill`
}
```

Map included views to receipt tokens: SQL/API → `sql-api`; types → `types`; file tree → `file-tree`; component tree → `component-tree`; call / control / data flow → `call-flow`.
