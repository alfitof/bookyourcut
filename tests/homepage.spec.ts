import { test, expect } from "@playwright/test";

test("BookYourCut homepage loads correctly", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle("BookYourCut — Booking & Reminder Otomatis");

  const heroTitle = page.locator("h1.hero-title");

  await expect(heroTitle).toBeVisible();
  await expect(heroTitle).toContainText("Booking barber jadi mudah");
  await expect(heroTitle).toContainText("reminder otomatis");

  await expect(heroTitle.locator("span")).toContainText("reminder otomatis");
});
