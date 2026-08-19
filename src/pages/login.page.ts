import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.loginContainer = page.locator('.login_container');
  }

  async goto(): Promise<void> {
    await this.navigate('/');
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  async login(username?: string, password?: string): Promise<void> {
    if (username !== undefined && username !== '') {
      await this.usernameInput.fill(username);
    } else if (username === '') {
      await this.usernameInput.clear();
    }

    if (password !== undefined && password !== '') {
      await this.passwordInput.fill(password);
    } else if (password === '') {
      await this.passwordInput.clear();
    }

    await this.loginButton.click();
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }
}
