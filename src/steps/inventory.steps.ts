import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/base.fixture';
import { expect } from '@playwright/test';

const { When, Then } = createBdd(test);

Then('the user should be redirected to the inventory page', async ({ inventoryPage, page }) => {
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(inventoryPage.inventoryContainer).toBeVisible();
});

Then('the application logo should display {string}', async ({ inventoryPage }, expectedLogo: string) => {
  await expect(inventoryPage.header.appLogo).toHaveText(expectedLogo);
});

When('the user adds {string} to the cart', async ({ inventoryPage }, productName: string) => {
  await inventoryPage.addItemToCartByName(productName);
});

Then('the shopping cart badge should show {string}', async ({ inventoryPage }, expectedCount: string) => {
  await expect(inventoryPage.header.shoppingCartBadge).toHaveText(expectedCount);
});
