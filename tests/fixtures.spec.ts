import { test, expect } from '../fixtures/login-fixture';

test.use({storageState:undefined}); // Clear storage state for this test file

test.beforeEach(async ({ authenticatedPage }, testInfo) => {
    console.log('Running Test:', testInfo.title);
    await authenticatedPage.goto('https://www.learnaqa.info/dashboard');
});

test('Drag and Drop Fixture Test', async ({ authenticatedPage }) => {
    await authenticatedPage.getByRole('link', { name: 'Drag and Drop' }).click();
    await expect(authenticatedPage.getByText('Learn to test drag and drop interactions')).toBeVisible();
    const draggableItems = authenticatedPage.locator("div[id^='item']");
    const draggableItemsCount = await draggableItems.count();
    const dropZone = authenticatedPage.locator('#drop-zone');
    for (let i = 0; i < draggableItemsCount; i++) {
        await draggableItems.first().dragTo(dropZone);
    }
    await expect(authenticatedPage.locator('.text-center')).toContainText('All items have been moved to the drop zone!');
});