import { Plugin } from 'prettier';
import * as yaml from 'js-yaml';
import { getVendorExtensions } from './extensions';

import {
  TOP_LEVEL_KEYS,
  INFO_KEYS,
  CONTACT_KEYS,
  LICENSE_KEYS,
  COMPONENTS_KEYS,
  OPERATION_KEYS,
  PARAMETER_KEYS,
  SCHEMA_KEYS,
  RESPONSE_KEYS,
  SECURITY_SCHEME_KEYS,
  OAUTH_FLOW_KEYS,
  SERVER_KEYS,
  SERVER_VARIABLE_KEYS,
  TAG_KEYS,
  EXTERNAL_DOCS_KEYS,
  WEBHOOK_KEYS
} from './keys';

// Type definitions for better type safety
interface OpenAPINode {
    type: 'openapi-json' | 'openapi-yaml';
    content: any;
    originalText: string;
}

interface PrettierPath {
    getValue(): OpenAPINode;
}

interface OpenAPIPluginOptions {
    tabWidth?: number;
    printWidth?: number;
}

// Load vendor extensions
let vendorExtensions: any = {};

try {
    vendorExtensions = getVendorExtensions();
    console.log('Vendor extensions loaded successfully');
} catch (error) {
    console.warn('Failed to load vendor extensions:', error);
    vendorExtensions = {};
}

// ============================================================================
// FILE DETECTION FUNCTIONS
// ============================================================================

/**
 * Detects if a file is an OpenAPI-related file based on content and structure
 */
function isOpenAPIFile(content: any, filePath?: string): boolean {
    if (!content || typeof content !== 'object') {
        return false;
    }

    // Check for root-level OpenAPI indicators
    if (content.openapi || content.swagger) {
        return true;
    }

    // Check for component-like structures
    if (content.components || content.definitions || content.parameters || content.responses || content.securityDefinitions) {
        return true;
    }

    // Check for path-like structures (operations)
    if (content.paths || isPathObject(content)) {
        return true;
    }

    // Check file path patterns for common OpenAPI file structures
    // Only accept files in OpenAPI-related directories
    if (filePath) {
        const path = filePath.toLowerCase();
        
        // Check for component directory patterns
        if (path.includes('/components/') || 
            path.includes('/schemas/') || 
            path.includes('/parameters/') || 
            path.includes('/responses/') || 
            path.includes('/requestbodies/') || 
            path.includes('/headers/') || 
            path.includes('/examples/') || 
            path.includes('/securityschemes/') || 
            path.includes('/links/') || 
            path.includes('/callbacks/') ||
            path.includes('/webhooks/') ||
            path.includes('/paths/')) {
            return true;
        }
    }

    // Check for schema-like structures (but be more strict)
    if (isSchemaObject(content)) {
        return true;
    }

    // Check for parameter-like structures
    if (isParameterObject(content)) {
        return true;
    }

    // Check for response-like structures
    if (isResponseObject(content)) {
        return true;
    }

    // Check for security scheme-like structures
    if (isSecuritySchemeObject(content)) {
        return true;
    }

    // Check for server-like structures
    if (isServerObject(content)) {
        return true;
    }

    // Check for tag-like structures
    if (isTagObject(content)) {
        return true;
    }

    // Check for external docs-like structures
    if (isExternalDocsObject(content)) {
        return true;
    }

    // Check for webhook-like structures
    if (isWebhookObject(content)) {
        return true;
    }

    return false;
}

/**
 * Detects if an object represents a path with operations
 */
function isPathObject(obj: any): boolean {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];
    return Object.keys(obj).some(key => httpMethods.includes(key.toLowerCase()));
}

// Map of path patterns to their key ordering
const KEY_ORDERING_MAP: Record<string, readonly string[]> = {
    'info': INFO_KEYS,
    'contact': CONTACT_KEYS,
    'license': LICENSE_KEYS,
    'components': COMPONENTS_KEYS,
    'schemas': [], // Schema properties sorted alphabetically
    'responses': [], // Response codes sorted numerically
    'parameters': [], // Parameters sorted alphabetically
    'securitySchemes': [], // Security schemes sorted alphabetically
    'paths': [], // Paths sorted by specificity
    'webhooks': [], // Webhooks sorted by specificity (OpenAPI 3.1+)
    'servers': SERVER_KEYS,
    'variables': SERVER_VARIABLE_KEYS,
    'tags': TAG_KEYS,
    'externalDocs': EXTERNAL_DOCS_KEYS,
    // Swagger 2.0 specific
    'definitions': [], // Definitions sorted alphabetically
    'securityDefinitions': [], // Security definitions sorted alphabetically
};

