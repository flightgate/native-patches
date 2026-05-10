import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 70,
        lines: 70,
      },
      include: [
        'packages/ui-kit/src/services/*.{ts,tsx}',
        'packages/ui-kit/src/schemas/*.{ts,tsx}',
        'packages/app-patient/src/schemas/*.{ts,tsx}',
        'packages/app-doctor/src/schemas/*.{ts,tsx}',
      ],
    },
  },
});
