describe("Dataset creation, edition, deletion", () => {
  it("Should create, rename and delete a dataset", () => {
    cy.setCookie("hasUserTriedApp", "true");
    cy.setCookie("consentedCookies", "true");
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspaceAndDatasets");
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    // cy.visit("/");
    // cy.contains("Try it now").click();
    cy.visit("/cypress-test-workspace/datasets");
    // Delete the dataset that was created with the workspace
    cy.get('[aria-label="delete dataset"]').click();
    cy.get('[aria-label="Dataset delete"]').click();
    cy.get("Test dataset cypress").should("not.exist");
    cy.wait(420);
    cy.get('[aria-label="Create new dataset"]').click();
    cy.get('[aria-label="Dataset name input"]').type("cypress dataset");
    cy.contains("Start Labeling").click();
    cy.contains("cypress dataset");
    cy.contains("0 Images").should("be.visible");
    cy.contains("0 Classes").should("be.visible");
    cy.contains("0 Labels").should("be.visible");
    cy.get('[aria-label="edit dataset"]').click();
    cy.get('[aria-label="Dataset name input"]').clear();
    cy.get('[aria-label="Dataset name input"]').type(
      "{selectall}{backspace}renamed cypress dataset"
    );
    cy.contains("Update Dataset").click();
    cy.contains("renamed cypress dataset");
    cy.get('[aria-label="delete dataset"]').click();
    cy.get('[aria-label="Dataset delete"]').click();
    cy.get('[aria-label="delete dataset"]').should("not.exist");
  });
});
