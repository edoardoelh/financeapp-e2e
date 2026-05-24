# Dashboard — Test Plan

## Description

The Dashboard is the landing page after login. It displays four KPI cards
(Total Balance, Monthly Expenses, Savings, Investments), an Income vs Expenses
bar chart with a 6M / 12M range toggle, and a list of the four most recent
transactions.

The Dashboard is read-only; it does not mutate state.

## Scope

In scope:

- Rendering of the four stat cards and their values.
- Presence of the bar chart and its 6M / 12M toggle behaviour.
- Recent transactions list shows at most four entries.
- Navigation away from the Dashboard.

Out of scope:

- Numerical correctness of KPI values — driven by mock data fixtures, not by
  user actions; verified at unit level.
- Chart rendering correctness (bar heights, tooltips) — visual concerns.
- Date formatting per locale — covered by the i18n scenario in `login.md`.

## Test cases

### Happy path — Dashboard renders all primary widgets

```gherkin
Scenario: Dashboard shows all KPI cards, the chart and the recent transactions list
  Given the user is logged in
  When the user navigates to the "Dashboard" page
  Then the element "balance card" is visible
  And the element "monthly expenses card" is visible
  And the element "savings card" is visible
  And the element "investments card" is visible
  And the element "income vs expenses chart" is visible
  And the element "recent transactions list" is visible
```

### Happy path — Recent transactions list is bounded

```gherkin
Scenario: The recent transactions list shows at most four entries
  Given the user is logged in
  When the user navigates to the "Dashboard" page
  Then the element "recent transactions list" contains at most 4 items
```

### Behaviour — Chart range toggle

```gherkin
Scenario Outline: The chart range toggle switches between 6 and 12 months
  Given the user is logged in
  And the user is on the "Dashboard" page
  When the user clicks "<toggle>"
  Then the element "income vs expenses chart" has data range "<range>"

  Examples:
    | toggle | range     |
    | 6M     | 6 months  |
    | 12M    | 12 months |
```

### Edge — KPI cards present even when source data is empty

```gherkin
Scenario: KPI cards are still rendered when the underlying figures are zero
  Given the user is logged in
  When the user navigates to the "Dashboard" page
  Then the element "balance card" is visible
  And the element "monthly expenses card" is visible
  And the element "savings card" is visible
  And the element "investments card" is visible
```

### Negative — Dashboard requires authentication

```gherkin
Scenario: An unauthenticated user cannot reach the Dashboard
  Given the user is not logged in
  When the user navigates to the "Dashboard" page
  Then the user sees the "Login" page
```

## Out of scope for this feature

- Chart tooltip content and animation timing.
- KPI numerical recomputation when transactions are added — covered by the
  Transactions feature where the mutation actually happens.
