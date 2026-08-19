import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/base.fixture';
import { expect } from '@playwright/test';

const { When, Then } = createBdd(test);

When('the user navigates to the cart page', async ({ inventoryPage, page }) => {
  await inventoryPage.header.openCart();
  await expect(page).toHaveURL(/.*cart.html/);
});

Then('the cart should contain {string} with quantity {int}', async ({ cartPage }, productName: string, qty: number) => {
  const item = cartPage.getCartItemByName(productName);
  await expect(item).toBeVisible();
  const quantity = await cartPage.getItemQuantity(productName);
  expect(quantity).toBe(qty);
});

Then('the cart should contain {int} items', async ({ cartPage }, expectedCount: number) => {
  const allItems = await cartPage.getAllCartItemNames();
  expect(allItems).toHaveLength(expectedCount);
});

When('the user proceeds to checkout', async ({ cartPage, page }) => {
  await cartPage.proceedToCheckout();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
});

When('the user removes {string} from the cart', async ({ cartPage }, productName: string) => {
  await cartPage.removeItemByName(productName);
});

When('the user clicks Continue Shopping', async ({ cartPage, page }) => {
  await cartPage.continueShopping();
  await expect(page).toHaveURL(/.*inventory.html/);
});

