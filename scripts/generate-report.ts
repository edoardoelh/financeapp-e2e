import { generate } from 'multiple-cucumber-html-reporter';
import { BASE_URL } from '../data/testData';

generate({
  jsonDir: 'reports',
  reportPath: 'reports/html',
  metadata: {
    browser: { name: 'chrome', version: process.env.CHROME_VERSION || 'Chrome' },
    device: process.env.HOSTNAME || 'Local test machine',
    platform: { name: process.platform, version: process.env.OS_VERSION || 'Windows 10' },
  },
  customData: {
    title: 'QA Report — FinanceApp E2E',
    data: [
      { label: 'Project', value: 'financeapp-e2e' },
      { label: 'URL', value: process.env.BASE_URL || BASE_URL },
      { label: 'Generate', value: new Date().toLocaleString() },
    ],
  },
});
