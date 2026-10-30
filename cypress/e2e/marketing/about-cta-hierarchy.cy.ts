/**
 * About page CTA hierarchy: "Get started for free" is the filled primary and
 * comes first, "Contact Sales" is an outline secondary that never carries the
 * primary's weight, and pricing is a quiet link lower on the page instead of
 * a hero button. Needs only the app running:
 *   CYPRESS_baseUrl=http://localhost:3000 \
 *   pnpm cypress run --spec cypress/e2e/marketing/about-cta-hierarchy.cy.ts
 */
const TRANSPARENT = "rgba(0, 0, 0, 0)";

const hero = () => cy.get("h1").first().closest("section");

describe("About page CTA hierarchy", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
    cy.visit("/about");
  });

  it("leads the hero with a filled sign-up CTA, then Contact Sales", () => {
    hero().within(() => {
      cy.get("a").then(($links) => {
        const labels = [...$links].map((el) => el.textContent?.trim());
        expect(labels.slice(0, 2)).to.deep.equal([
          "Get started for free",
          "Contact Sales",
        ]);
      });
      cy.contains("a", "Get started for free")
        .should("have.attr", "href", "/auth/sign-up")
        .find("button")
        .should("not.have.css", "background-color", TRANSPARENT);
      cy.contains("a", "Contact Sales")
        .should("have.attr", "href", "/contact-sales")
        .find("button")
        .should("have.css", "background-color", TRANSPARENT);
    });
  });

  it("has no pricing or product-login button in the hero", () => {
    hero().within(() => {
      cy.contains("View Pricing").should("not.exist");
      cy.contains("Explore the product").should("not.exist");
    });
  });

  it("never gives Contact Sales the filled primary style", () => {
    cy.get("button")
      .filter(":contains('Contact Sales')")
      .should("have.length.at.least", 1)
      .each(($button) => {
        expect(getComputedStyle($button[0]).backgroundColor).to.equal(
          TRANSPARENT
        );
      });
  });

  it("links to pricing lower on the page, below the hero", () => {
    cy.contains("a", "See pricing")
      .should("have.attr", "href", "/pricing")
      .then(($link) => {
        hero().then(($hero) => {
          const heroBottom = $hero[0].getBoundingClientRect().bottom;
          const linkTop = $link[0].getBoundingClientRect().top;
          expect(linkTop).to.be.greaterThan(heroBottom);
        });
      });
  });
});
