/**
 * Adapter for Prettier's document builders
 * 
 * This file attempts to import Prettier's document builders from internal APIs.
 * Update this file when Prettier's internal structure changes.
 */

let builders: any = null;

try {
  const prettier = require("prettier");
  
  // Try multiple paths to access document builders
  if (prettier.__internal?.document?.builders) {
    builders = prettier.__internal.document.builders;
  } else {
    // Try to require directly (may work in plugin context)
    try {
      builders = require("prettier/internal/document/builders");
    } catch {
      // Fallback: try alternative paths
      try {
        const doc = require("prettier/doc");
        if (doc) {
          builders = doc;
        }
      } catch {
        // Not accessible
      }
    }
  }
} catch {
  // Builders not accessible
}

// Export what we found, or throw if not available
if (!builders) {
  throw new Error(
    "Prettier document builders not accessible. " +
    "Markdown formatting requires Prettier's internal document builders."
  );
}

export const {
  align,
  fill,
  group,
  hardline,
  indent,
  line,
  literalline,
  markAsRoot,
  softline,
} = builders;

