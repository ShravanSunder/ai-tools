# Source notes: Addy Osmani, SkateBench, and Theo

## 1. Addy Osmani's Opus guidance

**Found.** Addy Osmani, “Getting the most out of Opus 5.5 in Claude and Claude Code,” published **2026-09-22**: https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

The page was fetched directly. Its structured metadata names Addy Osmani as author, gives `datePublished` as `2026-09-22`, and identifies the same canonical URL.

## 2. SkateBench primary sources and published result

**Primary site:** https://skatebench.t3.gg/ — fetched directly. It identifies itself as “SkateBench - Ranking Models By Skateboarding Knowledge” and says: “Success rate based on 390 technical trick definitions.”

**Primary repository:** https://github.com/T3-Content/skatebench — the GitHub API endpoint `https://api.github.com/repos/T3-Content/skatebench` returned the public repository with `full_name` `T3-Content/skatebench` and `html_url` `https://github.com/T3-Content/skatebench`.

The fetched leaderboard currently lists **gpt-5.4-high 82%**, **gpt-5.4-xhigh 81%**, and **gpt-5.4-pro-thinking 79%**. These are the visible accuracy-distribution results, based on 390 definitions. The site does not show a `max` entry in the fetched leaderboard.

## 3. Theo's primary Opus 5.5 source

**Found.** Theo / t3.gg, “Getting the most out of Opus 5.5,” video: https://www.youtube.com/watch?v=ejjBbaq9RmY — search results identify it as Theo's video, dated **2026-09-25**. Theo's own post announcing his Opus 5.5 guide is https://x.com/theo/status/2103276852618068458 (2026-09-25), which calls it “My guide to maximizing success with Opus 5.5” and links to Addy Osmani's writeup. The transcript excerpts below were returned for the direct YouTube result; video is the primary source. `not fetched: direct YouTube page/video was not retrieved; search returned transcript excerpts and Theo's post`.

## Extracts by requested topic

### (a) Reasoning / effort: use, cost, latency, quality, highest-level warning

> “Opus 5.5 always thinks before it replies, and it decides how much.” — Addy Osmani, https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “In our testing in a chat product, removing a ‘think carefully’ line made replies start sooner, with no clear drop in quality.” — Addy Osmani, https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “On X high, the average tokens per response was 338. The average duration for a response was 6 seconds and the slowest was 31 seconds. On max, the tokens went from 338 average to 5,000 average, more than a 10x.” — Theo, https://www.youtube.com/watch?v=ejjBbaq9RmY

> “All it got out of that was one additional correct answer. It went from 78% to 79%. It cost 13 times more. It used 15 times the tokens. It took 20 times longer in the worst cases.” — Theo, https://www.youtube.com/watch?v=ejjBbaq9RmY

> “High or XI? They're both fine. […] I just leave it on higher XI.” — Theo, https://www.youtube.com/watch?v=ejjBbaq9RmY

Implication: Addy recommends letting Opus choose its effort and reports faster starts without a clear quality loss when removing “think carefully”; Theo's SkateBench run warns that max can cost far more time and tokens for one point of accuracy, while he prefers high/xhigh. The site's separate current GPT-5.4 leaderboard has high at 82% and xhigh at 81%; it does not publish a max score.

### (b) Delegation: subagents and parallel work

> “For an audit, a migration, or a review across a large codebase, ask Opus 5.5 to split the work across subagents and check each result.” — Addy Osmani, https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

Implication: Fan out large audits, migrations, or reviews by bounded unit, then inspect each subagent's evidence before accepting it.

### (c) Code review, including cross-model review

> “Ask Opus 5.5 to review a diff or a pull request before a person does.” — Addy Osmani, https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “One early tester said Opus 5.5 at its lowest effort caught more bugs than Opus 5 at high effort, with fewer false alarms.” — Addy Osmani, https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

Implication: Addy recommends a model review pass before human review and reports one tester's comparison; this article does not recommend cross-model review.

### (d) Permissions, autonomy, safe stops, computer use

> “When a step doesn't need my input, keep going. Put status notes in the same message as your next action. Stop and ask only when you can't continue without me, or before anything destructive: deleting data, force-pushing, or changing anything outside this repository.” — example CLAUDE.md text in Addy Osmani, https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “Keep permission prompts on for destructive commands too.” — Addy Osmani, https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

Implication: Give the agent a clear finish line and explicit stop conditions; preserve permission prompts for destructive actions. This article discusses attaching screenshots and diagrams in Claude apps, but does not give separate computer-use operating instructions.

### (e) Prompt and skill writing: length, repetition, examples

> “Remove ‘think carefully,’ ‘think step by step,’ and similar lines from your prompts and your saved instructions.” — Addy Osmani, https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “Put a short rule in your CLAUDE.md file about when to stop and ask, and when to keep going.” — Addy Osmani, https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

> “For a quick answer to a simple question, say so: ‘Answer directly.’” — Addy Osmani, https://claude.dev/blog/getting-the-most-out-of-opus-5-5/

Implication: The Opus guide favors concise, task-specific instructions and gives examples; it says to remove redundant reasoning instructions. It does not provide skill-authoring guidance or prescribe a general prompt length.

### (f) Cheaper or smaller models for bounded work

No quote found in the fetched Addy article, SkateBench site/repository, or Theo video results supporting a recommendation to route bounded tasks to cheaper or smaller models. Addy's article mentions fallback to an older model after a message is flagged, but that is not presented as a cost or task-sizing strategy.

Implication: This source set does not establish when to use a cheaper/smaller model for bounded work.

## Search coverage and limits

- Addy searches tried: `Addy Osmani Claude Opus guidance blog newsletter`; direct fetch of the discovered Anthropic article succeeded.
- SkateBench searches tried: `SkateBench benchmark repository max reasoning effort lower reasoning effort`; `"SkateBench" reasoning effort max`; `"Skatebench" "reasoning" benchmark github`; `"skatebench" "effort" AI benchmark`; `site:skatebench.t3.gg max effort SkateBench`; `site:t3.gg "max" "SkateBench" effort`; `"Skatebench" "Max" "high" Theo model`; `"SkateBench" "gpt-5.4-xhigh" "gpt-5.4-high"`. The primary site and public repository were located and fetched/verified.
- Theo searches tried: `site:t3.gg Opus 5.5 OR Astra Theo getting the most out of`; `site:youtube.com/@theo Opus 5.5 Astra`; `site:youtube.com Theo Astra model reasoning coding`; `site:youtube.com/watch "SkateBench" "max" effort Theo`; `"Getting the most out of Opus 5.5" Theo September 25 2026`. A primary YouTube video and Theo's own X announcement were found. No separate Astra-specific “getting the most out of” source was needed or included.
- The fetched SkateBench page is the visible current leaderboard; Theo's quoted 78%/79% max-vs-xhigh result is a video-reported run and should not be conflated with the site's current GPT-5.4 leaderboard.

# partial: no explicit skill-writing guidance or cheaper/smaller-model recommendation was found in these sources; no separate Astra-focused Theo source was included.
