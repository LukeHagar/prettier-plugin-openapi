/**
 * OpenAPI Key Arrays
 * 
 * Centralized key ordering arrays for OpenAPI specifications.
 * Supports Swagger 2.0, OpenAPI 3.0, 3.1, and 3.2
 */

// Top-level OpenAPI keys in preferred order
// Supports Swagger 2.0, OpenAPI 3.0, 3.1, and 3.2
export const TOP_LEVEL_KEYS = [
    'swagger',           // Swagger 2.0
    'openapi',           // OpenAPI 3.0+
    'info',
    'jsonSchemaDialect', // OpenAPI 3.1+
    'servers',           // OpenAPI 3.0+ (replaces host, basePath, schemes in 2.0)
    'host',              // Swagger 2.0
    'basePath',          // Swagger 2.0
    'schemes',           // Swagger 2.0
    'consumes',          // Swagger 2.0
    'produces',          // Swagger 2.0
    'paths',
    'webhooks',          // OpenAPI 3.1+
    'components',        // OpenAPI 3.0+ (replaces definitions, parameters, responses, securityDefinitions in 2.0)
    'definitions',       // Swagger 2.0
    'parameters',        // Swagger 2.0
    'responses',         // Swagger 2.0
    'securityDefinitions', // Swagger 2.0
    'security',
    'tags',
    'externalDocs',
] as const;

// Info section keys in preferred order
// Supports all versions with version-specific keys
export const INFO_KEYS = [
    'title',
    'summary',            // OpenAPI 3.1+
    'description',
    'version',
    'termsOfService',
    'contact',
    'license',
] as const;

// Contact section keys in preferred order
export const CONTACT_KEYS = [
    'name',
    'url',
    'email',
] as const;

// License section keys in preferred order
export const LICENSE_KEYS = [
    'name',
    'url',
] as const;

// Components section keys in preferred order
// OpenAPI 3.0+ only (replaces top-level objects in Swagger 2.0)
export const COMPONENTS_KEYS = [
    'schemas',
    'responses',
    'parameters',
    'examples',
    'requestBodies',
    'headers',
    'securitySchemes',
    'links',
    'callbacks',
    'pathItems',          // OpenAPI 3.1+
] as const;

// Path operation keys in preferred order
// Supports all versions with version-specific keys
export const OPERATION_KEYS = [
    'tags',
    'summary',
    'description',
    'operationId',
    'consumes',           // Swagger 2.0
    'produces',           // Swagger 2.0
    'parameters',
    'requestBody',        // OpenAPI 3.0+
    'responses',
    'schemes',            // Swagger 2.0
    'callbacks',          // OpenAPI 3.0+
    'deprecated',
    'security',
    'servers',            // OpenAPI 3.0+
    'externalDocs',      // OpenAPI 3.0+
] as const;

// Parameter keys in preferred order
// Supports all versions with version-specific keys
export const PARAMETER_KEYS = [
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
    // Swagger 2.0 specific
    'type',               // Swagger 2.0
    'format',             // Swagger 2.0
    'items',              // Swagger 2.0
    'collectionFormat',    // Swagger 2.0
    'default',            // Swagger 2.0
    'maximum',            // Swagger 2.0
    'exclusiveMaximum',   // Swagger 2.0
    'minimum',            // Swagger 2.0
    'exclusiveMinimum',   // Swagger 2.0
    'maxLength',          // Swagger 2.0
    'minLength',          // Swagger 2.0
    'pattern',            // Swagger 2.0
    'maxItems',           // Swagger 2.0
    'minItems',           // Swagger 2.0
    'uniqueItems',        // Swagger 2.0
    'enum',               // Swagger 2.0
    'multipleOf',         // Swagger 2.0
] as const;

