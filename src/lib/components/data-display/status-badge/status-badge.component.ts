import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AxBadgeComponent } from '../badge/badge.component';
import {
  StatusBadgeStatus,
  StatusBadgeSize,
  StatusConfig,
  STATUS_CONFIG_MAP,
  StatusBadgeVariant,
} from './status-badge.types';
import { BadgeType, BadgeVariant } from '../badge/badge.types';

/**
 * Status Badge Component
 *
 * Semantic wrapper around ax-badge for displaying entity statuses.
 * Automatically maps status values to colors, labels, and icons.
 *
 * @example
 * // Untitled UI style — dot + text, no background (default)
 * <ax-status-badge status="active" />
 *
 * @example
 * // Outlined pill — dot + text + border (Untitled UI table)
 * <ax-status-badge status="active" variant="outlined" />
 *
 * @example
 * // Soft background (legacy)
 * <ax-status-badge status="pending" variant="soft" />
 *
 * @example
 * // Custom label override
 * <ax-status-badge status="inactive" label="ปิดใช้งาน" />
 */
@Component({
  selector: 'ax-status-badge',
  standalone: true,
  imports: [CommonModule, AxBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (variant() === 'dot') {
      <!-- Untitled UI: plain dot + text, no badge wrapper -->
      <span class="ax-status-dot" [attr.data-color]="badgeColor()">
        <span class="ax-status-dot__indicator"></span>
        <span class="ax-status-dot__label">{{ effectiveLabel() }}</span>
      </span>
    } @else {
      <ax-badge
        [variant]="badgeVariant()"
        [color]="badgeColor()"
        [size]="size()"
        [icon]="effectiveIcon()"
        [dot]="variant() === 'outlined'"
        rounded="full"
      >{{ effectiveLabel() }}</ax-badge>
    }
  `,
  styles: [`
    .ax-status-dot {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .ax-status-dot__indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .ax-status-dot__label {
      font-size: 0.8125rem;
      font-weight: 500;
      line-height: 1;
    }

    /* Color mappings */
    .ax-status-dot[data-color='success'] {
      .ax-status-dot__indicator { background-color: var(--ax-success-default, #22c55e); }
      .ax-status-dot__label { color: var(--ax-success-emphasis, #166534); }
    }
    .ax-status-dot[data-color='error'] {
      .ax-status-dot__indicator { background-color: var(--ax-error-default, #ef4444); }
      .ax-status-dot__label { color: var(--ax-error-emphasis, #991b1b); }
    }
    .ax-status-dot[data-color='warning'] {
      .ax-status-dot__indicator { background-color: var(--ax-warning-default, #f59e0b); }
      .ax-status-dot__label { color: var(--ax-warning-emphasis, #92400e); }
    }
    .ax-status-dot[data-color='info'] {
      .ax-status-dot__indicator { background-color: var(--ax-info-default, #3b82f6); }
      .ax-status-dot__label { color: var(--ax-info-emphasis, #1e40af); }
    }
    .ax-status-dot[data-color='neutral'] {
      .ax-status-dot__indicator { background-color: var(--ax-text-subtle, #a1a1aa); }
      .ax-status-dot__label { color: var(--ax-text-secondary, #71717a); }
    }
  `],
})
export class AxStatusBadgeComponent {
  /** Status value — maps to predefined config */
  readonly status = input.required<StatusBadgeStatus>();

  /** Display variant: 'dot' (plain), 'outlined' (pill+border), 'soft' (colored bg) */
  readonly variant = input<StatusBadgeVariant>('dot');

  /** Override the default label */
  readonly label = input<string>();

  /** Badge size (for outlined/soft variants) */
  readonly size = input<StatusBadgeSize>('sm');

  /** Show icon (default: false for compact display) */
  readonly showIcon = input(false);

  /** Custom status config override */
  readonly customConfig = input<Partial<Record<StatusBadgeStatus, StatusConfig>>>();

  protected readonly config = computed<StatusConfig>(() => {
    const custom = this.customConfig();
    const s = this.status();
    return custom?.[s] ?? STATUS_CONFIG_MAP[s] ?? STATUS_CONFIG_MAP['draft'];
  });

  protected readonly badgeColor = computed<BadgeType>(() => this.config().color);

  protected readonly badgeVariant = computed<BadgeVariant>(() => {
    const v = this.variant();
    if (v === 'outlined') return 'outlined';
    return 'soft';
  });

  protected readonly effectiveLabel = computed(() => this.label() ?? this.config().label);

  protected readonly effectiveIcon = computed<string | undefined>(() => {
    if (!this.showIcon()) return undefined;
    return this.config().icon;
  });
}
