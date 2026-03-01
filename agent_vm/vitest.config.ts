import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
		projects: [
			{
				test: {
					name: 'unit',
					include: ['tests/unit/**/*.test.ts'],
				},
			},
			{
				test: {
					name: 'integration',
					include: ['tests/integration/**/*.test.ts'],
				},
			},
			{
				test: {
					name: 'e2e',
					include: ['tests/e2e/**/*.test.ts'],
				},
			},
		],
	},
});
