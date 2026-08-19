import { test, expect } from '../../src/fixtures/base.fixture';
import { USERS } from '../../src/constants/users.constant';
import { PRODUCTS } from '../../src/constants/products.constant';
import { roundToTwoDecimals } from '../../src/utils/price.util';

test.describe('E2E Checkout User Journey', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should complete standard E2E checkout journey for a single product', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
    page,
  }) => {
    // -------------------------------------------------------------
    // Step 1: User Login
    // -------------------------------------------------------------
    await test.step('Authenticate with standard user credentials', async () => {
      await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(inventoryPage.inventoryContainer).toBeVisible();
      await expect(inventoryPage.pageTitle).toHaveText('Products');
    });

    // -------------------------------------------------------------
    // Step 2: Product Selection & Add to Cart
    // -------------------------------------------------------------
    const targetProduct = PRODUCTS.BACKPACK;
    await test.step(`Add "${targetProduct.name}" to cart`, async () => {
      await inventoryPage.addItemToCartByName(targetProduct.name);
      await expect(inventoryPage.header.shoppingCartBadge).toHaveText('1');
      const isRemoveVisible = await inventoryPage.isRemoveButtonVisible(targetProduct.name);
      expect(isRemoveVisible).toBe(true);
    });

    // -------------------------------------------------------------
    // Step 3: Cart Review
    // -------------------------------------------------------------
    await test.step('Navigate to Cart and verify selected item details', async () => {
      await inventoryPage.header.openCart();
      await expect(page).toHaveURL(/.*cart.html/);
      await expect(cartPage.pageTitle).toHaveText('Your Cart');

      const cartItem = cartPage.getCartItemByName(targetProduct.name);
      await expect(cartItem).toBeVisible();
      await expect(cartItem.locator('[data-test="inventory-item-name"]')).toHaveText(targetProduct.name);
      await expect(cartItem.locator('[data-test="item-quantity"]')).toHaveText('1');

      const itemPrice = await cartPage.getItemPrice(targetProduct.name);
      expect(itemPrice).toBe(targetProduct.price);
    });

    // -------------------------------------------------------------
    // Step 4: Form Submission (Shipping/Billing Info)
    // -------------------------------------------------------------
    await test.step('Proceed to checkout and fill customer information', async () => {
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(/.*checkout-step-one.html/);
      await expect(checkoutStepOnePage.pageTitle).toHaveText('Checkout: Your Information');

      await checkoutStepOnePage.submitCustomerInfo({
        firstName: 'Dwiki',
        lastName: 'Nugraha',
        postalCode: '12345',
      });
    });

    // -------------------------------------------------------------
    // Step 5: Payment & Overview Verification
    // -------------------------------------------------------------
    await test.step('Verify payment method, shipping details, and price calculations', async () => {
      await expect(page).toHaveURL(/.*checkout-step-two.html/);
      await expect(checkoutStepTwoPage.pageTitle).toHaveText('Checkout: Overview');

      // Verify payment and shipping info
      const paymentInfo = await checkoutStepTwoPage.getPaymentInfo();
      expect(paymentInfo).toContain('SauceCard #31337');

      const shippingInfo = await checkoutStepTwoPage.getShippingInfo();
      expect(shippingInfo).toContain('Free Pony Express Delivery!');

      // Mathematical price verification: Subtotal + Tax = Total
      const { itemTotal, tax, total } = await checkoutStepTwoPage.getOrderSummary();
      expect(itemTotal).toBe(targetProduct.price);
      expect(roundToTwoDecimals(itemTotal + tax)).toBe(total);

      // Finish order
      await checkoutStepTwoPage.finish();
    });

    // -------------------------------------------------------------
    // Step 6: Confirmation Screen Verification
    // -------------------------------------------------------------
    await test.step('Verify successful order placement and return to home', async () => {
      await expect(page).toHaveURL(/.*checkout-complete.html/);
      await expect(checkoutCompletePage.pageTitle).toHaveText('Checkout: Complete!');
      await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
      await expect(checkoutCompletePage.completeText).toContainText(
        'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
      );
      await expect(checkoutCompletePage.ponyExpressImage).toBeVisible();

      // Ensure shopping cart is now empty
      const cartCount = await checkoutCompletePage.header.getCartCount();
      expect(cartCount).toBe(0);

      // Navigate back home
      await checkoutCompletePage.backHome();
      await expect(page).toHaveURL(/.*inventory.html/);
    });
  });

  test('should accurately calculate taxes and total for multi-item checkout', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
    page,
  }) => {
    const selectedProducts = [PRODUCTS.BACKPACK, PRODUCTS.BIKE_LIGHT, PRODUCTS.FLEECE_JACKET];
    const expectedSubtotal = roundToTwoDecimals(
      selectedProducts.reduce((sum, product) => sum + product.price, 0)
    );

    await test.step('Login and add multiple products to cart', async () => {
      await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);

      for (const product of selectedProducts) {
        await inventoryPage.addItemToCartByName(product.name);
      }

      await expect(inventoryPage.header.shoppingCartBadge).toHaveText(String(selectedProducts.length));
    });

    await test.step('Review multi-item cart', async () => {
      await inventoryPage.header.openCart();
      const allCartItems = await cartPage.getAllCartItemNames();
      expect(allCartItems).toHaveLength(selectedProducts.length);

      for (const product of selectedProducts) {
        expect(allCartItems).toContain(product.name);
      }
    });

    await test.step('Submit checkout form', async () => {
      await cartPage.proceedToCheckout();
      await checkoutStepOnePage.submitCustomerInfo({
        firstName: 'Jane',
        lastName: 'Doe',
        postalCode: '90210',
      });
    });

    await test.step('Verify multi-item totals and calculations', async () => {
      await expect(page).toHaveURL(/.*checkout-step-two.html/);
      const { itemTotal, tax, total } = await checkoutStepTwoPage.getOrderSummary();

      expect(itemTotal).toBe(expectedSubtotal);
      expect(roundToTwoDecimals(itemTotal + tax)).toBe(total);

      await checkoutStepTwoPage.finish();
      await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    });
  });
});
