# Collaboration listen routing, launch routing, and CLI DX

Status: **WIP, not accepted to implement.** Research from 2026-09-15 session mining. No skill edits, plugin bump, cache refresh, or `my_agents.md` change is authorized by this document.

Success when accepted:

- Idle on a shared board thread uses `board thread listen` / `board thread wait`, not `message list` polls, sleep loops, or repeating wakes. The user does not have to type “use listen.”
- “Router topic/thread + reviewer at model/effort” means: collaboration owns the board; **manage-agents owns the launch** (native `spawn_agent` or ACPX with model/effort). Agents do not block claiming Router has no `session create --model`.
- Agents can **rename** a session to a stable working title and **list sessions with scope/filters** (cwd/checkout/repo, source, model, title) without dumping a page and `jq`. First-message titles like “Greet user” are not the identity.
- First-try CLI mistakes from 2026-09-15 stop being the default path.

## 1. What happened

On 2026-09-15, Codex and Claude agents coordinating a Perseus marketing board thread (`01a0a580-daf7-7c92-aea2-f0fe01e3724c`) repeatedly substituted **wake**, **watch**, **`board message list`**, **`wait_agent`**, and **sleep/Monitor loops** for process-owned listen. The user had to nudge listen at least five times on the Codex parent and once on Claude. After the nudges, listen still failed on stale `listenId`, invalid `--from`, join required, invented `--actor self`, borrowed parent session identity, and Control socket/approval errors.

This is not “the word listen is missing from the installed board reference.” Plugin and Codex-cache `message-board.md` already say use `board thread listen` when a process should sleep. Agents still did not take that path because **always-on waiting instructions name wake**, Choose-the-action has **no wait/listen IF**, and the parent kept polling even after a live listener existed.

Cursor recent chats in this window did not run the collaboration CLI, so there is no Cursor transcript proof. The same skills still ship conceptually through `my_agents.md`; Cursor cache currently has **no** `agent-router` plugin tree.

## 2. User listen reminders (Codex + Claude, 2026-09-15)

Private board text omitted. Session IDs are local Codex/Claude logs under `$HOME`.

| When (UTC) | Host | Session | User wording (sanitized) | Agent did instead / after |
|---|---|---|---|---|
| 16:17 | Claude | `d73563e7-…` | use a cron or listen … there is a listen function | Read listen `--help`, claimed no Router identity, then `while true` + `board message list` + `sleep 45` for ~2h |
| 16:26 | Codex | `01a08d3a-…` | keep a wake … **use listen** in `$agent-router:agent-collaboration` | Read listen `--help`, spawned a listener Operator, then **cancelled it** as a side quest |
| 18:09 | Codex + Claude | same work | wakes **or watch** the thread, there is a command | Codex: `board thread watch` + repeating wake, **no listen**. Claude: listen with invented `--actor self`, then join/identity thrash |
| 18:27 | Codex | `01a08d3a-…` | keep listen in the background | Operator listen `--for 50m` succeeded (`listenId` `01a0a653-…`) |
| 18:37 | Codex | `01a08d3a-…` | **why not listen?** what is unclear in instructions or my skill | Parent was still doing `board message list` and claiming it was checking the thread **while the listener was live** |
| 19:53 | Codex | `01a0a677-…` | **use listen?** | Polled `message list`; then `listen show` on the **dead** `listenId`; re-arm used `--from 35` after the Reader already had a Batch |

False positives: conversational “listen,” I want to say something (2026-09-11) is not the CLI.

## 3. Other agent-collaboration mistakes that day

Clustered from Codex rollouts 2026-09-15 (plus the long-lived parent `01a08d3a` whose collab use started that day). About 135 live `agent-collaboration` command executions, ~20 failures, 9 sessions.

