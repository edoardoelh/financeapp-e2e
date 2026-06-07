import { Browser, BrowserContext, chromium, Page } from '@playwright/test';
import {
  After,
  AfterStep,
  Before,
  IWorldOptions,
  World as CucumberWorld,
  setDefaultTimeout,
  setWorldConstructor,
} from '@cucumber/cucumber';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { BasePage, LocatorDefinition } from './src/pages/BasePage';

const STEP_TIMEOUT_MS = Number(process.env.TIMEOUT_STEP) || 30_000;
const ACTION_TIMEOUT_MS = Number(process.env.ACTION_TIMEOUT) || 10_000;
const NAV_TIMEOUT_MS = Number(process.env.NAV_TIMEOUT) || 30_000;
const USE_DEBUG = process.env.PWDEBUG === '1';

setDefaultTimeout(STEP_TIMEOUT_MS);

type PageKey = 'loginPage' | 'dashboardPage' | 'transactionsPage' | 'budgetPage' | 'reportsPage';

export class World extends CucumberWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  currentPage: PageKey | null = null;

  private readonly pageRegistry = new Map<string, BasePage<Record<string, LocatorDefinition>>>();

  constructor(options: IWorldOptions) {
    super(options);
  }

  getPage<T extends BasePage<Record<string, LocatorDefinition>>>(
    PageClass: new (world: World) => T
  ): T {
    const key = PageClass.name;
    if (!this.pageRegistry.has(key)) {
      this.pageRegistry.set(key, new PageClass(this));
    }
    return this.pageRegistry.get(key) as T;
  }

  clearPageRegistry(): void {
    this.pageRegistry.clear();
  }

  async openBrowser(): Promise<void> {
    this.browser = await chromium.launch({ headless: !USE_DEBUG });
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(ACTION_TIMEOUT_MS);
    this.page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);
    this.currentPage = null;
    this.clearPageRegistry();
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = undefined;
      this.context = undefined;
      this.page = undefined;
    }
  }
}

setWorldConstructor(World);

Before(async function (this: World) {
  await this.openBrowser();
});

After(async function (this: World) {
  await this.closeBrowser();
});

AfterStep(async function (this: World, step) {
  if (!this.page) return;
  const screenshotDir = path.join('reports', 'screenshots');
  mkdirSync(screenshotDir, { recursive: true });
  const fileName = `${step.pickle.name.replace(/\s+/g, '_')}_${Date.now()}.png`;
  const buffer = await this.page.screenshot({ path: path.join(screenshotDir, fileName) });
  this.attach(buffer, 'image/png');
});
