# Prettier Plugin OpenAPI

A Prettier plugin for formatting OpenAPI/Swagger JSON and YAML files with intelligent key sorting, proper indentation, and support for modular OpenAPI file structures.

## Features

- 🎯 **OpenAPI/Swagger Support**: Formats both JSON and YAML OpenAPI specifications
- 🔄 **Smart Key Sorting**: Automatically sorts OpenAPI keys in the recommended order
- 📁 **Modular File Support**: Handles both monolithic and modular OpenAPI file structures
- 🧩 **Component Files**: Supports individual component files (schemas, parameters, responses, etc.)
- 📝 **YAML & JSON**: Supports both `.yaml/.yml` and `.json` file formats
- 🎨 **Consistent Formatting**: Applies consistent indentation and line breaks
- 🔌 **Vendor Extensions**: Programmatic loading of vendor-specific extensions
- ⚡ **Fast**: Built with performance in mind using modern JavaScript
- 🧪 **Comprehensive Testing**: 99 tests with 94.62% line coverage
- 🚀 **CI/CD Ready**: Automated testing, building, and publishing
- 🔒 **Strict Validation**: Properly rejects non-OpenAPI content
- 📊 **High Quality**: ESLint, Prettier, and TypeScript for code quality

## Installation

```bash
npm install --save-dev prettier-plugin-openapi
# or
yarn add --dev prettier-plugin-openapi
# or
bun add --dev prettier-plugin-openapi
```

## Usage

### Command Line

```bash
# Format a single file
npx prettier --write api.yaml

# Format all OpenAPI files in a directory
npx prettier --write "**/*.{openapi.json,openapi.yaml,swagger.json,swagger.yaml}"

# Format with specific options
npx prettier --write api.yaml --tab-width 4 --print-width 100
```

### Configuration

Add the plugin to your Prettier configuration:

**package.json**
```json
{
  "prettier": {
    "plugins": ["prettier-plugin-openapi"]
  }
}
```

**.prettierrc**
```json
{
  "plugins": ["prettier-plugin-openapi"],
  "tabWidth": 2,
  "printWidth": 80
}
```

**.prettierrc.js**
```javascript
module.exports = {
  plugins: ['prettier-plugin-openapi'],
  tabWidth: 2,
  printWidth: 80,
};
```

## Supported File Extensions

- `.openapi.json`
- `.openapi.yaml`
- `.openapi.yml`
- `.swagger.json`
- `.swagger.yaml`
- `.swagger.yml`
- `.json` (for component files)
- `.yaml` / `.yml` (for component files)

## Modular File Structure Support

The plugin supports both monolithic and modular OpenAPI file structures:

### Monolithic Structure
```
api.yaml                    # Single file with everything
```

### Modular Structure
```
├─ openapi.yaml             # Root document
├─ paths/                    # Path files
│  ├─ users.yaml
│  ├─ users_{id}.yaml
│  └─ auth_login.yaml
├─ components/               # Component files
│  ├─ schemas/
│  │  ├─ User.yaml
│  │  ├─ UserCreate.yaml
│  │  └─ Error.yaml
│  ├─ parameters/
│  │  ├─ CommonPagination.yaml
│  │  └─ UserId.yaml
│  ├─ responses/
│  │  ├─ ErrorResponse.yaml
│  │  └─ UserResponse.yaml
│  ├─ requestBodies/
│  │  └─ UserCreateBody.yaml
│  ├─ headers/
│  │  └─ RateLimitHeaders.yaml
│  ├─ examples/
│  │  └─ UserExample.yaml
│  ├─ securitySchemes/
│  │  └─ BearerAuth.yaml
│  ├─ links/
│  │  └─ UserCreatedLink.yaml
│  └─ callbacks/
│     └─ NewMessageCallback.yaml
└─ webhooks/                 # Webhook files
   └─ messageCreated.yaml
```

## Key Sorting

The plugin automatically sorts OpenAPI keys in the recommended order:

> 📖 **Complete Key Reference**: For a comprehensive reference of all keys, their ordering, and detailed reasoning, see [KEYS.md](./KEYS.md).

