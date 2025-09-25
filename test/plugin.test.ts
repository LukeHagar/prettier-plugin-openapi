import { describe, it, expect } from 'bun:test';
import plugin from '../src/index';
import * as fs from 'fs';
import * as path from 'path';

describe('Prettier OpenAPI Plugin', () => {
  it('should have correct plugin structure', () => {
    expect(plugin).toBeDefined();
    expect(plugin.languages).toBeDefined();
    expect(plugin.parsers).toBeDefined();
    expect(plugin.printers).toBeDefined();
  });

  it('should support OpenAPI JSON files', () => {
    const jsonLanguage = plugin.languages?.find(lang => lang.name === 'openapi-json');
    expect(jsonLanguage).toBeDefined();
    expect(jsonLanguage?.extensions).toContain('.openapi.json');
    expect(jsonLanguage?.extensions).toContain('.swagger.json');
  });

  it('should support OpenAPI YAML files', () => {
    const yamlLanguage = plugin.languages?.find(lang => lang.name === 'openapi-yaml');
    expect(yamlLanguage).toBeDefined();
    expect(yamlLanguage?.extensions).toContain('.openapi.yaml');
    expect(yamlLanguage?.extensions).toContain('.openapi.yml');
    expect(yamlLanguage?.extensions).toContain('.swagger.yaml');
    expect(yamlLanguage?.extensions).toContain('.swagger.yml');
  });

  it('should parse JSON correctly', () => {
    const jsonParser = plugin.parsers?.['openapi-json-parser'];
    expect(jsonParser).toBeDefined();

    const testJson = '{"openapi": "3.0.0", "info": {"title": "Test API", "version": "1.0.0"}}';

    // @ts-ignore We are mocking things here
    const result = jsonParser?.parse(testJson, {});
    
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi-json');
    expect(result?.content).toBeDefined();
    expect(result?.content.openapi).toBe('3.0.0');
  });

  it('should parse YAML correctly', () => {
    const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
    expect(yamlParser).toBeDefined();

    const testYaml = 'openapi: 3.0.0\ninfo:\n  title: Test API\n  version: 1.0.0';
    
    // @ts-ignore We are mocking things here
    const result = yamlParser?.parse(testYaml, {});
    
    expect(result).toBeDefined();
    expect(result?.type).toBe('openapi-yaml');
    expect(result?.content).toBeDefined();
    expect(result?.content.openapi).toBe('3.0.0');
  });

  it('should format JSON with proper sorting', () => {
    const jsonPrinter = plugin.printers?.['openapi-json-ast'];
    expect(jsonPrinter).toBeDefined();

    const testData = {
      content: {
        info: { title: 'Test', version: '1.0.0' },
        openapi: '3.0.0',
        paths: { '/test': { get: {} } }
      }
    };

    // @ts-ignore We are mocking things here
    const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();
    expect(result).toContain('"openapi"');
    expect(result).toContain('"info"');
    expect(result).toContain('"paths"');
  });

  it('should format YAML with proper sorting', () => {
    const yamlPrinter = plugin.printers?.['openapi-yaml-ast'];
    expect(yamlPrinter).toBeDefined();

    const testData = {
      content: {
        info: { title: 'Test', version: '1.0.0' },
        openapi: '3.0.0',
        paths: { '/test': { get: {} } }
      }
    };

    // @ts-ignore We are mocking things here
    const result = yamlPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
    expect(result).toBeDefined();
    expect(result).toContain('openapi:');
    expect(result).toContain('info:');
    expect(result).toContain('paths:');
  });
});

describe('Key Ordering Tests', () => {
  describe('Top-level key ordering', () => {
    it('should sort OpenAPI 3.0+ keys correctly', () => {
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

    // @ts-ignore We are mocking things here
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }

      // Check that keys appear in the correct order
      const openapiIndex = result.toString().indexOf('"openapi"');
      const infoIndex = result.toString().indexOf('"info"');
      const pathsIndex = result.toString().indexOf('"paths"');
      const componentsIndex = result.toString().indexOf('"components"');
      const securityIndex = result.toString().indexOf('"security"');
      const tagsIndex = result.toString().indexOf('"tags"');
      const externalDocsIndex = result.toString().indexOf('"externalDocs"');

      expect(openapiIndex).toBeLessThan(infoIndex);
      expect(infoIndex).toBeLessThan(pathsIndex);
      expect(pathsIndex).toBeLessThan(componentsIndex);
      expect(componentsIndex).toBeLessThan(securityIndex);
      expect(securityIndex).toBeLessThan(tagsIndex);
      expect(tagsIndex).toBeLessThan(externalDocsIndex);
    });

    it('should sort Swagger 2.0 keys correctly', () => {
      const jsonPrinter = plugin.printers?.['openapi-json-ast'];
      expect(jsonPrinter).toBeDefined();

      const testData = {
        content: {
          paths: { '/test': { get: {} } },
          definitions: { User: { type: 'object' } },
          info: { title: 'Test API', version: '1.0.0' },
          swagger: '2.0',
          host: 'api.example.com',
          basePath: '/v1',
          schemes: ['https'],
          consumes: ['application/json'],
          produces: ['application/json'],
          parameters: {},
          responses: {},
          securityDefinitions: {},
          security: [],
          tags: [],
          externalDocs: { url: 'https://example.com' }
        }
      };

    // @ts-ignore We are mocking things here
      const result = jsonPrinter?.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
      expect(result).toBeDefined();

      if (!result) {
        throw new Error('Result is undefined');
      }

      // Check that keys appear in the correct order
      const swaggerIndex = result.toString().indexOf('"swagger"');
      const infoIndex = result.toString().indexOf('"info"');
      const hostIndex = result.toString().indexOf('"host"');
      const basePathIndex = result.toString().indexOf('"basePath"');
      const schemesIndex = result.toString().indexOf('"schemes"');
      const consumesIndex = result.toString().indexOf('"consumes"');
      const producesIndex = result.toString().indexOf('"produces"');
      const pathsIndex = result.toString().indexOf('"paths"');
      const definitionsIndex = result.toString().indexOf('"definitions"');
      const parametersIndex = result.toString().indexOf('"parameters"');
      const responsesIndex = result.toString().indexOf('"responses"');
      const securityDefinitionsIndex = result.toString().indexOf('"securityDefinitions"');
      const securityIndex = result.toString().indexOf('"security"');
      const tagsIndex = result.toString().indexOf('"tags"');
      const externalDocsIndex = result.toString().indexOf('"externalDocs"');

      expect(swaggerIndex).toBeLessThan(infoIndex);
      expect(infoIndex).toBeLessThan(hostIndex);
      expect(hostIndex).toBeLessThan(basePathIndex);
      expect(basePathIndex).toBeLessThan(schemesIndex);
      expect(schemesIndex).toBeLessThan(consumesIndex);
      expect(consumesIndex).toBeLessThan(producesIndex);
      expect(producesIndex).toBeLessThan(pathsIndex);
      expect(pathsIndex).toBeLessThan(definitionsIndex);
      expect(definitionsIndex).toBeLessThan(parametersIndex);
      expect(parametersIndex).toBeLessThan(responsesIndex);
      expect(responsesIndex).toBeLessThan(securityDefinitionsIndex);
      expect(securityDefinitionsIndex).toBeLessThan(securityIndex);
      expect(securityIndex).toBeLessThan(tagsIndex);
      expect(tagsIndex).toBeLessThan(externalDocsIndex);
    });
  });
});
