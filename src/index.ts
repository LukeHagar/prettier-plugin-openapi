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
  SWAGGER_2_0_KEYS,
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

// ============================================================================
// KEY ORDERING CONFIGURATION
// ============================================================================
// Customize the order of keys by modifying these arrays and maps




// ============================================================================
// CUSTOM EXTENSION CONFIGURATION
// ============================================================================
// Add your custom extensions here with their desired positions

// Base custom extensions for top-level OpenAPI keys
const BASE_CUSTOM_TOP_LEVEL_EXTENSIONS: Record<string, number> = {
    // Example: 'x-custom-field': 2, // Will be placed after 'info' (position 1)
    // Example: 'x-api-version': 0,  // Will be placed before 'openapi'
};

// Load vendor extensions
let vendorExtensions: any = {};

try {
    vendorExtensions = getVendorExtensions();
    console.log('Vendor extensions loaded successfully');
} catch (error) {
    console.warn('Failed to load vendor extensions:', error);
    vendorExtensions = {};
}

// Use base extensions as default
const CUSTOM_TOP_LEVEL_EXTENSIONS = BASE_CUSTOM_TOP_LEVEL_EXTENSIONS;

// Custom extensions for info section
const CUSTOM_INFO_EXTENSIONS: Record<string, number> = {
    // Example: 'x-api-id': 1,      // Will be placed after 'title' (position 0)
    // Example: 'x-version-info': 3, // Will be placed after 'version' (position 2)
};

// Custom extensions for components section
const CUSTOM_COMPONENTS_EXTENSIONS: Record<string, number> = {
    // Example: 'x-custom-schemas': 0, // Will be placed before 'schemas'
    // Example: 'x-api-metadata': 9,   // Will be placed after 'callbacks'
};

// Custom extensions for operation objects
const CUSTOM_OPERATION_EXTENSIONS: Record<string, number> = {
    // Example: 'x-rate-limit': 5,    // Will be placed after 'parameters' (position 4)
    // Example: 'x-custom-auth': 10,   // Will be placed after 'servers' (position 9)
};

// Custom extensions for parameter objects
const CUSTOM_PARAMETER_EXTENSIONS: Record<string, number> = {
    // Example: 'x-validation': 3,    // Will be placed after 'description' (position 2)
    // Example: 'x-custom-format': 11, // Will be placed after 'examples' (position 10)
};

// Custom extensions for schema objects
const CUSTOM_SCHEMA_EXTENSIONS: Record<string, number> = {
    // Example: 'x-custom-type': 0,   // Will be placed before 'type'
    // Example: 'x-validation-rules': 30, // Will be placed after 'deprecated' (position 29)
};

// Custom extensions for response objects
const CUSTOM_RESPONSE_EXTENSIONS: Record<string, number> = {
    // Example: 'x-response-time': 1,  // Will be placed after 'description' (position 0)
    // Example: 'x-cache-info': 4,     // Will be placed after 'links' (position 3)
};

// Custom extensions for security scheme objects
const CUSTOM_SECURITY_SCHEME_EXTENSIONS: Record<string, number> = {
    // Example: 'x-auth-provider': 1,  // Will be placed after 'type' (position 0)
    // Example: 'x-token-info': 7,     // Will be placed after 'openIdConnectUrl' (position 6)
};

// Custom extensions for server objects
const CUSTOM_SERVER_EXTENSIONS: Record<string, number> = {
    // Example: 'x-server-region': 1,  // Will be placed after 'url' (position 0)
    // Example: 'x-load-balancer': 3,   // Will be placed after 'variables' (position 2)
};

// Custom extensions for tag objects
const CUSTOM_TAG_EXTENSIONS: Record<string, number> = {
    // Example: 'x-tag-color': 1,      // Will be placed after 'name' (position 0)
    // Example: 'x-tag-priority': 3,   // Will be placed after 'externalDocs' (position 2)
};

// Custom extensions for external docs objects
const CUSTOM_EXTERNAL_DOCS_EXTENSIONS: Record<string, number> = {
    // Example: 'x-doc-version': 0,    // Will be placed before 'description'
    // Example: 'x-doc-language': 2,   // Will be placed after 'url' (position 1)
};

