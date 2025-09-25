# Customizing Key Ordering

This document explains how to customize the key ordering in the Prettier OpenAPI plugin.

## Overview

The plugin uses configuration arrays and maps at the top of the `src/index.ts` file to determine the order of keys in OpenAPI/Swagger files. You can easily modify these arrays to change the sorting behavior.

## Configuration Arrays

All key ordering configuration is located at the top of `src/index.ts` in the "KEY ORDERING CONFIGURATION" section.

### Top-Level Keys

```typescript
const TOP_LEVEL_KEYS = [
  'openapi',
  'info',
  'servers',
  'paths',
  'components',
  'security',
  'tags',
  'externalDocs',
] as const;
```

### Info Section Keys

```typescript
const INFO_KEYS = [
  'title',
  'description',
  'version',
  'termsOfService',
  'contact',
  'license',
] as const;
```

### Contact Section Keys

```typescript
const CONTACT_KEYS = [
  'name',
  'url',
  'email',
] as const;
```

### License Section Keys

```typescript
const LICENSE_KEYS = [
  'name',
  'url',
] as const;
```

### Components Section Keys

```typescript
const COMPONENTS_KEYS = [
  'schemas',
  'responses',
  'parameters',
  'examples',
  'requestBodies',
  'headers',
  'securitySchemes',
  'links',
  'callbacks',
] as const;
```

### Operation Keys

```typescript
const OPERATION_KEYS = [
  'tags',
  'summary',
  'description',
  'operationId',
  'parameters',
  'requestBody',
  'responses',
  'callbacks',
  'deprecated',
  'security',
  'servers',
] as const;
```

### Parameter Keys

```typescript
const PARAMETER_KEYS = [
  'name',
  'in',
  'description',
  'required',
  'deprecated',
  'allowEmptyValue',
  'style',
  'explode',
  'allowReserved',
  'schema',
  'example',
  'examples',
] as const;
```

### Schema Keys

```typescript
const SCHEMA_KEYS = [
  'type',
  'format',
  'title',
  'description',
  'default',
  'example',
  'examples',
  'enum',
  'const',
  'multipleOf',
  'maximum',
  'exclusiveMaximum',
  'minimum',
  'exclusiveMinimum',
  'maxLength',
  'minLength',
  'pattern',
  'maxItems',
  'minItems',
  'uniqueItems',
  'maxProperties',
  'minProperties',
  'required',
  'properties',
  'patternProperties',
  'additionalProperties',
  'items',
  'allOf',
  'oneOf',
  'anyOf',
  'not',
  'discriminator',
  'xml',
  'externalDocs',
  'deprecated',
] as const;
```

### Response Keys

```typescript
const RESPONSE_KEYS = [
  'description',
  'headers',
  'content',
  'links',
] as const;
```

### Security Scheme Keys

```typescript
const SECURITY_SCHEME_KEYS = [
  'type',
  'description',
  'name',
  'in',
  'scheme',
  'bearerFormat',
  'flows',
  'openIdConnectUrl',
] as const;
```

### OAuth Flow Keys

```typescript
const OAUTH_FLOW_KEYS = [
  'authorizationUrl',
  'tokenUrl',
  'refreshUrl',
  'scopes',
] as const;
```

### Server Keys

```typescript
const SERVER_KEYS = [
  'url',
  'description',
  'variables',
] as const;
```

### Server Variable Keys

```typescript
const SERVER_VARIABLE_KEYS = [
  'enum',
  'default',
  'description',
] as const;
```

### Tag Keys

```typescript
const TAG_KEYS = [
  'name',
  'description',
  'externalDocs',
] as const;
```

### External Docs Keys

```typescript
const EXTERNAL_DOCS_KEYS = [
  'description',
  'url',
] as const;
```

## How to Customize

### 1. Reorder Keys

To change the order of keys, simply rearrange the arrays:

```typescript
// Example: Put 'description' before 'title' in info section
const INFO_KEYS = [
  'description',  // Moved to first
  'title',
  'version',
  'termsOfService',
  'contact',
  'license',
] as const;
```

### 2. Add New Keys

To add support for new keys, add them to the appropriate array:

```typescript
// Example: Add custom keys to info section
const INFO_KEYS = [
  'title',
  'description',
  'version',
  'customField',  // New key
  'termsOfService',
  'contact',
  'license',
] as const;
```

### 3. Remove Keys

