import plugin from '../src/index';
import * as fs from 'fs';
import * as path from 'path';

// Demo script to show how the plugin works
async function demo() {
  console.log('Prettier OpenAPI Plugin Demo');
  console.log('============================');

  // Test JSON parsing
  const testJson = {
    paths: { '/test': { get: {} } },
    info: { title: 'Test API', version: '1.0.0' },
    openapi: '3.0.0',
    components: { schemas: {} }
  };

  console.log('\n1. Testing JSON Parser:');
  try {
    const jsonParser = plugin.parsers?.['openapi-json-parser'];
    if (jsonParser) {
      const jsonString = JSON.stringify(testJson);
      const parsed = jsonParser.parse(jsonString, {});
      console.log('✓ JSON parsing successful');
      console.log('Parsed content keys:', Object.keys(parsed.content));
    }
  } catch (error) {
    console.log('✗ JSON parsing failed:', error);
  }

  // Test YAML parsing
  const testYaml = `openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get: {}`;

  console.log('\n2. Testing YAML Parser:');
  try {
    const yamlParser = plugin.parsers?.['openapi-yaml-parser'];
    if (yamlParser) {
      const parsed = yamlParser.parse(testYaml, {});
      console.log('✓ YAML parsing successful');
      console.log('Parsed content keys:', Object.keys(parsed.content));
    }
  } catch (error) {
    console.log('✗ YAML parsing failed:', error);
  }

  // Test JSON formatting
  console.log('\n3. Testing JSON Formatting:');
  try {
    const jsonPrinter = plugin.printers?.['openapi-json-ast'];
    if (jsonPrinter) {
      const testData = { content: testJson };
      const formatted = jsonPrinter.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
      console.log('✓ JSON formatting successful');
      console.log('Formatted output (first 200 chars):');
      console.log(formatted.substring(0, 200) + '...');
    }
  } catch (error) {
    console.log('✗ JSON formatting failed:', error);
  }

  // Test YAML formatting
  console.log('\n4. Testing YAML Formatting:');
  try {
    const yamlPrinter = plugin.printers?.['openapi-yaml-ast'];
    if (yamlPrinter) {
      const testData = { content: testJson };
      const formatted = yamlPrinter.print({ getValue: () => testData }, { tabWidth: 2 }, () => '');
      console.log('✓ YAML formatting successful');
      console.log('Formatted output (first 200 chars):');
      console.log(formatted.substring(0, 200) + '...');
    }
  } catch (error) {
    console.log('✗ YAML formatting failed:', error);
  }

  console.log('\n5. Plugin Information:');
  console.log('Supported languages:', plugin.languages?.map(l => l.name));
  console.log('Available parsers:', Object.keys(plugin.parsers || {}));
  console.log('Available printers:', Object.keys(plugin.printers || {}));
}

demo().catch(console.error);
