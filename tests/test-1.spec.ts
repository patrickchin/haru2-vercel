import { test, expect } from '@playwright/test';

test('submit and wander around', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'get started' }).click();
  await page.getByPlaceholder('Untitled').click();
  await page.getByPlaceholder('Untitled').fill('My Haru\'s 2024 office renewal');
  await page.getByLabel('Country').click();
  await page.getByLabel('China').click();
  await page.getByLabel('Building Industry').click();
  await page.getByLabel('Residential').click();
  await page.getByLabel('Building Type').click();
  await page.getByLabel('Condominuim').getByText('Condominuim').click();
  await page.getByLabel('Building Industry').click();
  await page.getByLabel('Commercial').click();
  await page.getByLabel('Building Type').click();
  await page.getByLabel('Office Building').click();
  await page.getByPlaceholder('Tell us a little bit about').click();
  await page.getByPlaceholder('Tell us a little bit about').fill('blah blah blah  dsjoifmaoic mew oisoidsa mcsad jofes jf');
  await page.getByPlaceholder('Tell us a little bit about').press('Escape');
  await page.getByLabel('Additional Documents').click();
  await page.getByRole('button', { name: 'Toggle' }).click();
  await page.getByLabel('Lifestyle').click();
  await page.getByLabel('Lifestyle').fill('asic lsadfj oaisjfoisajoifas fdosaid jflksadjcl ks');
  await page.getByLabel('Future Plans').click();
  await page.getByLabel('Future Plans').fill('asd fsa sadc sadfdsa f');
  await page.getByLabel('Energy Efficiency and').fill('ad');
  await page.getByLabel('Energy Efficiency and').click();
  await page.getByLabel('Energy Efficiency and').fill('ad fgtew tr hreh d gs');
  await page.getByLabel('Outdoor Spaces').fill('g');
  await page.getByLabel('Outdoor Spaces').click();
  await page.getByLabel('Outdoor Spaces').fill('g asg rwraw fwefa');
  await page.getByLabel('Privacy and Security').fill('es');
  await page.getByLabel('Privacy and Security').click();
  await page.getByLabel('Privacy and Security').fill('esf ewa fwa gar asg');
  await page.getByLabel('Maintenance Preference').fill('re');
  await page.getByLabel('Maintenance Preference').click();
  await page.getByLabel('Maintenance Preference').fill('re fasd fdsaf sae');
  await page.getByLabel('Special Requirements').click();
  await page.getByLabel('Special Requirements').fill('arg r fae greag sa fsad f');
  await page.getByRole('button', { name: 'Signin to Submit' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('user@acme.com').click();
  await page.getByPlaceholder('user@acme.com').fill('user1@haru.com');
  await page.getByPlaceholder('user@acme.com').press('Tab');
  await page.getByLabel('Password').fill('asdf');
  await page.getByLabel('Password').press('Enter');
  await page.getByRole('link', { name: 'get started' }).click();
  await page.getByPlaceholder('Untitled').click();
  await page.getByPlaceholder('Untitled').dblclick();
  await page.getByPlaceholder('Untitled').fill('asdf');
  await page.getByLabel('Country').click();
  await page.getByLabel('China').click();
  await page.getByLabel('Building Industry').click();
  await page.getByLabel('Residential').click();
  await page.getByLabel('Building Industry').click();
  await page.getByLabel('Commercial').click();
  await page.getByLabel('Building Type').click();
  await page.getByLabel('Office Building').getByText('Office Building').click();
  await page.getByPlaceholder('Tell us a little bit about').click();
  await page.getByPlaceholder('Tell us a little bit about').fill('asdf');
  await page.getByLabel('Additional Documents').click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('heading', { name: 'Design Views' }).click();
  await page.getByText('asdf', { exact: true }).click();
  await page.getByRole('tab', { name: 'Acceptance Status' }).click();
  await page.getByRole('heading', { name: 'Status: pending' }).click();
  await page.getByRole('tab', { name: 'Progress' }).click();
  await page.getByRole('link', { name: 'Projects' }).click();
  await page.getByRole('heading', { name: 'My Projects' }).click();
  await page.getByRole('link', { name: 'asdf - Unknown Location -' }).first().click();

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
  await page.getByLabel('Password').fill('asdf');
  await page.getByLabel('Password').press('Enter');
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