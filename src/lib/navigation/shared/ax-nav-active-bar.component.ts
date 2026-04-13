import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ax-nav-active-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (active) {
      <span class="ax-nav-active-bar" [style.background]="color"></span>
    }
  `,
  styles: [
    `
      .ax-nav-active-bar {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 24px;
        border-radius: 0 6px 6px 0;
        background: var(--ax-nav-active-bar, #3b82f6);
        transition: all 0.2s ease;
      }
    `,
  ],
})
export class AxNavActiveBarComponent {
  @Input() active = false;
  @Input() color = 'var(--ax-nav-active-bar, #3b82f6)';
}
