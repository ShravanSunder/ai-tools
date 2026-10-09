# Skill authoring plugin: Program Design

How the system satisfies the [Specification](2026-10-02-skill-authoring-plugin.md) (`E1`–`E15`, `R1`–`R51`), which traces to the [Requirements](user-requirements.md) (`U1`–`U35`). Entity terms follow the Specification; code names appear only in the shape and home cells.

## The system at a glance

Two new homes replace one old one:

- the `skill-authoring` **plugin**: five skills, cut out of today's `skills-creation` and `skill-audit` files; their scenarios live under `tests/skills/pressure-scenarios/skill-authoring/`;
- the `skill-eval-runner` **package**: everything that runs and grades scenarios.

`shravan-dev-workflow` loses both skills and every check that treats a skill as special.

```mermaid
flowchart TB
  subgraph PLUGIN["plugins/skill-authoring (new plugin)"]
    ORCH["skill-orchestrator<br/>owns: the lifecycle of one Skill change"]
    CREATE["skill-creation (was skills-creation)<br/>owns: the craft, the Skill spec format"]
    REVIEW["skill-review<br/>owns: review checks, Review findings"]
    PRESS["skill-pressure-testing<br/>owns: proof method, scenario method"]
    AUDIT["skill-audit (moved)<br/>owns: Audit recommendations"]
  end
  subgraph RUNNER["packages/skill-eval-runner (new package: Deno, run with pnpm dlx)"]
    CLI["eval CLI<br/>owns: batch, exit status"]
    LOAD["scenario loader<br/>owns: Scenario validity"]
    ENV["subject environment<br/>owns: snapshot, exposed skills, isolated agent home"]
    SUBJ["subject runner<br/>owns: Run, Observation"]
    QA["QA evaluator<br/>owns: Check results, Run verdict"]
    JEV["Jev decision port<br/>owns: nothing (adapter)"]
    JUDGE["judge-leaf agent<br/>owns: nothing (adapter)"]
    LINT["skill lint<br/>owns: code lint findings"]
    BAR["done-bar assessor<br/>owns: Done-bar result"]
    REP["batch reporter<br/>owns: report files"]
  end
  SCEN[("tests/skills/pressure-scenarios/owner/skill/<br/>Scenario + Check trees + Question cards")]
  SDW["plugins/shravan-dev-workflow (modified)<br/>two skills removed, no skill-specific handling"]
  ORCH --> CREATE & REVIEW & PRESS
  REVIEW -- "loads craft references by path" --> CREATE
  PRESS -- "tells the agent to run<br/>pnpm dlx file:… skill-eval-runner" --> CLI
  REVIEW -- "lint" --> CLI
  CLI --> LOAD & ENV & SUBJ & QA & LINT & BAR & REP
  LOAD -- reads --> SCEN
  SUBJ -- "ACPX library: gpt-6-luna medium" --> EXT1(["Luna subject (codex-acp)"])
  QA --> JEV & JUDGE
  JEV -- "Question card + retrieved evidence" --> EXT2(["Jev tool (built by another agent)"])
  JUDGE -- "ACPX library: gpt-6-luna high" --> EXT3(["Luna judge (codex-acp)"])
  SDW -. "no link" .-x PLUGIN
```

**What changes and what stays.**
- The five skills are mostly today's files in new homes. The genuinely new parts are the orchestration skill's own main path, several reviewer agents plus Jev lint in review, the scenario method, and the runner.
- Grading moves from regexes and one all-criteria judge to one decision tree per Check: code steps over recorded actions, then Jev questions, then a Luna-high judge only at a leaf the tree names.
- The subject still runs through ACPX, now as a library inside the runner's own Deno process, in an isolated agent home that sees only the snapshot's skills.
- The old pressure runner, its scenarios, and its schemas are deleted (hard cutover, `R45`). `tests/skills` keeps only its static skill-contract tests, plus the new-form scenarios under `pressure-scenarios/`.

## Where today's files go

Every file in `skills-creation` and `skill-audit` was read in full on 2026-10-06. This map is the core of the split; "moved" means the content moves with only the edits named.

| Today | Lines | New home | Edit on the way |
|---|---|---|---|
| `skills-creation/SKILL.md` craft: mental model, four surfaces, invocation, information hierarchy, call grammar, progressive disclosure, leading words, steering, what belongs in `SKILL.md` | 10–128 | `skill-creation/SKILL.md` | role emojis removed; the Operator dispatch form becomes "a helper agent running a prescribed procedure" |
| `skills-creation/SKILL.md` steps 1–5 (promise and success, authoring basis and proof posture, trigger, main path, depth) and step 7 (implement) | 176–247, 253–255 | `skill-creation/SKILL.md` | `discuss-pathfinding` / `practices-research` become "ask the user" / "read the sources"; humanizer loads deleted |
| `skills-creation/SKILL.md` lifecycle: two review stages, convergence rule, accepted boundary, run summary, workflow intro, steps 6, 8, 9, 10, completion blockers | 130–174, 249–251, 257–317 | `skill-orchestrator/SKILL.md` | owner brief becomes "bring the decision to the user"; trace lines deleted |
| `review/spec-review.md` "Spec Artifact" (the Skill spec doc and its slots) | 9–27 | `skill-creation/references/skill-spec.md` | gains the run-status slot (`R8`) |
| `review/spec-review.md` ordered checks, verdicts, blockers, rubric, reduction, labels | 1–8, 29–81 | `skill-review/references/spec-review.md` | points to `skill-spec.md` for the artifact |
| `review/implementation-review.md` | all | `skill-review/references/implementation-review.md` | routing of accepted findings names the owning step instead of a `skills-creation` step |
| `review/lanes/lane-schema.md` | all | `skill-review/references/checks/review-schema.md` | "lane" wording retired; reduction done by the review lead |
| `review/lanes/` nine checks | all | `skill-review/references/checks/<check>.md` | craft loads become `../../../skill-creation/references/…`; the claim ladder load becomes `../../../skill-pressure-testing/references/proof-and-claims.md` |
| `frontmatter-design.md`, `reference-design.md`, `worked-examples.md`, `glossary.md`, `platform-mechanics.md`, `security-gate.md` | all | `skill-creation/references/` | glossary "Lane" entry rewritten; `docs-maintain` and `ops-security-review` pointers become plain needs |
| `reference-lanes-design.md` | all | `skill-creation/references/shared-shape-design.md` | renamed for what it owns |
| `testing/pressure-testing.md` | 1–66, 71–75 | `skill-pressure-testing/references/proof-and-claims.md` | "Running The Suite" (67–70) replaced by `runner-usage.md` |
| (none) | | `skill-pressure-testing/references/scenario-authoring.md` (new) | the work `pressure-testing.md:71` says nobody owns |
| (none) | | `skill-pressure-testing/references/runner-usage.md` (new) | commands, outputs, done bars |
| (none) | | `skill-review/references/jev-lint.md` (new) | the narrow Jev questions and the code that chooses where they apply |
| `skill-audit/SKILL.md` | all | `skill-audit/SKILL.md` | the source-inspiration pointer and the workflow-swarm paragraph become repo-neutral; recommendations gain fix owner, recurrence, and source date (`R42`–`R44`) |
| `agents/openai.yaml` (both) | all | one per new skill | display names under "Skills:" |

**Cross-skill loads stay inside the plugin.** Review judges against the craft, so six review checks load craft references (`trigger-routing` → `frontmatter-design.md`, `placement-and-calls` → `reference-design.md`, `mental-model-fit` and `rule-agreement` → `glossary.md`, `sensitive-surface` → `security-gate.md`, `claim-vs-evidence` → `proof-and-claims.md`). Installed plugins keep skills as siblings, and the runner exposes the whole skill set as siblings too, so relative paths resolve everywhere. Layering inside the plugin: the orchestrator names the other four; creation, review, pressure testing and audit may name each other; none names the orchestrator.

