/**
 * Enhanced Vendor Extensions Example
 * 
 * This example demonstrates the improved IntelliSense and type safety
 * for vendor extensions configuration.
 */

import { defineConfig, createPositionHelpers } from "../index.js";

// Example vendor with enhanced type safety
export const exampleEnhanced = defineConfig({
  info: {
    name: 'Example Enhanced',
    website: 'https://example.com',
    support: 'support@example.com'
  },
  extensions: {
    // Type-safe context with IntelliSense for available keys
    'top-level': (before, after) => {
      // IntelliSense will show: 'swagger', 'openapi', 'jsonSchemaDialect', 'info', 'externalDocs', etc.
      return {
        'x-example-sdk': before('info'), // ✅ Type-safe: 'info' is a valid top-level key
        'x-example-config': after('paths'), // ✅ Type-safe: 'paths' is a valid top-level key
        // 'x-example-invalid': before('invalidKey'), // ❌ TypeScript error: 'invalidKey' is not a valid top-level key
      };
    },
    
    'info': (before, after) => {
      // IntelliSense will show: 'title', 'version', 'summary', 'description', 'termsOfService', etc.
      return {
        'x-example-info': after('version'), // ✅ Type-safe: 'version' is a valid info key
        'x-example-metadata': before('description'), // ✅ Type-safe: 'description' is a valid info key
      };
    },
    
    'operation': (before, after) => {
      // IntelliSense will show: 'summary', 'operationId', 'description', 'externalDocs', 'tags', etc.
      return {
        'x-example-retries': after('parameters'), // ✅ Type-safe: 'parameters' is a valid operation key
        'x-example-timeout': before('responses'), // ✅ Type-safe: 'responses' is a valid operation key
        'x-example-cache': after('servers'), // ✅ Type-safe: 'servers' is a valid operation key
      };
    },
    
    'schema': (before, after) => {
      // IntelliSense will show: '$ref', 'title', 'description', 'type', 'format', 'enum', etc.
      return {
        'x-example-validation': after('type'), // ✅ Type-safe: 'type' is a valid schema key
        'x-example-example': after('example'), // ✅ Type-safe: 'example' is a valid schema key
      };
    },
    
    'parameter': (before, after) => {
      // IntelliSense will show: 'name', 'description', 'in', 'required', 'deprecated', etc.
      return {
        'x-example-param': after('schema'), // ✅ Type-safe: 'schema' is a valid parameter key
      };
    },
    
    'response': (before, after) => {
      // IntelliSense will show: 'description', 'headers', 'content', 'links'
      return {
        'x-example-response': after('description'), // ✅ Type-safe: 'description' is a valid response key
      };
    },
    
    'securityScheme': (before, after) => {
      // IntelliSense will show: 'type', 'description', 'name', 'in', 'scheme', etc.
      return {
        'x-example-auth': after('type'), // ✅ Type-safe: 'type' is a valid security scheme key
      };
    },
    
    'server': (before, after) => {
      // IntelliSense will show: 'url', 'description', 'variables'
      return {
        'x-example-server': after('url'), // ✅ Type-safe: 'url' is a valid server key
      };
    },
    
    'tag': (before, after) => {
      // IntelliSense will show: 'name', 'description', 'externalDocs'
      return {
        'x-example-tag': after('name'), // ✅ Type-safe: 'name' is a valid tag key
      };
    },
    
    'externalDocs': (before, after) => {
      // IntelliSense will show: 'description', 'url'
      return {
        'x-example-docs': after('url'), // ✅ Type-safe: 'url' is a valid external docs key
      };
    },
    
    'webhook': (before, after) => {
      // IntelliSense will show: 'summary', 'operationId', 'description', 'deprecated', etc.
      return {
        'x-example-webhook': after('operationId'), // ✅ Type-safe: 'operationId' is a valid webhook key
      };
    },
    
    'definitions': (before, after) => {
      // IntelliSense will show schema keys: '$ref', 'title', 'description', 'type', etc.
      return {
        'x-example-definition': after('type'), // ✅ Type-safe: 'type' is a valid schema key
      };
    },
    
    'securityDefinitions': (before, after) => {
      // IntelliSense will show security scheme keys: 'type', 'description', 'name', etc.
      return {
        'x-example-security': after('type'), // ✅ Type-safe: 'type' is a valid security scheme key
      };
    }
  }
});

// Alternative approach using the enhanced helper functions
export const exampleWithHelpers = defineConfig({
  info: {
    name: 'Example With Helpers',
    website: 'https://example.com',
    support: 'support@example.com'
  },
  extensions: {
    'top-level': (before, after) => {
      // You can also use the enhanced helpers for additional functionality
      const helpers = createPositionHelpers('top-level');
      
      // Get all available keys for this context
      const availableKeys = helpers.getAvailableKeys();
      console.log('Available top-level keys:', availableKeys);
      
      // Validate if a key exists
      if (helpers.isValidKey('info')) {
        console.log('info is a valid top-level key');
      }
      
      return {
        'x-example-enhanced': before('info'),
        'x-example-config': after('paths'),
      };
    }
  }
});
