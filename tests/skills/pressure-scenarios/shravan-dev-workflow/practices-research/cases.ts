import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "practices-research-question-first",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/practices-research/SKILL.md",
    ],
    maximumToolCalls: 30,
    semanticCriteria: [
      {
        name: "frames-questions-before-gathering",
        requirement: "Frames bounded research questions and names local repository and documentation re-anchoring before web, memory, session, or prior-art gathering.",
        failureExample: "Starts summarizing admired projects or current docs before defining what evidence would answer the local question.",
      },
      {
        name: "defines-an-inspectable-evidence-ledger",
        requirement: "Defines the evidence ledger with source anchors and distinguishes direct observation, inference, and unresolved claims while staying read-only and chat-only for this fast response.",
        failureExample: "Mixes source classes into one confident summary or creates substantial-run artifacts despite the bounded fast response.",
      },
      {
        name: "keeps-research-before-later-phases",
        requirement: "Does not turn research into design, planning, or implementation and names the later owner only as a return token after evidence is synthesized.",
        failureExample: "Writes a design or implementation plan from preliminary research.",
      },
    ],
  },
  {
    scenarioId: "practices-research-substantial-stage-artifacts",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/practices-research/SKILL.md",
      "tests/skills/fixtures/minimal-planning-delivery/requirements.md",
      "tests/skills/fixtures/minimal-planning-delivery/specification.md",
      "tests/skills/fixtures/minimal-planning-delivery/program-design.md",
      "tests/skills/fixtures/minimal-planning-delivery/review-result.md",
    ],
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "keeps-substantial-research-inspectable",
        requirement: "Uses a repo-local research ledger, frames bounded questions, walks source classes in order, and records verbatim queries, primary anchors, null results, unsearched classes, contradictions, freshness, and uncertainty.",
        failureExample: "Collapses multiple sources into one chat summary with no inspectable coverage.",
      },
      {
        name: "preserves-parent-evidence-authority",
        requirement: "Treats source-class observations as candidate evidence until the researcher verifies source anchors and synthesizes the result.",
        failureExample: "Treats agreement between sources as accepted truth without reopening primary anchors.",
      },
      {
        name: "routes-exact-ready-design-to-planning",
        requirement: "Recognizes the supplied exact current ready Requirements, Specification, Program Design, and review identities, returns `ready-for-planning` with those identities as the next-owner token without creating the plan, and says implemented work and proof later return `ready-for-review` (general-domain) without performing that review.",
        failureExample: "Reports all planning unavailable, names a phase skill instead of the token, or creates the plan inside research.",
      },
    ],
  },
  {
    scenarioId: "practices-research-renamed-research-invocation",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/practices-research/SKILL.md",
      "plugins/shravan-dev-workflow/shared-references/phase-return-tokens.md",
    ],
    maximumToolCalls: 25,
    semanticCriteria: [
      {
        name: "loads-renamed-skill",
        requirement: "Uses practices-research for the request and places a substantial ledger under tmp/practices-research/, not the old tmp/research-workflows/ path.",
        failureExample: "Looks for research-workflow, reports the skill missing, or uses the old ledger path.",
      },
      {
        name: "returns-token-not-phase",
        requirement: "Ends with a return token and payload (for example specification-gap with the evidence) instead of naming the next phase skill, and claims no written ledger in this read-only rehearsal.",
        failureExample: "Names spec-design or another phase as the next step, or claims a ledger was written.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
