# Function-Based Vendor Extension System

The Prettier OpenAPI Plugin now includes an extremely easy-to-use vendor extension system with function-based positioning that makes it incredibly simple for vendors to add their extensions.

## ✅ What Was Accomplished

### 🎯 Function-Based Extensions
- **Function-based approach** - Each context is a function that receives `before` and `after` helpers
- **Automatic positioning** - No need to know exact positions, just use `before(key)` and `after(key)`
- **Type safety** - Full TypeScript support with IntelliSense
- **Extremely easy** - Just create a TS file and start adding extensions

### 🏗️ Simple API
- **`before(key)`** - Position before a specific key
- **`after(key)`** - Position after a specific key
- **`defineVendorExtensions(config)`** - Type-safe configuration helper

### 🎛️ Smart Positioning Benefits
- **No hardcoded positions** - Vendors don't need to know exact ordering
- **Automatic updates** - Changes to key arrays automatically update positioning
- **Intuitive API** - `before('info')` and `after('paths')` are self-explanatory
- **Type safety** - Full TypeScript support with IntelliSense

## 📁 Final Structure

```
vendor/
├── index.ts                    # Main vendor system with function-based approach
├── speakeasy.ts               # Speakeasy extensions (function-based)
├── example-usage.ts           # Example vendor (function-based)
└── README.md                  # Comprehensive documentation

src/
├── keys.ts                    # Centralized key arrays
└── index.ts                   # Main plugin (imports from keys.ts)
```

## 🚀 Usage Examples

### Simple Vendor Extension
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

### Speakeasy Vendor (Function-Based)
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

- **Extremely Easy** - Just create a TS file with functions
- **No Hardcoded Positions** - Use `before()` and `after()` helpers
- **Automatic Updates** - Changes to key arrays automatically update positioning
- **Type Safe** - Full TypeScript support with IntelliSense
- **Flexible** - Support for all OpenAPI contexts
- **Maintainable** - Simple function-based approach
- **Intuitive** - `before('info')` and `after('paths')` are self-explanatory

## 🚀 Getting Started

1. Create a new TypeScript file in `vendor/`
2. Import `defineVendorExtensions` from `./index`
3. Define your extensions using the function-based approach
4. Export your configuration
5. That's it! The plugin will automatically load your extensions

## 🎯 Result

The vendor extension system is now **extremely easy to use**:

- **Function-based approach** - Each context is a function with `before`/`after` helpers
- **No hardcoded positions** - Just use `before('info')` and `after('paths')`
- **Type safety** - Full TypeScript support with IntelliSense
- **Automatic positioning** - Changes to key arrays automatically update positioning
- **Simple API** - Just create a TS file and start adding extensions

Vendors can now add their extensions with just a few lines of code! 🚀
