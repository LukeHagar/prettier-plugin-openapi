import { describe, expect, it } from 'bun:test';
import plugin from '../src/index';

describe('File Detection Tests', () => {
  it('should detect OpenAPI root files', () => {
    const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
    expect(yamlParser).toBeDefined();

    const testYaml = `openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      responses:
        '200':
          description: Success`;

    // @ts-ignore We are mocking things here
    const result = yamlParser?.parse(testYaml, { filepath: 'openapi.yaml' });
    
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi-yaml');
    expect(result?.content.openapi).toBe('3.0.0');
  });

  it('should detect partial schema files', () => {
    const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
    expect(yamlParser).toBeDefined();

    const schemaYaml = `type: object
properties:
  id:
    type: integer
  name:
    type: string
required:
  - id
  - name`;

    // @ts-ignore We are mocking things here
    const result = yamlParser?.parse(schemaYaml, { filepath: 'components/schemas/User.yaml' });
    
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi-yaml');
    expect(result?.content.type).toBe('object');
  });

  it('should detect parameter files', () => {
    const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
    expect(yamlParser).toBeDefined();

    const parameterYaml = `name: id
in: path
required: true
description: User ID
schema:
  type: integer`;

    // @ts-ignore We are mocking things here
    const result = yamlParser?.parse(parameterYaml, { filepath: 'components/parameters/UserId.yaml' });
    
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi-yaml');
    expect(result?.content.name).toBe('id');
  });

  it('should detect response files', () => {
    const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
    expect(yamlParser).toBeDefined();

    const responseYaml = `description: User response
content:
  application/json:
    schema:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string`;

    // @ts-ignore We are mocking things here
    const result = yamlParser?.parse(responseYaml, { filepath: 'components/responses/UserResponse.yaml' });
    
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi-yaml');
    expect(result?.content.description).toBe('User response');
  });

  it('should detect path files', () => {
    const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
    expect(yamlParser).toBeDefined();

    const pathYaml = `get:
  summary: Get users
  responses:
    '200':
      description: Success
post:
  summary: Create user
  requestBody:
    content:
      application/json:
        schema:
          type: object`;

    // @ts-ignore We are mocking things here
    const result = yamlParser?.parse(pathYaml, { filepath: 'paths/users.yaml' });
    
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi-yaml');
    expect(result?.content.get).toBeDefined();
    expect(result?.content.post).toBeDefined();
  });

  it('should detect security scheme files', () => {
    const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
    expect(yamlParser).toBeDefined();

    const securityYaml = `type: http
scheme: bearer
bearerFormat: JWT
description: JWT authentication`;

    // @ts-ignore We are mocking things here
    const result = yamlParser?.parse(securityYaml, { filepath: 'components/securitySchemes/BearerAuth.yaml' });
    
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi-yaml');
    expect(result?.content.type).toBe('http');
  });

  it('should reject non-OpenAPI files', () => {
    const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
    expect(yamlParser).toBeDefined();

    const nonOpenAPIYaml = `name: John
age: 30
city: New York`;

    // @ts-ignore We are mocking things here
    expect(() => yamlParser?.parse(nonOpenAPIYaml, { filepath: 'config/data.yaml' })).toThrow('Not an OpenAPI file');
  });

  it('should accept files in OpenAPI directories even with simple content', () => {
    const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
    expect(yamlParser).toBeDefined();

    const simpleYaml = `name: John
age: 30
city: New York`;

    // @ts-ignore We are mocking things here
    const result = yamlParser?.parse(simpleYaml, { filepath: 'components/schemas/User.yaml' });
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi-yaml');
  });

  it('should support component directory patterns', () => {
    const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
    expect(yamlParser).toBeDefined();

    const componentYaml = `type: object
properties:
  message:
    type: string`;

    // Test various component directory patterns
    const paths = [
      'components/schemas/Error.yaml',
      'components/parameters/CommonPagination.yaml',
      'components/responses/ErrorResponse.yaml',
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
      // @ts-ignore We are mocking things here
      const result = yamlParser?.parse(componentYaml, { filepath: path });
      expect(result).toBeDefined();
      expect(result?.type).toBe('openapi-yaml');
    });
  });
});
