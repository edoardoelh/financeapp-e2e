module.exports = {
  default: [
    '--require-module ts-node/register',
    '--require world.ts',
    '--require src/steps/**/*.ts',
    '--format progress',
    '--format json:./reports/cucumber-report.json',
    '--format junit:reports/cucumber-report.xml',
  ].join(' '),
};