1. **Invented flags / wrong tree:** `--thread-id` (correct: `--root-message-id`); `--repo` (correct: `--repository-path`); `agent-collaboration project|topic|thread` without `board`.
2. **Topic post instead of thread create:** `board message post --placement topic` refused with `threadCreateRefusal` / corrective `board thread create --role … (--watch|--no-watch)`. Twice on onboarding, once on the parent.
3. **Watch substituted for listen:** after an explicit “there is a command,” agent watched and kept the wake.
4. **Join skipped:** `listen --watched` returned join corrective / participant refusal.
5. **`--actor self` vs JSON:** Claude used `--actor self` on listen (join accepts `self`; clap listen help omits it; runtime may still accept it). Codex children passed the **parent** `sessionId` `01a08d3a-…` as actor, so reviewer posts attributed to the parent.
6. **Stale listen handle:** `listen show --listen-id` on another session’s expired id; claimed “existing event listener.”
7. **`--from` as activity cursor after Delivered exists:** `fromActivitySequence` invalidField; next working command omitted `--from`.
8. **Socket / approval classified poorly:** `permissionDenied` `requestApproval` at `socketConnect`; `boardUnavailable` at socket-connect / manifest-read. Same command later worked after host approval. One child looked up a **nonexistent** skill path under `shravan-dev-workflow/.../agent-collaboration`.
9. **Receipt fiction:** claimed listener armed, or treated a local pid as proof, before a `listenId` / batch.
10. **DM identity:** one-char `serviceId` typo; `nativeRejected` inspect; send after the listen socket was gone.
11. **Wake ID field mix:** `wake show --wakeup-id` used IDs that did not match printed `changeId`.
12. **Two `listen`s:** agents said “event listener” meaning board listen. Skill `session-messaging.md` also teaches `events listen` for turn completion. No `events listen` CLI was actually run. No `inbox` CLI in Sep 08–15 Codex rollouts.

## 4. Session launch treated as a Router capability gap

Same day, different Perseus session: `01a0a6b1-51c9-7753-b1ab-9332f59c05cf` (cwd `perseus-agent.headless-tools`). The user asked for a Router topic/thread **and** another reviewer at **Astra, medium**. The agent created the topic/thread and posted the packet, then repeatedly told the user the problem was a **Router tool-capability mismatch**.

Quoted claim (2026-09-15T20:49:45Z): installed Router endpoint only exposes existing sessions and `conversation prompt --new`; it does not expose session creation with `model = Astra` / `reasoning effort = medium`; therefore the reviewer cannot be created and no substitute is honest.

That is the wrong layer. Collaboration is not the coding-session launcher.

| Layer | Job | What the agent did |
|---|---|---|
| `agent-collaboration` | Discover/create **board** topic/thread, post packet, join, listen/wait, message an **existing** SessionRef | Did the board part, then looked for `session create --model` |
| `manage-agents` | Choose Reviewer + Astra medium, then **native Codex `spawn_agent`** (`gpt-6-astra`, `reasoning_effort: medium`, `fork_turns: none`) or ACPX if a persistent/cross-provider route is required | Never used. Reported Router blocked instead |
| Native Codex | Example in `native-providers-codex.md` is exactly Astra medium reviewer spawn | Unused |
| `conversation prompt --new` | ACP prompt helper: **no model/effort**, cancels permissions. Not a reviewer launcher | Treated as the only creation surface, then refused it |

The skill **taught** this refusal. `session-messaging.md`:

> This skill does not promise a general coding-session creation command. On the documented installed surface, `conversation prompt --new` cancels permission requests and has no model/effort controls … if no route satisfies the assignment, report the exact capability gap.

Pressure `creation-capability.md` grades the same move: do not use `conversation prompt --new` as a coding launcher. It does **not** grade “then spawn via manage-agents.” Failure signal is only claiming creation success or substituting a session. Compliant agents therefore **stop** and blame Router.

`manage-agents` Choose the runtime makes it worse when the user said “Agent Router”:

- Sidekick/Advisor: named ACPX or an **existing** Router conversation; do not invent a native child merely because the model exists.
- “IF a Router route is selected, load `agent-collaboration` and return verified exact SessionRef, input capability, and model/access fit; **reuse the original address.**”
- Reviewers otherwise **prefer native dispatch**. Codex spawning OpenAI → `spawn_agent` with model/effort.

User said Router **topic/thread** (board) + Astra reviewer. Agents read “Router” as “the reviewer must be created by the collaboration CLI,” then the no-create paragraph fires. Native Astra-medium spawn was available the whole time. A native child already has a session id Router can inspect later; that is not the same as collaboration creating the model.

This is the same class of bug as listen: **collaboration used as the wrong primitive**, then an honest-looking capability report.

## 4b. Session inventory: rename and scoped list

