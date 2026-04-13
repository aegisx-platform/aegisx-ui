import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ax-nav-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (count) {
      @if (dot) {
        <span
          class="ax-nav-badge--dot"
          [style.borderColor]="borderColor"
        ></span>
      } @else {
        <span class="ax-nav-badge--count">{{ count }}</span>
      }
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .ax-nav-badge--dot {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--ax-nav-badge-bg, #ef4444);
        border: 2px solid var(--ax-nav-bg, #1a1d23);
        z-index: 2;
      }

      .ax-nav-badge--count {
        font-size: 10px;
        font-weight: 700;
        padding: 1px 6px;
        border-radius: 10px;
        background: var(--ax-nav-badge-text-bg, rgba(239, 68, 68, 0.15));
        color: var(--ax-nav-badge-text, #f87171);
      }
    `,
  ],
})
export class AxNavBadgeComponent {
  @Input() count?: number;
  @Input() dot = false;
  @Input() borderColor = '#1a1d23';
}
