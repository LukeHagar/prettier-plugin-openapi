/**
 * Adapter for Prettier's internal document builders and utilities
 * 
 * This file attempts to access Prettier's internal APIs that are needed
 * by the markdown parser and printer. These adapters provide a type-safe
 * way to access Prettier internals when available.
 * 
 * Note: This file can be updated when Prettier's internal structure changes.
 * The interfaces should remain similar to allow easy updates.
 */

/**
 * Attempts to import Prettier's document builders
 * @returns {Promise<typeof import('prettier/internal/document/builders')> | null>}
 */
export function getDocumentBuilders() {
  try {
    // Try to require Prettier's document builders
    // Prettier 3.x structure
    const prettier = require("prettier");
    
    // Path 1: Check if accessible via __internal
    if (prettier.__internal?.document?.builders) {
      return prettier.__internal.document.builders;
    }
    
    // Path 2: Try to require directly (may work in some contexts)
    try {
      return require("prettier/internal/document/builders");
    } catch {
      // Not accessible
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Attempts to import Prettier's document utils
 */
export function getDocumentUtils() {
  try {
    const prettier = require("prettier");
    
    if (prettier.__internal?.document?.utils) {
      return prettier.__internal.document.utils;
    }
    
    try {
      return require("prettier/internal/document/utils");
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

/**
 * Attempts to import Prettier's document constants
 */
export function getDocumentConstants() {
  try {
    const prettier = require("prettier");
    
    if (prettier.__internal?.document?.constants) {
      return prettier.__internal.document.constants;
    }
    
    try {
      return require("prettier/internal/document/constants");
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

/**
 * Attempts to import Prettier's utility functions
 */
export function getPrettierUtils() {
  try {
    const prettier = require("prettier");
    
    if (prettier.__internal?.utils) {
      return prettier.__internal.utils;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Attempts to get Prettier's doc-to-string printer
 * This is needed to convert Doc objects to strings
 */
export function getDocPrinter() {
  try {
    const prettier = require("prettier");
    
    // Try multiple paths
    if (prettier.__internal?.doc?.printDocToString) {
      return prettier.__internal.doc.printDocToString;
    }
    
    if (prettier.__internal?.docPrinter?.formatDoc) {
      return prettier.__internal.docPrinter.formatDoc;
    }
    
    try {
      const docUtils = require("prettier/internal/doc");
      if (docUtils?.printDocToString) {
        return docUtils.printDocToString;
      }
    } catch {
      // Not accessible
    }
    
    return null;
  } catch {
    return null;
  }
}

