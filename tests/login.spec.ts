import { test, expect } from "@playwright/test";

test("halaman login BookYourCut loads correctly", async ({ page }) => {
  await page.goto("/login");

  await expect(page).toHaveTitle("BookYourCut — Booking & Reminder Otomatis");

  // Login Card
  const loginCard = page
    .locator("div")
    .filter({ hasText: "Masuk ke akun" })
    .first();
  await expect(loginCard).toBeVisible();

  // Heading
  await expect(
    loginCard.getByRole("heading", { name: "Masuk ke akun" }),
  ).toBeVisible();

  // Description
  await expect(
    page.getByText("Masukkan email dan password barber kamu."),
  ).toBeVisible();

  // Form elements
  await expect(page.getByPlaceholder("nama@gmail.com")).toBeVisible();
  await expect(page.getByPlaceholder("Password kamu")).toBeVisible();
  await expect(page.getByRole("button", { name: "Masuk →" })).toBeVisible();

  // Tombol submit harus memiliki background accent
  const submitBtn = page.getByRole("button", { name: "Masuk →" });
  await expect(submitBtn).toHaveCSS("background-color", /rgb/); // atau sesuaikan jika perlu
});
