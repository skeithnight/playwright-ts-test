import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { OrderSummary } from '../types/checkout.types';
import { extractPrice } from '../utils/price.util';

export class CheckoutStepTwoPage extends BasePage {
  readonly cartList: Locator;
  readonly cartItems: Locator;
  readonly paymentInfoLabel: Locator;
  readonly paymentInfoValue: Locator;
  readonly shippingInfoLabel: Locator;
  readonly shippingInfoValue: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartList = page.locator('[data-test="cart-list"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.paymentInfoLabel = page.locator('[data-test="payment-info-label"]');
    this.paymentInfoValue = page.locator('[data-test="payment-info-value"]');
    this.shippingInfoLabel = page.locator('[data-test="shipping-info-label"]');
    this.shippingInfoValue = page.locator('[data-test="shipping-info-value"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async goto(): Promise<void> {
    await this.navigate('/checkout-step-two.html');
  }

  async getPaymentInfo(): Promise<string> {
    return (await this.paymentInfoValue.innerText()).trim();
  }

  async getShippingInfo(): Promise<string> {
    return (await this.shippingInfoValue.innerText()).trim();
  }

  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.innerText();
    return extractPrice(text);
  }

  async getTax(): Promise<number> {
    const text = await this.taxLabel.innerText();
    return extractPrice(text);
  }

  async getTotal(): Promise<number> {
    const text = await this.totalLabel.innerText();
    return extractPrice(text);
  }

  async getOrderSummary(): Promise<OrderSummary> {
    const itemTotal = await this.getSubtotal();
    const tax = await this.getTax();
    const total = await this.getTotal();
    return { itemTotal, tax, total };
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