// Custom extensions for webhook objects (OpenAPI 3.1+)
const CUSTOM_WEBHOOK_EXTENSIONS: Record<string, number> = {
    // Example: 'x-webhook-secret': 5, // Will be placed after 'parameters' (position 4)
    // Example: 'x-webhook-retry': 10, // Will be placed after 'servers' (position 9)
};

// Custom extensions for Swagger 2.0 definitions
const CUSTOM_DEFINITIONS_EXTENSIONS: Record<string, number> = {
    // Example: 'x-model-version': 0,  // Will be placed before 'type'
    // Example: 'x-model-category': 30, // Will be placed after 'deprecated' (position 29)
};

// Custom extensions for Swagger 2.0 security definitions
const CUSTOM_SECURITY_DEFINITIONS_EXTENSIONS: Record<string, number> = {
    // Example: 'x-auth-provider': 1,  // Will be placed after 'type' (position 0)
    // Example: 'x-token-info': 7,     // Will be placed after 'scopes' (position 6)
};

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

// Map of custom extensions by context (using vendor extensions)
const CUSTOM_EXTENSIONS_MAP: Record<string, Record<string, number>> = {
    'top-level': { ...CUSTOM_TOP_LEVEL_EXTENSIONS, ...vendorExtensions['top-level'] },
    'info': { ...CUSTOM_INFO_EXTENSIONS, ...vendorExtensions['info'] },
    'components': { ...CUSTOM_COMPONENTS_EXTENSIONS, ...vendorExtensions['components'] },
    'operation': { ...CUSTOM_OPERATION_EXTENSIONS, ...vendorExtensions['operation'] },
    'parameter': { ...CUSTOM_PARAMETER_EXTENSIONS, ...vendorExtensions['parameter'] },
    'schema': { ...CUSTOM_SCHEMA_EXTENSIONS, ...vendorExtensions['schema'] },
    'response': { ...CUSTOM_RESPONSE_EXTENSIONS, ...vendorExtensions['response'] },
    'securityScheme': { ...CUSTOM_SECURITY_SCHEME_EXTENSIONS, ...vendorExtensions['securityScheme'] },
    'server': { ...CUSTOM_SERVER_EXTENSIONS, ...vendorExtensions['server'] },
    'tag': { ...CUSTOM_TAG_EXTENSIONS, ...vendorExtensions['tag'] },
    'externalDocs': { ...CUSTOM_EXTERNAL_DOCS_EXTENSIONS, ...vendorExtensions['externalDocs'] },
    'webhook': { ...CUSTOM_WEBHOOK_EXTENSIONS, ...vendorExtensions['webhook'] },
    'definitions': { ...CUSTOM_DEFINITIONS_EXTENSIONS, ...vendorExtensions['definitions'] },
    'securityDefinitions': { ...CUSTOM_SECURITY_DEFINITIONS_EXTENSIONS, ...vendorExtensions['securityDefinitions'] },
};

