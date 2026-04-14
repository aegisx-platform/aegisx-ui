import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ax-nav-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 40 40"
      fill="none"
    >
      <rect
        x="20"
        y="2"
        width="25.46"
        height="25.46"
        rx="5"
        transform="rotate(45 20 2)"
        fill="currentColor"
      />
      <path
        d="M11 20L16 20L18 15L20 23L22 17L24 20L29 20"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--ax-primary, #3b82f6);
      }
      svg path {
        color: var(--ax-nav-logo-ecg, #fff);
      }
    `,
  ],
})
export class AxNavLogoComponent {
  @Input() size = 48;
}
