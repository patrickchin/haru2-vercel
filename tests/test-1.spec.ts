import { test, expect } from '@playwright/test';

test('check can log in', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator('body')).toContainText('Login');
  await expect(page.locator('body')).toContainText('Sign Up');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('user@acme.com').click();
  await page.getByPlaceholder('user@acme.com').fill('user1@haru.com');
  await page.getByPlaceholder('user@acme.com').press('Tab');
  await page.getByLabel('Password').fill('asdf');
  await page.getByLabel('Password').press('Enter');
  await page.getByRole('button', { name: 'Kenya' }).click();
  await page.getByRole('link', { name: 'Building Design' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByLabel('Country')).toContainText('Kenya');
  await page.locator('html').click();
  await page.getByPlaceholder('Untitled').click();
  await page.getByPlaceholder('Untitled').fill('Mr Haru');
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.locator('body')).toContainText('Login');
});

test.fixme('check incorrect credentials', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('user@acme.com').click();
  await page.getByPlaceholder('user@acme.com').fill('notauser@notawebsite.fake');
  await page.getByPlaceholder('user@acme.com').press('Tab');
  await page.getByLabel('Password').fill('notapassword');
  await page.getByLabel('Password').press('Enter');
  await expect(page).toHaveURL('http://localhost:3000/login');
  await expect(page.getByText('Use your email and password').isVisible())
});