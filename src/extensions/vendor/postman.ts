/**
 * Postman Extensions
 * 
 * Postman collection extensions for OpenAPI formatting.
 * Website: https://postman.com
 */

import { defineVendorExtensions } from "..";

// Function-based extensions with before/after helpers
export const extensions = {
  'top-level': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-postman-collection': before('info'), // Before 'info'
      'x-postman-version': after('paths'), // After 'paths'
    };
  },
  'operation': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-postman-test': after('responses'), // After 'responses'
      'x-postman-pre-request': before('parameters'), // Before 'parameters'
    };
  },
  'schema': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-postman-example': after('example'), // After 'example'
      'x-postman-mock': after('deprecated'), // After 'deprecated'
    };
  }
};
