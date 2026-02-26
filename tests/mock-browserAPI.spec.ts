import { test, expect } from '@playwright/test';

test.describe('Mock Browser API', () => {
  test('Mock location as Kanchipuram', async ({ page }) => {
    await page.addInitScript(() => {
       
      const mockGeolocation = {
        getCurrentPosition: (success: any) => {
          success({
            coords: {
              latitude: 12.8295551583876,
              longitude: 79.6999404655303,
              accuracy: 100
            },
            timestamp: Date.now()
          });
        },
        watchPosition: (success: any) => {
          success({
            coords: {
              latitude: 12.8295551583876,
              longitude: 79.6999404655303,
              accuracy: 100
            },
            timestamp: Date.now()
          });
          return 1;
        },
        clearWatch: () => {}
      };
      Object.defineProperty(navigator, 'geolocation', {
        value: mockGeolocation,
        configurable: true
      });
    });
    await page.goto('https://my-location.org/');
    await expect(page.locator('#address')).toContainText('Kancheepuram');
    await page.screenshot({ path: 'mock-geolocation.png' });

  });

});