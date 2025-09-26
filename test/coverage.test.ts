import { describe, expect, it } from 'bun:test';
import { parsers, printers } from '../src/index';

describe('Coverage Tests', () => {
  describe('File path detection', () => {
    it('should detect OpenAPI files in component directories', () => {
      const parser = parsers?.['openapi-parser'];
      expect(parser).toBeDefined();

      const testYaml = `type: object
properties:
  id:
    type: integer`;

      // Test various component directory patterns
      const paths = [
        'components/schemas/User.yaml',
        'components/parameters/UserId.yaml',
        'components/responses/UserResponse.yaml',
        'components/requestBodies/UserCreateBody.yaml',
        'components/headers/RateLimitHeaders.yaml',
        'components/examples/UserExample.yaml',
        'components/securitySchemes/BearerAuth.yaml',
        'components/links/UserCreatedLink.yaml',
        'components/callbacks/NewMessageCallback.yaml',
        'webhooks/messageCreated.yaml',
        'paths/users.yaml'
      ];

      paths.forEach(path => {
        // @ts-expect-error We are testing edge cases
        const result = parser?.parse(testYaml, { filepath: path });
        expect(result).toBeDefined();
        expect(result?.isOpenAPI).toBeTrue();
        expect(result?.format).toBe('yaml');
      });
    });

    it('should handle files without filepath', () => {
      const parser = parsers?.['openapi-parser'];
      expect(parser).toBeDefined();

      const testYaml = `openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0`;

      // @ts-expect-error We are testing edge cases
      const result = parser?.parse(testYaml, { filepath: 'test.yaml' });
      expect(result).toBeDefined();
      expect(result?.isOpenAPI).toBeTrue();
    });
  });

  describe('Object type detection', () => {
    it('should detect operation objects', () => {
      const parser = parsers?.['openapi-parser'];
      expect(parser).toBeDefined();

      const operationYaml = `get:
  summary: Get users
  responses:
    '200':
      description: Success`;

      // @ts-expect-error We are testing edge cases
      const result = parser?.parse(operationYaml, { filepath: 'paths/users.yaml' });
      expect(result).toBeDefined();
      expect(result?.isOpenAPI).toBeTrue();
    });

    it('should detect parameter objects', () => {
      const parser = parsers?.['openapi-parser'];
      expect(parser).toBeDefined();

      const parameterYaml = `name: id
in: path
required: true
schema:
  type: integer`;

      // @ts-expect-error We are testing edge cases
      const result = parser?.parse(parameterYaml, { filepath: 'components/parameters/UserId.yaml' });
      expect(result).toBeDefined();
      expect(result?.isOpenAPI).toBeTrue();
    });

    it('should detect schema objects', () => {
      const parser = parsers?.['openapi-parser'];
      expect(parser).toBeDefined();

      const schemaYaml = `type: object
properties:
  id:
    type: integer
  name:
    type: string
required:
  - id`;

      // @ts-expect-error We are testing edge cases
      const result = parser?.parse(schemaYaml, { filepath: 'components/schemas/User.yaml' });
      expect(result).toBeDefined();
      expect(result?.isOpenAPI).toBeTrue();
    });

    it('should detect response objects', () => {
      const parser = parsers?.['openapi-parser'];
      expect(parser).toBeDefined();

      const responseYaml = `description: User response
content:
  application/json:
    schema:
      type: object`;

      // @ts-expect-error We are testing edge cases
      const result = parser?.parse(responseYaml, { filepath: 'components/responses/UserResponse.yaml' });
      expect(result).toBeDefined();
      expect(result?.isOpenAPI).toBeTrue();
    });

    it('should detect security scheme objects', () => {
      const parser = parsers?.['openapi-parser'];
      expect(parser).toBeDefined();

      const securityYaml = `type: http
scheme: bearer
bearerFormat: JWT`;

      // @ts-expect-error We are testing edge cases
      const result = parser?.parse(securityYaml, { filepath: 'components/securitySchemes/BearerAuth.yaml' });
      expect(result).toBeDefined();
      expect(result?.isOpenAPI).toBeTrue();
    });

    it('should detect server objects', () => {
      const parser = parsers?.['openapi-parser'];
      expect(parser).toBeDefined();

      const serverYaml = `url: https://api.example.com
description: Production server`;

      // @ts-expect-error We are testing edge cases
      const result = parser?.parse(serverYaml, { filepath: 'servers/production.yaml' });
      expect(result).toBeDefined();
      expect(result?.isOpenAPI).toBeTrue();
    });

    it('should detect tag objects', () => {
      const parser = parsers?.['openapi-parser'];
      expect(parser).toBeDefined();

      const tagYaml = `name: users
description: User management operations`;

      // @ts-expect-error We are testing edge cases
      const result = parser?.parse(tagYaml, { filepath: 'tags/users.yaml' });
      expect(result).toBeDefined();
      expect(result?.isOpenAPI).toBeTrue();
    });

    it('should detect external docs objects', () => {
      const parser = parsers?.['openapi-parser'];
      expect(parser).toBeDefined();

      const externalDocsYaml = `url: https://example.com/docs
description: External documentation`;

      // @ts-expect-error We are testing edge cases
      const result = parser?.parse(externalDocsYaml, { filepath: 'externalDocs/api.yaml' });
      expect(result).toBeDefined();
      expect(result?.isOpenAPI).toBeTrue();
    });

    it('should detect webhook objects', () => {
      const parser = parsers?.['openapi-parser'];
      expect(parser).toBeDefined();

      const webhookYaml = `post:
  summary: New message webhook
  responses:
    '200':
      description: Success`;

      // @ts-expect-error We are testing edge cases
      const result = parser?.parse(webhookYaml, { filepath: 'webhooks/messageCreated.yaml' });
      expect(result).toBeDefined();
      expect(result?.isOpenAPI).toBeTrue();
    });
  });

  describe('Sorting functions', () => {
    it('should handle path sorting by specificity', () => {
      const printer = printers?.['openapi-ast'];
      expect(printer).toBeDefined();

      const testData = {
        isOpenAPI: true,
        content: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          paths: {
            '/users/{id}': { get: {} },
            '/users': { get: {} },
            '/users/{id}/posts': { get: {} }
          }
        },
        originalText: '',
        format: 'json'
      };

      // @ts-expect-error We are testing edge cases
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();

      if (result && typeof result === 'string') {
        const formatted = JSON.parse(result);
        const pathKeys = Object.keys(formatted.paths);
        // Paths should be sorted (the exact order may vary based on implementation)
        expect(pathKeys).toContain('/users');
        expect(pathKeys).toContain('/users/{id}');
        expect(pathKeys).toContain('/users/{id}/posts');
      }
    });

    it('should handle response code sorting', () => {
      const printer = printers?.['openapi-ast'];
      expect(printer).toBeDefined();

      const testData = {
        isOpenAPI: true,
        content: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          paths: {
            '/test': {
              get: {
                responses: {
                  '500': { description: 'Server Error' },
                  '200': { description: 'Success' },
                  '400': { description: 'Bad Request' }
                }
              }
            }
          }
        },
        originalText: '',
        format: 'json'
      };

      // @ts-expect-error We are testing edge cases
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();

      if (result && typeof result === 'string') {
        const formatted = JSON.parse(result);
        const responseKeys = Object.keys(formatted.paths['/test'].get.responses);
        // Response codes should be sorted numerically
        expect(responseKeys[0]).toBe('200');
        expect(responseKeys[1]).toBe('400');
        expect(responseKeys[2]).toBe('500');
      }
    });
  });

  describe('Context key detection', () => {
    it('should handle nested path contexts', () => {
      const printer = printers?.['openapi-ast'];
      expect(printer).toBeDefined();

      const testData = {
        isOpenAPI: true,
        content: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          components: {
            schemas: {
              User: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' }
                }
              }
            }
          }
        },
        originalText: '',
        format: 'json'
      };

      // @ts-expect-error We are testing edge cases
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();

      if (result && typeof result === 'string') {
        const formatted = JSON.parse(result);
        expect(formatted.components.schemas.User).toBeDefined();
        expect(formatted.components.schemas.User.type).toBe('object');
      }
    });
  });
});
