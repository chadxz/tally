import { loadConfig } from "../src";
import { join } from "node:path";
import { schema as basicSchema } from "./fixtures/basic/default";
import { schema as jsonSchema } from "./fixtures/env-formats/json/schema";
import { schema as booleanSchema } from "./fixtures/env-formats/boolean/schema";
import { schema as numberSchema } from "./fixtures/env-formats/number/schema";
import { schema as stringSchema } from "./fixtures/env-formats/string/schema";
import { schema as nestedSchema } from "./fixtures/nested/schema";

describe("loadConfig", () => {
  it("loads basic configuration from default.ts", () => {
    const basicFixturePath = join(import.meta.dirname, "fixtures/basic");
    const config = loadConfig(basicFixturePath, basicSchema);

    expect(config).toEqual({
      applicationName: "test-app",
      environment: "development",
    });
  });

  describe("JSON environment variables", () => {
    const jsonFixturePath = join(import.meta.dirname, "fixtures/env-formats/json");

    beforeEach(() => {
      process.env.JSON_VALUE = '["value1", "value2"]';
    });

    afterEach(() => {
      delete process.env.JSON_VALUE;
    });

    it("parses JSON environment variables", () => {
      const config = loadConfig(jsonFixturePath, jsonSchema);
      expect(config.jsonValue).toEqual(["value1", "value2"]);
    });
  });

  describe("boolean environment variables", () => {
    const booleanFixturePath = join(import.meta.dirname, "fixtures/env-formats/boolean");

    beforeEach(() => {
      process.env.BOOLEAN_VALUE = 'true';
    });

    afterEach(() => {
      delete process.env.BOOLEAN_VALUE;
    });

    it("parses true boolean environment variables", () => {
      const config = loadConfig(booleanFixturePath, booleanSchema);
      expect(config.booleanValue).toBe(true);
    });

    it("parses false boolean environment variables", () => {
      process.env.BOOLEAN_VALUE = 'false';
      const config = loadConfig(booleanFixturePath, booleanSchema);
      expect(config.booleanValue).toBe(false);
    });
  });

  describe("number environment variables", () => {
    const numberFixturePath = join(import.meta.dirname, "fixtures/env-formats/number");

    beforeEach(() => {
      process.env.NUMBER_VALUE = '42';
    });

    afterEach(() => {
      delete process.env.NUMBER_VALUE;
    });

    it("parses number environment variables", () => {
      const config = loadConfig(numberFixturePath, numberSchema);
      expect(config.numberValue).toBe(42);
    });
  });

  describe("string environment variables", () => {
    const stringFixturePath = join(import.meta.dirname, "fixtures/env-formats/string");

    beforeEach(() => {
      process.env.STRING_VALUE = 'hello world';
    });

    afterEach(() => {
      delete process.env.STRING_VALUE;
    });

    it("parses string environment variables", () => {
      const config = loadConfig(stringFixturePath, stringSchema);
      expect(config.stringValue).toBe("hello world");
    });
  });

  describe("nested configuration", () => {
    const nestedFixturePath = join(import.meta.dirname, "fixtures/nested");

    it("loads nested configuration from default.ts", () => {
      const config = loadConfig(nestedFixturePath, nestedSchema);
      expect(config.application.metadata.name).toBe("test-app");
    });

    it("loads nested configuration from environment variables", () => {
      process.env.APP_NAME = "env-app";
      const config = loadConfig(nestedFixturePath, nestedSchema);
      expect(config.application.metadata.name).toBe("env-app");
      delete process.env.APP_NAME;
    });
  });
});
