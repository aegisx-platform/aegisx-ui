import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  ErrorAction,
  ErrorMessageConfig,
  ErrorSeverity,
} from './error-message.model';
import { resolveErrorConfig } from './resolve-error-config';

/** Legacy action interface (v1 backward compat) */
export interface ErrorStateAction {
  label: string;
  icon?: string;
  primary?: boolean;
  callback: () => void;
}

/**
 * Error State Component
 *
 * Full-page or section-level error display with:
 * - Featured icon (60px, `axf:err-*` double-ring SVG)
 * - Thai title + description (auto-resolved from HTTP code)
 * - Primary + secondary action buttons
 * - Technical error code (monospace, for IT staff)
 * - Optional expandable technical details
 *
 * @example Basic — just pass HTTP code
 * ```html
 * <ax-error-state [code]="504" (retry)="loadData()" />
 * ```
 *
 * @example Override messages
 * ```html
 * <ax-error-state
 *   [code]="500"
 *   title="ไม่สามารถบันทึกข้อมูลได้"
 *   description="ระบบพบปัญหาขณะบันทึกใบสั่งซื้อ"
 *   (retry)="savePO()"
 * />
 * ```
 */
@Component({
  selector: 'ax-error-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div
      class="ax-error-state"
      [class.ax-error-state--bordered]="bordered()"
      role="alert"
      aria-live="polite"
    >
      <!-- Featured icon -->
      <div class="ax-error-state__icon">
        @if (resolvedIcon().includes(':')) {
          <mat-icon [svgIcon]="resolvedIcon()"></mat-icon>
        } @else {
          <mat-icon>{{ resolvedIcon() }}</mat-icon>
        }
      </div>

      <!-- Title -->
      <h2 class="ax-error-state__title">{{ config().title }}</h2>

      <!-- Description -->
      <p class="ax-error-state__desc">{{ config().description }}</p>

      <!-- Actions (v2 config-based OR v1 legacy callback-based) -->
      @if (!hideActions()) {
        @if (hasLegacyActions()) {
          <!-- Legacy v1 actions -->
          <div class="ax-error-state__actions">
            @for (action of actions(); track action.label) {
              <button
                type="button"
                class="ax-error-state__btn"
                [class.ax-error-state__btn--primary]="action.primary"
                [class.ax-error-state__btn--secondary]="!action.primary"
                (click)="action.callback()"
              >
                @if (action.icon) {
                  <mat-icon class="ax-error-state__btn-icon">{{
                    action.icon
                  }}</mat-icon>
                }
                {{ action.label }}
              </button>
            }
          </div>
        } @else {
          <!-- v2 config-based actions -->
          <div class="ax-error-state__actions">
            @if (config().primaryAction; as action) {
              <button
                type="button"
                class="ax-error-state__btn ax-error-state__btn--primary"
                (click)="onAction(action.type, action.route)"
              >
                @if (action.type === 'retry') {
                  <mat-icon
                    class="ax-error-state__btn-icon"
                    svgIcon="ax:err-rotate-ccw"
                  ></mat-icon>
                }
                {{ action.label }}
              </button>
            }
            @if (config().secondaryAction; as action) {
              <button
                type="button"
                class="ax-error-state__btn ax-error-state__btn--secondary"
                (click)="onAction(action.type, action.route)"
              >
                {{ action.label }}
              </button>
            }
          </div>
        }
      }

      <!-- Technical code -->
      @if (showTechnicalCode()) {
        <div class="ax-error-state__tech-code">
          {{ config().technicalLabel }}
        </div>
      }

      <!-- Expandable technical details -->
      @if (technicalDetails()) {
        <details class="ax-error-state__details">
          <summary class="ax-error-state__details-toggle">
            รายละเอียดทางเทคนิค
          </summary>
          <div class="ax-error-state__details-content">
            {{ technicalDetails() }}
          </div>
        </details>
      }
    </div>
  `,
  styles: [
    `
      .ax-error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 48px 24px;
        min-height: 320px;
      }

      .ax-error-state--bordered {
        border: 1px solid var(--ax-border-default, #e4e4e7);
        border-radius: 12px;
        background: var(--ax-background-default, #fff);
      }

      .ax-error-state__icon mat-icon {
        width: 60px;
        height: 60px;
        font-size: 60px;
      }

      .ax-error-state__title {
        font-size: 16px;
        font-weight: 600;
        color: var(--ax-text-primary, #101828);
        margin: 20px 0 0;
      }

      .ax-error-state__desc {
        font-size: 14px;
        font-weight: 400;
        color: var(--ax-text-secondary, #667085);
        margin: 6px 0 0;
        max-width: 400px;
        line-height: 1.6;
      }

      .ax-error-state__actions {
        margin-top: 24px;
        display: flex;
        gap: 12px;
      }

      .ax-error-state__btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border: none;
        transition: all 0.15s;
      }

      .ax-error-state__btn--primary {
        background: var(--ax-brand-600, #1570ef);
        color: #fff;
        box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
      }
      .ax-error-state__btn--primary:hover {
        background: var(--ax-brand-700, #175cd3);
      }

      .ax-error-state__btn--secondary {
        background: var(--ax-surface, #fff);
        color: var(--ax-text-secondary, #344054);
        border: 1px solid var(--ax-border, #d0d5dd);
        box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
      }
      .ax-error-state__btn--secondary:hover {
        background: var(--ax-surface-hover, #f9fafb);
      }

      .ax-error-state__btn-icon {
        width: 16px;
        height: 16px;
        font-size: 16px;
      }

      .ax-error-state__tech-code {
        margin-top: 16px;
        font-size: 12px;
        font-family: var(--ax-font-mono, ui-monospace, monospace);
        color: var(--ax-text-muted, #98a2b3);
      }

      .ax-error-state__details {
        margin-top: 12px;
        max-width: 420px;
        width: 100%;
      }

      .ax-error-state__details-toggle {
        font-size: 12px;
        color: var(--ax-text-muted, #98a2b3);
        cursor: pointer;
        user-select: none;
      }
      .ax-error-state__details-toggle:hover {
        color: var(--ax-text-secondary, #667085);
      }

      .ax-error-state__details-content {
        margin-top: 8px;
        background: var(--ax-surface-subtle, #f9fafb);
        border-radius: 8px;
        padding: 12px;
        font-size: 12px;
        font-family: var(--ax-font-mono, ui-monospace, monospace);
        color: var(--ax-text-secondary, #667085);
        text-align: left;
        word-break: break-all;
      }
    `,
  ],
})
export class AxErrorStateComponent {
  // ── New API (v2 signal-based) ─────────────────────────
  readonly code = input<number | string>();
  readonly severity = input<ErrorSeverity>();
  readonly title = input<string>();
  readonly description = input<string>();
  readonly icon = input<string>();
  readonly showTechnicalCode = input(true);
  readonly technicalDetails = input<string>();
  readonly hideActions = input(false);
  /** Render a card-like border around the state */
  readonly bordered = input(false);

  // ── Legacy API (v1 backward compat — deprecated) ──────
  /** @deprecated Use `code` instead */
  readonly statusCode = input<number | null>();
  /** @deprecated Use `description` instead */
  readonly message = input<string>();
  /** @deprecated Use retry/navigate outputs instead */
  readonly actions = input<ErrorStateAction[]>([]);
  /** @deprecated Use `severity` instead */
  readonly type = input<'error' | 'warning' | 'info'>('error');
  /** @deprecated */
  readonly compact = input(false);
  /** @deprecated Use `showTechnicalCode` + `technicalDetails` instead */
  readonly showDetails = input(false);
  /** @deprecated Use `technicalDetails` instead */
  readonly errorDetails = input<string>();

  // Outputs
  readonly retry = output<void>();
  readonly navigate = output<string>();
  readonly login = output<void>();

  // Resolved code: prefer new `code`, fall back to legacy `statusCode`
  private readonly resolvedCode = computed(
    () => this.code() ?? this.statusCode() ?? undefined,
  );

  // Resolved config from code + overrides
  readonly config = computed<ErrorMessageConfig>(() =>
    resolveErrorConfig(this.resolvedCode(), {
      severity:
        this.severity() ?? (this.type() !== 'error' ? this.type() : undefined),
      title: this.title(),
      description: this.description() ?? this.message(),
      featuredIcon: this.icon(),
    }),
  );

  readonly resolvedIcon = computed(() => this.config().featuredIcon);

  /** Whether to use legacy callback-based actions */
  readonly hasLegacyActions = computed(() => this.actions().length > 0);

  onAction(type: ErrorAction['type'], route?: string): void {
    switch (type) {
      case 'retry':
        this.retry.emit();
        break;
      case 'navigate':
        this.navigate.emit(route ?? '/');
        break;
      case 'login':
        this.login.emit();
        break;
    }
  }
}
