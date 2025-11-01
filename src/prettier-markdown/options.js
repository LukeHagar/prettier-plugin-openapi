// Options for markdown formatting
// These match Prettier's default markdown options
// Update this file if Prettier's markdown options change
const options = {
  proseWrap: {
    type: "choice",
    default: "preserve",
    choices: [
      { value: "always", description: "Wrap prose if it exceeds the print width" },
      { value: "never", description: "Don't wrap prose" },
      { value: "preserve", description: "Preserve the original wrapping" },
    ],
  },
  singleQuote: {
    type: "boolean",
    default: false,
  },
};

export default options;
