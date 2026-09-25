import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export const skillPressureCaseDefinitions = [
{
  "scenarioId": "agent-collaboration-persistent-relationship",
  "requiredSourceReads": [
    "plugins/agent-router/skills/agent-collaboration/SKILL.md",
    "plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md",
    "plugins/shravan-dev-workflow/skills/manage-agents/references/acpx.md"
  ],
  "maximumToolCalls": 30,
  "semanticCriteria": [
    {
      "name": "persistent-relationship",
      "requirement": "Explains reusing the same separate Sidekick/Advisor conversation across new assignments, checking recorded runtime/provider identity after dropped waits; distinguishes ACPX record/name from Router SessionRef; no claimed execution.",
      "failureExample": "Creates a new session for new source paths or treats cold cache as lost identity."
    }
  ]
},
{
  "scenarioId": "agent-collaboration-creation-capability",
  "requiredSourceReads": [
    "plugins/agent-router/skills/agent-collaboration/SKILL.md",
    "plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md",
    "plugins/shravan-dev-workflow/skills/manage-agents/references/acpx.md"
  ],
  "maximumToolCalls": 30,
  "semanticCriteria": [
    {
      "name": "creation-capability",
      "requirement": "Explains that missing model/permission capabilities make conversation prompt --new inadequate, routes lifecycle to manage-agents and preserves separate named identity via a supported route or reports a gap without bypass.",
      "failureExample": "Uses permission-canceling command as unrestricted launcher or replaces required conversation with native child."
    }
  ]
},
  {
    "scenarioId": "agent-collaboration-wake-interval-cache-regimes",
    "requiredSourceReads": [
      "plugins/agent-router/skills/agent-collaboration/SKILL.md"
    ],
    "maximumToolCalls": 30,
    "semanticCriteria": [
      {
        "name": "cache-and-calendar",
        "requirement": "Distinguishes a user-requested task reminder cadence from managed cache maintenance. Preserves the requested task cadence and afternoon lifetime or asks for actual missing timing/address details. Uses caller-supplied timing and eligibility; does not claim an ordinary wake guarantees cache reuse or misstate cron firing intervals.",
        "failureExample": "Replaces the requested task interval with a cache-maintenance interval, claims a cache guarantee, or claims minute0,45 cron is constant45-minute cadence."
      }
    ]
  },
  {
    scenarioId: "agent-collaboration-tool-manual-vs-practice-routing",
    requiredSourceReads: [
      "plugins/agent-router/skills/agent-collaboration/SKILL.md",
      "plugins/shravan-dev-workflow/skills/practices-collaboration/SKILL.md",
    ],
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "tool-question-loads-tool-manual", requirement: "Routes the CLI posting question to agent-collaboration and answers it with call mechanics (a joined seat, then a thread message post with the root message id), without adding when-or-why coordination policy.", failureExample: "Routes the CLI question to practices-collaboration, or answers it with advice about whether the post is worthwhile." },
      { name: "policy-question-loads-practice", requirement: "Routes 'should I post this decision to the board' to practices-collaboration because deciding when and why to post is practice, not tool operation.", failureExample: "Answers the posting decision from the tool manual or treats it as needing no skill." },
      { name: "routine-edit-loads-neither", requirement: "Loads neither collaboration skill for the README typo fix, and claims no executed board, Router, or file operation.", failureExample: "Loads a collaboration skill for the typo or claims a post, join, or edit happened." },
    ],
  }
] satisfies readonly SkillPressureCaseDefinition[];
