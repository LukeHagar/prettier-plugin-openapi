# Vendor Helper Functions & Types

The Prettier OpenAPI Plugin now includes powerful helper functions and TypeScript types for the vendor extension system, similar to Vite's `defineConfig` approach.

## 🎯 New Features

### 1. `defineVendorConfig(config)` Helper Function
Similar to Vite's `defineConfig`, provides type-safe configuration with IntelliSense.

```typescript
import { defineVendorConfig } from './index';

export const config = defineVendorConfig({
  info: {
    name: 'mycompany',
    version: '1.0.0',
    description: 'MyCompany API extensions',
    website: 'https://mycompany.com'
  },
  extensions: {
    'top-level': {
      'x-mycompany-config': 1,
    },
    'operation': {
      'x-mycompany-rate-limit': 5,
    }
  }
});
```

### 2. `getContextKeys(context)` Function
Returns available keys for a context with hover documentation.

```typescript
import { getContextKeys } from './index';

const topLevelKeys = getContextKeys('top-level');
// Returns: ['swagger', 'openapi', 'info', 'servers', 'paths', ...]

const operationKeys = getContextKeys('operation');
// Returns: ['tags', 'summary', 'description', 'operationId', 'parameters', ...]
```

### 3. `getKeyPosition(context, key)` Function
Returns the position of a key in the standard ordering.

```typescript
import { getKeyPosition } from './index';

const openapiPosition = getKeyPosition('top-level', 'openapi');
// Returns: 1 (position in TOP_LEVEL_KEYS array)

const tagsPosition = getKeyPosition('operation', 'tags');
// Returns: 0 (position in OPERATION_KEYS array)
```

## 🧠 Smart Positioning

Use helper functions to position extensions relative to standard keys:

```typescript
const smartExtensions = {
  'top-level': {
    'x-mycompany-before-info': getKeyPosition('top-level', 'info') - 1, // Before 'info'
    'x-mycompany-after-paths': getKeyPosition('top-level', 'paths') + 1, // After 'paths'
  },
  'operation': {
    'x-mycompany-before-parameters': getKeyPosition('operation', 'parameters') - 1, // Before 'parameters'
    'x-mycompany-after-responses': getKeyPosition('operation', 'responses') + 1, // After 'responses'
  }
};
```

## 📚 TypeScript IntelliSense

### Hover Documentation
When you hover over context names in your IDE, you'll see:

- **`'top-level'`**: Shows all top-level OpenAPI keys in order
- **`'operation'`**: Shows all operation keys in order  
- **`'schema'`**: Shows all schema keys in order
- **`'parameter'`**: Shows all parameter keys in order
- **`'response'`**: Shows all response keys in order
- **`'securityScheme'`**: Shows all security scheme keys in order
- **`'server'`**: Shows all server keys in order
- **`'tag'`**: Shows all tag keys in order
- **`'externalDocs'`**: Shows all external docs keys in order
- **`'webhook'`**: Shows all webhook keys in order
- **`'definitions'`**: Shows all definition keys in order
- **`'securityDefinitions'`**: Shows all security definition keys in order

### Auto-Updating Documentation
The hover documentation automatically stays up-to-date as the key arrays change in the main plugin code!

## 🔧 Type Definitions

### Exported Types
```typescript
export interface VendorInfo {
  name: string;
  version: string;
  description?: string;
  website?: string;
}

export interface VendorConfig {
  info: VendorInfo;
  extensions: {
    'top-level'?: VendorContextExtensions;
    'info'?: VendorContextExtensions;
    'operation'?: VendorContextExtensions;
    'parameter'?: VendorContextExtensions;
    'schema'?: VendorContextExtensions;
    'response'?: VendorContextExtensions;
    'securityScheme'?: VendorContextExtensions;
    'server'?: VendorContextExtensions;
    'tag'?: VendorContextExtensions;
    'externalDocs'?: VendorContextExtensions;
    'webhook'?: VendorContextExtensions;
    'definitions'?: VendorContextExtensions;
    'securityDefinitions'?: VendorContextExtensions;
  };
}
```

### Context-Specific Key Types
```typescript
export type TopLevelKeys = typeof TOP_LEVEL_KEYS[number];
export type InfoKeys = typeof INFO_KEYS[number];
export type OperationKeys = typeof OPERATION_KEYS[number];
export type ParameterKeys = typeof PARAMETER_KEYS[number];
export type SchemaKeys = typeof SCHEMA_KEYS[number];
// ... and more
```

## 🚀 Example Usage

### Basic Vendor File
```typescript
// vendor/mycompany.ts
import { defineVendorConfig, getContextKeys, getKeyPosition } from './index';

export const info = {
  name: 'mycompany',
  version: '1.0.0',
  description: 'MyCompany API extensions',
  website: 'https://mycompany.com'
};

export const extensions = {
  'top-level': {
    'x-mycompany-config': 1,
    'x-mycompany-auth': 2,
  },
  'operation': {
    'x-mycompany-rate-limit': 5,
    'x-mycompany-timeout': 6,
  }
};

// Use defineVendorConfig for better type checking
export const config = defineVendorConfig({
  info,
  extensions
});
```

### Smart Positioning Example
```typescript
// vendor/smart-vendor.ts
import { defineVendorConfig, getKeyPosition } from './index';

export const smartExtensions = {
  'top-level': {
    'x-smart-before-info': getKeyPosition('top-level', 'info') - 1,
    'x-smart-after-paths': getKeyPosition('top-level', 'paths') + 1,
  },
  'operation': {
    'x-smart-before-parameters': getKeyPosition('operation', 'parameters') - 1,
    'x-smart-after-responses': getKeyPosition('operation', 'responses') + 1,
  }
};

export const config = defineVendorConfig({
  info: {
    name: 'smart-vendor',
    version: '1.0.0',
    description: 'Smart vendor with relative positioning',
    website: 'https://smart-vendor.com'
  },
  extensions: smartExtensions
});
```

## ✅ Benefits

- **Type Safety**: Full TypeScript support with IntelliSense
- **Auto-Updating**: Documentation stays in sync with key arrays
- **Smart Positioning**: Position extensions relative to standard keys
- **Easy to Use**: Simple helper functions like Vite's `defineConfig`
- **Better DX**: Hover documentation shows available keys and their order
- **Maintainable**: Changes to key arrays automatically update types

## 🧪 Testing

All helper functions are fully tested:

```bash
# Run vendor tests
bun test test/vendor.test.ts

# Run all tests
bun test
```

The vendor extension system now provides a developer experience similar to modern build tools like Vite, with powerful TypeScript support and IntelliSense! 🎉
