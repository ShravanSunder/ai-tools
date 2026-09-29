# Getting the most out of Opus 5.5 — source extraction

Source fetched: [Getting the most out of Opus 5.5 in Claude and Claude Code](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/) by Addy Osmani, published September 22, 2026.

Quotes below are verbatim excerpts from that page. Each quote is under 60 words. “Implies” lines summarize only the source's stated guidance; absence notes identify requested details the article does not provide.

## (a) Reasoning and effort levels

> “Opus 5.5 always thinks before it replies, and it decides how much. You don’t need to ask it to think.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “To change how much it thinks in Claude Code, change effort.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “One early tester said Opus 5.5 at its lowest effort caught more bugs than Opus 5 at high effort, with fewer false alarms.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “In our testing in a chat product, removing a ‘think carefully’ line made replies start sooner, with no clear drop in quality.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

Implies: The article recommends omitting “think carefully” prompts and presents a single tester's favorable low-effort code-review result. It does not describe when to use low, medium, high, xhigh, or max individually; nor does it quantify their cost, latency, or quality tradeoffs, or warn against the highest level.

## (b) Delegation

> “For an audit, a migration, or a review across a large codebase, ask Opus 5.5 to split the work across subagents and check each result.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “Early testers had Opus 5.5 coordinate parallel subagents on long audits and migrations, with little oversight.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “When a subagent reports back, check its evidence before you accept it.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

Implies: Fan out large audits, migrations, and codebase-wide reviews into parallel subagent work, then verify each report's evidence before accepting it.

## (c) Code review

> “Ask Opus 5.5 to review a diff or a pull request before a person does.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “One early tester said Opus 5.5 at its lowest effort caught more bugs than Opus 5 at high effort, with fewer false alarms.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “List only problems you'd block the merge for. For each one, give the file and line, why it's wrong, and how to show it fails.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

Implies: Run a blocking-issues-only review before human review, request file and line references, rationale, and a demonstration of failure. The article provides no advice about cross-model review.

## (d) Permissions, autonomy, safe stops, and computer use

> “Hand over the whole task. Say what ‘done’ looks like and when you want it to stop and ask. Then let it work.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “Stop and ask only when you can't continue without me, or before anything destructive: deleting data, force-pushing, or changing anything outside this repository.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “A rule to keep going means fewer stops, so keep your own check before anything risky or hard to undo.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “Keep permission prompts on for destructive commands too.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “Attach the chart, diagram, screenshot, or slide. Don’t retype the numbers.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

Implies: Define the task, finish line, and stop conditions; allow autonomous progress while retaining checks and permission prompts for destructive or risky actions. The page recommends attaching visual material for analysis but gives no general computer-use or UI-operation guidance.

## (e) Prompt and skill writing guidance

> “Give the whole task in one message. Name the finish line, like ‘the tests pass’ or ‘every endpoint is migrated.’ Then let it cook.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “Remove ‘think carefully,’ ‘think step by step,’ and similar lines from your prompts and your saved instructions.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “Put a short rule in your CLAUDE.md file about when to stop and ask, and when to keep going.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “For a run that will take a while, ask Opus 5.5 to keep its task list in a file and update it as it goes.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

Implies: Put a complete task and clear finish line in one message, remove redundant reasoning instructions, and keep persistent operating rules concise. The article offers no guidance on skill-file structure, repetition policy beyond the quoted reasoning lines, or example counts.

## (f) Cheaper or smaller models for bounded work

> “Most flagged messages move to an older model, and your work goes on there.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “You get the same model, and the text arrives sooner. It needs extra usage turned on, and it costs more per token than standard mode.” — https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

Implies: The article describes an older-model switch after flagged messages and says fast mode uses the same model at a higher per-token cost. It does not recommend cheaper or smaller models for bounded tasks.

# partial: the article gives no per-level low/medium/high/xhigh/max guidance, no cross-model review rule, no general computer-use instructions, no skill-authoring guidance, and no explicit cheaper/smaller-model recommendation.
