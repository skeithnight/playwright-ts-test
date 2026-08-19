import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { extractPrice } from '../utils/price.util';

export class InventoryPage extends BasePage {
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async goto(): Promise<void> {
    await this.navigate('/inventory.html');
  }

  getItemLocatorByName(productName: string): Locator {
    return this.inventoryItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }),
    });
  }

  async addItemToCartByName(productName: string): Promise<void> {
    const item = this.getItemLocatorByName(productName);
    await item.getByRole('button', { name: /add to cart/i }).click();
  }

  async removeItemByName(productName: string): Promise<void> {
    const item = this.getItemLocatorByName(productName);
    await item.getByRole('button', { name: /remove/i }).click();
  }

  async isRemoveButtonVisible(productName: string): Promise<boolean> {
    const item = this.getItemLocatorByName(productName);
    return await item.getByRole('button', { name: /remove/i }).isVisible();
  }

  async getItemPriceByName(productName: string): Promise<number> {
    const item = this.getItemLocatorByName(productName);
    const priceText = await item.locator('[data-test="inventory-item-price"]').innerText();
    return extractPrice(priceText);
  }

  async getAllItemNames(): Promise<string[]> {
    return await this.page.locator('[data-test="inventory-item-name"]').allInnerTexts();
  }

  async getAllItemPrices(): Promise<number[]> {
    const priceElements = await this.page.locator('[data-test="inventory-item-price"]').allInnerTexts();
    return priceElements.map((p) => extractPrice(p));
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }
}
