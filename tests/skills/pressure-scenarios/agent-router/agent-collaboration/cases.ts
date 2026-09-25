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
    scenarioId: "agent-collaboration-multi-pr-thread-local-seats",
    requiredSourceReads: [
      "plugins/agent-router/skills/agent-collaboration/SKILL.md",
      "plugins/agent-router/skills/agent-collaboration/references/message-board.md",
    ],
    maximumToolCalls: 30,
    semanticCriteria: [
      { name: "thread-local-seats-and-existing-references", requirement: "Explains that implementer seats are local to each root and relates the supplied coordination/execution roots only through ordinary text and existing message/thread references, with no project-wide registry or link command.", failureExample: "Enforces one project-wide Implementer or invents a parent/link field or command." },
      { name: "root-association-does-not-expand-authority", requirement: "Distinguishes session root-message scratch association from Thread Join/linking, preserves exact SessionRefs and root IDs in assignments/receipts, and says roles, notes, associations, and messages do not grant work authority.", failureExample: "Treats --root-message-id as Join, link, identity, or assignment permission." },
      { name: "orchestrator-only-agent-resolution", requirement: "States that among agent sessions only each root's open Orchestrator may resolve it; implementers report completion but cannot resolve execution or coordination roots.", failureExample: "Lets either implementation Sidekick resolve its root or the coordination root." },
    ],
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
