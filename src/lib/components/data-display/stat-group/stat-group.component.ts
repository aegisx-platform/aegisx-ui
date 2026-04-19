import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Stat Group — labeled vertical wrapper around stat cards.
 *
 * Provides the "cluster" pattern seen on dashboards: a small uppercase
 * section label with optional leading icon, followed by a flexible
 * stack of ax-stat-cards (or any content) below.
 *
 * Layout is a plain flex column — callers place their own inner grid
 * inside via content projection.
 *
 * @example
 * <ax-stat-group label="ขาเข้า" icon="call_received">
 *   <ax-stat-card variant="hero" ... />
 *   <ax-stat-card variant="hero" ... />
 * </ax-stat-group>
 *
 * @example
 * // With inner 2x2 grid
 * <ax-stat-group label="ใบเบิก · จ่ายออก" icon="move_to_inbox">
 *   <div class="grid grid-cols-2 gap-2">
 *     <ax-stat-card ... />
 *     <ax-stat-card ... />
 *   </div>
 * </ax-stat-group>
 */
@Component({
  selector: 'ax-stat-group',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="ax-stat-group">
      @if (label() || icon()) {
        <header class="ax-stat-group__header">
          @if (icon()) {
            <mat-icon class="ax-stat-group__icon">{{ icon() }}</mat-icon>
          }
          @if (label()) {
            <span class="ax-stat-group__label">{{ label() }}</span>
          }
        </header>
      }
      <div class="ax-stat-group__body">
        <ng-content />
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ax-stat-group {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .ax-stat-group__header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 4px 10px;
      }

      .ax-stat-group__icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: var(--ax-text-subtle, #a1a1aa);
        flex-shrink: 0;
      }

      .ax-stat-group__label {
        font-size: 0.6875rem; /* 11px */
        font-weight: 600;
        letter-spacing: 0.08em;
        color: var(--ax-text-secondary, #71717a);
        text-transform: uppercase;
      }

      .ax-stat-group__body {
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-width: 0;
      }
    `,
  ],
})
export class AxStatGroupComponent {
  /** Small uppercase label shown above the stack (e.g. "ขาเข้า"). */
  readonly label = input<string>('');

  /** Optional Material icon shown beside the label. */
  readonly icon = input<string>('');
}