### Top-level keys:
1. `openapi` / `swagger`
2. `info`
3. `servers`
4. `paths`
5. `components`
6. `security`
7. `tags`
8. `externalDocs`

### Info section:
1. `title`
2. `summary`
3. `description`
4. `version`
5. `termsOfService`
6. `contact`
7. `license`

### Components section:
1. `schemas`
2. `responses`
3. `parameters`
4. `examples`
5. `requestBodies`
6. `headers`
7. `securitySchemes`
8. `links`
9. `callbacks`
10. `pathItems`

## Examples

### Monolithic File Structure

#### Before (unformatted):
```yaml
paths:
  /users:
    get:
      responses:
        '200':
          description: OK
components:
  schemas:
    User:
      type: object
openapi: 3.0.0
info:
  version: 1.0.0
  title: My API
```

#### After (formatted):
```yaml
openapi: 3.0.0
info:
  title: My API
  version: 1.0.0
paths:
  /users:
    get:
      responses:
        '200':
          description: OK
components:
  schemas:
    User:
      type: object
```

### Modular File Structure

#### Root Document (`openapi.yaml`):
```yaml
openapi: 3.0.0
info:
  title: My API
  version: 1.0.0
paths:
  $ref: './paths/users.yaml'
components:
  schemas:
    $ref: './components/schemas/User.yaml'
```

#### Component File (`components/schemas/User.yaml`):
```yaml
type: object
properties:
  id:
    type: integer
  name:
    type: string
required:
  - id
  - name
```

#### Path File (`paths/users.yaml`):
```yaml
get:
  summary: Get users
  responses:
    '200':
      description: Success
      content:
        application/json:
          schema:
            type: array
            items:
              $ref: '../components/schemas/User.yaml'
```

## Vendor Extensions

The plugin supports vendor-specific extensions through a programmatic loading system:

### Adding Vendor Extensions

1. Create a TypeScript file in `src/extensions/vendor/`
2. Export your extensions using the provided API:

```typescript
// src/extensions/vendor/my-vendor.ts
import { defineVendorExtensions } from '../index';

export const extensions = defineVendorExtensions({
  'top-level': (before, after) => ({
    'x-my-custom-field': before('info'),
    'x-vendor-metadata': after('externalDocs')
  }),
  'operation': (before, after) => ({
    'x-rate-limit': before('responses'),
    'x-cache-ttl': after('deprecated')
  })
});
```

### Automatic Discovery

Vendor extensions are automatically discovered and loaded at runtime. No manual imports required!

## Development

### Setup

```bash
# Install dependencies
bun install

# Build the plugin
bun run build

# Run tests
bun test

# Run tests with coverage
bun test --coverage

# Lint code
bun run lint

# Format code
bun run format
```

### Project Structure

```
src/
  index.ts                    # Main plugin implementation
  keys.ts                     # OpenAPI key definitions
  extensions/
    index.ts                  # Extension system
    vendor-loader.ts          # Automatic vendor loading
    vendor/                   # Vendor extensions
      speakeasy.ts
      postman.ts
      redoc.ts
test/
  plugin.test.ts              # Core plugin tests
  integration.test.ts         # Integration tests
  build.test.ts              # Build validation tests
  coverage.test.ts            # Coverage enhancement tests
  file-detection.test.ts      # File detection tests
  key-ordering.test.ts        # Key sorting tests
  custom-extensions.test.ts  # Extension tests
  options.test.ts            # Configuration tests
  simple-ordering.test.ts     # Basic ordering tests
  vendor.test.ts             # Vendor extension tests
  setup.ts                    # Test utilities
.github/
  workflows/
    ci.yml                   # Continuous Integration
    release.yml              # Automated releases
examples/
  petstore.yaml               # Example OpenAPI file
```

### Test Suite

The project includes a comprehensive test suite with **99 tests** covering:

