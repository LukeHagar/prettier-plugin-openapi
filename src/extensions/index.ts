/**
 * Vendor Extension System
 * 
 * Simple system for vendors to contribute custom extensions.
 * Vendors just add their TS files to this folder and export their extensions.
 */

// Import key arrays for type generation
import {
  TOP_LEVEL_KEYS,
  INFO_KEYS,
  OPERATION_KEYS,
  PARAMETER_KEYS,
  SCHEMA_KEYS,
  RESPONSE_KEYS,
  SECURITY_SCHEME_KEYS,
  SERVER_KEYS,
  TAG_KEYS,
  EXTERNAL_DOCS_KEYS,
  WEBHOOK_KEYS,
  OAUTH_FLOW_KEYS,
  CONTACT_KEYS,
  LICENSE_KEYS,
  COMPONENTS_KEYS,
  SERVER_VARIABLE_KEYS,
  SWAGGER_2_0_KEYS
} from '../keys';
import { getVendorExtensions as loadVendorExtensions } from './vendor-loader';

export interface VendorExtensions {
  [context: string]: (
    /**
     * Returns the position before the given key in the context.
     * @param {string} key - The key to position before.
     * @returns {number} The position index.
     */
    before: (key: string) => number,
    /**
     * Returns the position after the given key in the context.
     * @param {string} key - The key to position after.
     * @returns {number} The position index.
     */
    after: (key: string) => number
  ) => {
    /**
     * The extension key and its position index.
     * @type {number}
     */
    [extensionKey: string]: number;
  };
}

// Helper function similar to Vite's defineConfig
export function defineVendorExtensions(config: VendorExtensions): VendorExtensions {
  return config;
}

// Type definitions with hover documentation
export type TopLevelKeys = typeof TOP_LEVEL_KEYS[number];
export type InfoKeys = typeof INFO_KEYS[number];
export type OperationKeys = typeof OPERATION_KEYS[number];
export type ParameterKeys = typeof PARAMETER_KEYS[number];
export type SchemaKeys = typeof SCHEMA_KEYS[number];
export type ResponseKeys = typeof RESPONSE_KEYS[number];
export type SecuritySchemeKeys = typeof SECURITY_SCHEME_KEYS[number];
export type ServerKeys = typeof SERVER_KEYS[number];
export type TagKeys = typeof TAG_KEYS[number];
export type ExternalDocsKeys = typeof EXTERNAL_DOCS_KEYS[number];
export type WebhookKeys = typeof WEBHOOK_KEYS[number];
export type OAuthFlowKeys = typeof OAUTH_FLOW_KEYS[number];
export type ContactKeys = typeof CONTACT_KEYS[number];
export type LicenseKeys = typeof LICENSE_KEYS[number];
export type ComponentsKeys = typeof COMPONENTS_KEYS[number];
export type ServerVariableKeys = typeof SERVER_VARIABLE_KEYS[number];
export type Swagger20Keys = typeof SWAGGER_2_0_KEYS[number];

// Context-specific key types for better IntelliSense
export interface ContextKeys {
  'top-level': TopLevelKeys;
  'info': InfoKeys;
  'operation': OperationKeys;
  'parameter': ParameterKeys;
  'schema': SchemaKeys;
  'response': ResponseKeys;
  'securityScheme': SecuritySchemeKeys;
  'server': ServerKeys;
  'tag': TagKeys;
  'externalDocs': ExternalDocsKeys;
  'webhook': WebhookKeys;
  'definitions': SchemaKeys; // Definitions use schema keys
  'securityDefinitions': SecuritySchemeKeys; // Security definitions use security scheme keys
}

// Helper function to get available keys for a context
export function getContextKeys<T extends keyof ContextKeys>(context: T): readonly string[] {
  switch (context) {
    case 'top-level': return TOP_LEVEL_KEYS;
    case 'info': return INFO_KEYS;
    case 'operation': return OPERATION_KEYS;
    case 'parameter': return PARAMETER_KEYS;
    case 'schema': return SCHEMA_KEYS;
    case 'response': return RESPONSE_KEYS;
    case 'securityScheme': return SECURITY_SCHEME_KEYS;
    case 'server': return SERVER_KEYS;
    case 'tag': return TAG_KEYS;
    case 'externalDocs': return EXTERNAL_DOCS_KEYS;
    case 'webhook': return WEBHOOK_KEYS;
    case 'definitions': return SCHEMA_KEYS;
    case 'securityDefinitions': return SECURITY_SCHEME_KEYS;
    default: return [];
  }
}

// Helper function to get key position in the standard ordering
export function getKeyPosition<T extends keyof ContextKeys>(context: T, key: string): number {
  const keys = getContextKeys(context);
  return keys.indexOf(key);
}

// Helper functions for easy positioning
export function before<T extends keyof ContextKeys>(context: T, key: string): number {
  const position = getKeyPosition(context, key);
  return position === -1 ? 0 : position;
}

export function after<T extends keyof ContextKeys>(context: T, key: string): number {
  const position = getKeyPosition(context, key);
  return position === -1 ? 0 : position + 1;
}


// Dynamic vendor loading - loads all vendor files automatically
export function getVendorExtensions(): Record<string, Record<string, number>> {
  return loadVendorExtensions();
}

