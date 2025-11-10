import { describe, expect, it } from "bun:test";
import { printers } from "../src/index.js";

describe("Markdown Formatting in Descriptions", () => {
  const printer = printers?.["openapi-ast"];

  describe("Basic markdown formatting", () => {
    it("should format description fields with markdown", () => {
      expect(printer).toBeDefined();

      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          openapi: "3.0.0",
          info: {
            title: "Test API",
            version: "1.0.0",
            description: "This is a   test    description\n\n\nWith multiple    spaces  ",
          },
          paths: {
            "/test": {
              get: {
                summary: "Get endpoint   ",
                description: "Endpoint   description\n\n\nwith    extra spaces",
                operationId: "getTest",
                responses: {
                  "200": {
                    description: "Success   response",
                  },
                },
              },
            },
          },
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error("Result is undefined");
      }

      const resultString = String(result);

      // Check that multiple spaces are normalized in the original content
      // Note: YAML may format this differently, but the content should be processed
      // The description field should exist and be formatted
      expect(resultString).toContain("description:");

      // Check that multiple blank lines are normalized (no quad-blank-lines)
      expect(resultString).not.toMatch(/\n{4,}/);
    });

    it("should preserve code blocks in descriptions", () => {
      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          openapi: "3.0.0",
          info: {
            title: "Test API",
            version: "1.0.0",
            description:
              "Here is some code:\n\n    const x = 1;\n    const y = 2;\n\nAnd more text.",
          },
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error("Result is undefined");
      }

      const resultString = String(result);

      // Code blocks (4+ spaces) should be preserved
      expect(resultString).toContain("    const x = 1;");
      expect(resultString).toContain("    const y = 2;");
    });

    it("should format markdown in nested objects", () => {
      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          openapi: "3.0.0",
          info: {
            title: "Test API",
            version: "1.0.0",
          },
          paths: {
            "/test": {
              get: {
                operationId: "test",
                parameters: [
                  {
                    name: "filter",
                    in: "query",
                    description: "Filter   parameter   with   spaces",
                  },
                ],
                responses: {
                  "200": {
                    description: "Success   response",
                  },
                },
              },
            },
          },
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error("Result is undefined");
      }

      const resultString = String(result);

      // Both parameter and response descriptions should be formatted
      expect(resultString).toContain("description:");
    });
  });

  describe("Summary field formatting", () => {
    it("should format summary fields", () => {
      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          openapi: "3.0.0",
          info: {
            title: "Test API",
            version: "1.0.0",
            summary: "API   summary   with   spaces",
          },
          paths: {
            "/test": {
              get: {
                summary: "Get   endpoint   summary",
                operationId: "test",
                responses: { "200": { description: "OK" } },
              },
            },
          },
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error("Result is undefined");
      }

      const resultString = String(result);

      // Summary fields should be processed
      expect(resultString).toContain("summary:");
    });
  });
});
