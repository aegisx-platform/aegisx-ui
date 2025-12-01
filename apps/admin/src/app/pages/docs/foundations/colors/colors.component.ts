import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  DocHeaderComponent,
  CodeTabsComponent,
} from '../../../../components/docs';

interface ColorVariant {
  name: string;
  cssVar: string;
  description: string;
}

interface ColorScale {
  name: string;
  description: string;
  icon: string;
  variants: ColorVariant[];
}

@Component({
  selector: 'ax-colors-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    DocHeaderComponent,
    CodeTabsComponent,
  ],
  template: `
    <div class="colors-page">
      <ax-doc-header
        title="Colors"
        icon="palette"
        description="Semantic color system with 5 color scales and 6 variants each. Each variant is designed for specific use cases to ensure consistency and accessibility."
        [breadcrumbs]="[
          { label: 'Foundations', link: '/docs/foundations/overview' },
          { label: 'Colors' },
        ]"
        [showImport]="false"
        [showQuickLinks]="false"
      ></ax-doc-header>

      <!-- Color Scales -->
      @for (scale of colorScales; track scale.name) {
        <section class="colors-page__scale">
          <div class="colors-page__scale-header">
            <mat-icon
              class="colors-page__scale-icon colors-page__scale-icon--{{
                scale.name
              }}"
            >
              {{ scale.icon }}
            </mat-icon>
            <div>
              <h2 class="colors-page__scale-title">
                {{ scale.name | titlecase }}
              </h2>
              <p class="colors-page__scale-description">
                {{ scale.description }}
              </p>
            </div>
          </div>

          <div class="colors-page__variants">
            @for (variant of scale.variants; track variant.name) {
              <div
                class="colors-page__variant"
                (click)="copyToken(variant.cssVar)"
                matTooltip="Click to copy"
              >
                <div
                  class="colors-page__swatch"
                  [style.background-color]="'var(' + variant.cssVar + ')'"
                ></div>
                <div class="colors-page__variant-info">
                  <span class="colors-page__variant-name">{{
                    variant.name
                  }}</span>
                  <code class="colors-page__variant-css">{{
                    variant.cssVar
                  }}</code>
                  <span class="colors-page__variant-desc">{{
                    variant.description
                  }}</span>
                </div>
              </div>
            }
          </div>
        </section>
      }

      <!-- Usage Guidelines -->
      <section class="colors-page__guidelines">
        <h2 class="colors-page__section-title">Usage Guidelines</h2>

        <div class="colors-page__guideline-grid">
          <div class="colors-page__guideline">
            <h4>Faint</h4>
            <p>
              Background tints for large areas like cards, alerts, and sections.
            </p>
            <div class="colors-page__example colors-page__example--faint">
              Background
            </div>
          </div>

          <div class="colors-page__guideline">
            <h4>Muted</h4>
            <p>Subtle borders, dividers, and secondary backgrounds.</p>
            <div class="colors-page__example colors-page__example--muted">
              Border
            </div>
          </div>

          <div class="colors-page__guideline">
            <h4>Subtle</h4>
            <p>Hover states, focus rings, and decorative elements.</p>
            <div class="colors-page__example colors-page__example--subtle">
              Hover
            </div>
          </div>

          <div class="colors-page__guideline">
            <h4>Default</h4>
            <p>Primary action buttons, links, and key indicators.</p>
            <div class="colors-page__example colors-page__example--default">
              Action
            </div>
          </div>

          <div class="colors-page__guideline">
            <h4>Emphasis</h4>
            <p>Text on colored backgrounds, icons, and strong accents.</p>
            <div class="colors-page__example colors-page__example--emphasis">
              Text
            </div>
          </div>

          <div class="colors-page__guideline">
            <h4>Inverted</h4>
            <p>Text on dark backgrounds, contrasting elements.</p>
            <div class="colors-page__example colors-page__example--inverted">
              Contrast
            </div>
          </div>
        </div>
      </section>

      <!-- Code Example -->
      <section class="colors-page__code">
        <h2 class="colors-page__section-title">Usage in CSS</h2>
        <ax-code-tabs [tabs]="codeExamples"></ax-code-tabs>
      </section>
    </div>
  `,
  styles: [
    `
      .colors-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .colors-page__scale {
        margin-bottom: var(--ax-spacing-3xl, 3rem);
      }

      .colors-page__scale-header {
        display: flex;
        align-items: flex-start;
        gap: var(--ax-spacing-md, 0.75rem);
        margin-bottom: var(--ax-spacing-lg, 1rem);
      }

      .colors-page__scale-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        margin-top: 2px;
      }

      .colors-page__scale-icon--brand {
        color: var(--ax-brand-default);
      }
      .colors-page__scale-icon--success {
        color: var(--ax-success-default);
      }
      .colors-page__scale-icon--warning {
        color: var(--ax-warning-default);
      }
      .colors-page__scale-icon--error {
        color: var(--ax-error-default);
      }
      .colors-page__scale-icon--info {
        color: var(--ax-info-default);
      }

      .colors-page__scale-title {
        font-size: var(--ax-text-xl, 1.25rem);
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0;
      }

      .colors-page__scale-description {
        font-size: var(--ax-text-sm, 0.875rem);
        color: var(--ax-text-secondary);
        margin: var(--ax-spacing-xs, 0.25rem) 0 0 0;
      }

      .colors-page__variants {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
      }

      .colors-page__variant {
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

      .colors-page__swatch {
        height: 80px;
        width: 100%;
      }

      .colors-page__variant-info {
        padding: var(--ax-spacing-sm, 0.5rem);
        background: var(--ax-background-default);
      }

      .colors-page__variant-name {
        display: block;
        font-size: var(--ax-text-sm, 0.875rem);
        font-weight: 600;
        color: var(--ax-text-primary);
        text-transform: capitalize;
      }

      .colors-page__variant-css {
        display: block;
        font-size: var(--ax-text-xs, 0.75rem);
        font-family: var(--ax-font-mono);
        color: var(--ax-text-secondary);
        margin: 2px 0;
      }

      .colors-page__variant-desc {
        display: block;
        font-size: var(--ax-text-xs, 0.75rem);
        color: var(--ax-text-secondary);
      }

      .colors-page__section-title {
        font-size: var(--ax-text-xl, 1.25rem);
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0 0 var(--ax-spacing-lg, 1rem) 0;
      }

      .colors-page__guidelines {
        margin-bottom: var(--ax-spacing-3xl, 3rem);
      }

      .colors-page__guideline-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
      }

      .colors-page__guideline {
        padding: var(--ax-spacing-md, 0.75rem);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg, 0.75rem);

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
        }

        p {
          font-size: var(--ax-text-xs, 0.75rem);
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
          line-height: 1.4;
        }
      }

      .colors-page__example {
        padding: var(--ax-spacing-sm, 0.5rem);
        border-radius: var(--ax-radius-md, 0.5rem);
        font-size: var(--ax-text-xs, 0.75rem);
        font-weight: 500;
        text-align: center;
      }

      .colors-page__example--faint {
        background: var(--ax-brand-faint);
        color: var(--ax-brand-emphasis);
      }

      .colors-page__example--muted {
        background: transparent;
        border: 2px solid var(--ax-brand-muted);
        color: var(--ax-text-primary);
      }

      .colors-page__example--subtle {
        background: var(--ax-brand-subtle);
        color: var(--ax-brand-emphasis);
      }

      .colors-page__example--default {
        background: var(--ax-brand-default);
        color: var(--ax-brand-inverted);
      }

      .colors-page__example--emphasis {
        background: var(--ax-background-default);
        color: var(--ax-brand-emphasis);
        border: 1px solid var(--ax-border-default);
      }

      .colors-page__example--inverted {
        background: var(--ax-brand-emphasis);
        color: var(--ax-brand-inverted);
      }

      .colors-page__code {
        margin-bottom: var(--ax-spacing-2xl, 2rem);
      }
    `,
  ],
})
export class ColorsComponent {
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  colorScales: ColorScale[] = [
    {
      name: 'brand',
      description:
        'Primary brand color for key actions, links, and focus states.',
      icon: 'star',
      variants: [
        {
          name: 'faint',
          cssVar: '--ax-brand-faint',
          description: 'Subtle backgrounds',
        },
        {
          name: 'muted',
          cssVar: '--ax-brand-muted',
          description: 'Borders, dividers',
        },
        {
          name: 'subtle',
          cssVar: '--ax-brand-subtle',
          description: 'Hover states',
        },
        {
          name: 'default',
          cssVar: '--ax-brand-default',
          description: 'Primary actions',
        },
        {
          name: 'emphasis',
          cssVar: '--ax-brand-emphasis',
          description: 'Text, icons',
        },
        {
          name: 'inverted',
          cssVar: '--ax-brand-inverted',
          description: 'Text on brand',
        },
      ],
    },
    {
      name: 'success',
      description:
        'Positive outcomes, confirmations, and successful operations.',
      icon: 'check_circle',
      variants: [
        {
          name: 'faint',
          cssVar: '--ax-success-faint',
          description: 'Success backgrounds',
        },
        {
          name: 'muted',
          cssVar: '--ax-success-muted',
          description: 'Success borders',
        },
        {
          name: 'subtle',
          cssVar: '--ax-success-subtle',
          description: 'Success hover',
        },
        {
          name: 'default',
          cssVar: '--ax-success-default',
          description: 'Success actions',
        },
        {
          name: 'emphasis',
          cssVar: '--ax-success-emphasis',
          description: 'Success text',
        },
        {
          name: 'inverted',
          cssVar: '--ax-success-inverted',
          description: 'Text on success',
        },
      ],
    },
    {
      name: 'warning',
      description:
        'Caution states, pending actions, and attention-needed items.',
      icon: 'warning',
      variants: [
        {
          name: 'faint',
          cssVar: '--ax-warning-faint',
          description: 'Warning backgrounds',
        },
        {
          name: 'muted',
          cssVar: '--ax-warning-muted',
          description: 'Warning borders',
        },
        {
          name: 'subtle',
          cssVar: '--ax-warning-subtle',
          description: 'Warning hover',
        },
        {
          name: 'default',
          cssVar: '--ax-warning-default',
          description: 'Warning actions',
        },
        {
          name: 'emphasis',
          cssVar: '--ax-warning-emphasis',
          description: 'Warning text',
        },
        {
          name: 'inverted',
          cssVar: '--ax-warning-inverted',
          description: 'Text on warning',
        },
      ],
    },
    {
      name: 'error',
      description: 'Error states, destructive actions, and critical alerts.',
      icon: 'error',
      variants: [
        {
          name: 'faint',
          cssVar: '--ax-error-faint',
          description: 'Error backgrounds',
        },
        {
          name: 'muted',
          cssVar: '--ax-error-muted',
          description: 'Error borders',
        },
        {
          name: 'subtle',
          cssVar: '--ax-error-subtle',
          description: 'Error hover',
        },
        {
          name: 'default',
          cssVar: '--ax-error-default',
          description: 'Error actions',
        },
        {
          name: 'emphasis',
          cssVar: '--ax-error-emphasis',
          description: 'Error text',
        },
        {
          name: 'inverted',
          cssVar: '--ax-error-inverted',
          description: 'Text on error',
        },
      ],
    },
    {
      name: 'info',
      description: 'Informational content, tips, and neutral notifications.',
      icon: 'info',
      variants: [
        {
          name: 'faint',
          cssVar: '--ax-info-faint',
          description: 'Info backgrounds',
        },
        {
          name: 'muted',
          cssVar: '--ax-info-muted',
          description: 'Info borders',
        },
        {
          name: 'subtle',
          cssVar: '--ax-info-subtle',
          description: 'Info hover',
        },
        {
          name: 'default',
          cssVar: '--ax-info-default',
          description: 'Info actions',
        },
        {
          name: 'emphasis',
          cssVar: '--ax-info-emphasis',
          description: 'Info text',
        },
        {
          name: 'inverted',
          cssVar: '--ax-info-inverted',
          description: 'Text on info',
        },
      ],
    },
  ];

  codeExamples = [
    {
      label: 'CSS',
      language: 'scss' as const,
      code: `/* Using semantic colors in your styles */
.alert {
  background-color: var(--ax-error-faint);
  border: 1px solid var(--ax-error-muted);
  color: var(--ax-error-emphasis);
}

.button-primary {
  background-color: var(--ax-brand-default);
  color: var(--ax-brand-inverted);
}

.button-primary:hover {
  background-color: var(--ax-brand-emphasis);
}

.success-badge {
  background-color: var(--ax-success-faint);
  color: var(--ax-success-emphasis);
}`,
    },
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Using colors with Tailwind-style classes -->
<div class="bg-brand-faint border border-brand-muted text-brand-emphasis">
  Brand colored alert
</div>

<button class="bg-brand-default text-brand-inverted hover:bg-brand-emphasis">
  Primary Action
</button>

<span class="bg-success-faint text-success-emphasis">
  Success Badge
</span>`,
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
