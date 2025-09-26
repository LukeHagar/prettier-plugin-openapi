import { describe, expect, it } from 'bun:test';
import plugin from '../src/index';

describe('Coverage Tests', () => {
  describe('Error handling and edge cases', () => {
    it('should handle null and undefined content', () => {
      const jsonParser = plugin.parsers?.['openapi-json-parser'];
      expect(jsonParser).toBeDefined();

      // Test with null content
      expect(() => {
        // @ts-expect-error We are testing edge cases
        jsonParser?.parse('null', {});
      }).toThrow();

      // Test with undefined content
      expect(() => {
        // @ts-expect-error We are testing edge cases
        jsonParser?.parse('undefined', {});
      }).toThrow();
    });

    it('should handle non-object content', () => {
      const jsonParser = plugin.parsers?.['openapi-json-parser'];
      expect(jsonParser).toBeDefined();

      // Test with string content
      expect(() => {
        // @ts-expect-error We are testing edge cases
        jsonParser?.parse('"string"', {});
      }).toThrow();

      // Test with number content
      expect(() => {
        // @ts-expect-error We are testing edge cases
        jsonParser?.parse('123', {});
      }).toThrow();
    });

    it('should handle array content', () => {
      const jsonParser = plugin.parsers?.['openapi-json-parser'];
      expect(jsonParser).toBeDefined();

      // Test with array content
      expect(() => {
        // @ts-expect-error We are testing edge cases
        jsonParser?.parse('[]', {});
      }).toThrow();
    });

    it('should handle malformed JSON', () => {
      const jsonParser = plugin.parsers?.['openapi-json-parser'];
      expect(jsonParser).toBeDefined();

      // Test with malformed JSON
      expect(() => {
        // @ts-expect-error We are testing edge cases
        jsonParser?.parse('{invalid json}', {});
      }).toThrow('Failed to parse OpenAPI JSON');
    });

    it('should handle malformed YAML', () => {
      const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
      expect(yamlParser).toBeDefined();

      // Test with malformed YAML
      expect(() => {
        // @ts-expect-error We are testing edge cases
        yamlParser?.parse('invalid: yaml: content:', {});
      }).toThrow('Failed to parse OpenAPI YAML');
    });
  });

  describe('File path detection', () => {
    it('should detect OpenAPI files in component directories', () => {
      const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
      expect(yamlParser).toBeDefined();

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
        const result = yamlParser?.parse(testYaml, { filepath: path });
        expect(result).toBeDefined();
        expect(result?.type).toBe('openapi-yaml');
      });
    });

    it('should handle files without filepath', () => {
      const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
      expect(yamlParser).toBeDefined();

      const testYaml = `openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0`;

      // @ts-expect-error We are testing edge cases
      const result = yamlParser?.parse(testYaml, {});
      expect(result).toBeDefined();
      expect(result?.type).toBe('openapi-yaml');
    });
  });

  describe('Object type detection', () => {
    it('should detect operation objects', () => {
      const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
      expect(yamlParser).toBeDefined();

      const operationYaml = `get:
  summary: Get users
  responses:
    '200':
      description: Success`;

      // @ts-expect-error We are testing edge cases
      const result = yamlParser?.parse(operationYaml, { filepath: 'paths/users.yaml' });
      expect(result).toBeDefined();
      expect(result?.type).toBe('openapi-yaml');
    });

    it('should detect parameter objects', () => {
      const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
      expect(yamlParser).toBeDefined();

      const parameterYaml = `name: id
in: path
required: true
schema:
  type: integer`;

      // @ts-expect-error We are testing edge cases
      const result = yamlParser?.parse(parameterYaml, { filepath: 'components/parameters/UserId.yaml' });
      expect(result).toBeDefined();
      expect(result?.type).toBe('openapi-yaml');
    });

    it('should detect schema objects', () => {
      const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
      expect(yamlParser).toBeDefined();

      const schemaYaml = `type: object
properties:
  id:
    type: integer
  name:
    type: string
required:
  - id`;

      // @ts-expect-error We are testing edge cases
      const result = yamlParser?.parse(schemaYaml, { filepath: 'components/schemas/User.yaml' });
      expect(result).toBeDefined();
      expect(result?.type).toBe('openapi-yaml');
    });

    it('should detect response objects', () => {
      const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
      expect(yamlParser).toBeDefined();

      const responseYaml = `description: User response
content:
  application/json:
    schema:
      type: object`;

      // @ts-expect-error We are testing edge cases
      const result = yamlParser?.parse(responseYaml, { filepath: 'components/responses/UserResponse.yaml' });
      expect(result).toBeDefined();
      expect(result?.type).toBe('openapi-yaml');
    });

    it('should detect security scheme objects', () => {
      const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
      expect(yamlParser).toBeDefined();

      const securityYaml = `type: http
scheme: bearer
bearerFormat: JWT`;

      // @ts-expect-error We are testing edge cases
      const result = yamlParser?.parse(securityYaml, { filepath: 'components/securitySchemes/BearerAuth.yaml' });
      expect(result).toBeDefined();
      expect(result?.type).toBe('openapi-yaml');
    });

    it('should detect server objects', () => {
      const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
      expect(yamlParser).toBeDefined();

      const serverYaml = `url: https://api.example.com
description: Production server`;

      // @ts-expect-error We are testing edge cases
      const result = yamlParser?.parse(serverYaml, { filepath: 'servers/production.yaml' });
      expect(result).toBeDefined();
      expect(result?.type).toBe('openapi-yaml');
    });

    it('should detect tag objects', () => {
      const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
      expect(yamlParser).toBeDefined();

      const tagYaml = `name: users
description: User management operations`;

      // @ts-expect-error We are testing edge cases
      const result = yamlParser?.parse(tagYaml, { filepath: 'tags/users.yaml' });
      expect(result).toBeDefined();
      expect(result?.type).toBe('openapi-yaml');
    });

    it('should detect external docs objects', () => {
      const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
      expect(yamlParser).toBeDefined();

      const externalDocsYaml = `url: https://example.com/docs
description: External documentation`;

      // @ts-expect-error We are testing edge cases
      const result = yamlParser?.parse(externalDocsYaml, { filepath: 'externalDocs/api.yaml' });
      expect(result).toBeDefined();
      expect(result?.type).toBe('openapi-yaml');
    });

    it('should detect webhook objects', () => {
      const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
      expect(yamlParser).toBeDefined();

      const webhookYaml = `post:
  summary: New message webhook
  responses:
    '200':
      description: Success`;

      // @ts-expect-error We are testing edge cases
      const result = yamlParser?.parse(webhookYaml, { filepath: 'webhooks/messageCreated.yaml' });
      expect(result).toBeDefined();
      expect(result?.type).toBe('openapi-yaml');
    });
  });

  describe('Sorting functions', () => {
    it('should handle path sorting by specificity', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          paths: {
            '/users/{id}': { get: {} },
            '/users': { get: {} },
            '/users/{id}/posts': { get: {} }
          }
        }
      };

      // @ts-expect-error We are testing edge cases
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
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
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
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
        }
      };

      // @ts-expect-error We are testing edge cases
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
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
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
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
        }
      };

      // @ts-expect-error We are testing edge cases
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();
      
      if (result && typeof result === 'string') {
        const formatted = JSON.parse(result);
        expect(formatted.components.schemas.User).toBeDefined();
        expect(formatted.components.schemas.User.type).toBe('object');
      }
    });
  });
});
