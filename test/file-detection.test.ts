import { describe, expect, it } from 'bun:test';
import plugin from '../src/index';

describe('File Detection Tests', () => {
  it('should detect OpenAPI root files', () => {
    const parser = plugin.parsers?.['openapi-parser'];
    expect(parser).toBeDefined();

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

    // @ts-expect-error We are mocking things here
    const result = parser?.parse(testYaml, { filepath: 'openapi.yaml' });
    
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi');
    expect(result?.format).toBe('yaml');
    expect(result?.content.openapi).toBe('3.0.0');
  });

  it('should detect partial schema files', () => {
    const parser = plugin.parsers?.['openapi-parser'];
    expect(parser).toBeDefined();

    const schemaYaml = `type: object
properties:
  id:
    type: integer
  name:
    type: string
required:
  - id
  - name`;

    // @ts-expect-error We are mocking things here
    const result = parser?.parse(schemaYaml, { filepath: 'components/schemas/User.yaml' });
    
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi');
    expect(result?.format).toBe('yaml');
    expect(result?.content.type).toBe('object');
  });

  it('should detect parameter files', () => {
    const parser = plugin.parsers?.['openapi-parser'];
    expect(parser).toBeDefined();

    const parameterYaml = `name: id
in: path
required: true
description: User ID
schema:
  type: integer`;

    // @ts-expect-error We are mocking things here
    const result = parser?.parse(parameterYaml, { filepath: 'components/parameters/UserId.yaml' });
    
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi');
    expect(result?.format).toBe('yaml');
    expect(result?.content.name).toBe('id');
  });

  it('should detect response files', () => {
    const parser = plugin.parsers?.['openapi-parser'];
    expect(parser).toBeDefined();

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

    // @ts-expect-error We are mocking things here
    const result = parser?.parse(responseYaml, { filepath: 'components/responses/UserResponse.yaml' });
    
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi');
    expect(result?.format).toBe('yaml');
    expect(result?.content.description).toBe('User response');
  });

  it('should detect path files', () => {
    const parser = plugin.parsers?.['openapi-parser'];
    expect(parser).toBeDefined();

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

    // @ts-expect-error We are mocking things here
    const result = parser?.parse(pathYaml, { filepath: 'paths/users.yaml' });
    
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi');
    expect(result?.format).toBe('yaml');
    expect(result?.content.get).toBeDefined();
    expect(result?.content.post).toBeDefined();
  });

  it('should detect security scheme files', () => {
    const parser = plugin.parsers?.['openapi-parser'];
    expect(parser).toBeDefined();

    const securityYaml = `type: http
scheme: bearer
bearerFormat: JWT
description: JWT authentication`;

    // @ts-expect-error We are mocking things here
    const result = parser?.parse(securityYaml, { filepath: 'components/securitySchemes/BearerAuth.yaml' });
    
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi');
    expect(result?.format).toBe('yaml');
    expect(result?.content.type).toBe('http');
  });

  it('should reject non-OpenAPI files', () => {
    const parser = plugin.parsers?.['openapi-parser'];
    expect(parser).toBeDefined();

    const nonOpenAPIYaml = `name: John
age: 30
city: New York`;

    // @ts-expect-error We are mocking things here
    expect(() => parser?.parse(nonOpenAPIYaml, { filepath: 'config/data.yaml' })).toThrow('Not an OpenAPI file');
  });

  it('should accept files in OpenAPI directories even with simple content', () => {
    const parser = plugin.parsers?.['openapi-parser'];
    expect(parser).toBeDefined();

    const simpleYaml = `name: John
age: 30
city: New York`;

    // @ts-expect-error We are mocking things here
    const result = parser?.parse(simpleYaml, { filepath: 'components/schemas/User.yaml' });
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi');
    expect(result?.format).toBe('yaml');
  });

  it('should support component directory patterns', () => {
    const parser = plugin.parsers?.['openapi-parser'];
    expect(parser).toBeDefined();

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
      // @ts-expect-error We are mocking things here
      const result = parser?.parse(componentYaml, { filepath: path });
      expect(result).toBeDefined();
      expect(result?.type).toBe('openapi');
    expect(result?.format).toBe('yaml');
    });
  });
});
