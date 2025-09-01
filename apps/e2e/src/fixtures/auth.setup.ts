import { test as setup } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Create .auth directory
  await fs.mkdir(path.dirname(authFile), { recursive: true });
  
  // Perform authentication
  await page.goto('/login');
  
  // Wait for login form
  await page.waitForSelector('form');
  
  // Fill login form with test credentials
  await page.fill('input[name="email"], input[type="email"]', 'admin@aegisx.com');
  await page.fill('input[name="password"], input[type="password"]', 'admin123');
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for successful login
  await page.waitForURL('/dashboard');
  
  // Save authentication state
  await page.context().storageState({ path: authFile });
});