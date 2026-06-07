import { Given } from '@cucumber/cucumber';
import { World } from '../../world';
import { LoginPage } from '../pages/LoginPage';

Given('the user navigates to the login page', async function (this: World) {
  await this.getPage(LoginPage).navigateTo();
  this.currentPage = 'loginPage';
});
