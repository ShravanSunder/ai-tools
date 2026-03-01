import type { DaemonStatus } from './config.js';

export type DaemonRequest =
	| { type: 'status' }
	| { type: 'attach'; command?: string }
	| { type: 'policy.reload' }
	| {
			type: 'policy.update';
			action: 'allow' | 'block' | 'clear';
			target?: string;
	  }
	| { type: 'tunnel.restart'; service?: 'postgres' | 'redis' }
	| { type: 'shutdown' };

export type DaemonResponse =
	| { type: 'attached'; sessionId: string }
	| { type: 'status.response'; status: DaemonStatus }
	| { type: 'stream.stdout'; data: string }
	| { type: 'stream.stderr'; data: string }
	| { type: 'stream.exit'; code: number }
	| { type: 'ack'; message: string }
	| { type: 'error'; message: string };
