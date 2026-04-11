import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  effect,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * AxFormSection — Collapsible form section with optional icon, title, field count, and divider.
 *
 * Designed for high-volume data entry forms (100+ records/day) where visual grouping
 * helps users scan and navigate complex forms quickly.
 *
 * Uses a flat divider pattern (no box/border around content) — consistent with
 * HIS (Hospital Information System) form design standards.
 *
 * @example
 * // Basic — title only
 * <ax-form-section title="ข้อมูลยา">
 *   <mat-form-field>...</mat-form-field>
 * </ax-form-section>
 *
 * @example
 * // With icon and field count
 * <ax-form-section title="ข้อมูลยา" icon="medication" iconClass="text-blue-600" fieldCount="10 ฟิลด์">
 *   ...
 * </ax-form-section>
 *
 * @example
 * // No divider, not collapsible
 * <ax-form-section title="หมายเหตุ" [divider]="false" [collapsible]="false">
 *   ...
 * </ax-form-section>
 *
 * @example
 * // Starts collapsed
 * <ax-form-section title="รายละเอียดเพิ่มเติม" icon="info" [collapsed]="true">
 *   ...
 * </ax-form-section>
 */
@Component({
  selector: 'ax-form-section',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1.5rem 0;
        border-bottom: 1px solid var(--ax-border-default, #e4e4e7);
      }

      :host:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      :host:first-child {
        padding-top: 0;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .section-header.clickable {
        cursor: pointer;
        user-select: none;
      }

      .section-header.clickable:hover .section-title {
        color: var(--ax-text-heading, #09090b);
      }

      .section-header.collapsed {
        margin-bottom: 0;
      }

      .section-icon {
        font-size: 16px !important;
        width: 16px !important;
        height: 16px !important;
        color: var(--ax-text-subtle, #a1a1aa);
      }

      .section-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ax-text-heading, #09090b);
        transition: color 0.1s;
      }

      .section-desc {
        font-size: 0.8125rem;
        color: var(--ax-text-secondary, #71717a);
        margin-top: 0.125rem;
      }

      .field-count {
        margin-left: auto;
        font-size: 0.6875rem;
        color: var(--ax-text-subtle, #a1a1aa);
        font-weight: 500;
      }

      .section-chevron {
        font-size: 16px !important;
        width: 16px !important;
        height: 16px !important;
        color: var(--ax-text-subtle, #a1a1aa);
        transition: transform 0.15s ease;
      }

      .section-chevron.rotated {
        transform: rotate(-90deg);
      }
    `,
  ],
  template: `
    <div
      class="section-header"
      [class.clickable]="collapsible()"
      [class.collapsed]="isCollapsed()"
      [attr.role]="collapsible() ? 'button' : null"
      [attr.tabindex]="collapsible() ? 0 : null"
      (click)="onHeaderClick()"
      (keyup.enter)="onHeaderClick()"
    >
      @if (icon()) {
        <mat-icon class="section-icon">{{ icon() }}</mat-icon>
      }
      <span class="section-title">{{ title() }}</span>
      @if (fieldCount()) {
        <span class="field-count">{{ fieldCount() }}</span>
      }
      @if (collapsible()) {
        <mat-icon class="section-chevron" [class.rotated]="isCollapsed()"
          >expand_more</mat-icon
        >
      }
    </div>
    @if (!isCollapsed()) {
      <ng-content></ng-content>
    }
  `,
})
export class AxFormSectionComponent {
  /** Section title (required) */
  readonly title = input.required<string>();

  /** Material icon name (optional) */
  readonly icon = input<string>('');

  /** Field count badge text (optional) */
  readonly fieldCount = input<string>('');

  /** Whether the section is collapsible (default: true) */
  readonly collapsible = input<boolean>(true);

  /** Whether the section starts collapsed (default: false) */
  readonly collapsed = input<boolean>(false);

  /** Internal collapsed state */
  readonly isCollapsed = signal(false);

  constructor() {
    effect(() => {
      this.isCollapsed.set(this.collapsed());
    });
  }

  onHeaderClick(): void {
    if (this.collapsible()) {
      this.isCollapsed.update((v) => !v);
    }
  }
}
