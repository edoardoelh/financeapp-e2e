# Budget — Test Plan

## Description

The Budget page summarises the user's monthly budget. It exposes three KPI
cards (Budgeted, Spent, Available) and a list of categories — each with a
progress bar and a percentage figure. A modal allows the user to edit the
limit assigned to each category.

The page contains an intentional defect: the `leisure` category has its
percentage hidden because the source flag `omitPercentage` is set to `true`
for that category only.

## Scope

In scope:

- Rendering of KPI cards and category list.
- Progress bar and percentage rendering per category.
- Editing a category limit through the modal.
- Detection of the `leisure` percentage bug.

Out of scope:

- Adding or removing categories — the category set is fixed in the mock.
- Validation that limits are non-negative beyond UI constraints — backend logic absent.
- Persistence across sessions — in-memory only.

## Test cases

### Happy path — Budget page renders core widgets

```gherkin
Scenario: Budget page renders the KPI cards and the category list
  Given the user is logged in
  When the user navigates to the "Budget" page
  Then the element "budgeted card" is visible
  And the element "spent card" is visible
  And the element "available card" is visible
  And the element "category list" is visible
```

### Happy path — every category exposes a progress bar

```gherkin
Scenario: Every category in the list shows a progress bar
  Given the user is logged in
  And the user is on the "Budget" page
  Then every row in "category list" has element "progress bar"
```

### Happy path — edit a category limit

```gherkin
Scenario: User updates the limit of a category through the modal
  Given the user is logged in
  And the user is on the "Budget" page
  When the user clicks "edit category" for category "food"
  And the user fills "limit" with "500"
  And the user clicks "save category"
  Then the element "limit" for category "food" displays text "500"
```

### Negative — invalid limit

```gherkin
Scenario: A non-numeric limit is rejected
  Given the user is logged in
  And the user is on the "Budget" page
  When the user clicks "edit category" for category "food"
  And the user fills "limit" with "abc"
  And the user clicks "save category"
  Then the element "edit category modal" is visible
```

### Bug detection — every category should display a percentage

This scenario is expected to **fail** until the `omitPercentage` flag is
removed from the `leisure` category in the source.

```gherkin
@bug
Scenario Outline: Budget shows a percentage for every category
  Given the user is logged in
  And the user is on the "Budget" page
  Then the element "percentage" for category "<category>" is visible

  Examples:
    | category    |
    | food        |
    | transport   |
    | housing     |
    | leisure     |
    | health      |
```

The `leisure` row drives the failure; all other categories pass. Splitting
the assertion per row keeps the failure attributable to the offending category.

## Out of scope for this feature

- Reset / undo on the edit modal — not implemented.
- Confirmation dialogs on save — not implemented.
- Recomputing KPI cards after limit changes — verified at the level of the
  Transactions feature where Spent actually mutates.
