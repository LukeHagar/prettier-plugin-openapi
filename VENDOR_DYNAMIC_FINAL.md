# Dynamic Vendor Extension System

The Prettier OpenAPI Plugin now includes a powerful dynamic vendor extension system that automatically discovers and loads any number of vendor files.

## ✅ What Was Accomplished

### 🎯 Dynamic Vendor Loading
- **Automatic Discovery** - No configuration needed
- **Unlimited Vendors** - Add as many as you want
- **Zero Complexity** - Just create a TS file
- **Type Safe** - Full TypeScript support with IntelliSense
- **Flexible** - Support for all OpenAPI contexts
- **Maintainable** - Simple function-based approach

### 🏗️ System Architecture
- **`extensions/index.ts`** - Main extension system
- **`extensions/vendor-loader.ts`** - Automatic vendor discovery
- **`extensions/vendor/`** - Vendor extensions directory
- **Automatic Loading** - Discovers all TS files in vendor directory

### 🎛️ Ultra-Simple API
- **`before(key)`** - Position before a specific key
- **`after(key)`** - Position after a specific key
- **`export const extensions`** - Function-based extension definitions

## 📁 Final Structure

```
extensions/
├── index.ts                    # Main extension system
├── vendor-loader.ts           # Automatic vendor discovery
├── vendor/                     # Vendor extensions directory
│   ├── speakeasy.ts           # Speakeasy extensions
│   ├── redoc.ts               # Redoc extensions
│   ├── postman.ts             # Postman extensions
│   ├── example-usage.ts       # Example vendor
│   └── your-company.ts        # Your custom extensions
└── README.md                  # Documentation

src/
├── keys.ts                    # Centralized key arrays
└── index.ts                   # Main plugin (imports from keys.ts)
```

## 🚀 Usage Examples

### Adding a New Vendor (Ultra-Simple)
```typescript
// extensions/vendor/your-company.ts
export const extensions = {
  'top-level': (before, after) => {
    return {
      'x-your-company-api-key': before('info'), // Before 'info'
      'x-your-company-version': after('paths'), // After 'paths'
    };
  },
  'operation': (before, after) => {
    return {
      'x-your-company-rate-limit': after('parameters'), // After 'parameters'
      'x-your-company-auth': before('responses'), // Before 'responses'
    };
  }
};
```

### Speakeasy Vendor
```typescript
// extensions/vendor/speakeasy.ts
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

### Redoc Vendor
```typescript
// extensions/vendor/redoc.ts
export const extensions = {
  'top-level': (before, after) => {
    return {
      'x-redoc-version': before('info'), // Before 'info'
      'x-redoc-theme': after('paths'), // After 'paths'
    };
  },
  'operation': (before, after) => {
    return {
      'x-redoc-group': after('tags'), // After 'tags'
      'x-redoc-hide': before('responses'), // Before 'responses'
    };
  }
};
```

### Postman Vendor
```typescript
// extensions/vendor/postman.ts
export const extensions = {
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

- **Automatic Discovery** - No configuration needed
- **Unlimited Vendors** - Add as many as you want
- **Zero Complexity** - Just create a TS file
- **Type Safe** - Full TypeScript support with IntelliSense
- **Flexible** - Support for all OpenAPI contexts
- **Maintainable** - Simple function-based approach
- **Extensible** - Easy to add new vendors

## 🚀 Getting Started

1. **Create a new TypeScript file** in `extensions/vendor/`
2. **Export an `extensions` object** with function-based definitions
3. **Use `before` and `after` helpers** for positioning
4. **That's it!** The system handles the rest

## 🎯 Result

The vendor extension system is now **ultra-simple** and **unlimited**:

- **Automatic Discovery** - No configuration needed
- **Unlimited Vendors** - Add as many as you want
- **Zero Complexity** - Just create a TS file
- **Type Safe** - Full TypeScript support
- **Flexible** - Support for all OpenAPI contexts
- **Maintainable** - Simple function-based approach

Vendors can now add their extensions with just a few lines of code and zero complexity! 🚀
