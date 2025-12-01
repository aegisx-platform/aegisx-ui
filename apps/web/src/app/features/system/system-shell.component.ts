import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import {
  AxEnterpriseLayoutComponent,
  AxNavigationItem,
  AxThemeSwitcherComponent,
  EnterprisePresetTheme,
} from '@aegisx/ui';
import { SYSTEM_APP_CONFIG, SYSTEM_NAVIGATION } from './system.config';
import { AuthService } from '../../core/auth';

/**
 * System Shell Component
 *
 * Main shell component for the System Administration app.
 * Uses AxEnterpriseLayoutComponent with navigation for admin pages.
 *
 * Routes:
 * - /system          → Dashboard
 * - /system/users    → User Management
 * - /system/profile  → User Profile
 * - /system/settings → System Settings
 * - /system/rbac     → RBAC Management
 * - /system/monitoring → Monitoring
 * - /system/audit    → Audit Logs
 * - /system/tools/*  → Tools
 */
@Component({
  selector: 'app-system-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatBadgeModule,
    AxEnterpriseLayoutComponent,
    AxThemeSwitcherComponent,
  ],
  template: `
    <ax-enterprise-layout
      [appName]="appName"
      [appTheme]="appTheme"
      [navigation]="navigation"
      [showFooter]="config.showFooter ?? true"
      [contentBackground]="'gray'"
      (logoutClicked)="onLogout()"
    >
      <!-- Header Actions -->
      <ng-template #headerActions>
        <!-- Theme Switcher -->
        <ax-theme-switcher mode="dropdown"></ax-theme-switcher>

        <!-- Notifications -->
        <button mat-icon-button matTooltip="Notifications">
          <mat-icon [matBadge]="3" matBadgeColor="warn" matBadgeSize="small">
            notifications
          </mat-icon>
        </button>

        <!-- Settings -->
        <button mat-icon-button matTooltip="Settings" (click)="onSettings()">
          <mat-icon>settings</mat-icon>
        </button>
      </ng-template>

      <!-- Router Outlet for Pages -->
      <router-outlet></router-outlet>

      <!-- Footer Content -->
      <ng-template #footerContent>
        <span>{{ config.footerContent }}</span>
        <span class="footer-version">v2.0</span>
      </ng-template>
    </ax-enterprise-layout>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }

      .footer-version {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
        margin-left: 0.5rem;
      }
    `,
  ],
})
export class SystemShellComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // App configuration
  readonly config = SYSTEM_APP_CONFIG;
  readonly appName = this.config.name;
  readonly appTheme: EnterprisePresetTheme = 'default';
  readonly navigation: AxNavigationItem[] = SYSTEM_NAVIGATION;

  // User info
  readonly currentUser = computed(() => {
    const user = this.authService.currentUser();
    if (user) {
      return {
        name: this.authService.userDisplayName(),
        email: user.email,
        avatar: user.avatar || null,
      };
    }
    return null;
  });

  ngOnInit(): void {
    // Listen to route changes if needed
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        // Can track navigation for analytics or breadcrumbs
        console.log('System navigation:', (event as NavigationEnd).url);
      });
  }

  /**
   * Settings action
   */
  onSettings(): void {
    this.router.navigate(['/system/settings']);
  }

  /**
   * Logout action
   */
  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.router.navigate(['/login']);
      },
    });
  }
}
