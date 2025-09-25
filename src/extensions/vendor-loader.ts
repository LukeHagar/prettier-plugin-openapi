/**
 * Vendor Loader
 * 
 * Automatically loads all vendor files from the vendor directory.
 * Supports any number of TypeScript files for different vendors.
 */

import * as fs from 'fs';
import * as path from 'path';
import { before, after, ContextKeys } from './index';

// Type for vendor extensions
export interface VendorExtensions {
  [context: string]: (before: (key: string) => number, after: (key: string) => number) => {
    [extensionKey: string]: number;
  };
}

// Type for vendor module
export interface VendorModule {
  extensions?: VendorExtensions;
}

/**
 * Automatically discover and load all vendor files
 */
export function loadAllVendorExtensions(): Record<string, Record<string, number>> {
  const extensions: Record<string, Record<string, number>> = {};
  const vendorDir = path.join(__dirname, 'vendor');
  
  try {
    // Check if vendor directory exists
    if (!fs.existsSync(vendorDir)) {
      console.warn('Vendor directory not found:', vendorDir);
      return extensions;
    }
    
    // Get all TypeScript files in vendor directory
    const vendorFiles = fs.readdirSync(vendorDir)
      .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))
      .map(file => path.join(vendorDir, file));
    
    console.log(`Found ${vendorFiles.length} vendor files:`, vendorFiles.map(f => path.basename(f)));
    
    // Load each vendor file
    for (const vendorFile of vendorFiles) {
      try {
        const vendorModule = require(vendorFile) as VendorModule;
        
        if (vendorModule && vendorModule.extensions) {
          console.log(`Loading vendor file: ${path.basename(vendorFile)}`);
          
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
              Object.assign(extensions[context], contextExtensions);
            }
          }
        }
      } catch (error: any) {
        console.warn(`Failed to load vendor file ${path.basename(vendorFile)}:`, error.message);
      }
    }
  } catch (error) {
    console.warn('Failed to load vendor extensions:', error);
  }
  
  return extensions;
}

/**
 * Load vendor extensions with fallback to manual list
 */
export function getVendorExtensions(): Record<string, Record<string, number>> {
  try {
    // Try automatic discovery first
    return loadAllVendorExtensions();
  } catch (error) {
    console.warn('Automatic vendor discovery failed, falling back to manual list:', error);
    
    // Fallback to manual list
    const extensions: Record<string, Record<string, number>> = {};
    
    const vendorModules = [
      require('./vendor/speakeasy'),
      require('./vendor/example-usage'),
      // Add more vendor files here as they are created
    ];
    
    for (const vendorModule of vendorModules) {
      if (vendorModule && vendorModule.extensions) {
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
            Object.assign(extensions[context], contextExtensions);
          }
        }
      }
    }
    
    return extensions;
  }
}
