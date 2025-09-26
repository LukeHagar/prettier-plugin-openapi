/**
 * Vendor Extension System
 * 
 * Simple system for vendors to contribute custom extensions.
 * Vendors just add their TS files to this folder and export their extensions.
 */

// Import key arrays for type generation
import {
  RootKeys,
  InfoKeys,
  OperationKeys,
  ParameterKeys,
  SchemaKeys,
  ResponseKeys,
  SecuritySchemeKeys,
  ServerKeys,
  TagKeys,
  ExternalDocsKeys,
  WebhookKeys,
  OAuthFlowKeys,
  ContactKeys,
  LicenseKeys,
  ComponentsKeys,
  ServerVariableKeys,
} from '../keys.js';
import { getVendorExtensions, type VendorModule } from './vendor-loader.js';

/**
 * Type-safe context-specific extension functions
 * 
 * This type provides IntelliSense for the `before` and `after` function parameters,
 * ensuring only valid OpenAPI keys can be used for positioning extensions.
 * 
 * @template T - The OpenAPI context (e.g., 'top-level', 'info', 'operation', etc.)
 */
export type ContextExtensionFunction<T extends keyof typeof KeyMap> = (
  /**
   * Returns the position before the given key in the context.
   * @param key - The key to position before (must be a valid key for this context).
   * @returns The position index.
   */
  before: (key: typeof KeyMap[T][number]) => number,
  /**
   * Returns the position after the given key in the context.
   * @param key - The key to position after (must be a valid key for this context).
   * @returns The position index.
   */
  after: (key: typeof KeyMap[T][number]) => number
) => {
  /**
   * The extension key and its position index.
   * Extension keys should start with 'x-' to follow OpenAPI vendor extension conventions.
   */
  [extensionKey: string]: number;
};

/**
 * Type-safe vendor extensions interface
 * 
 * This interface provides IntelliSense for all OpenAPI contexts and their
 * corresponding valid keys. Each context function receives type-safe `before`
 * and `after` parameters that only accept valid OpenAPI keys for that context.
 * 
 * @example
 * ```typescript
 * const extensions: VendorExtensions = {
 *   'top-level': (before, after) => {
 *     // IntelliSense shows: 'swagger', 'openapi', 'info', 'paths', etc.
 *     return {
 *       'x-my-extension': before('info'),
 *       'x-my-config': after('paths')
 *     };
 *   },
 *   'operation': (before, after) => {
 *     // IntelliSense shows: 'summary', 'operationId', 'parameters', 'responses', etc.
 *     return {
 *       'x-my-retries': after('parameters'),
 *       'x-my-timeout': before('responses')
 *     };
 *   }
 * };
 * ```
 */
