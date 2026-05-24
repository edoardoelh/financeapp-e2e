# Products — Test Plan

## Description

The Products section presents a grid of four products: Cuenta Corriente,
Tarjeta de Crédito, Plan Ahorro and Seguro de Vida. Each tile shows an icon,
the product name, a short description and a status badge. The status is
either `CONTRATADO` (green) or `DISPONIBLE` (grey).

From an available product the user can launch a contracting flow that opens
a product-specific form; once completed, the product status flips to
`CONTRATADO`. From a contracted product the user can launch a cancellation
flow that returns the status to `DISPONIBLE`. State does not persist between
sessions — every scenario starts with the default mock state.

## Architecture note

In the page object model this section is split across two levels:

- `ProductsPage` — the catalog grid.
- `ProductFormPage` — abstract base class with the common form lifecycle
  (open the form, fill, submit, verify resulting state). One concrete
  subclass per product holds only the fields specific to that product.

Test design follows the same split: behaviour shared across all four
products is covered with `Scenario Outline` + `Examples`, and individual
scenarios are reserved for product-specific quirks.

## Scope

In scope:

- Grid renders four products with icon, name, description and status badge.
- Generic contract / cancel flow for every product.
- Status badge transitions from `DISPONIBLE` to `CONTRATADO` and back.
- Validation common to every product form (required fields).

Out of scope:

- Domain validation specific to individual fields beyond required-field checks
  (e.g. credit card Luhn validation, IBAN check digits) — not implemented in
  the mock.
- Persistence of contracted products across sessions — by design the state
  resets on reload.
- Document upload, signature capture, KYC flows — not present.

## Test cases

### Happy path — catalog renders all four products

```gherkin
Scenario Outline: Each product is present in the catalog with required fields
  Given the user is logged in
  When the user navigates to the "Products" page
  Then the element "product card" for product "<product>" is visible
  And the element "product icon" for product "<product>" is visible
  And the element "product name" for product "<product>" is visible
  And the element "product description" for product "<product>" is visible
  And the element "status badge" for product "<product>" is visible

  Examples:
    | product           |
    | cuenta-corriente  |
    | tarjeta-credito   |
    | plan-ahorro       |
    | seguro-vida       |
```

### Happy path — contracting flow (shared across products)

```gherkin
Scenario Outline: User contracts a product from the catalog
  Given the user is logged in
  And the user is on the "Products" page
  And the product "<product>" has status "DISPONIBLE"
  When the user clicks "contract" for product "<product>"
  And the user fills the form for product "<product>" with valid data
  And the user clicks "submit product form"
  Then the element "status badge" for product "<product>" displays text "CONTRATADO"

  Examples:
    | product           |
    | cuenta-corriente  |
    | tarjeta-credito   |
    | plan-ahorro       |
    | seguro-vida       |
```

The step *the user fills the form for product "<product>" with valid data*
delegates to the corresponding `ProductFormPage` subclass — the catalogue of
valid inputs lives in `data/testData.ts`, keyed by product.

### Happy path — cancellation flow (shared across products)

```gherkin
Scenario Outline: User cancels a contracted product
  Given the user is logged in
  And the user is on the "Products" page
  And the product "<product>" has status "CONTRATADO"
  When the user clicks "cancel" for product "<product>"
  And the user clicks "confirm cancellation"
  Then the element "status badge" for product "<product>" displays text "DISPONIBLE"

  Examples:
    | product           |
    | cuenta-corriente  |
    | tarjeta-credito   |
    | plan-ahorro       |
    | seguro-vida       |
```

### Negative — submitting an empty form (shared across products)

```gherkin
Scenario Outline: Submitting an empty product form is blocked
  Given the user is logged in
  And the user is on the "Products" page
  And the product "<product>" has status "DISPONIBLE"
  When the user clicks "contract" for product "<product>"
  And the user clicks "submit product form"
  Then the element "product form" for product "<product>" is visible
  And the element "status badge" for product "<product>" displays text "DISPONIBLE"

  Examples:
    | product           |
    | cuenta-corriente  |
    | tarjeta-credito   |
    | plan-ahorro       |
    | seguro-vida       |
```

### Behaviour — closing the form does not change the status

```gherkin
Scenario Outline: Closing the form without submitting leaves the product as DISPONIBLE
  Given the user is logged in
  And the user is on the "Products" page
  And the product "<product>" has status "DISPONIBLE"
  When the user clicks "contract" for product "<product>"
  And the user clicks "close product form"
  Then the element "status badge" for product "<product>" displays text "DISPONIBLE"

  Examples:
    | product           |
    | cuenta-corriente  |
    | tarjeta-credito   |
    | plan-ahorro       |
    | seguro-vida       |
```

### Product-specific — Tarjeta de Crédito requires a credit limit

Reserved for behaviour unique to one product. Concrete field-level negative
cases live in their own scenarios so the failure points to the offending
product immediately.

```gherkin
Scenario: Tarjeta de Crédito form rejects a non-numeric credit limit
  Given the user is logged in
  And the user is on the "Products" page
  And the product "tarjeta-credito" has status "DISPONIBLE"
  When the user clicks "contract" for product "tarjeta-credito"
  And the user fills "credit limit" with "abc"
  And the user clicks "submit product form"
  Then the element "product form" for product "tarjeta-credito" is visible
  And the element "status badge" for product "tarjeta-credito" displays text "DISPONIBLE"
```

### Product-specific — Plan Ahorro requires a target amount

```gherkin
Scenario: Plan Ahorro form rejects a non-positive target amount
  Given the user is logged in
  And the user is on the "Products" page
  And the product "plan-ahorro" has status "DISPONIBLE"
  When the user clicks "contract" for product "plan-ahorro"
  And the user fills "target amount" with "0"
  And the user clicks "submit product form"
  Then the element "product form" for product "plan-ahorro" is visible
  And the element "status badge" for product "plan-ahorro" displays text "DISPONIBLE"
```

## Out of scope for this feature

- Cross-product workflows (e.g. contracting one product as a precondition for
  another) — no such dependencies exist in the mock.
- Product comparison views — not implemented.
- Pricing calculators or simulators inside the form — not implemented.
- Persistence verification through page reloads — the mock is intentionally
  non-persistent.
