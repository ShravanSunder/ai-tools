# Voice reference and proof-slice updates

Status: **implemented in this worktree on user direction, 2026-09-22.** Proposal review was not run. This file is the commission record for the edits on `voice-and-proof-slices`.

Worktree: `/Users/shravansunder/dev/ai-tools.voice-and-proof-slices`. The main checkout at `/Users/shravansunder/dev/ai-tools` stays on `main`. Do not move that checkout.

## What landed here

| Skill | Change |
| --- | --- |
| `docs-maintain` | Loads `shared-references/humanizer.md` in file mode when rewriting human sentences. Fences, YAML, commands, and paths stay. |
| `implementation-pr-wrapup` | Same reference, embedded mode, for Why and Special notes only. Change outline fences stay. |
| `skills-creation` | Same reference, file mode. The proposal load is on the design step. The `SKILL.md` body and teaching-reference load is on Implement, where those files are written. The YAML description stays with `frontmatter-design`. |
| `program-design` | Illegal state is unrepresentable or rejected at the trusted entry. No test path or red/green step. |
| `plan-implementation` | Independent oracle, project layer names, property versus example, keep/repair/remove with a removal gate. |
| `implementation-review` | Flags a tautological oracle, a mock call treated as the behavior, and a test that cannot fail for the claim. |

`implement-plan` was not edited. `research-swarm` is still the later run. No `docs-rewrite-voice` skill.

Plugin version in this branch: `2.21.0`.

## Left out

- Vendoring the whole Humanizer skill. The shared file is the extract at pin `9862685`, version 3.0.0.
- Presentation baseline edits.
- Cherry-picks from the old skill branches.
- Live agent pressure runs. Scenarios are added; the fake or live eval was the proof still to run.
