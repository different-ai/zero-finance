import { test, expect } from '@playwright/test';

test('Verify Different AI Inc. business address', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  // 1. Navigate to the search page
  await page.goto('https://bizfileonline.sos.ca.gov/search/business');

  // Wait a bit
  await page.waitForTimeout(5000);

  // DEBUG: Dump page content to console to find selectors
  const content = await page.content();
  console.log('--- PAGE CONTENT START ---');
  console.log(content.substring(0, 5000)); // Print first 5000 chars
  console.log('--- PAGE CONTENT END ---');

  // Try to find ANY input
  const inputs = await page.getByRole('textbox').all();

  console.log(`Found ${inputs.length} textboxes.`);
  for (const input of inputs) {
    const placeholder = await input.getAttribute('placeholder');
    const label = await input.textContent();
    const id = await input.getAttribute('id');
    console.log(`Input: id=${id}, placeholder=${placeholder}, text=${label}`);
  }

  // 2. Search for the business
  // Fallback to finding by typical search attributes if specific labels fail
  let searchInput = page.getByRole('searchbox').first();
  if (!(await searchInput.isVisible())) {
    // Search by generic textbox if searchbox role not used
    searchInput = page.getByPlaceholder(/search/i).first();
  }

  if (!(await searchInput.isVisible())) {
    // Try by specific class or other attributes found in logs if previous failed
    // For now, let's try a very generic "input[type='text']"
    searchInput = page
      .locator('input[type="text"], input[type="search"]')
      .first();
  }

  await searchInput.waitFor({ timeout: 10000 });
  console.log('Found search input, filling...');
  await searchInput.fill('Different AI Inc.');
  await searchInput.press('Enter');

  // 3. Wait for results and click the business
  // We expect a list item or row containing the business name.
  // The site might use a grid or table.
  const businessLink = page
    .getByText('Different AI Inc.', { exact: true })
    .first();
  await businessLink.waitFor({ timeout: 10000 });
  await businessLink.click();

  // 4. Verify the address
  // We need to look for the specific address text.
  // "166 GEARY ST STE 1500 SUITE #482, SAN FRANCISCO, CA 94108"
  // Note: formatting might differ (e.g. multiple lines), so we'll look for parts of it or the whole thing.
  // We'll extract the text of the "Entity Address" or similar section.

  // Wait for the detail view (drawer or new page)
  await page.waitForTimeout(3000); // Give it a moment to load details

  // Capture the full text of the page/drawer to analyze
  const bodyText = await page.evaluate(() => document.body.innerText);

  const expectedAddress =
    '166 GEARY ST STE 1500 SUITE #482, SAN FRANCISCO, CA 94108';

  // Normalize whitespace for comparison
  const normalizedBody = bodyText.replace(/\s+/g, ' ');
  const normalizedExpected = expectedAddress.replace(/\s+/g, ' ');

  console.log('--- ADDRESS VERIFICATION ---');
  if (normalizedBody.includes(normalizedExpected)) {
    console.log(`SUCCESS: Found address: ${expectedAddress}`);
  } else {
    console.log(
      `FAILURE: Address not found exactly. Searching for variations...`,
    );
    // Try to find what address IS listed
    const addressMatch = bodyText.match(/166 GEARY ST.*/i);
    if (addressMatch) {
      console.log(`Found similar address: ${addressMatch[0]}`);
    } else {
      console.log('Could not locate address starting with 166 GEARY ST.');
      // Dump a snippet of text that might contain the address
      console.log('Page text snippet:', bodyText.substring(0, 1000));
    }
  }

  // 5. Look for "File Statement of Information" or "Update Address"
  console.log('--- FILING OPTIONS ---');
  const fileStatementBtn = page
    .getByRole('button', { name: /File Statement of Information/i })
    .or(page.getByText('File Statement of Information'));
  const updateAddressBtn = page
    .getByRole('button', { name: /Update Address/i })
    .or(page.getByText('Update Address'));

  const canFileStatement = await fileStatementBtn.isVisible();
  const canUpdateAddress = await updateAddressBtn.isVisible();

  if (canFileStatement) {
    console.log('Option found: File Statement of Information');
    // Try to click it to see if it prompts for login
    await fileStatementBtn.first().click();
    await page.waitForTimeout(2000);

    if (
      page.url().includes('login') ||
      (await page.getByText(/login|sign in/i).isVisible())
    ) {
      console.log('Action requires login.');
    } else {
      console.log(
        'Action MIGHT NOT require login (no immediate login prompt detected).',
      );
      console.log('Current URL:', page.url());
    }
  } else if (canUpdateAddress) {
    console.log('Option found: Update Address');
    await updateAddressBtn.first().click();
    await page.waitForTimeout(2000);
    if (
      page.url().includes('login') ||
      (await page.getByText(/login|sign in/i).isVisible())
    ) {
      console.log('Action requires login.');
    } else {
      console.log('Action MIGHT NOT require login.');
    }
  } else {
    console.log(
      'No direct "File Statement of Information" or "Update Address" buttons found visible.',
    );
  }
});
