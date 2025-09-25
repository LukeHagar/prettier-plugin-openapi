# Vendor Extension System

The Prettier OpenAPI Plugin includes a powerful vendor extension system that allows any number of vendors to contribute custom extensions automatically.

## 🚀 How It Works

The system automatically discovers and loads all TypeScript files in the `extensions/vendor/` directory. Each vendor just needs to:

1. **Create a TS file** in `extensions/vendor/`
2. **Export an `extensions` object** with function-based definitions
3. **That's it!** The system handles the rest

## 📁 Directory Structure

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
└── README.md                  # This documentation
```

## 🎯 Adding a New Vendor

### Step 1: Create Your Vendor File
Create a new TypeScript file in `extensions/vendor/`:

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

### Step 2: That's It!
The system automatically:
- ✅ Discovers your file
- ✅ Loads your extensions
- ✅ Merges them with other vendors
- ✅ Applies them to OpenAPI documents

## 🎛️ Supported Contexts

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

## 🎯 Example Vendors

### Speakeasy
```typescript
// extensions/vendor/speakeasy.ts
export const extensions = {
  'top-level': (before, after) => {
    return {
      'x-speakeasy-sdk': before('info'),
      'x-speakeasy-auth': after('paths'),
    };
  }
};
```

### Redoc
```typescript
// extensions/vendor/redoc.ts
export const extensions = {
  'top-level': (before, after) => {
    return {
      'x-redoc-version': before('info'),
      'x-redoc-theme': after('paths'),
    };
  }
};
```

### Postman
```typescript
// extensions/vendor/postman.ts
export const extensions = {
  'operation': (before, after) => {
    return {
      'x-postman-test': after('responses'),
      'x-postman-pre-request': before('parameters'),
    };
  }
};
```

## 🎯 Result

The vendor extension system is now **ultra-simple** and **unlimited**:

- **Automatic Discovery** - No configuration needed
- **Unlimited Vendors** - Add as many as you want
- **Zero Complexity** - Just create a TS file
- **Type Safe** - Full TypeScript support
- **Flexible** - Support for all OpenAPI contexts
- **Maintainable** - Simple function-based approach

Vendors can now add their extensions with just a few lines of code and zero complexity! 🚀