/**
 * Postman Extensions
 * 
 * Postman collection extensions for OpenAPI formatting.
 * Website: https://postman.com
 */

import { defineVendorExtensions } from "..";

// Function-based extensions with before/after helpers
export const extensions = defineVendorExtensions({
  'top-level': (before, after) => {
    return {
      'x-postman-collection': before('info'), // Before 'info'
      'x-postman-version': after('paths'), // After 'paths'
    };
  },
  'operation': (before, after) => {
    return {
      'x-postman-test': after('responses'), // After 'responses'
      'x-postman-pre-request': before('parameters'), // Before 'parameters'
    };
  },
  'schema': (before, after) => {
    return {
      'x-postman-example': after('example'), // After 'example'
      'x-postman-mock': after('deprecated'), // After 'deprecated'
    };
  }
});
