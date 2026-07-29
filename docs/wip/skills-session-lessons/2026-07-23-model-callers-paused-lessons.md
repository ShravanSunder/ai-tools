# 2026-07-23-model-callers-paused-lessons

## Scope
- `model-callers` is a paused design/spec, not a live skill
- Jul window mostly memory-inventory mentions; durable lessons from recovery summaries + manage-agents/ACPX work

## How it worked
- Intended split: skill owns routing/judgment; typed runner owns brittle CLI/PTY/JSONL/self-call/heartbeat
- Live successor surface: `manage-agents` / ACPX

## What failed (design / process, not live runtime)
- Implementation paths missing — paused, not shipped
- Documented CLI failure modes: brittle Claude argv; silent long JSON; Cursor `agent` vs `cursor-agent` drift; `agent -p` ambiguity; missing heartbeat; agy/Gemini need opt-in
- Recovery process: branch-only changelog not on HEAD; MEMORY alone insufficient; need remote tip freshness

## Failure scenarios to pressure-test
1. Agent invents/implements `model-callers` despite paused “do not implement until resumed”
2. Ad-hoc Claude/Cursor/agy CLI calls hit documented argv/name-drift/silent-output failures
3. Memory index mention treated as proof skill exists
4. Duplicate routing rules that belong in `manage-agents`

## Takeaways / improvements
- Keep paused-plan pointer; route live multi-agent calling to `manage-agents`/ACPX unless user resumes
- If resumed: runner heartbeat + Cursor binary-name policy first
- Date-filter session-log search; label older summaries

## Classification
- Status: ready for `skill-audit` → **skip** revive unless explicitly resumed; ensure manage-agents owns live surface
- Likely owner: `manage-agents` (live); paused plan archive for model-callers
- Candidate outcome: skip create; update manage-agents only if call-shape gaps remain (see manage-agents lessons)
