module.exports = {
  '{*.(js|ts),!(examples)/**/*.(js|ts)}': [
    'prettier --write',
    // Disable ignoring filenames that starts with dot
    // https://stackoverflow.com/a/71829427
    'eslint --fix --ignore-pattern "!.*" --max-warnings 0'
  ],
  '{*.!(js|ts),!(examples)/**/*.!(js|ts)},!.release-please-manifest.json,!CHANGELOG.md':
    [`prettier --write --ignore-unknown`]
}
