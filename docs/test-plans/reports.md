# Reports — Test Plan

## Description

The Reports page presents three views: a six-month monthly balance mini-bar
chart, a category breakdown with percentages, and a twelve-month annual trend
table. A month filter selector sits above the table.

The page contains an intentional defect: the month filter selector updates
its own state but its handler is a no-op — selecting a month does not change
the contents of the annual trend table.

## Scope

In scope:

- Rendering of the three views.
- Month filter — both that the select reflects user input and that it filters
  the annual trend table (this is the bug detection point).
- Category breakdown row count and percentage formatting.

Out of scope:

- Chart rendering correctness for the mini-bars — visual concern.
- Date range customisation — not implemented (fixed 6M / 12M windows).
- Export of reports — not implemented.

## Test cases

### Happy path — Reports page renders the three views

```gherkin
Scenario: Reports page renders mini-bars, category breakdown and annual trend
  Given the user is logged in
  When the user navigates to the "Reports" page
  Then the element "monthly balance mini-bars" is visible
  And the element "category breakdown" is visible
  And the element "annual trend table" is visible
  And the element "month filter" is visible
```

### Happy path — annual trend table has 12 rows

```gherkin
Scenario: The annual trend table shows twelve months
  Given the user is logged in
  And the user is on the "Reports" page
  Then the element "annual trend table" has 12 rows
```

### Happy path — category breakdown percentages sum to ~100

```gherkin
Scenario: Category breakdown percentages add up to approximately 100
  Given the user is logged in
  And the user is on the "Reports" page
  Then the percentages in "category breakdown" sum to "100" with tolerance "1"
```

### Behaviour — selecting a month updates the select control

```gherkin
Scenario: The month filter reflects the user selection
  Given the user is logged in
  And the user is on the "Reports" page
  When the user selects "month filter" with "March"
  Then the field "month filter" has value "March"
```

### Bug detection — annual trend table reacts to the month filter

This scenario is expected to **fail** until the no-op handler in the source is
replaced with one that filters the table.

```gherkin
@bug
Scenario: Annual trend table reacts to the month filter
  Given the user is logged in
  And the user is on the "Reports" page
  And the contents of "annual trend table" are captured as "initial"
  When the user selects "month filter" with "March"
  Then the contents of "annual trend table" differ from "initial"
```

The detection compares table contents before and after the filter is applied.
Because the handler is a no-op the contents are identical and the assertion
fails — exactly the signal the suite is meant to surface.

### Edge — Reports page requires authentication

```gherkin
Scenario: An unauthenticated user cannot reach the Reports page
  Given the user is not logged in
  When the user navigates to the "Reports" page
  Then the user sees the "Login" page
```

## Out of scope for this feature

- Tooltip content on the mini-bars.
- Sorting and column reordering on the annual trend table — not implemented.
- Drill-down from a category breakdown row — not implemented.
