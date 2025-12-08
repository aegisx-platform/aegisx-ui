import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Navbar Actions Container
 *
 * Container for action buttons in the navbar (search, notifications, etc.)
 *
 * @example
 * <ax-navbar-actions>
 *   <ax-navbar-icon-button icon="search" (click)="openSearch()"></ax-navbar-icon-button>
 *   <ax-navbar-icon-button icon="notifications" [badge]="3"></ax-navbar-icon-button>
 *   <ax-navbar-icon-button icon="apps"></ax-navbar-icon-button>
 * </ax-navbar-actions>
 */
@Component({
  selector: 'ax-navbar-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ax-navbar-actions">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .ax-navbar-actions {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-xs, 0.25rem);
      }
    `,
  ],
})
export class AxNavbarActionsComponent {}
