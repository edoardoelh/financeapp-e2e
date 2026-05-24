# Login — Test Plan

## Description

The login page is the entry point to FinanceApp. It contains an email/password
form validated against a single mocked user, an inline error message for
invalid credentials, a language selector (ES / EN) in the top right corner,
and a demo hint with a button that auto-fills the credentials.

Successful login redirects the user to the Dashboard. The mock has no session
persistence — every scenario starts unauthenticated.

## Scope

In scope:

- Form rendering and required-field validation.
- Authentication against the mocked credentials.
- Inline error feedback on invalid input.
- Auto-fill button on the demo hint.
- Language switching of static labels and button text.

Out of scope:

- Password recovery, registration, multi-user flows — none exist in the mock.
- Session persistence and "remember me" — not implemented.
- Brute-force / rate limiting — no backend.

## Test cases

### Happy path — successful login with valid credentials

```gherkin
Scenario: User logs in with valid mocked credentials
  Given the user is on the "Login" page
  When the user fills "email" with "demo@financeapp.com"
  And the user fills "password" with "demo1234"
  And the user clicks "Login"
  Then the user sees the "Dashboard" page
```

### Happy path — auto-fill from demo hint

```gherkin
Scenario: Demo hint button populates the credentials
  Given the user is on the "Login" page
  When the user clicks "auto-fill demo credentials"
  Then the field "email" has value "demo@financeapp.com"
  And the field "password" has value "demo1234"
  When the user clicks "Login"
  Then the user sees the "Dashboard" page
```

### Negative — wrong password

```gherkin
Scenario: Login fails with an incorrect password
  Given the user is on the "Login" page
  When the user fills "email" with "demo@financeapp.com"
  And the user fills "password" with "wrong-password"
  And the user clicks "Login"
  Then the element "credentials error" is visible
  And the user remains on the "Login" page
```

### Negative — unknown email

```gherkin
Scenario: Login fails with an unknown email
  Given the user is on the "Login" page
  When the user fills "email" with "ghost@financeapp.com"
  And the user fills "password" with "demo1234"
  And the user clicks "Login"
  Then the element "credentials error" is visible
  And the user remains on the "Login" page
```

### Edge — empty submission

```gherkin
Scenario: Submitting an empty form does not authenticate
  Given the user is on the "Login" page
  When the user clicks "Login"
  Then the user remains on the "Login" page
  And the element "balance card" is not visible
```

### Edge — malformed email

```gherkin
Scenario: Submitting a malformed email is rejected
  Given the user is on the "Login" page
  When the user fills "email" with "not-an-email"
  And the user fills "password" with "demo1234"
  And the user clicks "Login"
  Then the user remains on the "Login" page
```

### i18n — language selector

```gherkin
Scenario Outline: Language selector changes interface language
  Given the user is on the "Login" page
  When the user selects language "<language>"
  Then the element "submit button" displays text "<submit_text>"
  And the element "email label" displays text "<email_text>"

  Examples:
    | language | submit_text | email_text |
    | English  | Sign in     | Email      |
    | Español  | Entrar      | Correo     |
```

## Out of scope for this feature

- Validating that the language preference persists across navigation —
  covered globally rather than per-feature.
- Visual styling of the error banner — pixel diffs are out of scope project-wide.