## Choices that shaped the structure

| Crux | Chosen | Rejected, and why | Reopen if |
|---|---|---|---|
| Who owns the Skill spec | `skill-creation`: steps 1–5 write it, and its format already exists at `spec-review.md:9–27` | the orchestration skill. It only carries the spec between runs and records review; it never writes spec content | the orchestrator starts writing spec content |
| Where the craft lives once review is separate | in `skill-creation`, loaded by review by path | a plugin-wide shared folder. That matches `shravan-dev-workflow`'s convention but leaves the craft with no owning skill | a third skill needs the craft |
| How review becomes multi-agent | three reviewer agents, each walking a family of checks in its own session, plus Jev lint; one review lead verifies each candidate at its anchor and reduces | one reviewer walking all checks (today's rule at `glossary.md:28`, `implementation-review.md:23`). The owner asked for several reviewers | review cost outweighs findings on small changes |
| Where grading logic lives | in data: each Check's decision tree and Question cards are declared beside the Scenario; the runner only executes trees | per-scenario TypeScript evaluators. Every scenario would become code | trees need loops or arithmetic the code-step catalog cannot express |
| What the subject sees | a snapshot of the repository at the chosen revision, minus the default scenario root `tests/skills/pressure-scenarios/`, the scenario directory in use, any `scenarios/` folder beside a skill, and every path matched by the repository's `.skill-eval-hide` (gitignore-style patterns naming evaluation material: eval specs, eval changelogs, the runner source); the skill set at that same revision exposed as `.agents/skills/`, used in place when it already lives there; and an isolated agent home with only a link to the user's login | the user's real Codex home. Measured: it loads the personal `AGENTS.md`, 19 installed plugins (one of them the old `skills-creation`) and user skills, about 31k input tokens before the prompt. Leaving evaluation docs in the snapshot: measured 2026-10-07, subjects read the fix spec and changelog that described their own checks, then passed. Hiding all of `docs/`: removes context subjects legitimately use, such as changelog conventions | a host has no file-based login; a criterion leaks through skill text itself (a skill-review finding, not a snapshot rule) |
| Which Codex the adapter runs | the user's installed `codex` (`CODEX_PATH`), with `codex-acp@1.6.2` pinned | the adapter's bundled Codex. Measured: it rejects `gpt-6-luna` with a 400 while reporting the turn completed | the adapter pin moves |
| How Deno starts under `pnpm dlx` | the package `bin` is a Node shim that runs Deno from the package's own `deno` npm dependency | a `#!/usr/bin/env deno` shebang, which needs a global install (`R50`) | `pnpm dlx` gains a runtime selector |
| Jev before its tool exists | a `JevDecisionPort` with a no-engine adapter that always answers `unavailable`, which falls in the uncertain band (`R32`) | calling OpenRouter Jev directly. That builds the Jev tool here, against the owner's assignment | the Jev tool ships |
| Where results go | `${XDG_CACHE_HOME:-~/.cache}/skill-evals/<repo-slug>/<batch-id>/`, or `--out` | the repository's `tmp/`, which dirties repositories under test | owners want results committed beside scenarios |

**Debt we accept:**
- **Early runs are judge-heavy.** Until the Jev tool and Calibrations exist, every Jev node falls in the uncertain band. *Payer:* run cost. *Closed when:* Calibrations exist per card and engine.
- **`new-from-intent` bars are not evaluable yet.** They need Jev lint (`R38`). *Payer:* the plugin cannot claim its own done bar (`R48`). *Closed when:* the Jev tool ships.
- **Subjects run on Codex only.** *Payer:* skills aimed at other agents are proven only on Codex. *Closed when:* a second ACP adapter is pinned and probed.
- **Repositories that keep skills in `.codex/skills/` (open).** The skill set is exposed under `.agents/skills/`; whether Codex also discovers a tracked `.codex/skills/` in the snapshot, and so sees each skill twice, is unverified. *Payer:* such repositories (agent-studio is one) may get duplicate skills in a Run. *Closed when:* one live probe settles discovery and the runner handles it.
- **The new-from-intent bar never runs scenarios yet.** It returns `not-evaluable` until the Jev tool exists, so it fails closed. *Closed when:* the Jev tool ships and the bar runs one fresh Run per active scenario.
- **Subject token counts are the last request, not the Run (open).** `Observation.usage` and `subjectTokenTotal` record the last model request (see Verified runtime facts). Measured on two Runs: 35,558 and 38,747 recorded against 149,180 and 154,180 in Codex's session log, about 72% of it cached input. *Payer:* cost per scenario is not reported correctly, and no cheaper-than-before claim can be made. *Closed when:* the owner picks the usage source (Codex's session log in the isolated home, or an acpx fix that sums per-request usage) and a Run's recorded total matches Codex's own.

## Verified runtime facts (2026-10-06)

Probed with a throwaway script: Deno 2.9.6 from npm, `acpx@0.19.4` `acpx/runtime`, `@agentclientprotocol/codex-acp@1.6.2`, installed Codex CLI 0.160.0, `gpt-6-luna` medium, five calls.

- `createAcpRuntime` → `ensureSession({mode: "oneshot"})` → `startTurn` runs under Deno; turns complete in 8–12 s; usage comes per turn in `result._meta.quota` and `getStatus().usage`. Corrected 2026-10-07: `getStatus().usage.cumulative` is the turn's last model request, not its total. acpx overwrites the field on each update, and no per-request usage events reach the runner. Measured on a 4-request turn: 14,474 reported against 56,817 in Codex's own session log.
- A repo-local skill at `<snapshot>/.agents/skills/<name>/SKILL.md` is discovered; asked a triggering question, the subject read that `SKILL.md` (an `execute` tool call naming its path) and followed it.
- `CODEX_HOME` and `HOME` pointed at fresh temporary directories, plus `features.remote_plugin = false`, leave only the snapshot's skills and Codex's bundled skills (`imagegen`, `openai-docs`, `skill-creator`, `skill-installer`); input tokens drop from 31k to 3k. `features.skip_host_skill_discovery` changes nothing. A symlinked `auth.json` is enough to log in.
- A write attempt in the read-only sandbox reaches the client's permission handler as an `execute` request; rejecting it fails the tool call and leaves the snapshot unchanged.
- The adapter's bundled Codex rejects `gpt-6-luna` with HTTP 400 inside the reply text while the turn reports `completed` with empty `model_usage`.
- A prompt that names a skill explicitly (`$name`) gets that `SKILL.md` injected into context with no tool call, and the subject follows it; a skill found through its description is read with a visible tool call.
- Run inside another agent's Codex sandbox, the runner's subjects see plain reads escalate to permission requests (nested sandboxes); run from a normal shell, the same scenario reads with no requests. The runner refuses to start inside a Codex sandbox.
- `pnpm dlx` caches a `file:` package by its path and reuses that copy for a day, so local edits run stale; the documented invocation is `pnpm --config.dlx-cache-max-age=0 dlx file:<dir>`, which installs the current folder each time (a few seconds).
- `pnpm dlx file:<dir>` installs the package under `node_modules`, where Deno will not strip TypeScript types, so the `bin` shim copies `src/` to a temporary directory, links the package's own installed dependencies beside it, and starts Deno there.
- With `features.multi_agent_v2.enabled = true` an isolated subject can start a helper agent; the parent's events show it as an `other` tool call titled `Start subagent <name>` plus a `wait`, while the helper's own reads stay in its own thread.

