import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ListItemDensity } from './list-item.types';

/**
 * <ax-list-item>
 *
 * Compact 3-line row used in master-detail list panes (see layouts-demo
 * L6), hub cards, settings groups, etc. Pattern:
 *
 *   [code]   TITLE         [trailing]
 *            meta · meta
 *
 * Stateful: supports `active` (selected highlight) and emits `clicked`.
 * Slots `[leading]` and `[trailing]` accept any content (icons, badges,
 * avatars).
 *
 * @example
 * <ax-list-item
 *   code="R-2026-042"
 *   title="ตรวจรับยาอมทรอกซ์"
 *   [meta]="['บริษัท XYZ', '฿125,000']"
 *   [active]="selected() === item.id"
 *   (clicked)="selected.set(item.id)">
 *   <ax-badge color="success" variant="soft" slot="trailing">ผ่าน</ax-badge>
 * </ax-list-item>
 */
@Component({
  selector: 'ax-list-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      type="button"
      class="ax-list-item"
      [class.ax-list-item--active]="active"
      [class.ax-list-item--compact]="density === 'compact'"
      [attr.aria-pressed]="active"
      (click)="onClick()"
    >
      <div class="ax-list-item__leading">
        <ng-content select="[slot=leading]" />
      </div>

      <div class="ax-list-item__body">
        <div class="ax-list-item__header">
          @if (code) {
            <span class="ax-list-item__code">{{ code }}</span>
          }
          @if (title) {
            <span class="ax-list-item__title">{{ title }}</span>
          }
        </div>
        @if (metaItems.length) {
          <div class="ax-list-item__meta">
            @for (m of metaItems; track $index; let last = $last) {
              <span>{{ m }}</span>
              @if (!last) {
                <span class="ax-list-item__meta-sep" aria-hidden="true">·</span>
              }
            }
          </div>
        }
      </div>

      <div class="ax-list-item__trailing">
        <ng-content select="[slot=trailing]" />
      </div>
    </button>
  `,
  styles: [
    `
      .ax-list-item {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 12px;
        align-items: center;
        padding: 12px 16px;
        border: none;
        background: transparent;
        text-align: left;
        cursor: pointer;
        color: var(--ax-text-default, #3f3f46);
        border-bottom: 1px solid var(--ax-border-subtle, #f4f4f5);
        transition:
          background 0.1s,
          color 0.1s;
      }

      .ax-list-item:last-child {
        border-bottom: none;
      }

      .ax-list-item:hover {
        background: var(--ax-background-muted, #fafafa);
      }

      .ax-list-item:focus-visible {
        outline: 2px solid var(--ax-primary, #6366f1);
        outline-offset: -2px;
      }

      .ax-list-item--active {
        background: var(--ax-brand-faint, #eef2ff);
        color: var(--ax-primary, #6366f1);
      }

      .ax-list-item--compact {
        padding: 8px 12px;
        gap: 10px;
      }

      .ax-list-item__leading:empty,
      .ax-list-item__trailing:empty {
        display: none;
      }

      .ax-list-item__body {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .ax-list-item__header {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }

      .ax-list-item__code {
        flex-shrink: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.02em;
        color: var(--ax-text-secondary, #71717a);
      }

      .ax-list-item--active .ax-list-item__code {
        color: var(--ax-primary, #6366f1);
      }

      .ax-list-item__title {
        flex: 1 1 auto;
        min-width: 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--ax-text-heading, #09090b);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .ax-list-item--active .ax-list-item__title {
        color: var(--ax-primary, #6366f1);
      }

      .ax-list-item__meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: var(--ax-text-secondary, #71717a);
        line-height: 1.4;
      }

      .ax-list-item__meta-sep {
        color: var(--ax-text-subtle, #a1a1aa);
      }

      .ax-list-item__trailing {
        flex-shrink: 0;
      }
    `,
  ],
})
export class AxListItemComponent {
  /** Short monospace code shown before the title (e.g. "R-2026-042"). */
  @Input() code = '';

  /** Primary label. */
  @Input() title = '';

  /**
   * Secondary metadata — rendered as a dot-separated inline list.
   * Accepts `string` (split on ' · ' auto) or `string[]`.
   */
  @Input() set meta(value: string | readonly string[] | null | undefined) {
    if (value == null || value === '') {
      this.metaItems = [];
      return;
    }
    this.metaItems = Array.isArray(value)
      ? [...value]
      : String(value)
          .split(/\s*·\s*/)
          .filter((x) => x.length > 0);
  }

  /** Selected / active state — applies the accent highlight. */
  @Input() active = false;

  /** Density — `compact` tightens padding + gap. */
  @Input() density: ListItemDensity = 'comfortable';

  /** Emitted when the item is clicked or activated via keyboard. */
  @Output() clicked = new EventEmitter<void>();

  /** Parsed meta items (precomputed for template). */
  metaItems: string[] = [];

  onClick(): void {
    this.clicked.emit();
  }
}
