import { test, expect } from '@playwright/test';
import fs from 'fs';

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
        for(let i=0; i<draggableItemsCount; i++) {
            await draggableItems.first().dragTo(dropZone);
        }
        await expect(page.locator('.text-center')).toContainText('All items have been moved to the drop zone!');
    });














    test.skip('Login Test with Valid Credentials', async ({ page }) => {
        await page.getByRole('button', { name: 'Accept All' }).click();
        await page.getByRole('button', { name: 'Sign In' }).nth(1).click();
        await page.getByPlaceholder('Enter your email').fill(process.env.email!);
        await page.getByLabel('Password').fill(process.env.password!);
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page.getByRole('status')).toHaveText('Successfully logged in!');
    });
    
})