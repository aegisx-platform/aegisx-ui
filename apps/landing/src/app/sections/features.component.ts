import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
  tag?: string;
}

@Component({
  selector: 'ax-features',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="features" id="features">
      <div class="features__container">
        <!-- Section Header -->
        <div class="features__header">
          <span class="features__eyebrow">Everything You Need</span>
          <h2 class="features__title">
            Free UI Library.
            <span class="features__title-accent">Powerful Tools.</span>
          </h2>
          <p class="features__subtitle">
            Get started with our beautiful component library for free.
            Supercharge your productivity with our premium tools.
          </p>
        </div>

        <!-- Free Section -->
        <div class="features__section">
          <div class="features__section-badge features__section-badge--free">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            100% Free & Open Source
          </div>

          <div class="features__grid">
            @for (feature of freeFeatures; track feature.title) {
              <div class="features__card">
                <div
                  class="features__card-icon"
                  [innerHTML]="feature.icon"
                ></div>
                <h3 class="features__card-title">{{ feature.title }}</h3>
                <p class="features__card-description">
                  {{ feature.description }}
                </p>
                @if (feature.tag) {
                  <span class="features__card-tag">{{ feature.tag }}</span>
                }
              </div>
            }
          </div>
        </div>

        <!-- Paid Section -->
        <div class="features__section">
          <div class="features__section-badge features__section-badge--pro">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            CRUD Generator - Save Hours of Work
          </div>

          <div class="features__grid">
            @for (feature of paidFeatures; track feature.title) {
              <div class="features__card features__card--pro">
                <div
                  class="features__card-icon features__card-icon--pro"
                  [innerHTML]="feature.icon"
                ></div>
                <h3 class="features__card-title">{{ feature.title }}</h3>
                <p class="features__card-description">
                  {{ feature.description }}
                </p>
                @if (feature.tag) {
                  <span class="features__card-tag features__card-tag--pro">{{
                    feature.tag
                  }}</span>
                }
              </div>
            }
          </div>
        </div>

        <!-- Comparison -->
        <div class="features__comparison">
          <div class="features__comparison-item">
            <span
              class="features__comparison-time features__comparison-time--old"
              >4+ hours</span
            >
            <span class="features__comparison-label"
              >Manual CRUD Development</span
            >
          </div>
          <div class="features__comparison-arrow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div class="features__comparison-item">
            <span
              class="features__comparison-time features__comparison-time--new"
              >30 seconds</span
            >
            <span class="features__comparison-label">With CRUD Generator</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .features {
        padding: 8rem 4rem;
        background: #0a0a1a;

        &__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        &__header {
          text-align: center;
          margin-bottom: 4rem;
        }

        &__eyebrow {
          display: inline-block;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6366f1;
          margin-bottom: 1rem;
        }

        &__title {
          font-size: 3rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 1rem 0;
          line-height: 1.2;
        }

        &__title-accent {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        &__subtitle {
          font-size: 1.25rem;
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.7;
        }

        &__section {
          margin-bottom: 4rem;
        }

        &__section-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 2rem;

          svg {
            width: 1rem;
            height: 1rem;
          }

          &--free {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.3);
          }

          &--pro {
            background: rgba(168, 85, 247, 0.1);
            color: #a855f7;
            border: 1px solid rgba(168, 85, 247, 0.3);
          }
        }

        &__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        &__card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1rem;
          padding: 2rem;
          transition: all 0.3s ease;
          position: relative;

          &:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(99, 102, 241, 0.3);
            transform: translateY(-4px);
          }

          &--pro {
            &:hover {
              border-color: rgba(168, 85, 247, 0.3);
            }
          }
        }

        &__card-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 0.75rem;
          margin-bottom: 1.25rem;
          color: #6366f1;

          svg,
          ::ng-deep svg {
            width: 24px;
            height: 24px;
          }

          &--pro {
            background: rgba(168, 85, 247, 0.1);
            color: #a855f7;
          }
        }

        &__card-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 0.75rem 0;
        }

        &__card-description {
          font-size: 0.9375rem;
          color: #94a3b8;
          line-height: 1.6;
          margin: 0;
        }

        &__card-tag {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;

          &--pro {
            background: rgba(168, 85, 247, 0.1);
            color: #a855f7;
          }
        }

        &__comparison {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          padding: 3rem;
          background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.05) 0%,
            rgba(168, 85, 247, 0.05) 100%
          );
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 1rem;
        }

        &__comparison-item {
          text-align: center;
        }

        &__comparison-time {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;

          &--old {
            color: #f87171;
            text-decoration: line-through;
            opacity: 0.7;
          }

          &--new {
            color: #22c55e;
          }
        }

        &__comparison-label {
          font-size: 0.875rem;
          color: #94a3b8;
        }

        &__comparison-arrow {
          color: #6366f1;

          svg {
            width: 2rem;
            height: 2rem;
          }
        }
      }

      @media (max-width: 1024px) {
        .features {
          padding: 4rem 2rem;

          &__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          &__title {
            font-size: 2rem;
          }
        }
      }

      @media (max-width: 640px) {
        .features {
          padding: 3rem 1rem;

          &__header {
            margin-bottom: 2.5rem;
          }

          &__title {
            font-size: 1.75rem;
          }

          &__subtitle {
            font-size: 1rem;
          }

          &__section {
            margin-bottom: 2.5rem;
          }

          &__section-badge {
            font-size: 0.75rem;
            padding: 0.375rem 0.75rem;
          }

          &__grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          &__card {
            padding: 1.5rem;
          }

          &__card-icon {
            width: 40px;
            height: 40px;

            svg,
            ::ng-deep svg {
              width: 20px;
              height: 20px;
            }
          }

          &__card-title {
            font-size: 1rem;
          }

          &__card-description {
            font-size: 0.875rem;
          }

          &__comparison {
            flex-direction: column;
            gap: 1.5rem;
            padding: 2rem 1.5rem;
          }

          &__comparison-arrow {
            transform: rotate(90deg);
          }

          &__comparison-time {
            font-size: 1.5rem;
          }

          &__comparison-label {
            font-size: 0.75rem;
          }
        }
      }

      /* Extra small mobile */
      @media (max-width: 400px) {
        .features {
          padding: 2rem 0.75rem;

          &__title {
            font-size: 1.5rem;
          }

          &__card {
            padding: 1.25rem;
          }

          &__comparison {
            padding: 1.5rem 1rem;
          }

          &__comparison-time {
            font-size: 1.25rem;
          }
        }
      }
    `,
  ],
})
export class FeaturesComponent {
  freeFeatures: Feature[] = [
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18"/>
        <path d="M9 21V9"/>
      </svg>`,
      title: '50+ Components',
      description:
        'Buttons, Cards, Tables, Forms, Dialogs, and more. All styled and accessible.',
      tag: 'MIT License',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>`,
      title: 'Theme System',
      description:
        'Beautiful theme builder with light/dark mode. Customize every design token.',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>`,
      title: 'Design Tokens',
      description:
        'Consistent spacing, colors, and typography. CSS variables for easy customization.',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 6h16M4 12h16M4 18h7"/>
      </svg>`,
      title: 'TypeScript First',
      description:
        'Full TypeScript support with strict typing. Great IDE integration.',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>`,
      title: 'Angular 17+',
      description:
        'Built for modern Angular with standalone components and signals.',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>`,
      title: 'Documentation',
      description:
        'Comprehensive docs with live examples. Easy to learn and use.',
    },
  ];

  paidFeatures: Feature[] = [
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>`,
      title: 'Full-Stack Generation',
      description:
        'Generate backend API + frontend components in one command. Ready to use.',
      tag: 'Pro',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <path d="M8 13h2"/>
        <path d="M8 17h2"/>
        <path d="M14 13h2"/>
        <path d="M14 17h2"/>
      </svg>`,
      title: 'Excel/CSV Import',
      description:
        'Bulk import with validation. Handle thousands of records easily.',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <rect x="9" y="9" width="6" height="6"/>
        <path d="M15 2v2"/>
        <path d="M15 20v2"/>
        <path d="M2 15h2"/>
        <path d="M20 15h2"/>
      </svg>`,
      title: 'TypeBox Schemas',
      description:
        'Runtime validation + TypeScript types. API contracts that work.',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>`,
      title: 'WebSocket Events',
      description:
        'Real-time updates out of the box. Live data synchronization.',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
        <polyline points="7.5 19.79 7.5 14.6 3 12"/>
        <polyline points="21 12 16.5 14.6 16.5 19.79"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>`,
      title: 'Search & Filter',
      description:
        'Advanced search, pagination, and sorting. All pre-built and optimized.',
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>`,
      title: 'Enterprise Ready',
      description:
        'UUID validation, audit fields, role-based access. Production quality.',
    },
  ];
}