// Map for operation-level keys
const OPERATION_KEY_ORDERING_MAP: Record<string, readonly string[]> = {
    'operation': OPERATION_KEYS,
    'parameter': PARAMETER_KEYS,
    'schema': SCHEMA_KEYS,
    'response': RESPONSE_KEYS,
    'securityScheme': SECURITY_SCHEME_KEYS,
    'oauthFlow': OAUTH_FLOW_KEYS,
    'webhook': WEBHOOK_KEYS,
};

const plugin: Plugin = {
    languages: [
        {
            name: 'openapi-json',
            extensions: [
                '.openapi.json', '.swagger.json',
                // Support for component files
                '.json'
            ],
            parsers: ['openapi-json-parser'],
        },
        {
            name: 'openapi-yaml',
            extensions: [
                '.openapi.yaml', '.openapi.yml', 
                '.swagger.yaml', '.swagger.yml',
                // Support for component files
                '.yaml', '.yml'
            ],
            parsers: ['openapi-yaml-parser'],
        },
    ],
    parsers: {
        'openapi-json-parser': {
            parse: (text: string, options?: any): OpenAPINode => {
                try {
                    const parsed = JSON.parse(text);
                    
                    // Check if this is an OpenAPI file
                    if (!isOpenAPIFile(parsed, options?.filepath)) {
                        throw new Error('Not an OpenAPI file');
                    }
                    
                    return {
                        type: 'openapi-json',
                        content: parsed,
                        originalText: text,
                    };
                } catch (error) {
                    throw new Error(`Failed to parse OpenAPI JSON: ${error}`);
                }
            },
            astFormat: 'openapi-json-ast',
            locStart: (node: OpenAPINode) => 0,
            locEnd: (node: OpenAPINode) => node.originalText?.length || 0,
        },
        'openapi-yaml-parser': {
            parse: (text: string, options?: any): OpenAPINode => {
                try {
                    const parsed = yaml.load(text, {
                        schema: yaml.DEFAULT_SCHEMA,
                        onWarning: (warning) => {
                            // Handle YAML warnings if needed
                            console.warn('YAML parsing warning:', warning);
                        }
                    });
                    
                    // Check if this is an OpenAPI file
                    if (!isOpenAPIFile(parsed, options?.filepath)) {
                        throw new Error('Not an OpenAPI file');
                    }
                    
                    return {
                        type: 'openapi-yaml',
                        content: parsed,
                        originalText: text,
                    };
                } catch (error) {
                    throw new Error(`Failed to parse OpenAPI YAML: ${error}`);
                }
            },
            astFormat: 'openapi-yaml-ast',
            locStart: (node: OpenAPINode) => 0,
            locEnd: (node: OpenAPINode) => node.originalText?.length || 0,
        },
    },
    printers: {
        'openapi-json-ast': {
            print: (path: PrettierPath, options?: any, print?: any, ...rest: any[]): string => {
                const node = path.getValue();
                return formatOpenAPIJSON(node.content, options);
            },
        },
        'openapi-yaml-ast': {
            print: (path: PrettierPath, options?: any, print?: any, ...rest: any[]): string => {
                const node = path.getValue();
                return formatOpenAPIYAML(node.content, options);
            },
        },
    },
};

function formatOpenAPIJSON(content: any, options?: OpenAPIPluginOptions): string {
    // Sort keys for better organization
    const sortedContent = sortOpenAPIKeys(content);

    // Format with proper indentation
    return JSON.stringify(sortedContent, null, options?.tabWidth || 2);
}

function formatOpenAPIYAML(content: any, options?: OpenAPIPluginOptions): string {
    // Sort keys for better organization
    const sortedContent = sortOpenAPIKeys(content);

    // Format YAML with proper indentation and line breaks
    return yaml.dump(sortedContent, {
        indent: options?.tabWidth || 2,
        lineWidth: options?.printWidth || 80,
        noRefs: true,
        sortKeys: true,
        quotingType: '"',
        forceQuotes: false,
    });
}

function sortOpenAPIKeys(obj: any): any {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        return obj;
    }

    // Get vendor extensions for top-level
    const topLevelExtensions = vendorExtensions['top-level'] || {};

    const sortedKeys = Object.keys(obj).sort((a, b) => {
        // Use the unified sorting function
        return sortKeys(a, b, TOP_LEVEL_KEYS, topLevelExtensions);
    });

    const sortedObj: any = {};
    for (const key of sortedKeys) {
        sortedObj[key] = sortOpenAPIKeysEnhanced(obj[key], key);
    }

    return sortedObj;
}

