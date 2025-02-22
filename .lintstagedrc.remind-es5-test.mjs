export default {
  "{src/**/!(*spec).ts,rollup.config.*.mjs}": [
    "tsx scripts/remind-es5-test.mts",
  ],
};
