import {
  Component,
  Input,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ComponentToken } from '../../../types/docs.types';

/**
 * Component Tokens Component
 *
 * Displays CSS tokens/variables used by a component with:
 * - Token name and CSS variable
 * - Usage description
 * - Live computed value preview
 * - Click to copy
 */
@Component({
  selector: 'ax-component-tokens',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="component-tokens">
      <h3 class="component-tokens__title">
        <mat-icon>palette</mat-icon>
        Tokens Used
      </h3>
      <p class="component-tokens__description">
        CSS variables that control this component's appearance.
      </p>

      <div class="component-tokens__table-wrapper">
        <table class="component-tokens__table">
          <thead>
            <tr>
              <th class="component-tokens__th--preview">Preview</th>
              <th class="component-tokens__th--token">Token</th>
              <th class="component-tokens__th--usage">Usage</th>
              <th class="component-tokens__th--value">Value</th>
            </tr>
          </thead>
          <tbody>
            @for (token of tokens; track token.cssVar) {
              <tr
                class="component-tokens__row"
                (click)="copyToken(token.cssVar)"
                matTooltip="Click to copy"
              >
                <td class="component-tokens__cell--preview">
                  <span
                    class="component-tokens__swatch"
                    [style]="getPreviewStyle(token)"
                  ></span>
                </td>
                <td class="component-tokens__cell--token">
                  <code class="component-tokens__code">{{ token.cssVar }}</code>
                  <span class="component-tokens__category">{{
                    token.category
                  }}</span>
                </td>
                <td class="component-tokens__cell--usage">
                  {{ token.usage }}
                </td>
                <td class="component-tokens__cell--value">
                  <code class="component-tokens__value">{{
                    getComputedValue(token.cssVar)
                  }}</code>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  // Styles are provided by @aegisx/ui theme styles (_docs.scss)
})
export class ComponentTokensComponent implements OnInit {
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  @Input() tokens: ComponentToken[] = [];

  private computedValues: Map<string, string> = new Map();

  ngOnInit(): void {
    // Pre-compute all token values
    this.tokens.forEach((token) => {
      const value = this.computeCssValue(token.cssVar);
      this.computedValues.set(token.cssVar, value);
    });
  }

  getComputedValue(cssVar: string): string {
    return this.computedValues.get(cssVar) || 'inherit';
  }

  getPreviewStyle(token: ComponentToken): Record<string, string> {
    const value = this.getComputedValue(token.cssVar);
    const category = token.category.toLowerCase();

    if (category === 'colors' || category === 'color') {
      return { backgroundColor: `var(${token.cssVar})` };
    } else if (category === 'shadows' || category === 'shadow') {
      return {
        backgroundColor: 'var(--ax-background-default)',
        boxShadow: `var(${token.cssVar})`,
      };
    } else if (category === 'borders' || category === 'border') {
      if (token.cssVar.includes('radius')) {
        return {
          backgroundColor: 'var(--ax-brand-default)',
          borderRadius: `var(${token.cssVar})`,
        };
      }
      return {
        border: `2px solid var(--ax-border-default)`,
        borderWidth: `var(${token.cssVar})`,
      };
    } else if (category === 'spacing') {
      return {
        backgroundColor: 'var(--ax-brand-faint)',
        width: `var(${token.cssVar})`,
        height: `var(${token.cssVar})`,
        minWidth: '8px',
        minHeight: '8px',
        maxWidth: '24px',
        maxHeight: '24px',
      };
    }

    // Default: show as color
    return { backgroundColor: `var(${token.cssVar}, #ccc)` };
  }

  copyToken(cssVar: string): void {
    const copyText = `var(${cssVar})`;
    this.clipboard.copy(copyText);
    this.snackBar.open(`Copied: ${copyText}`, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  private computeCssValue(cssVar: string): string {
    if (typeof document === 'undefined') return 'inherit';

    const root = document.documentElement;
    const value = getComputedStyle(root)
      .getPropertyValue(cssVar.replace('--', ''))
      .trim();
    return value || 'inherit';
  }
}
