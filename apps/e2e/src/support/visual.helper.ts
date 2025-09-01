import { Page, expect } from '@playwright/test';
import { TEST_VIEWPORTS } from '../fixtures/test-data';

export interface ScreenshotOptions {
  fullPage?: boolean;
  clip?: { x: number; y: number; width: number; height: number };
  animations?: 'disabled' | 'allow';
  mask?: string[];
  threshold?: number;
  maxDiffPixels?: number;
  name?: string;
}

export interface VisualTestConfig {
  viewports?: Array<{ name: string; width: number; height: number }>;
  themes?: string[];
  animations?: boolean;
  maskSelectors?: string[];
}

/**
 * Visual Testing Helper
 * Provides utilities for visual regression testing and screenshot comparison
 */
export class VisualHelper {
  private page: Page;
  private defaultOptions: ScreenshotOptions = {
    fullPage: true,
    animations: 'disabled',
    threshold: 0.2,
    maxDiffPixels: 100,
  };

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Take a screenshot and compare with baseline
   */
  async compareScreenshot(name: string, options: ScreenshotOptions = {}): Promise<void> {
    const screenshotOptions = { ...this.defaultOptions, ...options };
    
    // Disable animations if specified
    if (screenshotOptions.animations === 'disabled') {
      await this.disableAnimations();
    }
    
    // Apply masks if specified
    if (screenshotOptions.mask) {
      await this.maskElements(screenshotOptions.mask);
    }
    
    // Take screenshot and compare
    await expect(this.page).toHaveScreenshot(`${name}.png`, {
      fullPage: screenshotOptions.fullPage,
      clip: screenshotOptions.clip,
      threshold: screenshotOptions.threshold,
      maxDiffPixels: screenshotOptions.maxDiffPixels,
    });
  }

  /**
   * Take screenshot of specific element
   */
  async compareElementScreenshot(
    selector: string, 
    name: string, 
    options: ScreenshotOptions = {}
  ): Promise<void> {
    const element = this.page.locator(selector);
    const screenshotOptions = { ...this.defaultOptions, ...options };
    
    if (screenshotOptions.animations === 'disabled') {
      await this.disableAnimations();
    }
    
    await expect(element).toHaveScreenshot(`${name}.png`, {
      threshold: screenshotOptions.threshold,
      maxDiffPixels: screenshotOptions.maxDiffPixels,
    });
  }

  /**
   * Test responsive design across multiple viewports
   */
  async testResponsiveDesign(
    pageName: string, 
    options: { viewports?: Array<{ name: string; width: number; height: number }> } = {}
  ): Promise<void> {
    const viewports = options.viewports || Object.entries(TEST_VIEWPORTS).map(([name, size]) => ({
      name,
      ...size,
    }));

    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.page.waitForTimeout(500); // Wait for layout adjustment
      
      await this.compareScreenshot(`${pageName}-${viewport.name}`, {
        fullPage: true,
      });
    }

