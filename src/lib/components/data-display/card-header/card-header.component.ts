import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  CardHeaderAlign,
  CardHeaderIconColor,
  CardHeaderSize,
} from './card-header.types';

/**
 * Card Header — Untitled UI "Card Headers" pattern
 *
 * A flexible section header for cards, tables, forms, and page sections.
 * Composes a leading icon/avatar, title (with optional inline badge),
 * supporting description, right-side actions, and an extra row below
 * for tabs / filters / search.
 *
 * Designed to match Untitled UI's card header anatomy while using AegisX
 * semantic tokens (`--ax-*`) so it auto-flips in dark mode.
 *
 * @example Basic title + description
 * ```html
 * <ax-card-header
 *   title="Team members"
 *   description="Manage your team members and their permissions."
 * />
 * ```
 *
 * @example Featured icon + actions + divider
 * ```html
 * <ax-card-header
 *   title="Integrations"
 *   description="Connect your favorite tools to AegisX."
 *   featuredIcon="extension"
 *   featuredIconColor="brand"
 *   [divider]="true"
 * >
 *   <div actions class="flex gap-2">
 *     <button mat-stroked-button>View docs</button>
 *     <button mat-flat-button color="primary">Connect</button>
 *   </div>
 * </ax-card-header>
 * ```
 *
 * @example Custom leading avatar + inline badge
 * ```html
 * <ax-card-header title="Olivia Rhye" description="olivia@untitledui.com">
 *   <img leading src="/avatar.jpg" class="h-10 w-10 rounded-full" alt="" />
 *   <ax-badge title-badge color="success">Active</ax-badge>
 * </ax-card-header>
 * ```
 *
 * @example Header with tabs below (default content slot)
 * ```html
 * <ax-card-header title="Billing history" [divider]="true">
 *   <mat-tab-group>
 *     <mat-tab label="All"></mat-tab>
 *     <mat-tab label="Paid"></mat-tab>
 *   </mat-tab-group>
 * </ax-card-header>
 * ```
 */
@Component({
  selector: 'ax-card-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss'],
})
export class AxCardHeaderComponent {
  /** Header title text. Rendered as an `<h3>`. */
  @Input() title = '';

  /** Supporting description text displayed below the title. */
  @Input() description = '';

  /** Padding + spacing size. Defaults to `md` (Untitled UI standard). */
  @Input() size: CardHeaderSize = 'md';

  /** Horizontal content alignment. */
  @Input() align: CardHeaderAlign = 'start';

  /** Show a 1px bottom divider — use when placed above a card body / table. */
  @Input() divider = false;

  /**
   * Optional Material Icon name to render a built-in "featured icon" circle
   * on the left (Untitled UI "Light circle outline" pattern).
   *
   * Leave empty and use the `[leading]` slot to project a custom avatar
   * / icon / image instead.
   */
  @Input() featuredIcon = '';

  /** Semantic color for the featured icon circle. */
  @Input() featuredIconColor: CardHeaderIconColor = 'brand';
}
