import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';

export abstract class BasePage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly pageTitle: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigate(path: string = ''): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.innerText()).trim();
  }

  async getTitleText(): Promise<string> {
    return (await this.pageTitle.innerText()).trim();
  }
}
