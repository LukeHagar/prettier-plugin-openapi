# Supported Keys - Complete Reference

This document provides a comprehensive list of all supported keys for Swagger 2.0, OpenAPI 3.0, 3.1, and 3.2 specifications.

## Top-Level Keys

### All Versions
- `swagger` (Swagger 2.0 only)
- `openapi` (OpenAPI 3.0+)
- `info`
- `paths`
- `security`
- `tags`
- `externalDocs`

### Version-Specific
- `jsonSchemaDialect` (OpenAPI 3.1+)
- `servers` (OpenAPI 3.0+)
- `webhooks` (OpenAPI 3.1+)
- `components` (OpenAPI 3.0+)
- `host` (Swagger 2.0 only)
- `basePath` (Swagger 2.0 only)
- `schemes` (Swagger 2.0 only)
- `consumes` (Swagger 2.0 only)
- `produces` (Swagger 2.0 only)
- `definitions` (Swagger 2.0 only)
- `parameters` (Swagger 2.0 only)
- `responses` (Swagger 2.0 only)
- `securityDefinitions` (Swagger 2.0 only)

## Info Section Keys

### All Versions
- `title`
- `description`
- `version`
- `termsOfService`
- `contact`
- `license`

### Version-Specific
- `summary` (OpenAPI 3.1+)

## Contact Section Keys

### All Versions
- `name`
- `url`
- `email`

## License Section Keys

### All Versions
- `name`
- `url`

## Components Section Keys (OpenAPI 3.0+)

### All Versions
- `schemas`
- `responses`
- `parameters`
- `examples`
- `requestBodies`
- `headers`
- `securitySchemes`
- `links`
- `callbacks`

### Version-Specific
- `pathItems` (OpenAPI 3.1+)

## Operation Keys

### All Versions
- `tags`
- `summary`
- `description`
- `operationId`
- `parameters`
- `responses`
- `deprecated`
- `security`

### Version-Specific
- `consumes` (Swagger 2.0 only)
- `produces` (Swagger 2.0 only)
- `requestBody` (OpenAPI 3.0+)
- `schemes` (Swagger 2.0 only)
- `callbacks` (OpenAPI 3.0+)
- `servers` (OpenAPI 3.0+)

## Parameter Keys

### All Versions
- `name`
- `in`
- `description`
- `required`
- `deprecated`
- `allowEmptyValue`
- `style`
- `explode`
- `allowReserved`
- `schema`
- `example`
- `examples`

### Swagger 2.0 Specific
- `type`
- `format`
- `items`
- `collectionFormat`
- `default`
- `maximum`
- `exclusiveMaximum`
- `minimum`
- `exclusiveMinimum`
- `maxLength`
- `minLength`
- `pattern`
- `maxItems`
- `minItems`
- `uniqueItems`
- `enum`
- `multipleOf`

## Schema Keys

### Core JSON Schema Keywords
- `$schema`
- `$id`
- `$ref`
- `$anchor`
- `$dynamicAnchor`
- `$dynamicRef`
- `$vocabulary`
- `$comment`
- `$defs`
- `$recursiveAnchor`
- `$recursiveRef`

### Basic Type and Format
- `type`
- `format`
- `title`
- `description`
- `default`
- `example`
- `examples`
- `enum`
- `const`

### Numeric Validation
- `multipleOf`
- `maximum`
- `exclusiveMaximum`
- `minimum`
- `exclusiveMinimum`

### String Validation
- `maxLength`
- `minLength`
- `pattern`

### Array Validation
- `maxItems`
- `minItems`
- `uniqueItems`
- `items`
- `prefixItems`
- `contains`
- `minContains`
- `maxContains`
- `unevaluatedItems`

### Object Validation
- `maxProperties`
- `minProperties`
- `required`
- `properties`
- `patternProperties`
- `additionalProperties`
- `unevaluatedProperties`
- `propertyNames`
- `dependentRequired`
- `dependentSchemas`

