import { test, expect } from "@playwright/test";

const PROJECT_SLUG = "kudoswall-abv5"; // Using the discovered slug

test.describe("Testimonial Submission Flow", () => {
  test("should submit a text testimonial successfully", async ({ page }) => {
    // 1. Navigate to the collection page
    await page.goto(`/collect/${PROJECT_SLUG}`);

    // Verify we are on the right page
    await expect(page).toHaveTitle(/KudosWall/);

    // 2. Rating Step
    // Wait for the stars to be visible
    const stars = page.locator(".group\\/star");
    await expect(stars).toHaveCount(5);

    // Click the 5th star
    await stars.nth(4).click();

    // Click Next Step
    await page.getByRole("button", { name: /Next Step/i }).click();

    // 3. Choice Step
    // Select Text mode
    await page.getByRole("button", { name: /Text/i }).click();

    // 4. Text Content Step
    const textarea = page.locator("textarea#feedback");
    await textarea.fill(
      "This is a great service! I really enjoyed using KudosWall to collect testimonials from my customers. Highly recommended.",
    );

    // Click Next Step
    await page.getByRole("button", { name: /Next Step/i }).click();

    // 5. Details Step
    await page.locator("input#full_name").fill("Test User");
    await page.locator("input#email").fill("test@example.com");
    await page.locator("input#job_title").fill("Quality Assurance");
    await page.locator("input#company").fill("Test Corp");

    // Click Review Testimonial
    await page.getByRole("button", { name: /Review Testimonial/i }).click();

    // 6. Review Step
    // Check consent
    await page.locator("input#cw-consent").check();

    // Submit and wait for the response
    const submitPromise = page.waitForResponse(
      (resp) => resp.url().includes("collect") && resp.status() === 200,
    );
    await page.getByRole("button", { name: /Submit Testimonial/i }).click();
    await submitPromise;

    // 7. Success Step
    // Wait for the success step to be rendered
    try {
      await expect(page.locator(".cw-root")).toContainText(/awesome|thank/i, { timeout: 15000 });
      const text = await page.locator(".cw-root").innerText();
      console.log("Final Success Text:", text);
    } catch (e) {
      const html = await page.locator(".cw-root").innerHTML();
      console.error("Failed to find success message. Current HTML of .cw-root:", html);
      throw e;
    }
  });

  test("should show validation error if testimonial is too short", async ({ page }) => {
    await page.goto(`/collect/${PROJECT_SLUG}`);
    await page.locator(".group\\/star").nth(4).click();
    await page.getByRole("button", { name: /Next Step/i }).click();
    await page.getByRole("button", { name: /Text/i }).click();

    const textarea = page.locator("textarea#feedback");
    await textarea.fill("Too short");

    const nextButton = page.getByRole("button", { name: /Next Step/i });
    await expect(nextButton).toBeDisabled();
  });
});
