import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  DocHeaderComponent,
  LivePreviewComponent,
} from '../../../../components/docs';

interface FoundationCard {
  title: string;
  description: string;
  icon: string;
  link: string;
  tokenCount?: number;
  preview?: string;
}

@Component({
  selector: 'ax-foundations-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    DocHeaderComponent,
    LivePreviewComponent,
  ],
  template: `
    <div class="foundations-overview">
      <ax-doc-header
        title="Foundations"
        description="The building blocks of the AegisX Design System. These tokens and primitives ensure consistency across all components and applications."
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Foundations' },
        ]"
      ></ax-doc-header>

      <!-- Introduction -->
      <section class="foundations-overview__intro">
        <p class="foundations-overview__lead">
          AegisX Design System is built on a foundation of
          <strong>120+ design tokens</strong>
          that define colors, typography, spacing, shadows, and motion. These
          tokens are the single source of truth for all visual properties in
          your application.
        </p>
      </section>

      <!-- Token Stats -->
      <section class="foundations-overview__stats">
        <div class="foundations-overview__stat">
          <span class="foundations-overview__stat-value">120+</span>
          <span class="foundations-overview__stat-label">Design Tokens</span>
        </div>
        <div class="foundations-overview__stat">
          <span class="foundations-overview__stat-value">5</span>
          <span class="foundations-overview__stat-label">Semantic Colors</span>
        </div>
        <div class="foundations-overview__stat">
          <span class="foundations-overview__stat-value">6</span>
          <span class="foundations-overview__stat-label">Color Variants</span>
        </div>
        <div class="foundations-overview__stat">
          <span class="foundations-overview__stat-value">8</span>
          <span class="foundations-overview__stat-label">Spacing Scale</span>
        </div>
      </section>

      <!-- Foundation Cards -->
      <section class="foundations-overview__grid">
        @for (card of foundationCards; track card.title) {
          <a [routerLink]="card.link" class="foundations-overview__card">
            <div class="foundations-overview__card-header">
              <mat-icon class="foundations-overview__card-icon">{{
                card.icon
              }}</mat-icon>
              <h3 class="foundations-overview__card-title">{{ card.title }}</h3>
            </div>
            <p class="foundations-overview__card-description">
              {{ card.description }}
            </p>
            @if (card.tokenCount) {
              <span class="foundations-overview__card-count"
                >{{ card.tokenCount }} tokens</span
              >
            }
            <!-- Preview -->
            @if (card.preview === 'colors') {
              <div
                class="foundations-overview__preview foundations-overview__preview--colors"
              >
                <span class="swatch swatch--brand"></span>
                <span class="swatch swatch--success"></span>
                <span class="swatch swatch--warning"></span>
                <span class="swatch swatch--error"></span>
                <span class="swatch swatch--info"></span>
              </div>
            }
            @if (card.preview === 'typography') {
              <div
                class="foundations-overview__preview foundations-overview__preview--typography"
              >
                <span class="type-sample type-sample--xl">Aa</span>
                <span class="type-sample type-sample--lg">Aa</span>
                <span class="type-sample type-sample--md">Aa</span>
                <span class="type-sample type-sample--sm">Aa</span>
              </div>
            }
            @if (card.preview === 'spacing') {
              <div
                class="foundations-overview__preview foundations-overview__preview--spacing"
              >
                <span class="space-box space-box--xs"></span>
                <span class="space-box space-box--sm"></span>
                <span class="space-box space-box--md"></span>
                <span class="space-box space-box--lg"></span>
              </div>
            }
            @if (card.preview === 'shadows') {
              <div
                class="foundations-overview__preview foundations-overview__preview--shadows"
              >
                <span class="shadow-box shadow-box--sm"></span>
                <span class="shadow-box shadow-box--md"></span>
                <span class="shadow-box shadow-box--lg"></span>
              </div>
            }
            @if (card.preview === 'motion') {
              <div
                class="foundations-overview__preview foundations-overview__preview--motion"
              >
                <span class="motion-box"></span>
              </div>
            }
          </a>
        }
      </section>

      <!-- Design Principles -->
      <section class="foundations-overview__principles">
        <h2 class="foundations-overview__section-title">Design Principles</h2>
        <div class="foundations-overview__principles-grid">
          <div class="foundations-overview__principle">
            <mat-icon>layers</mat-icon>
            <h4>Layered Architecture</h4>
            <p>
              Primitive → Semantic → Component tokens for maximum flexibility
            </p>
          </div>
          <div class="foundations-overview__principle">
            <mat-icon>dark_mode</mat-icon>
            <h4>Theme-Aware</h4>
            <p>All tokens automatically adapt to light and dark modes</p>
          </div>
          <div class="foundations-overview__principle">
            <mat-icon>tune</mat-icon>
            <h4>Customizable</h4>
            <p>Override any token at the root level for full brand control</p>
          </div>
          <div class="foundations-overview__principle">
            <mat-icon>speed</mat-icon>
            <h4>Performance</h4>
            <p>CSS custom properties for instant theme switching</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .foundations-overview {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .foundations-overview__intro {
        margin-bottom: var(--ax-spacing-2xl, 2rem);
      }

      .foundations-overview__lead {
        font-size: var(--ax-text-lg, 1.125rem);
        color: var(--ax-text-secondary);
        line-height: 1.7;
        max-width: 800px;
      }

      .foundations-overview__stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin-bottom: var(--ax-spacing-2xl, 2rem);
      }

      .foundations-overview__stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--ax-spacing-lg, 1rem);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg, 0.75rem);
        border: 1px solid var(--ax-border-default);
      }

      .foundations-overview__stat-value {
        font-size: var(--ax-text-3xl, 1.875rem);
        font-weight: 700;
        color: var(--ax-brand-default);
      }

      .foundations-overview__stat-label {
        font-size: var(--ax-text-sm, 0.875rem);
        color: var(--ax-text-secondary);
        margin-top: var(--ax-spacing-xs, 0.25rem);
      }

      .foundations-overview__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
        margin-bottom: var(--ax-spacing-3xl, 3rem);
      }

      .foundations-overview__card {
        display: flex;
        flex-direction: column;
        padding: var(--ax-spacing-lg, 1rem);
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg, 0.75rem);
        text-decoration: none;
        transition: all var(--ax-duration-fast, 150ms);

        &:hover {
          border-color: var(--ax-brand-default);
          box-shadow: var(--ax-shadow-md);
          transform: translateY(-2px);
        }
      }

      .foundations-overview__card-header {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm, 0.5rem);
        margin-bottom: var(--ax-spacing-sm, 0.5rem);
      }

      .foundations-overview__card-icon {
        color: var(--ax-brand-default);
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .foundations-overview__card-title {
        font-size: var(--ax-text-lg, 1.125rem);
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0;
      }

      .foundations-overview__card-description {
        font-size: var(--ax-text-sm, 0.875rem);
        color: var(--ax-text-secondary);
        line-height: 1.5;
        margin: 0 0 var(--ax-spacing-md, 0.75rem) 0;
        flex: 1;
      }

      .foundations-overview__card-count {
        font-size: var(--ax-text-xs, 0.75rem);
        color: var(--ax-text-secondary);
        background: var(--ax-background-subtle);
        padding: 2px 8px;
        border-radius: var(--ax-radius-full, 9999px);
        align-self: flex-start;
        margin-bottom: var(--ax-spacing-md, 0.75rem);
      }

      .foundations-overview__preview {
        display: flex;
        gap: var(--ax-spacing-xs, 0.25rem);
        padding: var(--ax-spacing-sm, 0.5rem);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md, 0.5rem);
      }

      /* Color swatches */
      .swatch {
        width: 24px;
        height: 24px;
        border-radius: var(--ax-radius-sm, 0.25rem);
      }
      .swatch--brand {
        background: var(--ax-brand-default);
      }
      .swatch--success {
        background: var(--ax-success-default);
      }
      .swatch--warning {
        background: var(--ax-warning-default);
      }
      .swatch--error {
        background: var(--ax-error-default);
      }
      .swatch--info {
        background: var(--ax-info-default);
      }

      /* Typography samples */
      .foundations-overview__preview--typography {
        align-items: baseline;
      }
      .type-sample {
        font-weight: 600;
        color: var(--ax-text-primary);
      }
      .type-sample--xl {
        font-size: var(--ax-text-2xl, 1.5rem);
      }
      .type-sample--lg {
        font-size: var(--ax-text-xl, 1.25rem);
      }
      .type-sample--md {
        font-size: var(--ax-text-lg, 1.125rem);
      }
      .type-sample--sm {
        font-size: var(--ax-text-base, 1rem);
      }

      /* Spacing boxes */
      .space-box {
        background: var(--ax-brand-faint);
        border: 1px solid var(--ax-brand-muted);
        border-radius: var(--ax-radius-sm, 0.25rem);
      }
      .space-box--xs {
        width: 8px;
        height: 8px;
      }
      .space-box--sm {
        width: 16px;
        height: 16px;
      }
      .space-box--md {
        width: 24px;
        height: 24px;
      }
      .space-box--lg {
        width: 32px;
        height: 32px;
      }

      /* Shadow boxes */
      .foundations-overview__preview--shadows {
        background: transparent;
        gap: var(--ax-spacing-md, 0.75rem);
        padding: var(--ax-spacing-md, 0.75rem);
      }
      .shadow-box {
        width: 32px;
        height: 32px;
        background: var(--ax-background-default);
        border-radius: var(--ax-radius-md, 0.5rem);
      }
      .shadow-box--sm {
        box-shadow: var(--ax-shadow-sm);
      }
      .shadow-box--md {
        box-shadow: var(--ax-shadow-md);
      }
      .shadow-box--lg {
        box-shadow: var(--ax-shadow-lg);
      }

      /* Motion animation */
      .foundations-overview__preview--motion {
        justify-content: center;
        padding: var(--ax-spacing-md, 0.75rem);
      }
      .motion-box {
        width: 24px;
        height: 24px;
        background: var(--ax-brand-default);
        border-radius: var(--ax-radius-sm, 0.25rem);
        animation: pulse 2s ease-in-out infinite;
      }
      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.2);
          opacity: 0.7;
        }
      }

      /* Section title */
      .foundations-overview__section-title {
        font-size: var(--ax-text-xl, 1.25rem);
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0 0 var(--ax-spacing-lg, 1rem) 0;
      }

      /* Principles */
      .foundations-overview__principles {
        margin-top: var(--ax-spacing-2xl, 2rem);
      }

      .foundations-overview__principles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .foundations-overview__principle {
        padding: var(--ax-spacing-lg, 1rem);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg, 0.75rem);
        text-align: center;

        mat-icon {
          color: var(--ax-brand-default);
          font-size: 32px;
          width: 32px;
          height: 32px;
          margin-bottom: var(--ax-spacing-sm, 0.5rem);
        }

        h4 {
          font-size: var(--ax-text-base, 1rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
        }

        p {
          font-size: var(--ax-text-sm, 0.875rem);
          color: var(--ax-text-secondary);
          margin: 0;
          line-height: 1.5;
        }
      }
    `,
  ],
})
export class FoundationsOverviewComponent {
  foundationCards: FoundationCard[] = [
    {
      title: 'Design Tokens',
      description:
        'Complete reference of all CSS custom properties used in the design system.',
      icon: 'palette',
      link: '/docs/foundations/design-tokens',
      tokenCount: 120,
    },
    {
      title: 'Colors',
      description:
        'Semantic color system with 5 color scales and 6 variants each.',
      icon: 'color_lens',
      link: '/docs/foundations/colors',
      tokenCount: 30,
      preview: 'colors',
    },
    {
      title: 'Typography',
      description:
        'Font families, sizes, weights, and line heights for consistent text.',
      icon: 'text_fields',
      link: '/docs/foundations/typography',
      tokenCount: 16,
      preview: 'typography',
    },
    {
      title: 'Spacing',
      description: '8px grid system for margins, paddings, and gaps.',
      icon: 'straighten',
      link: '/docs/foundations/spacing',
      tokenCount: 8,
      preview: 'spacing',
    },
    {
      title: 'Shadows',
      description:
        'Elevation and depth effects for cards, dialogs, and overlays.',
      icon: 'layers',
      link: '/docs/foundations/shadows',
      tokenCount: 5,
      preview: 'shadows',
    },
    {
      title: 'Motion',
      description:
        'Animation durations and easing functions for smooth interactions.',
      icon: 'animation',
      link: '/docs/foundations/motion',
      tokenCount: 5,
      preview: 'motion',
    },
  ];
}
