/**
 * Type-safe wrapper for Prettier's markdown formatting
 *
 * This module provides a synchronous interface to Prettier's markdown
 * parser and printer, adapted to work within a Prettier plugin context.
 */

import type { ParserOptions } from "prettier";
import {
  getDocPrinter,
  getDocumentBuilders,
  getDocumentConstants,
  getDocumentUtils,
  // @ts-expect-error - No declaration file
} from "./adapter-prettier-internals.js";
// @ts-expect-error - No declaration file
import { markdown as markdownParser } from "./parser-markdown.js";
// @ts-expect-error - No declaration file
import printer from "./printer-markdown.js";

interface MarkdownFormatOptions {
  printWidth?: number;
  tabWidth?: number;
  proseWrap?: "always" | "never" | "preserve";
  singleQuote?: boolean;
}

/**
 * Formats a markdown string using Prettier's markdown parser and printer
 *
 * @param markdown - The markdown string to format
 * @param options - Formatting options
 * @returns The formatted markdown string, or the original if formatting fails
 */
export function formatMarkdown(markdown: string, options: MarkdownFormatOptions = {}): string {
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
    } as ParserOptions);

    // Create an AstPath-like object for the printer
    const astPath = {
      getNode: () => ast,
      stack: [ast],
      callParent: (fn: (path: any) => any) => fn(astPath),
      each: (fn: (path: any) => void) => {
        if (ast.children) {
          ast.children.forEach((child: any, index: number) => {
            const childPath = {
              getNode: () => child,
              stack: [...astPath.stack, child],
              index,
              previous: index > 0 ? ast.children[index - 1] : null,
              next: index < ast.children.length - 1 ? ast.children[index + 1] : null,
              parent: ast,
              isFirst: index === 0,
              isLast: index === ast.children.length - 1,
            };
            fn(childPath);
          });
        }
      },
    };

    // Create a print function for recursive printing
    const createPrintFn = (path: any): any => {
      return (printPath: any) => {
        return printer.print(printPath, options as ParserOptions, createPrintFn);
      };
    };

    // Print the AST to a Doc object
    const doc = printer.print(astPath, options as ParserOptions, createPrintFn);

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
