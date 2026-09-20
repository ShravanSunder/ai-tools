# Main-agent ownership validation evidence

## Live behavior

The configured ACPX live harness has two evidence tiers: registered scenarios use Luna high subjects, required-source-read gates, and Terra medium semantic judges; named legacy scenarios use Luna high real subjects plus legacy self-report, schema, and regex assertions without a Terra semantic disposition.

```sh
pnpm --dir tests/skills exec vitest run evals --config vitest.config.ts -t <scenario-id>
```

Terminal passing scenario IDs:

- `manage-agents-design-phase-not-sidekick-author`
- `orchestrator-design-authors-not-sol-executor`
- `spec-design-main-authors-settled-sections`
- `program-design-no-delegated-target-models`
- `plan-implementation-main-authors-plan`
- `plan-improve-repo-main-authors-admitted-plan`
- `orchestrator-implementation-goal-multi-pr-main-assessment`
- `orchestrator-implementation-goal-route-proof-to-review`
- `plan-handoff-successor-main-authority`
- `spec-handoff-successor-main-authority`
- `track-show-me-your-work-coordination-execution-roots`
- `skills-creation-proof-main-assessment-review-order`
- `agent-collaboration-multi-pr-thread-local-seats`

The first `orchestrator-design-authors-not-sol-executor` run failed because its hidden semantic criterion demanded actual artifact authoring and a phase-source read while the visible prompt required a chat-only next-actions plan. The prompt remained chat-only; the case added observable `spec-design` and `plan-implementation` reads and graded the requested in-session authorship decision. The terminal rerun passed every deterministic and semantic evaluator. This is a fixture correction, not a historical behavior-improvement claim.

`manage-agents-design-phase-not-sidekick-author` and `skills-creation-proof-main-assessment-review-order` remain legacy real-subject/self-report-plus-regex cases. Their terminal command summaries passed, and their saved `final.json` files contain the subject responses; those files are not evaluator dispositions, neither case produced `semantic-judge.json`, and no independent Terra-judgment tier is claimed. The proof-order case ran repeatedly while deterministic positive matchers were narrowed to its actual structured decision vocabulary; its terminal subject response stated fitting proof, substantive main assessment, independent review, and fresh correction proof in that order. The manage-agents legacy fixture now describes the title policy consistently, but it was not rerun for that policy. Existing registered semantic cases independently cross-check the governing authorship and delivery-order concepts.

The title-policy correction used the existing modern `orchestrator-design-authors-not-sol-executor` registration, whose required reads include `manage-agents/SKILL.md`. Its first affected run passed source-read and scenario-contract evaluation but remained inconclusive under Terra because the subject used the Worker emoji for an implementation Sidekick and the judge lacked a bounded authoritative mapping. The correction made the Agent Roles table the single runtime emoji source and placed its verified mapping only in the grader criterion. The one authorized rerun passed the scenario contract, source-read, tool-budget, deterministic gate, and all three Terra semantic criteria at `1.00`; terminal result was `1/1` passed, `235` skipped, exit `0`. The user-facing main title remained unchanged, and unsupported or unverified naming stayed an honest capability gap rather than alias proof, retry, or session replacement.

After main assessment found that the new Run 11 wording could overrun existing exception/evaluation paths, the delivery-order gate was narrowed to implemented behavior-changing delivery. Mechanical work remains static-only, explicit implementation-review skips do not fabricate review coverage, and source-only evaluation remains unverified/deferred with no shipping authority. Fresh `skills-creation-proof-main-assessment-review-order` proof passed. Earlier `skills-creation-evaluate-on-disk-route` runs remain failed history: their source-only responses preserved the no-edit and missing-authoring-commission boundaries but missed deterministic output vocabulary or exposed proof literals in the visible prompt. Prompt-only fixture corrections then requested the existing classification, route citation, compact summary, coverage label, first-fix location, and commission boundary without changing runtime source, assertions, or the harness. The terminal focused command passed `1/1` with exit `0` (`235` skipped). Because that visible prompt instructed classification and the route citation, the pass is not evidence of spontaneous skill-driven routing. Its genuine observed signal is retrieval of the current references, read-only/no-edit behavior, correct handling of the missing authoring commission, and an honest partial source-only review. This closes only that bounded evaluate-route gate; there is no completed `presentation-tui` review, behavior-proof, shipping, or historical behavior-improvement claim.

## Static and platform proof

```sh
pnpm --dir tests/skills run test:unit
pnpm --dir tests/skills run typecheck
git diff --check
jq empty plugin-sources.json .agents/plugins/marketplace.json .claude-plugin/marketplace.json .cursor-plugin/marketplace.json plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json plugins/shravan-dev-workflow/.cursor-plugin/plugin.json plugins/agent-router/.codex-plugin/plugin.json plugins/agent-router/.claude-plugin/plugin.json
claude plugin validate .
codex plugin list --marketplace ai-tools --available --json
```

Results: unit suite `121/121` passed; TypeScript passed, including the corrected modern case registration; diff and JSON checks passed; Claude marketplace validation passed. Focused pointer inspection confirmed the program-design caller now names its owning `Bounded Evidence Help` section. Codex marketplace discovery succeeded and showed `agent-router` available, while installed/discovered versions remained from the unrefreshed main marketplace checkout as expected. No cache refresh was used as proof.

The active `skill-creator` quick validator passed all twelve original changed skills and the fresh manage-agents/program-design wording checks using temporary PyYAML in an isolated `/tmp` UV cache. The vendored `agent-collaboration` Markdown tree matches upstream commit `828b18d21d065b1be2e453c7c6ff9c3241c70a43` recursively; only plugin-owned `agents/openai.yaml` is additional.
