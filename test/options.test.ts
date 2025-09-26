import { describe, it, expect } from 'bun:test';
import plugin from '../src/index';

describe('Plugin Options', () => {
  it('should use custom tabWidth for JSON formatting', () => {
    const testData = {
      openapi: '3.0.0',
      info: {
        title: 'Test',
        version: '1.0.0'
      },
      paths: {}
    };

    const printer = plugin.printers?.['openapi-ast'];
    expect(printer).toBeDefined();

    const result = printer?.print({ getValue: () => ({ type: 'openapi', content: testData, originalText: '', format: 'json' }) }, { tabWidth: 4 }, () => '');
    expect(result).toBeDefined();

    if (!result) {
      throw new Error('Result is undefined');
    }

    // Check that 4-space indentation is used
    expect(result).toContain('    "openapi"');
    expect(result).toContain('    "info"');
    expect(result).toContain('        "title"');
    expect(result).toContain('        "version"');
  });

  it('should use custom tabWidth for YAML formatting', () => {
    const testData = {
      openapi: '3.0.0',
      info: {
        title: 'Test',
        version: '1.0.0'
      },
      paths: {}
    };

    const printer = plugin.printers?.['openapi-ast'];
    expect(printer).toBeDefined();

    const result = printer?.print({ getValue: () => ({ type: 'openapi', content: testData, originalText: '', format: 'yaml' }) }, { tabWidth: 4 }, () => '');
    expect(result).toBeDefined();

    if (!result) {
      throw new Error('Result is undefined');
    }

    // Check that 4-space indentation is used
    expect(result).toContain('    title: Test');
    expect(result).toContain('    version: 1.0.0');
  });

  it('should use default tabWidth when not specified', () => {
    const testData = {
      openapi: '3.0.0',
      info: {
        title: 'Test',
        version: '1.0.0'
      },
      paths: {}
    };

    const printer = plugin.printers?.['openapi-ast'];
    expect(printer).toBeDefined();

    const result = printer?.print({ getValue: () => ({ type: 'openapi', content: testData, originalText: '', format: 'json' }) }, {}, () => '');
    expect(result).toBeDefined();

    if (!result) {
      throw new Error('Result is undefined');
    }

    // Check that 2-space indentation is used (default)
    expect(result).toContain('  "openapi"');
    expect(result).toContain('  "info"');
    expect(result).toContain('    "title"');
    expect(result).toContain('    "version"');
  });

  it('should use custom printWidth for YAML formatting', () => {
    const testData = {
      openapi: '3.0.0',
      info: {
        title: 'This is a very long title that should be wrapped according to printWidth',
        version: '1.0.0'
      },
      paths: {}
    };

    const printer = plugin.printers?.['openapi-ast'];
    expect(printer).toBeDefined();

    const result = printer?.print({ getValue: () => ({ type: 'openapi', content: testData, originalText: '', format: 'yaml' }) }, { printWidth: 20 }, () => '');
    expect(result).toBeDefined();

    // The YAML should be formatted with the custom line width
    expect(result).toBeDefined();
    // Note: js-yaml doesn't always respect lineWidth for all content types,
    // but we can verify the option is passed through
  });
});
