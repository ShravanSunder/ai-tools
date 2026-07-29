# 2026-07-23-ops-cold-skills-lessons

## Scope
- Skills: `docs-maintain`, `ops-linear-tracking`, `ops-observability-stack`, `ops-security-review`
- Window ~14d; lane scrape-ops-retired

## How it worked
- Triggers appear in inventories; research/debug correctly *name* docs-maintain as promotion/cleanup owner
- Naming preference: namespace-first `ops-security-review` over `security-router`

## What failed
- No observed runtime executions of these skills in the extract window (cold / under-invocation)
- Risk is freelanced Linear/OTel/security work or chat-claimed cleanup without loading the skill — not proven wrong skill content

## Failure scenarios to pressure-test
1. Research/debug ends with “next: docs-maintain” then agent claims cleanup done without loading it
2. “Create tickets from this architecture doc” without loading `ops-linear-tracking`
3. “Are my OTLP spans arriving?” without loading `ops-observability-stack`
4. “Security scan this diff” freelances review instead of `ops-security-review` / Codex Security route

## Takeaways / improvements
- Treat as **discovery/routing** signal, not content defects
- Smallest: one pressure case per cold skill that requires load before MCP/CLI writes or “done” cleanup claims
- Keep `ops-*` public naming

## Classification
- Status: investigate lightly
- Likely owner: each ops skill (routing/pressure only)
- Candidate outcome: **skip** content rewrite; optional pressure-scenario add via `skills-creation` if audit agrees
