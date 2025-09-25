# Custom Extensions Support

This document explains the custom extensions functionality in the Prettier OpenAPI plugin.

## Overview

The plugin now supports configurable positioning of custom extensions (keys starting with `x-`) and ensures that unknown keys are sorted alphabetically at the bottom of their respective objects.

## Key Features

✅ **Configurable Extension Positioning** - Specify exactly where custom extensions should appear
✅ **Context-Aware Sorting** - Different extension configurations for different OpenAPI sections
✅ **Unknown Key Handling** - Unknown keys default to alphabetical sorting at the bottom
✅ **Type Safety** - Full TypeScript support with proper typing
✅ **Comprehensive Testing** - 15 tests covering all functionality

## Configuration

All custom extension configuration is located at the top of `src/index.ts`:

```typescript
// ============================================================================
// CUSTOM EXTENSION CONFIGURATION
// ============================================================================

// Custom extensions for top-level OpenAPI keys
const CUSTOM_TOP_LEVEL_EXTENSIONS: Record<string, number> = {
  'x-custom-field': 2, // Will be placed after 'info' (position 1)
  'x-api-version': 0,  // Will be placed before 'openapi'
};

// Custom extensions for info section
const CUSTOM_INFO_EXTENSIONS: Record<string, number> = {
  'x-api-id': 1,      // Will be placed after 'title' (position 0)
  'x-version-info': 3, // Will be placed after 'version' (position 2)
};
```

## Supported Contexts

| Context | Configuration Object | Standard Keys Count | Description |
|---------|---------------------|-------------------|-------------|
| `top-level` | `CUSTOM_TOP_LEVEL_EXTENSIONS` | 8 | Root OpenAPI object |
| `info` | `CUSTOM_INFO_EXTENSIONS` | 6 | Info section |
| `components` | `CUSTOM_COMPONENTS_EXTENSIONS` | 9 | Components section |
| `operation` | `CUSTOM_OPERATION_EXTENSIONS` | 11 | HTTP operation objects |
| `parameter` | `CUSTOM_PARAMETER_EXTENSIONS` | 12 | Parameter objects |
| `schema` | `CUSTOM_SCHEMA_EXTENSIONS` | 31 | Schema objects |
| `response` | `CUSTOM_RESPONSE_EXTENSIONS` | 4 | Response objects |
| `securityScheme` | `CUSTOM_SECURITY_SCHEME_EXTENSIONS` | 8 | Security scheme objects |
| `server` | `CUSTOM_SERVER_EXTENSIONS` | 3 | Server objects |
| `tag` | `CUSTOM_TAG_EXTENSIONS` | 3 | Tag objects |
| `externalDocs` | `CUSTOM_EXTERNAL_DOCS_EXTENSIONS` | 2 | External docs objects |

## Positioning Rules

### Position Numbers
- **0**: Before the first standard key
- **1**: After the first standard key
- **2**: After the second standard key
- **N**: After the Nth standard key
- **> standard keys length**: After all standard keys

### Sorting Priority
1. **Custom extensions** (in configured order)
2. **Standard keys** (in predefined order)
3. **Unknown keys** (alphabetically sorted)

## Examples

### Example 1: Top-Level Extensions

```typescript
const CUSTOM_TOP_LEVEL_EXTENSIONS: Record<string, number> = {
  'x-api-version': 0,     // Before 'openapi'
  'x-custom-field': 2,    // After 'info'
  'x-metadata': 8,        // After all standard keys
};
```

**Result:**
```yaml
x-api-version: "1.0"
openapi: 3.0.0
info: ...
x-custom-field: "value"
servers: ...
paths: ...
components: ...
x-metadata: {...}
```

### Example 2: Operation Extensions

```typescript
const CUSTOM_OPERATION_EXTENSIONS: Record<string, number> = {
  'x-rate-limit': 5,      // After 'parameters'
  'x-custom-auth': 10,    // After 'servers'
};
```

**Result:**
```yaml
get:
  tags: [...]
  summary: ...
  description: ...
  operationId: ...
  parameters: [...]
  x-rate-limit: 100
  requestBody: ...
  responses: ...
  callbacks: ...
  deprecated: false
  security: [...]
  servers: [...]
  x-custom-auth: "bearer"
```

### Example 3: Schema Extensions

```typescript
const CUSTOM_SCHEMA_EXTENSIONS: Record<string, number> = {
  'x-custom-type': 0,      // Before 'type'
  'x-validation-rules': 30, // After 'deprecated'
};
```

**Result:**
```yaml
User:
  x-custom-type: "entity"
  type: object
  properties: {...}
  required: [...]
  deprecated: false
  x-validation-rules: "required"
```

## Unknown Keys Behavior

Keys that are not in the standard arrays or custom extensions configuration will be sorted alphabetically at the bottom of their respective objects.

**Example:**
```yaml
info:
  title: My API
  version: 1.0.0
  # Standard keys in order
  contact: ...
  license: ...
  # Custom extensions in configured order
  x-api-id: "api-123"
  # Unknown keys sorted alphabetically at the end
  unknown-field: "value"
  x-other-extension: "value"
```

## Testing

The plugin includes comprehensive tests for custom extensions:

```bash
# Run all tests
bun test

# Run only custom extension tests
bun test test/custom-extensions.test.ts
```

**Test Coverage:**
- ✅ Custom extensions in top-level keys
- ✅ Custom extensions in info section
- ✅ Custom extensions in operation objects
- ✅ Custom extensions in schema objects
- ✅ JSON formatting with custom extensions
- ✅ YAML formatting with custom extensions
- ✅ Unknown keys handling

## Usage

### 1. Configure Extensions

Edit the configuration arrays in `src/index.ts`:

```typescript
const CUSTOM_TOP_LEVEL_EXTENSIONS: Record<string, number> = {
  'x-your-extension': 2, // Position after 'info'
};
```

### 2. Build the Plugin

```bash
bun run build
```

### 3. Use with Prettier

```bash
npx prettier --write your-api.yaml
```

## Best Practices

1. **Use Descriptive Names** - Choose clear, descriptive names for your extensions
2. **Consistent Positioning** - Use consistent positioning across similar contexts
3. **Document Extensions** - Document your custom extensions in your API documentation
4. **Test Changes** - Always test your configuration with real OpenAPI files
5. **Version Control** - Keep your extension configurations in version control

## Migration Guide

If you're upgrading from a version without custom extension support:

1. **No Breaking Changes** - Existing functionality remains unchanged
2. **Add Extensions Gradually** - Start with a few key extensions
3. **Test Thoroughly** - Test with your existing OpenAPI files
4. **Update Documentation** - Update your team's documentation

## Troubleshooting

### Common Issues

1. **Extensions Not Appearing** - Check that the extension is configured in the correct context
2. **Wrong Position** - Verify the position number is correct for the context
3. **Build Errors** - Ensure the plugin is rebuilt after configuration changes

### Debug Tips

1. **Check Context** - Use the context detection to ensure extensions are in the right place
2. **Verify Configuration** - Double-check your extension configuration
3. **Test Incrementally** - Add extensions one at a time to isolate issues

## Contributing

When adding new extension contexts:

1. Add the configuration object
2. Add the context to `CUSTOM_EXTENSIONS_MAP`
3. Add the context to `getContextKey` function
4. Add the context to `getStandardKeysForContext` function
5. Add tests for the new context
6. Update documentation

## License

This functionality is part of the Prettier OpenAPI plugin and follows the same MIT license.
