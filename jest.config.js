module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testMatch: ["<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}"],
  testPathIgnorePatterns:["/node_modules/", "/volatile/", "/fixtures/"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!**/node_modules/**", "!tests/**/*.ts"],
  coverageReporters: ["html", "text", "text-summary", "cobertura"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns:["/node_modules/", "/tests"],
  reporters: [
    'default',
    ['jest-junit', {outputDirectory: 'testReports', outputName: 'junit.xml'}],
  ],
};



