# Transactions — Test Plan

## Description

The Transactions page lists every recorded transaction. It exposes three KPI
cards (Monthly Income, Monthly Expenses, Month Balance), a free-text search
bar, a type filter (All / Expenses / Income), the full transactions table,
and a modal to add a new transaction with three fields: concept, amount and
category.

This is the most interactive page in the app; it is the only one that creates
new state through the UI.

## Scope

In scope:

- Rendering of KPI cards, search, filter, and table.
- Adding a new transaction through the modal (happy path and validation).
- Filtering by type.
- Searching by concept text.
- Combining search and filter.

Out of scope:

- Editing or deleting an existing transaction — not implemented in the mock.
- Pagination / infinite scroll — the dataset is small and fully rendered.
- CSV / export functionality — not present.
- Persistence across reloads — state is in-memory only.

## Test cases

### Happy path — page renders core widgets

```gherkin
Scenario: Transactions page renders the KPI cards, filters and table
  Given the user is logged in
  When the user navigates to the "Transactions" page
  Then the element "monthly income card" is visible
  And the element "monthly expenses card" is visible
  And the element "month balance card" is visible
  And the element "search input" is visible
  And the element "type filter" is visible
  And the element "transactions table" is visible
```

### Happy path — add a new transaction

```gherkin
Scenario: User adds a new expense transaction
  Given the user is logged in
  And the user is on the "Transactions" page
  When the user clicks "add transaction"
  And the user fills "concept" with "Coffee"
  And the user fills "amount" with "3.50"
  And the user selects "category" with "food"
  And the user clicks "save transaction"
  Then the element "transactions table" contains a row with "Coffee"
  And the element "transactions table" contains a row with "3.50"
```

### Negative — adding without required fields

```gherkin
Scenario: Submitting the new-transaction modal with empty fields is blocked
  Given the user is logged in
  And the user is on the "Transactions" page
  When the user clicks "add transaction"
  And the user clicks "save transaction"
  Then the element "new transaction modal" is visible
  And the element "transactions table" does not contain a row with ""
```

### Negative — non-numeric amount

```gherkin
Scenario: Non-numeric amount is rejected by the new-transaction modal
  Given the user is logged in
  And the user is on the "Transactions" page
  When the user clicks "add transaction"
  And the user fills "concept" with "Bad amount"
  And the user fills "amount" with "abc"
  And the user selects "category" with "food"
  And the user clicks "save transaction"
  Then the element "new transaction modal" is visible
```

### Filtering — type filter

```gherkin
Scenario Outline: The type filter shows only matching transactions
  Given the user is logged in
  And the user is on the "Transactions" page
  When the user selects "type filter" with "<type>"
  Then every row in "transactions table" has type "<expected_type>"

  Examples:
    | type     | expected_type |
    | Expenses | expense       |
    | Income   | income        |
```

### Filtering — type filter "All" restores the table

```gherkin
Scenario: Selecting "All" restores the full transactions list
  Given the user is logged in
  And the user is on the "Transactions" page
  When the user selects "type filter" with "Expenses"
  And the user selects "type filter" with "All"
  Then the element "transactions table" has at least 1 income row
  And the element "transactions table" has at least 1 expense row
```

### Searching — by concept

```gherkin
Scenario: Searching by concept narrows the table
  Given the user is logged in
  And the user is on the "Transactions" page
  When the user fills "search input" with "rent"
  Then every row in "transactions table" contains "rent"
```

### Searching — no results

```gherkin
Scenario: A search with no matches yields an empty table
  Given the user is logged in
  And the user is on the "Transactions" page
  When the user fills "search input" with "no-such-concept-xyz"
  Then the element "transactions table" has 0 rows
```

### Combined — search and filter together

```gherkin
Scenario: Search and type filter compose
  Given the user is logged in
  And the user is on the "Transactions" page
  When the user selects "type filter" with "Expenses"
  And the user fills "search input" with "groceries"
  Then every row in "transactions table" has type "expense"
  And every row in "transactions table" contains "groceries"
```

### Cross-feature — KPI updates when a transaction is added

```gherkin
Scenario: Monthly Expenses card increases after adding an expense
  Given the user is logged in
  And the user is on the "Transactions" page
  And the value of "monthly expenses card" is captured as "before"
  When the user clicks "add transaction"
  And the user fills "concept" with "Bus ticket"
  And the user fills "amount" with "2.00"
  And the user selects "category" with "transport"
  And the user clicks "save transaction"
  Then the value of "monthly expenses card" is greater than "before"
```

## Out of scope for this feature

- Sorting columns in the table — no sort controls in the mock.
- Bulk import / export — not implemented.
- Transaction editing and deletion — not implemented.
