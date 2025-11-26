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

interface ShadowToken {
  name: string;
  cssVar: string;
  value: string;
  useCase: string;
}

@Component({
  selector: 'ax-shadows-page',
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
    <div class="shadows-page">
      <ax-doc-header
        title="Shadows"
        description="Elevation and depth effects that create visual hierarchy. Use shadows to indicate interactive elements, overlays, and spatial relationships."
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Foundations', link: '/docs/foundations/overview' },
          { label: 'Shadows' },
        ]"
      ></ax-doc-header>

      <!-- Elevation Principle -->
      <section class="shadows-page__principle">
        <div class="shadows-page__elevation-demo">
          <div class="shadows-page__level shadows-page__level--0">0</div>
          <div class="shadows-page__level shadows-page__level--1">1</div>
          <div class="shadows-page__level shadows-page__level--2">2</div>
          <div class="shadows-page__level shadows-page__level--3">3</div>
          <div class="shadows-page__level shadows-page__level--4">4</div>
        </div>
        <div class="shadows-page__principle-content">
          <h3>Elevation System</h3>
          <p>
            Shadows indicate elevation levels in the UI. Higher elevation means
            the element is closer to the user and more prominent. Use shadows
            consistently to create a clear visual hierarchy.
          </p>
        </div>
      </section>

      <!-- Shadow Tokens -->
      <section class="shadows-page__tokens">
        <h2 class="shadows-page__section-title">Shadow Scale</h2>

        <div class="shadows-page__grid">
          @for (token of shadowTokens; track token.name) {
            <div
              class="shadows-page__token"
              (click)="copyToken(token.cssVar)"
              matTooltip="Click to copy"
            >
              <div class="shadows-page__token-preview">
                <div
                  class="shadows-page__token-box"
                  [style.box-shadow]="'var(' + token.cssVar + ')'"
                ></div>
              </div>
              <div class="shadows-page__token-info">
                <span class="shadows-page__token-name">{{ token.name }}</span>
                <code class="shadows-page__token-css">{{ token.cssVar }}</code>
                <span class="shadows-page__token-use">{{ token.useCase }}</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Usage Examples -->
      <section class="shadows-page__usage">
        <h2 class="shadows-page__section-title">Usage Examples</h2>

        <div class="shadows-page__examples">
          <div class="shadows-page__example">
            <h4>Cards & Containers</h4>
            <div class="shadows-page__example-demo">
              <div class="demo-card demo-card--sm">shadow-sm</div>
            </div>
            <p>Use <code>shadow-sm</code> for cards and subtle elevation</p>
          </div>

          <div class="shadows-page__example">
            <h4>Dropdowns & Popovers</h4>
            <div class="shadows-page__example-demo">
              <div class="demo-card demo-card--md">shadow-md</div>
            </div>
            <p>Use <code>shadow-md</code> for floating elements</p>
          </div>

          <div class="shadows-page__example">
            <h4>Modals & Dialogs</h4>
            <div class="shadows-page__example-demo">
              <div class="demo-card demo-card--lg">shadow-lg</div>
            </div>
            <p>Use <code>shadow-lg</code> for modal overlays</p>
          </div>

          <div class="shadows-page__example">
            <h4>Hover States</h4>
            <div class="shadows-page__example-demo">
              <div class="demo-card demo-card--hover">Hover me</div>
            </div>
            <p>Increase shadow on hover for interactive feedback</p>
          </div>
        </div>
      </section>

      <!-- Interactive Demo -->
      <section class="shadows-page__interactive">
        <h2 class="shadows-page__section-title">Interactive Elevation</h2>
        <p class="shadows-page__description">
          Hover over the cards to see how shadows can indicate interactivity.
        </p>

        <div class="shadows-page__interactive-grid">
          <div class="shadows-page__interactive-card">
            <mat-icon>folder</mat-icon>
            <span>Project Files</span>
          </div>
          <div class="shadows-page__interactive-card">
            <mat-icon>image</mat-icon>
            <span>Images</span>
          </div>
          <div class="shadows-page__interactive-card">
            <mat-icon>description</mat-icon>
            <span>Documents</span>
          </div>
          <div class="shadows-page__interactive-card">
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </div>
        </div>
      </section>

      <!-- Code Example -->
      <section class="shadows-page__code">
        <h2 class="shadows-page__section-title">Usage in CSS</h2>
        <ax-code-tabs [tabs]="codeExamples"></ax-code-tabs>
      </section>
    </div>
  `,
  styles: [
    `
      .shadows-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .shadows-page__section-title {
        font-size: var(--ax-text-xl, 1.25rem);
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0 0 var(--ax-spacing-lg, 1rem) 0;
      }

      .shadows-page__description {
        font-size: var(--ax-text-sm, 0.875rem);
        color: var(--ax-text-secondary);
        margin: 0 0 var(--ax-spacing-lg, 1rem) 0;
      }

      /* Principle */
      .shadows-page__principle {
        display: flex;
        gap: var(--ax-spacing-xl, 1.5rem);
        align-items: center;
        padding: var(--ax-spacing-xl, 1.5rem);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg, 0.75rem);
        margin-bottom: var(--ax-spacing-2xl, 2rem);
      }

      .shadows-page__elevation-demo {
        display: flex;
        gap: var(--ax-spacing-md, 0.75rem);
        perspective: 500px;
      }

      .shadows-page__level {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--ax-background-default);
        border-radius: var(--ax-radius-md, 0.5rem);
        font-size: var(--ax-text-sm, 0.875rem);
        font-weight: 600;
        color: var(--ax-text-secondary);
      }

      .shadows-page__level--0 {
        box-shadow: none;
      }
      .shadows-page__level--1 {
        box-shadow: var(--ax-shadow-xs);
        transform: translateZ(4px);
      }
      .shadows-page__level--2 {
        box-shadow: var(--ax-shadow-sm);
        transform: translateZ(8px);
      }
      .shadows-page__level--3 {
        box-shadow: var(--ax-shadow-md);
        transform: translateZ(16px);
      }
      .shadows-page__level--4 {
        box-shadow: var(--ax-shadow-lg);
        transform: translateZ(24px);
      }

      .shadows-page__principle-content {
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

      /* Tokens */
      .shadows-page__tokens {
        margin-bottom: var(--ax-spacing-3xl, 3rem);
      }

      .shadows-page__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .shadows-page__token {
        cursor: pointer;
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg, 0.75rem);
        overflow: hidden;
        transition: all var(--ax-duration-fast, 150ms);

        &:hover {
          border-color: var(--ax-brand-default);
        }
      }

      .shadows-page__token-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 120px;
        background: var(--ax-background-subtle);
        padding: var(--ax-spacing-lg, 1rem);
      }

      .shadows-page__token-box {
        width: 80px;
        height: 80px;
        background: var(--ax-background-default);
        border-radius: var(--ax-radius-lg, 0.75rem);
      }

      .shadows-page__token-info {
        padding: var(--ax-spacing-sm, 0.5rem);
        background: var(--ax-background-default);
      }

      .shadows-page__token-name {
        display: block;
        font-size: var(--ax-text-sm, 0.875rem);
        font-weight: 600;
        color: var(--ax-text-primary);
      }

      .shadows-page__token-css {
        display: block;
        font-size: var(--ax-text-xs, 0.75rem);
        font-family: var(--ax-font-mono);
        color: var(--ax-text-secondary);
        margin: 2px 0;
      }

      .shadows-page__token-use {
        display: block;
        font-size: var(--ax-text-xs, 0.75rem);
        color: var(--ax-text-secondary);
      }

      /* Usage */
      .shadows-page__usage {
        margin-bottom: var(--ax-spacing-3xl, 3rem);
      }

      .shadows-page__examples {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .shadows-page__example {
        padding: var(--ax-spacing-md, 0.75rem);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg, 0.75rem);

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }

        p {
          font-size: var(--ax-text-xs, 0.75rem);
          color: var(--ax-text-secondary);
          margin: var(--ax-spacing-sm, 0.5rem) 0 0 0;

          code {
            color: var(--ax-brand-emphasis);
          }
        }
      }

      .shadows-page__example-demo {
        display: flex;
        justify-content: center;
        padding: var(--ax-spacing-lg, 1rem);
        background: var(--ax-background-default);
        border-radius: var(--ax-radius-md, 0.5rem);
      }

      .demo-card {
        padding: var(--ax-spacing-md, 0.75rem) var(--ax-spacing-lg, 1rem);
        background: var(--ax-background-default);
        border-radius: var(--ax-radius-md, 0.5rem);
        font-size: var(--ax-text-xs, 0.75rem);
        color: var(--ax-text-secondary);
      }

      .demo-card--sm {
        box-shadow: var(--ax-shadow-sm);
      }
      .demo-card--md {
        box-shadow: var(--ax-shadow-md);
      }
      .demo-card--lg {
        box-shadow: var(--ax-shadow-lg);
      }

      .demo-card--hover {
        box-shadow: var(--ax-shadow-sm);
        transition: all var(--ax-duration-fast, 150ms);
        cursor: pointer;

        &:hover {
          box-shadow: var(--ax-shadow-md);
          transform: translateY(-2px);
        }
      }

      /* Interactive */
      .shadows-page__interactive {
        margin-bottom: var(--ax-spacing-3xl, 3rem);
      }

      .shadows-page__interactive-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .shadows-page__interactive-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--ax-spacing-sm, 0.5rem);
        padding: var(--ax-spacing-lg, 1rem);
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg, 0.75rem);
        box-shadow: var(--ax-shadow-xs);
        cursor: pointer;
        transition: all var(--ax-duration-fast, 150ms);

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: var(--ax-brand-default);
        }

        span {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-primary);
        }

        &:hover {
          box-shadow: var(--ax-shadow-lg);
          transform: translateY(-4px);
          border-color: var(--ax-brand-default);
        }
      }

      .shadows-page__code {
        margin-bottom: var(--ax-spacing-2xl, 2rem);
      }
    `,
  ],
})
export class ShadowsComponent {
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  shadowTokens: ShadowToken[] = [
    {
      name: 'Shadow XS',
      cssVar: '--ax-shadow-xs',
      value: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      useCase: 'Subtle elevation, buttons',
    },
    {
      name: 'Shadow SM',
      cssVar: '--ax-shadow-sm',
      value: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      useCase: 'Cards, containers',
    },
    {
      name: 'Shadow MD',
      cssVar: '--ax-shadow-md',
      value: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      useCase: 'Dropdowns, popovers',
    },
    {
      name: 'Shadow LG',
      cssVar: '--ax-shadow-lg',
      value: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      useCase: 'Modals, dialogs',
    },
    {
      name: 'Shadow XL',
      cssVar: '--ax-shadow-xl',
      value: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      useCase: 'Large overlays',
    },
  ];

  codeExamples = [
    {
      label: 'CSS',
      language: 'scss' as const,
      code: `/* Using shadow tokens */
.card {
  background: var(--ax-background-default);
  border-radius: var(--ax-radius-lg);
  box-shadow: var(--ax-shadow-sm);
}

.card:hover {
  box-shadow: var(--ax-shadow-md);
  transform: translateY(-2px);
}

.dropdown {
  box-shadow: var(--ax-shadow-md);
}

.modal {
  box-shadow: var(--ax-shadow-xl);
}`,
    },
    {
      label: 'Tailwind',
      language: 'html' as const,
      code: `<!-- Using with Tailwind classes -->
<div class="shadow-sm hover:shadow-md transition-shadow">
  Card with hover effect
</div>

<div class="shadow-md">
  Dropdown menu
</div>

<div class="shadow-xl">
  Modal dialog
</div>`,
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
