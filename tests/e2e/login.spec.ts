import { test, expect } from '../../src/fixtures/base.fixture';
import { USERS, ERROR_MESSAGES } from '../../src/constants/users.constant';

test.describe('Authentication Suite', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should successfully log in with valid standard user', async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);

    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    await expect(inventoryPage.header.appLogo).toHaveText('Swag Labs');
  });

  test('should display locked-out error message for locked out user', async ({ loginPage }) => {
    await loginPage.login(USERS.LOCKED_OUT.username, USERS.LOCKED_OUT.password);

    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toBe(ERROR_MESSAGES.LOCKED_OUT);
  });

  test('should display error message for invalid credentials', async ({ loginPage }) => {
    await loginPage.login(USERS.INVALID.username, USERS.INVALID.password);

    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('should require username when submitting blank form', async ({ loginPage }) => {
    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toBe(ERROR_MESSAGES.USERNAME_REQUIRED);
  });

  test('should require password when only username is supplied', async ({ loginPage }) => {
    await loginPage.login(USERS.STANDARD.username, '');

    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toBe(ERROR_MESSAGES.PASSWORD_REQUIRED);
  });

  test('should allow a logged-in user to log out via sidebar menu', async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await expect(page).toHaveURL(/.*inventory.html/);

    await inventoryPage.header.logout();
    await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);
    const isLoginFormVisible = await loginPage.isLoginFormVisible();
    expect(isLoginFormVisible).toBe(true);
  });
});
