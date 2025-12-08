import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * Live Preview Component
 *
 * Simple container for displaying live component examples with:
 * - Customizable background
 * - Flexible layout options (row/column, wrap, gap)
 * - Theme-aware styling
 */
@Component({
  selector: 'ax-live-preview',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  template: `
    <div
      class="live-preview"
      [class.live-preview--bordered]="variant === 'bordered'"
    >
      <div
        class="live-preview__content"
        [class.live-preview__content--dark]="variant === 'dark'"
        [class.live-preview__content--subtle]="variant === 'subtle'"
        [class.live-preview__content--white]="variant === 'white'"
        [class.live-preview__content--contrast]="variant === 'contrast'"
        [class.live-preview__content--center]="align === 'center'"
        [class.live-preview__content--start]="align === 'start'"
        [class.live-preview__content--end]="align === 'end'"
        [class.live-preview__content--stretch]="align === 'stretch'"
        [class.live-preview__content--column]="direction === 'column'"
        [class.live-preview__content--wrap]="wrap"
        [style.min-height]="minHeight"
        [style.padding]="padding"
        [style.gap]="gap"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  // Styles are provided by @aegisx/ui theme styles (_docs.scss)
})
export class LivePreviewComponent {
  @Input() variant:
    | 'default'
    | 'dark'
    | 'subtle'
    | 'bordered'
    | 'white'
    | 'contrast' = 'bordered';
  @Input() align: 'center' | 'start' | 'end' | 'stretch' = 'center';
  @Input() direction: 'row' | 'column' = 'row';
  @Input() wrap = true;
  @Input() minHeight = '100px';
  @Input() padding = 'var(--ax-spacing-lg, 1rem)';
  @Input() gap = 'var(--ax-spacing-md, 0.75rem)';
}
