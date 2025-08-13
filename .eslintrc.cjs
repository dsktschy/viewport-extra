module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    projectService: {
      allowDefaultProject: ['*.{js,mjs,cjs}', '.*.{js,mjs,cjs}'],
      defaultProject: 'tsconfig.json'
    }
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    '@typescript-eslint/no-unused-vars':
      process.env.NODE_ENV === 'production' ? 2 : 1,
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          orderImportKind: 'asc',
          caseInsensitive: true
        }
      }
    ]
  },
  overrides: [
    {
      files: ['src/**/*'],
      excludedFiles: '*.spec.*',
      extends: ['plugin:compat/recommended'],
      plugins: ['compat'],
      settings: {
        targets: ['fully supports es5', 'not fully supports es6'],
        lintAllEsApis: true
      }
    }
  ]
}
