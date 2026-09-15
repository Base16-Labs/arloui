const base = require('../../tooling/jest/base.cjs');

module.exports = {
  ...base,
  displayName: 'playground-controls',
  testMatch: ['<rootDir>/scripts/chart-variants.test.tsx'],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^@/(.*)$': '<rootDir>/$1',
    '^react$': require.resolve('react'),
  },
};
