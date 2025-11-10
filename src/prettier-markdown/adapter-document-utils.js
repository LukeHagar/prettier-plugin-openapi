/**
 * Adapter for Prettier's document utils
 * 
 * This file attempts to import Prettier's document utilities from internal APIs.
 * Update this file when Prettier's internal structure changes.
 */

let utils: any = null;

try {
  const prettier = require("prettier");
  
  if (prettier.__internal?.document?.utils) {
    utils = prettier.__internal.document.utils;
  } else {
    try {
      utils = require("prettier/internal/document/utils");
    } catch {
      try {
        const docUtils = require("prettier/doc");
        utils = docUtils;
      } catch {
        // Not accessible
      }
    }
  }
} catch {
  // Utils not accessible
}

if (!utils) {
  throw new Error(
    "Prettier document utils not accessible. " +
    "Markdown formatting requires Prettier's internal document utilities."
  );
}

export const { getDocType, replaceEndOfLine } = utils;

