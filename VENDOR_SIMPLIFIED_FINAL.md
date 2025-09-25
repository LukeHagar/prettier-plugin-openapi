# Simplified Vendor Extension System

The Prettier OpenAPI Plugin now includes an extremely simple vendor extension system that makes it incredibly easy for vendors to add their extensions.

## ✅ What Was Accomplished

### 🎯 Simplified System
- **Removed vendor info** - No more metadata, just extensions
- **Function-based approach** - Each context is a function with `before`/`after` helpers
- **Minimal API** - Just `defineVendorExtensions({ extensions })`
- **Extremely easy** - Just create a TS file and start adding extensions

### 🏗️ Ultra-Simple API
- **`before(key)`** - Position before a specific key
- **`after(key)`** - Position after a specific key
- **`defineVendorExtensions({ extensions })`** - Type-safe configuration helper

### 🎛️ Zero Complexity
- **No vendor info** - No metadata to manage
- **No version tracking** - No version numbers to maintain
- **No descriptions** - No documentation to write
- **Just extensions** - Focus on what matters

## 📁 Final Structure

```
vendor/
├── index.ts                    # Main vendor system (simplified)
├── speakeasy.ts               # Speakeasy extensions (function-based)
├── example-usage.ts           # Example vendor (function-based)
└── README.md                  # Documentation

src/
├── keys.ts                    # Centralized key arrays
└── index.ts                   # Main plugin (imports from keys.ts)
```

## 🚀 Usage Examples

### Ultra-Simple Vendor Extension
```typescript
// vendor/mycompany.ts
import { defineVendorExtensions } from './index';

export const extensions = {
  'top-level': (before, after) => {
    return {
      'x-mycompany-api-key': before('info'), // Before 'info'
      'x-mycompany-version': after('paths'), // After 'paths'
    };
  },
  'operation': (before, after) => {
    return {
      'x-mycompany-rate-limit': after('parameters'), // After 'parameters'
      'x-mycompany-auth': before('responses'), // Before 'responses'
    };
  }
};

export const config = defineVendorExtensions({ extensions });
```

### Speakeasy Vendor (Simplified)
```typescript
// vendor/speakeasy.ts
export const extensions = {
  'top-level': (before, after) => {
    return {
      'x-speakeasy-sdk': before('info'), // Before 'info'
      'x-speakeasy-auth': after('paths'), // After 'paths'
    };
  },
  'operation': (before, after) => {
    return {
      'x-speakeasy-retries': after('parameters'), // After 'parameters'
      'x-speakeasy-timeout': before('responses'), // Before 'responses'
      'x-speakeasy-cache': after('servers'), // After 'servers'
    };
  }
};

export const config = defineVendorExtensions({ extensions });
```

## 🎯 Supported Contexts

| Context | Description | Example Keys |
|---------|-------------|--------------|
| `'top-level'` | Root OpenAPI document | `openapi`, `info`, `paths`, `components` |
| `'info'` | API information | `title`, `version`, `description` |
| `'operation'` | Path operations | `summary`, `parameters`, `responses` |
| `'parameter'` | Request parameters | `name`, `in`, `schema` |
| `'schema'` | Data schemas | `type`, `properties`, `required` |
| `'response'` | API responses | `description`, `content`, `headers` |
| `'securityScheme'` | Security schemes | `type`, `name`, `in` |
| `'server'` | Server information | `url`, `description`, `variables` |
| `'tag'` | API tags | `name`, `description`, `externalDocs` |
| `'externalDocs'` | External documentation | `description`, `url` |
| `'webhook'` | Webhook operations | `summary`, `parameters`, `responses` |
| `'definitions'` | Swagger 2.0 definitions | `type`, `properties`, `required` |
| `'securityDefinitions'` | Swagger 2.0 security | `type`, `name`, `in` |

## 🎛️ Positioning Helpers

### `before(key)`
Position before a specific key:
```typescript
before('info')    // Before 'info' key
before('paths')  // Before 'paths' key
before('type')    // Before 'type' key
```

### `after(key)`
Position after a specific key:
```typescript
after('info')     // After 'info' key
after('paths')    // After 'paths' key
after('type')     // After 'type' key
```

## 📚 TypeScript Support

### Hover Documentation
When you hover over context names in your IDE, you'll see:
- **`'top-level'`**: Shows all top-level OpenAPI keys in order
- **`'operation'`**: Shows all operation keys in order  
- **`'schema'`**: Shows all schema keys in order
- And so on...

### Type Safety
```typescript
// Full type safety with IntelliSense
const extensions = {
  'top-level': (before, after) => {
    return {
      'x-company-key': before('info'), // ✅ Type safe
      'x-company-value': after('paths'), // ✅ Type safe
    };
  }
};
```

## 🧪 Testing

All tests pass:
```bash
# Run vendor tests
bun test test/vendor.test.ts

# Run all tests
bun test
```

## 🎉 Benefits

- **Ultra-Simple** - Just create a TS file with functions
- **No Metadata** - No vendor info to manage
- **No Versioning** - No version numbers to track
- **No Descriptions** - No documentation to write
- **Just Extensions** - Focus on what matters
- **Type Safe** - Full TypeScript support with IntelliSense
- **Flexible** - Support for all OpenAPI contexts
- **Maintainable** - Simple function-based approach

## 🚀 Getting Started

1. Create a new TypeScript file in `vendor/`
2. Import `defineVendorExtensions` from `./index`
3. Define your extensions using the function-based approach
4. Export your configuration
5. That's it! The plugin will automatically load your extensions

## 🎯 Result

The vendor extension system is now **ultra-simple**:

- **No vendor info** - No metadata to manage
- **Function-based approach** - Each context is a function with `before`/`after` helpers
- **Minimal API** - Just `defineVendorExtensions({ extensions })`
- **Zero complexity** - No versioning, no descriptions, no metadata
- **Just extensions** - Focus on what matters

Vendors can now add their extensions with just a few lines of code and zero complexity! 🚀
