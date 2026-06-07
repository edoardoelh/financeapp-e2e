import { Then } from '@cucumber/cucumber';
import { World } from '../../world';
import { BasePage, LocatorDefinition } from '../pages/BasePage';
import { LoginPage } from '../pages/LoginPage';

type PageConstructor = new (world: World) => BasePage<Record<string, LocatorDefinition>>;

const PAGE_CLASS_MAP: Record<string, PageConstructor> = {
  loginPage: LoginPage,
  // additional entries added as each page is implemented
};

Then('the user is on the {string} window', async function (this: World, key: string) {
  const PageClass = PAGE_CLASS_MAP[key];
  if (!PageClass) {
    throw new Error(
      `Unknown window: "${key}". Available: ${Object.keys(PAGE_CLASS_MAP).join(', ')}`
    );
  }
  await this.getPage(PageClass).validatePage();
});
