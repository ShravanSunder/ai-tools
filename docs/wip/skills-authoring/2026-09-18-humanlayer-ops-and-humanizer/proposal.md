# HumanLayer ops + Humanizer: how writing and views land

Status: **draft for acceptance.** Not a skill-file commission. Do not edit runtime skills from this document until the user picks a slice.

Pins (ai-dev-skills `a7f89f7` / 2026-09-17):

| Submodule | Pin | Cared-about path |
| --- | --- | --- |
| `humanlayer-skills` | `ca7c808` | `plugins/visual-pr/skills/visual-pr/`, `plugins/show-me/skills/show-me/` |
| `blader-humanizer` | `9862685` | `SKILL.md` |

## What is already decided

Visual PR is **not** a new skill. It already landed on `implementation-pr-wrapup` (`origin/main` `fba79dd`, changelog 2026-09-17): Why / Special notes / Change outline, Mini Worker draft, `pr-outline-views.md`, Operator `gh pr edit --body-file`. Spec history: `docs/wip/skills-authoring/2026-09-17-pr-wrapup-visual-description/proposal.md`. Do not reopen that run.

`show-me` is already the inspiration for `presentation-tui` / `presentation-webui` (smallest-view media menu). Wrap-up does **not** load those skills at runtime. GitHub bodies use `references/pr-description.md` + `references/pr-outline-views.md`, not chat HTML/Mermaid/screenshots.

Humanizer is **open**. Index gap: named skill vs docs/PR prose pass vs index-only. This document closes that gap with a recommended shape.

## The actual question

Humanizer is a 25-pattern rewrite engine. Three ways to integrate it:

| Option | What it is | Verdict |
| --- | --- | --- |
| A. Common skill every agent loads | New plugin skill in every session, always-on rewrite of chat | **No.** Fights presentation (headings, tables, mermaid, trees). Burns tokens on code/schema. Index already says avoid always-on. |
| B. Codex Router vendor | `scripts/sync-skills.py` copies the upstream `SKILL.md` blob into the plugin, other files `Read` it | **No.** That script exists to pin **our** canonical skill from another repo (`agent-collaboration`). Humanizer is third-party inspiration; repo rule is adapt, not wholesale copy. A 375-line blob is the wrong load for wrap-up Mini Workers. |
| C. Shared reference + thin explicit skill | Compact `shared-references/reader-prose-rewrite.md`; consumers load it when they write **reader prose**; optional user-invocable skill for “rewrite this” | **Yes.** Matches how we already share `code-review-feedback-handling.md` and presentation baselines. HumanLayer’s `visual-pr/references/show-me.md` is a **duplicate file**; we do not copy that pattern. |

HumanLayer visual-pr inlines a copy of show-me so a name-only skill can render outlines without invoking show-me (`disable-model-invocation: true`). Locally we already have the better version of that idea: **named shared-references**, one owner, many consumers, no duplicate prose.

## Recommended shape

```text
blader/humanizer SKILL.md (pin only)
        |
     adapt judgment, do not vendor the file
        v
shared-references/reader-prose-rewrite.md
  structural tells (staging, rhythm, inflation, leftover chat)
  keep every supported claim; no invented facts
  voice-sample overrides patterns (including dashes)
  file vs embedded return
  never rewrite code, YAML, paths, diffs, trees
        |
        +-- docs-maintain (file mode on durable human docs)
        +-- implementation-pr-wrapup pr-description lane
        |     (embedded: Why + Special notes only; Change outline untouched)
        +-- docs/changelog authoring (embedded, after the facts are set)
        +-- optional thin skill `docs-rewrite-voice`
              (user said "humanize this" / "this reads like a chatbot")
```

Do **not** load this from `presentation-*`, spec/program design, review packets, or JSONL work trails.

### Shared reference contract (when implemented)

Name: `plugins/shravan-dev-workflow/shared-references/reader-prose-rewrite.md`.

Teach, do not dump Wikipedia’s article:

1. Mark strongest tells first (not-X-but-Y, one-line closers, staged openers, arguing with no one, leftover chatbot wrappers).
2. Rewrite for one reader. Every kept sentence adds information.
3. Keep claims, names, numbers, dates, quotes. Ask or simplify if a sentence needs a fact you do not have.
4. If the user supplied a voice sample, match it; it wins over dash/triad rules.
5. Embedded mode (PR Why/Notes, changelog sentence): return only the rewritten prose.
6. File mode (`docs-maintain`): write final text; leave fences, inline code, commands, paths, YAML, links alone.
7. Stop: code, commands, schemas, skill YAML, Change outline views, mermaid, work-trail JSONL.

