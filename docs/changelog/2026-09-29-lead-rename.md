# 2026-09-29 Main becomes the 🦁 Lead; skills point to manage-agents

`shravan-dev-workflow` 2.67.0.

- The user-facing agent is the 🦁 Lead in every skill, reference, and shared reference ("Main", "the main", "main assessment", "Main-authored" all cut over). "main path", "main entry", and the `main` branch are unchanged.
- The reviewing agent that several skills called the "review lead" is now the 🔎 Review Sidekick, so "the Lead" has one meaning.
- Skills stop restating delegation policy: tiers, models, effort, lineage, history, and which role takes a job now live only in `manage-agents`, and callers name the role and delegate through it. Security-surface reviews rely on the `manage-agents` review row.
- `manage-agents` gains `references/delegation-examples.md`: six situations from orchestration and research, each walked through direction, span, horizon, plan cut, role, and catalog row; `SKILL.md` loads it for every job.
- `agent-job-packet.md` opens every prompt with a standard opening for the role (🔧 Operator, 🛠️ Worker, 🐒 Sidekick, 🔎 Review Sidekick, 🦉 Advisor): what it owns, where it stops, what it returns, what it does not do.
- Horizon is defined as a project ladder (Project, Milestone, Task, Subtask), each level checked against its own check; a Subtask is one step or one written procedure with no judgment between its steps. Horizon limits the role (Sidekick: Milestone, Task, Subtask; Worker: Task, Subtask; Operator: an Exact Subtask) and no longer appears in the catalog tables. The Operator is described by what it will and will not do. Direction and span are explained answer by answer, each with a test and the cut it calls for.
- Roles and the model tables are one section, Model Catalog & Roles. Implementation review comes after the Lead verifies (with the Advisor, when one exists) and only for Projects and Milestones; design and proposal reviews use the same reviewers. Grok high reviews every time; Astra (high to xhigh) or Opus (xhigh) reviews security surfaces by lineage; when the author is xAI, the owner picks those reviewers; beyond these rows, another reviewer joins only when the owner names one.
- Catalog: effort is a maximum (`Max effort`); criteria cells list their values instead of "any". Luna takes Exact or Complete · Local or Cross-domain; Sol takes Complete · Cross-domain; Opus (high to xhigh) takes what stays Partial across domains or systems. A job that matches no row is cut until it does, or goes to the owner.
- `plan-improve-repo` follows the `manage-agents` fan-out rule for audits.
- Contract tests changed only where they pin a renamed sentence. Pressure-scenario prose still says Main (not updated here).

Validation: skills tests 123 passing, `claude plugin validate` passing.
