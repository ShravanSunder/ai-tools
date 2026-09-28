# Ideas from Lauren's talk, and what to learn them from

Spoken ~38 min recording: [x.com/poteto/status/2102050467505430555](https://x.com/poteto/status/2102050467505430555). Tweet context (not spoken): she posted it after missing Cursor Compile London; tweet title is 2,500 PRs; Matt said watch at 2x.

| | |
|---|---|
| Speaker | Lauren Tan. Handle: potato with an E — [@poteto](https://x.com/poteto) |
| Job | Grokbot at SpaceX AI. Before that Cursor. She spent time on the **React team** before Cursor (2:49). |
| Opening | "So last month I did something pretty crazy. I shipped 2000 pull requests to production." (0:09–0:13) |
| Later | She never set out to ship 2,000 a month (4:24). That was not a goal. |
| pstack pin | `ecc249f` at `/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack` |

ASR cleaned here: hill-climb, heap snapshots, pstack, Grokbot, Dune, Bugbot, tech debt, poteto. Raw ASR said PSNAC / RockBot / June / heat snapshots / he'll climb.

Each section is one idea. Transcript first. Skill link only if this repo does not already run that idea.

Matt Pocock watched the same talk and named three things that felt novel. His cut is below, in his words, then mapped onto what she actually said. He is a second voice.

---

## Matt's cut: what felt novel

### 1. Lock down your agents

Matt: humans like *sharp-knife* abstractions — powerful, but you can cut yourself. She says agents perform much better in extremely locked-down environments. Abstractions are designed so they cannot screw up, and lint rules enforce it. They built Dune to keep the agent on track. That helps agents without a large context window.

What she said: she never used "sharp knife." The easy path / shortcut *is* the right path (19:02–20:03). The perfect agent codebase is "so locked down" it is annoying for humans, and "even innocent-looking patterns are just forbidden" (21:59–22:52). Grokbot is "almost impossible to write bad code" so "even an agent with not a lot of reasoning" writes good code (30:38–32:34). Lint instinct when a weed appears (25:13–26:38). Thin context is hers: designers, PMs, CEOs ship; Dune is for "agents… that have very minimal context."

His added contrast is the useful one: the human-loved sharp knife is the thing she is refusing.

**Learn it from:** the Dune / encode section below. Local [program-design](../../plugins/shravan-dev-workflow/skills/program-design/SKILL.md) already owns How.

### 2. Create verification infrastructure

Matt: to trust any agent you either sit and watch it *or* it provides evidence of improvement. Custom CLIs that drive the app and measure performance; make the app "factory ready" — deployable so the agent can mess about with it.

What she said: the 1–5 trap is babysitting **chats** (5:27–6:44). Verification is how you leave it (6:51–8:37). Control Glass: a CLI *inside the skill directory* so every session launches, drives, and collects traces the same way (8:37–10:16). Hill-climb: the agent runs the app, takes the trace, finds the hotspot, improves automatically (3:40–4:14). Checkout button: does it actually check out the cart (12:33–13:20).

"Factory ready" is his gloss. She said: run the real app, CDP, traces, heap snapshots, empirical evidence the performance bar is met.

**Learn it from:** [create-verification-skill](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/create-verification-skill/SKILL.md). Prefer an existing harness; CDP is the web/Electron fallback. If you want the extra leaf "script the check when you can," that is [prove-it-works](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/principle-prove-it-works/SKILL.md) — local `implement-plan` already requires runtime proof.

### 3. Feature maps

Matt: her factory (what she calls an *outer loop*) needs the agent to turn vague bug reports into fixes. They built a feature map, kept in sync via automations. He usually warns against this kind of doc. Worth it *if* it enables new behavior.

What she said: feature map is part of Control Glass, not the outer loop. Origin is a Slack screenshot — "a very small slice of the UI and just like three question marks" — the agent could run the app and still guess (10:16–12:33). Stored in the skill directory. "We have an automation that maintains this feature map." CLI + map = control the app *and* understand user requests. Control skills became "more or less critical infrastructure… we constantly maintain it."

Outer loop is later (32:34–35:15): Grokbot **connectors** (Slack, Datadog, Sentry, PlanetScale), then auto-kicking cloud agents. Matt fused map and outer loop because they meet at "vague incoming report."

**Learn it from:** [feature-map example](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/create-verification-skill/references/feature-map-example/README.md) (four H2s: Sub-features, How to get to it, `Driving it with <harness>`, Gotchas; `search.md` is one filled Notes example) and [maintain-verification-skill](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/maintain-verification-skill/SKILL.md) (source readers + one live pass; cadence only if asked).

---

## Trust is the constraint, not agent count

**What she said.** Open (0:09–0:28): last month, "pretty crazy," 2,000 PRs to production. A lot of how she ships is through trust — "how I can trust my agents to produce high quality work even when I'm not there." Thesis (0:32–0:51): set the environment up well and you get something that looks like a personal or team software factory, high-quality code at much greater rates.

She did not set out to ship 2,000 a month (4:24–4:32). Looking back, every skill, tool, and codebase change "laddered up to this idea of trust" (4:32–4:42). She is on a **productivity chart** here (4:14): "you can really see that my productivity has skyrocketed." After the bottleneck line (4:42–5:11):

> I am the bottleneck and I need to be able to take all the knowledge that I have as an engineer and impart them into my team of agents so that I didn't need to be the blocker for everything.

Then: "you can clearly see that it's paid off."

**The 1–5 bucket (5:13–6:44).** She asks where you start, then points at a slide: "When I started, obviously, I was in this category… in the one to one to five range." Babysit every chat, constantly course-correct, intervene. "If you're not there, basically nothing happens, **and** the agents do the wrong thing." Hardest phase to leave. You cannot jump to "something more like a hundred" without trust. Spawn a hundred anyway and "you're just going to get a ton of sloppy requests and a bunch of regressions and a bunch of bugs shipped and no one's going to be very happy."

**Same slide later (35:15–36:01).** "If we kind of zoom out again and go back to this graph." She names it the trust graph only here. Spend time on the pieces that let you "ascend the trust graph," then you can parallelize and empower every builder.

Close (36:01–38:00): she hits the wrong slide first — "sorry not that piece but this piece." Takeaway: "if there's only one thing you take away from my talk it should be this slide" — "these are the activities that will help you build up towards a high trust environment." Do the layers, think about code quality in skills, and "you trust the environment so much that your agents can just be free." Personalized: she has spent a lot of time on this "for Grokbot's codebase, for example." "This is really the secret, right? Well, it's not really a secret. It's a lot of hard work." Handle: potato with an E. Build your own Michelin kitchen.

No skill to open. This is the frame.

---

## Kitchen, not factory

**What she said (0:57–2:03).** She is not a fan of "software factory." Michelin kitchen is better. Not mass-producing on an assembly line. The work "looks very creative. It's the act of building a product and it's art in some sense."

With agents "we're not cooking the individual components that go into the product anymore, we're still responsible for the **final outcome**." Line cooks, sous chefs, equipment, training, dishwashers, "the ratio… of line cooks to dishwashers" — "all of these ingredients go into making the **final product**."

**Second pass (30:38–32:34).** Layer recap first: codebase, lint rules, diagnostics, rules, Bugbot, skills — "these layers come together and provide you a lot of trust." Then imagine the Grokbot codebase: "super locked down… almost impossible to write bad code," so even an agent with very little context / "not a lot of reasoning" writes good code. She blends the metaphor: "Going back to my example about the **Michelin factory**… we're setting up our agents, our bots with skills and tools… we're training them, we're setting up our kitchen" so they "do the right thing by default." If a cook or dishwasher keeps tripping, "of course we need to **fix that**… problem solve and ensure that… others don't trip as well." Kitchen is dangerous; you do not want people hurt. Same mindset: set it up so agents without a lot of knowledge can do a good job.

At 33:38 she crosses "software factory" out. Personal Michelin kitchen.

**Gardener (21:59–26:42).** Workarounds copy; "you quickly end up with a very vibe coded codebase." Perfect agent codebase: locked down, annoying for humans, "even innocent-looking patterns are just forbidden." Every team needs a gardener. Weeds and pests: "nip them in the bud as soon as possible before they start propagating everywhere."

Three instincts (25:13–26:38):

1. Delete tech debt you already have, because agents will copy it.
2. Keep or enforce a single paved path for **most** blessed patterns. Enough guidance in codebase, CI, lint.
3. Instinct: "I need to write a lint rule against it." You **don't always have to clean it up immediately**. A lint rule "at least stop[s] the bleeding" — "doesn't solve the problem entirely, but it at least prevents it from growing." Then get agents to clean so you would be happy if an agent copied it.

A later tweet ([2090546476464451907](https://x.com/poteto/status/2090546476464451907)) adds `isRecord` / lint-suppression examples. That is not in this talk.

The move: a repeated chat correction is garden work — encode it, do not only review it.

---

## The codebase is memory

**What she said (15:45–16:28, 20:32–21:44).** She is on a slide: "I have like five of these points here." "The codebase is really like the best form of memory because agents love to extend existing patterns that they see." Files they open are in the context window. "Agents aren't going to just refactor your code in every single PR. They're going to just look at what's already there and just extend."

Reverse (20:43–21:20): anti-patterns spread "kind of like a virus." One workaround, or a comment that explains it, and in days or weeks it is the de facto pattern. "A really, really bad place to be." Then the layering sentence (21:20–21:44): whenever you are correcting agents, invest in **codebase changes and static analysis**, then layer rules, Bugbot, and skills.

Later (30:10–30:38): the codebase is "the materialized snapshot of the state in which you want your agents to extend" — "so pristine… that the next agent that comes along is just very likely to continue that pattern."

**Who writes the code (20:03–20:32).** Designers, PMs, CEOs will ship. Thin-context pilots need to do a good job by default.

**Dune (19:02–20:03, 26:42–29:17).** Client framework / architecture for Grokbot. Inspiration: Cursor Agents Window performance. "Agents love taking shortcuts. So what if we designed a framework such that the shortcut, the easy path, is the right path" — annoying for humans, perfect for minimal-context agents.

Governing line (27:01): "We have a lot of conventions about **where code should live** and **where and how code should be imported between them**." Named pieces — she then skips the rest of the slide ("all of these other pieces aren't that interesting"):

| Piece | What she said |
|---|---|
| Features | Co-located in a single folder |
| React entry | An entry point in the React part of the code; "you can kind of think of it like a route" |
| Transcript cards | Show up in the Grokbot application |
| Host | Runs on the Grokbot VM |
| Client | Powers the overall Dune application |
| Boundaries | Between those pieces. **Example:** main-thread / Electron main work is not allowed on the renderer |

Renderer example (27:44–29:13): accidental imports onto the UI thread were slow. No work that takes **longer than** 16 ms (60 fps) or 8 ms (120 fps). Chunk the work. Enforced through the import and dependency graph. "A pattern that we saw lead to really bad performance that we categorically eliminated through the architecture of Dune."

The lesson is not "use Dune" (29:17–30:10). Extract tribal knowledge from you and your best engineers — the old style-guide / review-comment process — into the framework.

Local [program-design](../../plugins/shravan-dev-workflow/skills/program-design/SKILL.md) already owns How. This is the "next agent will copy this file" lens, not a new phase.

---

## Invest a correction in this order

**What she said (14:56–18:57 and 36:06–37:28).** Refactor architecture to be agent-friendly, "because if you really truly believe that agents are going to be writing all the code in the future, then we need to design our code bases so that they do the right thing by default."

She says **five** points (15:45), and on the close slide **five** pieces (36:28). Style guide is the hole if you stop there — "finally," human-only — not a sixth invest rung.

1. **Codebase** — best memory; make the mistake categorically impossible (data structures, algorithms, architecture).
2. **Static analysis** — linters, compiler diagnostics, CI. Enforceable constraints. Same mistake again → lint rule, or better, make it impossible.
3. **Guidance layer** (she groups these): **rules, Bugbot, skills**. Skills are "less of a hard constraint… more into the realm of guidance." Agents will "sometimes and mostly" use them. They might forget a rule. The human might ignore them. "Not quite as enforceable."
4. **Style guide** — "really only enforceable by humans in a code review." You could put it in rules / Bugbot / skills. If you don't, "you have this big glaring hole" — humans look at every line and remember to comment. At this PR rate that is impossible. A good *start* to see what's missing. Then invest in the other four.

Close-slide order: categorically impossible through codebase / architecture / data structures, **or** static analysis, then layer rules, Bugbot, and skills.

**Comments fail this test (22:52–24:28).** Innocent-looking pattern: agents leaving comments. Humans leave comments for edge cases and notes. In the Cursor codebase, "agents were just using the comments around the code as justification for why it wasn't going to solve the actual problem, and instead paper over it with a band-aid." Dune bans comments so that pattern cannot propagate.

Do not port a comment-police skill. Encode the constraint.

**Learn it from:** [encode-lessons-in-structure](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/principle-encode-lessons-in-structure/SKILL.md) — second time you write an instruction, make it lint / metadata / check / script, then delete the instruction. It does **not** teach her five-point slide. The slide is above.

---

## Verification closes the loop without you

**Origin is "a story before we begin" (2:05–4:14).** Six months ago, joined Cursor, no agent skills, fresh Agents Window, "quite a lot of performance issues." Manager asked for help because of the React-team background. Manual Chrome DevTools / traces / heaps against an "insurmountable wall of pull requests." "Wait, we have agents, what am I doing?" What if the agent ran the app, took traces, found hotspots, and hill-climbed automatically.

**Spectrum (6:51–8:37).** Lower end: teach the agent to run the app, use CDP "or whatever other protocol," debug the application, take performance traces, take heap snapshots. Opposite end, still an open question: formal methods (Lean, TLA+) so business-logic invariants stay true. "Very few people really do" formal methods. "With verification skills, you can get very far."

**Correctness vs quality (12:33–14:56).** Verification: "does the feature or code do the thing that you want it to do?" Checkout button: does it actually check out the cart? Empirical evidence it works. That does not tell you performance or code quality.

She then names pstack and **declines to talk about the plugin** (13:20): "I've built a plugin called Pstack. I'm not going to talk about the plugin too much today." Inspiration is her own SE workflows — debugging, feature development, prototyping. Team skill repo. Combine with verification for quality plus "real performance metrics… real numbers and statistics and telemetry."

**Learn it from:** [create-verification-skill](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/create-verification-skill/SKILL.md) (this is the gap — you do not have a Control Glass). Local `implement-plan` already says prove it on a runnable surface.

---

## A control skill has two parts: a CLI and a feature map

**Control Glass (8:37–10:16).** First skill she built. Iterated; "didn't start out this way." CDP to run the app and take traces.

**CLI.** Reproducible run + traces + empirical evidence the performance bar is met. Not per-session scripts. CLI lives in the skill directory. Invest in it.

**Feature map (10:16–12:33).** She "kind of coined" it. Slack screenshot + `???`. Sitemap-like materialized memory: what exists, how a user reaches it (keyboard, DOM), what it does. In the skill directory. Automation maintains it. They "spent a lot of time on this skill."

CLI + map: agents control the app *and* understand internal/external requests. "More or less critical infrastructure… we constantly maintain it." "The ability for an agent to verify its own work is extremely powerful… for building that trust."

**Learn it from:**

- [create-verification-skill](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/create-verification-skill/SKILL.md) — interviews the repo, writes Launch / Doctor / Drive / Evidence / Cleanup / **Helpers**; existing harness first; one live run before handover
- [feature-map README](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/create-verification-skill/references/feature-map-example/README.md) — four H2s including `Driving it with <harness>` (`search.md` is the filled Notes example)
- [maintain-verification-skill](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/maintain-verification-skill/SKILL.md) — one source reader per feature, one live pass, edits only inside the verification skill, at most one PR, do not edit product code to paper over a broken map

---

## Hill-climb one metric

Spoken idea (3:52–4:14): the agent runs the app, takes the trace, understands it, finds the hotspot, hill-climbs automatically. "Babysit" in this talk is **chats**, not traces.

**Learn it from:** [hillclimb](/Users/shravansunder/Documents/dev/open-source/agent-skills/ai-dev-skills/cursor-plugins/pstack/skills/poteto-mode/playbooks/hillclimb.md) — one measurable thing, frozen harness, before/after, keep or revert, one commit per accepted win. The playbook does not mention Chrome.

---

## Outer loop points; Grokbot + Cursor write

**What she said (32:34–35:15).** "Grokbot and Cursor play an interesting role together, where Grokbot is really great at providing what I call the **outer loop**." She never names an inner loop. Connect **connectors**: Slack, Datadog, Sentry, PlanetScale, "whatever services that you use," aggregate, make decisions.

Some people call this a company brain. "I personally don't think you need anything that sophisticated here, because agents are really good at using tools." Connect them, auto-kick cloud agents, and "you don't really have to invest in a lot of infrastructure to build a software factory." Then she crosses the term out.

Routines: Slack threads, Sentry alerts. Codebase, rules, skills compound. Grokbot responds to outer-loop events and kicks cloud agents. Also Cursor automations and the SDK for additional bots that reuse the same **agent infra** for **more complicated** tasks.

She has **screenshots** of Cursor automations (34:48): auto-repro bug reports, auto-open PRs, "adding a lot of value to the entire team because all of these things compound."

No skill to open. The idea is the split, not another orchestrator.

---

## Beat-by-beat (find it in the video)

| Time | What she is doing |
|---|---|
| 0:00–0:18 | Intro. Potato. Grokbot / SpaceX AI. Last month, pretty crazy, 2,000 PRs |
| 0:19–0:56 | Trust. Environment → personal/team factory |
| 0:57–2:03 | Rejects factory. Michelin kitchen. Final outcome / final product. Cooks, tools, training, dishwasher ratio |
| 2:05–3:40 | "A story before we begin." Joined Cursor. Agents Window. Manual DevTools. PR wall |
| 3:40–5:11 | Frustration. Hill-climb idea. Productivity chart ("skyrocketed"). Never aimed at 2,000/month. Bottleneck. "Paid off" |
| 5:13–6:44 | Slide: "this category." 1–5 babysit chats. Hardest phase. 100 without trust = slop |
| 6:51–8:37 | Verification spectrum. CDP / debug / traces / heaps vs Lean / TLA+ |
| 8:37–10:16 | Control Glass. CLI in the skill directory |
| 10:16–12:33 | Feature map. Slack `???`. Sitemap. Automation. Critical infra |
| 12:33–14:56 | Correctness vs quality. Checkout. Names pstack and declines to talk the plugin. Metrics / telemetry |
| 14:56–18:57 | Agent-friendly architecture. Five points. Style guide is the hole |
| 19:02–21:59 | Dune. Shortcuts. Thin-context PMs/CEOs. Virus. Then: invest in codebase + SA, layer rules / Bugbot / skills |
| 21:59–24:28 | Garden. Ban comments. Comments as band-aid justification |
| 24:28–26:42 | Gardener. Delete debt. Paved path for most blessed patterns. Lint to stop bleeding (not always clean now) |
| 26:42–29:17 | Dune pieces + "other pieces aren't that interesting." Where code lives / how imports cross. Main vs renderer example. 16 ms / 8 ms |
| 29:17–30:38 | Extract style-guide knowledge. Codebase as snapshot |
| 30:38–32:34 | Layer recap. Locked Grokbot. Train bots / skills as tools. Michelin factory blend. Fix the trip |
| 32:34–34:41 | Outer loop. Connectors. Not a company brain. Crosses out factory. Routines + cloud agents + SDK |
| 34:41–36:01 | Screenshots of Cursor automations. Auto-repro, auto-PRs. Compound. Zoom back to the same graph |
| 36:01–38:00 | Wrong slide, then takeaway slide: activities → high-trust environment. Agents can be free. Grokbot example. Secret = hard work. Handle: poteto |

---

## Do not open

Already local: `practices-show-me-your-work`, `discuss-pathfinding`, `program-design`, the design / plan / review orchestrators.

Not the idea: the other playbooks, autopilot/babysit/shipping, `unslop`, `bro`, `make-bot-ui`, `setup-pstack`, porting `no-comments`, Bend, Matt `codebase-design` as a Dune stand-in.
