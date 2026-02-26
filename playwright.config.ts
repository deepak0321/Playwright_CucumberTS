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
        testMatch: 'learnqa-login.setup.spec.ts',
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 }, storageState: '.auth/storageState.json' }, dependencies: ['login setup'],
    },
  ],
});
