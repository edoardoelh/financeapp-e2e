import { Page, Locator } from '@playwright/test';
import type { World } from '../../world';

export type LocatorDefinition = {
  readonly locator: string;
  readonly alwaysVisible: boolean;
};

export abstract class BasePage<TLocators extends Record<string, LocatorDefinition>> {
  abstract readonly locators: TLocators;
  protected readonly world: World;
  protected readonly page: Page;

  constructor(world: World) {
    this.world = world;
    this.page = world.page!;
  }

  async validatePage(): Promise<void> {
    const timeout = Number(process.env.ACTION_TIMEOUT) || 10_000;
    for (const [name, def] of Object.entries(this.locators)) {
      if (def.alwaysVisible) {
        try {
          await this.page.locator(def.locator).waitFor({ state: 'visible', timeout });
        } catch (error) {
          throw new Error(
            `Element not visible: ${name}. Selector: ${def.locator}. Details: ${String(error)}`
          );
        }
      }
    }
  }

  getLocator(name: keyof TLocators): Locator {
    return this.page.locator(this.locators[name].locator);
  }

  abstract navigateTo(): Promise<void>;
}
