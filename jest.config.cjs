/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { isolatedModules: true }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};