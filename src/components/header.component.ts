import { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly headerContainer: Locator;
  readonly appLogo: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly allItemsLink: Locator;
  readonly closeMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerContainer = page.locator('.header_container');
    this.appLogo = page.locator('.app_logo');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.closeMenuButton = page.getByRole('button', { name: 'Close Menu' });
  }

  async openCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async getCartCount(): Promise<number> {
    const isVisible = await this.shoppingCartBadge.isVisible();
    if (!isVisible) {
      return 0;
    }
    const text = await this.shoppingCartBadge.innerText();
    return parseInt(text.trim(), 10) || 0;
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.resetAppStateLink.click();
    await this.closeMenuButton.click();
  }
}
