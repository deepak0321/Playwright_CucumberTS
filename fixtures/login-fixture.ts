import { test as base, Page, expect } from '@playwright/test';

type MyFixtures = {
    authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
    authenticatedPage: async ({ page }, use) => {
        await page.goto('https://www.learnaqa.info/');
        await page.getByRole('button', { name: 'Accept All' }).click();
        await page.getByRole('button', { name: 'Sign In' }).nth(1).click();
        await page.getByPlaceholder('Enter your email').fill(process.env.EMAIL!);
        await page.getByLabel('Password').fill(process.env.PASSWORD!);
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page.getByRole('status')).toHaveText('Successfully logged in!');
        await use(page);
        await page.close();
    },
});

export { expect } from '@playwright/test';