## Where each entity lives

```mermaid
flowchart LR
  E1["E1 Skill package"] --> H1["any repo: skill directory (existing)"]
  E4["E4 Scenario"] --> H4["tests/skills/pressure-scenarios/owner/skill/*.scenario.md (new)"]
  E5["E5 Check"] --> H4
  E15["E15 Question card"] --> H15["tests/skills/pressure-scenarios/owner/skill/cards.yaml (new)"]
  E12["E12 Calibration"] --> H12["card calibration, keyed by engine (new)"]
  E6["E6 Run · E7 Observation · E8 Check result · E9 Run verdict · E10 Done-bar result"] --> HR["runner: report files in the batch dir (new)"]
  E2["E2 Skill change · E3 Skill spec"] --> HC["chat, or repo docs/wip/skills-authoring/date-name/ (existing convention)"]
  E11["E11 Review finding"] --> HC
  E13["E13 Audit recommendation"] --> HA["the user's chosen home (ask)"]
  E14["E14 Plugin"] --> HP["plugins/name/ + three manifests (existing)"]
  SCH["all runner shapes: packages/skill-eval-runner/src/contracts/ (new, Zod)"]
```

**Conventions found:**
- **Root `AGENTS.md`** and the owner's TypeScript rules: no `any`, explicit types, discriminated unions, `readonly`, Zod derivation (`z.infer`).
- **The current runner** (`tests/skills/lib/.../scenario-case-types.ts:5`) uses plain interfaces and ajv; it is deleted, not followed.
- **The new package** uses Zod 4 schemas as the runtime types; cards and trees keep the field names the orchestration Inspector fixed (`id, serves, evidence, type, question, combine, calibration`).

| E | Semantic owner | Package or module home | Schema/type home | Shape at each boundary | Disposition | Convention |
|---|---|---|---|---|---|---|
| E1 Skill package | the repository that holds it | any repo; `plugins/skill-authoring/skills/<skill>/` for the plugin's own (new) | `runner/src/contracts/skill-ref.ts` (new) | `SkillRef {repoRoot, skillPath}` on CLI input | persisted (git) | Zod |
| E2 Skill change | skill-orchestrator | `plugins/skill-authoring/skills/skill-orchestrator` (new) | the Skill spec's kind field | `kind: "new-from-intent" \| "fix-for-recorded-failure"` passed to `done-bar` | persisted (doc) or chat | Markdown |
| E3 Skill spec | skill-creation (format); skill-orchestrator updates run status | chat, or `docs/wip/skills-authoring/<date-name>/spec.md` | `skill-creation/references/skill-spec.md` (new; from `spec-review.md:9–27`) | slots: targets and runs, problem and evidence, success, decisions, per-run surfaces, basis and proof plan, coordination, non-goals, run status `{run, state: proposed\|implemented\|reviewed\|shipped}`, review record | persisted or chat | Markdown |
| E4 Scenario | scenario loader | `<scenario dir>/<scenario-id>.scenario.md`, where `<scenario dir>` defaults to `tests/skills/pressure-scenarios/<owner>/<skill>/` (`<owner>` is the directory holding the skill set, the plugin for `plugins/<plugin>/skills/<skill>`; when that directory is not strictly inside the repository, as for `<repo>/skills/` or a skill set at the root, there is no owner segment and the default is `tests/skills/pressure-scenarios/<skill>/`, while `.agents/skills/<skill>` keeps `.agents` as owner) and `--scenarios <dir>` overrides it (new) | `runner/src/contracts/scenario.ts` (new) | `ScenarioFile` (below) | persisted | Zod |
| E5 Check | scenario loader (validity); QA evaluator (execution) | inside the Scenario file | `runner/src/contracts/check-tree.ts` (new) | `CheckTree` (below) | persisted | Zod discriminated union on `kind` |
| E15 Question card | scenario loader | `<scenario dir>/cards.yaml` (new) | `runner/src/contracts/question-card.ts` (new) | `QuestionCard` (below) | persisted | Zod, Inspector field names |
| E12 Calibration | QA evaluator (reads); authored offline | inline on the card in `<scenario dir>/cards.yaml`, keyed by engine (new) | the card schema in `runner/src/contracts/` | `calibration: {<engine>: {bands, labelledSet, measuredAt}}`; a Jev answer from an engine with no entry is uncertain | persisted | Zod |
| E6 Run | subject runner | batch dir | `runner/src/contracts/run.ts` (new) | `RunOutcome` (below) | persisted (report) | Zod |
| E7 Observation | subject runner | batch dir `runs/<run-id>/observation.json` | `runner/src/contracts/observation.ts` (new) | `Observation` (below) | persisted | Zod |
| E8 Check result | QA evaluator | batch dir `runs/<run-id>/checks.json` | `runner/src/contracts/check-result.ts` (new) | `CheckResult` (below) | persisted | Zod |
| E9 Run verdict | QA evaluator | batch dir `runs/<run-id>/verdict.json` | `runner/src/contracts/run-verdict.ts` (new) | `RunVerdict` | persisted | Zod |
| E10 Done-bar result | done-bar assessor | batch dir `done-bar.json` | `runner/src/contracts/done-bar.ts` (new) | `DoneBarResult` (below) | persisted | Zod |
| E11 Review finding | skill-review (review lead) | the Skill spec's review record | `skill-review/references/checks/review-schema.md` (moved from `lane-schema.md`) | Check Finding fields plus `state: candidate\|verified-at-anchor\|accepted\|rejected` | persisted (doc) or chat | Markdown |
| E13 Audit recommendation | skill-audit | the user's chosen home (`R10`) | `skill-audit/SKILL.md` output shape | `{action: update\|create\|merge\|skip, fixOwner: prose\|code-check\|tool, signals[], recurrence, sourceDate}` | persisted (doc) | Markdown |
| E14 Plugin | repository maintainers | `plugins/skill-authoring/` (new); `plugins/shravan-dev-workflow/` (modified) | the three manifest schemas (existing) | three `plugin.json`; three marketplace entries | persisted | existing manifest form |

`packages/skill-eval-runner` is abbreviated `runner/`.

### The scenario file

````markdown
---
scenarioId: skill-creation-draft-artifact      # kebab-case, unique per skill
skill: skill-creation                          # the name of the skill directory under test
status: active                                 # draft | active | retired
allowWrites: false                             # first pass accepts only false
timeoutSeconds: 600                            # optional
followUps: []                                  # optional scripted user turns, same session
fixtures:                                      # optional: files the request points at, placed in the snapshot
  - source: fixtures/example-spec.md           # relative to this scenario directory
    target: docs/wip/skills-authoring/2026-08-02-example/spec.md   # repo-relative path in the snapshot
---

## Prompt

Organic user request, exactly as the subject sees it. May invoke a skill by name (`$skill-creation`).

## Checks

```yaml
checks:
  - id: drafts-real-text
    criterion: The reply contains drafted SKILL.md text, frontmatter and body, not a description of it.
    root: drafted
    nodes:
      drafted:
        kind: jev
        card: reply-contains-drafted-skill
        branches: { yes: pass, no: fail, uncertain: judge-drafted }
      judge-drafted:
        kind: judge
        evidence: [finalMessage]
```
````

Sections other than `## Prompt` and `## Checks` are allowed and ignored by the runner; nothing but the Prompt and follow-ups reaches the subject (`R22`). Banned words match as whole words and their simple inflections, case-insensitively (`test`, `tests`, `testing`; `evaluate` is allowed). A fixture's target must stay inside the snapshot and must not already exist there. File references in steps and evidence are strings: `skill:<path>` (the scenario's skill), `skill(<name>):<path>` (a sibling skill in the same set), `repo:<path>`.

