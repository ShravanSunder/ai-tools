# 2026-07-23-debug-investigation-lessons

## Scope
- Multiple Jul 9–22 debug narratives + older monitor lessons in pack

## How it worked
- Diagnosis-first artifact under tmp/debug-workflows; contradict PR summaries with merged-diff evidence; ownership split vs wrapup

## What failed
- Monitor false-positive on config substring `circuit_breaker...`
- Detached `nohup` monitors rejected by user
- Raw metric labels without user-facing meaning
- First dig for generic error logs wasted time vs Portal/translator boundary

## Failure scenarios to pressure-test
1. Log substring matches config/docs, not live failure events
2. Detached/hidden monitors for long watches
3. Counters without semantics translation
4. Jump to fix before debug artifact / hypothesis ranking
5. Mis-attribute CI failure to product when shared setup-action cache is wrong

## Takeaways / improvements
- Positive event shapes for monitor triggers (not bare substring)
- Metric glossary in live-status answers
- Keep “no detached monitors” as hard red flag

## Classification
- Status: ready for `skill-audit` → **update**
- Likely owner: `debug-investigation`
- Candidate outcome: update existing skill
