import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaLink: string;
  highlighted?: boolean;
  badge?: string;
}

@Component({
  selector: 'ax-pricing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="pricing" id="pricing">
      <div class="pricing__container">
        <!-- Header -->
        <div class="pricing__header">
          <span class="pricing__eyebrow">Simple Pricing</span>
          <h2 class="pricing__title">
            Free UI Library.
            <span class="pricing__title-accent">Pay for Productivity.</span>
          </h2>
          <p class="pricing__subtitle">
            Start with our free UI library. Upgrade when you need the CRUD
            Generator.
          </p>
        </div>

        <!-- Pricing Cards -->
        <div class="pricing__grid">
          @for (tier of tiers; track tier.name) {
            <div
              class="pricing__card"
              [class.pricing__card--highlighted]="tier.highlighted"
            >
              @if (tier.badge) {
                <span class="pricing__badge">{{ tier.badge }}</span>
              }

              <h3 class="pricing__card-name">{{ tier.name }}</h3>
              <div class="pricing__card-price">
                <span class="pricing__card-amount">{{ tier.price }}</span>
                <span class="pricing__card-period">{{ tier.period }}</span>
              </div>
              <p class="pricing__card-description">{{ tier.description }}</p>

              <ul class="pricing__features">
                @for (feature of tier.features; track feature) {
                  <li class="pricing__feature">
                    <svg
                      class="pricing__feature-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {{ feature }}
                  </li>
                }
              </ul>

              <a
                [href]="tier.ctaLink"
                class="pricing__cta"
                [class.pricing__cta--primary]="tier.highlighted"
                [class.pricing__cta--secondary]="!tier.highlighted"
              >
                {{ tier.cta }}
              </a>
            </div>
          }
        </div>

        <!-- FAQ Teaser -->
        <div class="pricing__faq">
          <p class="pricing__faq-text">
            <strong>Not sure which plan?</strong>
            Start with Free, upgrade anytime. Your generated code is yours
            forever.
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .pricing {
        padding: 8rem 4rem;
        background: linear-gradient(180deg, #0a0a1a 0%, #0f0f23 100%);

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
          color: #a855f7;
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
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.7;
        }

        &__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }

        &__card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.5rem;
          padding: 2.5rem;
          position: relative;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-4px);
            border-color: rgba(99, 102, 241, 0.3);
          }

          &--highlighted {
            background: linear-gradient(
              135deg,
              rgba(99, 102, 241, 0.1) 0%,
              rgba(168, 85, 247, 0.1) 100%
            );
            border-color: rgba(99, 102, 241, 0.4);
            transform: scale(1.02);

            &:hover {
              transform: scale(1.02) translateY(-4px);
            }
          }
        }

        &__badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.375rem 1rem;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        &__card-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 1rem 0;
        }

        &__card-price {
          margin-bottom: 0.5rem;
        }

        &__card-amount {
          font-size: 3rem;
          font-weight: 800;
          color: #ffffff;
        }

        &__card-period {
          font-size: 1rem;
          color: #64748b;
          margin-left: 0.25rem;
        }

        &__card-description {
          font-size: 0.9375rem;
          color: #94a3b8;
          margin: 0 0 2rem 0;
          line-height: 1.6;
        }

        &__features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
        }

        &__feature {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.9375rem;
          color: #e2e8f0;
          margin-bottom: 0.75rem;
          line-height: 1.5;
        }

        &__feature-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
          color: #22c55e;
          margin-top: 0.125rem;
        }

        &__cta {
          display: block;
          width: 100%;
          padding: 1rem;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          transition: all 0.2s ease;

          &--primary {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: #ffffff;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);

            &:hover {
              box-shadow: 0 6px 30px rgba(99, 102, 241, 0.5);
              transform: translateY(-2px);
            }
          }

          &--secondary {
            background: rgba(255, 255, 255, 0.05);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.2);

            &:hover {
              background: rgba(255, 255, 255, 0.1);
              border-color: rgba(255, 255, 255, 0.3);
            }
          }
        }

        &__faq {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
        }

        &__faq-text {
          font-size: 1rem;
          color: #94a3b8;
          margin: 0;

          strong {
            color: #ffffff;
          }
        }
      }

      @media (max-width: 1024px) {
        .pricing {
          padding: 4rem 2rem;

          &__grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
          }

          &__card--highlighted {
            transform: none;
            order: -1;

            &:hover {
              transform: translateY(-4px);
            }
          }

          &__title {
            font-size: 2rem;
          }
        }
      }

      /* Mobile */
      @media (max-width: 640px) {
        .pricing {
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

          &__grid {
            max-width: 100%;
            gap: 1.5rem;
          }

          &__card {
            padding: 1.5rem;
            border-radius: 1rem;
          }

          &__card-name {
            font-size: 1.125rem;
          }

          &__card-amount {
            font-size: 2.5rem;
          }

          &__card-description {
            font-size: 0.875rem;
          }

          &__feature {
            font-size: 0.875rem;
          }

          &__cta {
            padding: 0.875rem;
            font-size: 0.9375rem;
          }

          &__faq {
            padding: 1.5rem;
          }

          &__faq-text {
            font-size: 0.875rem;
          }
        }
      }

      /* Extra small mobile */
      @media (max-width: 400px) {
        .pricing {
          padding: 2rem 0.75rem;

          &__title {
            font-size: 1.5rem;
          }

          &__card {
            padding: 1.25rem;
          }

          &__card-amount {
            font-size: 2rem;
          }

          &__faq {
            padding: 1rem;
          }
        }
      }
    `,
  ],
})
export class PricingComponent {
  tiers: PricingTier[] = [
    {
      name: 'Community',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for getting started with AegisX UI',
      features: [
        'All 50+ UI Components',
        'Theme System & Builder',
        'Light & Dark Themes',
        'Full Documentation',
        'MIT License',
        'Community Support',
      ],
      cta: 'Get Started Free',
      ctaLink: 'https://github.com/aegisx-platform/aegisx-ui',
    },
    {
      name: 'Professional',
      price: '$49',
      period: 'one-time',
      description: 'For individual developers who want to ship faster',
      features: [
        'Everything in Community',
        'CRUD Generator (Unlimited)',
        'Backend API Generation',
        'Frontend Component Generation',
        'Excel/CSV Import Feature',
        'Lifetime Updates',
      ],
      cta: 'Buy Now',
      ctaLink: 'https://aegisx.gumroad.com/l/cli-pro',
      highlighted: true,
      badge: 'Most Popular',
    },
    {
      name: 'Team',
      price: '$199',
      period: '/year',
      description: 'For teams building production applications',
      features: [
        'Everything in Professional',
        'Up to 5 Developers',
        'WebSocket Real-time Events',
        'Priority Email Support',
        'Private Discord Channel',
        'Early Access to Features',
      ],
      cta: 'Contact Sales',
      ctaLink: 'mailto:sales@aegisx.dev',
    },
  ];
}