### Contract shapes the runner exposes

```ts
// runner/src/contracts/check-tree.ts
const nodeRef = z.string();   // a node id, or one of the reserved terminals "pass" | "fail" | "inconclusive"
export const treeNodeSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("code"), step: codeStepSchema,
                   onTrue: nodeRef, onFalse: nodeRef }),             // an undecidable step is always inconclusive (R26)
  z.object({ kind: z.literal("jev"), card: z.string(),
             branches: z.object({ yes: nodeRef, uncertain: nodeRef, no: nodeRef }) }),     // yes_no card
  z.object({ kind: z.literal("jev-choice"), card: z.string(),
             branches: z.record(z.string(), nodeRef), uncertain: nodeRef }),               // choice card
  z.object({ kind: z.literal("judge"), criterion: z.string().optional(),                     // defaults to the Check's criterion
             evidence: z.array(evidenceSourceSchema).default(["finalMessage"]),
             tools: z.array(z.string()).max(0).default([]) }),                             // prescribed tools: later pass
]);
export const checkTreeSchema = z.object({ id: z.string(), criterion: z.string(), root: nodeRef,
                                          nodes: z.record(z.string(), treeNodeSchema) });

// runner/src/contracts/evidence-source.ts: what a card or judge leaf is given, retrieved by code (R26)
export const evidenceSourceSchema = z.union([
  z.literal("finalMessage"),        // the subject's last reply
  z.literal("conversation"),        // every user turn and reply, in order
  z.literal("toolCalls"),           // kind, title, status of every tool call
  z.object({ file: fileRefString }),// a file of the snapshot at the run's revision
]);

// runner/src/contracts/question-card.ts
export const questionCardSchema = z.object({ id: z.string(), serves: z.string(), type: z.enum(["yes_no", "choice"]),
  question: z.string(), options: z.array(z.string()).optional(), evidence: z.array(evidenceSourceSchema).min(1),
  combine: z.unknown().optional() });

// runner/src/contracts/observation.ts
export type Observation = {
  readonly runId: string; readonly scenarioId: string; readonly revision: Revision;
  readonly subject: { readonly model: string; readonly effort: string };
  readonly turns: readonly { readonly index: number; readonly userText: string; readonly assistantText: string; readonly stopReason?: string }[];
  readonly toolCalls: readonly { readonly id: string; readonly turnIndex: number; readonly kind?: string; readonly title: string;
                                 readonly status: "completed" | "failed" | "pending"; readonly inputText?: string; readonly outputText?: string }[];
  readonly permissionRequests: readonly { readonly turnIndex: number; readonly toolCallId?: string; readonly kind?: string; readonly title?: string; readonly decision: "rejected" }[];
  readonly finalMessage: string;
  readonly usage: { readonly inputTokens: number; readonly outputTokens: number; readonly totalTokens: number };
  readonly durationMs: number;
};

// runner/src/contracts/run.ts
export type RunOutcome =
  | { readonly kind: "observed"; readonly runId: string; readonly observation: Observation }
  | { readonly kind: "execution-failed"; readonly runId: string;
      readonly cause: "permission-stop" | "agent-start-failed" | "model-unavailable" | "acpx-error" | "timeout" | "cancelled" | "credential-exposure";
      readonly detail: string };

// runner/src/contracts/check-result.ts
export type CheckResult = {
  readonly checkId: string;
  readonly result: "pass" | "fail" | "inconclusive";
  readonly decidedBy: "code" | "jev" | "judge" | "terminal";
  readonly path: readonly { readonly nodeId: string; readonly kind: TreeNode["kind"];
                            readonly outcome: string; readonly evidence: readonly string[] }[];
};

// runner/src/contracts/run-verdict.ts
export type RunVerdict = "execution-failed" | "inconclusive" | "fail" | "pass";

// runner/src/contracts/done-bar.ts
export type DoneBarResult =
  | { readonly kind: "met"; readonly bar: "new-from-intent" | "fix-for-recorded-failure"; readonly runs: readonly string[] }
  | { readonly kind: "not-met"; readonly reason: "check-failed" | "lint-failed" | "failure-not-reproduced" | "fewer-than-3-passes" }
  | { readonly kind: "not-evaluable"; readonly reason: "execution-failed-run" | "inconclusive-run" | "no-active-scenario" | "jev-lint-unavailable" };

// runner/src/judge/judge-verdict.ts: what the judge agent must return as its whole reply
export type JudgeVerdict =
  | { readonly kind: "decided"; readonly result: "pass" | "fail"; readonly evidenceQuote: string; readonly rationale: string }
  | { readonly kind: "undecidable"; readonly reason: "evidence-insufficient" | "criterion-ambiguous" };
// a malformed or missing judge reply becomes CheckResult "inconclusive" (C3)
```

**The code-step catalog** (`runner/src/qa/code-steps.ts`) is closed, so scenario authors compose and never script. Every step reads recorded actions only; none reads the subject's prose (`R24`):
- `readFile: <fileRef>`: the subject read the file's content: a completed `read` tool call on it, or a completed command segment that reads the named file's content: `cat`, `head`, `tail`, `less`, `more`, `nl`, `bat`, `awk`, `sed` without `-i`, or `rg`/`grep` searching inside it. Listing or naming modes are not reads: `echo`, `ls`, `test`, `wc`, `rg --files`, `rg -l`/`--files-with-matches`, `grep -l`, `grep -c`. Authored references keep their `skill:<relative-path>` form; when matching, the resolved path must include the skill's directory name (exposed or repo-relative), so another skill's file of the same name does not match;
- `loadedSkill: <name?>`: `readFile` of that skill's `SKILL.md` (default: the scenario's skill). Only meaningful when the prompt does not name the skill: an explicitly named skill is injected without a read, so the loader rejects `loadedSkill` for a skill the prompt names;
- `noWritesAttempted: {}`: no permission request and no `edit`, `delete` or `move` tool call;
- `toolCallCount: {max: n}`;
- `startedSubagents: {min: n}`: at least `n` tool calls started a separate agent (Codex titles them `Start subagent <name>`); a helper's own actions are not in the parent's Observation.

A step the Observation cannot decide, and a Jev node or judge leaf whose evidence is missing, make the Check `inconclusive` (`R26`); no tree can route missing evidence to `pass` or `fail`. A Jev node's `uncertain` branch is for an unsure answer, never for absent evidence.

## The components and who owns what

