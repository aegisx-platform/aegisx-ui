import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppCardComponent } from './components/app-card/app-card.component';
import { AppInfo, AppMenuAction } from './components/app-card/app-card.types';

@Component({
  selector: 'ax-app-launcher',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    AppCardComponent,
  ],
  template: `
    <div class="app-launcher-page">
      <!-- App Header Bar -->
      <header class="app-header">
        <div class="app-header__left">
          <div class="app-header__logo">
            <mat-icon>apps</mat-icon>
            <span>AegisX</span>
          </div>
        </div>

        <div class="app-header__center">
          <mat-form-field
            appearance="outline"
            class="search-field"
            subscriptSizing="dynamic"
          >
            <mat-icon matPrefix>search</mat-icon>
            <input
              matInput
              placeholder="Search apps..."
              [(ngModel)]="searchQuery"
            />
          </mat-form-field>
        </div>

        <div class="app-header__right">
          <button mat-icon-button matTooltip="Notifications">
            <mat-icon>notifications</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Settings">
            <mat-icon>settings</mat-icon>
          </button>
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item>
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </button>
            <button mat-menu-item>
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </div>
      </header>

      <!-- Main Content -->
      <main class="app-launcher">
        <h1 class="app-launcher__title">Active applications</h1>

        <!-- Apps Grid -->
        <div class="app-launcher__grid">
          @for (app of filteredApps(); track app.id) {
            <ax-app-card
              [app]="app"
              (cardClick)="onAppClick($event)"
              (menuAction)="onMenuAction($event)"
            />
          }
        </div>

        @if (filteredApps().length === 0) {
          <div class="app-launcher__empty">
            <mat-icon>search_off</mat-icon>
            <p>No applications found matching "{{ searchQuery }}"</p>
          </div>
        }
      </main>
    </div>
  `,
  styles: `
    .app-launcher-page {
      min-height: 100vh;
      background: var(--ax-background-subtle, #f9fafb);
    }

    // App Header Bar
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
      background: var(--ax-background-default, #fff);
      border-bottom: 1px solid var(--ax-border-default, #e5e7eb);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .app-header__left {
      display: flex;
      align-items: center;
    }

    .app-header__logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      font-size: 1.25rem;
      color: var(--ax-text-heading, #111827);

      mat-icon {
        color: var(--ax-brand-default, #6366f1);
      }
    }

    .app-header__center {
      flex: 1;
      max-width: 400px;
      margin: 0 2rem;
    }

    .search-field {
      width: 100%;

      ::ng-deep {
        .mat-mdc-form-field-subscript-wrapper {
          display: none;
        }

        .mat-mdc-text-field-wrapper {
          background: var(--ax-background-subtle, #f9fafb);
        }
      }
    }

    .app-header__right {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    // Main Content
    .app-launcher {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .app-launcher__title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--ax-text-heading, #111827);
      margin: 0 0 1.5rem;
    }

    .app-launcher__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.25rem;
    }

    // Empty State
    .app-launcher__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      color: var(--ax-text-muted, #6b7280);

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      p {
        margin: 0;
        font-size: 1rem;
      }
    }

    // Responsive
    @media (max-width: 768px) {
      .app-header__center {
        display: none;
      }

      .app-launcher {
        padding: 1rem;
      }

      .app-launcher__grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1rem;
      }
    }
  `,
})
export class AppLauncherComponent {
  searchQuery = '';

  apps = signal<AppInfo[]>([
    {
      id: 'his',
      name: 'Hospital Information System',
      icon: 'local_hospital',
      route: '/his-demo',
      color: 'pink',
      status: 'active',
      notificationCount: 5,
      lastEdited: 'Last edit by Mark at 7:40 PM',
    },
    {
      id: 'inventory',
      name: 'Inventory Management',
      icon: 'inventory_2',
      route: '/inventory-demo',
      color: 'mint',
      status: 'active',
      notificationCount: 3,
      lastEdited: 'Last edit by Sarah at 2:15 PM',
    },
    {
      id: 'enterprise',
      name: 'Enterprise Dashboard',
      icon: 'analytics',
      route: '/enterprise-demo',
      color: 'blue',
      status: 'beta',
      lastEdited: 'Last edit by John at 11:30 AM',
    },
    {
      id: 'docs',
      name: 'Documentation',
      icon: 'menu_book',
      route: '/docs/getting-started/introduction',
      color: 'lavender',
      status: 'active',
      lastEdited: 'Last edit by Admin at 9:00 AM',
    },
    {
      id: 'playground',
      name: 'Playground',
      icon: 'science',
      route: '/playground/pages/dashboard',
      color: 'yellow',
      status: 'new',
      lastEdited: 'Last edit by Dev at 5:45 PM',
    },
    {
      id: 'code-snippets',
      name: 'Code Snippets',
      icon: 'code',
      route: '/playground/experiments/components',
      color: 'cyan',
      lastEdited: 'Last edit by Claude at 3:20 PM',
    },
  ]);

  filteredApps = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      return this.apps();
    }
    return this.apps().filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.description?.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query),
    );
  });

  constructor(private router: Router) {}

  onAppClick(app: AppInfo): void {
    this.router.navigate([app.route]);
  }

  onMenuAction(event: { app: AppInfo; action: AppMenuAction }): void {
    const { app, action } = event;

    switch (action.id) {
      case 'open':
        this.router.navigate([app.route]);
        break;
      case 'edit':
        console.log('Edit app:', app.name);
        break;
      case 'delete':
        console.log('Delete app:', app.name);
        break;
      default:
        console.log('Custom action:', action.id, 'for app:', app.name);
    }
  }
}
