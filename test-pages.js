import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = 'C:/Users/asnay/.gemini/antigravity-ide/brain/56b20ee6-d528-41c9-bda7-c5815e44def8';
const screenshotDir = path.join(artifactDir, 'screenshots');

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runBrowserTest() {
  console.log('🚀 Launching Headless Chromium Browser Test...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const consoleLogs = [];
  const networkErrors = [];

  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('requestfailed', req => {
    networkErrors.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
  });

  console.log('1️⃣ Navigating to Home Page...');
  await page.goto('https://asnayem1122.github.io/EasyRent/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotDir, '1_home_page.png'), fullPage: true });

  console.log('2️⃣ Navigating to Property Details Page...');
  const propertyLink = page.locator('a[href*="/property/"]').first();
  if (await propertyLink.count() > 0) {
    await propertyLink.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotDir, '2_property_details.png'), fullPage: true });
  }

  console.log('3️⃣ Navigating to Login Page...');
  await page.goto('https://asnayem1122.github.io/EasyRent/login', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotDir, '3_login_page.png'), fullPage: true });

  console.log('4️⃣ Testing Quick Login (Admin)...');
  const adminBtn = page.locator('button:has-text("Admin")');
  if (await adminBtn.count() > 0) {
    await adminBtn.click();
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotDir, '4_admin_dashboard.png'), fullPage: true });
  }

  console.log('5️⃣ Navigating to Register Page...');
  await page.goto('https://asnayem1122.github.io/EasyRent/register', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotDir, '5_register_page.png'), fullPage: true });

  await browser.close();

  console.log('\n📊 TEST RESULTS SUMMARY:');
  console.log(`- Total Console Logs: ${consoleLogs.length}`);
  console.log(`- Total Network Failures: ${networkErrors.length}`);

  fs.writeFileSync(path.join(screenshotDir, 'test_report.json'), JSON.stringify({
    consoleLogs,
    networkErrors
  }, null, 2));

  console.log('✅ Browser Test Completed Successfully!');
}

runBrowserTest().catch(err => {
  console.error('❌ Browser Test Error:', err);
  process.exit(1);
});
