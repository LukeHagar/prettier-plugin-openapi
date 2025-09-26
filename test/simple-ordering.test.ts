import { describe, expect, it } from 'bun:test';
import plugin from '../src/index';

describe('Simple Key Ordering Tests', () => {
  it('should sort top-level OpenAPI keys correctly', () => {
    const printer = plugin.printers?.['openapi-ast'];
    expect(printer).toBeDefined();

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
    const result = printer?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();
    
    if (!result) {
      throw new Error('Result is undefined');
    }

    const resultString = result.toString();

    // Check that keys appear in the correct order
    const openapiIndex = resultString.indexOf('openapi');
    const infoIndex = resultString.indexOf('info');
    const externalDocsIndex = resultString.indexOf('externalDocs');
    const securityIndex = resultString.indexOf('security');
    const tagsIndex = resultString.indexOf('tags');
    const pathsIndex = resultString.indexOf('paths');
    const componentsIndex = resultString.indexOf('components');

    expect(openapiIndex).toBeLessThan(infoIndex);
    expect(infoIndex).toBeLessThan(externalDocsIndex);
    expect(externalDocsIndex).toBeLessThan(securityIndex);
    expect(securityIndex).toBeLessThan(tagsIndex);
    expect(tagsIndex).toBeLessThan(pathsIndex);
    expect(pathsIndex).toBeLessThan(componentsIndex);
  });

  it('should sort operation keys correctly', () => {
    const printer = plugin.printers?.['openapi-ast'];
    expect(printer).toBeDefined();

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
    const result = printer?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();

    if (!result) {
      throw new Error('Result is undefined');
    }

    const resultString = result.toString();
    
    // Check that operation keys appear in the correct order
    const summaryIndex = resultString.indexOf('summary');
    const operationIdIndex = resultString.indexOf('operationId');
    const descriptionIndex = resultString.indexOf('description');
    const tagsIndex = resultString.indexOf('tags');
    const deprecatedIndex = resultString.indexOf('deprecated');
    const securityIndex = resultString.indexOf('security');
    const serversIndex = resultString.indexOf('servers');
    const parametersIndex = resultString.indexOf('parameters');
    const requestBodyIndex = resultString.indexOf('requestBody');
    const responsesIndex = resultString.indexOf('responses');
    const callbacksIndex = resultString.indexOf('callbacks');

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
    const printer = plugin.printers?.['openapi-ast'];
    expect(printer).toBeDefined();

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
    const result = printer?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();

    if (!result) {
      throw new Error('Result is undefined');
    }

    const resultString = result.toString();

    console.log(resultString);
    
    // Check that info keys appear in the correct order
    const titleIndex = resultString.indexOf('title');
    const versionIndex = resultString.indexOf('version');
    const descriptionIndex = resultString.indexOf('description');
    const termsOfServiceIndex = resultString.indexOf('termsOfService');
    const contactIndex = resultString.indexOf('contact');
    const licenseIndex = resultString.indexOf('license');

    expect(titleIndex).toBeLessThan(versionIndex);
    expect(versionIndex).toBeLessThan(descriptionIndex);
    expect(descriptionIndex).toBeLessThan(termsOfServiceIndex);
    expect(termsOfServiceIndex).toBeLessThan(contactIndex);
    expect(contactIndex).toBeLessThan(licenseIndex);
  });

  it('should handle custom extensions correctly', () => {
    const printer = plugin.printers?.['openapi-ast'];
    expect(printer).toBeDefined();

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
    const result = printer?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();

    if (!result) {
      throw new Error('Result is undefined');
    }
    
    // Custom extensions should come after standard keys
    const openapiIndex = result.toString().indexOf('openapi');
    const infoIndex = result.toString().indexOf('info');
    const pathsIndex = result.toString().indexOf('paths');
    const xCustomFieldIndex = result.toString().indexOf('x-custom-field');
    const xMetadataIndex = result.toString().indexOf('x-metadata');

    expect(openapiIndex).toBeLessThan(infoIndex);
    expect(infoIndex).toBeLessThan(pathsIndex);
    expect(pathsIndex).toBeLessThan(xCustomFieldIndex);
    expect(xCustomFieldIndex).toBeLessThan(xMetadataIndex);
  });
});
