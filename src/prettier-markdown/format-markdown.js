/**
 * Type-safe wrapper for Prettier's markdown formatting
 * 
 * This module provides a synchronous interface to Prettier's markdown
 * parser and printer, adapted to work within a Prettier plugin context.
 */

const { markdown: markdownParser } = require("./parser-markdown.js");
const printer = require("./printer-markdown.js");
const { getDocPrinter } = require("./adapter-prettier-internals.js");

/**
 * Formats a markdown string using Prettier's markdown parser and printer
 * 
 * @param {string} markdown - The markdown string to format
 * @param {Object} options - Formatting options
 * @param {number} [options.printWidth=80] - Maximum line width
 * @param {number} [options.tabWidth=2] - Tab width
 * @param {string} [options.proseWrap='preserve'] - Prose wrapping mode
 * @param {boolean} [options.singleQuote=false] - Use single quotes
 * @returns {string} The formatted markdown string, or the original if formatting fails
 */
function formatMarkdown(markdown, options = {}) {
  if (!markdown || typeof markdown !== "string") {
    return markdown;
  }

  const trimmed = markdown.trim();
  if (trimmed.length === 0) {
    return markdown;
  }

  try {
    // Parse markdown to AST
    const ast = markdownParser.parse(trimmed, {
      originalText: trimmed,
      filepath: "temp.md",
      printWidth: options.printWidth || 80,
      tabWidth: options.tabWidth || 2,
      proseWrap: options.proseWrap || "preserve",
      singleQuote: options.singleQuote || false,
    });

    // Create an AstPath-like object for the printer
    const astPath = {
      getNode: () => ast,
      stack: [ast],
      node: ast,
      callParent: (fn) => fn(astPath),
      each: (fn) => {
        if (ast.children) {
          ast.children.forEach((child, index) => {
            const childPath = {
              getNode: () => child,
              stack: [...astPath.stack, child],
              node: child,
              index,
              previous: index > 0 ? ast.children[index - 1] : null,
              next: index < ast.children.length - 1 ? ast.children[index + 1] : null,
              parent: ast,
              isFirst: index === 0,
              isLast: index === ast.children.length - 1,
              callParent: (fn) => fn(childPath),
            };
            fn(childPath);
          });
        }
      },
    };

    // Create a print function for recursive printing
    const createPrintFn = (path) => {
      return (printPath) => {
        return printer.print(printPath, {
          printWidth: options.printWidth || 80,
          tabWidth: options.tabWidth || 2,
          proseWrap: options.proseWrap || "preserve",
          singleQuote: options.singleQuote || false,
          originalText: trimmed,
        }, createPrintFn);
      };
    };

    // Print the AST to a Doc object
    const doc = printer.print(astPath, {
      printWidth: options.printWidth || 80,
      tabWidth: options.tabWidth || 2,
      proseWrap: options.proseWrap || "preserve",
      singleQuote: options.singleQuote || false,
      originalText: trimmed,
    }, createPrintFn);

    // Convert Doc to string
    if (typeof doc === "string") {
      return doc.trimEnd();
    }

    // Try to convert Doc object to string using Prettier's doc printer
    const docPrinter = getDocPrinter();
    if (docPrinter && typeof docPrinter === "function") {
      try {
        const formattedString = docPrinter(doc, {
          printWidth: options.printWidth || 80,
          tabWidth: options.tabWidth || 2,
          useTabs: false,
        });
        return typeof formattedString === "string" ? formattedString.trimEnd() : markdown;
      } catch {
        // Doc printing failed
        return markdown;
      }
    }

    // If we can't convert Doc to string, return original
    return markdown;
  } catch (error) {
    // Parsing or printing failed, return original
    return markdown;
  }
}

module.exports = { formatMarkdown };

