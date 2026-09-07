# Work Trail Helper

This reference owns initialization, lookup/reuse, entry examples, details/corrections, rendering, and write-failure handling. Return a usable trail path, its finish owner, or the concrete logging gap. The helper owns the JSONL representation; do not duplicate its storage format in another file.

## Commands and input

Run with Python 3.12+ on macOS/Linux through uv, which reads the entry script's dependency metadata:

```sh
uv run /path/to/this/skill/scripts/work_trail.py --help
uv run /path/to/this/skill/scripts/work_trail.py find --repo /path/to/repo --session SESSION
uv run /path/to/this/skill/scripts/work_trail.py start --repo /path/to/repo --session SESSION
```

Resolve `/path/to/this/skill` from the SKILL.md you loaded. Use the actual available host session/tab identifier; omit `--session` if unavailable and let the helper mark a generated one. No private session-store search, remote URL lookup, document digests, or model-invented IDs are needed.

Prefer a caller-provided trail path. For a resumed task without that path, find lists matching runs within the current repo, optionally filtered by session; inspect candidate identities and readable views before selecting. Do not automatically select the newest of several plausible runs. No match means a new trail with an explicit missing-history note if this is a resumed task.

The default root is `~/dev/memory-logs/work-trails/`. An explicit user-selected or test root can precede the subcommand as `--root /path/to/root`; pass that same root on later calls. Never substitute a temporary root without telling the user that central recording is unavailable. Separate worktrees of one Git common directory group together; separate clones remain separate local repo identities.

Start returns JSON containing the new trail path and identity. Keep the returned path and reuse it. Appends and finish accept a JSON object from stdin, or from `--input /path/to/payload.json`. Use structured tool/file input; never interpolate arbitrary notes or secret-bearing data into shell code.

```sh
uv run /path/to/this/skill/scripts/work_trail.py append --trail /returned/trail --repo /path/to/repo --input /path/to/payload.json
uv run /path/to/this/skill/scripts/work_trail.py render --trail /returned/trail
uv run /path/to/this/skill/scripts/work_trail.py finish --trail /returned/trail --repo /path/to/repo --input /path/to/outcome.json
```

A temporary payload file is disposable transport, not another log. Keep it in task scratch and include only sanitized content. `--repo` defaults to the command's working directory; use the actual writer worktree so branch information reflects where the work happened.

## What a useful entry looks like

```json
{
  "phase": "verification",
  "decision": "The real persistence test still fails after the first fix.",
  "why": "The row is written, but a new connection cannot read it.",
  "evidence": ["tests/orders_test.py:42", "tmp/test-results/persistence.txt"],
  "result": "Failed; investigating transaction commit behavior."
}
```

This records an observed failure without calling the feature complete. "Ran tests; all good" is weak when it names no behavior, result, or evidence. "Read a file" usually adds no value. "Chose server-side validation because the client can be bypassed" earns a decision entry with its supporting source.

The evidence list is references, not copied output. Absolute local pointers and safe URLs are useful, but access can expire; do not claim the helper checked an external link. The helper never fetches URLs or runs commands embedded in input.

For a substantial explanation add `"detail": "Markdown explanation..."` to the payload. The helper writes an event-specific immutable Markdown file and links it. Keep alternatives and supporting context there, while the short event stays understandable. It should not contain executable HTML or sensitive data.

For a correction add `"supersedes": "event-000002"`, using the actual returned event ID. Only an existing unsuperseded event in that same trail can be corrected. Corrections are validated inside the append lock; a competing stale correction fails without changing history. Inspect the current leaf rather than blindly retrying against a different event.

## End, view, and continue

Finish requires decision, why, evidence, and result; phase defaults to `finish`. Say what was delivered or why work stopped and what remains. Finish appends that outcome and renders the view. An identical immediate finish retry rerenders without duplicating the outcome. Rendering alone never appends events.

The outermost task that started or adopted the trail owns finishing it. Nested design/implementation phases record phase outcomes but leave outer finalization to the caller. Finish is an observed checkpoint, not a sealed workflow state; later appends are allowed, and the view labels activity after the last finish until the next finish.

Open the returned readable view and spot-check that decisions, failed outcomes, corrections, and detail links read accurately. Include the returned file link in the final response. The view records its snapshot so a later append cannot be mistaken for content already included.

## When something fails

Errors are machine-readable and nonzero; diagnose from the error code and help, without printing the original payload. Correct invalid input before retrying. A lock wait is bounded; do not start an unbounded retry loop. If existing JSONL is malformed or truncated, preserve it and report the trail as damaged; no automatic rewrite or repair is provided.

Private files and safe paths reduce accidental exposure but are not automatic secret detection. All record authors must sanitize content first. No automatic deletion, sync, database migration, or durable memory promotion occurs.
