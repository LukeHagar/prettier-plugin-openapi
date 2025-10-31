import { describe, expect, it } from "bun:test";
import { parsers, printers } from "../src/index.js";

/**
 * Comprehensive tests for all OpenAPI object types that can be referenced via $ref
 * This covers all versions: Swagger 2.0, OpenAPI 3.0.x, 3.1.x, and 3.2.0
 */
describe("All $ref Reference Types", () => {
  const printer = printers?.["openapi-ast"];
  const parser = parsers?.["openapi-parser"];

  describe("Schema Object (all versions)", () => {
    it("should format schema object with $ref at root correctly", () => {
      expect(printer).toBeDefined();

      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          type: "object",
          description: "User schema",
          title: "User",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
          },
          $ref: "#/components/schemas/User",
          required: ["id", "name"],
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) throw new Error("Result is undefined");

      const resultString = result.toString();

      // $ref should be first
      const refIndex = resultString.indexOf("$ref:");
      const titleIndex = resultString.indexOf("title:");
      expect(refIndex).toBeLessThan(titleIndex);
    });
  });

  describe("Parameter Object (all versions)", () => {
    it("should format parameter object with $ref at root correctly", () => {
      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          name: "offset",
          in: "query",
          description: "Pagination offset",
          schema: { type: "integer" },
          $ref: "#/components/parameters/Offset",
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) throw new Error("Result is undefined");

      const resultString = result.toString();

      // $ref should be first
      const refIndex = resultString.indexOf("$ref:");
      const nameIndex = resultString.indexOf("name:");
      expect(refIndex).toBeLessThan(nameIndex);
    });
  });

  describe("Response Object (all versions)", () => {
    it("should format response object with $ref at root correctly", () => {
      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          description: "Success response",
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
          $ref: "#/components/responses/Success",
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) throw new Error("Result is undefined");

      const resultString = result.toString();

      // $ref should be first
      const refIndex = resultString.indexOf("$ref:");
      const descriptionIndex = resultString.indexOf("description:");
      expect(refIndex).toBeLessThan(descriptionIndex);
    });
  });

  describe("Header Object (OpenAPI 3.0+)", () => {
    it("should format header object with $ref at root correctly", () => {
      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          description: "Rate limit header",
          required: true,
          schema: { type: "integer" },
          $ref: "#/components/headers/RateLimit",
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) throw new Error("Result is undefined");

      const resultString = result.toString();

      // $ref should be first
      const refIndex = resultString.indexOf("$ref:");
      const descriptionIndex = resultString.indexOf("description:");
      expect(refIndex).toBeLessThan(descriptionIndex);
    });
  });

  describe("Path Item Object (all versions)", () => {
    it("should format path item object with $ref at root correctly", () => {
      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          summary: "User operations",
          description: "Path for user-related operations",
          get: {
            summary: "Get user",
            responses: { "200": { description: "OK" } },
          },
          $ref: "#/components/pathItems/UserPath",
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) throw new Error("Result is undefined");

      const resultString = result.toString();

      // $ref should be first
      const refIndex = resultString.indexOf("$ref:");
      const summaryIndex = resultString.indexOf("summary:");
      expect(refIndex).toBeLessThan(summaryIndex);
    });
  });

  describe("Link Object (OpenAPI 3.0+)", () => {
    it("should format link object with $ref at root correctly", () => {
      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          operationId: "getUser",
          description: "Link to get user operation",
          parameters: { userId: "$response.body#/id" },
          $ref: "#/components/links/UserLink",
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) throw new Error("Result is undefined");

      const resultString = result.toString();

      // $ref should be first
      const refIndex = resultString.indexOf("$ref:");
      const operationIdIndex = resultString.indexOf("operationId:");
      expect(refIndex).toBeLessThan(operationIdIndex);
    });
  });

  describe("Request Body Object (OpenAPI 3.0+)", () => {
    it("should format request body object with $ref at root correctly", () => {
      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          description: "User data",
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
          $ref: "#/components/requestBodies/UserRequestBody",
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) throw new Error("Result is undefined");

      const resultString = result.toString();

      // $ref should be first
      const refIndex = resultString.indexOf("$ref:");
      const descriptionIndex = resultString.indexOf("description:");
      expect(refIndex).toBeLessThan(descriptionIndex);
    });
  });

  describe("Callback Object (OpenAPI 3.0+)", () => {
    it("should format callback object correctly", () => {
      // Callbacks are maps where values are Path Item Objects
      // Each path item already supports $ref, so we test the structure
      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          "{$request.body#/callbackUrl}": {
            $ref: "#/components/pathItems/CallbackPath",
            post: {
              requestBody: {
                description: "Callback payload",
              },
              responses: {
                "200": { description: "Success" },
              },
            },
          },
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) throw new Error("Result is undefined");

      const resultString = result.toString();

      // The path item should have $ref first
      const refIndex = resultString.indexOf("$ref:");
      const postIndex = resultString.indexOf("post:");
      expect(refIndex).toBeLessThan(postIndex);
    });
  });

  describe("Components Object (OpenAPI 3.0+) - sub-objects", () => {
    it("should format components/schemas object correctly", () => {
      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          type: "object",
          $ref: "#/components/schemas/User",
          properties: { id: { type: "integer" } },
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) throw new Error("Result is undefined");

      const resultString = result.toString();

      // $ref should be first
      const refIndex = resultString.indexOf("$ref:");
      const typeIndex = resultString.indexOf("type:");
      expect(refIndex).toBeLessThan(typeIndex);
    });
  });

  describe("Definitions Object (Swagger 2.0)", () => {
    it("should format definitions object correctly", () => {
      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          type: "object",
          $ref: "#/definitions/User",
          properties: { id: { type: "integer" } },
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) throw new Error("Result is undefined");

      const resultString = result.toString();

      // $ref should be first
      const refIndex = resultString.indexOf("$ref:");
      const typeIndex = resultString.indexOf("type:");
      expect(refIndex).toBeLessThan(typeIndex);
    });
  });

  describe("Parameters Definitions Object (Swagger 2.0)", () => {
    it("should format parameters definition object correctly", () => {
      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          name: "limit",
          in: "query",
          description: "Result limit",
          $ref: "#/parameters/Limit",
          type: "integer",
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) throw new Error("Result is undefined");

      const resultString = result.toString();

      // $ref should be first
      const refIndex = resultString.indexOf("$ref:");
      const nameIndex = resultString.indexOf("name:");
      expect(refIndex).toBeLessThan(nameIndex);
    });
  });

  describe("Responses Definitions Object (Swagger 2.0)", () => {
    it("should format responses definition object correctly", () => {
      const testData = {
        isOpenAPI: true,
        format: "yaml",
        content: {
          description: "Error response",
          $ref: "#/responses/Error",
          schema: { type: "object" },
        },
        originalText: "",
      };

      // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) throw new Error("Result is undefined");

      const resultString = result.toString();

      // $ref should be first
      const refIndex = resultString.indexOf("$ref:");
      const descriptionIndex = resultString.indexOf("description:");
      expect(refIndex).toBeLessThan(descriptionIndex);
    });
  });
});
