export default {
  "**/*": [
    "npm run spellcheck --",
    "npm run stylecheck -- --write --no-errors-on-unmatched",
  ],
};
