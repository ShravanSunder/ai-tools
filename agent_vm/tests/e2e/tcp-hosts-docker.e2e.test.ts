import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { execa, execaSync } from 'execa';
import { afterEach, describe, expect, it } from 'vitest';

const dockerContainerNamesToCleanup: string[] = [];
const workDirectoriesToCleanup: string[] = [];

function commandSucceeds(command: string, args: readonly string[]): boolean {
	try {
		execaSync(command, [...args], { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
}

const hasDockerDaemon = commandSucceeds('docker', ['info', '--format', '{{.ServerVersion}}']);
const hasGondolinRuntime = commandSucceeds(process.execPath, [
	'--input-type=module',
	'-e',
	'await import("@earendil-works/gondolin")',
]);

function buildDockerContainerName(prefix: string): string {
	const randomSuffix = Math.random().toString(36).slice(2, 8);
	return `${prefix}-${Date.now()}-${randomSuffix}`;
}

function parsePublishedLoopbackPort(dockerPortOutput: string): number {
	const firstLine = dockerPortOutput.trim().split('\n')[0] ?? '';
	const lastColonIndex = firstLine.lastIndexOf(':');
	if (lastColonIndex < 0) {
		throw new Error(`Unexpected docker port output: '${dockerPortOutput}'`);
	}

	const portRaw = firstLine.slice(lastColonIndex + 1).trim();
	const parsedPort = Number.parseInt(portRaw, 10);
	if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
		throw new Error(`Invalid published loopback port: '${dockerPortOutput}'`);
	}

	return parsedPort;
}

async function waitForContainerCommandSuccess(
	containerName: string,
	commandArgs: readonly string[],
	maxAttempts: number,
	delayMs: number,
): Promise<void> {
	const runAttempt = async (attempt: number): Promise<void> => {
		const result = await execa('docker', ['exec', containerName, ...commandArgs], {
			reject: false,
		});
		if (result.exitCode === 0) {
			return;
		}

		if (attempt === maxAttempts) {
			throw new Error(
				`Timed out waiting for container '${containerName}' command success: docker exec ${containerName} ${commandArgs.join(' ')}`,
			);
		}

		await new Promise((resolve) => setTimeout(resolve, delayMs));
		await runAttempt(attempt + 1);
	};

	await runAttempt(1);
}

function writeVmRuntimeTcpConfig(
	workDir: string,
	postgresHostPort: number,
	redisHostPort: number,
): void {
	const configDirectory = path.join(workDir, '.agent_vm');
	fs.mkdirSync(configDirectory, { recursive: true });

	const config = {
		tcp: {
			strictMode: true,
			allowedTargetHosts: ['127.0.0.1', 'localhost'],
			services: {
				postgres: {
					guestHostname: 'pg.vm.host',
					guestPort: 5432,
					upstreamTarget: `127.0.0.1:${postgresHostPort}`,
					enabled: true,
				},
				redis: {
					guestHostname: 'redis.vm.host',
					guestPort: 6379,
					upstreamTarget: `127.0.0.1:${redisHostPort}`,
					enabled: true,
				},
			},
		},
	};

	fs.writeFileSync(
		path.join(configDirectory, 'vm-runtime.local.json'),
		`${JSON.stringify(config)}\n`,
		'utf8',
	);
}

function buildVmCheckCommand(): string {
	return `/bin/sh -lc 'set -eu;
if command -v nc >/dev/null 2>&1; then
	nc -z pg.vm.host 5432;
	nc -z redis.vm.host 6379;
	echo "tcp_baseline_check=ok";
elif command -v python3 >/dev/null 2>&1; then
	python3 -c "import socket; [socket.create_connection((host, port), 5).close() for host, port in [('pg.vm.host', 5432), ('redis.vm.host', 6379)]]";
	echo "tcp_baseline_check=ok";
else
	echo "tcp_baseline_check=skipped";
fi;
if command -v psql >/dev/null 2>&1; then
	PGPASSWORD=postgres psql -h pg.vm.host -p 5432 -U postgres -d agent_vm_test -tAc "select 1" | grep -qx 1;
	echo "pg_protocol_check=ran";
else
	echo "pg_protocol_check=skipped";
fi;
if command -v redis-cli >/dev/null 2>&1; then
	redis-cli -h redis.vm.host -p 6379 ping | grep -q PONG;
	echo "redis_protocol_check=ran";
else
	echo "redis_protocol_check=skipped";
fi'`;
}

async function stopDaemonForWorkDir(agentVmRoot: string, workDir: string): Promise<void> {
	const controlBinaryPath = path.join(agentVmRoot, 'dist', 'bin', 'agent-vm.js');
	await execa(
		process.execPath,
		[controlBinaryPath, 'ctl', 'daemon', 'stop', '--work-dir', workDir],
		{
			reject: false,
		},
	);
}

afterEach(async () => {
	const agentVmRoot = process.cwd();
	const workDirs = workDirectoriesToCleanup.splice(0);
	await Promise.all(
		workDirs.map(async (workDir) => {
			await stopDaemonForWorkDir(agentVmRoot, workDir);
			fs.rmSync(workDir, { recursive: true, force: true });
		}),
	);

	const containerNames = dockerContainerNamesToCleanup.splice(0);
	await Promise.all(
		containerNames.map(
			async (containerName) =>
				await execa('docker', ['rm', '-f', containerName], { reject: false }),
		),
	);
});

describe('e2e tcp.hosts docker connectivity', () => {
	it('reaches host docker postgres + redis via tcp.hosts and optionally runs protocol checks', async () => {
		expect(
			hasDockerDaemon,
			'Docker daemon is required for tests/e2e/tcp-hosts-docker.e2e.test.ts',
		).toBe(true);
		expect(
			hasGondolinRuntime,
			'@earendil-works/gondolin is required for tests/e2e/tcp-hosts-docker.e2e.test.ts',
		).toBe(true);

		const postgresContainerName = buildDockerContainerName('agent-vm-e2e-pg');
		const redisContainerName = buildDockerContainerName('agent-vm-e2e-redis');
		dockerContainerNamesToCleanup.push(postgresContainerName, redisContainerName);

		const postgresRun = await execa(
			'docker',
			[
				'run',
				'-d',
				'--name',
				postgresContainerName,
				'-e',
				'POSTGRES_PASSWORD=postgres',
				'-e',
				'POSTGRES_USER=postgres',
				'-e',
				'POSTGRES_DB=agent_vm_test',
				'-p',
				'127.0.0.1::5432',
				'postgres:16',
			],
			{ reject: false },
		);
		expect(postgresRun.exitCode, postgresRun.stderr).toBe(0);

		const redisRun = await execa(
			'docker',
			['run', '-d', '--name', redisContainerName, '-p', '127.0.0.1::6379', 'redis:7-alpine'],
			{ reject: false },
		);
		expect(redisRun.exitCode, redisRun.stderr).toBe(0);

		const postgresPortResult = await execa('docker', ['port', postgresContainerName, '5432/tcp'], {
			reject: false,
		});
		expect(postgresPortResult.exitCode, postgresPortResult.stderr).toBe(0);
		const postgresLoopbackPort = parsePublishedLoopbackPort(postgresPortResult.stdout);

		const redisPortResult = await execa('docker', ['port', redisContainerName, '6379/tcp'], {
			reject: false,
		});
		expect(redisPortResult.exitCode, redisPortResult.stderr).toBe(0);
		const redisLoopbackPort = parsePublishedLoopbackPort(redisPortResult.stdout);

		await waitForContainerCommandSuccess(
			postgresContainerName,
			['pg_isready', '-U', 'postgres'],
			60,
			1_000,
		);
		await waitForContainerCommandSuccess(redisContainerName, ['redis-cli', 'ping'], 30, 1_000);

		const tempWorkDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-e2e-tcp-hosts-'));
		workDirectoriesToCleanup.push(tempWorkDir);
		writeVmRuntimeTcpConfig(tempWorkDir, postgresLoopbackPort, redisLoopbackPort);

		const agentVmRoot = process.cwd();
		const runBinaryPath = path.join(agentVmRoot, 'dist', 'bin', 'agent-vm.js');
		expect(fs.existsSync(runBinaryPath)).toBe(true);

		const commandResult = await execa(
			process.execPath,
			[runBinaryPath, 'run', '--run', buildVmCheckCommand()],
			{
				cwd: tempWorkDir,
				reject: false,
				timeout: 180_000,
			},
		);

		expect(commandResult.exitCode, `${commandResult.stdout}\n${commandResult.stderr}`).toBe(0);
		expect(commandResult.stdout).toMatch(/tcp_baseline_check=(ok|skipped)/u);
		expect(commandResult.stdout).toMatch(/pg_protocol_check=(ran|skipped)/u);
		expect(commandResult.stdout).toMatch(/redis_protocol_check=(ran|skipped)/u);
	}, 240_000);
});
