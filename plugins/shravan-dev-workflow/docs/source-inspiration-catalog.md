# Source Inspiration Catalog

Lite maintainer map for `shravan-dev-workflow` design. **Not** a runtime skill reference — do not load during normal spec, plan, review, or implementation.

## Full admired-source index (canonical)

Detailed per-skill provenance, upstream pins, and date-pinned From/To changelog compare live in the **`ai-dev-skills`** meta-repo:

`/Users/shravansunder/Documents/dev/open-source/ai-dev-skills/`

| Index | Path in ai-dev-skills | Use for |
|-------|----------------------|---------|
| Local skill → upstream | `docs/my-ai-tools/` | Which admired sources a plugin skill borrows |
| Upstream → local | `docs/repo-index/` | What we care about in each upstream tree |
| Date-pinned history | `docs/repo-index-changelog/` | Cheap compare between two submodule SHAs |
| Maintenance contract | `AGENTS.md` | How to bump submodules and keep indexes in sync |

**Maintain both:** keep this file as a short in-plugin reminder; put durable path-level mappings, pin SHAs, and bump notes in `ai-dev-skills`. When they diverge, prefer updating `ai-dev-skills` first, then refresh the lite tables here if the high-level preserve/avoid story changed.

## Source Trees To Preserve (lite)

| Source tree | Preserve | Narrow / avoid |
| --- | --- | --- |
| Pstack / poteto | `show-me-your-work` for decision/action trails, `how` for architecture mental models, `why` for source coverage and confidence calibration, `poteto-mode` for playbook routing, verified iterations, and parent-owned subagents | Do not copy Cursor-specific commands, model names, anti-planning stance, blanket autonomy, or style micro-rules |
| Matt Pocock skills | `grill-me`, `grill-with-docs`, domain modeling, codebase design, debugging/TDD, handoff patterns | Do not treat discussion prompts as a substitute for source-backed spec creation |
| Addy Osmani agent skills | lifecycle taxonomy, interview/idea/spec/doubt/source-driven development, ADR/docs and observability ideas | Use as taxonomy and selected source, not a wholesale workflow |
| Dimillian skills | review swarms, bug-hunt swarms, skill audit, batch refactor orchestration | Narrow Apple/UI-specific skills to macOS/iOS workflow contexts |
| Sentry skills | `agents-md`, skill writer/scanner, security review, GitHub Actions security review, PR iteration patterns | Avoid Sentry-domain-specific process unless the local workflow has the same domain |
| Steipete agent scripts | deep review, maintainer orchestration, skill cleanup, source-first debugging | Keep selected mechanics only; the full tree is personal/tool-specific |
| Curated PR/adversarial review materials | material finding bar, false-green and silent-failure review lenses, type/test/comment review lenses | Do not promote broad curated catalogs as general workflow sources |
| Codex curated security skills | threat modeling, security best practices, security ownership map | Route security-heavy work to `ops-security-review`; do not dilute normal review lanes |
| OpenClaw ACPX / ACP | structured cross-agent communication with Claude, Gemini/`agy`, Codex-compatible ACP agents, queues, typed events, and review transport | Do not use it for normal discussion, native Codex thread control, or implementation ownership |

Explicitly narrowed sources: `cursor-agent-skills` appears to duplicate Addy's pack for this repo's purposes, so keep Addy as the named source unless provenance matters. Broad curated skill catalogs are low value here except for review and security subsets.

Upstream checkouts for the trees above are submodules under `ai-dev-skills` (for example `cursor-plugins`, `mattpocock-skills`, `obra-superpowers`).

## Current Local Mapping (lite)

| Workflow area | Useful sources | Local adaptation |
| --- | --- | --- |
| Discussion requirement capture | Pstack `show-me-your-work`, Matt Pocock discussion/domain modeling, Addy interview/spec/doubt patterns, Steipete owner briefs | Split discussion surfaces by job; capture material interjections and session requirements; avoid one ritual forcing question |
| Spec creation | Pstack `how`, Addy source/spec-driven patterns, Matt Pocock domain modeling | Reflect top-level target requirements before swarms; keep current state separate from target state |
| Plan creation | Obra `writing-plans`, Pstack proof/boundary principles, Codex subagent guidance | Create DAG-shaped vertical slices with valuable proof and subagent suitability |
| Implementation execution | Pstack `poteto-mode`, Obra `subagent-driven-development`, existing controller packets | Parent-owned subagent lifecycle, evidence verification, integration, and proof claims |
| Review transport | OpenClaw ACPX / ACP, local review swarms, Claude/Gemini structured feedback | ACPX is external review transport; parent reducer verifies all candidate findings |
| Security review | Codex curated security skills | Route to `ops-security-review`; keep normal review lanes lightweight |

For per-skill borrowed/do-not-copy detail, open the matching file under `ai-dev-skills/docs/my-ai-tools/shravan-dev-workflow/`.

## Maintenance Rules

- Keep this catalog selective and lite.
- Do not copy upstream skill prose into local skills.
- Do not cite source inspiration as proof that local behavior works.
- When a workflow change is implemented, add pressure scenarios that prove the local adaptation prevents the observed failure.
- Path-level provenance, submodule pins, and bump history: update `ai-dev-skills` (`docs/my-ai-tools/`, `docs/repo-index/`, `docs/repo-index-changelog/`).
