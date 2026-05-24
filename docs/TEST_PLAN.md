# FinanceApp — E2E Test Plan

## 1. Objective and scope

This document defines the strategy for the end-to-end automated test suite
targeting the FinanceApp demo. The suite is part of a public QA portfolio and
is intended to demonstrate the design of a maintainable, reusable, and
language-agnostic E2E framework using Cucumber, Playwright and TypeScript.

The goals of the project are:

- Validate the main user flows of FinanceApp through the UI from a real browser.
- Detect the intentional defects embedded in the application source.
- Demonstrate a Page Object Model that scales to forms with shared structure.
- Demonstrate a step convention that maximises reuse and minimises duplication.
- Demonstrate language-independent locators and parametrised i18n testing.

## 2. Application under test

- **Name:** FinanceApp
- **Type:** Single-page web application — personal finance management demo
- **Stack:** React + Vite + TypeScript
- **Backend:** None — all data is mocked in memory; state does not persist between sessions
- **Local URL:** http://localhost:5173
- **Deployed demo:** https://edoardoelh.github.io/Bank_MockUp/
- **Authentication:** single mocked user; demo credentials are exposed on the login page itself
- **Sections (post-login):** Dashboard, Transactions, Budget, Reports, Products

## 3. Test strategy

### 3.1 What is automated and why

| Layer | Automated | Rationale |
|---|---|---|
| Login and authentication flow | Yes | Entry point to every other feature; covers form validation and i18n. |
| Navigation between sections | Yes | Cross-cutting concern reused by every feature. |
| Dashboard rendering and toggles | Yes | Visible KPIs and chart toggle; representative of read-only views. |
| Transactions CRUD (create + filter + search) | Yes | Most interactive flow with form, modal, table and filters. |
| Budget rendering and editing | Yes | Contains an intentional bug that the suite must detect. |
| Reports rendering and filtering | Yes | Contains an intentional bug that the suite must detect. |
| Products contracting / cancelling | Yes | Hierarchical page object structure; representative of polymorphic forms. |
| Language switching | Yes | Verified once via `Scenario Outline` rather than duplicated per feature. |

### 3.2 What is out of scope and why

- **Visual regression / pixel diffing** — out of scope. The mock has no design
  system tokens to anchor against and visual diffs would be brittle for a
  portfolio project focused on functional automation.
- **Performance / load testing** — out of scope. The app is a static mock with
  no backend; latency and throughput data would be meaningless.
- **Accessibility audits (axe, WCAG)** — out of scope as automated checks in
  this iteration. Could be added as a follow-up using `@axe-core/playwright`.
- **API / contract testing** — out of scope. No real backend to test against.
- **Mobile and cross-browser matrices** — out of scope. The framework runs on
  desktop Chromium only; the mock is not optimised for other targets.
- **Persistence across sessions** — out of scope. The application state is
  intentionally non-persistent; tests assume a fresh state per scenario.
- **Security testing** — out of scope. The mock has no real authentication
  surface to assess.

### 3.3 Test design principles

- **Atomic, parametrised steps.** Every step is a low-level action with quoted
  parameters (`When the user fills "email" with "demo@financeapp.com"`).
  Composite steps such as "the user logs in successfully" are not used.
- **Language-independent locators.** Selectors rely on roles, labels, test ids
  or stable structural anchors — never on translated text.
- **i18n via Examples.** Language switching is covered with a single
  `Scenario Outline` per language-affected surface, with one row per language.
- **Page object polymorphism for Products.** A `ProductFormPage` base class
  holds shared form behaviour; one concrete subclass per product form holds
  only its specific fields.
- **Externalised test data.** All inputs, expected texts and credentials live
  in `data/testData.ts`; no hardcoded values inside steps or page objects.

## 4. Coverage summary

| Feature | Happy path | Negative / edge | i18n | Bug detection |
|---|---|---|---|---|
| Login | Yes | Yes | Yes | — |
| Dashboard | Yes | Yes | — | — |
| Transactions | Yes | Yes | — | — |
| Budget | Yes | Yes | — | Yes (`leisure` percentage hidden) |
| Reports | Yes | Yes | — | Yes (month filter no-op) |
| Products | Yes | Yes | — | — |

## 5. Intentional bugs

The application source contains two defects marked `// BUG:`. The suite is
expected to **fail** on the scenarios designed to detect them — failure is the
correct outcome and proves the suite is exercising the right behaviour.

| Bug | Location | Expected behaviour | Actual behaviour | Detecting scenario |
|---|---|---|---|---|
| Missing percentage on `leisure` | `BudgetPage` | Every category row shows a percentage value | The `leisure` row hides the percentage (`omitPercentage = true`) | `budget.md` — *Budget shows percentage for every category* |
| Month filter is a no-op | `ReportsPage` | Selecting a month filters the annual trend table | Selecting a month updates the select but the table is unchanged | `reports.md` — *Annual trend table reacts to the month filter* |

Bug-detecting scenarios are tagged `@bug` so they can be excluded or reported
separately in CI.

## 6. Environment and dependencies

| Item | Value |
|---|---|
| Node.js | 20.x LTS |
| Playwright | latest stable, Chromium only |
| Cucumber.js | 10.x |
| TypeScript | 5.x, strict mode |
| Reporter | `multiple-cucumber-html-reporter` |
| CI | GitHub Actions |

Configuration is driven by environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `BASE_URL` | `http://localhost:5173` | Target app URL |
| `TIMEOUT_STEP` | `30000` | Cucumber step timeout (ms) |
| `ACTION_TIMEOUT` | `10000` | Playwright action timeout (ms) |
| `NAV_TIMEOUT` | `30000` | Playwright navigation timeout (ms) |
| `PWDEBUG` | `0` | `1` to run headed with the inspector |

## 7. Running the suite and generating the report

```bash
npm install
npx playwright install chromium

# Run the full suite
npm test

# Run a single feature
npx cucumber-js features/login.feature

# Run by tag (e.g. only bug detection scenarios)
npx cucumber-js --tags "@bug"

# Generate the HTML report after a run
npm run report
```

The HTML report is produced under `reports/` and is the artefact published by
CI on every pipeline run.
