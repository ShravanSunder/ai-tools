import type { AgentPreset } from '../types/config.js';

const PRESET_COMMANDS: Record<AgentPreset, string> = {
	claude: 'claude --dangerously-skip-permissions --continue',
	codex: 'codex --dangerously-bypass-approvals-and-sandbox resume --last',
	gemini: 'gemini --yolo',
	opencode: 'opencode --yolo --continue',
	cursor: 'cursor .',
};

export function resolveAgentPresetCommand(preset: AgentPreset): string {
	return PRESET_COMMANDS[preset];
}