| Component | Owns (one truth) | Lives in | Interface | Consumers | Changes when |
|---|---|---|---|---|---|
| eval CLI | batch lifecycle and exit status | `runner/src/cli.ts` | `skill-eval-runner validate \| run \| lint \| done-bar` | the skills, any agent | CLI surface changes |
| scenario loader | Scenario/Check/Card validity | `runner/src/scenarios/` | `resolveScenarioDirectory(SkillRef, override?) → dir` (default `tests/skills/pressure-scenarios/<owner>/<skill>/`, or `--scenarios`); `loadScenarios(SkillRef, dir, ids?) → {kind:"loaded", scenarios} \| {kind:"invalid", errors}` | CLI, QA evaluator | scenario format changes |
| subject environment | the snapshot, the exposed skill set, the isolated agent home | `runner/src/environment/` | `prepareEnvironment(SkillRef, revision) → {kind:"ready", env} \| {kind:"failed", reason}` and `env.dispose()` | subject runner, judge-leaf agent | isolation mechanics change |
| subject runner | Run and Observation | `runner/src/subjects/` | `runSubject(scenario, env, config) → RunOutcome` | CLI, done-bar assessor | ACPX or agent config changes |
| QA evaluator | Check results and Run verdict | `runner/src/qa/` | `evaluateRun(scenario, outcome, ports) → {checks, verdict}` | CLI, done-bar assessor | tree semantics change |
| Jev decision port | nothing (adapter) | `runner/src/jev/` | `ask(card, evidence) → {kind:"answered", value, score} \| {kind:"unavailable", reason}` | QA evaluator, skill lint | the Jev tool's interface changes |
| judge-leaf agent | nothing (adapter) | `runner/src/judge/` | `judge({criterion, request, evidence}) → JudgeVerdict \| {kind:"malformed"}` | QA evaluator | judge prompt or model changes |
| skill lint | code lint findings | `runner/src/lint/` | `lintSkills(skillSetDir, rules) → LintFinding[]` | CLI, done-bar assessor, skill-review | lint rules change |
| done-bar assessor | Done-bar result | `runner/src/done-bar/` | `assess(kind, SkillRef, {base?, head}) → DoneBarResult` | CLI | bar rules change |
| batch reporter | report files and token tally | `runner/src/report/` | `writeBatch(batch) → {dir}` | CLI | report format changes |
| skill-orchestrator (skill) | the lifecycle of one Skill change, run status in the Skill spec | plugin | skill text | authoring agent | authoring workflow changes |
| skill-creation (skill) | the craft; the Skill spec format | plugin (moved, renamed) | skill text | orchestrator, author, skill-review | craft rules change |
| skill-review (skill) | review checks, Review findings, reduction | plugin (moved checks, new main path) | skill text, plus `lint` | orchestrator | review method changes |
| skill-pressure-testing (skill) | proof method and scenario method | plugin (moved method, new scenario method) | skill text, plus `run` and `done-bar` | orchestrator, author | proof or scenario method changes |
| skill-audit (skill) | Audit recommendations | plugin (moved) | skill text | owner, author | audit method changes |

**Forbidden edges**, enforced by `lint` rules and a repository search (`V2`):
- plugin skills naming `shravan-dev-workflow` skills or files, and the reverse;
- `qa/` importing `subjects/` or `environment/` (it reads only `RunOutcome`);
- `judge/` importing `jev/` (`R33`): the judge input type has no field for a Jev answer;
- any runner module writing inside the repository under test.

### How the subject environment is built (R30, R51)

1. **Snapshot.** `working-tree` (default) copies every tracked and untracked-not-ignored file (`git ls-files -co --exclude-standard -z`) into a fresh temporary directory; a commit revision uses `git archive <rev> | tar -x`. The default scenario root `tests/skills/pressure-scenarios/`, the scenario directory in use (when `--scenarios` puts it elsewhere) and any `scenarios/` folder beside a skill are removed from the snapshot, and so is every path matched by the repository's `.skill-eval-hide` (read from the live repository so a base and its head hide the same material; unsupported pattern syntax is invalid input before any Run), so no subject can read a checklist or the documents that state one (`R25`). The skill set is exposed next (step 2), then the Scenario's fixtures are copied to their targets, so a fixture lands even under a hidden path. Finally the snapshot becomes a one-commit git repository (`git init`, then one unsigned, hook-free commit `snapshot` by the fixed author `snapshot <snapshot@localhost>`, with the user's git config off, in a cleared environment so git overrides in the runner's own environment cannot redirect it), so `git status`, `git log` and `HEAD` work as in an ordinary checkout. The repository under test is never written.
2. **Expose the skill set.** The skill under test's parent directory is its skill set (for plugins, `<plugin>/skills/`). The skill set is taken from the snapshot, so it is the run's revision, never the live working tree; a skill set outside the repository with a commit revision is invalid input. Every sibling directory holding a `SKILL.md` is copied, without its `scenarios/` folder, to `<snapshot>/.agents/skills/<name>/`; a `shared-references/` beside the skill set is copied to `<snapshot>/.agents/shared-references/`, so `../../shared-references/` paths still resolve. A skill set already at the repository's `.agents/skills/` is used in place. A different skill set whose name already exists there is `failed(skill-name-conflict)`.
3. **Isolate the agent home.** Fresh `0700` directories for `CODEX_HOME` and `HOME`; the Codex home gets a unique per-Run name (`codex-home-<random>`), so the credential detector (see Trust boundary) never matches ordinary prose; `CODEX_HOME/auth.json` is a symlink to the user's `${CODEX_HOME:-~/.codex}/auth.json`. The runner checks only that the link target exists; it never reads, copies, or logs it (security decision: allowed, link only). No file-based login → `failed(no-agent-login)`.
4. **Launch settings.** Agent argv `[node, <codex-acp@1.6.2 bin from the runner's own dependencies>]`; environment `CODEX_HOME`, `HOME`, `CODEX_PATH` (`--codex-path`, else `codex` on `PATH`, else `failed(codex-not-found)`), `INITIAL_AGENT_MODE=read-only`, and `CODEX_CONFIG` = `{model, model_reasoning_effort, approvals_reviewer: "user", shell_environment_policy: {exclude: ["CODEX_HOME"]}, features: {hooks: false, remote_plugin: false, memories: false, multi_agent_v2: {enabled: true}}}`. Subagents are on because `skill-review` and `skill-orchestrator` must start separate agents. The shell exclusion keeps the subject's commands from being told where its linked login lives (see Trust boundary).
5. **Dispose.** The runner deletes only the temporary directories it created, after the Run's files are written.

## One run, from command to verdict

```mermaid
sequenceDiagram
  autonumber
  participant A as Agent (via skill-pressure-testing)
  participant C as eval CLI
  participant L as scenario loader
  participant E as subject environment
  participant R as subject runner
  participant X as ACPX runtime (library)
  participant Q as QA evaluator
  participant J as Jev decision port
  participant G as judge-leaf agent
  participant P as batch reporter
  A->>C: pnpm dlx file:…/skill-eval-runner run --repo R --skill P --runs N
  C->>L: loadScenarios(SkillRef, scenario dir)
  L-->>C: loaded | invalid(errors) → exit 2, no subject runs (R22–R24)
  par N runs, fresh sessions (R35)
    C->>E: prepareEnvironment(SkillRef, revision)
    E-->>C: ready(snapshot, exposed skills, isolated home) | failed → execution-failed
    C->>R: runSubject(scenario, env, gpt-6-luna medium)
    R->>X: createAcpRuntime + oneshot session; permission handler rejects and records (R30)
    X-->>R: tool calls, permission requests, text, usage
    R-->>C: observed(Observation) | execution-failed(cause) (R36)
    C->>Q: evaluateRun(scenario, outcome)
    loop each Check tree
      Q->>Q: code steps over the Observation (R24, R26)
      Q->>J: ask(card, retrieved evidence)
      J-->>Q: answered(score) | unavailable → band via Calibration (R32)
      opt tree reaches a judge leaf
        Q->>G: criterion + request + evidence only (R33)
        G->>X: oneshot session, gpt-6-luna high, empty cwd, all tools denied
        G-->>Q: decided(pass|fail) | undecidable | malformed → inconclusive
      end
    end
    Q-->>C: CheckResult[] + RunVerdict (R37)
    C->>E: dispose()
  end
  C->>P: write batch (verdicts, judge-leaf rate, tokens)
  C-->>A: exit 0 all pass | 1 any not pass | 2 invalid input or environment
```

**Current → proposed delta** (current anchors under `tests/skills/lib/skill-pressure-evaluation/`):

