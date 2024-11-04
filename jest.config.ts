import { JestConfigWithTsJest } from 'ts-jest';

/** @type {import('jest').Config} */
const config: JestConfigWithTsJest = {
  clearMocks: true,
  verbose: true,
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  testPathIgnorePatterns: ['node_modules'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageProvider: 'v8',
  coverageReporters: ['json', 'html'],
};

module.exports = config;
