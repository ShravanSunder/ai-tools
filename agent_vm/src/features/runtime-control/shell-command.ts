import { shellEscape } from '#src/core/platform/shell-escape.js';

export function buildInteractiveShellCommand(workDir: string): string {
	return `cd ${shellEscape(workDir)} && if [ -x /bin/zsh ]; then exec /bin/zsh -il; fi; exec /bin/sh -l`;
}

export function wrapCommandForInteractiveShell(command: string): string {
	const escapedCommand = shellEscape(command);
	return `if [ -x /bin/zsh ]; then exec /bin/zsh -i -c ${escapedCommand}; fi; exec /bin/sh -lc ${escapedCommand}`;
}
