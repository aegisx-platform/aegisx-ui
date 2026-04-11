import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Code Tag Component
 *
 * Inline monospace code display for database names, table names, field codes, etc.
 *
 * @example
 * <ax-code-tag>drug_generics</ax-code-tag>
 * <ax-code-tag>hosxp_db</ax-code-tag>
 */
@Component({
  selector: 'ax-code-tag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<code class="ax-code-tag"><ng-content></ng-content></code>`,
  styles: [
    `
      :host {
        display: inline;
      }
      .ax-code-tag {
        font-family: var(
          --ax-font-mono,
          'JetBrains Mono',
          'Fira Code',
          ui-monospace,
          monospace
        );
        font-size: var(--ax-text-xs, 0.75rem);
        font-weight: 600;
        color: var(--ax-text-heading, #1e293b);
        background: var(--ax-background-muted, #f1f5f9);
        padding: 2px 8px;
        border-radius: var(--ax-radius-sm, 7px);
        white-space: nowrap;
      }
    `,
  ],
})
export class AxCodeTagComponent {}
