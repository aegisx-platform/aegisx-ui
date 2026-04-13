import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavNotification } from '../models/ax-nav.model';
import { navSlideRight } from '../animations/ax-nav.animations';

@Component({
  selector: 'ax-notification-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  animations: [navSlideRight],
  template: `
    <div
      class="ax-notif-backdrop"
      role="button"
      tabindex="-1"
      aria-label="Close notifications"
      (click)="closed.emit()"
      (keydown.escape)="closed.emit()"
    >
      <aside
        class="ax-notif-panel"
        @navSlideRight
        role="dialog"
        aria-label="Notifications"
        (click)="$event.stopPropagation()"
        (keydown.escape)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="ax-notif-panel__header">
          <div class="ax-notif-panel__title">Notifications</div>
          <div class="ax-notif-panel__actions">
            <button
              type="button"
              class="ax-notif-panel__mark-all"
              (click)="markAllRead.emit()"
            >
              Mark all read
            </button>
            <button
              type="button"
              class="ax-notif-panel__close"
              (click)="closed.emit()"
              aria-label="Close notifications"
            >
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>

        <!-- List -->
        <div class="ax-notif-panel__list">
          @for (n of notifications; track n.id) {
            <button
              type="button"
              class="ax-notif-panel__item"
              [class.ax-notif-panel__item--unread]="n.unread"
              (click)="notificationClick.emit(n)"
            >
              <div class="ax-notif-panel__item-content">
                @if (n.unread) {
                  <div class="ax-notif-panel__dot"></div>
                }
                <div class="ax-notif-panel__item-body">
                  <div class="ax-notif-panel__item-title">{{ n.title }}</div>
                  <div class="ax-notif-panel__item-desc">
                    {{ n.description }}
                  </div>
                  <div class="ax-notif-panel__item-time">{{ n.time }}</div>
                </div>
              </div>
            </button>
          }
          @if (notifications.length === 0) {
            <div class="ax-notif-panel__empty">ไม่มีการแจ้งเตือน</div>
          }
        </div>
      </aside>
    </div>
  `,
  styles: [
    `
      .ax-notif-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(4px);
        z-index: 9500;
      }

      .ax-notif-panel {
        position: fixed;
        right: 0;
        top: 0;
        bottom: 0;
        width: 380px;
        background: var(--ax-surface, #fff);
        box-shadow: -8px 0 30px rgba(0, 0, 0, 0.1);
        padding: 20px;
        display: flex;
        flex-direction: column;
        z-index: 9501;
      }

      .ax-notif-panel__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      .ax-notif-panel__title {
        font-size: 17px;
        font-weight: 700;
        color: var(--ax-text-primary, #0f172a);
      }

      .ax-notif-panel__actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .ax-notif-panel__mark-all {
        font-size: 12px;
        color: var(--ax-primary, #3b82f6);
        background: none;
        border: none;
        cursor: pointer;
        font-weight: 500;
      }
      .ax-notif-panel__mark-all:hover {
        text-decoration: underline;
      }

      .ax-notif-panel__close {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        border: none;
        background: var(--ax-surface-hover, #f1f5f9);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--ax-text-secondary, #64748b);
      }
      .ax-notif-panel__close:hover {
        background: var(--ax-surface-active, #e2e8f0);
      }
      .ax-notif-panel__close mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .ax-notif-panel__list {
        flex: 1;
        overflow: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .ax-notif-panel__item {
        padding: 14px;
        border-radius: 12px;
        background: var(--ax-surface-subtle, #f8fafc);
        border: 1px solid var(--ax-border-subtle, #f1f5f9);
        cursor: pointer;
        text-align: left;
        width: 100%;
        transition: background 0.1s;
      }
      .ax-notif-panel__item:hover {
        background: var(--ax-surface-hover, #f1f5f9);
      }
      .ax-notif-panel__item--unread {
        background: var(--ax-primary-subtle, #eff6ff);
        border-color: var(--ax-primary-border, #bfdbfe);
      }
      .ax-notif-panel__item--unread:hover {
        background: var(--ax-primary-hover, #dbeafe);
      }

      .ax-notif-panel__item-content {
        display: flex;
        align-items: flex-start;
        gap: 10px;
      }

      .ax-notif-panel__dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--ax-primary, #3b82f6);
        margin-top: 5px;
        flex-shrink: 0;
      }

      .ax-notif-panel__item-body {
        flex: 1;
      }

      .ax-notif-panel__item-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--ax-text-primary, #0f172a);
      }

      .ax-notif-panel__item-desc {
        font-size: 12px;
        color: var(--ax-text-secondary, #64748b);
        margin-top: 2px;
      }

      .ax-notif-panel__item-time {
        font-size: 11px;
        color: var(--ax-text-muted, #94a3b8);
        margin-top: 4px;
      }

      .ax-notif-panel__empty {
        padding: 40px;
        text-align: center;
        color: var(--ax-text-muted, #94a3b8);
        font-size: 14px;
      }
    `,
  ],
})
export class AxNotificationPanelComponent {
  @Input({ required: true }) notifications!: readonly NavNotification[];

  @Output() readonly notificationClick = new EventEmitter<NavNotification>();
  @Output() readonly markAllRead = new EventEmitter<void>();
  @Output() readonly closed = new EventEmitter<void>();
}
