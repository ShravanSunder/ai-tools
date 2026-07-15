# Tool Routing

Use the narrowest source that can answer the question. Prefer primary evidence over generated synthesis when the claim is load-bearing.

## Source Classes

```text
Need                                      Route
----------------------------------------  ------------------------------------
current local implementation truth         rg, git, direct file reads
repo-local docs/specs/plans/runbooks       direct reads; whole artifact when reviewing
adjacent local prior art                   sibling repos, worktrees, local docs
GitHub repo architecture or APIs           DeepWiki ask_question, then primary files/docs
current web facts or docs                  Perplexity/Tavily, then primary URLs
specific URL or docs site extraction       Tavily extract/crawl or scraper if available
saved personal research                    Readwise/Reader
user workflow history                      memory, rollout summaries, targeted sessions
UI/page behavior                           Browser or app-specific tooling
security research                          ops-security-review / Codex Security routes
```

## Routing Rules

- Use local code/docs first when the research affects a local repo.
- Use DeepWiki for open-source repository structure and API questions, but verify load-bearing conclusions against cited source files or official docs.
- Use Perplexity for current multi-source research and cited web synthesis.
- Use Tavily extraction/crawl, or Firecrawl/scraper when available, for specific pages or docs sites.
- Use Readwise/Reader only when the user's saved research is relevant.
- Use memory/session logs for user workflow patterns, prior decisions, and repeated manual work; treat memory as discovery until confirmed.
- State when a preferred source class or tool was unavailable and what fallback was used.
