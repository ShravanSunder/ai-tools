import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

export const skillPressureCaseDefinitions = [
  {
    "scenarioId": "agent-collaboration-topic-autonomy-and-inbox",
    "requiredSourceReads": [
      "plugins/codex-router/skills/agent-collaboration/SKILL.md",
      "plugins/codex-router/skills/agent-collaboration/references/message-board.md"
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
      "plugins/codex-router/skills/agent-collaboration/SKILL.md",
      "plugins/codex-router/skills/agent-collaboration/references/timed-wakeups.md"
    ],
    "maximumToolCalls": 30,
    "semanticCriteria": [
      {
        "name": "cache-and-calendar",
        "requirement": "Rejects the proposed 45-minute polling cadence for Balanced, explains cache cost, and proposes a below-29-minute wait or asks for a genuine calendar-task cadence. Does not disguise that polling request as cron, misstate cron intervals, or shorten assignment lifetime to the cache ceiling. Quoting a rejected command is allowed.",
        "failureExample": "Recommends --every 45m, or proposes cron as a workaround for 45-minute polling, or claims 0,45 minute cron fires every 45 minutes."
      }
    ]
  }
] satisfies readonly SkillPressureCaseDefinition[];
