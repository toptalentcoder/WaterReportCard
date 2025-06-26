module.exports = {
    extends: ['next/core-web-vitals'],
    rules: {
      // Disable a specific rule
      'no-unused-vars': 'off', // Example of disabling the no-unused-vars rule
      'react/no-unused-state': 'off', // Disable React's unused state rule
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
    overrides: [
        {
          files: ['*.ts', '*.tsx'], // Only apply these overrides to TypeScript files
          rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
          },
        },
      ],
  };
  