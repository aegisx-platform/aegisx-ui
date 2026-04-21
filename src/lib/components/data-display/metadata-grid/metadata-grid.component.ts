import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MetadataGridDensity, MetadataGridItem } from './metadata-grid.types';

/**
 * <ax-metadata-grid>
 *
 * Semantic definition list (`<dl>`) laid out as an auto-fit grid.
 * Used in record headers, detail panes, and anywhere a compact
 * label/value table is needed.
 *
 * The `minColWidth` input controls when the grid wraps onto more
 * columns — default 200 px fits typical dashboard columns.
 *
 * @example
 * <ax-metadata-grid
 *   [items]="[
 *     { label: 'ผู้ขาย', value: item.vendor },
 *     { label: 'ยอดรวม', value: item.amount },
 *     { label: 'วันที่',  value: item.receivedAt }
 *   ]" />
 */
@Component({
  selector: 'ax-metadata-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <dl
      class="ax-metadata-grid"
      [class.ax-metadata-grid--compact]="density === 'compact'"
      [style.--ax-metadata-grid-min-col]="minColWidth + 'px'"
    >
      @for (item of items; track $index) {
        <div class="ax-metadata-grid__row">
          <dt class="ax-metadata-grid__label">{{ item.label }}</dt>
          <dd class="ax-metadata-grid__value">
            {{ formatValue(item.value) }}
          </dd>
        </div>
      }
    </dl>
  `,
  styles: [
    `
      .ax-metadata-grid {
        display: grid;
        grid-template-columns: repeat(
          auto-fit,
          minmax(var(--ax-metadata-grid-min-col, 200px), 1fr)
        );
        gap: 16px 24px;
        margin: 0;
      }

      .ax-metadata-grid--compact {
        gap: 10px 20px;
      }

      .ax-metadata-grid__row {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .ax-metadata-grid__label {
        margin: 0;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--ax-text-secondary, #71717a);
      }

      .ax-metadata-grid__value {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        color: var(--ax-text-heading, #09090b);
        overflow-wrap: anywhere;
      }

      .ax-metadata-grid--compact .ax-metadata-grid__value {
        font-size: 13px;
      }
    `,
  ],
})
export class AxMetadataGridComponent {
  /** Rows to render. */
  @Input() items: readonly MetadataGridItem[] = [];

  /** Density — `compact` reduces gap + value font size. */
  @Input() density: MetadataGridDensity = 'comfortable';

  /**
   * Minimum column width in pixels for the `auto-fit` grid. Lower = more
   * columns per row. Default fits typical dashboard contexts (200 px).
   */
  @Input() minColWidth = 200;

  formatValue(value: string | number | null | undefined): string {
    if (value == null) return '—';
    return String(value);
  }
}
