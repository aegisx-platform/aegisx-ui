import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ErrorMessageConfig, ErrorSeverity } from './error-message.model';
import { resolveErrorConfig } from './resolve-error-config';

/**
 * Error Banner Component
 *
 * Inline severity-colored alert for partial failures or degraded state.
 * Placed inside content areas (tables, cards) — not full-page.
 *
 * @example
 * ```html
 * <ax-error-banner [code]="504" (retry)="loadData()" />
 *
 * <ax-error-banner
 *   severity="warning"
 *   title="บางข้อมูลอาจไม่เป็นปัจจุบัน"
 *   description="ระบบไม่สามารถซิงค์ข้อมูลล่าสุดได้"
 *   (retry)="syncData()"
 * />
 * ```
 */
@Component({
  selector: 'ax-error-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div
      class="ax-error-banner"
      [class.ax-error-banner--error]="resolvedSeverity() === 'error'"
      [class.ax-error-banner--warning]="resolvedSeverity() === 'warning'"
      [class.ax-error-banner--info]="resolvedSeverity() === 'info'"
      [class.ax-error-banner--neutral]="resolvedSeverity() === 'neutral'"
      role="alert"
    >
      <!-- Icon -->
      <div class="ax-error-banner__icon">
        @if (resolvedIcon().includes(':')) {
          <mat-icon [svgIcon]="resolvedIcon()"></mat-icon>
        } @else {
          <mat-icon>{{ resolvedIcon() }}</mat-icon>
        }
      </div>

      <!-- Content -->
      <div class="ax-error-banner__content">
        <div class="ax-error-banner__title">{{ config().title }}</div>
        @if (config().description) {
          <div class="ax-error-banner__desc">{{ config().description }}</div>
        }
        <!-- Action links -->
        @if (config().primaryAction.type === 'retry') {
          <div class="ax-error-banner__actions">
            <button
              type="button"
              class="ax-error-banner__link"
              (click)="retry.emit()"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        }
      </div>

      <!-- Close button -->
      @if (dismissible()) {
        <button
          type="button"
          class="ax-error-banner__close"
          (click)="dismissed.emit()"
          aria-label="ปิดการแจ้งเตือน"
        >
          <mat-icon>close</mat-icon>
        </button>
      }
    </div>
  `,
  styles: [
    `
      .ax-error-banner {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        padding: 16px;
        border-radius: 8px;
        animation: bannerSlideIn 0.2s ease;
      }

      /* Severity variants */
      .ax-error-banner--error {
        background: var(--ax-error-50, #fef3f2);
        border: 1px solid var(--ax-error-200, #fecdca);
      }
      .ax-error-banner--warning {
        background: var(--ax-warning-50, #fffaeb);
        border: 1px solid var(--ax-warning-200, #fedf89);
      }
      .ax-error-banner--info {
        background: var(--ax-brand-50, #eff8ff);
        border: 1px solid var(--ax-brand-200, #b2ddff);
      }
      .ax-error-banner--neutral {
        background: var(--ax-gray-50, #f9fafb);
        border: 1px solid var(--ax-gray-200, #eaecf0);
      }

      /* Icon */
      .ax-error-banner__icon {
        flex-shrink: 0;
        margin-top: 2px;
      }
      .ax-error-banner__icon mat-icon {
        width: 20px;
        height: 20px;
        font-size: 20px;
      }
      .ax-error-banner--error .ax-error-banner__icon {
        color: var(--ax-error-600, #d92d20);
      }
      .ax-error-banner--warning .ax-error-banner__icon {
        color: var(--ax-warning-600, #dc6803);
      }
      .ax-error-banner--info .ax-error-banner__icon {
        color: var(--ax-brand-600, #1570ef);
      }
      .ax-error-banner--neutral .ax-error-banner__icon {
        color: var(--ax-gray-500, #667085);
      }

      /* Content */
      .ax-error-banner__content {
        flex: 1;
        min-width: 0;
      }

      .ax-error-banner__title {
        font-size: 14px;
        font-weight: 500;
      }
      .ax-error-banner--error .ax-error-banner__title {
        color: var(--ax-error-700, #b42318);
      }
      .ax-error-banner--warning .ax-error-banner__title {
        color: var(--ax-warning-700, #b54708);
      }
      .ax-error-banner--info .ax-error-banner__title {
        color: var(--ax-brand-700, #175cd3);
      }
      .ax-error-banner--neutral .ax-error-banner__title {
        color: var(--ax-gray-700, #344054);
      }

      .ax-error-banner__desc {
        font-size: 13px;
        line-height: 1.5;
        margin-top: 4px;
      }
      .ax-error-banner--error .ax-error-banner__desc {
        color: var(--ax-error-600, #d92d20);
      }
      .ax-error-banner--warning .ax-error-banner__desc {
        color: var(--ax-warning-600, #dc6803);
      }
      .ax-error-banner--info .ax-error-banner__desc {
        color: var(--ax-brand-600, #1570ef);
      }
      .ax-error-banner--neutral .ax-error-banner__desc {
        color: var(--ax-gray-600, #475569);
      }

      /* Action links */
      .ax-error-banner__actions {
        margin-top: 8px;
      }

      .ax-error-banner__link {
        font-size: 13px;
        font-weight: 500;
        text-decoration: underline;
        text-underline-offset: 2px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
      }
      .ax-error-banner--error .ax-error-banner__link {
        color: var(--ax-error-700, #b42318);
      }
      .ax-error-banner--warning .ax-error-banner__link {
        color: var(--ax-warning-700, #b54708);
      }
      .ax-error-banner--info .ax-error-banner__link {
        color: var(--ax-brand-700, #175cd3);
      }
      .ax-error-banner--neutral .ax-error-banner__link {
        color: var(--ax-gray-700, #344054);
      }

      /* Close button */
      .ax-error-banner__close {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        opacity: 0.6;
        transition: opacity 0.15s;
      }
      .ax-error-banner__close:hover {
        opacity: 1;
      }
      .ax-error-banner__close mat-icon {
        width: 16px;
        height: 16px;
        font-size: 16px;
      }
      .ax-error-banner--error .ax-error-banner__close {
        color: var(--ax-error-600, #d92d20);
      }
      .ax-error-banner--warning .ax-error-banner__close {
        color: var(--ax-warning-600, #dc6803);
      }
      .ax-error-banner--info .ax-error-banner__close {
        color: var(--ax-brand-600, #1570ef);
      }
      .ax-error-banner--neutral .ax-error-banner__close {
        color: var(--ax-gray-500, #667085);
      }

      @keyframes bannerSlideIn {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class AxErrorBannerComponent {
  // Inputs
  readonly code = input<number | string>();
  readonly severity = input<ErrorSeverity>();
  readonly title = input<string>();
  readonly description = input<string>();
  readonly dismissible = input(true);

  // Outputs
  readonly retry = output<void>();
  readonly dismissed = output<void>();

  // Resolved config
  readonly config = computed<ErrorMessageConfig>(() =>
    resolveErrorConfig(this.code(), {
      severity: this.severity(),
      title: this.title(),
      description: this.description(),
    }),
  );

  readonly resolvedSeverity = computed(() => this.config().severity);
  readonly resolvedIcon = computed(() => this.config().icon);
}
