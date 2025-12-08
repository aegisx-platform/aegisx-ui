import { Component, computed, input, output } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AppInfo, AppMenuAction } from './app-card.types';

@Component({
  selector: 'ax-app-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TitleCasePipe,
  ],
  template: `
    <div
      class="app-card"
      [class]="'app-card--' + app().color"
      (click)="onCardClick()"
      (keydown.enter)="onCardClick()"
      tabindex="0"
      role="button"
    >
      <!-- Header: Icon + Menu -->
      <div class="app-card__header">
        <div class="app-card__icon-wrapper">
          <div class="app-card__icon">
            <mat-icon>{{ app().icon }}</mat-icon>
          </div>
          @if (app().notificationCount) {
            <span class="app-card__badge">{{ displayBadgeCount() }}</span>
          }
        </div>

        <button
          mat-icon-button
          class="app-card__menu-btn"
          [matMenuTriggerFor]="menu"
          (click)="$event.stopPropagation()"
        >
          <mat-icon>more_horiz</mat-icon>
        </button>

        <mat-menu #menu="matMenu">
          @for (action of menuActions(); track action.id) {
            <button
              mat-menu-item
              [disabled]="action.disabled"
              (click)="onMenuAction(action)"
            >
              <mat-icon>{{ action.icon }}</mat-icon>
              <span>{{ action.label }}</span>
            </button>
          }
        </mat-menu>
      </div>

      <!-- Content -->
      <div class="app-card__content">
        <h3 class="app-card__name">{{ app().name }}</h3>
        @if (app().lastEdited) {
          <p class="app-card__meta">{{ app().lastEdited }}</p>
        }
      </div>

      <!-- Status Badge -->
      @if (app().status && app().status !== 'active') {
        <span class="app-card__status app-card__status--{{ app().status }}">
          {{ app().status | titlecase }}
        </span>
      }
    </div>
  `,
  styles: `
    .app-card {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 1.25rem;
      border-radius: var(--ax-radius-xl, 16px);
      min-height: 160px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--ax-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
      }

      &:focus-visible {
        outline: 2px solid var(--ax-brand-default, #6366f1);
        outline-offset: 2px;
      }
    }

    // Pastel Color Variants
    .app-card--pink {
      background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
      .app-card__icon {
        background: #fbcfe8;
        color: #be185d;
      }
    }

    .app-card--peach {
      background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
      .app-card__icon {
        background: #fed7aa;
        color: #c2410c;
      }
    }

    .app-card--mint {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      .app-card__icon {
        background: #bbf7d0;
        color: #15803d;
      }
    }

    .app-card--blue {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      .app-card__icon {
        background: #bfdbfe;
        color: #1d4ed8;
      }
    }

    .app-card--yellow {
      background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
      .app-card__icon {
        background: #fef08a;
        color: #a16207;
      }
    }

    .app-card--lavender {
      background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
      .app-card__icon {
        background: #e9d5ff;
        color: #7e22ce;
      }
    }

    .app-card--cyan {
      background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
      .app-card__icon {
        background: #a5f3fc;
        color: #0e7490;
      }
    }

    .app-card--neutral {
      background: linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%);
      .app-card__icon {
        background: #e4e4e7;
        color: #3f3f46;
      }
    }

    // Header
    .app-card__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    // Icon wrapper
    .app-card__icon-wrapper {
      position: relative;
    }

    .app-card__icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    // Notification Badge
    .app-card__badge {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      background: #ef4444;
      color: white;
      font-size: 11px;
      font-weight: 600;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    // Menu Button - Show on hover
    .app-card__menu-btn {
      opacity: 0;
      transition: opacity 0.15s ease;
      width: 32px;
      height: 32px;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .app-card:hover .app-card__menu-btn {
      opacity: 1;
    }

    // Content
    .app-card__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .app-card__name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--ax-text-heading, #111827);
      margin: 0 0 0.25rem;
      line-height: 1.4;
    }

    .app-card__meta {
      font-size: 0.75rem;
      color: var(--ax-text-muted, #6b7280);
      margin: 0;
    }

    // Status Badge
    .app-card__status {
      position: absolute;
      top: 1rem;
      right: 3rem;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .app-card__status--beta {
      background: #fef3c7;
      color: #92400e;
    }

    .app-card__status--new {
      background: #dbeafe;
      color: #1e40af;
    }

    .app-card__status--maintenance {
      background: #fee2e2;
      color: #991b1b;
    }
  `,
})
export class AppCardComponent {
  app = input.required<AppInfo>();

  cardClick = output<AppInfo>();
  menuAction = output<{ app: AppInfo; action: AppMenuAction }>();

  displayBadgeCount = computed(() => {
    const count = this.app().notificationCount || 0;
    return count > 99 ? '99+' : count.toString();
  });

  menuActions = computed(() => {
    return (
      this.app().menuActions || [
        { id: 'open', label: 'Open', icon: 'open_in_new' },
        { id: 'edit', label: 'Edit', icon: 'edit' },
        { id: 'delete', label: 'Delete', icon: 'delete' },
      ]
    );
  });

  onCardClick(): void {
    this.cardClick.emit(this.app());
  }

  onMenuAction(action: AppMenuAction): void {
    this.menuAction.emit({ app: this.app(), action });
  }
}
