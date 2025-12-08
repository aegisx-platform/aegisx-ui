import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  AxSplashScreenComponent,
  SplashScreenService,
  SplashScreenStage,
} from '@aegisx/ui';
import { AuthService } from './core/auth';
import { WebSocketService } from './shared/business/services/websocket.service';

/**
 * Root Application Component
 *
 * This is the root component that simply renders the router-outlet.
 * All layout management is handled by individual route shells:
 *
 * Route Architecture:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Route Pattern        │ Layout Shell          │ Description      │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ /login, /register    │ No Shell              │ Auth pages       │
 * │ /portal              │ PortalPage (own)      │ App launcher     │
 * │ /inventory/*         │ InventoryShell        │ Inventory app    │
 * │ /system/*            │ SystemShell           │ System admin     │
 * │ /4xx, /5xx           │ No Shell              │ Error pages      │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Each shell component manages its own:
 * - Layout (AxEnterpriseLayoutComponent or custom)
 * - Navigation
 * - Theme
 * - User context
 */
@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, AxSplashScreenComponent],
  selector: 'ax-root',
  template: `
    <ax-splash-screen />
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private websocketService = inject(WebSocketService);
  private splashService = inject(SplashScreenService);

  ngOnInit() {
    // Initialize splash screen
    this.initializeSplashScreen();

    // Initialize WebSocket connection for authenticated users
    if (this.authService.isAuthenticated() && this.authService.accessToken()) {
      console.log('🔌 Initializing WebSocket connection on app startup');
      this.initializeWebSocket();
    }
  }

  private async initializeSplashScreen(): Promise<void> {
    this.splashService.show({
      appName: 'AegisX Portal',
      tagline: 'Enterprise Application Suite',
      version: 'v1.0.0',
      backgroundStyle: 'wave',
      waveColor: 'aegisx',
      minDisplayTime: 1500,
    });

    const stages: SplashScreenStage[] = [
      {
        id: 'config',
        label: 'Loading configuration',
        icon: 'settings',
        status: 'pending',
      },
      {
        id: 'auth',
        label: 'Checking authentication',
        icon: 'security',
        status: 'pending',
      },
      {
        id: 'apps',
        label: 'Loading applications',
        icon: 'apps',
        status: 'pending',
      },
      {
        id: 'ready',
        label: 'Preparing workspace',
        icon: 'dashboard',
        status: 'pending',
      },
    ];

    this.splashService.setStages(stages);

    await this.splashService.runStages([
      { id: 'config', handler: () => this.delay(400) },
      { id: 'auth', handler: () => this.delay(300) },
      { id: 'apps', handler: () => this.delay(400) },
      { id: 'ready', handler: () => this.delay(300) },
    ]);

    await this.splashService.hide();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private initializeWebSocket(): void {
    try {
      const token = this.authService.accessToken();
      if (token) {
        console.log('🔌 Connecting to WebSocket...');
        this.websocketService.connect(token);

        // Subscribe to all real-time features
        setTimeout(() => {
          console.log('📡 Subscribing to real-time features...');
          this.websocketService.subscribe({
            features: ['users', 'rbac', 'products', 'orders'],
          });
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Failed to initialize WebSocket:', error);
    }
  }
}
