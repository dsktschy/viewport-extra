module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Do not set max length because external systems create long message
    // https://github.com/conventional-changelog/commitlint/issues/2930
    'body-max-length': [0, 'always'],
    'body-max-line-length': [0, 'always'],
    'footer-max-length': [0, 'always'],
    'footer-max-line-length': [0, 'always'],
    'header-max-length': [0, 'always'],
    'scope-max-length': [0, 'always'],
    'subject-max-length': [0, 'always'],
    'type-max-length': [0, 'always']
  }
}
