/**
 * Adapter for Prettier's utility functions
 * 
 * This file attempts to import Prettier's utility functions from internal APIs.
 * Update this file when Prettier's internal structure changes.
 */

let utils: any = null;

try {
  const prettier = require("prettier");
  
  if (prettier.__internal?.utils) {
    utils = prettier.__internal.utils;
  } else {
    try {
      // Try alternative paths
      utils = require("prettier/internal/utils");
    } catch {
      // Utils may not be accessible
    }
  }
} catch {
  // Utils not accessible
}

// Provide fallback implementations if utils aren't accessible
if (!utils) {
  // Minimal fallback implementations
  utils = {
    getMaxContinuousCount: (str: string, char: string) => {
      let max = 0;
      let current = 0;
      for (const c of str) {
        if (c === char) {
          current++;
          max = Math.max(max, current);
        } else {
          current = 0;
        }
      }
      return max;
    },
    getMinNotPresentContinuousCount: (str: string, char: string) => {
      let count = 1;
      while (str.includes(char.repeat(count))) {
        count++;
      }
      return count;
    },
    getPreferredQuote: (str: string, singleQuote: boolean) => {
      if (singleQuote) return "'";
      const hasSingle = str.includes("'");
      const hasDouble = str.includes('"');
      if (hasSingle && !hasDouble) return '"';
      return '"';
    },
  };
}

export const getMaxContinuousCount = utils.getMaxContinuousCount;
export const getMinNotPresentContinuousCount = utils.getMinNotPresentContinuousCount;
export const getPreferredQuote = utils.getPreferredQuote;

// UnexpectedNodeError may be in utils or separate
export class UnexpectedNodeError extends Error {
  constructor(node: any, language: string) {
    super(`Unexpected node type: ${node.type} in ${language}`);
    this.name = "UnexpectedNodeError";
  }
}

