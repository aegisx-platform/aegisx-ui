import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type DiamondSize = 'sm' | 'md' | 'lg' | 'xl';
export type DiamondTheme = 'dark' | 'light';

/**
 * Diamond icon wrapper component
 *
 * Uses CSS rotation to create diamond shape from any `ax:` mono icon.
 * Replaces pre-rendered diamond SVGs with a single component.
 *
 * @example
 * ```html
 * <ax-diamond-icon icon="ax:inv-warehouse" bg="#065f46" border="#10b981" iconColor="#6ee7b7" />
 * ```
 */
@Component({
  selector: 'ax-diamond-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div
      class="ax-diamond"
      [class]="sizeClass()"
      [style.--diamond-bg]="bg()"
      [style.--diamond-border]="border()"
    >
      <div class="ax-diamond__inner">
        <mat-icon
          [svgIcon]="resolvedIcon()"
          [style.color]="iconColor()"
          [style.width.px]="iconPx()"
          [style.height.px]="iconPx()"
        />
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }

      .ax-diamond {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .ax-diamond__inner {
        transform: rotate(45deg);
        border-radius: var(--diamond-radius, 10px);
        background: var(--diamond-bg, #1e3a5f);
        border: 0.5px solid
          color-mix(in srgb, var(--diamond-border, #3b82f6) 40%, transparent);
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          transform: rotate(-45deg);
        }
      }

      /* Sizes */
      .ax-diamond--sm .ax-diamond__inner {
        width: 28px;
        height: 28px;
        --diamond-radius: 7px;
      }
      .ax-diamond--md .ax-diamond__inner {
        width: 32px;
        height: 32px;
        --diamond-radius: 8px;
      }
      .ax-diamond--lg .ax-diamond__inner {
        width: 36px;
        height: 36px;
        --diamond-radius: 10px;
      }
      .ax-diamond--xl .ax-diamond__inner {
        width: 44px;
        height: 44px;
        --diamond-radius: 12px;
      }
    `,
  ],
})
export class AxDiamondIconComponent {
  readonly icon = input.required<string>();
  readonly bg = input<string>('#1e3a5f');
  readonly border = input<string>('#3b82f6');
  readonly iconColor = input<string>('#93c5fd');
  readonly size = input<DiamondSize>('lg');

  readonly sizeClass = computed(() => `ax-diamond ax-diamond--${this.size()}`);

  readonly iconPx = computed(() => {
    const map: Record<DiamondSize, number> = { sm: 14, md: 16, lg: 20, xl: 24 };
    return map[this.size()];
  });

  readonly resolvedIcon = computed(() => {
    const icon = this.icon();
    if (icon.includes(':')) return icon;
    return `ax:${icon}`;
  });
}
