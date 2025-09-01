import { chromium, FullConfig } from '@playwright/test';
import path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');

  // Create directory for auth files
  const authDir = path.join(__dirname, '../fixtures/.auth');
  await import('fs').then(fs => 
    fs.promises.mkdir(authDir, { recursive: true })
  );

  // Start browser and login
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:4200';
  
  // Navigate to login page
  await page.goto(`${baseURL}/login`);
  
  // Wait for login form to be visible
  await page.waitForSelector('form', { timeout: 30000 });
  
  // Fill login credentials (using test user from seed data)
  await page.fill('input[name="email"], input[type="email"]', 'admin@aegisx.com');
  await page.fill('input[name="password"], input[type="password"]', 'admin123');
  
  // Submit login form
  await page.click('button[type="submit"]');
  
  // Wait for successful login (redirect to dashboard)
  await page.waitForURL(`${baseURL}/dashboard`, { timeout: 30000 });
  
  // Save authenticated state
  await page.context().storageState({
    path: path.join(authDir, 'user.json')
  });
  
  await browser.close();
  
  console.log('✅ Global setup completed successfully');
}

export default globalSetup;