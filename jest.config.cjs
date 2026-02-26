module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'json'],
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coveragePathIgnorePatterns: ['/node_modules/', '/tests/mocks/', '/config/'],
    verbose: true,
    setupFilesAfterEnv: ['./tests/setup.js'],
    testTimeout: 30000,
    forceExit: true,
    detectOpenHandles: true
};