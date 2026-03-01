import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: [
			{
				find: /^#src\/(.*)\.js$/u,
				replacement: path.resolve(__dirname, 'src/$1.ts'),
			},
			{
				find: /^#src\/(.*)$/u,
				replacement: path.resolve(__dirname, 'src/$1'),
			},
			{
				find: '#src',
				replacement: path.resolve(__dirname, 'src'),
			},
		],
	},
	test: {
		environment: 'node',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
		projects: [
			{
				test: {
					name: 'unit',
					include: ['src/**/*.unit.test.ts'],
					setupFiles: ['./tests/setup.ts'],
				},
			},
			{
				test: {
					name: 'integration',
					include: ['tests/*.integration.test.ts'],
					setupFiles: ['./tests/setup.ts'],
				},
			},
			{
				test: {
					name: 'e2e',
					include: ['tests/e2e/**/*.test.ts'],
					setupFiles: ['./tests/setup.ts'],
				},
			},
		],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: ['**/node_modules/**', 'tests/**'],
		},
	},
});
