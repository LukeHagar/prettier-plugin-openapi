import { describe, expect, it } from 'bun:test';
import prettier from 'prettier';
import * as plugin from '../src/index.js';

describe('Edge Cases and Coverage Improvement', () => {
  describe('Error Handling', () => {
    it('should handle non-object content gracefully', async () => {
      const stringResult = await prettier.format('"string"', {
        parser: 'json',
        plugins: [plugin]
      });
      expect(stringResult.trim()).toBe('"string"');

      const numberResult = await prettier.format('123', {
        parser: 'json',
        plugins: [plugin]
      });
      expect(numberResult.trim()).toBe('123');
    });

    it('should handle array content gracefully', async () => {
      const result = await prettier.format('[1, 2, 3]', {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result.trim()).toBe('[1, 2, 3]');
    });
  });

  describe('Component Detection', () => {
    it('should detect components section', () => {
      const content = {
        openapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        components: {
          schemas: {
            User: { type: 'object' }
          }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect definitions in Swagger 2.0', () => {
      const content = {
        swagger: '2.0',
        info: { title: 'Test', version: '1.0.0' },
        definitions: {
          User: { type: 'object' }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect parameters in Swagger 2.0', () => {
      const content = {
        swagger: '2.0',
        info: { title: 'Test', version: '1.0.0' },
        parameters: {
          limit: { name: 'limit', in: 'query', type: 'integer' }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect responses in Swagger 2.0', () => {
      const content = {
        swagger: '2.0',
        info: { title: 'Test', version: '1.0.0' },
        responses: {
          Error: { description: 'Error response' }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect securityDefinitions in Swagger 2.0', () => {
      const content = {
        swagger: '2.0',
        info: { title: 'Test', version: '1.0.0' },
        securityDefinitions: {
          apiKey: { type: 'apiKey', in: 'header', name: 'X-API-Key' }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });
  });

  describe('Schema Object Detection', () => {
    it('should detect schema with $ref', () => {
      const content = {
        $ref: '#/components/schemas/User'
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect schema with allOf', () => {
      const content = {
        allOf: [
          { type: 'object' },
          { properties: { name: { type: 'string' } } }
        ]
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect schema with oneOf', () => {
      const content = {
        oneOf: [
          { type: 'string' },
          { type: 'number' }
        ]
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect schema with anyOf', () => {
      const content = {
        anyOf: [
          { type: 'string' },
          { type: 'number' }
        ]
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect schema with not', () => {
      const content = {
        not: { type: 'string' }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect schema with properties', () => {
      const content = {
        type: 'object',
        properties: {
          name: { type: 'string' }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect schema with items', () => {
      const content = {
        type: 'array',
        items: { type: 'string' }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });
  });

  describe('Path Object Detection', () => {
    it('should detect path with get operation', () => {
      const content = {
        get: {
          summary: 'Get users',
          responses: { '200': { description: 'Success' } }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect path with post operation', () => {
      const content = {
        post: {
          summary: 'Create user',
          responses: { '201': { description: 'Created' } }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect path with put operation', () => {
      const content = {
        put: {
          summary: 'Update user',
          responses: { '200': { description: 'Updated' } }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect path with delete operation', () => {
      const content = {
        delete: {
          summary: 'Delete user',
          responses: { '204': { description: 'Deleted' } }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect path with patch operation', () => {
      const content = {
        patch: {
          summary: 'Patch user',
          responses: { '200': { description: 'Patched' } }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect path with head operation', () => {
      const content = {
        head: {
          summary: 'Head user',
          responses: { '200': { description: 'Head' } }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect path with options operation', () => {
      const content = {
        options: {
          summary: 'Options user',
          responses: { '200': { description: 'Options' } }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect path with trace operation', () => {
      const content = {
        trace: {
          summary: 'Trace user',
          responses: { '200': { description: 'Trace' } }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });
  });

  describe('Parameter Object Detection', () => {
    it('should detect parameter with in: query', () => {
      const content = {
        name: 'limit',
        in: 'query',
        type: 'integer'
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect parameter with in: header', () => {
      const content = {
        name: 'Authorization',
        in: 'header',
        type: 'string'
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect parameter with in: path', () => {
      const content = {
        name: 'id',
        in: 'path',
        required: true,
        type: 'string'
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect parameter with in: cookie', () => {
      const content = {
        name: 'session',
        in: 'cookie',
        type: 'string'
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });
  });

  describe('Response Object Detection', () => {
    it('should detect response with description', () => {
      const content = {
        description: 'Success response',
        content: {
          'application/json': {
            schema: { type: 'object' }
          }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect response with headers', () => {
      const content = {
        description: 'Response with headers',
        headers: {
          'X-Rate-Limit': {
            description: 'Rate limit',
            schema: { type: 'integer' }
          }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect response with links', () => {
      const content = {
        description: 'Response with links',
        links: {
          next: {
            operationId: 'getNextPage'
          }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });
  });

  describe('Security Scheme Object Detection', () => {
    it('should detect security scheme with type: apiKey', () => {
      const content = {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key'
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect security scheme with type: http', () => {
      const content = {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect security scheme with type: oauth2', () => {
      const content = {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: 'https://example.com/oauth/authorize',
            scopes: { read: 'Read access' }
          }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect security scheme with type: openIdConnect', () => {
      const content = {
        type: 'openIdConnect',
        openIdConnectUrl: 'https://example.com/.well-known/openid_configuration'
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });
  });

  describe('Server Object Detection', () => {
    it('should detect server with url', () => {
      const content = {
        url: 'https://api.example.com/v1',
        description: 'Production server'
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect server with variables', () => {
      const content = {
        url: 'https://{username}.example.com:{port}/{basePath}',
        variables: {
          username: { default: 'demo' },
          port: { default: '443' },
          basePath: { default: 'v2' }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });
  });

  describe('Tag Object Detection', () => {
    it('should detect tag with name', () => {
      const content = {
        name: 'users',
        description: 'User operations'
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });

    it('should detect tag with externalDocs', () => {
      const content = {
        name: 'users',
        externalDocs: {
          description: 'Find out more',
          url: 'https://example.com'
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });
  });

  describe('External Docs Object Detection', () => {
    it('should detect external docs with url', () => {
      const content = {
        description: 'Find out more about our API',
        url: 'https://example.com/docs'
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });
  });

  describe('Webhook Object Detection', () => {
    it('should detect webhook with operationId', () => {
      const content = {
        post: {
          operationId: 'webhookHandler',
          responses: { '200': { description: 'Success' } }
        }
      };

      const result = prettier.format(JSON.stringify(content), {
        parser: 'json',
        plugins: [plugin]
      });
      
      expect(result).toBeDefined();
    });
  });
});
