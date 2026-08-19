import { test, expect } from '../../src/fixtures/base.fixture';
import { USERS, ERROR_MESSAGES } from '../../src/constants/users.constant';
import { PRODUCTS } from '../../src/constants/products.constant';

test.describe('Checkout Form Validations & Navigation Edge Cases', () => {
  test.beforeEach(async ({ loginPage, inventoryPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.header.openCart();
    await cartPage.proceedToCheckout();
  });

  test('should validate that First Name is required', async ({ checkoutStepOnePage }) => {
    await checkoutStepOnePage.submitCustomerInfo({
      firstName: '',
      lastName: 'Doe',
      postalCode: '12345',
    });

    await expect(checkoutStepOnePage.errorMessage).toBeVisible();
    const error = await checkoutStepOnePage.getErrorMessage();
    expect(error).toBe(ERROR_MESSAGES.FIRST_NAME_REQUIRED);
  });

  test('should validate that Last Name is required', async ({ checkoutStepOnePage }) => {
    await checkoutStepOnePage.submitCustomerInfo({
      firstName: 'John',
      lastName: '',
      postalCode: '12345',
    });

    await expect(checkoutStepOnePage.errorMessage).toBeVisible();
    const error = await checkoutStepOnePage.getErrorMessage();
    expect(error).toBe(ERROR_MESSAGES.LAST_NAME_REQUIRED);
  });

  test('should validate that Postal Code is required', async ({ checkoutStepOnePage }) => {
    await checkoutStepOnePage.submitCustomerInfo({
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '',
    });

    await expect(checkoutStepOnePage.errorMessage).toBeVisible();
    const error = await checkoutStepOnePage.getErrorMessage();
    expect(error).toBe(ERROR_MESSAGES.POSTAL_CODE_REQUIRED);
  });

  test('should return to cart when clicking Cancel on Step One', async ({
    checkoutStepOnePage,
    cartPage,
    page,
  }) => {
    await checkoutStepOnePage.cancel();
    await expect(page).toHaveURL(/.*cart.html/);
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
  });

  test('should return to inventory when clicking Cancel on Step Two', async ({
    checkoutStepOnePage,
    checkoutStepTwoPage,
    inventoryPage,
    page,
  }) => {
    await checkoutStepOnePage.submitCustomerInfo({
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '12345',
    });

    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await checkoutStepTwoPage.cancel();
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });
});
