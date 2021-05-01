/* eslint-disable sort-keys-fix/sort-keys-fix */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'simple-import-sort',
    'sort-keys-fix',
    'typescript-sort-keys',
    'sort-destructure-keys',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'prettier',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: false,
        trailingComma: 'all',
        singleQuote: true,
        arrowParens: 'avoid',
      },
    ],
    // 'no-console': 'warn',
    // Typescript es-lint handles this
    'no-unused-vars': 'off',

    /**
     * Typescript
     */
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-types': 'warn',

    /**
     * Sorting
     */
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'sort-keys-fix/sort-keys-fix': 'warn',
    'typescript-sort-keys/interface': 'warn',
    'typescript-sort-keys/string-enum': 'warn',
    'sort-destructure-keys/sort-destructure-keys': [
      'warn',
      { caseSensitive: false },
    ],
    '@typescript-eslint/member-ordering': 'warn',
  },

  ignorePatterns: ['dist', 'node_modules'],
}
