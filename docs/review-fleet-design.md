# review-fleet — multi-harness code review plugin

Design proposal. Branch: `claude/multi-agent-code-review-vPGGD`. Not yet implemented.

## Goal

A code-review plugin that:

1. Runs natively in both **Claude Code** and **Codex CLI** (one repo, two plugin manifests, shared skills/scripts).
2. Spawns **harness-native subagents** for the four specialist reviewers (Claude Task tool / Codex sub-skill mechanism).
3. **In parallel**, fans out to **other harnesses' CLIs** as additional reviewers: `claude -p`, `codex exec`, `gemini -p`, `cursor-agent` (or whichever Cursor 2.5 CLI form is correct), and Gemini Antigravity (`agy`?) — whichever are installed at runtime.
4. Reduces all findings through a verifier + reducer pass before reporting.
5. Optional closeout loop that applies high-confidence fixes and re-reviews, capped at 5 cycles.

## Non-goals

- Replacing `quorum-counsel`. It stays as the "counsel / second opinion / planning" plugin. `review-fleet` is review-specific.
- A managed hosted product. This is local-only. Anthropic's hosted Code Review (claude.com/plugins/code-review) is a separate product.
- Cross-harness orchestration of the *outer* loop (no auto-detecting "you're in Codex so I'll spawn Claude as the host" — each harness is its own host).

## Naming

Working name: **`review-fleet`** (echoes the Anthropic Code Review docs language "fleet of specialized agents", and is distinct from `quorum-counsel`).

Open to: `review-swarm`, `code-jury`, `review-conclave`, `bughunt-fleet`. Open question 1.

---

## Harness matrix

| Host harness | Native specialist subagents | External CLI reviewers (in parallel) |
|---|---|---|
| Claude Code | 4 Claude subagents via Task tool (Sonnet, read-only) | `codex exec`, `gemini -p`, `cursor-agent`, `agy` (if present) |
| Codex CLI | 4 Codex sub-skill turns (read-only sandbox) | `claude -p`, `gemini -p`, `cursor-agent`, `agy` (if present) |

**Detection rule**: at runtime, check `command -v` for each external CLI. Skip silently if missing. Don't fail the review if e.g. cursor isn't installed.

**Authentication**: each external CLI handles its own auth. The plugin reports auth state via a `/review-fleet:setup` command (copying the `codex-plugin-cc` `/codex:setup` pattern at `codex-plugin-cc/commands/setup.md`).

---

## Architecture (one review = 5 phases)

```
┌────────────────────────────────────────────────────────────────────┐
│  Phase 0: Scope + intent packet                                     │
│  (build diff target, read CLAUDE.md / AGENTS.md / REVIEW.md,        │
│   read repo-local review guidance, capture user-stated intent)      │
└──────────────────────────┬─────────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│  Phase 1: Fan out specialists IN PARALLEL                           │
│                                                                     │
│  Native specialists (4, harness-spawned, Sonnet/Codex-sandbox):     │
│    1. intent-regression  (Dimillian sub-agent 1)                    │
│    2. security-privacy   (Dimillian sub-agent 2)                    │
│    3. perf-reliability   (Dimillian sub-agent 3)                    │
│    4. contracts-coverage (Dimillian sub-agent 4)                    │
│                                                                     │
│  External CLI reviewers (parallel, dynamic count):                  │
│    5. cross-model:claude   (only when host != Claude)               │
│    6. cross-model:codex    (only when host != Codex; adversarial)   │
│    7. cross-model:gemini   (large-context cross-cutting scan)       │
│    8. cross-model:cursor   (when CLI present)                       │
│    9. cross-model:agy      (when CLI present)                       │
│                                                                     │
│  All return: { findings: [{file_line, category, severity,           │
│                            evidence, fix, confidence}], summary }   │
└──────────────────────────┬─────────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│  Phase 2: Verifier (NEW — copying Anthropic's hosted Code Review)   │
│                                                                     │
│  For each finding, the host re-reads the cited file:line and:       │
│    - drops findings whose evidence doesn't match real code          │
│    - drops findings citing nonexistent symbols                      │
│    - drops cross-cutting claims contradicted by another file        │
│    - keeps only findings where confidence ≥ medium OR multiple      │
│      reviewers independently flagged it                             │
└──────────────────────────┬─────────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│  Phase 3: Reducer (host-only, copying Dimillian's "main agent       │
│  owns synthesis" rule and Steipete's evidence-first contract)       │
│                                                                     │
│  - dedupe across reviewers (same file:line, similar text)           │
│  - rank: high+high → high+med/med+high → med+med → low              │
│  - count agreement: "3/5 reviewers flagged this" boosts severity    │
│  - emit Anthropic severity tags: 🔴 Important, 🟡 Nit, 🟣 Pre-       │
│    existing                                                         │
│  - output the Steipete shape: Ref / Surface / Bug / Cause /         │
│    Provenance / Best fix / Refactor / Proof / Risk                  │
└──────────────────────────┬─────────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│  Phase 4 (optional): Closeout loop                                  │
│                                                                     │
│  When user invokes /review-fleet:closeout (NOT default):            │
│    - apply only high-confidence + behavior-preserving fixes         │
│    - re-run Phase 1-3 with the diff = the newly applied fix         │
│    - stop when no Important findings remain OR cycle count = 5      │
│    - never auto-commit; just modify working tree                    │
└────────────────────────────────────────────────────────────────────┘
```

