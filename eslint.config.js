// ESLint flat config for ESLint 9 + eslint-config-expo 10.
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['node_modules/*', 'dist/*', 'coverage/*', '.expo/*'],
  },
];
