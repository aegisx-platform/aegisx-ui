import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
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
  imports: [CommonModule, RouterOutlet],
  selector: 'ax-root',
  template: `<router-outlet></router-outlet>`,
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

  ngOnInit() {
    // Initialize WebSocket connection for authenticated users
    if (this.authService.isAuthenticated() && this.authService.accessToken()) {
      console.log('🔌 Initializing WebSocket connection on app startup');
      this.initializeWebSocket();
    }
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
