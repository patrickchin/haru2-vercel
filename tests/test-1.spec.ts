import { test, expect } from "@playwright/test";

test("check can log in", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toContainText("Login");
  await expect(page.locator("body")).toContainText("Sign Up");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByPlaceholder("user@acme.com").click();
  await page.getByPlaceholder("user@acme.com").fill("user1@haru.com");
  await page.getByPlaceholder("user@acme.com").press("Tab");
  // TODO credentials as env variables!!
  await page.locator('input[name="password"]').fill("thisisalongpassword1");
  await page.locator('input[name="password"]').press("Enter");
  await page.getByRole("link", { name: "get started" }).click();
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByPlaceholder("Untitled").click();
  await page.getByPlaceholder("Untitled").fill("Mr Haru");
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page.locator("body")).toContainText("Login");
});

test.fixme("check incorrect credentials", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByPlaceholder("user@acme.com").click();
  await page
    .getByPlaceholder("user@acme.com")
    .fill("notauser@notawebsite.fake");
  await page.getByPlaceholder("user@acme.com").press("Tab");
  await page.getByLabel("Password").fill("notapassword");
  await page.getByLabel("Password").press("Enter");
  await expect(page).toHaveURL("/login");
  await expect(page.getByText("Use your email and password").isVisible());
});