The closeout loop is **opt-in** because Mantine's "loop until LGTM" pattern can drain budget and apply marginal fixes the user didn't want. `review-and-simplify-changes` (Dimillian) is a better template: review-only mode by default, fix-and-validate is a separate mode.

---

## Patterns adopted (with attribution)

| Source | What I'm taking |
|---|---|
| `openai/codex-plugin-cc` | Job-tracking pattern (`scripts/lib/tracked-jobs.mjs`): one JSON file per job, session-scoped filtering via env var, status/result/cancel commands, background worker spawn with detach+unref. Also the auth/availability multi-step check (`getCodexAvailability` → `getCodexAuthStatus`). |
| `openai/codex-plugin-cc` | Stop-gate hook architecture — but **opt-in** via config flag, not on by default. The hook with the 15-min timeout, session-id filtering, "ALLOW:" / "BLOCK:" parsing. |
| `openai/codex-plugin-cc` | The adversarial-review system prompt (`prompts/adversarial-review.md`) — verbatim for the codex external reviewer when host != Codex. Steal the `<attack_surface>` block. |
| `Dimillian/Skills review-swarm` | The 4 specialist role definitions verbatim (intent-regression / security-privacy / perf-reliability / contracts-coverage). The "main agent owns synthesis" rule. Normalized finding shape. |
| `Dimillian/Skills bug-hunt-swarm` | Companion skill for bug investigation (separate command `/review-fleet:bughunt`). Same 4-specialist pattern but with reproduction/code-path/regression/proof-plan roles. |
| `Dimillian/Skills review-and-simplify-changes` | The 3-mode pattern: `review-only` (default), `safe-fixes`, `fix-and-validate`. Scoped validation (touched-module tests, not full suite). |
| `steipete/agent-scripts github-deep-review` | The Review Contract: explicit cause/provenance/best-fix/refactor/proof/risk shape. The "willing to say 'not proven'" stance. Code-reading depth rules. |
| `mantinedev/mantine codex-code-review` | The 5-cycle cap as a hard ceiling on the closeout loop. "Skip feedback that is incorrect, irrelevant, or purely stylistic." |
| `getsentry/skills code-review` | Senior-review escalation triggers list (schema changes, API contracts, new deps, perf-critical, security-sensitive) — promoted to 🔴 Important automatically. The "approve when only minor issues remain" rule. |
| `addyosmani/agent-skills code-review-and-quality` | Severity vocabulary: (unprefixed) = required, **Critical:** = blocks, **Nit:** = minor, **Optional/Consider:** = suggestion, **FYI** = informational. Five-axis framework as a cross-check against the four-specialist split. |
| Anthropic hosted Code Review (claude.com/plugins/code-review) | The **verifier** phase (re-check candidates against real code). The `REVIEW.md` injection-as-highest-priority pattern (read repo-root REVIEW.md and prepend to every reviewer's prompt). Severity tags (🔴 🟡 🟣). Machine-readable JSON tail for CI parsing. |

---

## File layout

```
plugins/review-fleet/
├── .claude-plugin/plugin.json
├── .codex-plugin/plugin.json
├── README.md
├── commands/                          # Slash commands (both harnesses)
│   ├── review.md                      # /review-fleet — main entry (review-only mode)
│   ├── review-pr.md                   # /review-fleet:pr <num> — review a GitHub PR
│   ├── bughunt.md                     # /review-fleet:bughunt <symptom> — bug-hunt swarm
│   ├── closeout.md                    # /review-fleet:closeout — fix-and-validate mode
│   ├── status.md                      # /review-fleet:status — poll long-running reviews
│   ├── result.md                      # /review-fleet:result <id> — fetch result
│   ├── cancel.md                      # /review-fleet:cancel <id>
│   └── setup.md                       # /review-fleet:setup — check all CLIs + auth
├── agents/                            # Native subagent definitions (Claude Code uses these)
│   ├── reviewer-intent.md             # specialist 1
│   ├── reviewer-security.md           # specialist 2
│   ├── reviewer-perf.md               # specialist 3
│   ├── reviewer-contracts.md          # specialist 4
│   └── reviewer-verifier.md           # phase-2 verifier (read-only, re-checks evidence)
├── skills/                            # Skills (work in both Claude + Codex)
│   ├── review-fleet/SKILL.md          # The orchestrator skill (entry point)
│   ├── review-fleet-bughunt/SKILL.md
│   └── review-fleet-closeout/SKILL.md
├── prompts/                           # Reusable prompt fragments
│   ├── intent-packet.md               # how to build the intent packet
│   ├── specialist-shared.md           # shared preamble for all 4 specialists
│   ├── adversarial.md                 # adversarial prompt (Codex external reviewer)
│   ├── verifier.md                    # phase-2 verifier prompt
│   ├── reducer.md                     # phase-3 reducer prompt
│   └── output-schema.json             # canonical finding JSON schema
├── scripts/                           # All CLI plumbing (Node.js, copying codex-plugin-cc style)
│   ├── review-fleet.mjs               # Main dispatcher
│   ├── lib/
│   │   ├── harness.mjs                # detect-host: claude-code | codex | unknown
│   │   ├── cli-detect.mjs             # detect: claude, codex, gemini, cursor-agent, agy
│   │   ├── jobs.mjs                   # job lifecycle (lifted from codex-plugin-cc)
│   │   ├── git.mjs                    # diff scope resolution
│   │   ├── intent.mjs                 # build intent packet
│   │   ├── reviewers/
│   │   │   ├── claude-cli.mjs         # spawn `claude -p ...`
│   │   │   ├── codex-cli.mjs          # spawn `codex exec ...`
│   │   │   ├── gemini-cli.mjs         # spawn `gemini -p ...`
│   │   │   ├── cursor-cli.mjs         # spawn cursor CLI — TBD (open question 2)
│   │   │   └── agy-cli.mjs            # spawn agy CLI — TBD (open question 2)
│   │   ├── verifier.mjs               # phase-2 implementation
│   │   ├── reducer.mjs                # phase-3 implementation
│   │   └── output.mjs                 # severity tags + Steipete output template
└── hooks/                             # (optional — closeout-gate, opt-in)
    ├── hooks.json
    └── closeout-gate.sh
```

---

## Implementation phases

I propose building in this order so each phase is usable on its own:

| Phase | What | Time est | Usable result |
|---|---|---|---|
| **P0** | Skeleton: plugin manifests, README, marketplace entry, harness/CLI detection, intent-packet builder, output schema, `/review-fleet:setup` | small | `setup` reports which CLIs are present + auth state |
| **P1** | Native 4-specialist fan-out + reducer (no external CLIs, no verifier yet) — usable inside Claude Code today | medium | `/review-fleet` runs the swarm, returns ranked findings. Replaces Dimillian review-swarm for our use case. |
| **P2** | Verifier phase (host re-reads cited file:line, drops unsupported findings) | small | Far fewer false positives. This is the biggest quality jump. |
| **P3** | External CLI reviewers (`claude -p`, `codex exec`, `gemini -p`) running in parallel with phase-1 specialists | medium | Cross-model agreement signal. Boost severity when ≥3 reviewers flag the same thing. |
| **P4** | Codex-host port: `.codex-plugin/plugin.json` + skill-only invocation path. Test on Codex. | small | Plugin runs in both harnesses. |
| **P5** | `cursor-agent` + `agy` external reviewers — once CLI invocation is confirmed | small | Five-model fleet when all CLIs are installed. |
| **P6** | `/review-fleet:closeout` (3-mode fix-and-validate, 5-cycle cap, scoped tests only) | medium | Optional auto-fix mode. |
| **P7** | `/review-fleet:bughunt` (bug-hunt swarm) | small | Sister command for diagnosis instead of review. |
| **P8** | Status/result/cancel + optional stop-gate hook (opt-in only) | small | Long-running reviews are manageable. |

---

## Open questions (need your answer before P1)

1. **Plugin name**: `review-fleet` (recommended), `review-swarm`, `code-jury`, `review-conclave`, or your pick?

2. **External CLI invocations** — I need to confirm the exact non-interactive read-only invocation for each. I know:
   - `claude -p "<prompt>" --output-format json` (Claude SDK CLI; need to confirm flag for "no tools / no writes")
   - `codex exec "<prompt>"` and `codex review --uncommitted` and `codex review --base <ref>`
   - `gemini -p "<prompt>"` (read-only, system-enforced per existing quorum-counsel docs)
   - **Cursor 2.5**: is the CLI `cursor-agent`? `cursor agent`? Something else? I haven't verified it's the right tool. Open to: skip Cursor in P1-P3, add in P5 once confirmed.
   - **Antigravity / agy**: the user mentioned "agy (Gemini antigravity harness)". Antigravity is Google's coding harness but the CLI form `agy` is unconfirmed. Skip until you confirm the invocation, or treat as same as `gemini -p`?

3. **Where do reviews run** — the existing `quorum-counsel` runs all subagents as background tasks. Should `review-fleet` default to background (long but non-blocking) or foreground (faster turnaround but blocks the chat)? Codex-plugin-cc defaults to background for adversarial review and foreground for native review.

4. **Specialist count** — Dimillian uses 4 (intent / security / perf / contracts). Sentry's rubric suggests 6 categories. Addy uses 5 axes. **I'd keep 4 native specialists** (parallel cost) and rely on the external CLI reviewers (5–9 total reviewers) for breadth. Confirm?

5. **REVIEW.md** convention — adopt Anthropic's `REVIEW.md` (review-only instructions, highest priority injection) in addition to `CLAUDE.md` / `AGENTS.md`? Yes is the default in my design.

6. **Repository sync** — `relay-ai-tools` (work fork). Sync `review-fleet` to it, or personal-only like the other plugins? CLAUDE.md says "Plugin-related files (`plugins/`, `.claude-plugin/`) are NOT synced (personal-only)" — confirm.

---

## Risks / trade-offs

- **Cost**: 4 native + up to 5 external reviewers + verifier + reducer per run. Each ~2–10 min. Ballpark $0.50–$3 per review at current pricing, comparable to Anthropic's $15–25 hosted review (which scans the full codebase, not just the diff). Manageable but real.
- **Auth surface**: 5 separate CLI auth states (claude, codex, gemini, cursor, agy) to keep working. Setup command must surface failures clearly; reviewers must skip silently when their CLI is unauth'd.
- **Diff size**: large PRs (>500 lines) blow past context for some CLIs. Need to chunk or fall back to file-by-file. P3 concern, not P1.
- **Cross-model disagreement noise**: 5 reviewers will often disagree. The reducer's "agreement count boosts severity" rule helps but isn't fool-proof. The verifier is the actual safety net.
- **Codex sub-skill semantics**: I'm assuming Codex supports the same parallel-skill spawn that Claude Code does via Task. Codex has skills but the parallel-fanout primitive may need a different mechanism (e.g. invoking `codex exec` recursively in subshells). Needs validation in P4.

---

## Next step

I want you to skim this and either approve P0+P1, edit the open questions, or push back on architecture. Once approved, P0+P1 is ~1 session of work and immediately gives you a better swarm reviewer than the current `quorum-counsel`-as-reviewer setup.
