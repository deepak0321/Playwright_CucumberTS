import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

if (!process.env.CI) {
  require('dotenv').config();
}

export default defineConfig({
  
  use: {
    baseURL: 'https://restful-booker.herokuapp.com',
    trace: 'retain-on-failure',
    permissions: ['geolocation'],
    screenshot: 'only-on-failure',
  },
  expect: {
    timeout: 10000
  },
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['allure-playwright']],
  projects: [
    {
        name:'login setup',
        testDir: './auth',
        testMatch: 'learnqa-login.setup.spec.ts',
    },
    {
      name: 'tests with login[Chromium]',
      testIgnore: /network-interception\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 }, storageState: 'playwright/.auth/storageState.json' }, dependencies: ['login setup'],
    },
    {
      name: 'Network Interception',
      testMatch: 'network-interception.spec.ts',
    }
  ],
});
