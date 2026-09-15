import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export const skillPressureCaseDefinitions = [
{
  "scenarioId": "agent-collaboration-persistent-relationship",
  "requiredSourceReads": [
    "plugins/agent-router/skills/agent-collaboration/SKILL.md",
    "plugins/agent-router/skills/agent-collaboration/references/session-messaging.md",
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
    "plugins/agent-router/skills/agent-collaboration/references/session-messaging.md",
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
    "scenarioId": "agent-collaboration-topic-autonomy-and-inbox",
    "requiredSourceReads": [
      "plugins/agent-router/skills/agent-collaboration/SKILL.md",
      "plugins/agent-router/skills/agent-collaboration/references/message-board.md"
    ],
    "maximumToolCalls": 30,
    "semanticCriteria": [
      {
        "name": "topic-autonomy",
        "requirement": "Explains that an agent may create a topic in the authorized board without asking for topic approval; project and board changes retain owner authorization.",
        "failureExample": "Asks for permission to create the topic."
      },
      {
        "name": "inbox-not-wake",
        "requirement": "Distinguishes watching future inbox activity from waking and read acknowledgement, and proposes acknowledging only processed scoped activity. Claims no executed Router mutations.",
        "failureExample": "Treats a watch as a wake or automatic read acknowledgement."
      }
    ]
  },
  {
    "scenarioId": "agent-collaboration-wake-interval-cache-regimes",
    "requiredSourceReads": [
      "plugins/agent-router/skills/agent-collaboration/SKILL.md",
      "plugins/agent-router/skills/agent-collaboration/references/timed-wakeups.md"
    ],
    "maximumToolCalls": 30,
    "semanticCriteria": [
      {
        "name": "cache-and-calendar",
        "requirement": "Distinguishes a user-requested task reminder cadence from managed cache maintenance. Preserves the requested task cadence and afternoon lifetime or asks for actual missing timing/address details. Uses caller-supplied timing and eligibility; does not claim an ordinary wake guarantees cache reuse or misstate cron firing intervals.",
        "failureExample": "Replaces the requested task interval with a cache-maintenance interval, claims a cache guarantee, or claims minute0,45 cron is constant45-minute cadence."
      }
    ]
  }
] satisfies readonly SkillPressureCaseDefinition[];
