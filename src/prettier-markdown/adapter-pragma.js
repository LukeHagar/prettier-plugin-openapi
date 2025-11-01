/**
 * Adapter for Prettier's pragma utilities
 * 
 * Simplified version that doesn't depend on Prettier's internal pragma system.
 * Update this file when Prettier's pragma behavior changes.
 */

// Simplified pragma regexes based on Prettier's implementation
const MARKDOWN_HAS_PRAGMA_REGEXP = /^<!--\s*@(prettier|format)\s*-->$/m;
const MARKDOWN_HAS_IGNORE_PRAGMA_REGEXP = /^<!--\s*prettier-ignore(?:-(start|end))?\s*-->$/m;
const FORMAT_PRAGMA_TO_INSERT = "format";

/**
 * Simple front matter parser (minimal implementation)
 */
function parseFrontMatter(text: string) {
  const yamlMatch = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (yamlMatch) {
    return {
      content: text.slice(yamlMatch[0].length),
      frontMatter: {
        raw: yamlMatch[0],
        end: { index: yamlMatch[0].length },
      },
    };
  }
  return { content: text, frontMatter: null };
}

const hasPragma = (text: string) =>
  parseFrontMatter(text).content.trimStart().match(MARKDOWN_HAS_PRAGMA_REGEXP)
    ?.index === 0;

const hasIgnorePragma = (text: string) =>
  parseFrontMatter(text)
    .content.trimStart()
    .match(MARKDOWN_HAS_IGNORE_PRAGMA_REGEXP)?.index === 0;

const insertPragma = (text: string) => {
  const { frontMatter } = parseFrontMatter(text);
  const pragma = `<!-- @${FORMAT_PRAGMA_TO_INSERT} -->`;
  return frontMatter
    ? `${frontMatter.raw}\n\n${pragma}\n\n${text.slice(frontMatter.end.index)}`
    : `${pragma}\n\n${text}`;
};

export { hasIgnorePragma, hasPragma, insertPragma };

