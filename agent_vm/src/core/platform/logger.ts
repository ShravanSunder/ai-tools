import fs from 'node:fs';
import path from 'node:path';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
	log(
		level: LogLevel,
		component: string,
		message: string,
		metadata?: Record<string, unknown>,
	): void;
}

export class JsonLineLogger implements Logger {
	public constructor(private readonly logPath: string) {
		fs.mkdirSync(path.dirname(logPath), { recursive: true });
	}

	public log(
		level: LogLevel,
		component: string,
		message: string,
		metadata?: Record<string, unknown>,
	): void {
		const record = {
			ts: new Date().toISOString(),
			level,
			component,
			message,
			metadata: metadata ?? {},
		};
		fs.appendFileSync(this.logPath, `${JSON.stringify(record)}\n`, 'utf8');
		if (level === 'error' || level === 'warn') {
			process.stderr.write(`${component}: ${message}\n`);
		}
	}
}

export class NoopLogger implements Logger {
	public log(
		_level: LogLevel,
		_component: string,
		_message: string,
		_metadata?: Record<string, unknown>,
	): void {}
}