| Edge | Status | Current | Proposed |
|---|---|---|---|
| entry | changed | `pnpm --dir tests/skills run test:evals` → vitest → `evals/skill-pressure.eval.ts` | `pnpm dlx file:…/skill-eval-runner run`; no test framework in the run path |
| scenario load | changed | `scenario-cases/parse-scenario-fixture.ts` reads `tests/skills/pressure-scenarios/<plugin>/<skill>/*.md` with `expect_*` regex fields | the loader reads `tests/skills/pressure-scenarios/<owner>/<skill>/*.scenario.md`, or the `--scenarios` directory; `expect_*` fields are rejected (`R45`) |
| subject prompt | changed | `subject-execution/render-subject-prompt.ts:24` opens with "You are running a Codex skill pressure test" and asks for a self-report JSON | the subject gets the Prompt text only; no wrapper, no self-report (`R22`, `R23`) |
| subject start | changed | `agent-execution/acpx-codex-agent-runner.ts:286` spawns the `acpx` CLI in the real repo with the user's Codex home | `acpx/runtime` in-process, in the subject environment above; the codex-acp pin and read-only mode are kept |
| deterministic gate | removed | `evaluators/deterministic/legacy-pressure-assertions.ts` regexes and self-report fields | none; code steps read recorded actions only |
| semantic judge | removed | `evaluators/semantic/semantic-criteria-evaluator.ts`: one judge call over all criteria at `xhigh` | per-Check judge leaf at `high`, only where the tree reaches one |
| verdict | changed | per-row vitest pass/fail; the semantic overall puts inconclusive before fail (`semantic-criteria-evaluator.ts:411-419`) | `RunVerdict` aggregation (`R37`): any fail makes the Run `fail`, then any inconclusive makes it `inconclusive` |
| results | changed | `tmp/skill-pressure-evals/` in the ai-tools repo | the batch dir outside the repository |

## How a Check is decided

```mermaid
stateDiagram-v2
  [*] --> CodeStep
  CodeStep --> CodeStep: true / false branch
  CodeStep --> Inconclusive: evidence unavailable (R26)
  CodeStep --> JevNode
  JevNode --> JevNode: band yes / no branch
  JevNode --> JudgeLeaf: uncertain branch (tree-defined)
  JevNode --> Inconclusive: uncertain branch (tree-defined)
  JudgeLeaf --> Pass: decided pass
  JudgeLeaf --> Fail: decided fail
  JudgeLeaf --> Inconclusive: undecidable or malformed
  CodeStep --> Pass: terminal
  CodeStep --> Fail: terminal
  JevNode --> Pass: terminal
  JevNode --> Fail: terminal
  Pass --> [*]
  Fail --> [*]
  Inconclusive --> [*]
```

**Loader checks on every tree:** every reference resolves; the graph is acyclic; every path ends in a terminal or a judge leaf; every `jev` node names a card the skill's `cards.yaml` declares with the matching type; every file reference resolves in the repository at load time.

**Banding (`R32`):**
- The QA evaluator, not the Jev tool, turns a score into a band, using the card's `calibration` entry for the answering engine.
- With no entry for that engine, or an `unavailable` answer, the band is `uncertain`.
- The evaluator never passes a Jev answer onward (`R33`).

**The judge prompt** (`runner/src/judge/judge-prompt.ts`) carries the user's request (Prompt and follow-ups), the criterion, and the retrieved evidence. It tells the judge to read the criterion exactly as written and to treat the request as context for scope only: never fail work for lacking something the request did not ask for, and never fail it for departing from the request when the criterion is met (`R25`). The judge replies with exactly one `JudgeVerdict` JSON object, and the Check result records its quote and rationale so every judge decision can be audited. The judge session runs in an empty temporary directory, with its own Codex home, and every permission request rejected. Measured on 2026-10-07: an earlier prompt ("decide only against what the user's request asked") made the judge grade against the request instead of the criterion. Also measured that day: adding "accept wording that means the same thing as the criterion; do not require its exact words" changed none of six replayed decisions (12 calls). The fails that looked literal came from criteria worded stricter than the obligation they were converted from, so the fix belongs in the criterion, checked by passing the real reply and failing a known-bad one; the prompt stays as it is.

## Lint

`skill-eval-runner lint --skill-set <dir> [--forbid <word>]…` runs code checks over a skill set and reports candidate findings (`path:line`, rule, message):
- `name` equals the directory name; `description` exists, is at most 1024 characters, and starts with "Use when";
- every backticked relative `.md` path in a skill file (`references/…`, `./…`, `../…`) resolves;
- no forbidden word appears (for `R3`: `shravan-dev-workflow` in the plugin; the old plugin-qualified names repository-wide).

Jev lint cards (duplicated rule, a rule losing its home, trigger overlap; `R19`) run through the same `JevDecisionPort`; until the tool ships they are reported `not-run: no Jev engine`. Lint findings are candidates: `skill-review` verifies each at its anchor like any other finding (`R17`).

## Done bars

| Bar | Flow (done-bar assessor) | Result |
|---|---|---|
| new-from-intent (`R38`) | `lint` (code rules, then Jev cards) over the changed skills, then one run per active Scenario at `head` | `met` if lint passes and every Scenario has a `pass` run; `not-evaluable(jev-lint-unavailable)` while Jev cards cannot run |
| fix-for-recorded-failure (`R39`) | snapshot `base`, run the named Scenario once and expect `fail`; snapshot `head`, run 3 fresh sessions and expect `pass` × 3 | `met`, `not-met(failure-not-reproduced \| fewer-than-3-passes \| check-failed)` |
| any bar (`R40`) | any `execution-failed` or `inconclusive` Run | `not-evaluable`, never `met` |
| improvement claim (`R41`) | the same Scenarios at `base` and `head`, reported side by side | a report section, not a bar |

## Failure, partial success and concurrency

| Boundary | Detection | Contained as | Recovery owner | Proof |
|---|---|---|---|---|
| scenario invalid | loader validation | `invalid(errors)`, exit 2, no Run started | author fixes the file | V5 |
| snapshot or exposure fails | `git` exit, unknown rev, name conflict | that Run `execution-failed(agent-start-failed)` with the reason | user | V6 |
| no login or no Codex | link target or `codex` missing | exit 2 before any Run, naming the fix | user | V6 |
| agent fails to start, times out, or is cancelled | runtime error, timeout, signal | `execution-failed(cause)` for that Run only | user reruns; other Runs keep results | V6, V9 |
| the model never ran | turn `completed` with zero token usage | `execution-failed(model-unavailable)` with the reply text as detail | user (model or Codex version) | V6 |
| subject tries to write | permission handler | request rejected and recorded; the Run continues | none needed (`R30`) | V9 |
| Jev unavailable | port returns `unavailable` | uncertain band, so the tree's uncertain branch | none | V7 |
| judge malformed or silent | strict JSON parse or timeout | retried once in a fresh judge session; still malformed → that Check `inconclusive`, both raw replies recorded | user reruns | V6 |
| cancel a batch (Ctrl-C) | signal | finished Runs written; unstarted Runs reported not run | user | V6 |

**Parallel Runs:** each has its own environment, ACPX runtime, session and process: no shared history or mutable state (`R35`). The reporter writes per-run files and aggregates once at the end. `--parallel` (default 3) is backpressure on local CPU and agent quota.

## Trust boundary

