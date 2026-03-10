import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
	resolveGuestMountPath,
	validateRuntimeMountPolicy,
	validateWritableMount,
} from '#src/features/runtime-control/mount-policy.js';

const WORK_DIR = '/tmp/agent-vm-workspace';
const HOST_HOME = '/Users/example';

describe('mount policy', () => {
	it('resolves relative guest mount keys under workspace root', () => {
		expect(resolveGuestMountPath('.cache/rw', WORK_DIR)).toBe(
			path.join(WORK_DIR, '.cache', 'rw'),
		);
	});

	it('rejects writable mounts outside allowed guest prefixes', () => {
		expect(() =>
			validateWritableMount(
				'/etc/nginx',
				{
					allowAuthWrite: false,
					writableAllowedGuestPrefixes: [WORK_DIR, '/home/agent', '/tmp'],
				},
				{ workDir: WORK_DIR },
			),
		).toThrowError(/outside writable allowlist/u);
	});

	it('permits writable mounts under workspace and /home/agent prefixes', () => {
		expect(() =>
			validateWritableMount(
				`${WORK_DIR}/.cursor-cache`,
				{
					allowAuthWrite: false,
					writableAllowedGuestPrefixes: [WORK_DIR, '/home/agent', '/tmp'],
				},
				{ workDir: WORK_DIR },
			),
		).not.toThrow();
		expect(() =>
			validateWritableMount(
				'/home/agent/.cache/custom',
				{
					allowAuthWrite: false,
					writableAllowedGuestPrefixes: [WORK_DIR, '/home/agent', '/tmp'],
				},
				{ workDir: WORK_DIR },
			),
		).not.toThrow();
	});

	it('rejects auth-path writable mounts when allowAuthWrite=false', () => {
		expect(() =>
			validateWritableMount(
				'/home/agent/.claude',
				{
					allowAuthWrite: false,
					writableAllowedGuestPrefixes: [WORK_DIR, '/home/agent', '/tmp'],
				},
				{ workDir: WORK_DIR },
			),
		).toThrowError(/allowAuthWrite=true/u);
	});

	it('allows auth-path writable mounts when allowAuthWrite=true', () => {
		expect(() =>
			validateWritableMount(
				'/home/agent/.claude',
				{
					allowAuthWrite: true,
					writableAllowedGuestPrefixes: [WORK_DIR, '/home/agent', '/tmp'],
				},
				{ workDir: WORK_DIR },
			),
		).not.toThrow();
	});

	it('validates all configured extra mounts', () => {
		expect(() =>
			validateRuntimeMountPolicy(
				{
					extraMounts: {
						'.cache/rw': `${WORK_DIR}/.cache/rw`,
						'/tmp/agent-vm-mount': '/tmp/agent-vm-mount',
					},
					mountControls: {
						allowAuthWrite: false,
						writableAllowedGuestPrefixes: [WORK_DIR, '/home/agent', '/tmp'],
					},
				},
				{ workDir: WORK_DIR, hostHome: HOST_HOME },
			),
		).not.toThrow();
	});

	it('rejects writable mount when host path targets auth directory with remapped guest path', () => {
		expect(() =>
			validateRuntimeMountPolicy(
				{
					extraMounts: {
						'/tmp/remapped-claude': `${HOST_HOME}/.claude`,
					},
					mountControls: {
						allowAuthWrite: false,
						writableAllowedGuestPrefixes: [WORK_DIR, '/home/agent', '/tmp'],
					},
				},
				{ workDir: WORK_DIR, hostHome: HOST_HOME },
			),
		).toThrowError(/targets an auth host directory/u);
	});

	it('rejects writable mount when host path is an auth-directory ancestor', () => {
		expect(() =>
			validateRuntimeMountPolicy(
				{
					extraMounts: {
						'/tmp/home-rw': HOST_HOME,
					},
					mountControls: {
						allowAuthWrite: false,
						writableAllowedGuestPrefixes: [WORK_DIR, '/home/agent', '/tmp'],
					},
				},
				{ workDir: WORK_DIR, hostHome: HOST_HOME },
			),
		).toThrowError(/targets an auth host directory/u);
	});

	it('rejects writable mount when host path is a symlink into auth directory', () => {
		const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-auth-home-'));
		const tempWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vm-workspace-'));
		const symlinkPath = path.join(tempWorkspace, 'claude-link');
		try {
			fs.mkdirSync(path.join(tempHome, '.claude'), { recursive: true });
			fs.symlinkSync(path.join(tempHome, '.claude'), symlinkPath);

			expect(() =>
				validateRuntimeMountPolicy(
					{
						extraMounts: {
							'/tmp/claude-link': symlinkPath,
						},
						mountControls: {
							allowAuthWrite: false,
							writableAllowedGuestPrefixes: [tempWorkspace, '/home/agent', '/tmp'],
						},
					},
					{ workDir: tempWorkspace, hostHome: tempHome },
				),
			).toThrowError(/targets an auth host directory/u);
		} finally {
			fs.rmSync(tempWorkspace, { recursive: true, force: true });
			fs.rmSync(tempHome, { recursive: true, force: true });
		}
	});
});