// Enhanced sorting for nested OpenAPI structures
function sortOpenAPIKeysEnhanced(obj: any, path: string = ''): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    
    // Handle arrays by recursively sorting each element
    if (Array.isArray(obj)) {
        return obj.map((item, index) => sortOpenAPIKeysEnhanced(item, `${path}[${index}]`));
    }

    const contextKey = getContextKey(path, obj);
    const standardKeys = getStandardKeysForContext(contextKey);
    const customExtensions = vendorExtensions[contextKey] || {};

    const sortedKeys = Object.keys(obj).sort((a, b) => {
        // Special handling for paths (sort by path pattern)
        if (path === 'paths') {
            return sortPathKeys(a, b);
        }

        // Special handling for response codes (sort numerically)
        if (path === 'responses') {
            return sortResponseCodes(a, b);
        }

        // Use the unified sorting function for all other cases
        return sortKeys(a, b, standardKeys, customExtensions);
    });

    const sortedObj: any = {};
    for (const key of sortedKeys) {
        const newPath = path ? `${path}.${key}` : key;
        sortedObj[key] = sortOpenAPIKeysEnhanced(obj[key], newPath);
    }

    return sortedObj;
}

function sortPathKeys(a: string, b: string): number {
    // Sort paths by specificity (more specific paths first)
    const aSpecificity = (a.match(/\{/g) || []).length;
    const bSpecificity = (b.match(/\{/g) || []).length;

    if (aSpecificity !== bSpecificity) {
        return aSpecificity - bSpecificity;
    }

    return a.localeCompare(b);
}

function sortResponseCodes(a: string, b: string): number {
    // Sort response codes numerically
    const aNum = parseInt(a);
    const bNum = parseInt(b);

    if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
    }

    return a.localeCompare(b);
}

//#region Object type detection functions

function isOperationObject(obj: any): boolean {
    const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];
    return Object.keys(obj).some(key => httpMethods.includes(key.toLowerCase()));
}

function isParameterObject(obj: any): boolean {
    return obj && typeof obj === 'object' && 'name' in obj && 'in' in obj;
}

function isSchemaObject(obj: any): boolean {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    
    // Check for JSON Schema keywords - be very strict
    const hasSchemaKeywords = '$ref' in obj || 'allOf' in obj || 'oneOf' in obj || 'anyOf' in obj || 'not' in obj;
    const hasValidType = 'type' in obj && obj.type && ['object', 'array', 'string', 'number', 'integer', 'boolean', 'null'].includes(obj.type);
    
    // Only return true if we have clear schema indicators
    // Must have either schema keywords OR valid type with schema properties
    return hasSchemaKeywords || (hasValidType && ('properties' in obj || 'items' in obj || 'enum' in obj));
}

function isResponseObject(obj: any): boolean {
    return obj && typeof obj === 'object' && ('description' in obj || 'content' in obj);
}

function isSecuritySchemeObject(obj: any): boolean {
    return obj && typeof obj === 'object' && 'type' in obj &&
        ['apiKey', 'http', 'oauth2', 'openIdConnect'].includes(obj.type);
}

function isServerObject(obj: any): boolean {
    return obj && typeof obj === 'object' && 'url' in obj;
}

function isTagObject(obj: any): boolean {
    return obj && typeof obj === 'object' && 'name' in obj;
}

function isExternalDocsObject(obj: any): boolean {
    return obj && typeof obj === 'object' && 'url' in obj;
}

function isWebhookObject(obj: any): boolean {
    const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];
    return obj && typeof obj === 'object' && Object.keys(obj).some(key => httpMethods.includes(key.toLowerCase()));
}

//#endregion

//#region Unified sorting function
/**
 * Universal sorting function that handles all OpenAPI key sorting
 * @param a First key to compare
 * @param b Second key to compare
 * @param standardKeys Array of standard keys in order
 * @param customExtensions Custom extension positions
 * @returns Comparison result
 */
function sortKeys(a: string, b: string, standardKeys: readonly string[], customExtensions: Record<string, number> = {}): number {
    const aCustomPos = customExtensions[a];
    const bCustomPos = customExtensions[b];

    // Handle custom extensions first
    if (aCustomPos !== undefined && bCustomPos !== undefined) {
        return aCustomPos - bCustomPos;
    }

    if (aCustomPos !== undefined) {
        if (aCustomPos < standardKeys.length) {
            return -1; // Custom key should come before standard keys
        }
    }

    if (bCustomPos !== undefined) {
        if (bCustomPos < standardKeys.length) {
            return 1; // Custom key should come before standard keys
        }
    }

    // Standard sorting
    const aIndex = standardKeys.indexOf(a);
    const bIndex = standardKeys.indexOf(b);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    // Handle custom extensions after standard keys
    if (aCustomPos !== undefined) return -1;
    if (bCustomPos !== undefined) return 1;

    // For unknown keys, sort alphabetically at the end
    return a.localeCompare(b);
}
//#endregion