- **Subjects can't write** (`R30`): read-only sandbox, a permission handler that approves only read and search requests and rejects and records every other request, and a snapshot copy, so nothing reaches the repository under test.
- **Subjects see nothing of the host** (`R51`): isolated `CODEX_HOME` and `HOME`; remote plugins off; only the snapshot's skills exposed.
- **The login is linked, never handled:** the only host credential path is the `auth.json` symlink target; the runner checks existence only.
- **An agent can read its linked login, so the runner withholds it and drops that result:** the read-only sandbox lets a subject or the judge read its own `CODEX_HOME/auth.json` (measured 2026-10-08: readable, no permission request). Neither one's shell commands inherit `CODEX_HOME` (`shell_environment_policy.exclude`). A tool call matches when its title, input or output names that agent's own Codex home: the path as given or resolved, or the directory's name as a whole path segment, so `$HOME/../codex-home-<run>/auth.json` matches. Bare `auth.json` or `CODEX_HOME` text does not match, so reading a repository file that mentions them stays an ordinary Run; each Run's home has a unique name, so ordinary text cannot name it by accident. A subject match makes the Run `execution-failed(credential-exposure)`: matched calls' input and output are withheld, the Observation is dropped before anything is written or judged, and the detail names each matched call's id and title (at most 120 characters), never its content. A judge match makes that judge answer `undecidable(judge-credential-exposure)`: the reply is dropped, the Check is inconclusive, and nothing the judge read reaches `checks.json`. The runner itself never reads the credential. Residual risks: a read by a path that contains neither the home path nor its name (for example a glob such as `$HOME/../codex-h*`) is missed; reads inside subagent threads a subject starts are not inspected, and a helper's report flows back as the parent's `wait` tool output, caught only if it names the home; the judge has parity with the subject (same shell exclusion, same detector), no more.
- **The judge is isolated:** its own session in an empty directory; it sees only the request, criterion, and evidence; it never sees subject identity, revision labels, or Jev answers.
- **Secrets stay out of Jev:** evidence is assembled by code; the loader rejects card evidence that names files matching the credential pattern (`credential|escrow|token|secret|password|keychain|auth|api.?key|private.?key`), per the owner's standing rule.
- **Nothing gets installed** (`R49`, `R50`): `pnpm dlx` runs the package in a temporary environment; Deno and codex-acp come from the package's own dependencies; the user's existing `codex` is used, never installed.

## Cutover

