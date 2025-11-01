# Prettier Markdown Integration

This directory contains Prettier's markdown language implementation, adapted for use within this plugin.

## Structure

### Core Files (from Prettier)
These files are copied from Prettier's `src/language-markdown` directory:
- `parser-markdown.js` - Markdown parser
- `printer-markdown.js` - Markdown printer
- `clean.js` - AST cleaning utilities
- `utils.js` - Utility functions
- `constants.evaluate.js` - Constants
- `print/` - Printing utilities
- `unified-plugins/` - Unified/Remark plugins
- Other supporting files

### Adapter Files (created for this plugin)
These files adapt Prettier's internal dependencies:
- `adapter-document-builders.js` - Adapts Prettier's document builders
- `adapter-document-utils.js` - Adapts Prettier's document utilities
- `adapter-document-constants.js` - Adapts Prettier's document constants
- `adapter-prettier-utils.js` - Adapts Prettier's utility functions
- `adapter-pragma.js` - Adapts pragma handling (simplified)

### Integration Files
- `format-markdown.ts` - Type-safe wrapper for formatting markdown
- `options.js` - Markdown formatting options (adapted from Prettier)

## Updating from Prettier

When Prettier updates its markdown implementation:

1. **Copy updated files** from `prettier/src/language-markdown/` to this directory
2. **Update adapter files** if Prettier's internal structure changed:
   - Check if document builders path changed → update `adapter-document-builders.js`
   - Check if document utils path changed → update `adapter-document-utils.js`
   - Check if utility functions changed → update `adapter-prettier-utils.js`
3. **Update imports** in copied files to use adapter files:
   - `../document/builders.js` → `./adapter-document-builders.js`
   - `../document/utils.js` → `./adapter-document-utils.js`
   - `../document/constants.js` → `./adapter-document-constants.js`
   - `../utils/*` → `./adapter-prettier-utils.js`
   - `../common/common-options.evaluate.js` → update `options.js`
   - `../main/front-matter/index.js` → update `adapter-pragma.js` or `clean.js`
   - `../utils/pragma/pragma.evaluate.js` → update `adapter-pragma.js`
4. **Test** that markdown formatting still works correctly

## Dependencies

The adapter files attempt to access Prettier's internal APIs at runtime. If Prettier's internal structure changes significantly, you may need to update the adapter files to match.

The interfaces in the adapter files are designed to be similar to Prettier's actual structure, making updates easier.

