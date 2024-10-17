module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential', // Vue 3 specific rules
    'eslint:recommended',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  rules: {
    'vue/no-multiple-template-root': 'off', // If using multiple root nodes
    'no-undef': 'off', // Turn off no-undef to prevent issues with Vue 3 Composition API functions
  },
};
