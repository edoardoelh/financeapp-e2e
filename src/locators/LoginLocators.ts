import type { LocatorDefinition } from '../pages/BasePage';

export const LoginLocators = {
  emailInput: {
    locator: '#login-email',
    alwaysVisible: true
  },
  passwordInput: {
    locator: '#login-password',
    alwaysVisible: true
  },
  submitButton: {
    // No data-testid available; scoped to login card to reduce fragility
    locator: '.login-card button[type="submit"]',
    alwaysVisible: true
  },
} as const satisfies Record<string, LocatorDefinition>;
