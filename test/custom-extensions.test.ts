import { describe, expect, it } from 'bun:test';
import {parsers, printers} from '../src/index';

describe('Custom Extensions Support', () => {
  it('should handle custom extensions in top-level keys', () => {
    const parser = parsers?.['openapi-parser'];
    expect(parser).toBeDefined();

    const testJson = {
      'x-custom-field': 'value',
      'openapi': '3.0.0',
      'info': { 'title': 'Test API', 'version': '1.0.0' },
      'paths': {},
      'x-metadata': { 'custom': 'data' }
    };

    // @ts-expect-error We are mocking things here
    const result = parser?.parse(JSON.stringify(testJson), { filepath: 'test.json' });
    expect(result).toBeDefined();
    expect(result?.content).toBeDefined();
  });

  it('should handle custom extensions in info section', () => {
    const parser = parsers?.['openapi-parser'];
    expect(parser).toBeDefined();

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
    const result = parser?.parse(JSON.stringify(testJson), { filepath: 'test.json' });
    expect(result).toBeDefined();
    expect(result?.content.info).toBeDefined();
    expect(result?.content.info['x-api-id']).toBe('api-123');
  });

  it('should handle custom extensions in operation objects', () => {
    const parser = parsers?.['openapi-parser'];
    expect(parser).toBeDefined();

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
    const result = parser?.parse(JSON.stringify(testJson), { filepath: 'test.json' });
    expect(result).toBeDefined();
    expect(result?.content.paths['/test'].get['x-rate-limit']).toBe(100);
  });

  it('should handle custom extensions in schema objects', () => {
    const parser = parsers?.['openapi-parser'];
    expect(parser).toBeDefined();

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
    const result = parser?.parse(JSON.stringify(testJson), { filepath: 'test.json' });
    expect(result).toBeDefined();
    expect(result?.content.components.schemas.User['x-custom-type']).toBe('entity');
  });

  it('should format JSON with custom extensions', () => {
    const printer = printers?.['openapi-ast'];
    expect(printer).toBeDefined();

    const testData = {
      isOpenAPI: true,
      format: 'json',
      content: {
        'x-custom-field': 'value',
        'openapi': '3.0.0',
        'info': { 'title': 'Test API', 'version': '1.0.0' },
        'paths': {},
        'x-metadata': { 'custom': 'data' }
      }
    };

// @ts-expect-error We are mocking things here so we don't need to pass a print function
    const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();
    expect(result).toContain('x-custom-field');
    expect(result).toContain('openapi');
  });

  it('should format YAML with custom extensions', () => {
    const printer = printers?.['openapi-ast'];
    expect(printer).toBeDefined();

    const testData = {
      isOpenAPI: true,
      format: 'yaml',
      content: {
        'x-custom-field': 'value',
        'openapi': '3.0.0',
        'info': { 'title': 'Test API', 'version': '1.0.0' },
        'paths': {},
        'x-metadata': { 'custom': 'data' }
      }
    };

    // @ts-expect-error We are mocking things here so we don't need to pass a print function
    const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();
    expect(result).toContain('x-custom-field:');
    expect(result).toContain('openapi:');
  });

  it('should handle unknown keys alphabetically at the end', () => {
    const parser = parsers?.['openapi-parser'];
    expect(parser).toBeDefined();

    const testJson = {
      'openapi': '3.0.0',
      'info': { 'title': 'Test API', 'version': '1.0.0' },
      'unknown-field': 'value',
      'paths': {},
      'another-unknown': 'value'
    };

    // @ts-expect-error We are mocking things here
    const result = parser?.parse(JSON.stringify(testJson), { filepath: 'test.json' });
    expect(result).toBeDefined();
    expect(result?.content).toBeDefined();
  });

  describe('Custom extension positioning', () => {
    it('should position custom extensions correctly in top-level', () => {
      const printer = printers?.['openapi-ast'];
      expect(printer).toBeDefined();

      const testData = {
        isOpenAPI: true,
        format: 'json',
        content: {
          'x-custom-field': 'value',
          'openapi': '3.0.0',
          'info': { 'title': 'Test API', 'version': '1.0.0' },
          'paths': {},
          'x-metadata': { 'custom': 'data' }
        }
      };

    // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }

      const resultString = result.toString();
      
      // Custom extensions should come after standard keys
      const openapiIndex = resultString.indexOf('openapi');
      const infoIndex = resultString.indexOf('info');
      const pathsIndex = resultString.indexOf('paths');
      const xCustomFieldIndex = resultString.indexOf('x-custom-field');
      const xMetadataIndex = resultString.indexOf('x-metadata');

      expect(openapiIndex).toBeLessThan(infoIndex);
      expect(infoIndex).toBeLessThan(pathsIndex);
      expect(pathsIndex).toBeLessThan(xCustomFieldIndex);
      expect(xCustomFieldIndex).toBeLessThan(xMetadataIndex);
    });

    it('should position custom extensions correctly in info section', () => {
      const printer = printers?.['openapi-ast'];
      expect(printer).toBeDefined();

      const testData = {
        isOpenAPI: true,
        format: 'yaml',
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
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }

      const resultString = result.toString();

      // Custom extensions should come after standard keys
      const titleIndex = resultString.indexOf('title');
      const descriptionIndex = resultString.indexOf('description');
      const versionIndex = resultString.indexOf('version');
      const xApiIdIndex = resultString.indexOf('x-api-id');
      const xVersionInfoIndex = resultString.indexOf('x-version-info');

      expect(titleIndex).toBeLessThan(versionIndex);
      expect(versionIndex).toBeLessThan(descriptionIndex);
      expect(descriptionIndex).toBeLessThan(xApiIdIndex);
      expect(xApiIdIndex).toBeLessThan(xVersionInfoIndex);
    });

    it('should position custom extensions correctly in operation objects', () => {
      const printer = printers?.['openapi-ast'];
      expect(printer).toBeDefined();

      const testData = {
        isOpenAPI: true,
        format: 'yaml',
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
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }

      const resultString = result.toString();
      
      const summaryIndex = resultString.indexOf('summary');
      const responsesIndex = resultString.indexOf('responses');
      const xRateLimitIndex = resultString.indexOf('x-rate-limit');
      const xCustomAuthIndex = resultString.indexOf('x-custom-auth');

      expect(summaryIndex).toBeLessThan(responsesIndex);
      expect(responsesIndex).toBeLessThan(xCustomAuthIndex);
      expect(xCustomAuthIndex).toBeLessThan(xRateLimitIndex);
    });

    it('should position custom extensions correctly in schema objects', () => {
      const printer = printers?.['openapi-ast'];
      expect(printer).toBeDefined();

      const testData = {
        isOpenAPI: true,
        format: 'yaml',
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
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }

      const resultString = result.toString();

      // Custom extensions should come after standard keys
      const typeIndex = resultString.indexOf('type');
      const propertiesIndex = resultString.indexOf('properties');
      const xCustomTypeIndex = resultString.indexOf('x-custom-type');
      const xValidationRulesIndex = resultString.indexOf('x-validation-rules');

      expect(typeIndex).toBeLessThan(propertiesIndex);
      expect(propertiesIndex).toBeLessThan(xCustomTypeIndex);
      expect(xCustomTypeIndex).toBeLessThan(xValidationRulesIndex);
    });
  });

  describe('Unknown key handling', () => {
    it('should sort unknown keys alphabetically at the end', () => {
      const printer = printers?.['openapi-ast'];
      expect(printer).toBeDefined();

      const testData = {
        isOpenAPI: true,
        format: 'json',
        content: {
          'openapi': '3.0.0',
          'info': { 'title': 'Test API', 'version': '1.0.0' },
          'unknown-field': 'value',
          'paths': {},
          'another-unknown': 'value'
        }
      };

    // @ts-expect-error We are mocking things here
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }

      const resultString = result.toString();

      // Unknown keys should come after standard keys and be sorted alphabetically
      const openapiIndex = resultString.indexOf('openapi');
      const infoIndex = resultString.indexOf('info');
      const pathsIndex = resultString.indexOf('paths');
      const anotherUnknownIndex = resultString.indexOf('another-unknown');
      const unknownFieldIndex = resultString.indexOf('unknown-field');

      expect(openapiIndex).toBeLessThan(infoIndex);
      expect(infoIndex).toBeLessThan(pathsIndex);
      // Unknown keys should come after standard keys
      expect(pathsIndex).toBeLessThan(anotherUnknownIndex);
      expect(pathsIndex).toBeLessThan(unknownFieldIndex);
      // Unknown keys should be sorted alphabetically
      expect(anotherUnknownIndex).toBeLessThan(unknownFieldIndex);
    });

    it('should handle mixed custom extensions and unknown keys', () => {
      const printer = printers?.['openapi-ast'];
      expect(printer).toBeDefined();

      const testData = {
        isOpenAPI: true,
        format: 'json',
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
      const result = printer?.print({ getNode: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }

      const resultString = result.toString();
          
      // Standard keys first, then custom extensions, then unknown keys alphabetically
      const openapiIndex = resultString.indexOf('openapi');
      const infoIndex = resultString.indexOf('info');
      const pathsIndex = resultString.indexOf('paths');
      const xCustomFieldIndex = resultString.indexOf('x-custom-field');
      const xMetadataIndex = resultString.indexOf('x-metadata');
      const anotherUnknownIndex = resultString.indexOf('another-unknown');
      const unknownFieldIndex = resultString.indexOf('unknown-field');

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
