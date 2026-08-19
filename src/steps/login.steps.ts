import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/base.fixture';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

Given('the user is on the Sauce Demo login page', async ({ loginPage }) => {
  await loginPage.goto();
});

When('the user logs in with username {string} and password {string}', async ({ loginPage }, username: string, password: string) => {
  await loginPage.login(username, password);
});

When('the user submits an empty login form', async ({ loginPage }) => {
  await loginPage.login('', '');
});

Then('an error message should be displayed saying {string}', async ({ loginPage }, expectedError: string) => {
  await expect(loginPage.errorMessage).toBeVisible();
  const errorText = await loginPage.getErrorMessage();
  expect(errorText).toBe(expectedError);
});

When('the user logs out from the sidebar menu', async ({ inventoryPage }) => {
  await inventoryPage.header.logout();
});

Then('the user should be back on the login page', async ({ loginPage, page }) => {
  await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);
  const isVisible = await loginPage.isLoginFormVisible();
  expect(isVisible).toBe(true);
});
