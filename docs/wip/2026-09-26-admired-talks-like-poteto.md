# What, why, and the real skill

Window: **2026-07-26 → 2026-09-26**. Transcript quotes for Lauren's Compile talk live in [2026-09-26-poteto-trust-talk-and-admired-skills.md](2026-09-26-poteto-trust-talk-and-admired-skills.md). This file is the steal sheet: **what** the move is, **why** it exists, **which skill actually teaches it**.

Skill link only if this repo does not already run that idea. "Already local" means do not open a new skill.

Tapes these rows come from:

| Tape | URL | Role |
|---|---|---|
| Lauren Compile/X · 38 min · 2026-09-21 | [X](https://x.com/poteto/status/2102050467505430555) | The bar |
| Lauren + Denis Maven · ~60 min · 2026-08-12 | [Maven](https://maven.com/p/e23d9c/how-cursor-turned-ai-agents-into-better-engineers) · [transcript](https://cho.sh/7D77B5) | Extras only |
| Dex Horthy · 56 min · 2026-09-22 | [YouTube](https://www.youtube.com/watch?v=H_1PygR7kwk) | Counter-case |
| Jesse Vincent (borderline) · 2026-09-25 | [YouTube](https://www.youtube.com/watch?v=c5AxRQJy1eA) | One process idea |

---

## Takeaways

### Trust is the constraint

| | |
|---|---|
| **What** | Leave the 1–5 babysit-every-chat trap by building trust infrastructure. Do not spawn 100 agents first. |
| **Why** | Without trust you get slop PRs, regressions, and angry reviewers. She never aimed at 2,000 PRs; that number is what happened after she stopped being the verifier. |
| **Skill** | None. Frame, not a skill. Dex agrees: more loops without judgment still decay. |

### Lock the shortcut (refuse the sharp knife)

| | |
|---|---|
| **What** | Design so the easy path is the right path. Make the mistake categorically impossible (types, import graph, architecture), then lint. Dune: conventions for **where code lives** and **how it is imported**. Renderer must not do work longer than 16 ms / 8 ms. |
| **Why** | Agents copy what they see and take shortcuts. Human-loved "sharp knife" abstractions (Matt's words, not hers) cut the agent. Thin-context PMs/designers/CEOs will ship into this repo. |
| **Skill** | [encode-lessons-in-structure](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/principle-encode-lessons-in-structure/SKILL.md) — second time you write the instruction, make it a lint / check / script and delete the text. Already local for How: [program-design](../../plugins/shravan-dev-workflow/skills/program-design/SKILL.md). Do not open Matt `codebase-design`; it is deep-module vocabulary, not this. |

### A repeated correction is garden work

| | |
|---|---|
| **What** | Delete copied debt. One paved path for most blessed patterns. Instinct is a lint rule to stop the bleeding — you do not have to clean every old instance today. Ban comments when agents use them as justification for band-aids. |
| **Why** | Workarounds spread like a virus. A comment explaining a bandage becomes the de facto pattern in days. Happy-if-copied is the test. |
| **Skill** | Same encode-lessons skill. Already local: review + lint. Do not port a comment-police skill. |

### Verification closes the loop without you

| | |
|---|---|
| **What** | The agent runs the **real** app, drives a user path, captures evidence. CLI lives **in the skill directory** so every session uses the same launcher. Correctness (checkout actually checks out) is not quality (perf / hill-climb). |
| **Why** | If you still watch every run, you are still the bottleneck. Formal methods (Lean / TLA+) are optional; verification skills get you far. Dex's name for the same demand: **back pressure** — a verifier the agent can run beats reading the diff harder. |
| **Skill (the gap here)** | [create-verification-skill](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/create-verification-skill/SKILL.md) — interviews the repo, writes Launch / Doctor / Drive / Evidence / Cleanup / Helpers; existing harness first, CDP only for web/Electron; one live run before handover. Extra leaf: [prove-it-works](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/principle-prove-it-works/SKILL.md) ("script the check when you can"). Already local: `implement-plan` already requires runtime proof on a runnable surface. |

### Feature map as maintained infra

| | |
|---|---|
| **What** | In-repo map of features from a **user** POV: what it is, how to reach it, how to drive it with the harness, gotchas. Automation / a maintain pass keeps it true. |
| **Why** | Agent can run the app and still guess. Origin: Slack screenshot of a UI sliver plus `???`. Stale maps lie; she treats that as ops, not a reason to skip. Matt files this under her outer loop; she files it under Control Glass. |
| **Skill** | [feature-map README](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/create-verification-skill/references/feature-map-example/README.md) — four H2s, last is `Driving it with <harness>`. [maintain-verification-skill](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/maintain-verification-skill/SKILL.md) — source readers + one live pass; do not edit product code to paper over a broken map. Cadence only if you ask. |

### Hill-climb one metric

| | |
|---|---|
| **What** | One measurable thing. Frozen harness. Before/after. Keep or revert. One commit per accepted win. |
| **Why** | Manual traces could not keep up with PR volume. A one-off perf fix does not leave a loop. |
| **Skill** | [hillclimb](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/poteto-mode/playbooks/hillclimb.md). The playbook does not mention Chrome; her origin story did. |

### Outer loop points; it does not write the code

| | |
|---|---|
| **What** | Grokbot **connectors** (Slack, Datadog, Sentry, PlanetScale) aggregate events and kick cloud agents / Cursor automations. She never named an "inner loop." You do not need a "company brain." |
| **Why** | The kitchen (locked repo, lint, verification, skills) is what writes good code. The outer loop only aims that kitchen at the next fire. |
| **Skill** | None. Already local: collaboration, Linear, automations as a category. Do not add an orchestrator. Optional later: HumanLayer [build-iterated-agentic-loop](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/humanlayer-skills/plugins/build-iterated-agentic-loop/skills/build-iterated-agentic-loop/SKILL.md) if you want a scheduled coding-agent workflow — not required to understand the talk. |

---

## Workshop extras (Lauren + Denis, not in the 38-min talk)

### Evals as unit tests for skills

| | |
|---|---|
| **What** | Coordinator writes a rubric. Sub-agent works in an isolated dir named so it cannot tell it is being scored. Cross-model judge. She ran the same loop on the verification skill itself. |
| **Why** | A skill you never score will rot. Hill-climb the score the way you hill-climb perf. |
| **Skill** | None worth opening. Local `skills-creation` pressure evals are for **authoring** a plugin skill, not scoring an app-control skill. Do the method; do not install a new skill for it. |

### Local first, then cloud

| | |
|---|---|
| **What** | Watch the agent drive the real app locally until that loop is boring. Then parallelize. |
| **Why** | Cloud-first 1–5 is expensive slop. You cannot see the tool calls. |
| **Skill** | Same create-verification-skill. Its interview starts from the local run command. |

### Atomic PR shape is a trust tool

| | |
|---|---|
| **What** | One small change so git can locate the defect. No line-count religion. A 40k-line merge is still a failure. Overnight auto-merge sits on hundreds of prior refactor PRs. |
| **Why** | Huge PRs hide the virus. Auto-merge without the refactor pile is a lie. |
| **Skill** | Already local: `implement-plan` slices + proof. No new skill. |

---

## Dex's counter-case (why her close is not free)

Agree with Lauren on verification / environment-over-headcount. Disagree on the closer: she wants the kitchen locked so "agents can just be free." He ran that as "trust the plan, skip the code."

### Do not skip the diff

| | |
|---|---|
| **What** | YOLO experiment: review the plan, skip the code, for months. Codebase became unusable. Every change regressed. "There will always be alpha in reviewing something." For now that something is still the **code**. |
| **Why** | A correct-looking plan plus green tests is the wrong training signal — locally correct, globally corrosive. Maintainability has no fast oracle (he names Slop Code Bench as the missing bench). |
| **Skill** | Already local: [implementation-review](../../plugins/shravan-dev-workflow/skills/implementation-review/SKILL.md) and [spec-program-review](../../plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md). The takeaway is the policy: do not turn those off because the spec looked good. |

### Humans own architecture

| | |
|---|---|
| **What** | Letting the model own a six-service design failed. Rebuild needed a human to hand-type the data architecture for two weeks. |
| **Why** | Models are not yet the architect. Specs are a **slider** (more determinism ↔ more adaptability), not a replacement for the diff or for How. |
| **Skill** | Already local: [program-design](../../plugins/shravan-dev-workflow/skills/program-design/SKILL.md), [spec-design](../../plugins/shravan-dev-workflow/skills/spec-design/SKILL.md). Main authors How. |

### Dumb zone

| | |
|---|---|
| **What** | Past ~40% of the context window, more tokens make the model worse. Compact on purpose. |
| **Why** | Dumping the world into context is not "more memory." It is the opposite of her locked, conventional codebase. |
| **Skill** | None. Judgment. Local skills already prefer progressive disclosure over stuffing. |

### Back pressure as a scheduled loop (optional)

| | |
|---|---|
| **What** | Verifiers the agent can run; overnight agents that review/fix before a human sees new work; a human stays **on** the loop. |
| **Why** | Factory loops without a sensor/controller just accelerate the YOLO failure. |
| **Skill** | Same create-verification-skill. If you later want a designed loop (set point / sensor / controller / actuator): HumanLayer [design-control-loop](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/humanlayer-skills/plugins/design-control-loop/skills/design-control-loop/SKILL.md). Do not install it to "have Dex." |

---

## Jesse (one idea)

| | |
|---|---|
| **What** | "Prove it works" on the real artifact. If it can be deterministic software, do not use an LLM. Tidy house: a messy env wastes tokens on "what world am I in?" |
| **Why** | Same as Lauren's verification + lock-down, encoded as process (plan / TDD / delete code written before tests) instead of architecture/lint. |
| **Skill** | prove-it-works and encode-lessons, already listed. Obra [verification-before-completion](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/obra-superpowers/skills/verification-before-completion/SKILL.md) is the same gate in different words — skip; local `implement-plan` already has it. Skip the Superpowers install walkthrough. |

---

## Open these (unique, not already local)

1. [create-verification-skill](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/create-verification-skill/SKILL.md) + [feature-map example](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/create-verification-skill/references/feature-map-example/README.md) + [maintain-verification-skill](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/maintain-verification-skill/SKILL.md)
2. [encode-lessons-in-structure](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/principle-encode-lessons-in-structure/SKILL.md)
3. [hillclimb](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/poteto-mode/playbooks/hillclimb.md)
4. [prove-it-works](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/principle-prove-it-works/SKILL.md) — only the "script the check" leaf

## Do not open

Already local: `program-design`, `spec-design`, `implement-plan`, `implementation-review`, `spec-program-review`, `practices-show-me-your-work`, `discuss-pathfinding`, the design/plan/review orchestrators.

Not the idea: Matt Copilot Day, `unslop`, autopilot/babysit/shipping, `codebase-design` as Dune, Superpowers install, Bend, Addy's unrecorded "masterclass," HumanLayer `show-me` (Matt demo'd it; not this bar).

---

## Looked, no takeaway at this bar

Matt Copilot Day (skills tour). Addy in-window: essays, no tape. steipete / Armin / shadcn / Dimillian / dzhng / blader / Readwise / Sentry: no operational talk. Pauline Compile: happened, no public recording.

Just outside the window (same density, not this month): Dex [factory keynote](https://www.youtube.com/watch?v=Ib5GBkD555M) (2026-07-23), Addy [own the outer loop](https://ai.engineer/talks/n97BCfyFIvw-engineer-future-is-person-who-is-able) (2026-07-17).
