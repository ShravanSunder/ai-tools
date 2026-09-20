# Implementation plan: main-agent ownership

Main-authored delivery plan for [the governing skill-change spec](spec.md), revision 2. This plan is executable only after that spec has an accepted independent proposal-review result. Requested terminal: three reviewable, unmerged PRs. The governing user direction is the main-designs-and-plans topology recorded in the spec; implementation agents may not edit either document.

## Assignments and dependencies

```text
Main: spec + plan -> independent spec review -> main acceptance
                           |
             +-------------+----------------+
             |             |                |
             v             v                v
         ai-tools       Router skill    shared instructions
         Runs 1–11       Run 12          companion change
             |             |
             |          proof + main assessment
             |          independent review + exact commit
             |             |
             +<--- canonical copy + pin ----+
             |
          final workflow/vendor proof
             |
          main assessment -> independent implementation review
             |
          scoped commits/push/PRs -> current CI and review-state evidence
```

One named persistent implementation Sidekick per publication repo is sufficient for this delivery. This is a task-size choice, not a policy limit. Each may assign bounded native Workers/Operators, retain them through corrections, and report exact evidence to its execution thread. The main retains all specification/plan authorship, handles design questions, and checks integrated consistency. Router source and shared instructions can proceed while the ai-tools runs proceed; final vendoring depends on the verified Router source commit.

The earlier authorship patch is input to reshape. Preserve its valid in-session authoring clarification; remove its stale delegated-authoring exception, unnecessary personal-name substitutions, and unrelated model-catalog additions. Replace its refusal of an explicit human instruction with the governing main-authorship default and user-authorized exception, preserving the guard against implicit Sidekick promotion. Keep existing reviewer eligibility/lineage policy rather than inventing a new catalog.

## Ai-tools implementation assignment

Worktree: `ai-tools.feat-orchestrator-design-authorship`; branch `feat/orchestrator-design-authorship`; base `5bb344d06bde0184bb2fda848a4ecb9dfb0b5ca9`. This base includes workflow version 2.15.0 and domain-entity specification guidance; preserve both.

1. Read the spec and current source for each named run completely before editing it. Execute Runs 1–11 in their declared order, one skill target per run. Reconcile active callers/references and human-facing role descriptions in the same changeset; do not rewrite retired history.
2. Make main-only design/plan authorship explicit at role selection and phase entry. Delete the four obsolete program-design target-authoring lane files and their active dispatch predicates; keep source research lanes and narrow their packet/receipt contract to evidence. Preserve the ability to use mechanical render/validation tools on main-authored material.
3. Route planning to the main for direct and orchestrated entry points. A Sidekick receiving a governing-plan gap returns evidence to the main; it may choose local implementation mechanics inside the plan. Handoffs transfer authoring only with a named successor recipient, transferred design/plan scope, and explicit user direction. Otherwise recipients retain the assigned ancillary/implementation/review scope and return authoring gaps to the current main.
4. Update main/Sidekick/Worker/Operator and thread examples for several planned PR assignments. Preserve genuine prerequisite safety and main integration checks. In `skills-creation`, keep proposal review before edits; after implementation run fitting proof, return to main assessment, then commission independent changed-file review. Replace the contrary review-before-proof rationale and teach the main's actual changes/proof/intent/design/plan/complexity/integration inspection and failure routes inline in the owning skills. Fresh proof follows corrections.
5. Update all affected existing pressure scenarios and source-read criteria; remove expected permissions for delegated sections. Add named cases for: main authors plan; multi-PR Sidekicks with independent/dependent work and linked threads; Frontier/Balanced with optional Advisor; prohibition on settled-section/target-diagram drafting; proof/main/review order; successor-main portability. Scenarios must ask for observable decisions or actual chat artifacts, not merely promises to comply. Grader-only expected behavior stays out of subject prompts. Avoid broad forbidden regexes that fail a compliant explanation mentioning the prohibited action.
6. Run fitting live affected pressure cases and static checks. Use the existing harness, its documented isolation/approval boundaries and lifecycle-hook disabling. Do not patch adapters, change global config, substitute fake output as behavior proof, weaken assertions, or silently skip a failing required gate. Report runtime/config/permission gaps before choosing a different proof route.
7. Once the Router change is reviewed and committed, copy canonical skill content into `plugins/agent-router/skills/agent-collaboration/` while retaining ai-tools-owned `agents/openai.yaml`; record the exact upstream commit in `plugin-sources.json`. Compare the content recursively with that exact commit's source, excluding only the declared UI metadata.
8. Bump workflow to the next unused minor version (2.16.0 if still unused) and agent-router to the next unused minor version (0.8.0 if still unused). Update all matching manifests/marketplace version fields and the relevant human README/operating map. Add one <=20-line dated changelog entry and index entry; longer evidence may use `docs/changelog/references/`. Report installed caches as not refreshed.