To remove keys from sorting (they'll be sorted alphabetically), simply remove them from the arrays:

```typescript
// Example: Remove 'termsOfService' from info section
const INFO_KEYS = [
  'title',
  'description',
  'version',
  // 'termsOfService',  // Removed
  'contact',
  'license',
] as const;
```

### 4. Create Custom Ordering

You can create completely custom ordering by modifying the arrays:

```typescript
// Example: Custom ordering for your organization's standards
const INFO_KEYS = [
  'title',
  'version',
  'description',
  'contact',
  'license',
  'termsOfService',
] as const;
```

## Special Sorting Rules

Some sections have special sorting rules that can't be changed by modifying arrays:

- **Paths**: Sorted by specificity (more specific paths first)
- **Response Codes**: Sorted numerically (200, 201, 400, 404, etc.)
- **Schema Properties**: Sorted alphabetically
- **Parameters**: Sorted alphabetically
- **Security Schemes**: Sorted alphabetically

## Testing Changes

After modifying the configuration arrays:

1. Build the plugin:
   ```bash
   bun run build
   ```

2. Run tests to ensure nothing is broken:
   ```bash
   bun test
   ```

3. Test with your OpenAPI files:
   ```bash
   npx prettier --write your-api.yaml
   ```

## Examples

### Example 1: Prioritize Security

```typescript
const TOP_LEVEL_KEYS = [
  'openapi',
  'info',
  'security',  // Moved up
  'servers',
  'paths',
  'components',
  'tags',
  'externalDocs',
] as const;
```

### Example 2: Custom Info Ordering

```typescript
const INFO_KEYS = [
  'title',
  'version',
  'description',
  'contact',
  'license',
  'termsOfService',
] as const;
```

### Example 3: Schema-First Components

```typescript
const COMPONENTS_KEYS = [
  'schemas',  // Already first, but emphasizing
  'responses',
  'parameters',
  'examples',
  'requestBodies',
  'headers',
  'securitySchemes',
  'links',
  'callbacks',
] as const;
```

## Custom Extensions

The plugin supports custom extensions (keys starting with `x-`) with configurable positioning. You can specify exactly where your custom extensions should appear in the sorted output.

### Configuration

Custom extensions are configured at the top of `src/index.ts` in the "CUSTOM EXTENSION CONFIGURATION" section:

```typescript
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

### How Positioning Works

- **Position 0**: Before the first standard key
- **Position 1**: After the first standard key
- **Position 2**: After the second standard key
- **Position N**: After the Nth standard key
- **Position > standard keys length**: After all standard keys

### Examples

#### Example 1: Top-Level Custom Extensions

```typescript
const CUSTOM_TOP_LEVEL_EXTENSIONS: Record<string, number> = {
  'x-api-version': 0,     // Before 'openapi'
  'x-custom-field': 2,    // After 'info' (position 1)
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

#### Example 2: Info Section Custom Extensions

```typescript
const CUSTOM_INFO_EXTENSIONS: Record<string, number> = {
  'x-api-id': 1,          // After 'title'
  'x-version-info': 3,    // After 'version'
  'x-custom-info': 6,     // After all standard keys
};
```

**Result:**
```yaml
info:
  title: My API
  x-api-id: "api-123"
  description: API Description
  version: 1.0.0
  x-version-info: "v1.0.0-beta"
  contact: ...
  license: ...
  x-custom-info: {...}
```

#### Example 3: Operation Custom Extensions

```typescript
const CUSTOM_OPERATION_EXTENSIONS: Record<string, number> = {
  'x-rate-limit': 5,      // After 'parameters' (position 4)
  'x-custom-auth': 10,    // After 'servers' (position 9)
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

### Available Extension Contexts

| Context | Configuration Object | Description |
|---------|---------------------|-------------|
| `top-level` | `CUSTOM_TOP_LEVEL_EXTENSIONS` | Root OpenAPI object |
| `info` | `CUSTOM_INFO_EXTENSIONS` | Info section |
| `components` | `CUSTOM_COMPONENTS_EXTENSIONS` | Components section |
| `operation` | `CUSTOM_OPERATION_EXTENSIONS` | HTTP operation objects |
| `parameter` | `CUSTOM_PARAMETER_EXTENSIONS` | Parameter objects |
| `schema` | `CUSTOM_SCHEMA_EXTENSIONS` | Schema objects |
| `response` | `CUSTOM_RESPONSE_EXTENSIONS` | Response objects |
| `securityScheme` | `CUSTOM_SECURITY_SCHEME_EXTENSIONS` | Security scheme objects |
| `server` | `CUSTOM_SERVER_EXTENSIONS` | Server objects |
| `tag` | `CUSTOM_TAG_EXTENSIONS` | Tag objects |
| `externalDocs` | `CUSTOM_EXTERNAL_DOCS_EXTENSIONS` | External docs objects |

### Unknown Keys Behavior

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

### Complete Example

Here's a complete example of custom extension configuration:

```typescript
// Top-level custom extensions
const CUSTOM_TOP_LEVEL_EXTENSIONS: Record<string, number> = {
  'x-api-version': 0,     // Before 'openapi'
  'x-custom-field': 2,    // After 'info'
  'x-metadata': 8,        // After all standard keys
};

// Info section custom extensions
const CUSTOM_INFO_EXTENSIONS: Record<string, number> = {
  'x-api-id': 1,          // After 'title'
  'x-version-info': 3,    // After 'version'
};

// Operation custom extensions
const CUSTOM_OPERATION_EXTENSIONS: Record<string, number> = {
  'x-rate-limit': 5,      // After 'parameters'
  'x-custom-auth': 10,    // After 'servers'
};

// Schema custom extensions
const CUSTOM_SCHEMA_EXTENSIONS: Record<string, number> = {
  'x-custom-type': 0,      // Before 'type'
  'x-validation-rules': 30, // After 'deprecated'
};
```

## Notes

- Keys not in the configuration arrays will be sorted alphabetically
- Custom extensions can be positioned anywhere in the key order
- Unknown keys (not in standard or custom lists) default to alphabetical sorting at the bottom
- The `as const` assertion ensures type safety
- Changes require rebuilding the plugin (`bun run build`)
- Test your changes with real OpenAPI files to ensure they work as expected