const plugin: Plugin = {
    languages: [
        {
            name: 'openapi-json',
            extensions: ['.openapi.json', '.swagger.json'],
            parsers: ['openapi-json-parser'],
        },
        {
            name: 'openapi-yaml',
            extensions: ['.openapi.yaml', '.openapi.yml', '.swagger.yaml', '.swagger.yml'],
            parsers: ['openapi-yaml-parser'],
        },
    ],
    parsers: {
        'openapi-json-parser': {
            parse: (text: string, options?: any): OpenAPINode => {
                try {
                    const parsed = JSON.parse(text);
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

    const sortedKeys = Object.keys(obj).sort((a, b) => {
        // Check for custom extensions first
        const aCustomPos = CUSTOM_TOP_LEVEL_EXTENSIONS[a];
        const bCustomPos = CUSTOM_TOP_LEVEL_EXTENSIONS[b];

        if (aCustomPos !== undefined && bCustomPos !== undefined) {
            return aCustomPos - bCustomPos;
        }

        if (aCustomPos !== undefined) {
            // Check if custom position is within standard keys range
            if (aCustomPos < TOP_LEVEL_KEYS.length) {
                return -1; // Custom key should come before standard keys
            }
        }

        if (bCustomPos !== undefined) {
            // Check if custom position is within standard keys range
            if (bCustomPos < TOP_LEVEL_KEYS.length) {
                return 1; // Custom key should come before standard keys
            }
        }

        const aIndex = TOP_LEVEL_KEYS.indexOf(a as any);
        const bIndex = TOP_LEVEL_KEYS.indexOf(b as any);

        // If both keys are in the order list, sort by their position
        if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
        }

        // If only one key is in the order list, prioritize it
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;

        // Handle custom extensions that are positioned after standard keys
        if (aCustomPos !== undefined) {
            return -1; // Custom extensions come after standard keys
        }
        if (bCustomPos !== undefined) {
            return 1; // Custom extensions come after standard keys
        }

        // Handle x- prefixed keys (custom extensions) vs unknown keys
        const aIsCustomExtension = a.startsWith('x-');
        const bIsCustomExtension = b.startsWith('x-');
        
        if (aIsCustomExtension && !bIsCustomExtension) {
            return -1; // Custom extensions come before unknown keys
        }
        if (!aIsCustomExtension && bIsCustomExtension) {
            return 1; // Unknown keys come after custom extensions
        }

        // For unknown keys (not in standard list or custom extensions), sort alphabetically at the end
        return a.localeCompare(b);
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

    const sortedKeys = Object.keys(obj).sort((a, b) => {
        // Get custom extensions for the current context
        const contextKey = getContextKey(path, obj);
        const customExtensions = CUSTOM_EXTENSIONS_MAP[contextKey] || {};
        const aCustomPos = customExtensions[a];
        const bCustomPos = customExtensions[b];

        // Handle custom extensions first
        if (aCustomPos !== undefined && bCustomPos !== undefined) {
            return aCustomPos - bCustomPos;
        }

        if (aCustomPos !== undefined) {
            // Check if custom position is within standard keys range
            const standardKeys = getStandardKeysForContext(contextKey);
            if (aCustomPos < standardKeys.length) {
                return -1; // Custom key should come before standard keys
            }
        }

        if (bCustomPos !== undefined) {
            // Check if custom position is within standard keys range
            const standardKeys = getStandardKeysForContext(contextKey);
            if (bCustomPos < standardKeys.length) {
                return 1; // Custom key should come before standard keys
            }
        }

        // Get the key ordering for the current path
        const currentPathOrder = KEY_ORDERING_MAP[path] || [];
        const aIndex = currentPathOrder.indexOf(a);
        const bIndex = currentPathOrder.indexOf(b);

        // If both keys are in the order list, sort by their position
        if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
        }

        // If only one key is in the order list, prioritize it
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;

        // Special handling for paths (sort by path pattern)
        if (path === 'paths') {
            return sortPathKeys(a, b);
        }

        // Special handling for response codes (sort numerically)
        if (path === 'responses') {
            return sortResponseCodes(a, b);
        }

        // Use context-based sorting
        if (contextKey === 'operation') {
            return sortOperationKeysWithExtensions(a, b, CUSTOM_OPERATION_EXTENSIONS);
        }

        if (contextKey === 'parameter') {
            return sortParameterKeysWithExtensions(a, b, CUSTOM_PARAMETER_EXTENSIONS);
        }

        if (contextKey === 'schema') {
            return sortSchemaKeysWithExtensions(a, b, CUSTOM_SCHEMA_EXTENSIONS);
        }

        if (contextKey === 'response') {
            return sortResponseKeysWithExtensions(a, b, CUSTOM_RESPONSE_EXTENSIONS);
        }

        if (contextKey === 'securityScheme') {
            return sortSecuritySchemeKeysWithExtensions(a, b, CUSTOM_SECURITY_SCHEME_EXTENSIONS);
        }

        if (contextKey === 'server') {
            return sortServerKeysWithExtensions(a, b, CUSTOM_SERVER_EXTENSIONS);
        }

        if (contextKey === 'tag') {
            return sortTagKeysWithExtensions(a, b, CUSTOM_TAG_EXTENSIONS);
        }

        if (contextKey === 'externalDocs') {
            return sortExternalDocsKeysWithExtensions(a, b, CUSTOM_EXTERNAL_DOCS_EXTENSIONS);
        }

        if (contextKey === 'webhook') {
            return sortWebhookKeysWithExtensions(a, b, CUSTOM_WEBHOOK_EXTENSIONS);
        }

        if (contextKey === 'definitions') {
            return sortDefinitionsKeysWithExtensions(a, b, CUSTOM_DEFINITIONS_EXTENSIONS);
        }

        if (contextKey === 'securityDefinitions') {
            return sortSecurityDefinitionsKeysWithExtensions(a, b, CUSTOM_SECURITY_DEFINITIONS_EXTENSIONS);
        }

        // Handle custom extensions that are positioned after standard keys
        if (aCustomPos !== undefined) {
            return -1; // Custom extensions come after standard keys
        }
        if (bCustomPos !== undefined) {
            return 1; // Custom extensions come after standard keys
        }

        // For unknown keys (not in standard list or custom extensions), sort alphabetically at the end
        return a.localeCompare(b);
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

// ============================================================================
// OBJECT TYPE DETECTION FUNCTIONS
// ============================================================================

function isOperationObject(obj: any): boolean {
    const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];
    return Object.keys(obj).some(key => httpMethods.includes(key.toLowerCase()));
}

function isParameterObject(obj: any): boolean {
    return obj && typeof obj === 'object' && 'name' in obj && 'in' in obj;
}

function isSchemaObject(obj: any): boolean {
    return obj && typeof obj === 'object' && ('type' in obj || 'properties' in obj || '$ref' in obj);
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

// ============================================================================
// SORTING FUNCTIONS USING CONFIGURATION ARRAYS
// ============================================================================

function sortOperationKeys(a: string, b: string): number {
    const aIndex = OPERATION_KEYS.indexOf(a as any);
    const bIndex = OPERATION_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.localeCompare(b);
}

function sortParameterKeys(a: string, b: string): number {
    const aIndex = PARAMETER_KEYS.indexOf(a as any);
    const bIndex = PARAMETER_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.localeCompare(b);
}

function sortSchemaKeys(a: string, b: string): number {
    const aIndex = SCHEMA_KEYS.indexOf(a as any);
    const bIndex = SCHEMA_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.localeCompare(b);
}

function sortResponseKeys(a: string, b: string): number {
    const aIndex = RESPONSE_KEYS.indexOf(a as any);
    const bIndex = RESPONSE_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.localeCompare(b);
}

function sortSecuritySchemeKeys(a: string, b: string): number {
    const aIndex = SECURITY_SCHEME_KEYS.indexOf(a as any);
    const bIndex = SECURITY_SCHEME_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.localeCompare(b);
}

function sortServerKeys(a: string, b: string): number {
    const aIndex = SERVER_KEYS.indexOf(a as any);
    const bIndex = SERVER_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.localeCompare(b);
}

function sortTagKeys(a: string, b: string): number {
    const aIndex = TAG_KEYS.indexOf(a as any);
    const bIndex = TAG_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.localeCompare(b);
}

function sortExternalDocsKeys(a: string, b: string): number {
    const aIndex = EXTERNAL_DOCS_KEYS.indexOf(a as any);
    const bIndex = EXTERNAL_DOCS_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.localeCompare(b);
}

// ============================================================================
// HELPER FUNCTIONS FOR CUSTOM EXTENSIONS
// ============================================================================

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
// SORTING FUNCTIONS WITH EXTENSIONS SUPPORT
// ============================================================================

function sortOperationKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    const aCustomPos = customExtensions[a];
    const bCustomPos = customExtensions[b];

    // Handle custom extensions
    if (aCustomPos !== undefined && bCustomPos !== undefined) {
        return aCustomPos - bCustomPos;
    }

    if (aCustomPos !== undefined) {
        if (aCustomPos < OPERATION_KEYS.length) return -1;
    }

    if (bCustomPos !== undefined) {
        if (bCustomPos < OPERATION_KEYS.length) return 1;
    }

    // Standard sorting
    const aIndex = OPERATION_KEYS.indexOf(a as any);
    const bIndex = OPERATION_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    // Handle custom extensions after standard keys
    if (aCustomPos !== undefined) return -1;
    if (bCustomPos !== undefined) return 1;

    return a.localeCompare(b);
}

function sortParameterKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    const aCustomPos = customExtensions[a];
    const bCustomPos = customExtensions[b];

    if (aCustomPos !== undefined && bCustomPos !== undefined) {
        return aCustomPos - bCustomPos;
    }

    if (aCustomPos !== undefined) {
        if (aCustomPos < PARAMETER_KEYS.length) return -1;
    }

    if (bCustomPos !== undefined) {
        if (bCustomPos < PARAMETER_KEYS.length) return 1;
    }

    const aIndex = PARAMETER_KEYS.indexOf(a as any);
    const bIndex = PARAMETER_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    if (aCustomPos !== undefined) return -1;
    if (bCustomPos !== undefined) return 1;

    return a.localeCompare(b);
}

function sortSchemaKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    const aCustomPos = customExtensions[a];
    const bCustomPos = customExtensions[b];

    if (aCustomPos !== undefined && bCustomPos !== undefined) {
        return aCustomPos - bCustomPos;
    }

    if (aCustomPos !== undefined) {
        if (aCustomPos < SCHEMA_KEYS.length) return -1;
    }

    if (bCustomPos !== undefined) {
        if (bCustomPos < SCHEMA_KEYS.length) return 1;
    }

    const aIndex = SCHEMA_KEYS.indexOf(a as any);
    const bIndex = SCHEMA_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    if (aCustomPos !== undefined) return -1;
    if (bCustomPos !== undefined) return 1;

    return a.localeCompare(b);
}

function sortResponseKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    const aCustomPos = customExtensions[a];
    const bCustomPos = customExtensions[b];

    if (aCustomPos !== undefined && bCustomPos !== undefined) {
        return aCustomPos - bCustomPos;
    }

    if (aCustomPos !== undefined) {
        if (aCustomPos < RESPONSE_KEYS.length) return -1;
    }

    if (bCustomPos !== undefined) {
        if (bCustomPos < RESPONSE_KEYS.length) return 1;
    }

    const aIndex = RESPONSE_KEYS.indexOf(a as any);
    const bIndex = RESPONSE_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    if (aCustomPos !== undefined) return -1;
    if (bCustomPos !== undefined) return 1;

    return a.localeCompare(b);
}

function sortSecuritySchemeKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    const aCustomPos = customExtensions[a];
    const bCustomPos = customExtensions[b];

    if (aCustomPos !== undefined && bCustomPos !== undefined) {
        return aCustomPos - bCustomPos;
    }

    if (aCustomPos !== undefined) {
        if (aCustomPos < SECURITY_SCHEME_KEYS.length) return -1;
    }

    if (bCustomPos !== undefined) {
        if (bCustomPos < SECURITY_SCHEME_KEYS.length) return 1;
    }

    const aIndex = SECURITY_SCHEME_KEYS.indexOf(a as any);
    const bIndex = SECURITY_SCHEME_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    if (aCustomPos !== undefined) return -1;
    if (bCustomPos !== undefined) return 1;

    return a.localeCompare(b);
}

function sortServerKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    const aCustomPos = customExtensions[a];
    const bCustomPos = customExtensions[b];

    if (aCustomPos !== undefined && bCustomPos !== undefined) {
        return aCustomPos - bCustomPos;
    }

    if (aCustomPos !== undefined) {
        if (aCustomPos < SERVER_KEYS.length) return -1;
    }

    if (bCustomPos !== undefined) {
        if (bCustomPos < SERVER_KEYS.length) return 1;
    }

    const aIndex = SERVER_KEYS.indexOf(a as any);
    const bIndex = SERVER_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    if (aCustomPos !== undefined) return -1;
    if (bCustomPos !== undefined) return 1;

    return a.localeCompare(b);
}

function sortTagKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    const aCustomPos = customExtensions[a];
    const bCustomPos = customExtensions[b];

    if (aCustomPos !== undefined && bCustomPos !== undefined) {
        return aCustomPos - bCustomPos;
    }

    if (aCustomPos !== undefined) {
        if (aCustomPos < TAG_KEYS.length) return -1;
    }

    if (bCustomPos !== undefined) {
        if (bCustomPos < TAG_KEYS.length) return 1;
    }

    const aIndex = TAG_KEYS.indexOf(a as any);
    const bIndex = TAG_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    if (aCustomPos !== undefined) return -1;
    if (bCustomPos !== undefined) return 1;

    return a.localeCompare(b);
}

function sortExternalDocsKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    const aCustomPos = customExtensions[a];
    const bCustomPos = customExtensions[b];

    if (aCustomPos !== undefined && bCustomPos !== undefined) {
        return aCustomPos - bCustomPos;
    }

    if (aCustomPos !== undefined) {
        if (aCustomPos < EXTERNAL_DOCS_KEYS.length) return -1;
    }

    if (bCustomPos !== undefined) {
        if (bCustomPos < EXTERNAL_DOCS_KEYS.length) return 1;
    }

    const aIndex = EXTERNAL_DOCS_KEYS.indexOf(a as any);
    const bIndex = EXTERNAL_DOCS_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    if (aCustomPos !== undefined) return -1;
    if (bCustomPos !== undefined) return 1;

    return a.localeCompare(b);
}

function sortWebhookKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    const aCustomPos = customExtensions[a];
    const bCustomPos = customExtensions[b];

    if (aCustomPos !== undefined && bCustomPos !== undefined) {
        return aCustomPos - bCustomPos;
    }

    if (aCustomPos !== undefined) {
        if (aCustomPos < WEBHOOK_KEYS.length) return -1;
    }

    if (bCustomPos !== undefined) {
        if (bCustomPos < WEBHOOK_KEYS.length) return 1;
    }

    const aIndex = WEBHOOK_KEYS.indexOf(a as any);
    const bIndex = WEBHOOK_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    if (aCustomPos !== undefined) return -1;
    if (bCustomPos !== undefined) return 1;

    return a.localeCompare(b);
}

function sortDefinitionsKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    const aCustomPos = customExtensions[a];
    const bCustomPos = customExtensions[b];

    if (aCustomPos !== undefined && bCustomPos !== undefined) {
        return aCustomPos - bCustomPos;
    }

    if (aCustomPos !== undefined) {
        if (aCustomPos < SCHEMA_KEYS.length) return -1;
    }

    if (bCustomPos !== undefined) {
        if (bCustomPos < SCHEMA_KEYS.length) return 1;
    }

    const aIndex = SCHEMA_KEYS.indexOf(a as any);
    const bIndex = SCHEMA_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    if (aCustomPos !== undefined) return -1;
    if (bCustomPos !== undefined) return 1;

    return a.localeCompare(b);
}

function sortSecurityDefinitionsKeysWithExtensions(a: string, b: string, customExtensions: Record<string, number>): number {
    const aCustomPos = customExtensions[a];
    const bCustomPos = customExtensions[b];

    if (aCustomPos !== undefined && bCustomPos !== undefined) {
        return aCustomPos - bCustomPos;
    }

    if (aCustomPos !== undefined) {
        if (aCustomPos < SECURITY_SCHEME_KEYS.length) return -1;
    }

    if (bCustomPos !== undefined) {
        if (bCustomPos < SECURITY_SCHEME_KEYS.length) return 1;
    }

    const aIndex = SECURITY_SCHEME_KEYS.indexOf(a as any);
    const bIndex = SECURITY_SCHEME_KEYS.indexOf(b as any);

    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    if (aCustomPos !== undefined) return -1;
    if (bCustomPos !== undefined) return 1;

    return a.localeCompare(b);
}

export default plugin;
