/**
 * Adapter for Prettier's document constants
 * 
 * This file attempts to import Prettier's document constants from internal APIs.
 * Update this file when Prettier's internal structure changes.
 */

let constants: any = null;

try {
  const prettier = require("prettier");
  
  if (prettier.__internal?.document?.constants) {
    constants = prettier.__internal.document.constants;
  } else {
    try {
      constants = require("prettier/internal/document/constants");
    } catch {
      // Constants may not be accessible, provide a fallback
      constants = {
        DOC_TYPE_STRING: "doc-type-string",
      };
    }
  }
} catch {
  // Provide fallback
  constants = {
    DOC_TYPE_STRING: "doc-type-string",
  };
}

export const { DOC_TYPE_STRING } = constants;

