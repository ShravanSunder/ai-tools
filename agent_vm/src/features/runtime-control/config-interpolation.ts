import path from 'node:path';

const TOKEN_PATTERN = /\$\{([A-Z_]+)\}/gu;

export interface InterpolationContext {
	readonly WORKSPACE: string;
	readonly HOST_HOME: string;
}

export function interpolateConfigValue(value: string, context: InterpolationContext): string {
	return value.replace(TOKEN_PATTERN, (_match, tokenCandidate: string) => {
		if (tokenCandidate === 'WORKSPACE') {
			return context.WORKSPACE;
		}
		if (tokenCandidate === 'HOST_HOME') {
			return context.HOST_HOME;
		}
		throw new Error(
			`Unknown interpolation token '\${${tokenCandidate}}'. Supported tokens: \${WORKSPACE}, \${HOST_HOME}`,
		);
	});
}

export function resolveScriptPath(scriptPath: string, configDir: string): string {
	if (path.isAbsolute(scriptPath)) {
		throw new Error(`Script paths must be relative to config file directory: '${scriptPath}'`);
	}

	const normalizedConfigDirectory = path.resolve(configDir);
	const resolvedPath = path.resolve(normalizedConfigDirectory, scriptPath);
	const relativePath = path.relative(normalizedConfigDirectory, resolvedPath);
	if (relativePath.startsWith('..') || path.isAbsolute(relativePath) || relativePath === '') {
		throw new Error(
			`Path traversal detected for script '${scriptPath}'. Script must stay within '${normalizedConfigDirectory}'`,
		);
	}

	return resolvedPath;
}
