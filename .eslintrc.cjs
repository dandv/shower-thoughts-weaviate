// TypeScript ESLinting per https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  env: {
    node: true,  // the Node global `module` is used in ./*.config.cjs files
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'no-use-before-define': 'error',
    'no-shadow': 'warn',
    'prefer-const': 'warn',
    'max-len': ['warn', {
      code: 128,  // for GitHub
      ignoreUrls: true,
      ignoreStrings: true,  // this ignores long lines that have ANY string in them, not long lines that ARE strings
      ignoreTemplateLiterals: true,  // same as above - even a short template literal will ignore the rule for the line
      ignoreRegExpLiterals: true,
    }],
    indent: ['error', 2, { SwitchCase: 1 }],  // SwitchCase is default 0, which confuses IDEs and looks ugly at the default } brace - http://bit.ly/2BtM2k1
    curly: ['warn', 'multi', 'consistent'],
    'space-before-function-paren': ['error', { anonymous: 'always', named: 'never' }],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': 'error',  // no `a+b`
    'spaced-comment': ['warn', 'always'],  //start comment with a space
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],
    'no-trailing-spaces': 'warn',
    semi: ['error', 'always'],
    quotes: ['warn', 'single', { avoidEscape: true }],
    'comma-dangle': ['warn', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'no-constant-condition': ['warn', { checkLoops: false }],  // if I write `while(true)`, I mean it
    'no-return-await': 'warn',
    'no-console': 'warn',
    'no-bitwise': 'error',
    '@typescript-eslint/ban-ts-comment': [ 'warn', { 'ts-ignore': 'allow-with-description' }],  // that's the point of ts-ignore
    '@typescript-eslint/no-non-null-assertion': 'off',  // when I use `!`, I mean it
  },
};