Same worktree, after the user created another Codex session and said “made another session here, ask it to review,” then “try again, I said hi to it.”

The orchestrator listed Control inventory, could not tell which session was new, asked for a title, then on retry found `01a0a6d9-…` titled **Greet user** (the first user message was “hi”). Reviewer children showed **blank titles**. Discovery was:

```text
agent-collaboration sessions list --endpoint codex-local --view stored --json --page-size 100
# then jq select(.workingDirectory=="…/perseus-agent.headless-tools")
```

That is the only Control list surface. `NativeSessionListParams` is endpoint + view + page_size + cursor. **No cwd, checkout, repo, source, model, or title filter.** The skill tells agents to dump the page to a scratch file and filter locally. Titles are first-message / native `name` fallbacks. There is **no** `session rename` / set-name on the collaboration CLI.

A different CLI already has human catalog filters: `codex-router sessions --list` defaults to **cwd** and accepts `--checkout` / `--repo` / `--any`, `--source interactive|all|subagents`, `--provider`, `--sort`, `--limit`. The picker search uses an explicit Codex `name` **before** the derived first-message title. Agents did not use that catalog because `session-messaging.md` points at unfiltered `sessions list --endpoint --view stored`.

Needed DX (owner request):

1. **Rename** a session/thread to a working title (`headless-tools review`, not `Greet user`). Persist as the explicit `name` the catalog already prefers. Agents and humans can set it after spawn or after “hi.”
2. **List with filters and scope** on the **same Control CLI agents already call**: cwd (default), checkout, repo, any; source (interactive vs subagent); optional title/query; optional model/effort. Return compact rows (id, name, title, cwd, model, status), not a 100-row JSON blob plus jq.
3. Skill: stop teaching dump-and-jq as the discovery path. Use scoped list. If several matches remain, inspect; do not ask the user for a title the CLI should have filtered.

This is Router/CLI work, not only a skill sentence. The catalog already proves cwd/repo/source filters exist for humans; Control inventory and rename do not.

## 5. Instruction gaps (verified)

### Always-on surfaces never name listen/wait

| Surface | What it says today | Effect |
|---|---|---|
| `manage-agents` Waiting | Park with host blocking wait, “event notification,” **authorized Router wake**, or yield. Do not invent a polling interval. | Idle board work → wake or `wait_agent`. |
| `manage-agents` Shared work | Board use = **catch-up or post** via Operator. | Poll `message list` / inbox. |
| `manage-agents` Keep-Alive | **26 minutes**; use awake/wake mechanisms. | Repeating wakes as board keepalive. |
| `my_agents.md` Featured Skills | collaboration = boards, inboxes, **timed wakes**. | Listen never in the always-check table. |
| `my_agents.md` Shared Work | Posts/inbox do not wake. Attention = DMs. Later follow-ups = **timed wakes**. | Explicit wake-for-idle. |
| `my_agents.md` Delegation | No independent work → Waiting / Keep-Alive. | Closed loop back to wake. |
| `my_agents.md` Act mode | Subagent completions are not stop conditions. **Do not wait for a response.** | Contradicts parking; parent keeps turning and listing the board. |
| `agent-collaboration` Choose-the-action | Five IFs: inbox/discussion, send-now, **delayed → timed-wakeups**, schedule, recovery. **No wait/listen IF.** | Waiting-for-board-reply matches delayed message more cleanly than “participate.” Agents can finish without loading `message-board.md`. |
| `track-show-me-your-work` | Discovery, reads, posts, **watches**. | Stops at watch. |
| `agents/openai.yaml` for collaboration | Display name `Collaboration: Agents` (good for picker). Prompt: participate and **inspect**. Short desc: sessions, boards, **wakes**, schedules. | Helps invocation, does not pull wait. |
| `session-messaging.md` last paragraph | No general coding-session create. `conversation prompt --new` has no model/effort. Report the capability gap. | Agents treat missing `session create --model` as the assignment blocker. |
| `manage-agents` Choose the runtime | “Router route” → collaboration, **reuse address**. New persistent relationship → ACPX unless an existing Router conversation exists. Reviewers still prefer native. | “Use Agent Router” + reviewer is read as Router-must-launch, not board-plus-native-spawn. |
| Pressure `creation-capability.md` | Don’t use `conversation prompt --new` as a coding launcher. | Does not require handing launch back to manage-agents. Stops are scored as compliant. |
| `session-messaging.md` discovery | Dump `sessions list --view stored` to a file; `jq` by cwd/title locally. “Ask for an exact target when ambiguous.” | Agents cannot scope in the CLI. First-message titles (`Greet user`) make “the new session here” unidentifiable. |
| `agent-collaboration sessions list` | `--endpoint`, `--view`, `--page-size`, `--cursor` only. Protocol `NativeSessionListParams` matches that. | No cwd/repo/source/title/model filter on the agent path. |
| `codex-router sessions --list` | Cwd default; `--checkout`/`--repo`/`--any`; `--source`; `--provider`; `--sort`; `--limit`. Explicit `name` precedes derived title. | Human picker has scope. Agents are not sent here. No rename command on either CLI. |

