Feature: Login

  @automated @smoke
  Scenario: User accesses the login page
    Given the user navigates to the login page
    Then the user is on the "loginPage" window