export interface VendorExtensions {
  /** Root OpenAPI document extensions 
   * 
   * Available keys:
   * - `swagger`
   * - `openapi`
   * - `jsonSchemaDialect`
   * - `info`
   * - `externalDocs`
   * - `schemes`
   * - `host`
   * - `basePath`
   * - `consumes`
   * - `produces`
   * - `servers`
   * - `security`
   * - `tags`
   * - `paths`
   * - `webhooks`
   * - `components`
   * - `definitions`
   * - `parameters`
   * - `responses`
   * - `securityDefinitions`
   * 
   * @example
   * ```typescript
   * 'top-level': (before, after) => {
   *   return {
   *     'x-my-extension': before('info'),
   *     'x-my-config': after('paths')
   *   };
   * }
   * ```
   */
  'top-level'?: ContextExtensionFunction<'top-level'>;
  /** API information section extensions
   * 
   * Available keys:
   * - `title`
   * - `version`
   * - `summary`
   * - `description`
   * - `termsOfService`
   * - `contact`
   * - `license`
   * 
   * @example
   * ```typescript
   * 'info': (before, after) => {
   *   return {
   *     'x-my-extension': before('version'),
   *     'x-my-config': after('description')
   *   };
   * }
   * ```
   */
  'info'?: ContextExtensionFunction<'info'>;
  /** HTTP operations (GET, POST, etc.) extensions
   * 
   * Available keys:
   * - `summary`
   * - `operationId`
   * - `description`
   * - `externalDocs`
   * - `tags`
   * - `deprecated`
   * - `security`
   * - `servers`
   * - `consumes`
   * - `produces`
   * - `parameters`
   * - `requestBody`
   * - `responses`
   * - `callbacks`
   * - `schemes`
   * 
   * @example
   * ```typescript
   * 'operation': (before, after) => {
   *   return {
   *     'x-my-extension': before('parameters'),
   *     'x-my-config': after('responses')
   *   };
   * }
   * ```
   */
  'operation'?: ContextExtensionFunction<'operation'>;
  /** Operation parameters extensions
   * 
   * Available keys:
   * - `name`
   * - `description`
   * - `in`
   * - `required`
   * - `deprecated`
   * - `allowEmptyValue`
   * - `style`
   * - `explode`
   * - `allowReserved`
   * - `schema`
   * - `content`
   * - `type`
   * - `format`
   * - `items`
   * - `collectionFormat`
   * - `default`
   * - `minimum`
   * - `exclusiveMinimum`
   * - `multipleOf`
   * - `maximum`
   * - `exclusiveMaximum`
   * - `pattern`
   * - `minLength`
   * - `maxLength`
   * - `minItems`
   * - `maxItems`
   * - `uniqueItems`
   * - `enum`
   * - `example`
   * - `examples`
   * 
   * @example
   * ```typescript
   * 'parameter': (before, after) => {
   *   return {
   *     'x-my-extension': before('name'),
   *     'x-my-config': after('description')
   *   };
   * }
   * ```
   */
  'parameter'?: ContextExtensionFunction<'parameter'>;
  /** Data schemas extensions
   * 
   * Available keys:
   * - `$ref`
   * - `$id`
   * - `$schema`
   * - `$vocabulary`
   * - `$anchor`
   * - `$dynamicAnchor`
   * - `$dynamicRef`
   * - `$comment`
   * - `$defs`
   * - `$recursiveAnchor`
   * - `$recursiveRef`
   * - `title`
   * - `description`
   * - `externalDocs`
   * - `deprecated`
   * - `type`
   * - `format`
   * - `contentSchema`
   * - `contentMediaType`
   * - `contentEncoding`
   * - `nullable`
   * - `const`
   * - `enum`
   * - `default`
   * - `readOnly`
   * - `writeOnly`
   * - `example`
   * - `examples`
   * - `minimum`
   * - `exclusiveMinimum`
   * - `multipleOf`
   * - `maximum`
   * - `exclusiveMaximum`
   * - `pattern`
   * - `minLength`
   * - `maxLength`
   * - `uniqueItems`
   * - `minItems`
   * - `maxItems`
   * - `items`
   * - `prefixItems`
   * - `contains`
   * - `minContains`
   * - `maxContains`
   * - `unevaluatedItems`
   * - `minProperties`
   * - `maxProperties`
   * - `patternProperties`
   * - `additionalProperties`
   * - `properties`
   * - `required`
   * - `unevaluatedProperties`
   * - `propertyNames`
   * - `dependentRequired`
   * - `dependentSchemas`
   * - `discriminator`
   * - `allOf`
   * - `anyOf`
   * - `oneOf`
   * - `not`
   * - `if`
   * - `then`
   * - `else`
   * - `xml`
   * 
   * @example
   * ```typescript
   * 'schema': (before, after) => {
   *   return {
   *     'x-my-extension': before('type'),
   *     'x-my-config': after('example')
   *   };
   * }
   * ```
   */
  'schema'?: ContextExtensionFunction<'schema'>;
  /** Operation responses extensions
   * 
   * Available keys:
   * - `description`
   * - `headers`
   * - `schema`
   * - `content`
   * - `examples`
   * - `links`
   * 
   * @example
   * ```typescript
   * 'response': (before, after) => {
   *   return {
   *     'x-my-extension': before('description'),
   *     'x-my-config': after('content')
   *   };
   * }
   * ```
   */
  'response'?: ContextExtensionFunction<'response'>;
  /** Security schemes extensions
   * 
   * Available keys:
   * - `name`
   * - `description`
   * - `type`
   * - `in`
   * - `scheme`
   * - `bearerFormat`
   * - `openIdConnectUrl`
   * - `flows`
   * - `flow`
   * - `authorizationUrl`
   * - `tokenUrl`
   * - `scopes`
   * 
   * @example
   * ```typescript
   * 'securityScheme': (before, after) => {
   *   return {
   *     'x-my-extension': before('type'),
   *     'x-my-config': after('description')
   *   };
   * }
   * ```
   */
  'securityScheme'?: ContextExtensionFunction<'securityScheme'>;
  /** Server definitions extensions
   * 
   * Available keys:
   * - `name`
   * - `description`
   * - `url`
   * - `variables`
   * 
   * @example
   * ```typescript
   * 'server': (before, after) => {
   *   return {
   *     'x-my-extension': before('url'),
   *     'x-my-config': after('description')
   *   };
   * }
   * ```
   */
  'server'?: ContextExtensionFunction<'server'>;
  /** API tags extensions
   * 
   * Available keys:
   * - `name`
   * - `description`
   * - `externalDocs`
   * 
   * @example
   * ```typescript
   * 'tag': (before, after) => {
   *   return {
   *     'x-my-extension': before('name'),
   *     'x-my-config': after('description')
   *   };
   * }
   * ```
   */
  'tag'?: ContextExtensionFunction<'tag'>;
  /** External documentation extensions
   * 
   * Available keys:
   * - `description`
   * - `url`
   * 
   * @example
   * ```typescript
   * 'externalDocs': (before, after) => {
   *   return {
   *     'x-my-extension': before('url'),
   *     'x-my-config': after('description')
   *   };
   * }
   * ```
   */
  'externalDocs'?: ContextExtensionFunction<'externalDocs'>;
  /** Webhook definitions extensions
   * 
   * Available keys:
   * - `summary`
   * - `operationId`
   * - `description`
   * - `deprecated`
   * - `tags`
   * - `security`
   * - `servers`
   * - `parameters`
   * - `requestBody`
   * - `responses`
   * - `callbacks`
   * 
   * @example
   * ```typescript
   * 'webhook': (before, after) => {
   *   return {
   *     'x-my-extension': before('summary'),
   *     'x-my-config': after('operationId')
   *   };
   * }
   * ```
   */
  'webhook'?: ContextExtensionFunction<'webhook'>;
  /** Swagger 2.0 definitions extensions
   * 
   * Available keys: (Same as schema keys)
   * - `$ref`
   * - `$id`
   * - `$schema`
   * - `$vocabulary`
   * - `$anchor`
   * - `$dynamicAnchor`
   * - `$dynamicRef`
   * - `$comment`
   * - `$defs`
   * - `$recursiveAnchor`
   * - `$recursiveRef`
   * - `title`
   * - `description`
   * - `externalDocs`
   * - `deprecated`
   * - `type`
   * - `format`
   * - `contentSchema`
   * - `contentMediaType`
   * - `contentEncoding`
   * - `nullable`
   * - `const`
   * - `enum`
   * - `default`
   * - `readOnly`
   * - `writeOnly`
   * - `example`
   * - `examples`
   * - `minimum`
   * - `exclusiveMinimum`
   * - `multipleOf`
   * - `maximum`
   * - `exclusiveMaximum`
   * - `pattern`
   * - `minLength`
   * - `maxLength`
   * - `uniqueItems`
   * - `minItems`
   * - `maxItems`
   * - `items`
   * - `prefixItems`
   * - `contains`
   * - `minContains`
   * - `maxContains`
   * - `unevaluatedItems`
   * - `minProperties`
   * - `maxProperties`
   * - `patternProperties`
   * - `additionalProperties`
   * - `properties`
   * - `required`
   * - `unevaluatedProperties`
   * - `propertyNames`
   * - `dependentRequired`
   * - `dependentSchemas`
   * - `discriminator`
   * - `allOf`
   * - `anyOf`
   * - `oneOf`
   * - `not`
   * - `if`
   * - `then`
   * - `else`
   * - `xml`
   * 
   * @example
   * ```typescript
   * 'definitions': (before, after) => {
   *   return {
   *     'x-my-extension': before('title'),
   *     'x-my-config': after('description')
   *   };
   * }
   * ```
   */
  'definitions'?: ContextExtensionFunction<'definitions'>;
  /** Swagger 2.0 security definitions extensions
   * 
   * Available keys: (Same as security scheme keys)
   * - `name`
   * - `description`
   * - `type`
   * - `in`
   * - `scheme`
   * - `bearerFormat`
   * - `openIdConnectUrl`
   * - `flows`
   * - `flow`
   * - `authorizationUrl`
   * - `tokenUrl`
   * - `scopes`
   * 
   * @example
   * ```typescript
   * 'securityDefinitions': (before, after) => {
   *   return {
   *     'x-my-extension': before('type'),
   *     'x-my-config': after('description')
   *   };
   * }
   * ```
   */
  'securityDefinitions'?: ContextExtensionFunction<'securityDefinitions'>;
}

