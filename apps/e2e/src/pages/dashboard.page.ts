import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Dashboard Page Object Model
 * Handles dashboard layout, widgets, and main navigation
 */
export class DashboardPage extends BasePage {
  // Selectors
  private readonly selectors = {
    // Main layout
    dashboard: '[data-testid="dashboard"], .dashboard, main',
    header: '[data-testid="header"], header, .header',
    sidebar: '[data-testid="sidebar"], .sidebar, nav',
    content: '[data-testid="content"], .content, .main-content',
    footer: '[data-testid="footer"], footer, .footer',
    
    // Navigation
    navigationToggle: '[data-testid="nav-toggle"], .nav-toggle, .menu-toggle',
    navigationMenu: '[data-testid="nav-menu"], .nav-menu, .navigation',
    navigationItems: '[data-testid="nav-item"], .nav-item, .menu-item',
    
    // User menu
    userMenu: '[data-testid="user-menu"], .user-menu, .profile-menu',
    userAvatar: '[data-testid="user-avatar"], .user-avatar, .profile-avatar',
    userDropdown: '[data-testid="user-dropdown"], .user-dropdown, .profile-dropdown',
    logoutButton: '[data-testid="logout"], .logout, [href*="logout"]',
    profileLink: '[data-testid="profile"], .profile, [href*="profile"]',
    settingsLink: '[data-testid="settings"], .settings, [href*="settings"]',
    
    // Theme toggle
    themeToggle: '[data-testid="theme-toggle"], .theme-toggle, .dark-mode-toggle',
    
    // Dashboard widgets/cards
    welcomeCard: '[data-testid="welcome-card"], .welcome-card, .dashboard-welcome',
    statsCards: '[data-testid="stats-card"], .stats-card, .dashboard-stat',
    recentActivity: '[data-testid="recent-activity"], .recent-activity, .activity-feed',
    quickActions: '[data-testid="quick-actions"], .quick-actions, .action-buttons',
    
    // Loading states
    loadingSpinner: '.loading, .spinner, [data-testid="loading"]',
    skeleton: '.skeleton, .loading-skeleton, [data-testid="skeleton"]',
    
    // Notifications
    notifications: '[data-testid="notifications"], .notifications, .alerts',
    notificationBell: '[data-testid="notification-bell"], .notification-bell, .alerts-bell',
    
    // Search
    searchInput: '[data-testid="search"], input[type="search"], .search-input',
    searchResults: '[data-testid="search-results"], .search-results, .search-dropdown',
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to dashboard
   */
  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
    await this.waitForLoad();
  }

  /**
   * Wait for dashboard to be loaded
   */
  async waitForLoad(): Promise<void> {
    await this.waitForElement(this.selectors.dashboard);
    await this.waitForLoadingComplete();
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete(): Promise<void> {
    const loadingExists = await this.elementExists(this.selectors.loadingSpinner);
    if (loadingExists) {
      await this.waitForElementHidden(this.selectors.loadingSpinner);
    }
    
    const skeletonExists = await this.elementExists(this.selectors.skeleton);
    if (skeletonExists) {
      await this.waitForElementHidden(this.selectors.skeleton);
    }
  }

  /**
   * Toggle navigation sidebar
   */
  async toggleNavigation(): Promise<void> {
    if (await this.elementExists(this.selectors.navigationToggle)) {
      await this.clickElement(this.selectors.navigationToggle);
      await this.page.waitForTimeout(300); // Wait for animation
    }
  }

  /**
   * Click navigation item by text
   */
  async clickNavigationItem(itemText: string): Promise<void> {
    const navItem = this.page.locator(this.selectors.navigationItems)
      .filter({ hasText: itemText });
    await navItem.click();
    await this.waitForNavigation();
  }

  /**
   * Open user menu
   */
  async openUserMenu(): Promise<void> {
    await this.clickElement(this.selectors.userAvatar);
    await this.waitForElement(this.selectors.userDropdown);
  }

  /**
   * Close user menu
   */
  async closeUserMenu(): Promise<void> {
    // Click outside the menu
    await this.page.mouse.click(100, 100);
    await this.waitForElementHidden(this.selectors.userDropdown);
  }

  /**
   * Click logout
   */
  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.clickElement(this.selectors.logoutButton);
    
    // Wait for redirect to login page
    await expect(this.page).toHaveURL(/\/login/, { timeout: 30000 });
  }

  /**
   * Navigate to profile
   */
  async navigateToProfile(): Promise<void> {
    await this.openUserMenu();
    await this.clickElement(this.selectors.profileLink);
    await this.waitForNavigation();
  }

  /**
   * Navigate to settings
   */
  async navigateToSettings(): Promise<void> {
    await this.openUserMenu();
    await this.clickElement(this.selectors.settingsLink);
    await this.waitForNavigation();
  }

  /**
   * Toggle theme (dark/light mode)
   */
  async toggleTheme(): Promise<void> {
    if (await this.elementExists(this.selectors.themeToggle)) {
      await this.clickElement(this.selectors.themeToggle);
      await this.page.waitForTimeout(500); // Wait for theme transition
    }
  }

  /**
   * Search for content
   */
  async search(query: string): Promise<void> {
    if (await this.elementExists(this.selectors.searchInput)) {
      await this.fillInput(this.selectors.searchInput, query);
      await this.pressKey('Enter');
      await this.waitForElement(this.selectors.searchResults);
    }
  }