### Listen exists, but not on the wait path

Plugin + Codex cache `0.7.1` `message-board.md` line 50 already contain the listen paragraph. Countercheck: forgetting listen is **not** because installed omitted the word.

Canonical Codex Router skill (`codex-router/agent-skills/agent-collaboration/references/message-board.md`) is strictly stronger and **not synced** into ai-tools/cache:

- Join / Participant / Role; join-before-post-or-listen
- `board thread create` instead of topic placement for sessions
- `board thread wait` after dispatch; **sitting in the wait costs no tokens**
- `message list` / `sessions list` / `session inspect` as reply-checks **re-pay the cached read**
- Keep `wake send` for **timed follow-ups only**
- Join may arm listen (`--listen once --max-wait …`)
- `--actor self` = `CODEX_THREAD_ID` or `CLAUDE_CODE_SESSION_ID` only (no Cursor)

Skill still comments “0.1.23 CLI surface”; workspace package is 0.1.27. CLI `board thread` about text still says inspect/watch/list and does not name listen/wait in the parent blurb, though subcommands exist.

### Pressure tests

No scenario grades listen-not-poll or join-before-listen. Nearby cases (`wake-interval-cache-regimes`, `wait-interval-cache-regimes`, `topic-autonomy-and-inbox`) **legitimize wake/inbox/watch** as the wait tools. `wait-interval-cache-regimes` still expects **29-minute** language vs management’s **26**.

## 6. Competing readings

| Hypothesis | Evidence for | Evidence against |
|---|---|---|
| A. Always-on waiting **instructs wake**, so agents comply and skip listen | Waiting, Shared Work, Choose-the-action delayed-IF, 16:26 user also asked for a wake, 18:09 Codex chose watch+wake | Listen paragraph exists in message-board.md; user said “use listen” and agents still only ran `--help` or cancelled the listener |
| B. Listen is buried; agents never load the board ref on wait | Choose-the-action has no wait IF; Claude/Codex read `--help` only after user named the skill | After loading help they still polled; parent polled while a live `listenId` existed |
| C. One chaotic presentation day | All hard reminders are 2026-09-15 on one thread | Multiple hosts (Codex + Claude), multiple sessions, same substitution set; instruction text predicts it |
| D. Installed skill omitted listen | — | **Refuted.** Plugin and 0.7.1 cache already name listen. Gap is wait-routing + unsynced join/wait/anti-poll teaching |

Accepted: **A + B**. C is a caveat on breadth, not a dismissal. D is refuted.

Launch-routing: the Astra-medium session is **instruction-caused**, not a missing Router create API. The no-create paragraph is true as a CLI fact and false as an assignment verdict.

## 7. Proposed fix (not authorized yet)

Do not add a new skill. Patch the existing wait/collaboration loop so listen/wait is the default board-idle tool and wake stays calendar/follow-up.

### Run 1 — routing (highest leverage)