/**
 * Helper function similar to Vite's defineConfig
 * 
 * Provides type safety and IntelliSense for vendor module configuration.
 * 
 * @param config - The vendor module configuration
 * @returns The same configuration with full type safety
 */
export function defineConfig(config: VendorModule): VendorModule {
  return config;
}

/**
 * Helper function to create type-safe context extensions
 * 
 * This function creates a type-safe extension configuration for a specific context.
 * 
 * @template T - The OpenAPI context
 * @param context - The context name
 * @param extensions - Function that returns extension positions
 * @returns Type-safe context extensions
 */
export function createContextExtensions<T extends keyof typeof KeyMap>(
  context: T,
  extensions: (before: (key: typeof KeyMap[T][number]) => number, after: (key: typeof KeyMap[T][number]) => number) => Record<string, number>
): { [K in T]: ContextExtensionFunction<K> } {
  return { [context]: extensions } as any;
}

/**
 * Type for valid OpenAPI contexts with documentation
 * 
 * This type represents all valid OpenAPI contexts where extensions can be placed.
 */
export type OpenAPIContext = keyof typeof KeyMap;

/**
 * Helper type for extension key validation (should start with 'x-')
 * 
 * OpenAPI vendor extensions must start with 'x-' to follow the specification.
 */
export type ExtensionKey = `x-${string}`;

