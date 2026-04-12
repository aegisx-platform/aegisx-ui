import {
  Component,
  ChangeDetectionStrategy,
  Input,
  booleanAttribute,
} from '@angular/core';
// CommonModule not needed — template uses @if control flow, no NgIf/NgFor
import { AxBreadcrumbComponent } from '../../navigation/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '../../navigation/breadcrumb/breadcrumb.types';

/**
 * Page Shell — Standard page wrapper for all AegisX app pages.
 *
 * Provides consistent layout structure:
 * - `min-h-screen pb-20` outer (space reserved for sticky bottom bar)
 * - `max-w-full mx-auto space-y-4` inner (16px gap between children)
 * - `ax-breadcrumb` with standard props (home icon + chevron + sm size)
 * - Header slot (pt-1 pb-4, optional border-bottom)
 * - Content slot (ng-content for cards, tables, etc.)
 *
 * This ensures every page in the app has the SAME spacing for breadcrumb,
 * header, and content — preventing "breadcrumb ชิด header" issues caused by
 * Angular custom components being `display: inline` by default and breaking
 * Tailwind's `space-y-*` margin-top.
 *
 * @example
 * ```html
 * <ax-page-shell
 *   [breadcrumb]="breadcrumbItems"
 *   [headerBorder]="true"
 * >
 *   <!-- Header slot -->
 *   <div header>
 *     <h1>Page Title</h1>
 *     <p>Subtitle</p>
 *   </div>
 *
 *   <!-- Content -->
 *   <mat-card>...</mat-card>
 *   <mat-card>...</mat-card>
 * </ax-page-shell>
 * ```
 *
 * **Rule:** The first breadcrumb item should be home icon only:
 * `{ label: '', url: '/', icon: 'home' }`
 */
@Component({
  selector: 'ax-page-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AxBreadcrumbComponent],
  template: `
    <div class="ax-page-shell">
      <div class="ax-page-shell-inner">
        @if (breadcrumb && breadcrumb.length > 0) {
          <ax-breadcrumb
            [items]="breadcrumb"
            separatorIcon="chevron_right"
            size="sm"
            padding="0"
          ></ax-breadcrumb>
        }

        <!-- Header slot (plain block div — ensures space-y-4 works) -->
        <div
          class="ax-page-shell-header"
          [class.ax-page-shell-header--bordered]="headerBorder"
        >
          <ng-content select="[header]"></ng-content>
        </div>

        <!-- Content slot -->
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .ax-page-shell {
        min-height: 100vh;
        padding-bottom: 5rem; /* 80px — reserve for sticky bottom bar */
      }
      .ax-page-shell-inner {
        max-width: 100%;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem; /* 16px — space between children (breadcrumb, header, content) */
      }
      .ax-page-shell-header {
        padding-top: 0.25rem; /* 4px */
        padding-bottom: 1rem; /* 16px */
      }
      .ax-page-shell-header--bordered {
        border-bottom: 1px solid var(--ax-border-default);
      }
    `,
  ],
})
export class AxPageShellComponent {
  /**
   * Breadcrumb items. First item should be the home icon:
   * `{ label: '', url: '/', icon: 'home' }`
   */
  @Input() breadcrumb?: BreadcrumbItem[];

  /**
   * Show a 1px bottom border below the header slot.
   * Use for pages where header + content are separate visual zones.
   */
  @Input({ transform: booleanAttribute }) headerBorder = false;
}
