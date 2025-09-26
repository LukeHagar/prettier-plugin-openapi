import { describe, expect, it } from 'bun:test';
import plugin from '../src/index';

describe('Custom Extensions Support', () => {
  it('should handle custom extensions in top-level keys', () => {
    const jsonParser = plugin.parsers?.['openapi-json-parser'];
    expect(jsonParser).toBeDefined();

    const testJson = {
      'x-custom-field': 'value',
      'openapi': '3.0.0',
      'info': { 'title': 'Test API', 'version': '1.0.0' },
      'paths': {},
      'x-metadata': { 'custom': 'data' }
    };

    // @ts-expect-error We are mocking things here
    const result = jsonParser?.parse(JSON.stringify(testJson), {});
    expect(result).toBeDefined();
    expect(result?.content).toBeDefined();
  });

  it('should handle custom extensions in info section', () => {
    const jsonParser = plugin.parsers?.['openapi-json-parser'];
    expect(jsonParser).toBeDefined();

    const testJson = {
      'openapi': '3.0.0',
      'info': {
        'title': 'Test API',
        'x-api-id': 'api-123',
        'version': '1.0.0',
        'x-version-info': 'v1.0.0-beta',
        'description': 'API Description'
      }
    };

    // @ts-expect-error We are mocking things here
    const result = jsonParser?.parse(JSON.stringify(testJson), {});
    expect(result).toBeDefined();
    expect(result?.content.info).toBeDefined();
    expect(result?.content.info['x-api-id']).toBe('api-123');
  });

  it('should handle custom extensions in operation objects', () => {
    const jsonParser = plugin.parsers?.['openapi-json-parser'];
    expect(jsonParser).toBeDefined();

    const testJson = {
      'openapi': '3.0.0',
      'info': { 'title': 'Test API', 'version': '1.0.0' },
      'paths': {
        '/test': {
          'get': {
            'summary': 'Test endpoint',
            'x-rate-limit': 100,
            'responses': { '200': { 'description': 'OK' } },
            'x-custom-auth': 'bearer'
          }
        }
      }
    };

    // @ts-expect-error We are mocking things here
    const result = jsonParser?.parse(JSON.stringify(testJson), {});
    expect(result).toBeDefined();
    expect(result?.content.paths['/test'].get['x-rate-limit']).toBe(100);
  });

  it('should handle custom extensions in schema objects', () => {
    const jsonParser = plugin.parsers?.['openapi-json-parser'];
    expect(jsonParser).toBeDefined();

    const testJson = {
      'openapi': '3.0.0',
      'info': { 'title': 'Test API', 'version': '1.0.0' },
      'components': {
        'schemas': {
          'User': {
            'type': 'object',
            'x-custom-type': 'entity',
            'properties': {
              'id': { 'type': 'integer' }
            },
            'x-validation-rules': 'required'
          }
        }
      }
    };

    // @ts-expect-error We are mocking things here
    const result = jsonParser?.parse(JSON.stringify(testJson), {});
    expect(result).toBeDefined();
    expect(result?.content.components.schemas.User['x-custom-type']).toBe('entity');
  });

  it('should format JSON with custom extensions', () => {
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

// @ts-expect-error We are mocking things here so we don't need to pass a print function
    const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();
    expect(result).toContain('"x-custom-field"');
    expect(result).toContain('"openapi"');
  });

  it('should format YAML with custom extensions', () => {
    const yamlPrinter = plugin.printers?.['openapi-yaml-ast'];
    expect(yamlPrinter).toBeDefined();

    const testData = {
      content: {
        'x-custom-field': 'value',
        'openapi': '3.0.0',
        'info': { 'title': 'Test API', 'version': '1.0.0' },
        'paths': {},
        'x-metadata': { 'custom': 'data' }
      }
    };

    // @ts-expect-error We are mocking things here so we don't need to pass a print function
    const result = yamlPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();
    expect(result).toContain('x-custom-field:');
    expect(result).toContain('openapi:');
  });

  it('should handle unknown keys alphabetically at the end', () => {
    const jsonParser = plugin.parsers?.['openapi-json-parser'];
    expect(jsonParser).toBeDefined();

    const testJson = {
      'openapi': '3.0.0',
      'info': { 'title': 'Test API', 'version': '1.0.0' },
      'unknown-field': 'value',
      'paths': {},
      'another-unknown': 'value'
    };

    // @ts-expect-error We are mocking things here
    const result = jsonParser?.parse(JSON.stringify(testJson), {});
    expect(result).toBeDefined();
    expect(result?.content).toBeDefined();
  });

  describe('Custom extension positioning', () => {
    it('should position custom extensions correctly in top-level', () => {
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

    it('should position custom extensions correctly in info section', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          'openapi': '3.0.0',
          'info': {
            'title': 'Test API',
            'x-api-id': 'api-123',
            'description': 'API Description',
            'version': '1.0.0',
            'x-version-info': 'v1.0.0-beta'
          }
        }
      };

    // @ts-expect-error We are mocking things here
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }
      
      // Custom extensions should come after standard keys
      const titleIndex = result.toString().indexOf('"title"');
      const descriptionIndex = result.toString().indexOf('"description"');
      const versionIndex = result.toString().indexOf('"version"');
      const xApiIdIndex = result.toString().indexOf('"x-api-id"');
      const xVersionInfoIndex = result.toString().indexOf('"x-version-info"');

      expect(titleIndex).toBeLessThan(versionIndex);
      expect(versionIndex).toBeLessThan(descriptionIndex);
      expect(descriptionIndex).toBeLessThan(xApiIdIndex);
      expect(xApiIdIndex).toBeLessThan(xVersionInfoIndex);
    });

    it('should position custom extensions correctly in operation objects', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          'openapi': '3.0.0',
          'info': { 'title': 'Test API', 'version': '1.0.0' },
          'paths': {
            '/test': {
              'get': {
                'summary': 'Test endpoint',
                'x-rate-limit': 100,
                'responses': { '200': { 'description': 'OK' } },
                'x-custom-auth': 'bearer'
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
      
      // Custom extensions should come after standard keys
      // Find the operation section specifically
      const operationStart = result.toString().indexOf('"get": {');
      // Find the end of the operation object
      const operationEnd = result.toString().indexOf('}', result.toString().lastIndexOf('"x-custom-auth"'));
      const operationSection = result.toString().substring(operationStart, operationEnd + 1);
      
      const summaryIndex = operationSection.indexOf('"summary"');
      const responsesIndex = operationSection.indexOf('"responses"');
      const xRateLimitIndex = operationSection.indexOf('"x-rate-limit"');
      const xCustomAuthIndex = operationSection.indexOf('"x-custom-auth"');

      expect(summaryIndex).toBeLessThan(responsesIndex);
      expect(responsesIndex).toBeLessThan(xCustomAuthIndex);
      expect(xCustomAuthIndex).toBeLessThan(xRateLimitIndex);
    });

    it('should position custom extensions correctly in schema objects', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          'openapi': '3.0.0',
          'info': { 'title': 'Test API', 'version': '1.0.0' },
          'components': {
            'schemas': {
              'User': {
                'type': 'object',
                'x-custom-type': 'entity',
                'properties': { 'id': { 'type': 'integer' } },
                'x-validation-rules': 'required'
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

      // Custom extensions should come after standard keys
      const typeIndex = result.toString().indexOf('"type"');
      const propertiesIndex = result.toString().indexOf('"properties"');
      const xCustomTypeIndex = result.toString().indexOf('"x-custom-type"');
      const xValidationRulesIndex = result.toString().indexOf('"x-validation-rules"');

      expect(typeIndex).toBeLessThan(propertiesIndex);
      expect(propertiesIndex).toBeLessThan(xCustomTypeIndex);
      expect(xCustomTypeIndex).toBeLessThan(xValidationRulesIndex);
    });
  });

  describe('Unknown key handling', () => {
    it('should sort unknown keys alphabetically at the end', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          'openapi': '3.0.0',
          'info': { 'title': 'Test API', 'version': '1.0.0' },
          'unknown-field': 'value',
          'paths': {},
          'another-unknown': 'value'
        }
      };

    // @ts-expect-error We are mocking things here
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }

      // Unknown keys should come after standard keys and be sorted alphabetically
      const openapiIndex = result.toString().indexOf('"openapi"');
      const infoIndex = result.toString().indexOf('"info"');
      const pathsIndex = result.toString().indexOf('"paths"');
      const anotherUnknownIndex = result.toString().indexOf('"another-unknown"');
      const unknownFieldIndex = result.toString().indexOf('"unknown-field"');

      expect(openapiIndex).toBeLessThan(infoIndex);
      expect(infoIndex).toBeLessThan(pathsIndex);
      // Unknown keys should come after standard keys
      expect(pathsIndex).toBeLessThan(anotherUnknownIndex);
      expect(pathsIndex).toBeLessThan(unknownFieldIndex);
      // Unknown keys should be sorted alphabetically
      expect(anotherUnknownIndex).toBeLessThan(unknownFieldIndex);
    });

    it('should handle mixed custom extensions and unknown keys', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          'openapi': '3.0.0',
          'info': { 'title': 'Test API', 'version': '1.0.0' },
          'x-custom-field': 'value',
          'unknown-field': 'value',
          'paths': {},
          'x-metadata': { 'custom': 'data' },
          'another-unknown': 'value'
        }
      };

    // @ts-expect-error We are mocking things here
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }
          
      // Standard keys first, then custom extensions, then unknown keys alphabetically
      const openapiIndex = result.toString().indexOf('"openapi"');
      const infoIndex = result.toString().indexOf('"info"');
      const pathsIndex = result.toString().indexOf('"paths"');
      const xCustomFieldIndex = result.toString().indexOf('"x-custom-field"');
      const xMetadataIndex = result.toString().indexOf('"x-metadata"');
      const anotherUnknownIndex = result.toString().indexOf('"another-unknown"');
      const unknownFieldIndex = result.toString().indexOf('"unknown-field"');

      expect(openapiIndex).toBeLessThan(infoIndex);
      expect(infoIndex).toBeLessThan(pathsIndex);
      // Standard keys should come first
      expect(pathsIndex).toBeLessThan(xCustomFieldIndex);
      expect(pathsIndex).toBeLessThan(xMetadataIndex);
      expect(pathsIndex).toBeLessThan(anotherUnknownIndex);
      expect(pathsIndex).toBeLessThan(unknownFieldIndex);
      // Unknown keys should be sorted alphabetically
      expect(anotherUnknownIndex).toBeLessThan(unknownFieldIndex);
    });
  });
});