/**
 * Helper function to validate extension keys
 * 
 * Checks if a key follows the OpenAPI vendor extension naming convention.
 * 
 * @param key - The key to validate
 * @returns True if the key is a valid extension key
 */
export function isValidExtensionKey(key: string): key is ExtensionKey {
  return key.startsWith('x-');
}

/**
 * Enhanced before/after functions with better IntelliSense
 * 
 * Creates a set of helper functions for a specific context with additional
 * utilities for key validation and discovery.
 * 
 * @template T - The OpenAPI context
 * @param context - The context name
 * @returns Object with type-safe positioning functions and utilities
 */
export function createPositionHelpers<T extends keyof typeof KeyMap>(context: T) {
  return {
    before: (key: typeof KeyMap[T][number]) => before(context, key),
    after: (key: typeof KeyMap[T][number]) => after(context, key),
    // Helper to get all available keys for this context
    getAvailableKeys: () => getContextKeys<T>(context),
    // Helper to validate if a key exists in this context
    isValidKey: (key: typeof KeyMap[T][number]): key is typeof KeyMap[T][number] => getContextKeys<T>(context).includes(key)
  };
}

export const KeyMap = {
  'top-level': RootKeys,
  'info': InfoKeys,
  'operation': OperationKeys,
  'parameter': ParameterKeys,
  'schema': SchemaKeys,
  'response': ResponseKeys,
  'securityScheme': SecuritySchemeKeys,
  'server': ServerKeys,
  'tag': TagKeys,
  'externalDocs': ExternalDocsKeys,
  'webhook': WebhookKeys,
  'definitions': SchemaKeys,
  'securityDefinitions': SecuritySchemeKeys,
}

// Helper function to get available keys for a context
export function getContextKeys<T extends keyof typeof KeyMap>(context: T): readonly typeof KeyMap[T][number][] {
  return KeyMap[context];
}

// Helper function to get key position in the standard ordering
export function getKeyPosition<T extends keyof typeof KeyMap>(context: T, key: typeof KeyMap[T][number]): number {
  const keys = getContextKeys<T>(context);
  return keys.indexOf(key);
}

// Helper functions for easy positioning
export function before<T extends keyof typeof KeyMap>(context: T, key: typeof KeyMap[T][number]): number {
  const position = getKeyPosition(context, key);
  return position === -1 ? 0 : position;
}

export function after<T extends keyof typeof KeyMap>(context: T, key: typeof KeyMap[T][number]): number {
  const position = getKeyPosition(context, key);
  return position === -1 ? 0 : position + 1;
}

