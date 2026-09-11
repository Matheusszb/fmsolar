import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:3000' },
  webServer: {
    command: 'node node_modules/next/dist/bin/next dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
  timeout: 60000,
});
