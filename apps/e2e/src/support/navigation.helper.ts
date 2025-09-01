import { Page, expect } from '@playwright/test';
import { NavigationPage } from '../pages/navigation.page';
import { TEST_NAVIGATION } from '../fixtures/test-data';

/**
 * Navigation Helper
 * Provides utilities for testing navigation functionality
 */
export class NavigationHelper {
  private page: Page;
  private navigationPage: NavigationPage;

  constructor(page: Page) {
    this.page = page;
    this.navigationPage = new NavigationPage(page);
  }

  /**
   * Navigate to page by URL
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate using navigation menu
   */
  async navigateViaMenu(itemName: string): Promise<void> {
    await this.navigationPage.clickItem(itemName);
  }

  /**
   * Navigate to dashboard
   */
  async goToDashboard(): Promise<void> {
    await this.navigateViaMenu(TEST_NAVIGATION.dashboard.label);
    await this.verifyCurrentPage(TEST_NAVIGATION.dashboard.url);
  }

  /**
   * Navigate to users page
   */
  async goToUsers(): Promise<void> {
    await this.navigateViaMenu(TEST_NAVIGATION.users.label);
    await this.verifyCurrentPage(TEST_NAVIGATION.users.url);
  }

  /**
   * Navigate to profile page
   */
  async goToProfile(): Promise<void> {
    await this.navigateViaMenu(TEST_NAVIGATION.profile.label);
    await this.verifyCurrentPage(TEST_NAVIGATION.profile.url);
  }

  /**
   * Navigate to settings page
   */
  async goToSettings(): Promise<void> {
    await this.navigateViaMenu(TEST_NAVIGATION.settings.label);
    await this.verifyCurrentPage(TEST_NAVIGATION.settings.url);
  }