//#region Helper functions for custom extensions

function getContextKey(path: string, obj: any): string {
    // Determine the context based on path and object properties
    if (path === 'info') return 'info';
    if (path === 'components') return 'components';
    if (path === 'servers' || path.startsWith('servers[')) return 'server';
    if (path === 'tags' || path.startsWith('tags[')) return 'tag';
    if (path === 'externalDocs') return 'externalDocs';
    if (path === 'webhooks') return 'webhook';
    if (path === 'definitions') return 'definitions';
    if (path === 'securityDefinitions') return 'securityDefinitions';
    
    // Check if this is a path operation (e.g., "paths./users.get")
    if (path.includes('.') && path.split('.').length >= 3) {
        const pathParts = path.split('.');
        const lastPart = pathParts[pathParts.length - 1];
        const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];
        if (httpMethods.includes(lastPart.toLowerCase())) {
            return 'operation';
        }
    }

    // Handle nested paths for components
    if (path.startsWith('components.')) {
        if (path.includes('schemas.')) return 'schema';
        if (path.includes('parameters.')) return 'parameter';
        if (path.includes('responses.')) return 'response';
        if (path.includes('securitySchemes.')) return 'securityScheme';
    }

    // Handle nested paths for Swagger 2.0
    if (path.startsWith('definitions.')) return 'definitions';
    if (path.startsWith('securityDefinitions.')) return 'securityDefinitions';

    // Handle nested paths for operations (parameters, responses, etc.)
    if (path.includes('.parameters.') && path.split('.').length > 3) return 'parameter';
    if (path.includes('.responses.') && path.split('.').length > 3) return 'response';

    // Check object types as fallback
    if (isOperationObject(obj)) return 'operation';
    if (isParameterObject(obj)) return 'parameter';
    if (isSchemaObject(obj)) return 'schema';
    if (isResponseObject(obj)) return 'response';
    if (isSecuritySchemeObject(obj)) return 'securityScheme';
    if (isServerObject(obj)) return 'server';
    if (isTagObject(obj)) return 'tag';
    if (isExternalDocsObject(obj)) return 'externalDocs';
    if (isWebhookObject(obj)) return 'webhook';

    return 'top-level';
}

function getStandardKeysForContext(contextKey: string): readonly string[] {
    switch (contextKey) {
        case 'info': return INFO_KEYS;
        case 'components': return COMPONENTS_KEYS;
        case 'operation': return OPERATION_KEYS;
        case 'parameter': return PARAMETER_KEYS;
        case 'schema': return SCHEMA_KEYS;
        case 'response': return RESPONSE_KEYS;
        case 'securityScheme': return SECURITY_SCHEME_KEYS;
        case 'server': return SERVER_KEYS;
        case 'tag': return TAG_KEYS;
        case 'externalDocs': return EXTERNAL_DOCS_KEYS;
        case 'webhook': return WEBHOOK_KEYS;
        case 'definitions': return SCHEMA_KEYS; // Definitions use schema keys
        case 'securityDefinitions': return SECURITY_SCHEME_KEYS; // Security definitions use security scheme keys
        default: return TOP_LEVEL_KEYS;
    }
}

// ============================================================================
// CONTEXT-SPECIFIC SORTING FUNCTIONS (using unified sortKeys)
// ============================================================================

function sortOperationKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    return sortKeys(a, b, OPERATION_KEYS, customExtensions);
}

function sortParameterKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    return sortKeys(a, b, PARAMETER_KEYS, customExtensions);
}

function sortSchemaKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    return sortKeys(a, b, SCHEMA_KEYS, customExtensions);
}

function sortResponseKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    return sortKeys(a, b, RESPONSE_KEYS, customExtensions);
}

function sortSecuritySchemeKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    return sortKeys(a, b, SECURITY_SCHEME_KEYS, customExtensions);
}

function sortServerKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    return sortKeys(a, b, SERVER_KEYS, customExtensions);
}

function sortTagKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    return sortKeys(a, b, TAG_KEYS, customExtensions);
}

function sortExternalDocsKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    return sortKeys(a, b, EXTERNAL_DOCS_KEYS, customExtensions);
}

function sortWebhookKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    return sortKeys(a, b, WEBHOOK_KEYS, customExtensions);
}

function sortDefinitionsKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    return sortKeys(a, b, SCHEMA_KEYS, customExtensions);
}

function sortSecurityDefinitionsKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    return sortKeys(a, b, SECURITY_SCHEME_KEYS, customExtensions);
}

export default plugin;