1. **`manage-agents` Waiting:** when the thing being awaited is **board Activity** on a known thread or the agent’s watches, park with `agent-collaboration board thread wait` (once, token-free) or process-owned `board thread listen` (`--once` / `--for`). Host `wait_agent` stays for **native child jobs**. `wake send` stays for **timed follow-ups / cache-unrelated reminders**, not as a substitute for listen. Keep the no-polling rule; name `message list` / inbox fetch as the forbidden “quick check.”
2. **`agent-collaboration` Choose-the-action:** add an IF: waiting for board Activity → load `message-board.md` (wait/listen/join). Keep delayed **messages to a session** on timed-wakeups. Disambiguate **`board thread listen`** vs **`events listen`** (session turn attach) in the SKILL frontmatter/description so “listen” is not ambiguous.
3. **`my_agents.md` Shared Work + Featured Skills:** one sentence: idle on a shared thread uses listen/wait; wakes do not replace it. Clarify Act-mode “do not wait for a response” means **do not pause for a user ack of progress**, not “do not park on board/worker replies.”
4. Sync canonical **join / wait / anti-poll / `--actor self`** paragraphs from Codex Router `message-board.md` into the plugin skill (or pin `plugin-sources.json` to the commit that added them). Bump the stale “0.1.23” comment to the actual documented surface.

### Run 1b — launch vs board (same class of misroute)

1. **`agent-collaboration` SKILL + `session-messaging.md`:** keep “this CLI does not create a coding session with model/effort.” Add the next sentence: that gap is **not** an assignment blocker. Return to `manage-agents` Choose the runtime. Native/ACPX launch the agent; collaboration then discovers the SessionRef, posts/joins the thread, and listens. `conversation prompt --new` remains forbidden as a reviewer/executor launcher.
2. **`manage-agents` Choose the runtime:** “use Agent Router” / a board topic-thread request is **shared-work transport**, not a selected Router launch route. A Router launch route means an **existing** SessionRef to reuse. A new Reviewer/Worker with a named model/effort uses native or ACPX. Do not load collaboration as the creator.
3. **Pressure:** replace or extend `creation-capability.md`. Compliant: refuse `conversation prompt --new` **and** name native `spawn_agent` / ACPX with the requested model/effort, plus board thread for the packet. Failure: “Router has no Astra-medium creation route” while Codex native Astra medium is advertised.

### Run 2 — CLI DX that burned first tries

Put short examples or “follow `nextAction` / `--help`; do not invent flags” on the board reference for:

- `--root-message-id` not `--thread-id`; `--repository-path` not `--repo`
- sessions create threads with `board thread create` + Role + Watch, not `--placement topic`
- join before session post/listen; follow participant refusal
- listen `--from` is an **Activity sequence to initialize Delivered**, omit it once a Batch exists; never copy a high watermark as `--from`
- `--actor self` only when Codex/Claude session env is present; otherwise typed Identity JSON of **this** session, not a parent/reviewer impersonation
- `listen show` only on an **active** `listenId` owned by this process; re-arm on exit 3 or dead id
- do not claim listen armed without returned `listenId` / live handle
- Control `permissionDenied` / socket-connect → request host approval for that command/socket; not “Router is down”

### Run 3 — yaml, Cursor, tests

- Collaboration `openai.yaml` short_description/default_prompt: add wait/listen, not only participate/inspect/wakes.
- Cursor: either ship `.cursor-plugin` for `agent-router`, or document that Cursor agents must use Identity JSON (no `self`). `native-providers-cursor.md` still has no wait section.
- Pressure tests: “must listen/wait, not poll or wake” (fast); “join before listen”; “wake is not board-idle”; optional Cursor `self` failure. Update 29-minute wait-interval fixture to 26 or drop the stale number. Add launch-vs-board case in Run 1b.

### Run 4 — session rename and scoped list (Router CLI)

Product change on Codex Router + collaboration Control, then skill cutover:

1. **`session rename` / set-name:** set the explicit persisted `name` for a SessionRef. Catalog display already prefers that over the first-message title. Without this, “I said hi” produces `Greet user` forever.
2. **Scoped `sessions list` on the Control CLI** (the one `session-messaging.md` teaches): `--cwd` / `--checkout` / `--repo` / `--any`, `--source interactive|subagents|all`, optional `--query` / title match, optional model/effort. Compact `--json` rows. Do not require a 100-row dump plus jq.
3. Align Control protocol `NativeSessionListParams` with those filters, or document that agent discovery should call the existing catalog `sessions --list --format json` with the same flags humans already have. Pick one agent path; two unfiltered vs filtered surfaces is the current bug.
4. Skill: discover with scoped list; rename after identifying a working session; never ask the user for a title the inventory should have provided.

## 8. Surfaces and proof (when accepted)

