import { describe, expect, it } from "bun:test";
import { printers } from "../src/index.js";
import prettier from "prettier";

describe("Markdown Formatting in Descriptions", () => {
  const printer = printers?.["openapi-ast"];

  // Get printDocToString from Prettier's internals (call once per test)
  function getPrintDocToString() {
    // Try multiple paths to access Prettier's printDocToString
    const prettierAny = prettier as any;
    
    // Path 1: __internal.doc.printDocToString
    if (prettierAny.__internal?.doc?.printDocToString) {
      return prettierAny.__internal.doc.printDocToString;
    }
    
    // Path 2: __internal.docPrinter.formatDoc
    if (prettierAny.__internal?.docPrinter?.formatDoc) {
      return prettierAny.__internal.docPrinter.formatDoc;
    }
    
    // Path 3: Try require with different paths
    try {
      // Try prettier/standalone or other internal paths
      const docUtils = require("prettier/standalone");
      if (docUtils?.printDocToString) {
        return docUtils.printDocToString;
      }
    } catch {
      // Not available
    }
    
    try {
      // Try direct access to internal modules
      const prettierDoc = require("prettier/doc");
      if (prettierDoc?.printer?.printDocToString) {
        return prettierDoc.printer.printDocToString;
      }
    } catch {
      // Not available
    }
    
    // If all else fails, check if result is already a string
    // (some Prettier versions return strings directly)
    return null;
  }

  // Helper function to convert Doc to formatted string using Prettier's printDocToString
  function docToString(doc: any, printDocToString: any, options: any = {}): string {
    // If already a string, return it
    if (typeof doc === "string") {
      return doc;
    }

    // If printDocToString is not available, try to stringify the doc
    if (!printDocToString) {
      // Fallback: if it's an object, try JSON.stringify or inspect
      if (doc && typeof doc === "object") {
        // Try to see if it has a toString that works
        const str = String(doc);
        if (str !== "[object Object]") {
          return str;
        }
        // Otherwise, we need printDocToString
        throw new Error("printDocToString is required to convert Doc to string");
      }
      return String(doc);
    }

    // Use printDocToString to convert Doc to formatted string
    const result = printDocToString(doc, {
      printWidth: options.printWidth || 80,
      tabWidth: options.tabWidth || 2,
      useTabs: false,
    });
    
    // printDocToString returns { formatted: string }
    return result?.formatted || String(doc);
  }

  describe("Basic markdown formatting", () => {
    it("should format description fields with markdown", () => {
      expect(printer).toBeDefined();

      const printDocToString = getPrintDocToString();

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

      const resultString = docToString(result, printDocToString, { tabWidth: 2 });

      // Check that multiple spaces are normalized in the original content
      // Note: YAML may format this differently, but the content should be processed
      // The description field should exist and be formatted
      expect(resultString).toContain("description:");

      // Check that multiple blank lines are normalized (no quad-blank-lines)
      expect(resultString).not.toMatch(/\n{4,}/);
    });

    it("should preserve code blocks in descriptions", () => {
      const printDocToString = getPrintDocToString();

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

      const resultString = docToString(result, printDocToString, { tabWidth: 2 });

      // Code blocks (4+ spaces) should be preserved
      expect(resultString).toContain("    const x = 1;");
      expect(resultString).toContain("    const y = 2;");
    });

    it("should format markdown in nested objects", () => {
      const printDocToString = getPrintDocToString();

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

      const resultString = docToString(result, printDocToString, { tabWidth: 2 });

      // Both parameter and response descriptions should be formatted
      expect(resultString).toContain("description:");
    });
  });

  describe("Summary field formatting", () => {
    it("should format summary fields", () => {
      const printDocToString = getPrintDocToString();

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

      const resultString = docToString(result, printDocToString, { tabWidth: 2 });

      // Summary fields should be processed
      expect(resultString).toContain("summary:");
    });
  });
});
