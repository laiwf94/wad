module.exports = {
  rootDir: './',
  verbose: true,
  collectCoverage: true,
  coverageThreshold: {
    global: {
    }
  },
  collectCoverageFrom: [

  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'html', 'lcov'],
  reporters: [
    'default',
  ],
  moduleFileExtensions: ['ts', 'js'],
  moduleDirectories: [
    'node_modules'
  ],
  modulePaths: [
    '<rootDir>/node_modules'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
  ],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/'
  ],
  testMatch: ['**/*-test.ts'],
};