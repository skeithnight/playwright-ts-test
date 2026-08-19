import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutCompletePage extends BasePage {
  readonly completeContainer: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly ponyExpressImage: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeContainer = page.locator('[data-test="checkout-complete-container"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.ponyExpressImage = page.locator('[data-test="pony-express"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async goto(): Promise<void> {
    await this.navigate('/checkout-complete.html');
  }

  async getConfirmationHeader(): Promise<string> {
    return (await this.completeHeader.innerText()).trim();
  }

  async getConfirmationText(): Promise<string> {
    return (await this.completeText.innerText()).trim();
  }

  async backHome(): Promise<void> {
    await this.backToProductsButton.click();
  }
}
