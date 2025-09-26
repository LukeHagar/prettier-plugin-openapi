import { describe, expect, it } from 'bun:test';
import plugin from '../src/index';

describe('Simple Key Ordering Tests', () => {
  it('should sort top-level OpenAPI keys correctly', () => {
    const jsonPrinter = plugin.printers?.['openapi-json-ast'];
    expect(jsonPrinter).toBeDefined();

    const testData = {
      content: {
        paths: { '/test': { get: {} } },
        components: { schemas: {} },
        info: { title: 'Test API', version: '1.0.0' },
        openapi: '3.0.0',
        security: [],
        tags: [],
        externalDocs: { url: 'https://example.com' }
      }
    };

    // @ts-expect-error We are mocking things here
    const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();
    
    if (!result) {
      throw new Error('Result is undefined');
    }

    // Check that keys appear in the correct order
    const openapiIndex = result.toString().indexOf('"openapi"');
    const infoIndex = result.toString().indexOf('"info"');
    const externalDocsIndex = result.toString().indexOf('"externalDocs"');
    const securityIndex = result.toString().indexOf('"security"');
    const tagsIndex = result.toString().indexOf('"tags"');
    const pathsIndex = result.toString().indexOf('"paths"');
    const componentsIndex = result.toString().indexOf('"components"');

    expect(openapiIndex).toBeLessThan(infoIndex);
    expect(infoIndex).toBeLessThan(externalDocsIndex);
    expect(externalDocsIndex).toBeLessThan(securityIndex);
    expect(securityIndex).toBeLessThan(tagsIndex);
    expect(tagsIndex).toBeLessThan(pathsIndex);
    expect(pathsIndex).toBeLessThan(componentsIndex);
  });

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

    // @ts-expect-error We are mocking things here
    const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
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

    // @ts-expect-error We are mocking things here
    const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
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

  it('should handle custom extensions correctly', () => {
    const jsonPrinter = plugin.printers?.['openapi-json-ast'];
    expect(jsonPrinter).toBeDefined();

    const testData = {
      content: {
        'x-custom-field': 'value',
        'openapi': '3.0.0',
        'info': { 'title': 'Test API', 'version': '1.0.0' },
        'paths': {},
        'x-metadata': { 'custom': 'data' }
      }
    };

    // @ts-expect-error We are mocking things here
    const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();

    if (!result) {
      throw new Error('Result is undefined');
    }
    
    // Custom extensions should come after standard keys
    const openapiIndex = result.toString().indexOf('"openapi"');
    const infoIndex = result.toString().indexOf('"info"');
    const pathsIndex = result.toString().indexOf('"paths"');
    const xCustomFieldIndex = result.toString().indexOf('"x-custom-field"');
    const xMetadataIndex = result.toString().indexOf('"x-metadata"');

    expect(openapiIndex).toBeLessThan(infoIndex);
    expect(infoIndex).toBeLessThan(pathsIndex);
    expect(pathsIndex).toBeLessThan(xCustomFieldIndex);
    expect(xCustomFieldIndex).toBeLessThan(xMetadataIndex);
  });
});
