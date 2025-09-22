const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  roots: ["<rootDir>/src/"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};