# Codex ACPX read-only preset permits workspace writes

- Observed: 2026-09-07
- Status: captured
- Skill/workflow: manage-agents, references/acpx-provider-codex.md
- Task context: live read-only pressure validation of tracking and orchestration skills.
- Expected behavior: the documented read-only reviewer route cannot edit the workspace.
- Observed behavior: the caret-selected adapter resolved to 1.10.0; both its named read-only preset and a legacy sandbox config override allowed a controlled edit. Source confirms the preset maps to workspaceWrite on each turn.
- Evidence: agentclientprotocol/codex-acp commit 50f69e57ca761ccafd2ca29de7fb591068277516 changes that mapping; the current provider reference uses the caret adapter command at line 39. A controlled 1.6.2 probe selected INITIAL_AGENT_MODE=read-only with client-reviewed approvals, denied the edit request, and created no file.
- Recurrence: one pressure run created fixture implementation files; two subsequent controlled probes reproduced writes through the newer adapter. Generated files were preserved outside the checkout.
- Impact: approval flags alone do not establish the provider reference's read-only reviewer boundary.
- Suspected cause: confirmed adapter preset semantic change, combined with an unpinned provider recipe.
- Follow-up: the in-scope test harness now pins the verified read-only route. Updating the general manage-agents provider guidance is separate skill work; this entry does not authorize it. Revalidate the write-denial boundary before changing versions.