### Schema Composition
- `allOf`
- `oneOf`
- `anyOf`
- `not`
- `if`
- `then`
- `else`

### OpenAPI Specific
- `discriminator`
- `xml`
- `externalDocs`
- `deprecated`

### Additional JSON Schema Keywords
- `contentEncoding`
- `contentMediaType`
- `contentSchema`

## Response Keys

### All Versions
- `description`
- `headers`

### Version-Specific
- `content` (OpenAPI 3.0+)
- `schema` (Swagger 2.0 only)
- `examples` (Swagger 2.0 only)
- `links` (OpenAPI 3.0+)

## Security Scheme Keys

### All Versions
- `type`
- `description`
- `name`
- `in`
- `scheme`
- `bearerFormat`
- `openIdConnectUrl`

### Version-Specific
- `flows` (OpenAPI 3.0+)
- `flow` (Swagger 2.0 only)
- `authorizationUrl` (Swagger 2.0 only)
- `tokenUrl` (Swagger 2.0 only)
- `scopes` (Swagger 2.0 only)

## OAuth Flow Keys (OpenAPI 3.0+)

### All Versions
- `authorizationUrl`
- `tokenUrl`
- `refreshUrl`
- `scopes`

## Server Keys

### All Versions
- `url`
- `description`
- `variables`

## Server Variable Keys

### All Versions
- `enum`
- `default`
- `description`

## Tag Keys

### All Versions
- `name`
- `description`
- `externalDocs`

## External Docs Keys

### All Versions
- `description`
- `url`

## Webhook Keys (OpenAPI 3.1+)

### All Versions
- `tags`
- `summary`
- `description`
- `operationId`
- `parameters`
- `requestBody`
- `responses`
- `callbacks`
- `deprecated`
- `security`
- `servers`

## Special Sorting Rules

### Paths
- Sorted by specificity (more specific paths first)
- Paths with fewer parameters come before paths with more parameters

### Response Codes
- Sorted numerically (200, 201, 400, 404, etc.)
- Non-numeric codes sorted alphabetically

### Schema Properties
- Sorted alphabetically

### Parameters
- Sorted alphabetically

### Security Schemes
- Sorted alphabetically

### Definitions (Swagger 2.0)
- Sorted alphabetically

### Security Definitions (Swagger 2.0)
- Sorted alphabetically

## Version Detection

The plugin automatically detects the OpenAPI/Swagger version based on the presence of specific keys:

- **Swagger 2.0**: Contains `swagger` key
- **OpenAPI 3.0**: Contains `openapi` key with version 3.0.x
- **OpenAPI 3.1**: Contains `openapi` key with version 3.1.x
- **OpenAPI 3.2**: Contains `openapi` key with version 3.2.x

## Custom Extensions

All custom extensions (keys starting with `x-`) are supported and can be positioned using the configuration arrays at the top of `src/index.ts`.

## Unknown Keys

Keys that are not in the standard arrays or custom extensions configuration will be sorted alphabetically at the bottom of their respective objects.

## Examples

### Swagger 2.0 Example
```yaml
swagger: "2.0"
info:
  title: My API
  version: 1.0.0
host: api.example.com
basePath: /v1
schemes:
  - https
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: OK
definitions:
  User:
    type: object
    properties:
      id:
        type: integer
```

### OpenAPI 3.0 Example
```yaml
openapi: 3.0.0
info:
  title: My API
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
```

### OpenAPI 3.1+ Example
```yaml
openapi: 3.1.0
info:
  title: My API
  version: 1.0.0
  summary: API for managing users
servers:
  - url: https://api.example.com/v1
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
webhooks:
  userCreated:
    post:
      summary: User created webhook
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
```

## Notes

- The plugin supports all valid keys from all versions
- Version-specific keys are handled appropriately based on the detected version
- Custom extensions are fully supported with configurable positioning
- Unknown keys are sorted alphabetically at the bottom
- All sorting is consistent and predictable
