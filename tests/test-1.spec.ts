import { test, expect } from '@playwright/test';

test('submit and wander around', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'get started' }).click();
  await page.getByRole('button', { name: 'Signin to Submit' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('user@acme.com').click();
  await page.getByPlaceholder('user@acme.com').fill('user1@haru.com');
  await page.getByPlaceholder('user@acme.com').press('Tab');
  // TODO credentials as env variables!!
  await page.locator('input[name="password"]').fill('thisisalongpassword1');;
  await page.locator('input[name="password"]').press('Enter');
  await page.getByRole('link', { name: 'get started' }).click();
  await page.getByPlaceholder('Untitled').click();
  await page.getByPlaceholder('Untitled').dblclick();
  await page.getByPlaceholder('Untitled').fill('d4b46c21-4cf1-4436-801d-fcf17241e41b');
  await page.getByLabel('Country').click();
  await page.getByLabel('China').click();
  await page.getByLabel('Building Industry').click();
  await page.getByLabel('Residential').click();
  await page.getByLabel('Building Industry').click();
  await page.getByLabel('Commercial').click();
  await page.getByLabel('Building Type').click();
  await page.getByLabel('Office Building').getByText('Office Building').click();
  await page.getByPlaceholder('Tell us a little bit about').click();
  await page.getByPlaceholder('Tell us a little bit about').fill('this is the description of my project');
  await page.getByLabel('Additional Documents').click();
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByLabel('Description')).toContainText('this is the description of my project');
  await page.getByText('Type: Office Building').click();
  await page.getByRole('tab', { name: 'Progress' }).click();

  await page.getByRole('link', { name: 'Projects' }).click();
  await page.getByRole('heading', { name: 'My Projects' }).click();
  await page.getByRole('link', { name: 'd4b46c21-4cf1-4436-801d-fcf17241e41b - china - commercial' }).first().click();
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Delete Project' }).click();
});

test('check can log in', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toContainText('Login');
  await expect(page.locator('body')).toContainText('Sign Up');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('user@acme.com').click();
  await page.getByPlaceholder('user@acme.com').fill('user1@haru.com');
  await page.getByPlaceholder('user@acme.com').press('Tab');
  // TODO credentials as env variables!!
  await page.locator('input[name="password"]').fill('thisisalongpassword1');;
  await page.locator('input[name="password"]').press('Enter');
  await page.getByRole('link', { name: 'get started' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByPlaceholder('Untitled').click();
  await page.getByPlaceholder('Untitled').fill('Mr Haru');
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.locator('body')).toContainText('Login');
});

test.fixme('check incorrect credentials', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('user@acme.com').click();
  await page.getByPlaceholder('user@acme.com').fill('notauser@notawebsite.fake');
  await page.getByPlaceholder('user@acme.com').press('Tab');
  await page.getByLabel('Password').fill('notapassword');
  await page.getByLabel('Password').press('Enter');
  await expect(page).toHaveURL('/login');
  await expect(page.getByText('Use your email and password').isVisible())
});