import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { CustomerInfo } from '../types/checkout.types';

export class CheckoutStepOnePage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async goto(): Promise<void> {
    await this.navigate('/checkout-step-one.html');
  }

  async fillCustomerInfo(info: Partial<CustomerInfo>): Promise<void> {
    if (info.firstName !== undefined) {
      await this.firstNameInput.fill(info.firstName);
    }
    if (info.lastName !== undefined) {
      await this.lastNameInput.fill(info.lastName);
    }
    if (info.postalCode !== undefined) {
      await this.postalCodeInput.fill(info.postalCode);
    }
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async submitCustomerInfo(info: Partial<CustomerInfo>): Promise<void> {
    await this.fillCustomerInfo(info);
    await this.continue();
  }
}