| Repo | Files |
|---|---|
| ai-tools | `plugins/agent-router/skills/agent-collaboration/SKILL.md`, `references/message-board.md`, `references/session-messaging.md`, `agents/openai.yaml`; `plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md` Waiting + Choose the runtime; pressure scenarios including `creation-capability.md`; changelog + plugin versions |
| devfiles | `shared/my_agents.md` Shared Work, Featured Skills, Act-mode wait sentence |
| Codex Router | stronger board ref; **session rename**; Control `sessions list` scope/filters (or one agent path to the existing catalog `--list`); `NativeSessionListParams`; skill comment/version alignment |

Proof: new pressure scenarios plus a replay of the 2026-09-15 wait choice (board idle → listen/wait command, not wake/list), the Astra-medium review request (board via collaboration, launch via native/ACPX, not “Router cannot create”), and “another session in this worktree” discovery (scoped list finds it; rename replaces `Greet user`). No Router restart, no Homebrew, no cache refresh unless explicitly requested after merge.

## 9. Non-goals

- Changing listen/wait CLI semantics in Router
- Making wake illegal
- Cursor-only wait primitives
- Treating this WIP as an accepted `skills-creation` run
- Adding `agent-collaboration session create --model` as the launch path. Launch stays native/ACPX. Collaboration stays discovery, board, and messaging.
- Treating `codex-router sessions --list` human filters as already solving agent discovery. Agents today call unfiltered Control `sessions list`.

## 10. Evidence pointers (private)

- Codex parent: `~/.codex/sessions/2026/09/10/rollout-2026-09-10T17-29-45-01a08d3a-06ee-7543-bd25-62c6b475aa52.jsonl`
- Codex hot fork: `~/.codex/sessions/2026/09/15/rollout-2026-09-15T15-07-30-01a0a677-9751-7bb3-b147-f5c19be422c1.jsonl`
- Listen children: `…T12-27-29-01a0a5e5-…`, `…T15-54-39-01a0a6a2-c000-…`
- Join miss: `…T14-44-01-01a0a662-…`
- Claude: `~/.claude/projects/-Users-shravan-sunder-Documents-code-presentation-dev-shravan-presentations/d73563e7-ca44-46b7-ab09-a43083f450d0.jsonl`
- Canonical board ref: `codex-router/agent-skills/agent-collaboration/references/message-board.md`
- Installed board ref: `ai-tools/plugins/agent-router/skills/agent-collaboration/references/message-board.md` (matches Codex plugin cache `agent-router/0.7.1`)
- Astra-medium misroute: `~/.codex/sessions/2026/09/15/rollout-2026-09-15T16-10-33-01a0a6b1-51c9-7753-b1ab-9332f59c05cf.jsonl` (topic `01a0a6d1-e71e-79d2-8455-ba00cc9b1206`, thread `01a0a6d2-254c-70b0-a9bd-e376328e111c`, claim at 20:49:45Z)
- Skill text: `session-messaging.md` “does not promise a general coding-session creation command”
- Native launch already documented: `manage-agents/references/native-providers-codex.md` Astra medium `spawn_agent` example
- Pressure that scores the stop as success: `tests/skills/pressure-scenarios/agent-router/agent-collaboration/creation-capability.md`
- Session hunt (`Greet user`): same `01a0a6b1-…` orchestrator; new session `01a0a6d9-1841-7de1-89d8-d4e95d92fed6`; Control list then jq by cwd. Reviewer children `01a0a6cd-…`, `01a0a6c7-…` had empty titles.
- Human catalog already filtered: `crates/agent-collaboration/src/session_commands/session_command_options.rs` (`--checkout`/`--repo`/`--any`, `--source`)
- Agent catalog unfiltered: `crates/agent-collaboration/src/session_inventory_commands.rs`, `NativeSessionListParams`

## 11. Next

Owner review of this WIP. If accepted: `skills-creation` on `agent-collaboration` (wait/listen + launch-vs-board + scoped discovery) plus bounded `manage-agents` Waiting and Choose-the-runtime patches, companion `my_agents.md` sentences, pressure updates including `creation-capability.md`, and a **separate Router implementation** for session rename + Control list filters (Run 4). Related WIP that should not be followed for Router parking: `2026-09-14-fable-review-and-rubric.md` (“on Router, a wake”) — that recommendation is part of the wait-routing gap.
