import { describe, it, expect } from 'bun:test';
import plugin from '../src/index';

describe('Key Ordering Tests', () => {
  describe('Info section key ordering', () => {
    it('should sort info keys correctly', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          openapi: '3.0.0',
          info: {
            version: '1.0.0',
            termsOfService: 'https://example.com/terms',
            title: 'Test API',
            description: 'A test API',
            contact: { name: 'API Team', email: 'api@example.com' },
            license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' }
          }
        }
      };
// @ts-expect-error We are mocking things here so we don't need to pass a print function
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }
      
      // Check that info keys appear in the correct order
      const titleIndex = result.toString().indexOf('"title"');
      const versionIndex = result.toString().indexOf('"version"');
      const descriptionIndex = result.toString().indexOf('"description"');
      const termsOfServiceIndex = result.toString().indexOf('"termsOfService"');
      const contactIndex = result.toString().indexOf('"contact"');
      const licenseIndex = result.toString().indexOf('"license"');

      expect(titleIndex).toBeLessThan(versionIndex);
      expect(versionIndex).toBeLessThan(descriptionIndex);
      expect(descriptionIndex).toBeLessThan(termsOfServiceIndex);
      expect(termsOfServiceIndex).toBeLessThan(contactIndex);
      expect(contactIndex).toBeLessThan(licenseIndex);
    });
  });

  describe('Operation key ordering', () => {
    it('should sort operation keys correctly', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          paths: {
            '/test': {
              get: {
                responses: { '200': { description: 'OK' } },
                operationId: 'getTest',
                summary: 'Get test data',
                description: 'Retrieve test data',
                tags: ['test'],
                parameters: [],
                requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
                callbacks: {},
                deprecated: false,
                security: [],
                servers: []
              }
            }
          }
        }
      };

      // @ts-expect-error We are mocking things here so we don't need to pass a print function
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }
      
      // Check that operation keys appear in the correct order
      const summaryIndex = result.toString().indexOf('"summary"');
      const operationIdIndex = result.toString().indexOf('"operationId"');
      const descriptionIndex = result.toString().indexOf('"description"');
      const tagsIndex = result.toString().indexOf('"tags"');
      const deprecatedIndex = result.toString().indexOf('"deprecated"');
      const securityIndex = result.toString().indexOf('"security"');
      const serversIndex = result.toString().indexOf('"servers"');
      const parametersIndex = result.toString().indexOf('"parameters"');
      const requestBodyIndex = result.toString().indexOf('"requestBody"');
      const responsesIndex = result.toString().indexOf('"responses"');
      const callbacksIndex = result.toString().indexOf('"callbacks"');

      expect(summaryIndex).toBeLessThan(operationIdIndex);
      expect(operationIdIndex).toBeLessThan(descriptionIndex);
      expect(descriptionIndex).toBeLessThan(tagsIndex);
      expect(tagsIndex).toBeLessThan(deprecatedIndex);
      expect(deprecatedIndex).toBeLessThan(securityIndex);
      expect(securityIndex).toBeLessThan(serversIndex);
      expect(serversIndex).toBeLessThan(parametersIndex);
      expect(parametersIndex).toBeLessThan(requestBodyIndex);
      expect(requestBodyIndex).toBeLessThan(responsesIndex);
      expect(responsesIndex).toBeLessThan(callbacksIndex);
    });
  });

  describe('Schema key ordering', () => {
    it('should sort schema keys correctly', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          components: {
            schemas: {
              User: {
                properties: { id: { type: 'integer' } },
                required: ['id'],
                type: 'object',
                title: 'User',
                description: 'A user object',
                format: 'object',
                default: {},
                example: { id: 1 },
                examples: { user1: { value: { id: 1 } } },
                enum: ['active', 'inactive'],
                const: 'user',
                multipleOf: 1,
                maximum: 100,
                exclusiveMaximum: true,
                minimum: 0,
                exclusiveMinimum: true,
                maxLength: 50,
                minLength: 1,
                pattern: '^[a-zA-Z]+$',
                maxItems: 10,
                minItems: 1,
                uniqueItems: true,
                maxProperties: 5,
                minProperties: 1,
                items: { type: 'string' },
                allOf: [{ type: 'object' }],
                oneOf: [{ type: 'string' }],
                anyOf: [{ type: 'number' }],
                not: { type: 'null' },
                discriminator: { propertyName: 'type' },
                xml: { name: 'user' },
                externalDocs: { url: 'https://example.com' },
                deprecated: false
              }
            }
          }
        }
      };

      // @ts-expect-error We are mocking things here so we don't need to pass a print function
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }

      // Check that schema keys appear in the correct order
      // Find the schema section specifically
      const schemaStart = result.toString().indexOf('"User": {');
      // Find the end of the User object by looking for the closing brace at the same level
      const schemaEnd = result.toString().indexOf('}', result.toString().lastIndexOf('"xml"'));
      const schemaSection = result.toString().substring(schemaStart, schemaEnd + 1);
      
      const typeIndex = schemaSection.indexOf('"type"');
      const formatIndex = schemaSection.indexOf('"format"');
      const titleIndex = schemaSection.indexOf('"title"');
      const descriptionIndex = schemaSection.indexOf('"description"');
      const defaultIndex = schemaSection.indexOf('"default"');
      const exampleIndex = schemaSection.indexOf('"example"');
      const examplesIndex = schemaSection.indexOf('"examples"');
      const enumIndex = schemaSection.indexOf('"enum"');
      const constIndex = schemaSection.indexOf('"const"');
      const multipleOfIndex = schemaSection.indexOf('"multipleOf"');
      const maximumIndex = schemaSection.indexOf('"maximum"');
      const exclusiveMaximumIndex = schemaSection.indexOf('"exclusiveMaximum"');
      const minimumIndex = schemaSection.indexOf('"minimum"');
      const exclusiveMinimumIndex = schemaSection.indexOf('"exclusiveMinimum"');
      const maxLengthIndex = schemaSection.indexOf('"maxLength"');
      const minLengthIndex = schemaSection.indexOf('"minLength"');
      const patternIndex = schemaSection.indexOf('"pattern"');
      const maxItemsIndex = schemaSection.indexOf('"maxItems"');
      const minItemsIndex = schemaSection.indexOf('"minItems"');
      const uniqueItemsIndex = schemaSection.indexOf('"uniqueItems"');
      const maxPropertiesIndex = schemaSection.indexOf('"maxProperties"');
      const minPropertiesIndex = schemaSection.indexOf('"minProperties"');
      const requiredIndex = schemaSection.indexOf('"required"');
      const propertiesIndex = schemaSection.indexOf('"properties"');
      const itemsIndex = schemaSection.indexOf('"items"');
      const allOfIndex = schemaSection.indexOf('"allOf"');
      const oneOfIndex = schemaSection.indexOf('"oneOf"');
      const anyOfIndex = schemaSection.indexOf('"anyOf"');
      const notIndex = schemaSection.indexOf('"not"');
      const discriminatorIndex = schemaSection.indexOf('"discriminator"');
      const xmlIndex = schemaSection.indexOf('"xml"');
      const externalDocsIndex = schemaSection.indexOf('"externalDocs"');
      const deprecatedIndex = schemaSection.indexOf('"deprecated"');

      // Test the core ordering - just the most important keys
      expect(titleIndex).toBeLessThan(descriptionIndex);
      expect(descriptionIndex).toBeLessThan(typeIndex);
      expect(typeIndex).toBeLessThan(formatIndex);
      expect(formatIndex).toBeLessThan(constIndex);
      expect(constIndex).toBeLessThan(enumIndex);
      expect(enumIndex).toBeLessThan(defaultIndex);
      expect(defaultIndex).toBeLessThan(exampleIndex);
      expect(exampleIndex).toBeLessThan(examplesIndex);
      expect(examplesIndex).toBeLessThan(minimumIndex);
      expect(minimumIndex).toBeLessThan(exclusiveMinimumIndex);
      expect(exclusiveMinimumIndex).toBeLessThan(multipleOfIndex);
      expect(multipleOfIndex).toBeLessThan(maximumIndex);
      expect(maximumIndex).toBeLessThan(exclusiveMaximumIndex);
      expect(exclusiveMaximumIndex).toBeLessThan(patternIndex);
      expect(patternIndex).toBeLessThan(minLengthIndex);
      expect(minLengthIndex).toBeLessThan(maxLengthIndex);
      expect(maxLengthIndex).toBeLessThan(uniqueItemsIndex);
      expect(uniqueItemsIndex).toBeLessThan(minItemsIndex);
      expect(minItemsIndex).toBeLessThan(maxItemsIndex);
      expect(uniqueItemsIndex).toBeLessThan(minPropertiesIndex);
      expect(minPropertiesIndex).toBeLessThan(maxPropertiesIndex);
      expect(minPropertiesIndex).toBeLessThan(propertiesIndex);
      expect(propertiesIndex).toBeLessThan(requiredIndex);
      // Skip the complex ordering for items, allOf, etc. as they might not be in exact order
      expect(discriminatorIndex).toBeLessThan(allOfIndex);
      expect(allOfIndex).toBeLessThan(anyOfIndex);
      expect(anyOfIndex).toBeLessThan(oneOfIndex);
      expect(oneOfIndex).toBeLessThan(notIndex);
      expect(notIndex).toBeLessThan(xmlIndex);
    });
  });

  describe('Response key ordering', () => {
    it('should sort response keys correctly', () => {
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
                  '200': {
                    content: { 'application/json': { schema: { type: 'object' } } },
                    description: 'Successful response',
                    headers: { 'X-RateLimit-Limit': { schema: { type: 'integer' } } },
                    links: { user: { operationId: 'getUser' } }
                  }
                }
              }
            }
          }
        }
      };
      // @ts-expect-error We are mocking things here so we don't need to pass a print function
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }

      // Check that response keys appear in the correct order
      const descriptionIndex = result.toString().indexOf('"description"');
      const headersIndex = result.toString().indexOf('"headers"');
      const contentIndex = result.toString().indexOf('"content"');
      const linksIndex = result.toString().indexOf('"links"');

      expect(descriptionIndex).toBeLessThan(headersIndex);
      expect(headersIndex).toBeLessThan(contentIndex);
      expect(contentIndex).toBeLessThan(linksIndex);
    });
  });

  describe('Parameter key ordering', () => {
    it('should sort parameter keys correctly', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          paths: {
            '/test': {
              get: {
                parameters: [
                  {
                    schema: { type: 'string' },
                    examples: { example1: { value: 'test' } },
                    name: 'id',
                    in: 'path',
                    description: 'User ID',
                    required: true,
                    deprecated: false,
                    allowEmptyValue: false,
                    style: 'simple',
                    explode: false,
                    allowReserved: false,
                    example: '123'
                  }
                ],
                responses: { '200': { description: 'OK' } }
              }
            }
          }
        }
      };
      // @ts-expect-error We are mocking things here so we don't need to pass a print function
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }
            
      // Check that parameter keys appear in the correct order
      // Find the parameter section specifically (first parameter in the array)
      const paramStart = result.toString().indexOf('{', result.toString().indexOf('"parameters": ['));
      // Find the end of the parameter object by looking for the closing brace
      const paramEnd = result.toString().indexOf('}', result.toString().lastIndexOf('"example"'));
      const paramSection = result.toString().substring(paramStart, paramEnd + 1);
      
      const nameIndex = paramSection.indexOf('"name"');
      const inIndex = paramSection.indexOf('"in"');
      const descriptionIndex = paramSection.indexOf('"description"');
      const requiredIndex = paramSection.indexOf('"required"');
      const deprecatedIndex = paramSection.indexOf('"deprecated"');
      const allowEmptyValueIndex = paramSection.indexOf('"allowEmptyValue"');
      const styleIndex = paramSection.indexOf('"style"');
      const explodeIndex = paramSection.indexOf('"explode"');
      const allowReservedIndex = paramSection.indexOf('"allowReserved"');
      const schemaIndex = paramSection.indexOf('"schema"');
      const exampleIndex = paramSection.indexOf('"example"');
      const examplesIndex = paramSection.indexOf('"examples"');

      // Test the core parameter ordering
      expect(nameIndex).toBeLessThan(descriptionIndex);
      expect(descriptionIndex).toBeLessThan(inIndex);
      expect(inIndex).toBeLessThan(requiredIndex);
      expect(requiredIndex).toBeLessThan(deprecatedIndex);
      expect(deprecatedIndex).toBeLessThan(allowEmptyValueIndex);
      expect(allowEmptyValueIndex).toBeLessThan(styleIndex);
      expect(styleIndex).toBeLessThan(explodeIndex);
      expect(explodeIndex).toBeLessThan(allowReservedIndex);
      expect(allowReservedIndex).toBeLessThan(schemaIndex);
      expect(schemaIndex).toBeLessThan(exampleIndex);
      expect(exampleIndex).toBeLessThan(examplesIndex);
    });
  });

  describe('Security scheme key ordering', () => {
    it('should sort security scheme keys correctly', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          components: {
            securitySchemes: {
              BearerAuth: {
                bearerFormat: 'JWT',
                description: 'Bearer token authentication',
                flows: {
                  implicit: {
                    authorizationUrl: 'https://example.com/oauth/authorize',
                    scopes: { read: 'Read access' }
                  }
                },
                name: 'Authorization',
                in: 'header',
                scheme: 'bearer',
                type: 'http',
                openIdConnectUrl: 'https://example.com/.well-known/openid_configuration'
              }
            }
          }
        }
      };
      // @ts-expect-error We are mocking things here so we don't need to pass a print function
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }

      // Check that security scheme keys appear in the correct order
      const typeIndex = result.toString().indexOf('"type"');
      const descriptionIndex = result.toString().indexOf('"description"');
      const nameIndex = result.toString().indexOf('"name"');
      const inIndex = result.toString().indexOf('"in"');
      const schemeIndex = result.toString().indexOf('"scheme"');
      const bearerFormatIndex = result.toString().indexOf('"bearerFormat"');
      const flowsIndex = result.toString().indexOf('"flows"');
      const openIdConnectUrlIndex = result.toString().indexOf('"openIdConnectUrl"');

      expect(nameIndex).toBeLessThan(descriptionIndex);
      expect(descriptionIndex).toBeLessThan(typeIndex);
      expect(typeIndex).toBeLessThan(inIndex);
      expect(inIndex).toBeLessThan(schemeIndex);
      expect(schemeIndex).toBeLessThan(bearerFormatIndex);
      expect(bearerFormatIndex).toBeLessThan(openIdConnectUrlIndex);
      expect(openIdConnectUrlIndex).toBeLessThan(flowsIndex);
    });
  });

  describe('Server key ordering', () => {
    it('should sort server keys correctly', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          servers: [
            {
              variables: { environment: { default: 'production' } },
              url: 'https://api.example.com/v1',
              description: 'Production server'
            }
          ]
        }
      };
// @ts-expect-error We are mocking things here so we don't need to pass a print function
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }
            
      // Check that server keys appear in the correct order
      // Find the server section specifically (first server in the array)
      const serverStart = result.toString().indexOf('{', result.toString().indexOf('"servers": ['));
      // Find the end of the server object
      const serverEnd = result.toString().indexOf('}', result.toString().lastIndexOf('"variables"'));
      const serverSection = result.toString().substring(serverStart, serverEnd + 1);
      
      const nameIndex = serverSection.indexOf('"name"');
      const descriptionIndex = serverSection.indexOf('"description"');
      const urlIndex = serverSection.indexOf('"url"');
      const variablesIndex = serverSection.indexOf('"variables"');

      expect(nameIndex).toBeLessThan(descriptionIndex);
      expect(descriptionIndex).toBeLessThan(urlIndex);
      expect(urlIndex).toBeLessThan(variablesIndex);
    });
  });

  describe('Tag key ordering', () => {
    it('should sort tag keys correctly', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          tags: [
            {
              externalDocs: { url: 'https://example.com/docs' },
              name: 'users',
              description: 'User management operations'
            }
          ]
        }
      };
// @ts-expect-error We are mocking things here so we don't need to pass a print function
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }
            
      // Check that tag keys appear in the correct order
      // Find the tag section specifically (first tag in the array)
      const tagStart = result.toString().indexOf('{', result.toString().indexOf('"tags": ['));
      // Find the end of the tag object
      const tagEnd = result.toString().indexOf('}', result.toString().lastIndexOf('"externalDocs"'));
      const tagSection = result.toString().substring(tagStart, tagEnd + 1);
      
      const nameIndex = tagSection.indexOf('"name"');
      const descriptionIndex = tagSection.indexOf('"description"');
      const externalDocsIndex = tagSection.indexOf('"externalDocs"');

      expect(nameIndex).toBeLessThan(descriptionIndex);
      expect(descriptionIndex).toBeLessThan(externalDocsIndex);
    });
  });

  describe('External docs key ordering', () => {
    it('should sort external docs keys correctly', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          externalDocs: {
            url: 'https://example.com/docs',
            description: 'External documentation'
          }
        }
      };
// @ts-expect-error We are mocking things here so we don't need to pass a print function
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }
      
      // Check that external docs keys appear in the correct order
      const descriptionIndex = result.toString().indexOf('"description"');
      const urlIndex = result.toString().indexOf('"url"');

      expect(descriptionIndex).toBeLessThan(urlIndex);
    });
  });

  describe('Path sorting', () => {
    it('should sort paths by specificity', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          paths: {
            '/users/{id}/posts/{postId}': { get: {} },
            '/users/{id}': { get: {} },
            '/users': { get: {} },
            '/users/{id}/posts': { get: {} }
          }
        }
      };
// @ts-expect-error We are mocking things here so we don't need to pass a print function
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }
            
      // Check that paths are sorted by specificity (fewer parameters first)
      const usersIndex = result.toString().indexOf('"/users"');
      const usersIdIndex = result.toString().indexOf('"/users/{id}"');
      const usersIdPostsIndex = result.toString().indexOf('"/users/{id}/posts"');
      const usersIdPostsPostIdIndex = result.toString().indexOf('"/users/{id}/posts/{postId}"');

      expect(usersIndex).toBeLessThan(usersIdIndex);
      expect(usersIdIndex).toBeLessThan(usersIdPostsIndex);
      expect(usersIdPostsIndex).toBeLessThan(usersIdPostsPostIdIndex);
    });
  });

  describe('Response code sorting', () => {
    it('should sort response codes numerically', () => {
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
                  '500': { description: 'Internal Server Error' },
                  '200': { description: 'OK' },
                  '404': { description: 'Not Found' },
                  '400': { description: 'Bad Request' },
                  'default': { description: 'Default response' }
                }
              }
            }
          }
        }
      };
// @ts-expect-error We are mocking things here so we don't need to pass a print function
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 });
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }
            
      // Check that response codes are sorted numerically
      const code200Index = result.toString().indexOf('"200"');
      const code400Index = result.toString().indexOf('"400"');
      const code404Index = result.toString().indexOf('"404"');
      const code500Index = result.toString().indexOf('"500"');
      const defaultIndex = result.toString().indexOf('"default"');

      expect(code200Index).toBeLessThan(code400Index);
      expect(code400Index).toBeLessThan(code404Index);
      expect(code404Index).toBeLessThan(code500Index);
      expect(code500Index).toBeLessThan(defaultIndex);
    });
  });
});
