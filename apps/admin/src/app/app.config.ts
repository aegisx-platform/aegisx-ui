import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  APP_INITIALIZER,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import {
  AegisxConfigService,
  AxNavigationService,
  IconService,
  AxThemeService,
  provideAx,
} from '@aegisx/ui';
import { appRoutes } from './app.routes';

// Factory function to initialize icons
function initializeIcons() {
  return () => {
    const iconService = inject(IconService);
    // Icons are registered in the constructor
    return Promise.resolve();
  };
}

// Factory function to initialize theme
function initializeTheme() {
  return () => {
    const themeService = inject(AxThemeService);
    // Theme is initialized in the constructor
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(),

    // ngx-toastr configuration
    provideToastr({
      positionClass: 'toast-top-right',
      timeOut: 5000,
      extendedTimeOut: 1000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
      preventDuplicates: false,
      newestOnTop: true,
      maxOpened: 5,
      autoDismiss: true,
    }),

    // Initialize icons
    {
      provide: APP_INITIALIZER,
      useFactory: initializeIcons,
      multi: true,
    },

    // Initialize theme
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTheme,
      multi: true,
    },

    // Ax providers
    ...provideAx({
      ax: {
        layout: 'classic',
        scheme: 'light',
        screens: {
          sm: '600px',
          md: '960px',
          lg: '1280px',
          xl: '1440px',
        },
        theme: 'default',
        themes: [
          {
            id: 'default',
            name: 'Default',
          },
        ],
      },
    }),

    AegisxConfigService,
    AxNavigationService,
    IconService,
    AxThemeService,
  ],
};
