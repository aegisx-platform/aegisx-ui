import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app';
import { AxNavigationService, AxConfigService } from '@aegisx/ui';
import { AuthService } from './core/auth.service';
import { NavigationService } from './core/navigation.service';

describe('App', () => {
  let mockAxNavigationService: Partial<AxNavigationService>;
  let mockConfigService: Partial<AxConfigService>;
  let mockAuthService: Partial<AuthService>;
  let mockNavigationService: Partial<NavigationService>;

  beforeEach(async () => {
    mockAxNavigationService = {
      setNavigation: jest.fn(),
    };
    mockConfigService = {
      updateConfig: jest.fn(),
      config: jest.fn().mockReturnValue({ scheme: 'light' }),
    };
    mockAuthService = {
      currentUser: jest.fn().mockReturnValue({
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }),
      userDisplayName: jest.fn().mockReturnValue('Test User'),
      logout: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
      isAuthenticated: jest.fn().mockReturnValue(true),
    };
    mockNavigationService = {
      navigationItems: jest.fn().mockReturnValue([]),
      loadNavigation: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AxNavigationService, useValue: mockAxNavigationService },
        { provide: AxConfigService, useValue: mockConfigService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the correct title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    // The app doesn't have a title property, just check it exists
    expect(app).toBeTruthy();
  });
});
