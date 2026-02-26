import { test, expect } from '@playwright/test';
import fs from 'fs';

test.setTimeout(60000);

test.describe.configure({ mode: 'parallel' });

test.afterAll(async () => {
    console.log('This is after all tests');
});

test.beforeAll(async () => {
    console.log('This is before all tests');
});
test.describe('LearnQA Tests', () => {

    test.beforeEach(async ({ page }, testInfo) => {
        console.log('Running Test:', testInfo.title);
        await page.goto('https://www.learnaqa.info/dashboard');
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

    test('Dynamic Elements Test', async ({ page }) => {
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
        const firstDynamicContent = await page.locator('#dynamic-content').textContent();
        await page.getByRole('button', { name: 'Generate Dynamic Content' }).click();
        const secondDynamicContent = await page.locator('#dynamic-content').textContent();
        console.log('First Dynamic Content:', firstDynamicContent);
        console.log('Second Dynamic Content:', secondDynamicContent);
        expect(firstDynamicContent).not.toBe(secondDynamicContent);
    });

    test('File Handling Test', async ({ page }) => {

        await page.getByRole('link', { name: 'File Operations' }).click();
        await expect(page.getByText('Test file upload, download and Excel processing')).toBeVisible();

        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.getByRole('button', { name: 'Download Template Excel' }).click(),
        ]);
        await download.saveAs(`./downloads/${download.suggestedFilename()}`);

        await page.locator('input[type="file"]').setInputFiles(`./downloads/${download.suggestedFilename()}`);

        const [processedDownload] = await Promise.all([
            page.waitForEvent('download'),
            page.locator('#download-processed').click(),
        ]);

        await processedDownload.saveAs(`./downloads/${processedDownload.suggestedFilename()}`);
        expect(fs.existsSync(`./downloads/${processedDownload.suggestedFilename()}`)).toBeTruthy();

    });

    test('iFrames Test', async ({ page }) => {
        //Basic iFrame Interactions
        await page.locator('a[href*="iframe"] button').click();
        await expect(page.getByText('Test iframe interactions, popup windows, and browser dialogs')).toBeVisible();
        await expect(page.frameLocator('#basic-iframe').locator('#iframe-button')).toBeVisible();
        await page.getByRole('button', { name: 'Send Message to iFrame' }).click();
        await expect(page.frameLocator('#basic-iframe').getByText('Hello from parent window!')).toBeVisible();
        await page.frameLocator('#basic-iframe').locator('#iframe-button').click();
        await expect(page.locator('#iframe-message-display')).toContainText('Hello from basic iframe!');

        //Form Interactions within iFrame
        await page.getByRole('button', { name: 'Form' }).click();
        const iframe = page.frameLocator('#basic-iframe');
        await expect(iframe.getByText('iFrame Form Content')).toBeVisible();
        await iframe.getByPlaceholder('Enter your name').fill('Leo Das');
        await iframe.locator('#iframe-email').fill('leodas@datura.com');
        await iframe.locator('#iframe-comment').fill('Nan dan da leo das!');
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => { });
        });
        await iframe.getByRole('button', { name: 'Submit Form' }).click();
    });

    test('Multiple Windows Test', async ({ page }) => {
        await page.locator('a[href*="windows"] button').click();
        await expect(page.getByText('Test iframe interactions, popup windows, and browser dialogs')).toBeVisible();

        const [popup] = await Promise.all([
            page.waitForEvent('popup'),
            page.getByRole('button', { name: 'Basic Popup (600×400, Resizable)' }).click(),
        ]);

        await popup.waitForLoadState('networkidle');
        await expect(popup.getByText('Popup window loaded successfully!')).toBeVisible();
        await popup.locator('#popup-close').click();


        const [smallPopup] = await Promise.all([
            page.waitForEvent('popup'),
            page.getByRole('button', { name: 'Small Popup (300×200, Fixed)' }).click(),
        ]);

        await smallPopup.waitForLoadState('networkidle');
        await expect(smallPopup.getByText('Popup window loaded successfully!')).toBeVisible();
        await smallPopup.locator('#popup-close').click();

        //Browser Dialogs
        page.on('dialog', dialogHandler => {
            console.log(`Dialog message: ${dialogHandler.message()}`);
            if (dialogHandler.type() === 'confirm') {
                dialogHandler.accept().catch(() => { });
            } else if (dialogHandler.type() === 'prompt') {
                dialogHandler.accept('LeoDas').catch(() => { });
            } else {
                dialogHandler.dismiss().catch(() => { });
            }
        });

        await page.getByRole('button', { name: 'Show Alert Dialog' }).click();
        await page.getByRole('button', { name: 'Show Confirm Dialog' }).click();
        await page.getByRole('button', { name: 'Show Prompt Dialog' }).click();
        await expect(page.locator('#alert-result')).toHaveText('Prompt result: LeoDas');

        //Custom Modals
        await page.getByRole('button', { name: 'Open Modal Dialog' }).click();
        await expect(page.locator('#custom-modal')).toBeVisible();
        await page.locator('#modal-action').click();
    });

    test('Keyboard and Mouse Events Test', async ({ page }) => {
        await page.locator('a[href*="keyboard-mouse"] button').click();
        await page.getByRole('button', { name: /Use Backspace to clear field/ }).click();
        const inputfieldValue = page.locator('#search-field');
        while (true) {
            const inputValue = await inputfieldValue.inputValue();
            if (inputValue === "") {
                break;
            }
            await page.keyboard.press('Backspace');
        }
        await page.keyboard.press('Backspace');
        await page.getByRole('button', { name: /Click to open dialog/ }).click();
        await page.keyboard.press('Enter');
        await page.keyboard.press('Escape');

        await page.locator('#editable-text').dblclick();

        await page.locator('#hover-card').hover({ timeout: 2000 });
    });

    test('Shadow DOM Test', async ({ page }) => {
        await page.getByRole('link', { name: 'Shadow DOM' }).click();
        await page.getByRole('button', { name: 'Create Basic Shadow DOM' }).click();
        await page.getByRole('button', { name: 'Shadow Button' }).click();
        await expect(page.getByText('Great! You clicked the shadow button!')).toBeVisible();
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