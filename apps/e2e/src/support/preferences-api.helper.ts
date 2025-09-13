import { Page, Route } from '@playwright/test';
import { UserPreferences, DEFAULT_USER_PREFERENCES } from '../fixtures/test-data';

/**
 * Helper class for mocking user preferences API endpoints
 */
export class PreferencesApiHelper {
  constructor(private page: Page) {}

  /**
   * Mock successful GET preferences response
   */
  async mockGetPreferences(preferences: UserPreferences = DEFAULT_USER_PREFERENCES): Promise<void> {
    await this.page.route('**/api/profile/preferences', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: preferences
          })
        });
      } else {
        await route.continue();
      }
    });
  }

  /**
   * Mock successful PUT preferences response
   */
  async mockUpdatePreferences(basePreferences: UserPreferences = DEFAULT_USER_PREFERENCES): Promise<void> {
    await this.page.route('**/api/profile/preferences', async (route) => {
      if (route.request().method() === 'PUT') {
        const requestData = JSON.parse(route.request().postData() || '{}');
        const updatedPreferences = this.mergePreferences(basePreferences, requestData);
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: updatedPreferences,
            message: 'Preferences updated successfully!'
          })
        });
      } else {
        await route.continue();
      }
    });
  }

  /**
   * Mock both GET and PUT preferences endpoints
   */
  async mockPreferencesEndpoints(initialPreferences: UserPreferences = DEFAULT_USER_PREFERENCES): Promise<UserPreferences> {
    let currentPreferences = { ...initialPreferences };

    await this.page.route('**/api/profile/preferences', async (route) => {
      const method = route.request().method();

      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: currentPreferences
          })
        });
      } else if (method === 'PUT') {
        const requestData = JSON.parse(route.request().postData() || '{}');
        currentPreferences = this.mergePreferences(currentPreferences, requestData);
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: currentPreferences,
            message: 'Preferences updated successfully!'
          })
        });
      } else {
        await route.continue();
      }
    });

    return currentPreferences;
  }

  /**
   * Mock API error responses
   */
  async mockPreferencesApiError(errorType: 'server' | 'network' | 'validation', errorMessage?: string): Promise<void> {
    await this.page.route('**/api/profile/preferences', async (route) => {
      switch (errorType) {
        case 'server':
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              error: errorMessage || 'Internal server error'
            })
          });
          break;

        case 'network':
          await route.abort('failed');
          break;

        case 'validation':
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              error: errorMessage || 'Validation failed',
              details: {
                language: ['Language code must be 2 characters'],
                timezone: ['Invalid timezone format']
              }
            })
          });
          break;

        default:
          await route.continue();
      }
    });
  }

  /**
   * Mock slow API response for testing loading states
   */
  async mockSlowPreferencesResponse(delayMs: number = 3000): Promise<void> {
    await this.page.route('**/api/profile/preferences', async (route) => {
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: DEFAULT_USER_PREFERENCES
          })
        });
      } else if (route.request().method() === 'PUT') {
        const requestData = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { ...DEFAULT_USER_PREFERENCES, ...requestData },
            message: 'Preferences updated successfully!'
          })
        });
      } else {
        await route.continue();
      }
    });
  }

  /**
   * Track API calls for verification
   */
  async trackApiCalls(): Promise<{ getCalls: any[]; putCalls: any[] }> {
    const getCalls: any[] = [];
    const putCalls: any[] = [];

    await this.page.route('**/api/profile/preferences', async (route) => {
      const request = route.request();
      const method = request.method();

      const callData = {
        method,
        url: request.url(),
        headers: request.headers(),
        timestamp: new Date().toISOString()
      };

      if (method === 'GET') {
        getCalls.push(callData);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: DEFAULT_USER_PREFERENCES
          })
        });
      } else if (method === 'PUT') {
        const requestBody = JSON.parse(request.postData() || '{}');
        putCalls.push({
          ...callData,
          body: requestBody
        });
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { ...DEFAULT_USER_PREFERENCES, ...requestBody },
            message: 'Preferences updated successfully!'
          })
        });
      } else {
        await route.continue();
      }
    });

    return { getCalls, putCalls };
  }

  /**
   * Mock authentication requirement
   */
  async mockAuthenticationRequired(): Promise<void> {
    await this.page.route('**/api/profile/preferences', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Authentication required'
        })
      });
    });
  }

  /**
   * Mock rate limiting
   */
  async mockRateLimiting(): Promise<void> {
    await this.page.route('**/api/profile/preferences', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Too many requests. Please try again later.'
        })
      });
    });
  }

  /**
   * Clean up all route handlers
   */
  async cleanup(): Promise<void> {
    await this.page.unroute('**/api/profile/preferences');
  }

  /**
   * Helper method to merge preferences deeply
   */
  private mergePreferences(base: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
    return {
      ...base,
      ...updates,
      notifications: {
        ...base.notifications,
        ...updates.notifications
      },
      navigation: {
        ...base.navigation,
        ...updates.navigation
      }
    };
  }
}

/**
 * Factory for creating common API mock scenarios
 */
export class PreferencesApiScenarios {
  constructor(private apiHelper: PreferencesApiHelper) {}

  /**
   * Scenario: First time user with default preferences
   */
  async firstTimeUser(): Promise<void> {
    await this.apiHelper.mockPreferencesEndpoints(DEFAULT_USER_PREFERENCES);
  }

  /**
   * Scenario: User with custom dark theme preferences
   */
  async darkThemeUser(): Promise<void> {
    const darkPreferences: UserPreferences = {
      ...DEFAULT_USER_PREFERENCES,
      theme: 'dark',
      scheme: 'dark'
    };
    await this.apiHelper.mockPreferencesEndpoints(darkPreferences);
  }

  /**
   * Scenario: International user with localized preferences
   */
  async internationalUser(): Promise<void> {
    const internationalPreferences: UserPreferences = {
      ...DEFAULT_USER_PREFERENCES,
      language: 'th',
      timezone: 'Asia/Bangkok',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    };
    await this.apiHelper.mockPreferencesEndpoints(internationalPreferences);
  }

  /**
   * Scenario: Enterprise user with specific layout preferences
   */
  async enterpriseUser(): Promise<void> {
    const enterprisePreferences: UserPreferences = {
      ...DEFAULT_USER_PREFERENCES,
      layout: 'enterprise',
      navigation: {
        collapsed: false,
        type: 'default',
        position: 'left'
      }
    };
    await this.apiHelper.mockPreferencesEndpoints(enterprisePreferences);
  }

  /**
   * Scenario: Privacy-conscious user with minimal notifications
   */
  async privacyUser(): Promise<void> {
    const privacyPreferences: UserPreferences = {
      ...DEFAULT_USER_PREFERENCES,
      notifications: {
        email: false,
        push: false,
        desktop: false,
        sound: false
      }
    };
    await this.apiHelper.mockPreferencesEndpoints(privacyPreferences);
  }

  /**
   * Scenario: Power user with all features enabled
   */
  async powerUser(): Promise<void> {
    const powerUserPreferences: UserPreferences = {
      ...DEFAULT_USER_PREFERENCES,
      theme: 'auto',
      layout: 'compact',
      notifications: {
        email: true,
        push: true,
        desktop: true,
        sound: true
      },
      navigation: {
        collapsed: true,
        type: 'compact',
        position: 'left'
      }
    };
    await this.apiHelper.mockPreferencesEndpoints(powerUserPreferences);
  }
}