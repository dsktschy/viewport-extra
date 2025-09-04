export default {
  "*": ["npm run spellcheck --", "npm run stylecheck:code -- --write"],
  "*.md": ["npm run stylecheck:docs -- --write"],
};