  /**
   * Verify current page URL
   */
  async verifyCurrentPage(expectedUrl: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedUrl));
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Refresh current page
   */
  async refresh(): Promise<void> {
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Test navigation breadcrumbs
   */
  async testBreadcrumbs(): Promise<void> {
    const breadcrumbSelectors = [
      '[data-testid="breadcrumb"]',
      '.breadcrumb',
      '.breadcrumbs',
      'nav[aria-label="breadcrumb"]',
    ];

    let breadcrumbFound = false;
    for (const selector of breadcrumbSelectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 2000 });
        breadcrumbFound = true;
        break;
      } catch {
        continue;
      }
    }

    if (breadcrumbFound) {
      // Test clicking breadcrumb items
      const breadcrumbLinks = this.page.locator('.breadcrumb a, .breadcrumb button');
      const count = await breadcrumbLinks.count();
      
      if (count > 0) {
        const firstLink = breadcrumbLinks.first();
        await firstLink.click();
        await this.page.waitForLoadState('networkidle');
      }
    }
  }

  /**
   * Test navigation keyboard shortcuts
   */
  async testKeyboardNavigation(): Promise<void> {
    // Test common keyboard shortcuts
    await this.page.keyboard.press('Alt+h'); // Home/Dashboard
    await this.page.waitForTimeout(500);
    
    await this.page.keyboard.press('Alt+p'); // Profile
    await this.page.waitForTimeout(500);
    
    await this.page.keyboard.press('Alt+s'); // Settings
    await this.page.waitForTimeout(500);
  }

  /**
   * Test navigation accessibility
   */
  async testNavigationAccessibility(): Promise<void> {
    await this.navigationPage.verifyAccessibility();
    
    // Test keyboard navigation through menu items
    await this.navigationPage.testKeyboardNavigation();
  }

  /**
   * Verify navigation menu structure
   */
  async verifyNavigationStructure(expectedItems: string[]): Promise<void> {
    await this.navigationPage.verifyNavigationItems(expectedItems);
  }

  /**
   * Test navigation responsiveness
   */
  async testResponsiveNavigation(): Promise<void> {
    // Test desktop navigation
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.page.waitForTimeout(500);
    await this.navigationPage.verifyExpanded();
    
    // Test tablet navigation
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.page.waitForTimeout(500);
    
    // Test mobile navigation
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.page.waitForTimeout(500);
    await this.navigationPage.verifyCollapsed();
    
    // Test mobile toggle
    await this.navigationPage.toggle();
    await this.page.waitForTimeout(300);
    
    // Reset to desktop
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  /**
   * Test navigation state persistence
   */
  async testNavigationStatePersistence(): Promise<void> {
    // Collapse navigation
    await this.navigationPage.collapse();
    const isCollapsed = await this.navigationPage.isCollapsed();
    
    // Refresh page
    await this.refresh();
    
    // Check if state is preserved
    const isStillCollapsed = await this.navigationPage.isCollapsed();
    expect(isStillCollapsed).toBe(isCollapsed);
  }

  /**
   * Test deep linking
   */
  async testDeepLinking(): Promise<void> {
    const testUrls = [
      '/dashboard',
      '/users',
      '/profile',
      '/settings',
    ];

    for (const url of testUrls) {
      await this.navigateTo(url);
      await this.verifyCurrentPage(url);
      
      // Verify page loads correctly
      await this.page.waitForSelector('main, .main-content, [role="main"]', { timeout: 10000 });
    }
  }

  /**
   * Test navigation search functionality
   */
  async testNavigationSearch(): Promise<void> {
    // Test if navigation has search
    const hasSearch = await this.page.locator('[data-testid="nav-search"], .nav-search').count() > 0;
    
    if (hasSearch) {
      await this.navigationPage.search('dash');
      await this.page.waitForTimeout(500);
      
      // Verify filtered results
      const visibleItems = await this.page.locator('.nav-item:visible').count();
      expect(visibleItems).toBeGreaterThan(0);
      
      // Clear search
      await this.navigationPage.clearSearch();
    }
  }

  /**
   * Test sub-menu functionality
   */
  async testSubMenus(): Promise<void> {
    const navigationItems = await this.navigationPage.getNavigationItems();
    
    for (const item of navigationItems) {
      if (item.hasSubMenu) {
        await this.navigationPage.expandSubMenu(item.label);
        await this.page.waitForTimeout(300);
        
        // Verify sub-menu is visible
        const subMenuVisible = await this.page.locator('.sub-menu:visible, .submenu:visible').count() > 0;
        expect(subMenuVisible).toBeTruthy();
        
        await this.navigationPage.collapseSubMenu(item.label);
        await this.page.waitForTimeout(300);
      }
    }
  }

  /**
   * Verify active navigation item
   */
  async verifyActiveItem(expectedItem: string): Promise<void> {
    await this.navigationPage.verifyItemActive(expectedItem);
  }

  /**
   * Test navigation performance
   */
  async testNavigationPerformance(): Promise<void> {
    const startTime = Date.now();
    
    // Navigate between pages and measure time
    const pages = ['/dashboard', '/users', '/profile', '/settings'];
    
    for (const url of pages) {
      const pageStart = Date.now();
      await this.navigateTo(url);
      const pageEnd = Date.now();
      
      const navigationTime = pageEnd - pageStart;
      console.log(`Navigation to ${url}: ${navigationTime}ms`);
      
      // Assert reasonable navigation time (under 3 seconds)
      expect(navigationTime).toBeLessThan(3000);
    }
    
    const totalTime = Date.now() - startTime;
    console.log(`Total navigation test time: ${totalTime}ms`);
  }

  /**
   * Test navigation error handling
   */
  async testNavigationErrorHandling(): Promise<void> {
    // Test navigation to non-existent page
    await this.navigateTo('/non-existent-page');
    
    // Should show 404 page or redirect
    const is404 = await this.page.locator('h1, .error-title').filter({ hasText: /404|not found/i }).count() > 0;
    const wasRedirected = !this.page.url().includes('non-existent-page');
    
    expect(is404 || wasRedirected).toBeTruthy();
  }

  /**
   * Create navigation test suite
   */
  createNavigationTests() {
    return {
      testMenuItems: () => this.testNavigationStructure(),
      testResponsive: () => this.testResponsiveNavigation(),
      testKeyboard: () => this.testKeyboardNavigation(),
      testAccessibility: () => this.testNavigationAccessibility(),
      testSearch: () => this.testNavigationSearch(),
      testSubMenus: () => this.testSubMenus(),
      testPerformance: () => this.testNavigationPerformance(),
      testErrors: () => this.testNavigationErrorHandling(),
      testDeepLinks: () => this.testDeepLinking(),
    };
  }

  /**
   * Test navigation structure
   */
  private async testNavigationStructure(): Promise<void> {
    const expectedItems = Object.values(TEST_NAVIGATION).map(item => item.label);
    await this.verifyNavigationStructure(expectedItems);
  }
}