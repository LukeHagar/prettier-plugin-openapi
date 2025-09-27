/**
 * Speakeasy SDK Extensions
 * 
 * Speakeasy SDK extensions for OpenAPI formatting.
 * Website: https://www.speakeasy.com
 */

import { defineConfig } from "../index.js";

// Function-based extensions with before/after helpers
export const speakeasy = defineConfig({
  info: {
    name: 'Speakeasy',
    website: 'https://www.speakeasy.com',
    support: 'support@speakeasy.com'
  },
  extensions: {
    'top-level': (before, after) => {
      return {
        'x-speakeasy-globals': after('security'),
        'x-speakeasy-globals-hidden': after('security'),
      };
    },
    'operation': (before, after) => {
      return {
        'x-speakeasy-pagination': after('parameters'),
        'x-speakeasy-usage-example': after('deprecated'),
      };
    },
  }
});