import { BasePage } from './BasePage';
import { LoginLocators } from '../locators/LoginLocators';
import { BASE_URL } from '../../data/testData';
import type { World } from '../../world';

export class LoginPage extends BasePage<typeof LoginLocators> {
  readonly locators = LoginLocators;

  constructor(world: World) {
    super(world);
  }

  async navigateTo(): Promise<void> {
    try {
      await this.page.goto(`${BASE_URL}/`);
      await this.validatePage();
    } catch (error) {
      if (error instanceof Error && error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
        throw new Error(
          `Could not access URL: ${BASE_URL}/\n` +
          'Possible causes:\n' +
          '\t- The app is not running on localhost:5173\n' +
          '\t- BASE_URL is incorrect\n\n' +
          `Technical detail:\n\t${error.message}`
        );
      }
      throw error;
    }
  }
}
