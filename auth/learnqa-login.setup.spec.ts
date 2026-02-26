import { expect, test as setup } from '@playwright/test';

setup('Authentication', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('https://www.learnaqa.info/');
    await page.getByRole('button', { name: 'Accept All' }).click();
    await page.getByRole('button', { name: 'Sign In' }).nth(1).click();
    await page.getByPlaceholder('Enter your email').fill(process.env.EMAIL!);
    await page.getByLabel('Password').fill(process.env.PASSWORD!);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('status')).toHaveText('Successfully logged in!');
    await page.context().storageState({ path: 'playwright/.auth/storageState.json' });
});