    // Reset to desktop viewport
    await this.page.setViewportSize(TEST_VIEWPORTS.desktop);
  }

  /**
   * Test theme variations
   */
  async testThemeVariations(
    pageName: string, 
    themes: string[] = ['light', 'dark']
  ): Promise<void> {
    for (const theme of themes) {
      await this.setTheme(theme);
      await this.page.waitForTimeout(500); // Wait for theme transition
      
      await this.compareScreenshot(`${pageName}-${theme}`, {
        fullPage: true,
      });
    }
  }

  /**
   * Test component states
   */
  async testComponentStates(
    componentName: string,
    states: Array<{ name: string; action: () => Promise<void> }>
  ): Promise<void> {
    for (const state of states) {
      await state.action();
      await this.page.waitForTimeout(300); // Wait for state change
      
      await this.compareScreenshot(`${componentName}-${state.name}`, {
        fullPage: false,
      });
    }
  }

  /**
   * Disable animations for consistent screenshots
   */
  async disableAnimations(): Promise<void> {
    await this.page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-delay: -1ms !important;
          animation-duration: 1ms !important;
          animation-iteration-count: 1 !important;
          background-attachment: initial !important;
          scroll-behavior: auto !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    });
  }

  /**
   * Enable animations
   */
  async enableAnimations(): Promise<void> {
    await this.page.evaluate(() => {
      const styles = document.querySelectorAll('style');
      styles.forEach(style => {
        if (style.textContent?.includes('animation-duration: 1ms')) {
          style.remove();
        }
      });
    });
  }

  /**
   * Mask dynamic elements
   */
  async maskElements(selectors: string[]): Promise<void> {
    for (const selector of selectors) {
      try {
        await this.page.locator(selector).evaluate((element) => {
          (element as HTMLElement).style.backgroundColor = '#ff0000';
          (element as HTMLElement).style.color = 'transparent';
        });
      } catch {
        // Element might not exist, continue
      }
    }
  }

  /**
   * Set theme for testing
   */
  async setTheme(theme: string): Promise<void> {
    await this.page.evaluate((themeName) => {
      document.body.setAttribute('data-theme', themeName);
      document.body.className = document.body.className
        .replace(/theme-\w+/g, '')
        .replace(/\b(light|dark)\b/g, '') + ` theme-${themeName}`;
    }, theme);
  }

  /**
   * Wait for images to load
   */
  async waitForImagesLoad(): Promise<void> {
    await this.page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      await Promise.all(
        images
          .filter(img => !img.complete)
          .map(img => new Promise(resolve => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
          }))
      );
    });
  }

  /**
   * Wait for fonts to load
   */
  async waitForFontsLoad(): Promise<void> {
    await this.page.evaluate(async () => {
      if ('fonts' in document) {
        await (document as any).fonts.ready;
      }
    });
  }

  /**
   * Prepare page for consistent screenshots
   */
  async preparePage(): Promise<void> {
    // Wait for network idle
    await this.page.waitForLoadState('networkidle');
    
    // Wait for images and fonts
    await this.waitForImagesLoad();
    await this.waitForFontsLoad();
    
    // Hide scrollbars
    await this.page.addStyleTag({
      content: `
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `,
    });
    
    // Disable animations by default
    await this.disableAnimations();
    
    // Small delay to ensure everything is settled
    await this.page.waitForTimeout(500);
  }

  /**
   * Compare page with different user interactions
   */
  async testInteractionStates(
    pageName: string,
    interactions: Array<{ name: string; selector: string; action: 'hover' | 'focus' | 'click' }>
  ): Promise<void> {
    for (const interaction of interactions) {
      try {
        const element = this.page.locator(interaction.selector);
        
        switch (interaction.action) {
          case 'hover':
            await element.hover();
            break;
          case 'focus':
            await element.focus();
            break;
          case 'click':
            await element.click();
            break;
        }
        
        await this.page.waitForTimeout(300);
        await this.compareScreenshot(`${pageName}-${interaction.name}`);
      } catch (error) {
        console.warn(`Failed to test interaction ${interaction.name}:`, error);
      }
    }
  }

  /**
   * Generate baseline screenshots
   */
  async generateBaselines(
    pages: Array<{ name: string; url: string }>,
    config: VisualTestConfig = {}
  ): Promise<void> {
    const viewports = config.viewports || Object.entries(TEST_VIEWPORTS).map(([name, size]) => ({
      name,
      ...size,
    }));
    
    const themes = config.themes || ['light', 'dark'];

    for (const page of pages) {
      await this.page.goto(page.url);
      await this.preparePage();
      
      // Test different viewports
      for (const viewport of viewports) {
        await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
        await this.page.waitForTimeout(500);
        
        // Test different themes
        for (const theme of themes) {
          await this.setTheme(theme);
          await this.page.waitForTimeout(500);
          
          await this.compareScreenshot(`${page.name}-${viewport.name}-${theme}`);
        }
      }
    }
  }

  /**
   * Test loading states
   */
  async testLoadingStates(
    componentName: string,
    loadingActions: Array<{ name: string; action: () => Promise<void> }>
  ): Promise<void> {
    for (const loadingAction of loadingActions) {
      // Start the action that triggers loading
      const actionPromise = loadingAction.action();
      
      // Wait a bit for loading state to appear
      await this.page.waitForTimeout(100);
      
      // Take screenshot of loading state
      try {
        await this.compareScreenshot(`${componentName}-loading-${loadingAction.name}`);
      } catch {
        // Loading state might be too fast
      }
      
      // Wait for action to complete
      await actionPromise;
      
      // Take screenshot of loaded state
      await this.compareScreenshot(`${componentName}-loaded-${loadingAction.name}`);
    }
  }

  /**
   * Test error states
   */
  async testErrorStates(
    componentName: string,
    errorTriggers: Array<{ name: string; trigger: () => Promise<void> }>
  ): Promise<void> {
    for (const errorTrigger of errorTriggers) {
      await errorTrigger.trigger();
      await this.page.waitForTimeout(500);
      
      await this.compareScreenshot(`${componentName}-error-${errorTrigger.name}`);
    }
  }

  /**
   * Create visual test suite for a page
   */
  createPageVisualTests(pageName: string, url: string) {
    return {
      baseline: () => this.testBaseline(pageName, url),
      responsive: () => this.testPageResponsive(pageName, url),
      themes: () => this.testPageThemes(pageName, url),
      interactions: (interactions: any[]) => this.testPageInteractions(pageName, url, interactions),
    };
  }

  private async testBaseline(pageName: string, url: string): Promise<void> {
    await this.page.goto(url);
    await this.preparePage();
    await this.compareScreenshot(`${pageName}-baseline`);
  }

  private async testPageResponsive(pageName: string, url: string): Promise<void> {
    await this.page.goto(url);
    await this.preparePage();
    await this.testResponsiveDesign(pageName);
  }

  private async testPageThemes(pageName: string, url: string): Promise<void> {
    await this.page.goto(url);
    await this.preparePage();
    await this.testThemeVariations(pageName);
  }

  private async testPageInteractions(
    pageName: string, 
    url: string, 
    interactions: any[]
  ): Promise<void> {
    await this.page.goto(url);
    await this.preparePage();
    await this.testInteractionStates(pageName, interactions);
  }
}