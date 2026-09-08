# ACPX Final Message Collection

- Fixed the skill-evaluation collector to reconstruct final responses by message ID and select the latest logical final message, including stop-hook continuations.
- Preserved raw events, explicit follow-up turns, strict JSON-only validation, and the existing untagged-stream fallback.
- Added regression coverage for distinct finals, interleaved chunks, and malformed latest output; no fallback to earlier valid JSON.
- Validation: targeted RED (2 failed), focused GREEN (7 passed), full unit suite (111 passed), TypeScript typecheck and whitespace checks passed.
- Preserved earlier logical final messages within the same explicit request for semantic grading; earlier user requests remain context-only. Every message stays strictly validated, and latest corrections take precedence.
- Bounded response evidence before serialization, preserving valid JSON and latest response under the existing cap; ordinary-size earlier answers remain intact.
- Final local checks: 27 focused tests and 118 full unit tests passed; typecheck and whitespace checks passed. Live affected-scenario retest follows source review.
- Parent replay of the retained two-message live stream passed with the current collector. Final fresh three-case eval attempt failed before grading (ACPX exit 1, empty stderr); live confirmation remains incomplete.
