import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  DocHeaderComponent,
  CodeTabsComponent,
} from '../../../../components/docs';

interface SpacingToken {
  name: string;
  cssVar: string;
  value: string;
  pixels: string;
}

@Component({
  selector: 'ax-spacing-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    DocHeaderComponent,
    CodeTabsComponent,
  ],
  template: `
    <div class="spacing-page">
      <ax-doc-header
        title="Spacing"
        description="Consistent spacing scale based on an 8px grid system. Use these tokens for margins, paddings, and gaps to maintain visual rhythm."
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Foundations', link: '/docs/foundations/overview' },
          { label: 'Spacing' },
        ]"
      ></ax-doc-header>

      <!-- Grid Principle -->
      <section class="spacing-page__principle">
        <div class="spacing-page__principle-visual">
          <div class="spacing-page__grid-demo">
            @for (i of [1, 2, 3, 4, 5, 6, 7, 8]; track i) {
              <div class="spacing-page__grid-unit"></div>
            }
          </div>
        </div>
        <div class="spacing-page__principle-content">
          <h3>8px Grid System</h3>
          <p>
            All spacing values are multiples of 4px, with the base unit being
            8px. This creates a consistent visual rhythm and ensures elements
            align properly across different screen sizes.
          </p>
        </div>
      </section>

      <!-- Spacing Scale -->
      <section class="spacing-page__scale">
        <h2 class="spacing-page__section-title">Spacing Scale</h2>

        <div class="spacing-page__tokens">
          @for (token of spacingTokens; track token.name) {
            <div
              class="spacing-page__token"
              (click)="copyToken(token.cssVar)"
              matTooltip="Click to copy"
            >
              <div class="spacing-page__token-visual">
                <div
                  class="spacing-page__token-box"
                  [style.width]="token.value"
                  [style.height]="token.value"
                ></div>
              </div>
              <div class="spacing-page__token-info">
                <span class="spacing-page__token-name">{{ token.name }}</span>
                <code class="spacing-page__token-css">{{ token.cssVar }}</code>
                <span class="spacing-page__token-value"
                  >{{ token.value }} ({{ token.pixels }})</span
                >
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Visual Comparison -->
      <section class="spacing-page__comparison">
        <h2 class="spacing-page__section-title">Visual Comparison</h2>

        <div class="spacing-page__bars">
          @for (token of spacingTokens; track token.name) {
            <div class="spacing-page__bar-row">
              <span class="spacing-page__bar-label">{{ token.name }}</span>
              <div
                class="spacing-page__bar"
                [style.width]="'calc(' + token.value + ' * 4)'"
              ></div>
              <span class="spacing-page__bar-value">{{ token.pixels }}</span>
            </div>
          }
        </div>
      </section>

      <!-- Usage Examples -->
      <section class="spacing-page__usage">
        <h2 class="spacing-page__section-title">Usage Examples</h2>

        <div class="spacing-page__examples">
          <div class="spacing-page__example">
            <h4>Card Padding</h4>
            <div
              class="spacing-page__example-demo spacing-page__example-demo--card"
            >
              <div class="demo-card">
                <span>spacing-lg</span>
              </div>
            </div>
            <code>padding: var(--ax-spacing-lg);</code>
          </div>

          <div class="spacing-page__example">
            <h4>Button Gap</h4>
            <div
              class="spacing-page__example-demo spacing-page__example-demo--buttons"
            >
              <button class="demo-button">Cancel</button>
              <button class="demo-button demo-button--primary">Save</button>
            </div>
            <code>gap: var(--ax-spacing-sm);</code>
          </div>

          <div class="spacing-page__example">
            <h4>Stack Spacing</h4>
            <div
              class="spacing-page__example-demo spacing-page__example-demo--stack"
            >
              <div class="demo-item"></div>
              <div class="demo-item"></div>
              <div class="demo-item"></div>
            </div>
            <code>gap: var(--ax-spacing-md);</code>
          </div>

          <div class="spacing-page__example">
            <h4>Section Margin</h4>
            <div
              class="spacing-page__example-demo spacing-page__example-demo--section"
            >
              <div class="demo-section">Section 1</div>
              <div class="demo-section">Section 2</div>
            </div>
            <code>margin-bottom: var(--ax-spacing-2xl);</code>
          </div>
        </div>
      </section>

      <!-- Code Example -->
      <section class="spacing-page__code">
        <h2 class="spacing-page__section-title">Usage in CSS</h2>
        <ax-code-tabs [tabs]="codeExamples"></ax-code-tabs>
      </section>
    </div>
  `,
  styles: [
    `
      .spacing-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .spacing-page__section-title {
        font-size: var(--ax-text-xl, 1.25rem);
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0 0 var(--ax-spacing-lg, 1rem) 0;
      }

      /* Grid Principle */
      .spacing-page__principle {
        display: flex;
        gap: var(--ax-spacing-xl, 1.5rem);
        align-items: center;
        padding: var(--ax-spacing-xl, 1.5rem);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg, 0.75rem);
        margin-bottom: var(--ax-spacing-2xl, 2rem);
      }

      .spacing-page__grid-demo {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 1px;
        background: var(--ax-border-default);
        padding: 1px;
        border-radius: var(--ax-radius-md, 0.5rem);
      }

      .spacing-page__grid-unit {
        width: 24px;
        height: 24px;
        background: var(--ax-brand-faint);
      }

      .spacing-page__principle-content {
        flex: 1;

        h3 {
          font-size: var(--ax-text-lg, 1.125rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
        }

        p {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin: 0;
          line-height: 1.6;
        }
      }

      /* Spacing Scale */
      .spacing-page__scale {
        margin-bottom: var(--ax-spacing-3xl, 3rem);
      }

      .spacing-page__tokens {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
      }

      .spacing-page__token {
        display: flex;
        flex-direction: column;
        cursor: pointer;
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg, 0.75rem);
        overflow: hidden;
        transition: all var(--ax-duration-fast, 150ms);

        &:hover {
          border-color: var(--ax-brand-default);
          box-shadow: var(--ax-shadow-sm);
        }
      }

      .spacing-page__token-visual {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 80px;
        background: var(--ax-background-subtle);
      }

      .spacing-page__token-box {
        background: var(--ax-brand-default);
        border-radius: var(--ax-radius-sm, 0.25rem);
        min-width: 4px;
        min-height: 4px;
      }

      .spacing-page__token-info {
        padding: var(--ax-spacing-sm, 0.5rem);
        background: var(--ax-background-default);
      }

      .spacing-page__token-name {
        display: block;
        font-size: var(--ax-text-sm, 0.875rem);
        font-weight: 600;
        color: var(--ax-text-primary);
      }

      .spacing-page__token-css {
        display: block;
        font-size: var(--ax-text-xs, 0.75rem);
        font-family: var(--ax-font-mono);
        color: var(--ax-text-secondary);
        margin: 2px 0;
      }

      .spacing-page__token-value {
        display: block;
        font-size: var(--ax-text-xs, 0.75rem);
        color: var(--ax-text-secondary);
      }

      /* Visual Comparison */
      .spacing-page__comparison {
        margin-bottom: var(--ax-spacing-3xl, 3rem);
      }

      .spacing-page__bars {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-sm, 0.5rem);
      }

      .spacing-page__bar-row {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-md, 0.75rem);
      }

      .spacing-page__bar-label {
        width: 80px;
        font-size: var(--ax-text-sm, 0.875rem);
        font-weight: 500;
        color: var(--ax-text-primary);
        text-align: right;
      }

      .spacing-page__bar {
        height: 24px;
        background: linear-gradient(
          90deg,
          var(--ax-brand-default),
          var(--ax-brand-subtle)
        );
        border-radius: var(--ax-radius-sm, 0.25rem);
        min-width: 16px;
      }

      .spacing-page__bar-value {
        font-size: var(--ax-text-xs, 0.75rem);
        color: var(--ax-text-secondary);
        font-family: var(--ax-font-mono);
      }

      /* Usage Examples */
      .spacing-page__usage {
        margin-bottom: var(--ax-spacing-3xl, 3rem);
      }

      .spacing-page__examples {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .spacing-page__example {
        padding: var(--ax-spacing-md, 0.75rem);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg, 0.75rem);

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }

        code {
          display: block;
          font-size: var(--ax-text-xs, 0.75rem);
          font-family: var(--ax-font-mono);
          color: var(--ax-text-secondary);
          margin-top: var(--ax-spacing-sm, 0.5rem);
        }
      }

      .spacing-page__example-demo {
        background: var(--ax-background-default);
        border-radius: var(--ax-radius-md, 0.5rem);
        padding: var(--ax-spacing-sm, 0.5rem);
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .demo-card {
        padding: var(--ax-spacing-lg);
        background: var(--ax-brand-faint);
        border: 1px dashed var(--ax-brand-muted);
        border-radius: var(--ax-radius-md, 0.5rem);
        font-size: var(--ax-text-xs, 0.75rem);
        color: var(--ax-brand-emphasis);
      }

      .spacing-page__example-demo--buttons {
        display: flex;
        gap: var(--ax-spacing-sm);
      }

      .demo-button {
        padding: var(--ax-spacing-xs) var(--ax-spacing-md);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md, 0.5rem);
        background: var(--ax-background-default);
        font-size: var(--ax-text-sm, 0.875rem);
        cursor: pointer;
      }

      .demo-button--primary {
        background: var(--ax-brand-default);
        color: var(--ax-brand-inverted);
        border-color: var(--ax-brand-default);
      }

      .spacing-page__example-demo--stack {
        flex-direction: column;
        gap: var(--ax-spacing-md);
        padding: var(--ax-spacing-md);
      }

      .demo-item {
        width: 100%;
        height: 16px;
        background: var(--ax-brand-subtle);
        border-radius: var(--ax-radius-sm, 0.25rem);
      }

      .spacing-page__example-demo--section {
        flex-direction: column;
        gap: var(--ax-spacing-2xl);
        padding: var(--ax-spacing-md);
      }

      .demo-section {
        padding: var(--ax-spacing-sm);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-sm, 0.25rem);
        font-size: var(--ax-text-xs, 0.75rem);
        color: var(--ax-text-secondary);
        text-align: center;
      }

      .spacing-page__code {
        margin-bottom: var(--ax-spacing-2xl, 2rem);
      }
    `,
  ],
})
export class SpacingComponent {
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  spacingTokens: SpacingToken[] = [
    { name: 'XS', cssVar: '--ax-spacing-xs', value: '0.25rem', pixels: '4px' },
    { name: 'SM', cssVar: '--ax-spacing-sm', value: '0.5rem', pixels: '8px' },
    { name: 'MD', cssVar: '--ax-spacing-md', value: '0.75rem', pixels: '12px' },
    { name: 'LG', cssVar: '--ax-spacing-lg', value: '1rem', pixels: '16px' },
    { name: 'XL', cssVar: '--ax-spacing-xl', value: '1.5rem', pixels: '24px' },
    { name: '2XL', cssVar: '--ax-spacing-2xl', value: '2rem', pixels: '32px' },
    { name: '3XL', cssVar: '--ax-spacing-3xl', value: '3rem', pixels: '48px' },
    { name: '4XL', cssVar: '--ax-spacing-4xl', value: '4rem', pixels: '64px' },
  ];

  codeExamples = [
    {
      label: 'CSS',
      language: 'scss' as const,
      code: `/* Using spacing tokens */
.card {
  padding: var(--ax-spacing-lg);
  margin-bottom: var(--ax-spacing-xl);
}

.button-group {
  display: flex;
  gap: var(--ax-spacing-sm);
}

.section {
  margin-top: var(--ax-spacing-3xl);
  padding: var(--ax-spacing-xl) var(--ax-spacing-lg);
}

.form-field {
  margin-bottom: var(--ax-spacing-md);
}`,
    },
    {
      label: 'Tailwind',
      language: 'html' as const,
      code: `<!-- Using with Tailwind classes -->
<div class="p-lg mb-xl">
  Card with lg padding and xl margin
</div>

<div class="flex gap-sm">
  <button>Cancel</button>
  <button>Save</button>
</div>

<section class="mt-3xl px-lg py-xl">
  Section content
</section>`,
    },
  ];

  copyToken(cssVar: string): void {
    const copyText = `var(${cssVar})`;
    this.clipboard.copy(copyText);
    this.snackBar.open(`Copied: ${copyText}`, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
