import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AxCardComponent } from '../card/card.component';
import { AxAvatarComponent } from '../avatar/avatar.component';
import { AxBadgeComponent } from '../badge/badge.component';
import type { BadgeType } from '../badge/badge.types';
import {
  ActivityListColumns,
  ActivityListItem,
  ActivityListStatusTone,
} from './ax-activity-list-card.types';

/**
 * <ax-activity-list-card>
 *
 * Generic dashboard activity list — header (title + optional filter)
 * and row grid (avatar, primary/secondary, amount, status pill,
 * date, trailing menu). Fully composes existing @aegisx/ui primitives:
 *   - <ax-card>   for outer chrome (radius, border, shadow, bg)
 *   - <ax-avatar> for the leading initials tile (with [color] tint)
 *   - <ax-badge>  for the status pill
 *
 * All row fields beyond id + avatar + primary are optional; column
 * visibility is controlled via [columns].
 */
@Component({
  selector: 'ax-activity-list-card',
  standalone: true,
  imports: [
    MatIconModule,
    AxCardComponent,
    AxAvatarComponent,
    AxBadgeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ax-card [flat]="flat" class="ax-activity-list-card">
      <header class="ax-activity-list-card__header">
        <h3 class="ax-activity-list-card__title">{{ title }}</h3>
        @if (headerFilterLabel) {
          <button
            type="button"
            class="ax-activity-list-card__filter"
            (click)="filterClick.emit()"
          >
            <span>{{ headerFilterLabel }}</span>
            <mat-icon>expand_more</mat-icon>
          </button>
        }
      </header>

      @if (items.length > 0) {
        <div
          class="ax-activity-list-card__row ax-activity-list-card__row--header"
          [attr.data-amount]="columns.amount !== false || null"
          [attr.data-status]="columns.status !== false || null"
          [attr.data-date]="columns.date !== false || null"
          [attr.data-menu]="columns.menu !== false || null"
        >
          <span></span>
          <span class="ax-activity-list-card__h">CLIENT</span>
          @if (columns.amount !== false) {
            <span
              class="ax-activity-list-card__h ax-activity-list-card__h--right"
            >
              AMOUNT
            </span>
          }
          @if (columns.status !== false) {
            <span class="ax-activity-list-card__h">STATUS</span>
          }
          @if (columns.date !== false) {
            <span class="ax-activity-list-card__h">DATE</span>
          }
          @if (columns.menu !== false) {
            <span></span>
          }
        </div>
      }

      @for (item of items; track item.id) {
        <div
          class="ax-activity-list-card__row"
          [attr.data-amount]="columns.amount !== false || null"
          [attr.data-status]="columns.status !== false || null"
          [attr.data-date]="columns.date !== false || null"
          [attr.data-menu]="columns.menu !== false || null"
          (click)="itemClick.emit(item)"
          role="button"
          tabindex="0"
          (keydown.enter)="itemClick.emit(item)"
        >
          <ax-avatar
            [name]="item.avatar.name"
            [color]="item.avatar.color"
            size="sm"
            shape="circle"
          />
          <span class="ax-activity-list-card__primary-cell">
            <span class="ax-activity-list-card__primary">{{
              item.primary
            }}</span>
            @if (item.secondary) {
              <span class="ax-activity-list-card__secondary">{{
                item.secondary
              }}</span>
            }
          </span>
          @if (columns.amount !== false) {
            <span class="ax-activity-list-card__amount">{{
              item.amount ?? ''
            }}</span>
          }
          @if (columns.status !== false) {
            @if (item.status; as s) {
              <ax-badge
                [color]="toneToBadgeColor(s.tone)"
                variant="soft"
                rounded="full"
                size="sm"
                [dot]="true"
                >{{ s.label }}</ax-badge
              >
            } @else {
              <span></span>
            }
          }
          @if (columns.date !== false) {
            <span class="ax-activity-list-card__date">{{
              item.date ?? ''
            }}</span>
          }
          @if (columns.menu !== false) {
            <button
              type="button"
              class="ax-activity-list-card__menu"
              (click)="onMenuClick($event, item)"
              [attr.aria-label]="'Actions for ' + item.primary"
            >
              <mat-icon>more_horiz</mat-icon>
            </button>
          }
        </div>
      }
    </ax-card>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }

      /* ax-card already provides radius + border + shadow + bg.
         We only add layout rules on top and tighten the card body
         padding to match the Manage.City reference (22 24). */
      .ax-activity-list-card ::ng-deep .ax-card-body {
        padding: 20px 22px;
      }

      .ax-activity-list-card__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
      }

      .ax-activity-list-card__title {
        font-size: 15px;
        font-weight: 600;
        margin: 0;
        color: var(--ax-text-heading, #111827);
      }

      .ax-activity-list-card__filter {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 5px 10px;
        border: 1px solid var(--ax-border-default, #e5e7eb);
        border-radius: 10px;
        background: transparent;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        color: var(--ax-text-secondary, #6b7280);

        &:hover {
          background: var(--ax-background-muted, #f9fafb);
        }

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }

      .ax-activity-list-card__row {
        display: grid;
        grid-template-columns: 32px 1fr;
        align-items: center;
        gap: 16px;
        padding: 12px 0;
        border-top: 1px solid var(--ax-border-subtle, #f3f4f6);
        cursor: pointer;

        &:hover:not(.ax-activity-list-card__row--header) {
          background: var(--ax-background-muted, #fafafa);
        }

        &--header {
          cursor: default;
          padding: 6px 0;
          border-top: none;

          &:hover {
            background: transparent;
          }
        }

        &[data-amount] {
          grid-template-columns: 32px 1fr 100px;
        }
        &[data-amount][data-status] {
          grid-template-columns: 32px 1fr 100px 100px;
        }
        &[data-amount][data-status][data-date] {
          grid-template-columns: 32px 1fr 100px 100px 70px;
        }
        &[data-amount][data-status][data-date][data-menu] {
          grid-template-columns: 32px 1fr 100px 100px 70px 24px;
        }
      }

      .ax-activity-list-card__h {
        font-size: 11px;
        font-weight: 500;
        color: var(--ax-text-muted, #9ca3af);
        text-transform: uppercase;
        letter-spacing: 0.04em;

        &--right {
          text-align: right;
        }
      }

      .ax-activity-list-card__primary-cell {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .ax-activity-list-card__primary {
        font-size: 14px;
        font-weight: 500;
        color: var(--ax-text-heading, #111827);
        line-height: 1.3;
      }

      .ax-activity-list-card__secondary {
        font-size: 12px;
        color: var(--ax-text-muted, #9ca3af);
        line-height: 1.3;
        margin-top: 2px;
      }

      .ax-activity-list-card__amount {
        font-size: 14px;
        font-weight: 600;
        color: var(--ax-text-heading, #111827);
        text-align: right;
      }

      .ax-activity-list-card__date {
        font-size: 12px;
        color: var(--ax-text-secondary, #6b7280);
      }

      .ax-activity-list-card__menu {
        width: 24px;
        height: 24px;
        padding: 0;
        border: none;
        background: transparent;
        color: var(--ax-text-muted, #9ca3af);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        &:hover {
          color: var(--ax-text-heading, #111827);
        }

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }

      @media (max-width: 900px) {
        .ax-activity-list-card__row {
          &[data-amount][data-status][data-date][data-menu] {
            grid-template-columns: 32px 1fr;
          }

          .ax-activity-list-card__amount,
          ax-badge,
          .ax-activity-list-card__date,
          .ax-activity-list-card__menu,
          .ax-activity-list-card__h {
            display: none;
          }
        }
      }
    `,
  ],
})
export class AxActivityListCardComponent {
  @Input() title = '';
  @Input() items: readonly ActivityListItem[] = [];
  @Input() headerFilterLabel?: string;
  @Input() columns: ActivityListColumns = {
    amount: true,
    status: true,
    date: true,
    menu: true,
  };
  /**
   * Passed through to the inner <ax-card>. Set `true` to drop the
   * box-shadow — useful when the list sits inside another card.
   */
  @Input() flat = false;

  @Output() itemClick = new EventEmitter<ActivityListItem>();
  @Output() itemMenuClick = new EventEmitter<ActivityListItem>();
  @Output() filterClick = new EventEmitter<void>();

  onMenuClick(event: Event, item: ActivityListItem): void {
    event.stopPropagation();
    this.itemMenuClick.emit(item);
  }

  /** Maps the list's semantic tones to <ax-badge> color values. */
  toneToBadgeColor(tone: ActivityListStatusTone): BadgeType {
    switch (tone) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'error'; // ax-badge uses "error" not "danger"
      case 'info':
        return 'info';
      case 'neutral':
      default:
        return 'neutral';
    }
  }
}
