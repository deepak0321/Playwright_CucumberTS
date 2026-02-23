import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  expect:{
    timeout: 10000
  },
  testDir: './tests',
  fullyParallel: true,
  retries:2,
  workers:3,
  reporter: [['html'],['allure-playwright']],
  use: {
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } , headless: false},
    },
  ],
});
