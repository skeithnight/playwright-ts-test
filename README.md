# 🎭 Playwright TypeScript - Sauce Demo E2E Test Suite

Enterprise-grade End-to-End (E2E) automation test suite built with **Playwright** and **TypeScript**, targeting the [Sauce Demo (Swag Labs)](https://www.saucedemo.com/) e-commerce web application.

---

## 🌟 Key Highlights & Design Patterns

- **Page Object Model (POM) + Component Architecture**: Decouples UI structure and locators from test logic. Modular component structure for shared elements (e.g. Header, Navigation menu).
- **Custom Playwright Fixtures (`test.extend`)**: Dependency injection for clean, readable tests without manual `new PageObject(page)` instantiations.
- **Web-First Assertions & Semantic Locators**: Built using Playwright's auto-retrying locators (`getByRole`, `locator('[data-test="..."]')`) and assertions (`expect(locator).toHaveText(...)`).
- **Dynamic Price & Math Assertions**: Calculates item subtotals and verifies taxation (`subtotal + tax === total`) using financial precision rounding.
- **Strict TypeScript & Type Safety**: Strongly typed interfaces for customer information, product models, and order summaries.
- **Cross-Browser & CI/CD Ready**: Multi-browser execution (Chromium, Firefox, WebKit), trace viewer on retry, failure screenshots/videos, and GitHub Actions workflow.

---

## 🏗️ Project Architecture

```
playwright-ts-test/
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI pipeline
├── src/
│   ├── components/
│   │   └── header.component.ts    # Shared header & navigation drawer
│   ├── constants/
│   │   ├── users.constant.ts      # User credentials & standard error messages
│   │   └── products.constant.ts   # Product catalog fixtures
│   ├── fixtures/
│   │   └── base.fixture.ts        # Custom fixture injecting pre-instantiated POMs
│   ├── pages/
│   │   ├── base.page.ts           # Abstract base page with common helpers
│   │   ├── login.page.ts          # Authentication interactions
│   │   ├── inventory.page.ts      # Product listing, sorting, and cart actions
│   │   ├── cart.page.ts           # Cart review & item removal
│   │   ├── checkout-step-one.page.ts # Shipping / customer info form
│   │   ├── checkout-step-two.page.ts # Order review, tax & total calculation
│   │   └── checkout-complete.page.ts # Confirmation & dispatch verification
│   ├── types/
│   │   └── checkout.types.ts      # Data types & interfaces
│   └── utils/
│       └── price.util.ts          # Currency parser & financial rounding helpers
├── tests/
│   ├── e2e/
│   │   ├── checkout.spec.ts       # Full single & multi-item E2E checkout flows
│   │   └── login.spec.ts          # Authentication happy path & negative cases
│   └── edge-cases/
│       ├── checkout-validation.spec.ts # Missing input validation & cancel routing
│       └── cart-persistence.spec.ts    # Cart removal & state preservation
├── playwright.config.ts           # Multi-browser, reporter, trace & timeout configuration
├── tsconfig.json                  # Strict TypeScript configuration
└── package.json
```

---

## 🧪 Test Suites & Scenarios

### 1. End-to-End Checkout (`tests/e2e/checkout.spec.ts`)
- **Single-Product E2E Flow**:
  1. Login with `standard_user`.
  2. Add product (`Sauce Labs Backpack`) to cart & verify badge counter.
  3. Review cart items, quantity (`1`), and price.
  4. Fill shipping information (`First Name`, `Last Name`, `Postal Code`).
  5. Validate payment method (`SauceCard #31337`), delivery info, and verify mathematical integrity: `Subtotal + Tax === Total`.
  6. Place order, assert `"Thank you for your order!"`, empty cart badge, and navigate back to inventory.
- **Multi-Item Checkout**:
  - Adds 3 items simultaneously, verifies cumulative subtotal against catalog prices and tax calculation.

### 2. Authentication & Security (`tests/e2e/login.spec.ts`)
- Happy path login for `standard_user`.
- Locked-out account validation (`locked_out_user`) with exact error banner assertion.
- Invalid username/password error validation.
- Blank username / blank password validation.
- User logout flow via hamburger sidebar menu.

### 3. Edge Cases & Form Validations (`tests/edge-cases/`)
- Form required fields: Missing First Name, Last Name, and Postal Code error messages.
- Cancel buttons: Verifies correct step-back routing from step 1 (to Cart) and step 2 (to Products).
- Cart persistence: Item removal from cart page and "Continue Shopping" state preservation.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm / yarn / pnpm

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browser binaries
npx playwright install
```

### Running Tests

```bash
# Run all tests headlessly across configured browsers
npm test

# Run tests with interactive UI mode (recommended for debugging)
npm run test:ui

# Run tests in headed browser mode
npm run test:headed

# Run tests on specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Check TypeScript types
npm run typecheck
```

### Viewing Test Reports & Traces
```bash
# Open the latest HTML test report
npm run test:report
```

---

## ⚙️ Continuous Integration (CI)

A GitHub Actions workflow is preconfigured in [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml). It automatically runs on push and PR to `main`, executing tests across browsers and uploading HTML reports as build artifacts.
