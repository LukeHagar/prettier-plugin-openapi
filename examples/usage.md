# Usage Examples

## Basic Usage

### Format a single file
```bash
npx prettier --write examples/petstore.yaml
```

### Format all OpenAPI files
```bash
npx prettier --write "**/*.{openapi.json,openapi.yaml,swagger.json,swagger.yaml}"
```

## Configuration Examples

### package.json
```json
{
  "name": "my-api-project",
  "scripts": {
    "format": "prettier --write \"**/*.{openapi.json,openapi.yaml,swagger.json,swagger.yaml}\""
  },
  "prettier": {
    "plugins": ["prettier-plugin-openapi"],
    "tabWidth": 2,
    "printWidth": 80
  }
}
```

### .prettierrc.js
```javascript
module.exports = {
  plugins: ['prettier-plugin-openapi'],
  tabWidth: 2,
  printWidth: 80,
  overrides: [
    {
      files: ['*.openapi.json', '*.openapi.yaml', '*.swagger.json', '*.swagger.yaml'],
      options: {
        tabWidth: 2,
        printWidth: 100
      }
    }
  ]
};
```

## Before and After Examples

### YAML Example

**Before:**
```yaml
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
openapi: 3.0.0
info:
  version: 1.0.0
  title: My API
paths:
  /users:
    get:
      responses:
        '200':
          description: OK
```

**After:**
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
      properties:
        id:
          type: integer
        name:
          type: string
```

### JSON Example

**Before:**
```json
{
  "paths": {
    "/users": {
      "get": {
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    }
  },
  "openapi": "3.0.0",
  "info": {
    "title": "My API",
    "version": "1.0.0"
  }
}
```

**After:**
```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "My API",
    "version": "1.0.0"
  },
  "paths": {
    "/users": {
      "get": {
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    }
  }
}
```

## Integration with CI/CD

### GitHub Actions
```yaml
name: Format OpenAPI files
on: [push, pull_request]
jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx prettier --check "**/*.{openapi.json,openapi.yaml,swagger.json,swagger.yaml}"
```

### Pre-commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit
npx prettier --write "**/*.{openapi.json,openapi.yaml,swagger.json,swagger.yaml}"
git add .
```
