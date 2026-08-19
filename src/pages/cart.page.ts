import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { extractPrice } from '../utils/price.util';

export class CartPage extends BasePage {
  readonly cartList: Locator;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartList = page.locator('[data-test="cart-list"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async goto(): Promise<void> {
    await this.navigate('/cart.html');
  }

  getCartItemByName(productName: string): Locator {
    return this.cartItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }),
    });
  }

  async removeItemByName(productName: string): Promise<void> {
    const item = this.getCartItemByName(productName);
    await item.getByRole('button', { name: /remove/i }).click();
  }

  async getItemQuantity(productName: string): Promise<number> {
    const item = this.getCartItemByName(productName);
    const qtyText = await item.locator('[data-test="item-quantity"]').innerText();
    return parseInt(qtyText.trim(), 10);
  }

  async getItemPrice(productName: string): Promise<number> {
    const item = this.getCartItemByName(productName);
    const priceText = await item.locator('[data-test="inventory-item-price"]').innerText();
    return extractPrice(priceText);
  }

  async getAllCartItemNames(): Promise<string[]> {
    return await this.page.locator('[data-test="inventory-item-name"]').allInnerTexts();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
