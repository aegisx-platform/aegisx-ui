import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ax-cta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="cta">
      <div class="cta__container">
        <div class="cta__content">
          <h2 class="cta__title">
            Ready to Build
            <span class="cta__title-accent">Faster?</span>
          </h2>
          <p class="cta__subtitle">
            Join developers who are shipping products faster with AegisX. Start
            free, upgrade when you're ready.
          </p>

          <div class="cta__actions">
            <a
              href="https://github.com/aegisx-platform/aegisx-ui"
              target="_blank"
              class="cta__btn cta__btn--primary"
            >
              <svg
                class="cta__btn-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              Get Started Free
            </a>
            <a
              href="https://docs.aegisx.dev"
              target="_blank"
              class="cta__btn cta__btn--secondary"
            >
              View Documentation
            </a>
          </div>
        </div>

        <!-- Decorative Elements -->
        <div class="cta__decoration cta__decoration--1"></div>
        <div class="cta__decoration cta__decoration--2"></div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer__container">
        <div class="footer__brand">
          <span class="footer__logo">AegisX</span>
          <p class="footer__tagline">Beautiful Angular UI. Free Forever.</p>
        </div>

        <div class="footer__links">
          <div class="footer__column">
            <h4 class="footer__column-title">Product</h4>
            <a href="#features" class="footer__link">Features</a>
            <a href="#pricing" class="footer__link">Pricing</a>
            <a href="https://docs.aegisx.dev" class="footer__link"
              >Documentation</a
            >
          </div>
          <div class="footer__column">
            <h4 class="footer__column-title">Resources</h4>
            <a
              href="https://github.com/aegisx-platform/aegisx-ui"
              class="footer__link"
              >GitHub</a
            >
            <a
              href="https://www.npmjs.com/package/@aegisx/ui"
              class="footer__link"
              >NPM</a
            >
            <a href="https://discord.gg/aegisx" class="footer__link">Discord</a>
          </div>
          <div class="footer__column">
            <h4 class="footer__column-title">Legal</h4>
            <a href="/privacy" class="footer__link">Privacy</a>
            <a href="/terms" class="footer__link">Terms</a>
            <a href="/license" class="footer__link">License</a>
          </div>
        </div>

        <div class="footer__bottom">
          <p class="footer__copyright">
            &copy; {{ currentYear }} AegisX. MIT License for UI Library.
          </p>
          <div class="footer__social">
            <a
              href="https://github.com/aegisx-platform"
              class="footer__social-link"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </a>
            <a
              href="https://twitter.com/aegisxdev"
              class="footer__social-link"
              aria-label="Twitter"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </a>
            <a
              href="https://discord.gg/aegisx"
              class="footer__social-link"
              aria-label="Discord"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .cta {
        padding: 8rem 4rem;
        background: linear-gradient(135deg, #1a1a3e 0%, #0f0f23 100%);
        position: relative;
        overflow: hidden;

        &__container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        &__title {
          font-size: 3rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 1.5rem 0;
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
          margin: 0 0 2.5rem 0;
          line-height: 1.7;
        }

        &__actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        &__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;

          &--primary {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: #ffffff;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 30px rgba(99, 102, 241, 0.5);
            }
          }

          &--secondary {
            background: rgba(255, 255, 255, 0.05);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.2);

            &:hover {
              background: rgba(255, 255, 255, 0.1);
            }
          }
        }

        &__btn-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        &__decoration {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;

          &--1 {
            top: -100px;
            right: -100px;
            width: 400px;
            height: 400px;
            background: radial-gradient(
              circle,
              rgba(99, 102, 241, 0.15) 0%,
              transparent 70%
            );
          }

          &--2 {
            bottom: -100px;
            left: -100px;
            width: 300px;
            height: 300px;
            background: radial-gradient(
              circle,
              rgba(168, 85, 247, 0.15) 0%,
              transparent 70%
            );
          }
        }
      }

      .footer {
        padding: 4rem 4rem 2rem;
        background: #0a0a1a;
        border-top: 1px solid rgba(255, 255, 255, 0.05);

        &__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        &__brand {
          margin-bottom: 3rem;
        }

        &__logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        &__tagline {
          font-size: 0.9375rem;
          color: #64748b;
          margin: 0.5rem 0 0 0;
        }

        &__links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }

        &__column-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 1rem 0;
        }

        &__link {
          display: block;
          font-size: 0.9375rem;
          color: #94a3b8;
          text-decoration: none;
          margin-bottom: 0.75rem;
          transition: color 0.2s ease;

          &:hover {
            color: #ffffff;
          }
        }

        &__bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        &__copyright {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        &__social {
          display: flex;
          gap: 1rem;
        }

        &__social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          transition: all 0.2s ease;

          svg {
            width: 20px;
            height: 20px;
          }

          &:hover {
            background: rgba(99, 102, 241, 0.2);
            color: #6366f1;
          }
        }
      }

      @media (max-width: 768px) {
        .cta {
          padding: 4rem 2rem;

          &__title {
            font-size: 2rem;
          }

          &__actions {
            flex-direction: column;
            align-items: center;
          }
        }

        .footer {
          padding: 3rem 2rem 2rem;

          &__links {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          &__bottom {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }
        }
      }

      /* Mobile */
      @media (max-width: 640px) {
        .cta {
          padding: 3rem 1rem;

          &__title {
            font-size: 1.75rem;
          }

          &__subtitle {
            font-size: 1rem;
            margin-bottom: 2rem;
          }

          &__btn {
            width: 100%;
            justify-content: center;
            padding: 0.875rem 1.5rem;
            font-size: 0.9375rem;
          }
        }

        .footer {
          padding: 2.5rem 1rem 1.5rem;

          &__brand {
            margin-bottom: 2rem;
          }

          &__logo {
            font-size: 1.25rem;
          }

          &__tagline {
            font-size: 0.875rem;
          }

          &__links {
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          &__column-title {
            font-size: 0.8125rem;
            margin-bottom: 0.75rem;
          }

          &__link {
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
          }

          &__bottom {
            padding-top: 1.5rem;
          }

          &__copyright {
            font-size: 0.75rem;
          }

          &__social {
            gap: 0.75rem;
          }

          &__social-link {
            width: 36px;
            height: 36px;

            svg {
              width: 18px;
              height: 18px;
            }
          }
        }
      }

      /* Extra small mobile */
      @media (max-width: 400px) {
        .cta {
          padding: 2rem 0.75rem;

          &__title {
            font-size: 1.5rem;
          }
        }

        .footer {
          padding: 2rem 0.75rem 1rem;

          &__links {
            gap: 1rem;
          }
        }
      }
    `,
  ],
})
export class CtaComponent {
  currentYear = new Date().getFullYear();
}
