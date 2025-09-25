/**
 * Redoc Extensions
 * 
 * Redoc documentation extensions for OpenAPI formatting.
 * Website: https://redoc.ly
 */

import { defineVendorExtensions } from "..";

// Function-based extensions with before/after helpers
export const extensions = defineVendorExtensions({
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
});
