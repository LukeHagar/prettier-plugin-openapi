import { describe, it, expect } from 'bun:test';
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

    const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();
    
    // Check that keys appear in the correct order
    const openapiIndex = result.indexOf('"openapi"');
    const infoIndex = result.indexOf('"info"');
    const pathsIndex = result.indexOf('"paths"');
    const componentsIndex = result.indexOf('"components"');
    const securityIndex = result.indexOf('"security"');
    const tagsIndex = result.indexOf('"tags"');
    const externalDocsIndex = result.indexOf('"externalDocs"');

    expect(openapiIndex).toBeLessThan(infoIndex);
    expect(infoIndex).toBeLessThan(pathsIndex);
    expect(pathsIndex).toBeLessThan(componentsIndex);
    expect(componentsIndex).toBeLessThan(securityIndex);
    expect(securityIndex).toBeLessThan(tagsIndex);
    expect(tagsIndex).toBeLessThan(externalDocsIndex);
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

    const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();
    
    // Check that operation keys appear in the correct order
    const tagsIndex = result.indexOf('"tags"');
    const summaryIndex = result.indexOf('"summary"');
    const descriptionIndex = result.indexOf('"description"');
    const operationIdIndex = result.indexOf('"operationId"');
    const parametersIndex = result.indexOf('"parameters"');
    const requestBodyIndex = result.indexOf('"requestBody"');
    const responsesIndex = result.indexOf('"responses"');
    const callbacksIndex = result.indexOf('"callbacks"');
    const deprecatedIndex = result.indexOf('"deprecated"');
    const securityIndex = result.indexOf('"security"');
    const serversIndex = result.indexOf('"servers"');

    expect(tagsIndex).toBeLessThan(summaryIndex);
    expect(summaryIndex).toBeLessThan(descriptionIndex);
    expect(descriptionIndex).toBeLessThan(operationIdIndex);
    expect(operationIdIndex).toBeLessThan(parametersIndex);
    expect(parametersIndex).toBeLessThan(requestBodyIndex);
    expect(requestBodyIndex).toBeLessThan(responsesIndex);
    expect(responsesIndex).toBeLessThan(callbacksIndex);
    expect(callbacksIndex).toBeLessThan(deprecatedIndex);
    expect(deprecatedIndex).toBeLessThan(securityIndex);
    expect(securityIndex).toBeLessThan(serversIndex);
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

    const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();
    
    // Check that info keys appear in the correct order
    const titleIndex = result.indexOf('"title"');
    const descriptionIndex = result.indexOf('"description"');
    const versionIndex = result.indexOf('"version"');
    const termsOfServiceIndex = result.indexOf('"termsOfService"');
    const contactIndex = result.indexOf('"contact"');
    const licenseIndex = result.indexOf('"license"');

    expect(titleIndex).toBeLessThan(descriptionIndex);
    expect(descriptionIndex).toBeLessThan(versionIndex);
    expect(versionIndex).toBeLessThan(termsOfServiceIndex);
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

    const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();
    
    // Custom extensions should come after standard keys
    const openapiIndex = result.indexOf('"openapi"');
    const infoIndex = result.indexOf('"info"');
    const pathsIndex = result.indexOf('"paths"');
    const xCustomFieldIndex = result.indexOf('"x-custom-field"');
    const xMetadataIndex = result.indexOf('"x-metadata"');

    expect(openapiIndex).toBeLessThan(infoIndex);
    expect(infoIndex).toBeLessThan(pathsIndex);
    expect(pathsIndex).toBeLessThan(xCustomFieldIndex);
    expect(xCustomFieldIndex).toBeLessThan(xMetadataIndex);
  });
});
