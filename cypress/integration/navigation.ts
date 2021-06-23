import { db } from "../../typescript/web-app/src/connectors/database";
import imageSampleCollection from "../../typescript/web-app/src/utils/image-sample-collection";

describe("Labelling tool", () => {
  beforeEach(() => {
    return Promise.all([
      db.image.clear(),
      db.label.clear(),
      db.labelClass.clear(),
      db.file.clear(),
    ]);
  });

  it("Should execute the golden path without errors", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      "http://localhost:3000/images?modal-welcome=closed&modal-update-service-worker=update"
    );
    cy.contains("You don't have any images.").should("be.visible");
    cy.get("header").within(() => {
      cy.contains("Add images").click();
    });
    cy.contains("Import from a list of URLs instead").click();
    cy.get("textarea").type(imageSampleCollection.slice(0, 15).join("\n"), {
      delay: 0,
    });
    cy.contains("Start Import").click();
    cy.get(`[aria-label="Close"]`).click();
    cy.get("main").contains("photo").click();
    cy.get('[aria-label="Drawing tool"]').click();
    // Create new label class
    cy.get('[aria-label="class-selection-menu-trigger"]').click();
    cy.wait(500).focused().type("A new class{enter}"); // TODO: check why we need this waiting time
    cy.get('[aria-label="class-selection-menu-trigger"]').click();
    cy.get('[id="popover-body-class-selection-menu"]')
      .contains("A new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // 1. Create one bounding box
    cy.get("main").click(400, 100);
    cy.get("main").click(600, 200);
    cy.get('[aria-label="Selection tool"]').click();

    // ############## Right click popover tests ##############
    // Create new class
    cy.get("main").rightclick(500, 150);
    cy.focused().type("My new class{enter}");
    cy.get("main").rightclick(500, 150);
    cy.get('[id="popover-body-edit-label-class"]')
      .contains("My new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true"); //TODO: check this with a cypress wizard
    // Check that this new class is set as the label class ID in drawing mode
    cy.get('[aria-label="Drawing tool"]').click();
    cy.contains("My new class").should("be.visible");
    cy.get('[aria-label="Selection tool"]').click();
    // Assign label to class None
    cy.get("main").rightclick(500, 150);
    cy.get('[id="popover-body-edit-label-class"]').contains("None").click();
    cy.get("main").rightclick(500, 150);
    cy.get('[id="popover-body-edit-label-class"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Undo label class assignment
    cy.get('[aria-label="Undo tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.get('[id="popover-body-edit-label-class"]')
      .contains("My new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Redo label class assignment
    cy.get("main").click(350, 50);
    cy.get('[aria-label="Redo tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.get('[id="popover-body-edit-label-class"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Assign label to class My new class
    cy.get('[id="popover-body-edit-label-class"]')
      .contains("My new class")
      .click();
    cy.get("main").rightclick(500, 150);
    cy.get('[id="popover-body-edit-label-class"]')
      .contains("My new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    // ############## Class selection menu tests ##############
    // Create new class and assign it to label
    cy.get('[aria-label="class-selection-menu-trigger"]').click();
    cy.wait(500).focused().type("My other new class{enter}"); // TODO: check why we need this waiting time
    cy.get('[aria-label="class-selection-menu-trigger"]').click();
    cy.get('[id="popover-body-class-selection-menu"]')
      .contains("My other new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Check that this new class is set as the label class ID in drawing mode
    cy.get('[aria-label="Drawing tool"]').click();
    cy.contains("My other new class").should("be.visible");
    cy.get('[aria-label="Selection tool"]').click();
    // Assign label to class None
    cy.get('[aria-label="class-selection-menu-trigger"]').click();
    cy.get('[id="popover-body-class-selection-menu"]').contains("None").click();
    cy.get('[aria-label="class-selection-menu-trigger"]').click();
    cy.get('[id="popover-body-class-selection-menu"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Undo label class assignment
    cy.get('[aria-label="Undo tool"]').click();
    cy.get('[aria-label="class-selection-menu-trigger"]').click();
    cy.get('[id="popover-body-class-selection-menu"]')
      .contains("My other new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    //  Redo label class assignment
    cy.get('[aria-label="class-selection-menu-trigger"]').click();
    cy.get('[aria-label="Redo tool"]').click();
    cy.get('[aria-label="class-selection-menu-trigger"]').click();
    cy.get('[id="popover-body-class-selection-menu"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    //  Assign label to class My other new class
    cy.get('[id="popover-body-class-selection-menu"]')
      .contains("My other new class")
      .click();
    cy.get('[aria-label="class-selection-menu-trigger"]').click();
    cy.get('[id="popover-body-class-selection-menu"]')
      .contains("My other new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Create a new label with a different label class selected in drawing mode
    cy.get('[aria-label="Drawing tool"]').click();
    cy.get('[aria-label="class-selection-menu-trigger"]').click();
    cy.get('[id="popover-body-class-selection-menu"]')
      .contains("My new class")
      .click();
    cy.get("main").click(400, 300);
    cy.get("main").click(600, 400);
    cy.get('[aria-label="Selection tool"]').click();
    cy.get('[aria-label="class-selection-menu-trigger"]').contains(
      "My new class"
    );
    // Image navigation
    cy.get('[aria-label="Next image"]').click();
    cy.get('[aria-label="Undo tool"]').should("be.disabled");

    cy.get("main nav").scrollTo("right");
    cy.get("main nav").within(() => {
      cy.contains("15").closest("a").click();
    });

    cy.get('input[name="current-image"]').should("have.value", "15");
    cy.get('input[name="current-image"]').type("7{enter}");

    cy.get('[aria-current="page"]').should(($a) => {
      expect($a).to.contain("7");
    });
  });
});
