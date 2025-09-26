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
  type OAuthFlowKeys,
  type ContactKeys,
  type LicenseKeys,
  type ComponentsKeys,
  type ServerVariableKeys,
} from '../keys.js';
import { getVendorExtensions as loadVendorExtensions, type VendorModule } from './vendor-loader.js';

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
export function defineConfig(config: VendorModule): VendorModule {
  return config;
}

// Type definitions with hover documentation
export type TopLevelKeysType = typeof RootKeys[number];
export type InfoKeysType = typeof InfoKeys[number];
export type OperationKeysType = typeof OperationKeys[number];
export type ParameterKeysType = typeof ParameterKeys[number];
export type SchemaKeysType = typeof SchemaKeys[number];
export type ResponseKeysType = typeof ResponseKeys[number];
export type SecuritySchemeKeysType = typeof SecuritySchemeKeys[number];
export type ServerKeysType = typeof ServerKeys[number];
export type TagKeysType = typeof TagKeys[number];
export type ExternalDocsKeysType = typeof ExternalDocsKeys[number];
export type WebhookKeysType = typeof WebhookKeys[number];
export type OAuthFlowKeysType = typeof OAuthFlowKeys[number];
export type ContactKeysType = typeof ContactKeys[number];
export type LicenseKeysType = typeof LicenseKeys[number];
export type ComponentsKeysType = typeof ComponentsKeys[number];
export type ServerVariableKeysType = typeof ServerVariableKeys[number];

// Context-specific key types for better IntelliSense
export interface ContextKeys {
  'top-level': TopLevelKeysType;
  'info': InfoKeysType;
  'operation': OperationKeysType;
  'parameter': ParameterKeysType;
  'schema': SchemaKeysType;
  'response': ResponseKeysType;
  'securityScheme': SecuritySchemeKeysType;
  'server': ServerKeysType;
  'tag': TagKeysType;
  'externalDocs': ExternalDocsKeysType;
  'webhook': WebhookKeysType;
  'definitions': SchemaKeysType; // Definitions use schema keys
  'securityDefinitions': SecuritySchemeKeysType; // Security definitions use security scheme keys
}

// Helper function to get available keys for a context
export function getContextKeys<T extends keyof ContextKeys>(context: T): readonly string[] {
  switch (context) {
    case 'top-level': return RootKeys;
    case 'info': return InfoKeys;
    case 'operation': return OperationKeys;
    case 'parameter': return ParameterKeys;
    case 'schema': return SchemaKeys;
    case 'response': return ResponseKeys;
    case 'securityScheme': return SecuritySchemeKeys;
    case 'server': return ServerKeys;
    case 'tag': return TagKeys;
    case 'externalDocs': return ExternalDocsKeys;
    case 'webhook': return WebhookKeys;
    case 'definitions': return SchemaKeys;
    case 'securityDefinitions': return SecuritySchemeKeys;
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
export function getVendorExtensions(customVendorModules?: VendorModule[]): Record<string, Record<string, number>> {
  return loadVendorExtensions(customVendorModules);
}

