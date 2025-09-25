# Prettier Plugin OpenAPI

A Prettier plugin for formatting OpenAPI/Swagger JSON and YAML files with intelligent key sorting and proper indentation.

## Features

- 🎯 **OpenAPI/Swagger Support**: Formats both JSON and YAML OpenAPI specifications
- 🔄 **Smart Key Sorting**: Automatically sorts OpenAPI keys in the recommended order
- 📝 **YAML & JSON**: Supports both `.yaml/.yml` and `.json` file formats
- 🎨 **Consistent Formatting**: Applies consistent indentation and line breaks
- ⚡ **Fast**: Built with performance in mind using modern JavaScript

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

## Key Sorting

The plugin automatically sorts OpenAPI keys in the recommended order:

### Top-level keys:
1. `openapi`
2. `info`
3. `servers`
4. `paths`
5. `components`
6. `security`
7. `tags`
8. `externalDocs`

### Info section:
1. `title`
2. `description`
3. `version`
4. `termsOfService`
5. `contact`
6. `license`

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

## Examples

### Before (unformatted):
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

### After (formatted):
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

## Development

### Setup

```bash
# Install dependencies
bun install

# Build the plugin
bun run build

# Run tests
bun test

# Run demo
bun run test/demo.ts
```

### Project Structure

```
src/
  index.ts          # Main plugin implementation
test/
  plugin.test.ts     # Unit tests
  demo.ts           # Demo script
examples/
  petstore.yaml     # Example OpenAPI file
```

## Configuration Options

The plugin respects standard Prettier options:

- `tabWidth`: Number of spaces for indentation (default: 2)
- `printWidth`: Maximum line length (default: 80)
- `useTabs`: Use tabs instead of spaces (default: false)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Related Projects

- [Prettier](https://prettier.io/) - The core formatter
- [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.0.html) - The OpenAPI specification
- [Swagger](https://swagger.io/) - API development tools
