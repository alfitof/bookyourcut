import { test, expect } from "@playwright/test";

test("halaman login BookYourCut loads correctly", async ({ page }) => {
  await page.goto("/login");

  await expect(page).toHaveTitle("BookYourCut — Booking & Reminder Otomatis");

  const loginCard = page
    .locator("div")
    .filter({ hasText: "Masuk ke akun" })
    .first();
  await expect(loginCard).toBeVisible();

  await expect(
    loginCard.getByRole("heading", { name: "Masuk ke akun" }),
  ).toBeVisible();

  await expect(
    page.getByText("Masukkan email dan password barber kamu."),
  ).toBeVisible();

  await expect(page.getByPlaceholder("nama@gmail.com")).toBeVisible();
  await expect(page.getByPlaceholder("Password kamu")).toBeVisible();
  await expect(page.getByRole("button", { name: "Masuk →" })).toBeVisible();

  const submitBtn = page.getByRole("button", { name: "Masuk →" });
  await expect(submitBtn).toHaveCSS("background-color", /rgb/);
});
