# Vendor Extension System

The Prettier OpenAPI Plugin now includes a comprehensive vendor extension system that allows third-party vendors to contribute custom extensions with structured positioning.

## 🎯 Overview

The vendor system enables companies like Speakeasy, Redoc, Postman, and others to contribute their custom OpenAPI extensions to the plugin, ensuring proper key ordering and positioning in formatted OpenAPI documents.

## 🏗️ Architecture

### Core Components

1. **Vendor Loader** (`vendor/loader.ts`): Loads and merges vendor extensions
2. **Type Definitions** (`vendor/types.ts`): TypeScript interfaces for vendor system
3. **CLI Tool** (`vendor/cli.ts`): Management tool for vendors
4. **Manifest System**: JSON-based vendor configuration

### Directory Structure

```
vendor/
├── types.ts              # Type definitions
├── loader.ts             # Extension loader
├── cli.ts               # CLI management tool
├── README.md            # Documentation
├── examples/            # Usage examples
├── speakeasy/           # Speakeasy extensions
│   └── manifest.json
├── redoc/               # Redoc extensions
│   └── manifest.json
└── [vendor-name]/       # Other vendors
    └── manifest.json
```

## 🚀 Features

### ✅ Vendor Management
- **Automatic Loading**: Extensions loaded at plugin startup
- **Version Compatibility**: Plugin version checking
- **Error Handling**: Graceful fallback to base configuration
- **CLI Tools**: Easy vendor management

### ✅ Extension Positioning
- **Structured Positioning**: Numeric position system
- **Context-Aware**: Extensions apply to specific OpenAPI contexts
- **Global Extensions**: Extensions that apply to all contexts
- **Priority System**: Vendor extensions override base configuration

### ✅ Developer Experience
- **Type Safety**: Full TypeScript support
- **Validation**: Manifest validation tools
- **Documentation**: Comprehensive examples and docs
- **Debugging**: Detailed logging and error messages

## 📋 Supported Contexts

| Context | Description | Example Extensions |
|---------|------------|----------------------|
| `top-level` | Root OpenAPI document | `x-speakeasy-sdk`, `x-redoc-version` |
| `info` | API information | `x-speakeasy-info`, `x-redoc-info` |
| `operation` | HTTP operations | `x-speakeasy-retries`, `x-redoc-group` |
| `schema` | Schema objects | `x-speakeasy-validation`, `x-redoc-display` |
| `parameter` | Parameters | `x-speakeasy-param` |
| `response` | Responses | `x-speakeasy-response` |
| `securityScheme` | Security schemes | `x-speakeasy-auth` |
| `server` | Servers | `x-speakeasy-server` |
| `tag` | Tags | `x-speakeasy-tag` |
| `externalDocs` | External docs | `x-speakeasy-docs` |
| `webhook` | Webhooks (OpenAPI 3.1+) | `x-speakeasy-webhook` |
| `definitions` | Swagger 2.0 definitions | `x-speakeasy-definition` |
| `securityDefinitions` | Swagger 2.0 security | `x-speakeasy-security` |

## 🛠️ Usage

### For Vendors

1. **Create Vendor Directory**:
   ```bash
   mkdir vendor/mycompany
   ```

2. **Create Manifest**:
   ```json
   {
     "pluginVersion": "1.0.0",
     "vendors": [
       {
         "name": "mycompany",
         "version": "1.0.0",
         "description": "MyCompany API extensions",
         "contexts": [
           {
             "context": "top-level",
             "extensions": [
               {
                 "key": "x-mycompany-config",
                 "position": 1,
                 "description": "MyCompany configuration"
               }
             ]
           }
         ]
       }
     ]
   }
   ```

3. **Test Integration**:
   ```bash
   bun vendor/cli.ts validate
   bun vendor/cli.ts info mycompany
   ```

### For Users

1. **Install Plugin**: The vendor system works automatically
2. **Add Vendors**: Place vendor directories in `vendor/` folder
3. **Format Documents**: Extensions are automatically positioned
4. **Manage Vendors**: Use CLI tools for management

## 🎛️ CLI Commands

```bash
# List all vendors
bun vendor/cli.ts list

# Get vendor information
bun vendor/cli.ts info speakeasy

# Validate vendor manifests
bun vendor/cli.ts validate

# Create new vendor template
bun vendor/cli.ts create mycompany
```

## 📊 Position System

Extensions are positioned using a numeric system:

- **0**: First position (before standard keys)
- **1-10**: Early positions (after key fields)
- **11-20**: Middle positions
- **21+**: Later positions (before unknown keys)

## 🔧 Configuration

### Base Configuration
The plugin includes base custom extensions that can be overridden by vendors:

```typescript
const BASE_CUSTOM_TOP_LEVEL_EXTENSIONS = {
  // Base extensions here
};
```

### Vendor Override
Vendors can override base extensions by specifying the same keys with different positions.

### Global Extensions
Vendors can define global extensions that apply to all contexts:

```json
{
  "globalExtensions": [
    {
      "key": "x-mycompany-version",
      "position": 0,
      "description": "MyCompany version info"
    }
  ]
}
```

## 🧪 Testing

The vendor system includes comprehensive tests:

```bash
# Run vendor tests
bun test test/vendor.test.ts

# Run all tests
bun test
```

## 📚 Examples

### Speakeasy Extensions
- **SDK Configuration**: `x-speakeasy-sdk`
- **Retry Logic**: `x-speakeasy-retries`
- **Validation Rules**: `x-speakeasy-validation`

### Redoc Extensions
- **Theme Configuration**: `x-redoc-theme`
- **Code Samples**: `x-redoc-code-samples`
- **Display Options**: `x-redoc-display`

## 🚨 Error Handling

The system includes robust error handling:

- **Missing Manifests**: Graceful fallback to base configuration
- **Invalid JSON**: Clear error messages
- **Version Conflicts**: Compatibility warnings
- **Missing Dependencies**: Automatic fallback

## 🔮 Future Enhancements

- **Dynamic Loading**: Hot-reload vendor extensions
- **Extension Validation**: Schema validation for extensions
- **Vendor Marketplace**: Centralized vendor registry
- **Performance Optimization**: Lazy loading of extensions

## 📖 Documentation

- **Vendor README**: `vendor/README.md`
- **Type Definitions**: `vendor/types.ts`
- **Examples**: `vendor/examples/`
- **CLI Help**: `bun vendor/cli.ts`

This vendor system makes the Prettier OpenAPI Plugin truly extensible, allowing the ecosystem to contribute and maintain their own custom extensions while ensuring consistent formatting across all OpenAPI documents.