  /**
   * Get welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    if (await this.elementExists(this.selectors.welcomeCard)) {
      return await this.getElementText(this.selectors.welcomeCard);
    }
    return '';
  }

  /**
   * Get stats card values
   */
  async getStatsCards(): Promise<Array<{ title: string; value: string }>> {
    const cards = this.page.locator(this.selectors.statsCards);
    const count = await cards.count();
    const stats = [];
    
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const title = await card.locator('.title, .label, h3, h4').textContent() ?? '';
      const value = await card.locator('.value, .number, .count').textContent() ?? '';
      stats.push({ title: title.trim(), value: value.trim() });
    }
    
    return stats;
  }

  /**
   * Get recent activity items
   */
  async getRecentActivity(): Promise<string[]> {
    if (await this.elementExists(this.selectors.recentActivity)) {
      const items = this.page.locator(`${this.selectors.recentActivity} .activity-item, .list-item`);
      const count = await items.count();
      const activities = [];
      
      for (let i = 0; i < count; i++) {
        const text = await items.nth(i).textContent() ?? '';
        activities.push(text.trim());
      }
      
      return activities;
    }
    return [];
  }

  /**
   * Verify dashboard is displayed
   */
  async verifyDashboardDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.selectors.dashboard);
    await this.verifyElementVisible(this.selectors.header);
    await this.verifyElementVisible(this.selectors.content);
  }

  /**
   * Verify navigation menu is visible
   */
  async verifyNavigationVisible(): Promise<void> {
    await this.verifyElementVisible(this.selectors.navigationMenu);
  }

  /**
   * Verify navigation menu is hidden
   */
  async verifyNavigationHidden(): Promise<void> {
    // Check if navigation is collapsed or hidden
    const nav = this.page.locator(this.selectors.navigationMenu);
    const isVisible = await nav.isVisible();
    
    if (isVisible) {
      // Check if it has collapsed class or style
      const classes = await nav.getAttribute('class') ?? '';
      const style = await nav.getAttribute('style') ?? '';
      
      const isCollapsed = classes.includes('collapsed') || 
                         classes.includes('hidden') || 
                         style.includes('display: none') ||
                         style.includes('transform: translateX(-');
      
      expect(isCollapsed).toBeTruthy();
    }
  }

  /**
   * Verify user menu is open
   */
  async verifyUserMenuOpen(): Promise<void> {
    await this.verifyElementVisible(this.selectors.userDropdown);
  }

  /**
   * Verify user menu is closed
   */
  async verifyUserMenuClosed(): Promise<void> {
    await this.verifyElementHidden(this.selectors.userDropdown);
  }

  /**
   * Verify current theme
   */
  async verifyTheme(expectedTheme: 'light' | 'dark'): Promise<void> {
    const body = this.page.locator('body');
    const classes = await body.getAttribute('class') ?? '';
    const hasThemeClass = classes.includes(expectedTheme) || 
                         classes.includes(`theme-${expectedTheme}`) ||
                         classes.includes(`${expectedTheme}-theme`);
    
    expect(hasThemeClass).toBeTruthy();
  }

  /**
   * Get current theme
   */
  async getCurrentTheme(): Promise<'light' | 'dark' | 'unknown'> {
    const body = this.page.locator('body');
    const classes = await body.getAttribute('class') ?? '';
    
    if (classes.includes('dark') || classes.includes('theme-dark')) {
      return 'dark';
    } else if (classes.includes('light') || classes.includes('theme-light')) {
      return 'light';
    }
    
    return 'unknown';
  }

  /**
   * Verify notification bell is visible
   */
  async verifyNotificationBellVisible(): Promise<void> {
    if (await this.elementExists(this.selectors.notificationBell)) {
      await this.verifyElementVisible(this.selectors.notificationBell);
    }
  }

  /**
   * Click notification bell
   */
  async clickNotificationBell(): Promise<void> {
    if (await this.elementExists(this.selectors.notificationBell)) {
      await this.clickElement(this.selectors.notificationBell);
    }
  }

  /**
   * Take dashboard screenshot
   */
  async takeDashboardScreenshot(name = 'dashboard'): Promise<void> {
    await this.screenshot(name, { fullPage: true });
  }

  /**
   * Take navigation screenshot
   */
  async takeNavigationScreenshot(name = 'navigation'): Promise<void> {
    await this.screenshot(name);
  }

  /**
   * Verify responsive layout on mobile
   */
  async verifyMobileLayout(): Promise<void> {
    // Set mobile viewport
    await this.setViewportSize(375, 667);
    await this.page.waitForTimeout(500); // Wait for layout adjustment
    
    // Navigation should be hidden or collapsed on mobile
    const navToggleVisible = await this.elementExists(this.selectors.navigationToggle);
    expect(navToggleVisible).toBeTruthy();
    
    // Content should be full width
    await this.verifyElementVisible(this.selectors.content);
  }

  /**
   * Verify responsive layout on desktop
   */
  async verifyDesktopLayout(): Promise<void> {
    // Set desktop viewport
    await this.setViewportSize(1920, 1080);
    await this.page.waitForTimeout(500); // Wait for layout adjustment
    
    // Navigation should be visible
    await this.verifyNavigationVisible();
    
    // All main components should be visible
    await this.verifyDashboardDisplayed();
  }
}