Allowed write surfaces: the eleven named skill trees, their affected scenarios/case registrations and pressure-scenario README, active matching human ownership descriptions, workflow metadata/changelog, and the canonical Router vendor destination/pin/plugin metadata. Any additional semantic skill target or harness mechanism returns to the main before editing. The governing spec and this plan are main-owned and read-only to implementers.

## Router implementation assignment

Worktree: `codex-router.orchestration-skill`; branch `feat/orchestration-skill-ownership`; base `74aaa88ccb5fbd2b76f3a6dc8dee464551be6dc0`.

1. Run 12 updates `agent-skills/agent-collaboration/SKILL.md` and the relevant board/session reference wording only. State that seats are thread-local, assignments may link coordination and execution roots, contributors discuss/report within their assignment, and supplied role/context never replaces session identity or authorization.
2. Use only existing CLI forms and observed supported response fields. Do not duplicate `manage-agents` model/role policy in the transport skill. No runtime Rust, migrations, CLI flags, dependency updates, or new skill scripts.
3. Verify the canonical skill through `cargo test -p agent-collaboration --test skill_cli_contract --locked`, quick skill validation, and `git diff --check`. Use existing build storage; do not restart production or globally install anything. CI owns repository-wide Rust health for the PR; report focused checks separately.
4. Return the exact diff and proof for main assessment and independent review. After acceptance, make a scoped commit so ai-tools can vendor a real upstream identity. Publication uses a reviewed PR body and current GitHub evidence. No merge, tag, package release, or production replacement.

## Shared-instruction implementation assignment

Worktree: `devfiles.design-ownership`; branch `research/design-ownership-2026-09-19`; base is current fetched main, recorded in the private execution context. Private repository identities are not published in this public plan.

1. Edit only the relevant ownership/delegation/shared-thread paragraphs in `shared/my_agents.md`. Keep the main Frontier-or-Balanced choice, explicitly optional Advisor, main-only design/plan authoring, multiple planned-PR Sidekicks, ancillary Workers/Operators, proof/main/review sequence, and user-directed coordination with other mains consistent with the spec.
2. Preserve existing design-mode, act-mode, scope-break, privacy, proof, and publication rules. Add the required short private changelog entry and index entry. Do not touch secrets, config templates, model defaults, hooks, symlinks, or installed files.
3. Verify the prose against O1–O11, run `git diff --check`, and return exact changed paths/diff for main assessment and independent review. No `chezmoi apply`, whole-home rendering, or cache refresh.
4. This repo says never commit without asking the user first. Prepare the concrete reviewed diff and proof, then return to the main for that publication boundary. Do not commit/push until the main supplies the user's permission. Keep private repo metadata out of public PR bodies.

## Proof and review gates

| Gate | Executor and evidence | Stop condition |
| --- | --- | --- |
| Design proposal | Different-lineage independent lead under skills-creation, four bounded proposal lanes, explicit reduced verdict; main verifies and accepts | Missing source, unmade owner meaning, or non-accepted proposal blocks implementation |
| Behavior | Ai-tools Sidekick runs real targeted `pnpm --dir tests/skills run test:evals` selections for changed behavior, reads flagged transcripts, reports exact pass/fail/exit evidence | No fake-backend substitution or unsupported historical improvement claim |
| Static | `pnpm --dir tests/skills run test:unit`, `pnpm --dir tests/skills run typecheck`, applicable formatting/lint, per-skill quick validator, `claude plugin validate .`, marketplace availability check as applicable | Required failed checks block readiness; bounded causal repairs stay in scope |
| Router contract | Existing compiled `skill_cli_contract` test exercises documented commands against real CLI help | Skill cannot introduce unsupported commands/flags |
| Vendor | Exact upstream commit and canonical/vendor content match with only local UI metadata exception | Uncommitted or mismatched source cannot be the pin |
| Main assessment | Main checks real diff, accepted spec/plan, pressure/static proof, unnecessary scope, and cross-repo consistency | Unproven work returns to implementer; design breaks return to owner |
| Independent implementation review | Fresh different-lineage lead inspects changes and existing proof; skills-creation review lanes where required; main disposes findings | Missing terminal receipts or accepted findings remain open; corrected behavior is re-proven |
| Publication | Scoped commit/push, reviewable PR bodies, checks/comments/threads/mergeability evidence; devfiles explicit commit boundary first | No secrets/private links in public artifacts; no merge without separate authority |

The main may post proof summaries and unresolved questions in the existing collaboration roots; avoid per-command logs and parallel authority documents. Keep test reports in existing scratch/artifact paths and reference them. A failed run remains failed/inconclusive until diagnosed and corrected; never relabel it a pass. The final report separates local proof, independent review, CI state, PR availability, and any pending owner publication decision.
