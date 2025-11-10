import { describe, expect, it } from 'bun:test';
import {
  createContextExtensions,
  isValidExtensionKey,
  createPositionHelpers,
} from '../src/extensions/index.js';

describe('Extension API Tests', () => {
  describe('isValidExtensionKey', () => {
    it('should return true for valid extension keys starting with x-', () => {
      expect(isValidExtensionKey('x-test')).toBeTrue();
      expect(isValidExtensionKey('x-custom-field')).toBeTrue();
      expect(isValidExtensionKey('x-speakeasy-sdk-name')).toBeTrue();
    });

    it('should return false for keys not starting with x-', () => {
      expect(isValidExtensionKey('test')).toBeFalse();
      expect(isValidExtensionKey('custom-field')).toBeFalse();
      expect(isValidExtensionKey('description')).toBeFalse();
    });

    it('should handle edge cases', () => {
      expect(isValidExtensionKey('')).toBeFalse();
      expect(isValidExtensionKey('x')).toBeFalse();
      expect(isValidExtensionKey('x-')).toBeTrue();
    });
  });

  describe('createContextExtensions', () => {
    it('should create context extensions for info context', () => {
      const extensions = createContextExtensions('info', (before, after) => ({
        'x-custom-before-title': before('title'),
        'x-custom-after-title': after('title'),
      }));

      expect(extensions).toBeDefined();
      expect(extensions.info).toBeDefined();
      expect(typeof extensions.info).toBe('function');
    });

    it('should create context extensions for operation context', () => {
      const extensions = createContextExtensions('operation', (before, after) => ({
        'x-custom-before-summary': before('summary'),
        'x-custom-after-summary': after('summary'),
      }));

      expect(extensions).toBeDefined();
      expect(extensions.operation).toBeDefined();
    });

    it('should create context extensions for schema context', () => {
      const extensions = createContextExtensions('schema', (before, after) => ({
        'x-custom-before-type': before('type'),
        'x-custom-after-type': after('type'),
      }));

      expect(extensions).toBeDefined();
      expect(extensions.schema).toBeDefined();
    });
  });

  describe('createPositionHelpers', () => {
    it('should create position helpers for info context', () => {
      const helpers = createPositionHelpers('info');

      expect(helpers).toBeDefined();
      expect(helpers.before).toBeDefined();
      expect(helpers.after).toBeDefined();
      expect(helpers.getAvailableKeys).toBeDefined();
      expect(helpers.isValidKey).toBeDefined();

      expect(typeof helpers.before).toBe('function');
      expect(typeof helpers.after).toBe('function');
      expect(typeof helpers.getAvailableKeys).toBe('function');
      expect(typeof helpers.isValidKey).toBe('function');
    });

    it('should return available keys for info context', () => {
      const helpers = createPositionHelpers('info');
      const keys = helpers.getAvailableKeys();

      expect(Array.isArray(keys)).toBeTrue();
      expect(keys.length).toBeGreaterThan(0);
      expect(keys).toContain('title');
      expect(keys).toContain('version');
    });

    it('should validate keys for info context', () => {
      const helpers = createPositionHelpers('info');

      expect(helpers.isValidKey('title')).toBeTrue();
      expect(helpers.isValidKey('version')).toBeTrue();
      expect(helpers.isValidKey('invalid-key')).toBeFalse();
    });

    it('should create position helpers for operation context', () => {
      const helpers = createPositionHelpers('operation');

      expect(helpers).toBeDefined();
      const keys = helpers.getAvailableKeys();
      expect(keys.length).toBeGreaterThan(0);
      expect(keys).toContain('summary');
      expect(keys).toContain('operationId');
    });

    it('should create position helpers for schema context', () => {
      const helpers = createPositionHelpers('schema');

      expect(helpers).toBeDefined();
      const keys = helpers.getAvailableKeys();
      expect(keys.length).toBeGreaterThan(0);
      expect(keys).toContain('type');
      expect(keys).toContain('properties');
    });
  });
});

