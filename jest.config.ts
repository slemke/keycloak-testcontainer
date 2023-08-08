import type { Config } from 'jest';

const config: Config = {
  verbose: true,
	collectCoverageFrom: [
		'src/**/*.ts'
	],
	testEnvironment: 'node',
	preset: 'ts-jest',
	testTimeout: 60 * 1000
};

export default config;
