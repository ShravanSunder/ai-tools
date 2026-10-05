# Next ticket: Karpathy output ladder (STE, diagrams, HTML, videos)

Status: next
Date: 2026-10-05
Kind: idea capture + do-next experiment. Not a skill-change proposal yet.

Sources:

- [Andrej Karpathy, 2026-10-01](https://x.com/karpathy/status) — understand model output by asking for constrained writing, then diagrams, then HTML, then bespoke explainer videos.
- [@kunchenguid reply](https://x.com/kunchenguid) — full ASD-STE100 is too strict; pick a subset. Sample recent transcripts, keep only the rules that actually improved clarity, write those into user-level `AGENTS.md`.
- [Elie Bakouch (@eliebakouch), 2026-10-01](https://x.com/eliebakouch) — bottlenecked on understanding other models' outputs in "autoresearch". Interactive HTML is the time-efficient rung; video can wait. The failure is the *level of abstraction around the plots*, not "can it emit HTML". Opus 4.5 helped after many iterations and still was not clear or detailed enough.
- ASD-STE100 overview infographic (document structure, sentence anatomy, verb forms, dictionary, limits, history). Working notes below, not the official spec.

## Why this is a ticket

Karpathy's claim: as models do more of the work, more of *our* work becomes oversight and understanding. The useful move is not another durable product. It is a large, custom, discardable artifact — STE prose, a diagram, an HTML explainer, a 3b1b-style video — that would never have been worth building before.

That is a different job from today's presentation skills. `presentation-webui` and `presentation-tui` own how an answer looks *in chat*. This ticket is about asking for throwaway software that helps a human understand a hard output.

## The ladder

1. **Writing.** Ask for ASD-STE100, or "80% of the way to ASD-STE100". Constrained, readable, aerospace maintenance English.
2. **Diagrams / images.** Easier to parse than prose when the thing has structure, flow, or state.
3. **HTML.** Interactive page, animations, a small explainer app. Discard after use. Elie's cut: this is the time-efficient rung for understanding model output. Prefer it over video until an HTML explainer is actually clear.
4. **Explainer videos.** Karpathy's preferred end state: a custom 3b1b-style video on any topic, with narration (ElevenLabs or a local stand-in). Elie wants to try it; do not start here.

Do not climb the ladder for a one-line answer. Climb it when the cost of misunderstanding is higher than the cost of the artifact.

## HTML rung: abstraction, not chrome

Useful because it names why a pretty page still fails.

The job is not "plots in a browser." The job is choosing what the plot is *about* — which comparison, which scale, which claim — then writing the explanation at that same altitude. Elie's examples took many Opus 4.5 iterations and were still too vague or too low-level.

Judge an HTML explainer on:

- one primary claim per view
- the plot argues that claim; extra series are hidden or one click away
- the caption says what changed and what it means, not what the axes are named
- a first-pass page that needs a long repair loop failed the abstraction, not the CSS

If the first HTML dump is a dashboard of every metric, that is the failure to encode later. STE helps the surrounding prose. It does not pick the plot.

## STE working subset (from the infographic)

Official name: **ASD-STE100, Simplified Technical English**. Two parts: writing rules, then a dictionary of about 1,900 approved words. History: AECMA work 1979–1986, ASD-STE100 from 2005, current industry spec after that.

Use this as a candidate subset, not as "we adopted the spec." The reply is right: the full ruleset is too strict. Keep a rule only if a transcript experiment shows it reduced confusion.

### Document jobs

| Job | What it is for |
| --- | --- |
| Procedural sentence | Tell the reader to do one action |
| Safety instruction | Name the hazard, then the required action |
| Descriptive sentence | Say what a thing is or does |

### Hard limits worth trying

| Limit | Cap |
| --- | --- |
| Procedural sentence | 20 words |
| Descriptive sentence | 25 words |
| Descriptive paragraph | 6 sentences |
| Noun cluster | 3 words |
| Instructions in one sentence | 1, unless it is the same operation |
| Topics in one paragraph | 1 |

### Verb forms

| Form | Example | Keep? |
| --- | --- | --- |
| Command (imperative) | Close the valve. | yes |
| Simple present | The valve closes. | yes |
| Simple past | The valve closed. | yes |
| Infinitive | To close the valve. | yes |
| Past participle as adjective | The closed valve. | yes |
| Progressive (-ing as a verb) | The valve is closing. | no |
| Obligation waffle in a procedure | The valve must be closed. | no — use the command |

### Same-word rule and voice

- One approved word for one meaning. Do not switch synonyms for variety.
- Active voice in procedures.
- Do not use vague `like` / `as` comparisons.
- Prefer a vertical list over a packed sentence.

### Dictionary pattern (unapproved → approved)

Words in the left column are the ones models reach for. The right column is the STE swap.

| Do not write | Write |
| --- | --- |
| commence | start |
| prior to | before |
| replenish | fill |
| utilize | use |
| approximately | about |
| close (as "near") | near |
| in order to | to |

`close` as a verb (stop a flow, bring together) stays. `to` as a preposition stays.

### Three sentence shapes

Procedural:

> Make sure that the hydraulic reservoir is full before you start the operation.

Safety:

> WARNING: Do not touch the brake unit until it is cool. Hot parts can cause injury.

Descriptive:

> The pump supplies fuel to the engine when the switch is on.

## What already exists here

| Surface | What it already does | Gap vs this ticket |
| --- | --- | --- |
| `presentation-webui` / `presentation-tui` | In-chat medium selection: prose, table, Mermaid, box layout | No discardable HTML app or video. No STE. |
| `shared-references/diagram-rendering-and-fallbacks.md` | When a diagram is the right medium | Stops at a diagram, not an explainer artifact. |
| `docs/wip/skills-authoring/2026-08-28-mental-models-diagram-first.md` | Diagram-first mental-model repair | Different job: settle two pictures, not explain a model output. |
| User-level `AGENTS.md` / `shared/my_agents.md` | Soul, modes, craft | No STE subset. No "ask for a throwaway explainer" rule. |

Do not open a new skill because a tweet named a format. Prefer a user-prompt experiment, then a small presentation or AGENTS.md update, then a skill only if the same failure repeats.

## Do next

Ordered. Stop after the first one that changes the mental model.

1. **Transcript experiment (kunchenguid).** Sample ~10 recent interactive sessions. Apply STE rules to assistant replies only. Keep the rules that increased clarity, reduced confusion, or shortened a repair loop. Write that subset into *user-level* `AGENTS.md` (`~/dev/devfiles/shared/my_agents.md`), not into a public plugin skill. Privacy: summarize behavior; do not paste raw transcripts into this public repo.
2. **80% STE on one live design explanation.** Same topic, two drafts: current voice vs softened STE. Compare readability with the owner, not with a rubric.
3. **One HTML explainer.** Pick a hard local topic (skill layers, or the output ladder itself). Ask for a discardable HTML page. Fail it if the plots have no chosen abstraction — a metric dump that needs many repair turns. Decide whether presentation skills should grow a "throwaway HTML" rung or stay chat-only.
4. **Video only if 1–3 earned it.** Elie: HTML is more time-efficient; try video after. 3b1b-style + narration. Needs an API key or a local TTS stand-in. Do not build a video pipeline as the first slice.

## Classification (provisional)

- Status: `capture` → first action is `investigate` via the transcript experiment.
- Likely owner after evidence: user-level `AGENTS.md` first. Then `presentation-webui` / `presentation-tui` if the HTML rung proves useful. New skill only if "build a discardable explainer" becomes a repeated workflow with stable inputs and a stable output.
- Route: `skill-audit` if the experiment says a named skill should change. `skills-creation` only after that naming.
- Not this ticket: official STE certification, copying the commercial spec, shipping ElevenLabs as product infra.

## Board

- Project: `shravan-developer-workflows` (`01a0d9c3-1e9d-7b70-8880-06c89c6391c2`)
- Board: `Plugin and skill work` (`01a0d9c3-3b24-7212-a71b-df57bcdda357`)
- Topic: `Next tickets: STE writing and explainer artifacts` (`01a10cd4-87d2-7370-b950-78bc32a71764`)
- Thread: `01a10cd4-a4fc-7e92-aeb5-22c79cb7e8b5`
