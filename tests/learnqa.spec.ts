import { test, expect } from '@playwright/test';

test.setTimeout(60000);
test.describe('LearnQA Tests', () => {

    test.beforeAll(async () => {
        console.log('This is before all tests');
    });

    test.afterAll(async () => {
        console.log('This is after all tests');
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.learnaqa.info/');
        await page.getByRole('button', { name: 'Accept All' }).click();
        await page.getByRole('button', { name: 'Sign In' }).nth(1).click();
        await page.getByPlaceholder('Enter your email').fill(process.env.email!);
        await page.getByLabel('Password').fill(process.env.password!);
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page.getByRole('status')).toHaveText('Successfully logged in!');
    });

    test('Drag and Drop Test', async ({ page }) => {
        await page.getByRole('link', { name: 'Drag and Drop' }).click();
        await expect(page.getByText('Learn to test drag and drop interactions')).toBeVisible();
        const draggableItems = page.locator("div[id^='item']");
        const draggableItemsCount = await draggableItems.count();
        const dropZone = page.locator('#drop-zone');
        for (let i = 0; i < draggableItemsCount; i++) {
            await draggableItems.first().dragTo(dropZone);
        }
        await expect(page.locator('.text-center')).toContainText('All items have been moved to the drop zone!');
    });

    test.only('Dynamic Elements Test', async ({ page }) => {
        await page.getByRole('link', { name: 'Dynamic Elements' }).click();
        await expect(page.getByText('Test delayed elements, AJAX loading, lazy loading, and infinite scroll')).toBeVisible();
        await page.getByRole('button', { name: 'Click to Show Delayed Element' }).click();
        await expect(page.locator('#delayed-element')).toBeVisible();
        await page.locator('#load-ajax-data').click();
        await expect(page.locator('.ajax-item')).toHaveCount(5);
        const lazyImages = page.locator('.lazy-image-placeholder');
        const lazyImagesCount = await lazyImages.count();
        for (let i = 0; i < lazyImagesCount; i++) {
            await lazyImages.nth(i).scrollIntoViewIfNeeded();
            await expect(lazyImages.nth(i).locator('img')).toHaveJSProperty('complete', true);
            await expect(lazyImages.nth(i).locator('img')).not.toHaveJSProperty('naturalWidth', 0);
        }
        const scrollItems = page.locator('.scroll-item ');
        const scrollItemsCount = await scrollItems.count();
        scrollItems.nth(scrollItemsCount - 1).scrollIntoViewIfNeeded();
        await expect(page.locator('.scroll-item')).toHaveCount(20);
        await expect(page.locator('hidden-element')).toBeHidden();
        await page.getByRole('button', { name: 'Reveal Hidden Elements' }).click();
        await expect(page.getByText('🎉 Hidden element revealed!')).toBeVisible();
        await page.getByRole('button', { name: 'Generate Dynamic Content' }).click();
        const firstDynamicContent =  await page.locator('#dynamic-content').textContent();
        await page.getByRole('button', { name: 'Generate Dynamic Content' }).click();
        const secondDynamicContent = await page.locator('#dynamic-content').textContent();
        console.log('First Dynamic Content:', firstDynamicContent);
        console.log('Second Dynamic Content:', secondDynamicContent);
        expect(firstDynamicContent).not.toBe(secondDynamicContent);
    });
















    test('Login Test with Valid Credentials', async ({ page }) => {
        await page.getByRole('button', { name: 'Accept All' }).click();
        await page.getByRole('button', { name: 'Sign In' }).nth(1).click();
        await page.getByPlaceholder('Enter your email').fill(process.env.email!);
        await page.getByLabel('Password').fill(process.env.password!);
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page.getByRole('status')).toHaveText('Successfully logged in!');
    });

})