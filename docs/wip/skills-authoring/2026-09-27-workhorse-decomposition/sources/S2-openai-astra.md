# OpenAI: Rethinking skills and prompts for GPT-6 Astra

Source fetched: https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra.md

Quotes below are verbatim from the fetched Markdown page. Each source URL is the cited post.

## (a) Reasoning and effort levels

Quote count: 0.

Implication: The post does not discuss low, medium, high, xhigh, or max reasoning/effort levels, their costs or latency, quality differences, or a warning about using the highest level.

## (b) Delegation, subagents, and parallel work

> “Repository skills also guide other contributors' agents, which may use different models.” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

> “Guidance that helps Sol or Luna may overconstrain GPT-6 Astra, so consider which models will use the instructions you leave behind.” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

Quote count: 2.

Implication: The post advises making repository skill guidance work for agents using different models; it gives no advice on subagent orchestration, parallel workers, or when to fan out.

## (c) Code review, including cross-model review

Quote count: 0.

Implication: The post does not discuss code review practices or cross-model review.

## (d) Permissions, autonomy, safe stops, and computer use

> “GPT-6 Astra, as our most aligned model, has much better judgment and will not perform tasks unless it knows it is safe – so you should treat it as such.” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

> “Astra could take it too seriously and may stop work where you'd actually be happy for it to continue.” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

> “The local tests use disposable fixtures and have no production access. Run them, fix failures caused by the requested change, and rerun affected tests without asking for approval at each step.” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

Quote count: 3.

Implication: The post says to reconsider restrictive boundaries for Astra and gives a specific safe local-test workflow where instructions can authorize continued work; it says nothing about computer use.

## (e) Prompt and skill writing: length, repetition, and examples

> “But many descriptions are far too long, and when you add too many skills, Codex starts shortening their descriptions to fit.” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

> “First, skill descriptions should be as short as possible while making it clear when the model should use them:” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

> “Second, one of the key markers of a useful skill is progressive disclosure.” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

> “For skills with multiple workflows, make the root document a minimal router that points to supporting docs and scripts.” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

> “Third, many skills were written as elaborate itineraries or recipes. Models have gotten much better at understanding nuance and ambiguity, so overly specific guidance can now hinder results where it previously helped.” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

> “Requiring a stack of docs or a full repo map before every edit is excessive for a typo fix.” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

> “Use architecture.md for service boundaries, database.md for schema changes, and deployment.md when preparing a deployment.” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

> “Previous models needed encouragement to run tests and check their work. GPT-6 Astra does that on its own, so the same instructions can lead to unnecessary testing.” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

> “You can use `AGENTS.md` to give it permission for a specific workflow you know is safe, such as a local test suite:” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

Quote count: 9.

Implication: The post recommends concise skill descriptions, progressive disclosure through a minimal router, less itinerary-like detail, contextual document pointers, and revisiting instructions that repeat behavior Astra already performs; it illustrates skill descriptions and AGENTS.md instructions with bad/good examples and a safe-test example.

## (f) Cheaper or smaller models for bounded work

> “Guidance that helps Sol or Luna may overconstrain GPT-6 Astra, so consider which models will use the instructions you leave behind.” — https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

Quote count: 1.

Implication: The post names Sol and Luna as other models whose agents may use repository skills, but it does not characterize them as cheaper or smaller, nor assign them bounded work.

# partial: The source has no explicit guidance on reasoning/effort levels, code review, parallel delegation, computer use, or assigning cheaper/smaller models bounded work.
