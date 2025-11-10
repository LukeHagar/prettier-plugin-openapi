import footnotes from "remark-footnotes";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import unified from "unified";
import { locEnd, locStart } from "./loc.js";
import { BLOCKS_REGEX, esSyntax } from "./mdx.js";
import { hasIgnorePragma, hasPragma } from "./pragma.js";
import frontMatter from "./unified-plugins/front-matter.js";
import htmlToJsx from "./unified-plugins/html-to-jsx.js";
import liquid from "./unified-plugins/liquid.js";
import wikiLink from "./unified-plugins/wiki-link.js";

/**
 * based on [MDAST](https://github.com/syntax-tree/mdast) with following modifications:
 *
 * 1. restore unescaped character (Text)
 * 2. merge continuous Texts
 * 3. replace whitespaces in InlineCode#value with one whitespace
 *    reference: http://spec.commonmark.org/0.25/#example-605
 * 4. split Text into Sentence
 *
 * interface Word { value: string }
 * interface Whitespace { value: string }
 * interface Sentence { children: Array<Word | Whitespace> }
 * interface InlineCode { children: Array<Sentence> }
 */
// Memoized processors keyed by feature signature to avoid rebuilding pipelines
const processorCache = new Map();

function detectFeatures(text) {
  // Cheap checks to decide whether to enable heavier plugins
  const hasMath = /(\$\$|\\\[|\\\(|\$)/u.test(text);
  const hasLiquid = /(\{\{|\{%)/u.test(text);
  const hasWiki = /\[\[/u.test(text);
  return { hasMath, hasLiquid, hasWiki };
}

function getProcessor({ isMDX, features }) {
  const key = `${isMDX ? 1 : 0}:${features.hasMath ? 1 : 0}${features.hasLiquid ? 1 : 0}${features.hasWiki ? 1 : 0}`;
  const cached = processorCache.get(key);
  if (cached) {
    return cached;
  }

  const processor = unified()
    .use(remarkParse, {
      commonmark: true,
      ...(isMDX && { blocks: [BLOCKS_REGEX] }),
    })
    // inexpensive plugins first
    .use(footnotes)
    .use(frontMatter)
    .use(isMDX ? esSyntax : noop)
    // conditional heavy plugins
    .use(features.hasMath ? remarkMath : noop)
    .use(features.hasLiquid ? liquid : noop)
    // html -> jsx only matters in MDX
    .use(isMDX ? htmlToJsx : noop)
    .use(features.hasWiki ? wikiLink : noop);

  processorCache.set(key, processor);
  return processor;
}

function createParse({ isMDX }) {
  return (text) => {
    const features = detectFeatures(text);
    const processor = getProcessor({ isMDX, features });
    return processor.runSync(processor.parse(text));
  };
}

function noop() {}

const baseParser = {
  astFormat: "mdast",
  hasPragma,
  hasIgnorePragma,
  locStart,
  locEnd,
};

export const markdown = { ...baseParser, parse: createParse({ isMDX: false }) };
export const mdx = { ...baseParser, parse: createParse({ isMDX: true }) };
export { markdown as remark };
