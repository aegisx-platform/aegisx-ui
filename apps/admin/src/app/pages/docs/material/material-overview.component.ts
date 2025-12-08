import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface MaterialComponent {
  id: string;
  name: string;
  description: string;
  icon: string;
  link: string;
  hasOverride: boolean;
}

interface ComponentCategory {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  components: MaterialComponent[];
}

@Component({
  selector: 'app-material-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="material-overview">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg">
          <div class="gradient-orb orb-1"></div>
          <div class="gradient-orb orb-2"></div>
          <div class="grid-pattern"></div>
        </div>

        <div class="hero-content">
          <div class="hero-badge">
            <mat-icon>palette</mat-icon>
            <span>Angular Material + AegisX</span>
          </div>

          <h1 class="hero-title">
            <span class="gradient-text">Material Design 3</span>
            <br />
            Components
          </h1>

          <p class="hero-description">
            {{ totalComponents }} Angular Material components customized with
            AegisX Design System styling. Each component uses our design tokens
            for consistent styling across light and dark themes.
          </p>

          <div class="hero-actions">
            <a
              mat-flat-button
              color="primary"
              routerLink="/docs/material/button"
              class="primary-btn"
            >
              <mat-icon>play_arrow</mat-icon>
              Explore Components
            </a>
            <a
              mat-stroked-button
              href="https://material.angular.io/components/categories"
              target="_blank"
              class="secondary-btn"
            >
              <mat-icon>open_in_new</mat-icon>
              Official Docs
            </a>
          </div>
        </div>

        <!-- Component Preview Grid -->
        <div class="preview-grid">
          @for (preview of componentPreviews; track preview.name) {
            <div class="preview-card" [style.--delay]="preview.delay">
              <div class="preview-icon" [style.background]="preview.gradient">
                <mat-icon>{{ preview.icon }}</mat-icon>
              </div>
              <span class="preview-name">{{ preview.name }}</span>
            </div>
          }
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats">
        @for (stat of stats; track stat.label) {
          <div class="stat-item">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        }
      </section>

      <!-- Categories Section -->
      <section class="categories">
        <div class="section-header">
          <h2>Component Categories</h2>
          <p>Organized by functionality with AegisX styling</p>
        </div>

        <div class="category-grid">
          @for (category of categories; track category.id) {
            <div class="category-card">
              <div class="category-header">
                <div
                  class="category-icon"
                  [style.background]="category.gradient"
                >
                  <mat-icon>{{ category.icon }}</mat-icon>
                </div>
                <div class="category-info">
                  <h3>{{ category.name }}</h3>
                  <span class="category-count"
                    >{{ category.components.length }} components</span
                  >
                </div>
              </div>
              <div class="component-list">
                @for (comp of category.components; track comp.id) {
                  <a [routerLink]="comp.link" class="component-item">
                    <mat-icon>{{ comp.icon }}</mat-icon>
                    <span>{{ comp.name }}</span>
                    @if (comp.hasOverride) {
                      <mat-icon class="override-badge">auto_fix_high</mat-icon>
                    }
                  </a>
                }
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="section-header">
          <h2>AegisX Integration</h2>
          <p>What makes our Material components special</p>
        </div>

        <div class="features-grid">
          @for (feature of features; track feature.title) {
            <div class="feature-card">
              <div class="feature-icon" [style.color]="feature.color">
                <mat-icon>{{ feature.icon }}</mat-icon>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          }
        </div>
      </section>

      <!-- Override Info Section -->
      <section class="info-section">
        <div class="info-card">
          <div class="info-icon">
            <mat-icon>auto_fix_high</mat-icon>
          </div>
          <div class="info-content">
            <h3>About CSS Overrides</h3>
            <p>
              Components marked with
              <mat-icon class="inline-icon">auto_fix_high</mat-icon>
              have custom CSS overrides using AegisX design tokens. These
              overrides ensure consistent styling with our design system while
              maintaining Material Design principles.
            </p>
            <p class="code-path">
              <mat-icon>folder</mat-icon>
              <code
                >libs/aegisx-ui/src/lib/styles/themes/_material-overrides.scss</code
              >
            </p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="cta-content">
          <h2>Ready to Explore?</h2>
          <p>
            Start using Material components with AegisX styling in your
            application.
          </p>
          <div class="cta-actions">
            <a
              mat-flat-button
              color="primary"
              routerLink="/docs/material/button"
            >
              <mat-icon>widgets</mat-icon>
              Browse Components
            </a>
            <a mat-stroked-button routerLink="/docs/components/aegisx/overview">
              <mat-icon>auto_awesome</mat-icon>
              AegisX Components
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .material-overview {
        min-height: 100vh;
      }

      /* Hero Section */
      .hero {
        position: relative;
        padding: 4rem 2rem;
        min-height: 70vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .hero-bg {
        position: absolute;
        inset: 0;
        overflow: hidden;
      }

      .gradient-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.4;
      }

      .orb-1 {
        width: 500px;
        height: 500px;
        background: linear-gradient(135deg, #7c3aed, #a78bfa);
        top: -150px;
        right: -100px;
        animation: float 8s ease-in-out infinite;
      }

      .orb-2 {
        width: 350px;
        height: 350px;
        background: linear-gradient(135deg, #f472b6, #fb7185);
        bottom: -100px;
        left: -100px;
        animation: float 10s ease-in-out infinite reverse;
      }

      .grid-pattern {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(var(--ax-border-subtle) 1px, transparent 1px),
          linear-gradient(90deg, var(--ax-border-subtle) 1px, transparent 1px);
        background-size: 40px 40px;
        opacity: 0.5;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0) scale(1);
        }
        50% {
          transform: translateY(-30px) scale(1.05);
        }
      }

      .hero-content {
        position: relative;
        z-index: 1;
        text-align: center;
        max-width: 800px;
      }

      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(124, 58, 237, 0.1);
        border: 1px solid rgba(124, 58, 237, 0.2);
        border-radius: 100px;
        font-size: 0.875rem;
        font-weight: 500;
        color: #7c3aed;
        margin-bottom: 1.5rem;
      }

      .hero-badge mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .hero-title {
        font-size: clamp(2.5rem, 6vw, 4rem);
        font-weight: 700;
        line-height: 1.1;
        margin: 0 0 1.5rem;
        color: var(--ax-text-heading);
      }

      .gradient-text {
        background: linear-gradient(135deg, #7c3aed, #a78bfa, #f472b6);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .hero-description {
        font-size: 1.125rem;
        line-height: 1.7;
        color: var(--ax-text-secondary);
        margin: 0 0 2rem;
        max-width: 600px;
        margin-inline: auto;
      }

      .hero-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .hero-actions a {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .primary-btn {
        padding: 0 1.5rem;
        height: 48px;
        font-size: 1rem;
      }

      .secondary-btn {
        height: 48px;
        padding: 0 1.5rem;
      }

      /* Preview Grid */
      .preview-grid {
        position: relative;
        z-index: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        margin-top: 4rem;
        max-width: 800px;
      }

      .preview-card {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1.25rem;
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: 12px;
        box-shadow: var(--ax-shadow-sm);
        animation: fadeInUp 0.5s ease-out backwards;
        animation-delay: calc(var(--delay) * 0.1s);
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .preview-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .preview-icon mat-icon {
        color: white;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .preview-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-default);
      }

      /* Stats Section */
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 2rem;
        padding: 3rem 2rem;
        background: var(--ax-background-subtle);
        border-top: 1px solid var(--ax-border-default);
        border-bottom: 1px solid var(--ax-border-default);
      }

      .stat-item {
        text-align: center;
      }

      .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #7c3aed;
        line-height: 1;
      }

      .stat-label {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
        margin-top: 0.5rem;
      }

      /* Section Header */
      .section-header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .section-header h2 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--ax-text-heading);
        margin: 0 0 0.5rem;
      }

      .section-header p {
        font-size: 1.125rem;
        color: var(--ax-text-secondary);
        margin: 0;
      }

      /* Categories Section */
      .categories {
        padding: 4rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .category-card {
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: 16px;
        overflow: hidden;
      }

      .category-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.25rem;
        border-bottom: 1px solid var(--ax-border-default);
      }

      .category-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .category-icon mat-icon {
        color: white;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .category-info h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0;
      }

      .category-count {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      .component-list {
        padding: 0.5rem;
      }

      .component-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        text-decoration: none;
        color: var(--ax-text-default);
        transition: all 0.2s ease;
      }

      .component-item:hover {
        background: var(--ax-background-subtle);
        color: #7c3aed;
      }

      .component-item mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: var(--ax-text-secondary);
      }

      .component-item:hover mat-icon {
        color: #7c3aed;
      }

      .component-item span {
        flex: 1;
        font-size: 0.875rem;
      }

      .override-badge {
        font-size: 16px !important;
        width: 16px !important;
        height: 16px !important;
        color: var(--ax-success-default) !important;
      }

      /* Features Section */
      .features {
        padding: 4rem 2rem;
        background: var(--ax-background-subtle);
        border-top: 1px solid var(--ax-border-default);
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .feature-card {
        padding: 1.5rem;
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: 12px;
      }

      .feature-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
      }

      .feature-icon mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }

      .feature-card h3 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0 0 0.5rem;
      }

      .feature-card p {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
        margin: 0;
        line-height: 1.6;
      }

      /* Info Section */
      .info-section {
        padding: 4rem 2rem;
        max-width: 1000px;
        margin: 0 auto;
      }

      .info-card {
        display: flex;
        gap: 1.5rem;
        padding: 1.5rem;
        background: rgba(124, 58, 237, 0.05);
        border: 1px solid rgba(124, 58, 237, 0.2);
        border-radius: 16px;
      }

      .info-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #7c3aed, #a78bfa);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .info-icon mat-icon {
        color: white;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .info-content h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0 0 0.75rem;
      }

      .info-content p {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
        margin: 0 0 0.75rem;
        line-height: 1.6;
      }

      .inline-icon {
        font-size: 14px !important;
        width: 14px !important;
        height: 14px !important;
        vertical-align: middle;
        color: var(--ax-success-default);
      }

      .code-path {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .code-path mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: var(--ax-text-subtle);
      }

      .code-path code {
        background: var(--ax-background-subtle);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8125rem;
        color: var(--ax-text-default);
      }

      /* CTA Section */
      .cta {
        padding: 4rem 2rem;
        text-align: center;
        border-top: 1px solid var(--ax-border-default);
      }

      .cta-content {
        max-width: 600px;
        margin: 0 auto;
      }

      .cta h2 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--ax-text-heading);
        margin: 0 0 1rem;
      }

      .cta p {
        font-size: 1.125rem;
        color: var(--ax-text-secondary);
        margin: 0 0 2rem;
      }

      .cta-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .cta-actions a {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      @media (max-width: 768px) {
        .info-card {
          flex-direction: column;
        }

        .category-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class MaterialOverviewComponent {
  componentPreviews = [
    {
      name: 'Button',
      icon: 'smart_button',
      gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
      delay: 0,
    },
    {
      name: 'Card',
      icon: 'credit_card',
      gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      delay: 1,
    },
    {
      name: 'Dialog',
      icon: 'open_in_new',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      delay: 2,
    },
    {
      name: 'Table',
      icon: 'table_chart',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      delay: 3,
    },
    {
      name: 'Tabs',
      icon: 'tab',
      gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
      delay: 4,
    },
    {
      name: 'Menu',
      icon: 'menu',
      gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
      delay: 5,
    },
  ];

  stats = [
    { value: '32', label: 'Components' },
    { value: '6', label: 'Categories' },
    { value: '18', label: 'CSS Overrides' },
    { value: 'MD3', label: 'Design System' },
  ];

  categories: ComponentCategory[] = [
    {
      id: 'actions',
      name: 'Actions',
      icon: 'touch_app',
      gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
      components: [
        {
          id: 'button',
          name: 'Button',
          description: '',
          icon: 'smart_button',
          link: '/docs/material/button',
          hasOverride: true,
        },
        {
          id: 'fab',
          name: 'FAB',
          description: '',
          icon: 'add_circle',
          link: '/docs/material/fab',
          hasOverride: true,
        },
        {
          id: 'button-toggle',
          name: 'Button Toggle',
          description: '',
          icon: 'toggle_on',
          link: '/docs/material/button-toggle',
          hasOverride: true,
        },
      ],
    },
    {
      id: 'data-display',
      name: 'Data Display',
      icon: 'table_chart',
      gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      components: [
        {
          id: 'card',
          name: 'Card',
          description: '',
          icon: 'credit_card',
          link: '/docs/material/card',
          hasOverride: true,
        },
        {
          id: 'table',
          name: 'Table',
          description: '',
          icon: 'table_chart',
          link: '/docs/material/table',
          hasOverride: true,
        },
        {
          id: 'list',
          name: 'List',
          description: '',
          icon: 'list',
          link: '/docs/material/list',
          hasOverride: true,
        },
        {
          id: 'chips',
          name: 'Chips',
          description: '',
          icon: 'label',
          link: '/docs/material/chips',
          hasOverride: true,
        },
        {
          id: 'icon',
          name: 'Icon',
          description: '',
          icon: 'emoji_symbols',
          link: '/docs/material/icon',
          hasOverride: true,
        },
      ],
    },
    {
      id: 'forms',
      name: 'Form Controls',
      icon: 'edit_note',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      components: [
        {
          id: 'form-field',
          name: 'Form Field',
          description: '',
          icon: 'input',
          link: '/docs/material/form-field',
          hasOverride: true,
        },
        {
          id: 'select',
          name: 'Select',
          description: '',
          icon: 'arrow_drop_down_circle',
          link: '/docs/material/select',
          hasOverride: false,
        },
        {
          id: 'checkbox',
          name: 'Checkbox',
          description: '',
          icon: 'check_box',
          link: '/docs/material/checkbox',
          hasOverride: false,
        },
        {
          id: 'slider',
          name: 'Slider',
          description: '',
          icon: 'tune',
          link: '/docs/material/slider',
          hasOverride: true,
        },
        {
          id: 'datepicker',
          name: 'Datepicker',
          description: '',
          icon: 'calendar_today',
          link: '/docs/material/datepicker',
          hasOverride: false,
        },
      ],
    },
    {
      id: 'navigation',
      name: 'Navigation',
      icon: 'menu',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      components: [
        {
          id: 'menu',
          name: 'Menu',
          description: '',
          icon: 'menu',
          link: '/docs/material/menu',
          hasOverride: true,
        },
        {
          id: 'tabs',
          name: 'Tabs',
          description: '',
          icon: 'tab',
          link: '/docs/material/tabs',
          hasOverride: true,
        },
        {
          id: 'paginator',
          name: 'Paginator',
          description: '',
          icon: 'last_page',
          link: '/docs/material/paginator',
          hasOverride: true,
        },
      ],
    },
    {
      id: 'layout',
      name: 'Layout',
      icon: 'view_quilt',
      gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
      components: [
        {
          id: 'expansion',
          name: 'Expansion Panel',
          description: '',
          icon: 'expand_more',
          link: '/docs/material/expansion',
          hasOverride: true,
        },
        {
          id: 'divider',
          name: 'Divider',
          description: '',
          icon: 'horizontal_rule',
          link: '/docs/material/divider',
          hasOverride: false,
        },
      ],
    },
    {
      id: 'feedback',
      name: 'Feedback',
      icon: 'feedback',
      gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
      components: [
        {
          id: 'dialog',
          name: 'Dialog',
          description: '',
          icon: 'open_in_new',
          link: '/docs/material/dialog',
          hasOverride: true,
        },
        {
          id: 'snackbar',
          name: 'Snackbar',
          description: '',
          icon: 'announcement',
          link: '/docs/material/snackbar',
          hasOverride: true,
        },
        {
          id: 'tooltip',
          name: 'Tooltip',
          description: '',
          icon: 'info',
          link: '/docs/material/tooltip',
          hasOverride: true,
        },
        {
          id: 'progress-bar',
          name: 'Progress Bar',
          description: '',
          icon: 'hourglass_empty',
          link: '/docs/material/progress-bar',
          hasOverride: true,
        },
        {
          id: 'progress-spinner',
          name: 'Progress Spinner',
          description: '',
          icon: 'autorenew',
          link: '/docs/material/progress-spinner',
          hasOverride: false,
        },
      ],
    },
  ];

  features = [
    {
      icon: 'palette',
      title: 'Design Tokens',
      description:
        'All Material components styled using AegisX CSS custom properties for consistent theming.',
      color: '#7c3aed',
    },
    {
      icon: 'dark_mode',
      title: 'Dark Mode Ready',
      description:
        'Seamless light and dark theme support with automatic color adjustments.',
      color: '#3b82f6',
    },
    {
      icon: 'tune',
      title: 'Minimal Aesthetic',
      description:
        'Clean, modern styling that reduces visual noise while maintaining usability.',
      color: '#10b981',
    },
    {
      icon: 'accessibility',
      title: 'Accessible',
      description:
        "Built on Angular Material's accessible foundation with enhanced visual contrast.",
      color: '#f59e0b',
    },
    {
      icon: 'speed',
      title: 'Performance',
      description:
        "CSS-only overrides that don't impact bundle size or runtime performance.",
      color: '#ec4899',
    },
    {
      icon: 'sync',
      title: 'Stay Updated',
      description:
        'Compatible with Angular Material updates, minimal maintenance required.',
      color: '#06b6d4',
    },
  ];

  get totalComponents(): number {
    return this.categories.reduce((sum, cat) => sum + cat.components.length, 0);
  }

  get overriddenCount(): number {
    return this.categories.reduce(
      (sum, cat) => sum + cat.components.filter((c) => c.hasOverride).length,
      0,
    );
  }
}
