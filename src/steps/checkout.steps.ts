import { createBdd, DataTable } from 'playwright-bdd';
import { test } from '../fixtures/base.fixture';
import { expect } from '@playwright/test';
import { roundToTwoDecimals } from '../utils/price.util';

const { When, Then } = createBdd(test);

When('the user fills customer information with:', async ({ checkoutStepOnePage }, dataTable: DataTable) => {
  const [row] = dataTable.hashes();
  await checkoutStepOnePage.submitCustomerInfo({
    firstName: row.firstName || '',
    lastName: row.lastName || '',
    postalCode: row.postalCode || '',
  });
});

Then('the order overview should show matching subtotal and tax', async ({ checkoutStepTwoPage, page }) => {
  await expect(page).toHaveURL(/.*checkout-step-two.html/);
  const { itemTotal, tax, total } = await checkoutStepTwoPage.getOrderSummary();
  expect(roundToTwoDecimals(itemTotal + tax)).toBe(total);
});

When('the user confirms the order', async ({ checkoutStepTwoPage }) => {
  await checkoutStepTwoPage.finish();
});

Then('the confirmation header should say {string}', async ({ checkoutCompletePage }, expectedHeader: string) => {
  await expect(checkoutCompletePage.completeHeader).toHaveText(expectedHeader);
});

Then('the shopping cart badge should be empty', async ({ checkoutCompletePage }) => {
  const count = await checkoutCompletePage.header.getCartCount();
  expect(count).toBe(0);
});

Then('a form error message should be displayed saying {string}', async ({ checkoutStepOnePage }, expectedError: string) => {
  await expect(checkoutStepOnePage.errorMessage).toBeVisible();
  const errorText = await checkoutStepOnePage.getErrorMessage();
  expect(errorText).toBe(expectedError);
});
