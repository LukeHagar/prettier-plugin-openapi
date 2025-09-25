# Enhanced Vendor Extension System with Helper Functions

The Prettier OpenAPI Plugin now includes a comprehensive vendor extension system with both calculated positioning and helper functions for maximum flexibility.

## ✅ What Was Accomplished

### 🎯 Helper Functions Implementation
- **`before(context, key)`** - Position before a specific key
- **`after(context, key)`** - Position after a specific key  
- **`getKeyPosition(context, key)`** - Get exact position of a key
- **`getContextKeys(context)`** - Get all keys for a context

### 🏗️ Two Positioning Approaches
- **Approach 1**: Calculated positions (recommended for most vendors)
- **Approach 2**: Helper functions (for dynamic positioning)

### 🎛️ Smart Positioning Benefits
- **No hardcoded positions** - Vendors don't need to know exact ordering
- **Automatic updates** - Changes to key arrays automatically update positioning
- **Type safety** - Full TypeScript support with IntelliSense
- **Flexibility** - Choose the approach that works best for your use case

## 📁 Current Structure

```
vendor/
├── index.ts                    # Main vendor system with helper functions
├── speakeasy.ts               # Speakeasy extensions (calculated positions)
├── example-usage.ts           # Example vendor (calculated positions)
├── helper-functions-example.ts # Example using helper functions
└── README.md                  # Documentation

src/
├── keys.ts                    # Centralized key arrays
└── index.ts                   # Main plugin (imports from keys.ts)
```

## 🚀 Usage Examples

### Approach 1: Calculated Positions (Recommended)
```typescript
// vendor/speakeasy.ts
export const extensions = {
  'top-level': {
    'x-speakeasy-sdk': 1, // Before 'info' (position 2)
    'x-speakeasy-auth': 11, // After 'paths' (position 10)
  },
  'operation': {
    'x-speakeasy-retries': 6, // After 'parameters' (position 5)
    'x-speakeasy-timeout': 8, // Before 'responses' (position 9)
    'x-speakeasy-cache': 12, // After 'servers' (position 11)
  }
};
```

### Approach 2: Helper Functions (Advanced)
```typescript
// vendor/helper-functions-example.ts
import { defineVendorConfig, before, after } from './index';

export const smartExtensions = {
  'top-level': {
    'x-example-before-info': before('top-level', 'info'), // Before 'info'
    'x-example-after-paths': after('top-level', 'paths'), // After 'paths'
  },
  'operation': {
    'x-example-before-parameters': before('operation', 'parameters'), // Before 'parameters'
    'x-example-after-responses': after('operation', 'responses'), // After 'responses'
  },
  'schema': {
    'x-example-validation': after('schema', 'type'), // After 'type'
    'x-example-example': after('schema', 'example'), // After 'example'
  }
};
```

## 🎛️ Helper Functions API

### `before(context, key)`
Returns the position before the specified key.

```typescript
before('top-level', 'info') // Returns 1 (before 'info' at position 2)
before('operation', 'parameters') // Returns 4 (before 'parameters' at position 5)
```

### `after(context, key)`
Returns the position after the specified key.

```typescript
after('top-level', 'paths') // Returns 11 (after 'paths' at position 10)
after('operation', 'responses') // Returns 10 (after 'responses' at position 9)
```

### `getKeyPosition(context, key)`
Returns the exact position of a key in the standard ordering.

```typescript
getKeyPosition('top-level', 'info') // Returns 2
getKeyPosition('operation', 'parameters') // Returns 5
```

### `getContextKeys(context)`
Returns all keys for a context with hover documentation.

```typescript
getContextKeys('top-level') // Returns ['swagger', 'openapi', 'info', ...]
getContextKeys('operation') // Returns ['tags', 'summary', 'description', ...]
```

## 🎯 Benefits of Each Approach

### Calculated Positions (Approach 1)
- ✅ **Simple** - Just numbers with comments
- ✅ **Fast** - No function calls at runtime
- ✅ **Clear** - Easy to see exact positioning
- ✅ **Stable** - No dependency on helper functions

### Helper Functions (Approach 2)
- ✅ **Dynamic** - Automatically adapts to key changes
- ✅ **Intuitive** - `before('info')` and `after('paths')` are clear
- ✅ **Maintainable** - No need to update positions manually
- ✅ **Type Safe** - Full TypeScript support

## 📚 TypeScript Support

### Hover Documentation
When you hover over context names in your IDE, you'll see:
- **`'top-level'`**: Shows all top-level OpenAPI keys in order
- **`'operation'`**: Shows all operation keys in order  
- **`'schema'`**: Shows all schema keys in order
- **`'parameter'`**: Shows all parameter keys in order
- And so on...

### Type Safety
```typescript
// Full type safety with IntelliSense
const position = before('top-level', 'info'); // Type: number
const keys = getContextKeys('operation'); // Type: readonly string[]
```

## 🧪 Testing

All tests pass:
```bash
# Run vendor tests
bun test test/vendor.test.ts

# Run all tests
bun test
```

## 🎉 Result

The vendor extension system now provides:

- **Two positioning approaches** - Choose what works best for your use case
- **Helper functions** - `before()`, `after()`, `getKeyPosition()`, `getContextKeys()`
- **Type safety** - Full TypeScript support with IntelliSense
- **Smart positioning** - Position extensions relative to standard keys
- **Flexibility** - Calculated positions or dynamic helper functions
- **Maintainability** - Changes to key arrays automatically update positioning

Vendors can now choose between simple calculated positions or dynamic helper functions for maximum flexibility! 🚀
