import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>'],
    testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    coverageDirectory: '<rootDir>/coverage',
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass|svg|png|jpg|jpeg|gif)$': '<rootDir>/__mocks__/fileMock.ts',
        '^@fontsource\/.*$': '<rootDir>/__mocks__/fileMock.ts',
    },
};

export default config;
