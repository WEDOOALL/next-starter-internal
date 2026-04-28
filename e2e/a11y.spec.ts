import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * E2E accessibility audit — WCAG 2.1 AA.
 *
 * Fails on any violation rated `serious` or `critical`.
 * Each new page added to the app should add a corresponding test below.
 */

test.describe("Accessibility — WCAG 2.1 AA", () => {
  test("home page has no serious or critical violations", async ({ page }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blockers = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );

    if (blockers.length > 0) {
      console.error("A11y violations:");
      for (const v of blockers) {
        console.error(`  [${v.impact}] ${v.id} — ${v.help}`);
        for (const node of v.nodes.slice(0, 3)) {
          console.error(`    → ${node.target.join(" ")}`);
        }
      }
    }

    expect(blockers).toEqual([]);
  });
});
