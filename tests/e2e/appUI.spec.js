// @ts-check
import { test, expect } from "@playwright/test";

test("Check default page heading", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/");
  await expect(
    page.getByRole("heading", { name: "We're launching soon" }),
  ).toBeVisible();
});

test("Check default modal values", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/");
  await page.getByRole("img", { name: "Edit icon" }).click();
  await expect(page.locator("#heading-text-input")).toHaveValue(
    "We're launching soon",
  );

  const currentTime = new Date().toISOString();
  await expect(page.locator("#deadline-input")).toHaveValue(currentTime);
});

test("test", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/");
  await page.getByRole("img", { name: "Edit icon" }).click();

  await page.locator("#heading-text-input").fill("We're launching now");
  await page.locator("#deadline-input").fill("2024-12-31T13:00");
  await expect(page.locator("#heading-primary")).toContainText(
    "We're launching now",
  );
});
