/**
 * Speakeasy SDK Extensions
 * 
 * Speakeasy SDK extensions for OpenAPI formatting.
 * Website: https://speakeasyapi.dev
 */

import { defineVendorExtensions } from '../index';

// Function-based extensions with before/after helpers
export const extensions = {
  'top-level': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-speakeasy-sdk': before('info'), // Before 'info'
      'x-speakeasy-auth': after('paths'), // After 'paths'
    };
  },
  'info': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-speakeasy-info': after('version'), // After 'version'
    };
  },
  'operation': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-speakeasy-retries': after('parameters'), // After 'parameters'
      'x-speakeasy-timeout': before('responses'), // Before 'responses'
      'x-speakeasy-cache': after('servers'), // After 'servers'
    };
  },
  'schema': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-speakeasy-validation': after('type'), // After 'type'
      'x-speakeasy-example': after('example'), // After 'example'
    };
  },
  'parameter': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-speakeasy-param': after('schema'), // After 'schema'
    };
  },
  'response': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-speakeasy-response': after('description'), // After 'description'
    };
  },
  'securityScheme': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-speakeasy-auth': after('type'), // After 'type'
    };
  },
  'server': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-speakeasy-server': after('url'), // After 'url'
    };
  },
  'tag': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-speakeasy-tag': after('name'), // After 'name'
    };
  },
  'externalDocs': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-speakeasy-docs': after('url'), // After 'url'
    };
  },
  'webhook': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-speakeasy-webhook': after('operationId'), // After 'operationId'
    };
  },
  'definitions': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-speakeasy-definition': after('type'), // After 'type'
    };
  },
  'securityDefinitions': (before: (key: string) => number, after: (key: string) => number) => {
    return {
      'x-speakeasy-security': after('type'), // After 'type'
    };
  }
};