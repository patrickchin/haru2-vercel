import { test, expect } from '@playwright/test';

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
  await page.getByRole('button', { name: 'Logout' }).click();
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

test('submit and wander around', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'get started' }).click();
  await page.waitForURL('/new-project')
  await page.getByRole('button', { name: 'Signin to Submit' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('user@acme.com').click();
  await page.getByPlaceholder('user@acme.com').fill('user1@haru.com');
  await page.getByPlaceholder('user@acme.com').press('Tab');
  // TODO credentials as env variables!!
  await page.locator('input[name="password"]').fill('thisisalongpassword1');;
  await page.locator('input[name="password"]').press('Enter');
  await page.waitForURL('/')
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

  await page.waitForURL('/project/*')
  await expect(page.getByLabel('Description')).toContainText('this is the description of my project');
  await page.getByText('Type: Office Building').click();

  await page.getByRole('tab', { name: 'Teams Progress' }).click();
  await page.getByRole('tab', { name: 'Task Details' }).click();
  await page.getByRole('tab', { name: 'All Files' }).click();
  await page.getByRole('tab', { name: 'Model View' }).click();
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('tab', { name: 'Task Details' }).click();
  await page.getByRole('link', { name: 'Projects' }).click();
  await page.getByRole('heading', { name: 'My Projects' }).click();
  await page.getByRole('link', { name: 'd4b46c21-4cf1-4436-801d-fcf17241e41b - China - Commercial' }).first().click();
  await page.getByRole('tab', { name: 'Settings' }).click();
  // await page.getByRole('button', { name: 'Delete Project' }).click();
});

test('submit and wander around 2', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('user@acme.com').click();
  await page.getByPlaceholder('user@acme.com').fill('user1@haru.com');
  await page.getByPlaceholder('user@acme.com').press('Tab');
  await page.locator('input[name="password"]').fill('thisisalongpassword1');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'get started' }).click();
  await page.getByPlaceholder('Untitled').click();
  await page.getByPlaceholder('Untitled').fill('d4b46c21-4cf1-4436-801d-fcf17241e41b');
  await page.getByLabel('Country').click();
  await page.getByLabel('China').click();
  await page.getByLabel('Building Industry').click();
  await page.getByLabel('Residential').click();
  await page.getByLabel('Building Type').click();
  await page.locator('html').click();
  await page.getByLabel('Building Type').click();
  await page.locator('html').click();
  await page.getByLabel('Building Industry').click();
  await page.getByLabel('Entertainment').click();
  await page.getByLabel('Building Type').click();
  await page.getByLabel('Night Club').click();
  await page.getByPlaceholder('Tell us a little bit about').click();
  await page.getByPlaceholder('Tell us a little bit about').click();
  await page.getByPlaceholder('Tell us a little bit about').fill('aslfajslkdfjalksjdfklajsldfkaj slfka slkfsa djlfasdjfl as');
  await page.locator('label').filter({ hasText: 'LifestyleHow many people will' }).getByRole('button').click();
  await page.getByLabel('LifestyleHow many people will').fill('asdf');
  await page.getByLabel('LifestyleHow many people will').press('Tab');
  await page.locator('label').filter({ hasText: 'Future PlansAre there any' }).getByRole('button').click();
  await page.getByLabel('Future PlansAre there any').fill('sadfsdf');
  await page.getByLabel('Future PlansAre there any').press('Tab');
  await page.locator('label').filter({ hasText: 'Energy Efficiency and' }).getByRole('button').click();
  await page.getByLabel('Energy Efficiency and').fill('asdfasdf');
  await page.getByLabel('Energy Efficiency and').press('Tab');
  await page.locator('label').filter({ hasText: 'Outdoor SpacesDo you have any' }).getByRole('button').click();
  await page.getByLabel('Outdoor SpacesDo you have any').fill('asdf asd ');
  await page.getByLabel('Outdoor SpacesDo you have any').press('Tab');
  await page.locator('label').filter({ hasText: 'Privacy and SecurityHow' }).getByRole('button').click();
  await page.getByLabel('Privacy and SecurityHow').fill('eoiwfio');
  await page.locator('label').filter({ hasText: 'Maintenance PreferenceAre' }).getByRole('button').click();
  await page.getByLabel('Maintenance PreferenceAre').click();
  await page.getByLabel('Maintenance PreferenceAre').fill('erger');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByLabel('Special RequirementsDo you').fill('rejwoir');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByPlaceholder('Tell us a little bit about').click();
  await page.getByPlaceholder('Tell us a little bit about').fill('aslfajslkdfjalksjdfklajsldfkaj slfka slkfsa djlfasdjfl asas dasdf adsf ');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('link', { name: 'Manage Project' }).click();
  await page.getByRole('main').getByRole('link').first().click();
  await page.getByRole('tab', { name: 'Teams Progress' }).click();
  await page.getByRole('button', { name: 'Legal (No assigned lead)' }).click();
  await page.getByRole('button', { name: 'Mechanical, Electrical and' }).click();
  await page.getByRole('button', { name: 'Structural (No assigned lead' }).click();
  await page.getByRole('button', { name: 'Architectural (No assigned' }).click();
  await page.getByRole('tab', { name: 'Task Details' }).click();
  await page.getByRole('tab', { name: 'All Files' }).click();
  await page.getByRole('tab', { name: 'Model View' }).click();
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('tab', { name: 'All Files' }).click();
  await page.getByRole('tab', { name: 'Task Details' }).click();
  await page.getByRole('tab', { name: 'Teams Progress' }).click();
  await page.getByRole('button', { name: 'Legal (No assigned lead)' }).click();
  await page.getByRole('row', { name: 'Title Search pending' }).getByRole('link').nth(1).click();
  await page.locator('div').filter({ hasText: /d4b46c21-4cf1-4436-801d-fcf17241e41b$/ }).getByRole('button').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Teams Progress').getByRole('link').nth(1).click();
  await page.getByRole('button', { name: 'Check for New Comments' }).click();
  await page.getByPlaceholder('Add a comment').click();
  await page.getByPlaceholder('Add a comment').fill('hi');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('div').filter({ hasText: /d4b46c21-4cf1-4436-801d-fcf17241e41b$/ }).getByRole('button').click();
  await page.getByRole('link', { name: 'Projects' }).click();
  await page.getByRole('link', { name: 'd4b46c21-4cf1-4436-801d-fcf17241e41b' }).first().click();
  await page.getByRole('button', { name: 'Logout' }).click();
});