Do not copy Humanizer’s before/after catalog wholesale. Keep a few local good/bad signals. Point provenance at the pin.

### Optional named skill

Only if we want a user-visible “humanize this file / this PR body” trigger.

- Name: `docs-rewrite-voice` (docs family, not a new ops skill).
- Description starts `Use when...` rewriting reader prose for AI tells.
- SKILL.md is thin: load the shared reference, pick file vs embedded vs pasted, stop on code.
- Not in the default “always check” featured list. Not loaded by orchestrators unless the user asked for a rewrite.

Until that skill exists, `docs-maintain` is the file-mode owner and wrap-up is the PR-body owner.

## Show-me: improvements, not a third copy

Read of `plugins/show-me/skills/show-me/SKILL.md` at `ca7c808` vs current presentation skills:

| Show-me idea | Local home | Action |
| --- | --- | --- |
| Smallest view that makes the point | `presentation-webui` media table + before-send medium-fitness | Keep. Optional pressure if agents still dump every medium. |
| Diff for existing shape; full block when new | wrap-up `pr-outline-views.md` (shipped) | Keep. Humanizer must not rewrite those fences. |
| Trees, pseudocode, mermaid, HTML file + `open` | presentation owns chat; wrap-up forbids HTML/screenshots | Do not add `presentation-files` / HTML walkthroughs in this work. Peekaboo owns on-screen UI proof. |
| `disable-model-invocation` | we want wrap-up and presentation **model-invocable** | Do not import that trigger. |

Do **not** extract a shared `show-me.md` for wrap-up and presentation to both load. The GitHub subset and the chat menu have different stop conditions (no HTML, no mermaid-as-PR-body, no screenshots). Two teaching files with the same *judgment* (smallest view, prefer diff) is cheaper than one file with a pile of IF destination branches.

Later, if wrap-up’s outline views and presentation’s trees drift, extract `shared-references/structural-change-views.md` (diff / file tree / call tree / types only). Not now.

## Sequencing

Wrap-up visual description is **done**. Humanizer is a new slice, not a silent edit of that PR.

```text
slice 1   reader-prose-rewrite shared reference
          + docs-maintain MUST-load when rewriting durable human prose
          + provenance: my-ai-tools/docs-maintain.md + wrap-up row
          + close blader-humanizer open gap

slice 2   wrap-up pr-description.md cites the shared reference
          for Why + Special notes only (embedded)
          Change outline / pr-outline-views.md stay out of the rewrite
          pressure: not-X-but-Y Why vs untouched diff fences

optional  thin docs-rewrite-voice skill + pressure scenarios
          (can merge with slice 1 if you want a user-invocable entry)
```

Default: slice 1 then slice 2. Combining 1+2 is fine if you want one wrap-up follow-on PR; it is still a new skills-creation run, not a reopen of #78.

## Proof (when a slice is commissioned)

- Pressure: wrap-up Why is a not-X-but-Y closer → rewrite; Change outline diff fences unchanged.
- Pressure: docs-maintain rewrite does not touch code fences or YAML frontmatter.
- Pressure: presentation response is not forced through humanizer.
- Near-miss: “always load humanizer” / “vendor SKILL.md with sync-skills.py”.
- Command: `pnpm --dir tests/skills run test:evals` on the new/updated scenario ids only.

## Non-goals

- New `visual-pr` or `show-me` skill.
- Vendoring Humanizer or HumanLayer `SKILL.md` via `sync-skills.py`.
- Always-on rewrite of all agent chat.
- HumanLayer `.humanlayer/tasks/` paths, HTML PR walkthroughs.
- Applying humanizer to code, commands, schemas, or work-trail JSONL.
- Editing `orchestrator-implementation-goal` for this.
- Bumping HumanLayer/Humanizer pins in this plan.

## Acceptance needed from you

Strike or keep:

1. Option C (shared reference + optional thin skill). Not A, not B.
2. Wrap-up visual is already shipped. Humanizer is a follow-on: first the shared reference + docs-maintain, then Why/Notes only.
3. No new `show-me` skill; presentation and wrap-up keep separate view teaching.
4. Named `docs-rewrite-voice` is optional and off the featured list unless you want it in the first humanizer slice.
