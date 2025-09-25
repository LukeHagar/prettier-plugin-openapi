# Simple Vendor Extension System

The Prettier OpenAPI Plugin now includes a simple vendor extension system that allows third-party vendors to contribute custom extensions by adding TypeScript files.

## 🎯 Overview

Vendors can easily contribute their custom OpenAPI extensions by creating a simple TypeScript file in the `vendor/` folder. No CLI, no manifests, no complexity - just TypeScript files!

## 🏗️ How It Works

### For Vendors

1. **Create a TypeScript file** in the `vendor/` folder (e.g., `mycompany.ts`)
2. **Export your extensions** using the standard format
3. **Import your file** in `vendor/index.ts`

### Example Vendor File

```typescript
// vendor/mycompany.ts

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
  'info': {
    'x-mycompany-info': 1,
  },
  'operation': {
    'x-mycompany-rate-limit': 5,
    'x-mycompany-timeout': 6,
  },
  'schema': {
    'x-mycompany-validation': 1,
  }
};
```

### Update vendor/index.ts

```typescript
// Import your vendor
import * as mycompany from './mycompany';

// Add to getVendorExtensions function
if (mycompany.extensions) {
  for (const [context, contextExtensions] of Object.entries(mycompany.extensions)) {
    if (!extensions[context]) {
      extensions[context] = {};
    }
    Object.assign(extensions[context], contextExtensions);
  }
}
```

## 📋 Supported Contexts

| Context | Description | Example Extensions |
|---------|------------|----------------------|
| `top-level` | Root OpenAPI document | `x-mycompany-config` |
| `info` | API information | `x-mycompany-info` |
| `operation` | HTTP operations | `x-mycompany-rate-limit` |
| `schema` | Schema objects | `x-mycompany-validation` |
| `parameter` | Parameters | `x-mycompany-param` |
| `response` | Responses | `x-mycompany-response` |
| `securityScheme` | Security schemes | `x-mycompany-auth` |
| `server` | Servers | `x-mycompany-server` |
| `tag` | Tags | `x-mycompany-tag` |
| `externalDocs` | External docs | `x-mycompany-docs` |
| `webhook` | Webhooks (OpenAPI 3.1+) | `x-mycompany-webhook` |
| `definitions` | Swagger 2.0 definitions | `x-mycompany-definition` |
| `securityDefinitions` | Swagger 2.0 security | `x-mycompany-security` |

## 🎛️ Position System

Extensions are positioned using numbers:

- **0**: First position (before standard keys)
- **1-10**: Early positions (after key fields)
- **11-20**: Middle positions
- **21+**: Later positions (before unknown keys)

## 🚀 Current Vendors

### Speakeasy
- **Website**: https://speakeasyapi.dev
- **Extensions**: SDK configuration, retry logic, validation rules
- **File**: `vendor/speakeasy.ts`

### Redoc
- **Website**: https://redoc.ly
- **Extensions**: Theme configuration, code samples, display options
- **File**: `vendor/redoc.ts`

### Postman
- **Website**: https://postman.com
- **Extensions**: Collection configuration, testing, workspace management
- **File**: `vendor/postman.ts`

## 🧪 Testing

The vendor system includes comprehensive tests:

```bash
# Run vendor tests
bun test test/vendor.test.ts

# Run all tests
bun test
```

## 📁 Directory Structure

```
vendor/
├── index.ts          # Main vendor system
├── speakeasy.ts      # Speakeasy extensions
├── redoc.ts          # Redoc extensions
├── postman.ts        # Postman extensions
└── README.md         # Documentation
```

## ✅ Benefits

- **Simple**: Just TypeScript files, no CLI or manifests
- **Type Safe**: Full TypeScript support
- **Easy to Add**: Vendors just create a TS file
- **Automatic**: Extensions loaded at plugin startup
- **Flexible**: Vendors control positioning
- **Maintainable**: Easy to update and manage

## 🔧 Integration

The vendor system is automatically integrated with the plugin:

1. **Startup**: Extensions loaded when plugin starts
2. **Merging**: Vendor extensions merged with base configuration
3. **Positioning**: Extensions positioned according to their definitions
4. **Formatting**: OpenAPI documents formatted with proper key ordering

## 📖 Documentation

- **Vendor README**: `vendor/README.md`
- **Type Definitions**: `vendor/index.ts`
- **Examples**: See existing vendor files

This simple vendor system makes the Prettier OpenAPI Plugin truly extensible while keeping the complexity minimal. Vendors can contribute their extensions with just a TypeScript file! 🎉
