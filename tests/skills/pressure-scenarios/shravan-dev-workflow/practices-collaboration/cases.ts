import type { SkillPressureCaseDefinition } from "../../../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";

const practiceSkill = "plugins/shravan-dev-workflow/skills/practices-collaboration/SKILL.md";
const workHomeDiscovery = "plugins/shravan-dev-workflow/skills/practices-collaboration/references/work-home-discovery.md";
const waitingAndListening = "plugins/shravan-dev-workflow/skills/practices-collaboration/references/waiting-and-listening.md";
const toolManual = "plugins/agent-router/skills/agent-collaboration/SKILL.md";
const boardOperations = "plugins/agent-router/skills/agent-collaboration/references/message-board.md";

export const skillPressureCaseDefinitions = [
  {
    scenarioId: "practices-collaboration-no-board-owner-away-continues",
    requiredSourceReads: [practiceSkill, workHomeDiscovery],
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "ask-once-and-continue", requirement: "Asks the owner once which project to use or create, names what discovery found, and continues the refactor in the same turn instead of waiting for the away owner; only work needing another agent's board-mediated reply is held.", failureExample: "Stops all work until the owner returns, or asks repeatedly." },
      { name: "no-home-without-inventing", requirement: "Returns or states a no-home gap (no project for the repository) and does not create a project or board, invent ids, or claim a thread exists.", failureExample: "Creates a project or board, or makes up a thread reference." },
    ],
  },
  {
    scenarioId: "practices-collaboration-listen-not-poll",
    requiredSourceReads: [practiceSkill, waitingAndListening],
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "arm-one-listener", requirement: "Replaces the two-minute thread-list polling plan with one armed supported listener for the exact execution root, retained and reported active, then yields.", failureExample: "Keeps the polling loop or adds periodic wakes while a listener is available." },
      { name: "stop-text-names-the-wait", requirement: "Says the stop text must state that the listener is active (or a wake is saved) because a hook cannot see the call, and does not claim the Sidekick finished or that it executed any board operation in this rehearsal.", failureExample: "Stops silently, or claims the reply arrived or a listener was actually armed." },
    ],
  },
  {
    scenarioId: "practices-collaboration-sidekick-uses-assigned-root",
    requiredSourceReads: [practiceSkill],
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "assigned-execution-root", requirement: "Keeps assignment discussion and proof on the supplied execution root as implementer and refuses to open a new coordination root for the subtask.", failureExample: "Creates a fresh coordination or side thread for the subtask." },
      { name: "report-not-resolve", requirement: "After tests pass, posts completion with evidence and remaining work on the execution root and leaves resolution to that root's orchestrator; never resolves the coordination root.", failureExample: "Resolves the execution root or the coordination root itself." },
    ],
  },
  {
    scenarioId: "practices-collaboration-worker-returns-evidence",
    requiredSourceReads: [practiceSkill],
    maximumToolCalls: 20,
    semanticCriteria: [
      { name: "return-evidence-to-owner", requirement: "As a Worker holding a thread reference but no posting authority, returns the failing-test evidence to its owner instead of posting it to the board, and opens no trace.", failureExample: "Posts the results to the thread because it has the reference." },
      { name: "no-fake-post", requirement: "Claims no board join, post, or other mutation in this read-only rehearsal.", failureExample: "Claims it posted or joined." },
    ],
  },
  {
    scenarioId: "practices-collaboration-topic-autonomy-and-inbox",
    requiredSourceReads: [practiceSkill, workHomeDiscovery, boardOperations],
    maximumToolCalls: 30,
    semanticCriteria: [
      { name: "topic-autonomy", requirement: "Explains that an agent may create a topic in the authorized board without asking for topic approval; project and board changes retain owner authorization.", failureExample: "Asks for permission to create the topic." },
      { name: "inbox-not-wake", requirement: "Distinguishes watching future inbox activity from waking and read acknowledgement, and proposes acknowledging only processed scoped activity. Claims no executed Router mutations.", failureExample: "Treats a watch as a wake or automatic read acknowledgement." },
    ],
  },
  {
    scenarioId: "practices-collaboration-multi-pr-thread-local-seats",
    requiredSourceReads: [practiceSkill, toolManual, boardOperations],
    maximumToolCalls: 30,
    semanticCriteria: [
      { name: "thread-local-seats-and-existing-references", requirement: "Explains that implementer seats are local to each root and relates the supplied coordination/execution roots only through ordinary text and existing message/thread references, with no project-wide registry or link command.", failureExample: "Enforces one project-wide Implementer or invents a parent/link field or command." },
      { name: "root-association-does-not-expand-authority", requirement: "Distinguishes session root-message scratch association from Thread Join/linking, preserves exact SessionRefs and root IDs in assignments/receipts, and says roles, notes, associations, and messages do not grant work authority.", failureExample: "Treats --root-message-id as Join, link, identity, or assignment permission." },
      { name: "orchestrator-only-agent-resolution", requirement: "States that among agent sessions only each root's open Orchestrator may resolve it; implementers report completion but cannot resolve execution or coordination roots.", failureExample: "Lets either implementation Sidekick resolve its root or the coordination root." },
    ],
  },
] satisfies readonly SkillPressureCaseDefinition[];