// Schema keys in preferred order
// Supports all versions with comprehensive JSON Schema support
export const SCHEMA_KEYS = [
    // Core JSON Schema keywords
    '$ref',               // JSON Schema draft
    '$schema',            // JSON Schema draft
    '$id',                // JSON Schema draft
    '$anchor',            // JSON Schema draft
    '$dynamicAnchor',     // JSON Schema draft
    '$dynamicRef',        // JSON Schema draft
    '$vocabulary',        // JSON Schema draft
    '$comment',           // JSON Schema draft
    '$defs',              // JSON Schema draft
    '$recursiveAnchor',   // JSON Schema draft
    '$recursiveRef',      // JSON Schema draft
    // Basic type and format
    'type',
    'format',
    'title',
    'description',
    'default',
    'example',
    'examples',
    'enum',
    'const',
    // Numeric validation
    'multipleOf',
    'maximum',
    'exclusiveMaximum',
    'minimum',
    'exclusiveMinimum',
    // String validation
    'maxLength',
    'minLength',
    'pattern',
    // Array validation
    'maxItems',
    'minItems',
    'uniqueItems',
    'items',
    'prefixItems',        // JSON Schema draft
    'contains',           // JSON Schema draft
    'minContains',        // JSON Schema draft
    'maxContains',        // JSON Schema draft
    'unevaluatedItems',   // JSON Schema draft
    // Object validation
    'maxProperties',
    'minProperties',
    'required',
    'properties',
    'patternProperties',
    'additionalProperties',
    'unevaluatedProperties', // JSON Schema draft
    'propertyNames',      // JSON Schema draft
    'dependentRequired',  // JSON Schema draft
    'dependentSchemas',   // JSON Schema draft
    // Schema composition
    'allOf',
    'oneOf',
    'anyOf',
    'not',
    'if',                 // JSON Schema draft
    'then',               // JSON Schema draft
    'else',               // JSON Schema draft
    // OpenAPI specific
    'discriminator',
    'xml',
    'externalDocs',
    'deprecated',
    // Additional JSON Schema keywords
    'contentEncoding',    // JSON Schema draft
    'contentMediaType',   // JSON Schema draft
    'contentSchema',      // JSON Schema draft
] as const;

// Response keys in preferred order
// Supports all versions with version-specific keys
export const RESPONSE_KEYS = [
    'description',
    'headers',
    'content',             // OpenAPI 3.0+
    'schema',              // Swagger 2.0
    'examples',            // Swagger 2.0
    'links',               // OpenAPI 3.0+
] as const;

// Security scheme keys in preferred order
// Supports all versions with version-specific keys
export const SECURITY_SCHEME_KEYS = [
    'type',
    'description',
    'name',
    'in',
    'scheme',
    'bearerFormat',
    'flows',               // OpenAPI 3.0+
    'openIdConnectUrl',
    // Swagger 2.0 specific
    'flow',                // Swagger 2.0
    'authorizationUrl',    // Swagger 2.0
    'tokenUrl',            // Swagger 2.0
    'scopes',              // Swagger 2.0
] as const;

// OAuth flow keys in preferred order
// OpenAPI 3.0+ OAuth flows
export const OAUTH_FLOW_KEYS = [
    'authorizationUrl',
    'tokenUrl',
    'refreshUrl',
    'scopes',
] as const;

// Server keys in preferred order
export const SERVER_KEYS = [
    'url',
    'description',
    'variables',
] as const;

// Server variable keys in preferred order
export const SERVER_VARIABLE_KEYS = [
    'enum',
    'default',
    'description',
] as const;

// Tag keys in preferred order
export const TAG_KEYS = [
    'name',
    'description',
    'externalDocs',
] as const;

// External docs keys in preferred order
export const EXTERNAL_DOCS_KEYS = [
    'description',
    'url',
] as const;

// Swagger 2.0 specific keys
export const SWAGGER_2_0_KEYS = [
    'swagger',
    'info',
    'host',
    'basePath',
    'schemes',
    'consumes',
    'produces',
    'paths',
    'definitions',
    'parameters',
    'responses',
    'securityDefinitions',
    'security',
    'tags',
    'externalDocs',
] as const;

// Webhook keys (OpenAPI 3.1+)
export const WEBHOOK_KEYS = [
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
