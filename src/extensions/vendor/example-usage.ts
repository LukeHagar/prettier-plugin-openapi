/**
 * Example Vendor Extensions
 */

// Function-based extensions with before/after helpers
export const extensions = {
  'top-level': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-example-before-info': before('info'), // Before 'info'
      'x-example-after-paths': after('paths'), // After 'paths'
    };
  },
  'operation': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-example-before-parameters': before('parameters'), // Before 'parameters'
      'x-example-after-responses': after('responses'), // After 'responses'
    };
  },
  'schema': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-example-validation': after('type'), // After 'type'
      'x-example-example': after('example'), // After 'example'
    };
  }
};