**Plugin split, with nothing coexisting:**
1. Create `plugins/skill-authoring/` with three manifests, a README, and marketplace entries in `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, and `.cursor-plugin/marketplace.json` (the Cursor file uses `pluginRoot` plus a relative source, so the entry follows its shape).
2. Build the five skills from the file map above.
3. In `shravan-dev-workflow`:
   - delete `skills/skills-creation/` and `skills/skill-audit/`;
   - delete the skill-package check and its `skills-creation` gate from `spec-design`, `program-design`, `plan-implementation`, `implement-plan`, `plan-improve-repo`, `spec-program-review` (and its `classifying-review-requirement.md`), `implementation-review`, `implementation-pr-wrapup`, `implementation-handoff` (and two references), `docs-maintain`, `discuss-clarify-mental-models`, `practices-research` (and `evidence-ledger.md`), and `orchestrator-implementation-goal` (and `goal-contract-and-routing.md`);
   - delete the `runtime-skill-package` classification from `shared-references/phase-return-tokens.md`, so `ready-for-review` always means implementation review;
   - update the three manifests' skill lists, the plugin README, and `shared-references/humanizer.md`'s consumer list; bump the version.
   - The maintainer of work breakdown and skill review owns four of these files and reviews that diff before merge.
4. Update the repository `AGENTS.md` Skill Work SOP and skills table to the new plugin and names.

**Scenario cutover (`R45`–`R47`):**
- Add `packages/skill-eval-runner/`.
- Delete the pressure runner from `tests/skills`: `lib/skill-pressure-evaluation/`, `evals/`, `schemas/`, `pressure-scenarios/` (old form), `retired-pressure-scenarios/`, and fixtures used only by them. Keep the static contract tests and their fixtures; remove from them only assertions about the deleted scenario files.
- Rewrite the 16 moved Scenarios in the new form under `tests/skills/pressure-scenarios/skill-authoring/<skill>/`.
- Rewrite a proving set of four `shravan-dev-workflow` scenarios, one per Check shape: `manage-agents-custom-agent-boundary` (code-heavy), one `spec-design` (judge leaf), one `implementation-review` (several cards), one `discuss-pathfinding` (choice card).
- List every other old scenario in `docs/wip/skills-authoring/2026-10-06-unconverted-scenarios.md` as not running, so none is reported as passing.

**Delivery slices** (a `gh stack` on top of the design PR):
1. the design (this document and its siblings);
2. the plugin split and the `shravan-dev-workflow` cutover (one hard cutover);
3. the runner package, the converted scenarios, and the pressure-runner deletion.

## How each requirement works and how we verify it

| U | R | E | owner | interface | shape and home | state | failure | proof |
|---|---|---|---|---|---|---|---|---|
| U1, U4 | R1 five skills exist | E1, E14 | plugin | skill directories | five `SKILL.md` under `plugins/skill-authoring/skills/` | none: static | none: static | V1 install transcript |
| U2 | R2 loads without sdw | E14 | plugin | manifests | three `plugin.json` | none: static | none: static | V1 |
| U2 | R3 no cross-names | E14 | plugin + sdw | lint `--forbid` + search | lint rules | none: static | lint finding | V2 |
| U2 | R4 no skill handling in sdw | E14 | sdw skills | none: the check is removed | `phase-return-tokens.md` (modified) | none | none | V3 search |
| U1, U12 | R5 old names gone | E14 | repo | search | — | none: static | search hit | V2 |
| U3 | R6 any repo | E1 | eval CLI | `--repo`, `--skill`, `--scenarios` | `SkillRef` | none | `invalid(unknown-path)` | V1, V5 |
| U10, U14 | R7 read before claiming | E1 | skill-orchestrator | step 1 | orchestrator `SKILL.md` | none: method | review rejects unread claims | V4 |
| U10, U13 | R8 run status | E2, E3 | skill-creation (format), skill-orchestrator (updates) | Skill spec run status | `skill-creation/references/skill-spec.md` | proposed→implemented→reviewed→shipped | a run not shown shipped is never reported shipped | V4 |
| U10, U20 | R9 independent check | E2, E11 | skill-review | reviewer agents with no authoring history | `skill-review/SKILL.md` | candidate→verified→accepted/rejected | no second agent → not reviewed | V4 |
| U10 | R10 ask for other practices | E2 | skill-orchestrator | ask step | orchestrator `SKILL.md` | none | none | V4 |
| U15 | R11 write vs proof | E2 | skill-creation | authoring basis | step 2 | basis fixed at authorization | intent-first never blocked for no RED | V4 |
| U16 | R12 triggers | E1 | skill-creation, skill-review | `frontmatter-design.md`, `trigger-routing` check, Jev trigger-overlap card | `cards.yaml` | none | finding | V4, V7 |
| U17 | R13 reachable teaching | E1 | skill-creation, skill-review | `depth-coverage`, `placement-and-calls`, lint path rule | lint rules | none | finding | V4 |
| U18 | R14 one home per rule | E1, E2 | skill-review | `rule-agreement`, Jev duplicated-rule card | lint cards | none | finding | V4, V7 |
| U19 | R15 proportionate | E2 | skill-creation | `worked-examples.md`, craft | `SKILL.md` | none | finding | V4 |
| U4 | R16 multi-reviewer + Jev lint | E11 | skill-review | three reviewer agents + `lint` | `skill-review/SKILL.md` | finding states | one reviewer only → not reviewed | V4 |
| U20 | R17 verify at anchor | E11 | skill-review lead | verify step | `review-schema.md` finding state | candidate→verified | unverified → not accepted | V4 |
| U21 | R18 separate properties | E11 | skill-review | check families | `checks/*.md` | none | none | V4 |
| U22 | R19 narrow Jev lint | E5, E11, E15 | skill lint | `lint` | lint cards; applicability by code | none | Jev unavailable → not-run | V7 |
| U20 | R20 count ≠ verification | E11 | skill-review lead | reduction rule | `skill-review/SKILL.md` | none | none | V4 |
| U11 | R21 scenario directory | E4 | scenario loader | discovery, `--scenarios` override | `tests/skills/pressure-scenarios/<owner>/<skill>/*.scenario.md` | none | not found, or a `--scenarios` directory holding the skill or at the repository root → `invalid`, exit 2 | V5 |
| U25 | R22 organic prompt | E4, E6 | scenario loader | banned-word check | `contracts/scenario.ts` | none | `invalid(banned-word)` | V5 |
| U6 | R23 decision tree | E5, E15 | scenario loader | tree validation | `contracts/check-tree.ts` | none | `invalid(tree)` | V5 |
| U6, U23 | R24 no text matching | E5, E7 | scenario loader + QA evaluator | closed code-step catalog | `qa/code-steps.ts` | none | unknown step → `invalid` | V5 |
| U24 | R25 prompt scope | E5, E8 | judge-leaf agent | judge prompt | `judge/judge-prompt.ts` | none | finding in review | V4, V8 |
| U26 | R26 retrieve, else inconclusive | E5, E7, E8 | QA evaluator | evidence sources | `contracts/evidence-source.ts` | none | missing → `inconclusive` | V6 |
| U30 | R27 one subject run | E6, E7 | subject runner | `runSubject` | `RunOutcome` | started→observed / execution-failed | — | V9 |
| U7 | R28 models | E6, E8 | subject runner, judge-leaf agent | launch settings | `subjects/agent-launch.ts` | none | model never ran → `model-unavailable` | V9 |
| owner 10-04 | R29 ACPX library | E6 | subject runner | `acpx/runtime` | `package.json` dependency | none | import failure → exit 2 | V9 |
| U28 | R30 read-only | E6, E7 | subject runner | permission handler | `Observation.permissionRequests` | none | rejected, recorded | V9 |
| U8 | R31 follow bands | E5, E8, E15 | QA evaluator | `evaluateRun` | `TreeNode` branches | node→node | — | V6, V7 |
| U8 | R32 calibrated bands | E12, E15 | QA evaluator | band mapping | the card schema's `calibration` entry | none | no entry for the engine → uncertain | V7 |
| U8, U20 | R33 judge isolation | E8, E15 | judge-leaf agent | `judge()` input type has no Jev field | `judge/judge-input.ts` | none | — | V8 |
| U5 | R34 no judge unless leaf | E8, E9 | QA evaluator | tree walk | `CheckResult.decidedBy` | none | — | V7 |
| U7, U29 | R35 parallel, fresh | E6 | eval CLI | `--parallel` | one environment and session per Run | none | one Run's failure isolated | V9 |
| U28 | R36 execution-failed | E9 | subject runner | `RunOutcome.execution-failed` | `contracts/run.ts` | started→execution-failed | cause recorded | V6 |
| U27, U28 | R37 verdict order | E8, E9 | QA evaluator | aggregation | `RunVerdict` | none | earlier fail kept | V6 |
| U9 | R38 new bar | E10 | done-bar assessor | `assess(new-from-intent)` | `DoneBarResult` | none | `not-evaluable(jev-lint-unavailable)` today | V4 |
| U9 | R39 fix bar | E10 | done-bar assessor | `assess(fix…)` | `DoneBarResult` | base fail → head pass ×3 | `failure-not-reproduced` | V10 |
| U28 | R40 not evaluable | E9, E10 | done-bar assessor | bar rule | `DoneBarResult.not-evaluable` | none | — | V6 |
| U29 | R41 improvement claim | E9 | batch reporter | base vs head section | report | none | — | V10 |
| U31 | R42 audit actions | E13 | skill-audit | output shape | `skill-audit/SKILL.md` | none | — | V4 |
| U32 | R43 fix owner | E13 | skill-audit | `fixOwner` field | same | none | — | V4 |
| U33 | R44 sourced lessons | E13 | skill-audit | source and date fields | same | none | — | V4 |
| U6, U12 | R45 new form only | E4 | scenario loader | rejects `expect_*` | `contracts/scenario.ts` | none | `invalid(legacy-form)` | V5 |
| owner 10-04 | R46 16 + proving set | E4 | plugin + sdw | scenario files | `tests/skills/pressure-scenarios/` dirs | draft→active | — | V11 |
| owner 10-04 | R47 unconverted listed | E4, E9 | repo | inventory doc | `docs/wip/skills-authoring/2026-10-06-unconverted-scenarios.md` | none | — | V11 |
| acceptable evidence | R48 own done bars | E10 | done-bar assessor | `assess` over plugin skills | `DoneBarResult` | none | not evaluable until Jev lint | V11 |
| U34, U35 | R49 own package, pnpm dlx | E14 | eval CLI | `bin` shim → Deno | `packages/skill-eval-runner/package.json` | none | — | V12 |
| U35 | R50 no installs | E1, E14 | plugin skills | skill text + search | install-command search | none | search hit | V12 |
| U3, U7, U25 | R51 isolated subject | E6 | subject environment | `prepareEnvironment` | `environment/` | none | `failed(reason)` → no Run | V9 |

## Proof seams

| Seam | Real | Replaced | Observation |
|---|---|---|---|
| loader validation (V5) | parser, schemas | nothing | `invalid(errors)` before any process starts |
| QA evaluator (V6, V7) | tree walk, banding, aggregation | recorded Observations and a scripted `JevDecisionPort` | `CheckResult.path`, `RunVerdict` |
| judge isolation (V8) | judge prompt builder | the ACPX session replaced by a capturing fake | captured input has no Jev answer, score, or route |
| subject environment (V9) | snapshot, exposure, isolated home | nothing | a real Luna run lists only the snapshot's and built-in skills; a write is rejected and recorded |
| subject runner (V9) | `acpx/runtime`, codex-acp pin, Deno | nothing | two parallel real runs, no shared history |
| plugin load (V1) | Claude Code and Codex installs | nothing | install and invocation transcripts with sdw absent |
| done bars (V10, V11) | the whole runner | nothing | `done-bar.json` with run ids |

**Illegal states kept out:**
- **Unrepresentable (Zod):** a judge leaf with tools (first pass); a code node that routes unavailable evidence anywhere but `inconclusive`; a `RunVerdict` of `pass` with a failing `CheckResult` (aggregation derives it).
- **Rejected at the loader:** a regex or `expect_*` field, a banned word, a tree that cannot reach a terminal, an unknown card or step, an evidence file matching the credential pattern, `allowWrites: true` (first pass), a fixture whose source is missing or whose target escapes the snapshot.
- **Rejected at runtime:** a subject write, by the permission handler.

## Open items

- **Codex only.** The isolation recipe is Codex-specific; a second adapter needs its own probe.
- **Hosts without a file-based login** (keyring credentials) get `no-agent-login`; a keyring route is not designed.
- **Prescribed judge tools** (`R33`'s code-execution or composition case) are rejected by the loader until a scenario needs them.
- **The Jev tool's interface** is unverified. `JevDecisionPort` mirrors a question-card-plus-evidence call; only the adapter changes when the tool ships.
- **Where Audit recommendations live (E13)** is the user's choice per run (`R10`).
