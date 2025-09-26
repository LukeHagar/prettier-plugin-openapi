/**
 * Redoc Extensions
 * 
 * Redoc documentation extensions for OpenAPI formatting.
 * Website: https://redocly.com
 */

import { defineConfig } from "../index.js";

// Function-based extensions with before/after helpers
export const redoc = defineConfig({
  info: {
    name: 'Redocly',
    website: 'https://redocly.com',
    support: 'team@redocly.com'
  },
  extensions: {
  'top-level': (before, after) => {
    return {
      'x-redoc-version': before('info'), // Before 'info'
      'x-redoc-theme': after('paths'), // After 'paths'
    };
  },
  'info': (before, after) => {
    return {
      'x-redoc-info': after('version'), // After 'version'
    };
  },
  'operation': (before, after) => {
    return {
      'x-redoc-group': after('tags'), // After 'tags'
      'x-redoc-hide': before('responses'), // Before 'responses'
    };
  },
  'schema': (before, after) => {
    return {
      'x-redoc-example': after('example'), // After 'example'
      'x-redoc-readonly': after('deprecated'), // After 'deprecated'
      };
    }
  }
});
