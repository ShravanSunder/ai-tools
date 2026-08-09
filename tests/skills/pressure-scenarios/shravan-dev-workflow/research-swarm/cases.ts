import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "research-swarm-question-first",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/research-swarm/SKILL.md",
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
        requirement: "Does not turn research into design, planning, or implementation and names the later owner only as a route after evidence is synthesized.",
        failureExample: "Writes a design or implementation plan from preliminary research.",
      },
    ],
  },
  {
    scenarioId: "research-swarm-substantial-stage-artifacts",
    requiredSourceReads: [
      "plugins/shravan-dev-workflow/skills/research-swarm/SKILL.md",
      "tests/skills/fixtures/minimal-planning-delivery/requirements.md",
      "tests/skills/fixtures/minimal-planning-delivery/specification.md",
      "tests/skills/fixtures/minimal-planning-delivery/program-design.md",
      "tests/skills/fixtures/minimal-planning-delivery/review-result.md",
    ],
    maximumToolCalls: 40,
    semanticCriteria: [
      {
        name: "keeps-substantial-research-inspectable",
        requirement: "Uses a repo-local research ledger and parent-written per-lane artifacts with bounded questions, source inputs, inspect lists, non-goals, output shapes, uncertainty, confidence, and completion receipts.",
        failureExample: "Collapses helper opinions into one chat summary or dispatches broad uninspectable prompts.",
      },
      {
        name: "preserves-parent-evidence-authority",
        requirement: "Treats helper outputs as candidate evidence until the parent verifies source anchors and synthesizes the result.",
        failureExample: "Treats helper consensus as accepted truth.",
      },
      {
        name: "routes-exact-ready-design-to-planning",
        requirement: "Recognizes the supplied exact current ready Requirements, Specification, Program Design, and review identities, recommends plan-implementation as the next owner without creating the plan, and names review-implementation as the later owner for implemented work and proof without performing that review.",
        failureExample: "Reports all planning unavailable, chooses a generic review route, or creates the plan inside research.",
      },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
