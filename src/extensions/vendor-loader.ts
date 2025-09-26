/**
 * Vendor Loader
 * 
 * Loads vendor extensions using static imports for ES module compatibility.
 */

import { before, after, type ContextKeys } from './index.js';

// Import vendor extensions statically
import { speakeasy } from './vendor/speakeasy.js';
import { postman } from './vendor/postman.js';
import { redoc } from './vendor/redoc.js';

// Import vendor extensions statically
const vendorModules = [
  // Update this list as new vendors are added
  speakeasy, 
  postman, 
  redoc
];

// Type for vendor module
export interface VendorModule {
  info: {
    name: string;
    website?: string;
    support?: string;
  }
  extensions?: {
    [context: string]: (before: (key: string) => number, after: (key: string) => number) => {
      [extensionKey: string]: number;
    };
  }
}

/**
 * Load vendor extensions using static imports
 * This approach is ES module compatible and doesn't require dynamic loading
 * Handles failures on a per-vendor basis so one failure doesn't break others
 * Detects and alerts on extension key collisions between vendors
 */
export function getVendorExtensions(customVendorModules?: VendorModule[]): Record<string, Record<string, number>> {
  const extensions: Record<string, Record<string, number>> = {};
  const extensionSources: Record<string, Record<string, string>> = {}; // Track which vendor defined each extension
  
  // Use custom modules for testing, or default modules for production
  const modulesToLoad = customVendorModules || vendorModules;
  
  for (const vendorModule of modulesToLoad) {
    try {
      if (vendorModule?.extensions) {
        for (const [context, contextFunction] of Object.entries(vendorModule.extensions)) {
          if (typeof contextFunction === 'function') {
            // Create context-specific before/after functions
            const contextBefore = (key: string) => before(context as keyof ContextKeys, key);
            const contextAfter = (key: string) => after(context as keyof ContextKeys, key);
            
            // Execute the function to get the extensions
            const contextExtensions = contextFunction(contextBefore, contextAfter);
            
            if (!extensions[context]) {
              extensions[context] = {};
            }

            if (!extensionSources[context]) {
              extensionSources[context] = {};
            }
            
            // Check for collisions before adding extensions
            for (const [extensionKey, position] of Object.entries(contextExtensions)) {
              if (Object.hasOwn(extensions[context], extensionKey)) {
                const existingVendor = extensionSources[context][extensionKey];
                const currentVendor = vendorModule.info.name;
                
                console.warn(
                  `⚠️  Extension collision detected!\n` +
                  `   Key: "${extensionKey}" in context "${context}"\n` +
                  `   Already defined by: ${existingVendor}\n` +
                  `   Conflicting with: ${currentVendor}\n` +
                  `   Using position from: ${existingVendor} (${extensions[context][extensionKey]})\n` +
                  `   Ignoring position from: ${currentVendor} (${position})`
                );

              } else {
                // No collision, add the extension
                extensions[context][extensionKey] = position;
                extensionSources[context][extensionKey] = vendorModule.info.name;
              }
            }
          }
        }
      }
    } catch (error) {
      // Log the error but continue with other vendors
      console.warn(`Failed to load ${vendorModule.info.name} extensions`, error);
    }
  }
  
  return extensions;
}
