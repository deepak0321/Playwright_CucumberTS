import { test, expect } from '@playwright/test';

test.describe('LearnQA Tests', () => {

    test('Force Login Failure Test with Valid Credentials', async ({ page }) => {

        page.on('request', request => {
            console.log('>>', request.method(), request.url());
        });
        page.on('response', response => {
            console.log('<<', response.status(), response.url());
        });

        await page.route('**/login', async route => {
            await route.fulfill({
                status: 404,
                contentType: 'text/plain',
                body: 'Not Found!'
            })
        });

        await page.goto('https://www.learnaqa.info/');
        await page.getByRole('button', { name: 'Accept All' }).click();
        await page.getByRole('button', { name: 'Sign In' }).nth(1).click();
        await page.getByPlaceholder('Enter your email').fill(process.env.EMAIL!);
        await page.getByLabel('Password').fill(process.env.PASSWORD!);
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page.getByRole('status')).toHaveText('Request failed with status code 404');
    });

    test('BLock Login Test with Valid Credentials', async ({ page }) => {
        await page.route('**/login', async route => { await route.abort(); });
        await page.goto('https://www.learnaqa.info/');
        await page.getByRole('button', { name: 'Accept All' }).click();
        await page.getByRole('button', { name: 'Sign In' }).nth(1).click();
        await page.getByPlaceholder('Enter your email').fill(process.env.EMAIL!);
        await page.getByLabel('Password').fill(process.env.PASSWORD!);
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page.getByRole('status')).toHaveText('Network Error');
    });

    test('Modify Login Request Test', async ({ page }) => {

        await page.route('**/login', async route => {
            const request = route.request();
            if (request.method() !== 'POST') {
                await route.continue();
                return;
            }
            const raw = request.postData();
            if (!raw) {
                await route.continue();
                return;
            }
            const data = JSON.parse(raw);
            data.password = 'Deepak@FakeQA';
            await route.continue({
                postData: JSON.stringify(data),
                headers: {
                    ...request.headers(),
                    'content-type': 'application/json'
                }
            });
        });
        await page.goto('https://www.learnaqa.info/');
        await page.getByRole('button', { name: 'Accept All' }).click();
        await page.getByRole('button', { name: 'Sign In' }).nth(1).click();
        await page.getByPlaceholder('Enter your email').fill(process.env.EMAIL!);
        await page.getByLabel('Password').fill(process.env.PASSWORD!);
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page.getByRole('link', { name: 'Drag and Drop' })).not.toBeVisible();
    });
})