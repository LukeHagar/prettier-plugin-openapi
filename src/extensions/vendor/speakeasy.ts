/**
 * Speakeasy SDK Extensions
 * 
 * Speakeasy SDK extensions for OpenAPI formatting.
 * Website: https://speakeasyapi.dev
 */

import { defineVendorExtensions } from '../index';

// Function-based extensions with before/after helpers
export const extensions = defineVendorExtensions({
  'top-level': (before, after) => {
    return {
      'x-speakeasy-sdk': before('info'), // Before 'info'
      'x-speakeasy-auth': after('paths'), // After 'paths'
    };
  },
  'info': (before, after) => {
    return {
      'x-speakeasy-info': after('version'), // After 'version'
    };
  },
  'operation': (before, after) => {
    return {
      'x-speakeasy-retries': after('parameters'), // After 'parameters'
      'x-speakeasy-timeout': before('responses'), // Before 'responses'
      'x-speakeasy-cache': after('servers'), // After 'servers'
    };
  },
  'schema': (before, after) => {
    return {
      'x-speakeasy-validation': after('type'), // After 'type'
      'x-speakeasy-example': after('example'), // After 'example'
    };
  },
  'parameter': (before, after) => {
    return {
      'x-speakeasy-param': after('schema'), // After 'schema'
    };
  },
  'response': (before, after) => {
    return {
      'x-speakeasy-response': after('description'), // After 'description'
    };
  },
  'securityScheme': (before, after) => {
    return {
      'x-speakeasy-auth': after('type'), // After 'type'
    };
  },
  'server': (before, after) => {
    return {
      'x-speakeasy-server': after('url'), // After 'url'
    };
  },
  'tag': (before, after) => {
    return {
      'x-speakeasy-tag': after('name'), // After 'name'
    };
  },
  'externalDocs': (before, after) => {
    return {
      'x-speakeasy-docs': after('url'), // After 'url'
    };
  },
  'webhook': (before, after) => {
    return {
      'x-speakeasy-webhook': after('operationId'), // After 'operationId'
    };
  },
  'definitions': (before, after) => {
    return {
      'x-speakeasy-definition': after('type'), // After 'type'
    };
  },
  'securityDefinitions': (before, after) => {
    return {
      'x-speakeasy-security': after('type'), // After 'type'
    };
  }
});