- **Core Functionality**: Plugin structure, parsing, formatting
- **Integration Tests**: Real OpenAPI file processing, error handling
- **Build Tests**: Package validation, TypeScript compilation
- **Coverage Tests**: Edge cases, error scenarios
- **File Detection**: OpenAPI file recognition, component files
- **Key Ordering**: OpenAPI key sorting, custom extensions
- **Vendor Extensions**: Extension system functionality
- **Options**: Configuration and formatting options

**Coverage**: 94.62% line coverage, 95.74% function coverage

### CI/CD Pipeline

The project includes automated CI/CD with GitHub Actions:

- **Continuous Integration**: Tests on Node.js 18, 20, 22 and Bun
- **Automated Testing**: Linting, type checking, security audits
- **Smart Releases**: Automatic patch version bumps on main branch updates
- **NPM Publishing**: Automated publishing with version management
- **Quality Gates**: All tests must pass before release

## Configuration Options

The plugin respects standard Prettier options:

- `tabWidth`: Number of spaces for indentation (default: 2)
- `printWidth`: Maximum line length (default: 80)
- `useTabs`: Use tabs instead of spaces (default: false)

## Advanced Features

### File Detection

The plugin intelligently detects OpenAPI files based on:

1. **Content Structure**: Files with OpenAPI-specific keys (`openapi`, `swagger`, `components`, etc.)
2. **Directory Patterns**: Files in OpenAPI-related directories (`components/`, `paths/`, `webhooks/`)
3. **File Extensions**: Standard OpenAPI file extensions

### Key Sorting Algorithm

The plugin uses a unified sorting algorithm that:

1. **Prioritizes Standard Keys**: OpenAPI specification keys are sorted first
2. **Handles Custom Extensions**: Vendor extensions are positioned relative to standard keys
3. **Sorts Unknown Keys**: Non-standard keys are sorted alphabetically at the end
4. **Context-Aware**: Different sorting rules for different OpenAPI contexts (operations, schemas, etc.)

### Performance Optimizations

- **Unified Sorting Function**: Single function handles all sorting scenarios
- **Lazy Loading**: Vendor extensions are loaded only when needed
- **Efficient Detection**: Fast file type detection with minimal overhead

## Quality & Reliability

### Comprehensive Testing

- **99 Test Cases**: Covering all major functionality
- **94.62% Line Coverage**: Extensive test coverage
- **95.74% Function Coverage**: Nearly complete function testing
- **Edge Case Testing**: Malformed files, error scenarios, performance
- **Integration Testing**: Real-world OpenAPI file processing

### Code Quality

- **TypeScript**: Full type safety and IntelliSense support
- **ESLint**: Strict linting rules for code quality
- **Prettier**: Consistent code formatting
- **Security Audits**: Automated dependency vulnerability scanning
- **Performance Testing**: Large file handling and memory usage

### CI/CD Pipeline

- **Automated Testing**: Runs on every commit and PR
- **Multi-Environment**: Tests on Node.js 18, 20, 22 and Bun
- **Quality Gates**: All tests must pass before merge
- **Smart Releases**: Automatic patch version management
- **NPM Publishing**: Automated package publishing with proper versioning

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** with proper TypeScript types
4. **Add tests** for new functionality (aim for 90%+ coverage)
5. **Run the test suite**:
   ```bash
   bun test
   bun run lint
   bun run format
   ```
6. **Ensure all tests pass** (99 tests, 0 failures)
7. **Submit a pull request** with a clear description

### Development Guidelines

- **Code Quality**: All code must pass ESLint and Prettier checks
- **Testing**: New features require comprehensive tests
- **TypeScript**: Use proper types and interfaces
- **Documentation**: Update README for new features
- **CI/CD**: All GitHub Actions must pass before merge

### Release Process

- **Automatic**: Patch releases happen automatically on main branch updates
- **Manual**: Major/minor releases require manual version bumps
- **Quality Gates**: All tests, linting, and security checks must pass
- **NPM Publishing**: Automated publishing with proper versioning

## License

MIT License - see LICENSE file for details.

## Related Projects

- [Prettier](https://prettier.io/) - The core formatter
- [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.0.html) - The OpenAPI specification
- [Swagger](https://swagger.io/) - API development tools
