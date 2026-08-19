import { test, expect } from '../../src/fixtures/base.fixture';
import { USERS } from '../../src/constants/users.constant';
import { PRODUCTS } from '../../src/constants/products.constant';

test.describe('Cart Operations & State Persistence', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
  });

  test('should allow removing an item directly from the cart page', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.addItemToCartByName(PRODUCTS.BIKE_LIGHT.name);
    await expect(inventoryPage.header.shoppingCartBadge).toHaveText('2');

    await inventoryPage.header.openCart();
    let allItems = await cartPage.getAllCartItemNames();
    expect(allItems).toHaveLength(2);

    await cartPage.removeItemByName(PRODUCTS.BACKPACK.name);

    allItems = await cartPage.getAllCartItemNames();
    expect(allItems).toHaveLength(1);
    expect(allItems).not.toContain(PRODUCTS.BACKPACK.name);
    expect(allItems).toContain(PRODUCTS.BIKE_LIGHT.name);
    await expect(cartPage.header.shoppingCartBadge).toHaveText('1');
  });

  test('should preserve cart contents when using Continue Shopping button', async ({
    inventoryPage,
    cartPage,
    page,
  }) => {
    await inventoryPage.addItemToCartByName(PRODUCTS.BOLT_TSHIRT.name);
    await inventoryPage.header.openCart();

    await cartPage.continueShopping();
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.header.shoppingCartBadge).toHaveText('1');

    // Add another item from inventory
    await inventoryPage.addItemToCartByName(PRODUCTS.ONESIE.name);
    await expect(inventoryPage.header.shoppingCartBadge).toHaveText('2');

    await inventoryPage.header.openCart();
    const allItems = await cartPage.getAllCartItemNames();
    expect(allItems).toContain(PRODUCTS.BOLT_TSHIRT.name);
    expect(allItems).toContain(PRODUCTS.ONESIE.name);
  });
});
