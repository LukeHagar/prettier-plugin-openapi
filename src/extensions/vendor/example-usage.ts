/**
 * Example Vendor Extensions
 */

// Function-based extensions with before/after helpers
export const extensions = {
  'top-level': (before, after) => {
    return {
      'x-example-before-info': before('info'), // Before 'info'
      'x-example-after-paths': after('paths'), // After 'paths'
    };
  },
  'operation': (before, after) => {
    return {
      'x-example-before-parameters': before('parameters'), // Before 'parameters'
      'x-example-after-responses': after('responses'), // After 'responses'
    };
  },
  'schema': (before, after) => {
    return {
      'x-example-validation': after('type'), // After 'type'
      'x-example-example': after('example'), // After 'example'
    };
  }
};
