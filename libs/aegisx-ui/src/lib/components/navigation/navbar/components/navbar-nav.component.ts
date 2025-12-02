import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Navbar Navigation Container
 *
 * Container for navigation items in the navbar.
 * Provides horizontal layout with proper spacing.
 *
 * @example
 * <ax-navbar-nav>
 *   <ax-nav-item label="Home" routerLink="/"></ax-nav-item>
 *   <ax-nav-item label="Products" [menu]="productsMenu"></ax-nav-item>
 *   <ax-nav-item label="About" routerLink="/about"></ax-nav-item>
 * </ax-navbar-nav>
 */
@Component({
  selector: 'ax-navbar-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="ax-navbar-nav" role="navigation" [attr.aria-label]="ariaLabel">
      <ul class="ax-navbar-nav__list">
        <ng-content></ng-content>
      </ul>
    </nav>
  `,
  styles: [
    `
      .ax-navbar-nav {
        display: flex;
        align-items: center;
      }

      .ax-navbar-nav__list {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-xs, 0.25rem);
        list-style: none;
        margin: 0;
        padding: 0;
      }

      :host(.ax-navbar-nav--vertical) {
        .ax-navbar-nav__list {
          flex-direction: column;
          align-items: stretch;
          width: 100%;
        }
      }
    `,
  ],
})
export class AxNavbarNavComponent {
  /** ARIA label for accessibility */
  @Input() ariaLabel = 'Main navigation';

  /** Vertical layout (for mobile menu) */
  @Input() set vertical(value: boolean) {
    this._vertical = value;
  }

  private _vertical = false;

  @HostBinding('class.ax-navbar-nav--vertical')
  get isVertical(): boolean {
    return this._vertical;
  }
}
