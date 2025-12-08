import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface FeatureCard {
  icon: SafeHtml;
  title: string;
  description: string;
  gradient: string;
}

@Component({
  selector: 'ax-theme-builder-showcase',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="showcase" id="theme-builder">
      <div class="showcase__container">
        <!-- Section Header -->
        <div class="showcase__header">
          <span class="showcase__badge">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="5" />
              <path
                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              />
            </svg>
            New Feature
          </span>
          <h2 class="showcase__title">
            Theme Builder
            <span class="showcase__title-accent"
              >Visual M3 Color Generator</span
            >
          </h2>
          <p class="showcase__subtitle">
            Create stunning Material Design 3 themes visually. Generate color
            schemes, preview in real-time, and export to CSS/SCSS instantly.
          </p>
        </div>

        <!-- Main Preview -->
        <div class="showcase__preview">
          <div class="showcase__preview-header">
            <div class="showcase__preview-dots">
              <span
                class="showcase__preview-dot showcase__preview-dot--red"
              ></span>
              <span
                class="showcase__preview-dot showcase__preview-dot--yellow"
              ></span>
              <span
                class="showcase__preview-dot showcase__preview-dot--green"
              ></span>
            </div>
            <span class="showcase__preview-title"
              >Theme Builder - AegisX UI</span
            >
          </div>
          <div class="showcase__preview-content">
            <!-- Color Palette Preview -->
            <div class="showcase__palette">
              <div class="showcase__palette-section">
                <span class="showcase__palette-label">Primary</span>
                <div class="showcase__palette-colors">
                  <div
                    class="showcase__palette-color"
                    style="background: #6366f1"
                  ></div>
                  <div
                    class="showcase__palette-color"
                    style="background: #818cf8"
                  ></div>
                  <div
                    class="showcase__palette-color"
                    style="background: #a5b4fc"
                  ></div>
                  <div
                    class="showcase__palette-color"
                    style="background: #c7d2fe"
                  ></div>
                  <div
                    class="showcase__palette-color"
                    style="background: #e0e7ff"
                  ></div>
                </div>
              </div>
              <div class="showcase__palette-section">
                <span class="showcase__palette-label">Secondary</span>
                <div class="showcase__palette-colors">
                  <div
                    class="showcase__palette-color"
                    style="background: #a855f7"
                  ></div>
                  <div
                    class="showcase__palette-color"
                    style="background: #c084fc"
                  ></div>
                  <div
                    class="showcase__palette-color"
                    style="background: #d8b4fe"
                  ></div>
                  <div
                    class="showcase__palette-color"
                    style="background: #e9d5ff"
                  ></div>
                  <div
                    class="showcase__palette-color"
                    style="background: #f3e8ff"
                  ></div>
                </div>
              </div>
              <div class="showcase__palette-section">
                <span class="showcase__palette-label">Tertiary</span>
                <div class="showcase__palette-colors">
                  <div
                    class="showcase__palette-color"
                    style="background: #ec4899"
                  ></div>
                  <div
                    class="showcase__palette-color"
                    style="background: #f472b6"
                  ></div>
                  <div
                    class="showcase__palette-color"
                    style="background: #f9a8d4"
                  ></div>
                  <div
                    class="showcase__palette-color"
                    style="background: #fbcfe8"
                  ></div>
                  <div
                    class="showcase__palette-color"
                    style="background: #fce7f3"
                  ></div>
                </div>
              </div>
            </div>
            <!-- Theme Mode Toggle -->
            <div class="showcase__mode-toggle">
              <button class="showcase__mode-btn showcase__mode-btn--active">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="5" />
                  <path
                    d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  />
                </svg>
                Light
              </button>
              <button class="showcase__mode-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                Dark
              </button>
            </div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="showcase__features">
          @for (feature of features; track feature.title) {
            <div class="showcase__feature-card">
              <div
                class="showcase__feature-icon"
                [style.background]="feature.gradient"
                [innerHTML]="feature.icon"
              ></div>
              <h3 class="showcase__feature-title">{{ feature.title }}</h3>
              <p class="showcase__feature-desc">{{ feature.description }}</p>
            </div>
          }
        </div>

        <!-- Export Preview -->
        <div class="showcase__export">
          <div class="showcase__export-header">
            <h3>Export to CSS/SCSS</h3>
            <div class="showcase__export-tabs">
              <button class="showcase__export-tab showcase__export-tab--active">
                CSS
              </button>
              <button class="showcase__export-tab">SCSS</button>
            </div>
          </div>
          <pre
            class="showcase__export-code"
          ><code><span class="showcase__code-comment">/* AegisX Theme - Generated by Theme Builder */</span>
<span class="showcase__code-selector">:root</span> {{'{'}
  <span class="showcase__code-property">--ax-primary</span>: <span class="showcase__code-value">#6366f1</span>;
  <span class="showcase__code-property">--ax-primary-container</span>: <span class="showcase__code-value">#e0e7ff</span>;
  <span class="showcase__code-property">--ax-secondary</span>: <span class="showcase__code-value">#a855f7</span>;
  <span class="showcase__code-property">--ax-tertiary</span>: <span class="showcase__code-value">#ec4899</span>;
  <span class="showcase__code-property">--ax-surface</span>: <span class="showcase__code-value">#ffffff</span>;
  <span class="showcase__code-property">--ax-background</span>: <span class="showcase__code-value">#fafafa</span>;
{{'}'}}
</code></pre>
        </div>

        <!-- CTA -->
        <div class="showcase__cta">
          <a
            href="https://github.com/AegisX/aegisx-ui"
            target="_blank"
            class="showcase__btn showcase__btn--primary"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
            Try Theme Builder Free
          </a>
          <span class="showcase__cta-note"
            >Part of AegisX UI - MIT License</span
          >
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .showcase {
        padding: 8rem 4rem;
        background: linear-gradient(
          180deg,
          #0a0a1a 0%,
          #0f0f23 50%,
          #0a0a1a 100%
        );
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(
              circle at 30% 20%,
              rgba(99, 102, 241, 0.08) 0%,
              transparent 40%
            ),
            radial-gradient(
              circle at 70% 80%,
              rgba(168, 85, 247, 0.08) 0%,
              transparent 40%
            );
          pointer-events: none;
        }

        &__container {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        &__header {
          text-align: center;
          margin-bottom: 4rem;
        }

        &__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #22c55e;
          margin-bottom: 1.5rem;

          svg {
            width: 1rem;
            height: 1rem;
          }
        }

        &__title {
          font-size: 3rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 1rem 0;
          line-height: 1.2;
        }

        &__title-accent {
          display: block;
          background: linear-gradient(
            135deg,
            #6366f1 0%,
            #a855f7 50%,
            #ec4899 100%
          );
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

        /* Main Preview */
        &__preview {
          background: #1e1e2e;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          margin-bottom: 3rem;
        }

        &__preview-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: #181825;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        &__preview-dots {
          display: flex;
          gap: 0.5rem;
        }

        &__preview-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;

          &--red {
            background: #f38ba8;
          }
          &--yellow {
            background: #f9e2af;
          }
          &--green {
            background: #a6e3a1;
          }
        }

        &__preview-title {
          font-size: 0.75rem;
          color: #6c7086;
          margin-left: auto;
        }

        &__preview-content {
          padding: 2rem;
        }

        /* Palette */
        &__palette {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        &__palette-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        &__palette-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        &__palette-colors {
          display: flex;
          gap: 0.25rem;
        }

        &__palette-color {
          flex: 1;
          height: 48px;
          border-radius: 0.5rem;
          transition: transform 0.2s ease;

          &:hover {
            transform: scale(1.05);
          }
        }

        /* Mode Toggle */
        &__mode-toggle {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }

        &__mode-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: #94a3b8;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;

          svg {
            width: 1rem;
            height: 1rem;
          }

          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          &--active {
            background: rgba(99, 102, 241, 0.2);
            border-color: rgba(99, 102, 241, 0.4);
            color: #a5b4fc;
          }
        }

        /* Features Grid */
        &__features {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        &__feature-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(99, 102, 241, 0.3);
            transform: translateY(-4px);
          }
        }

        &__feature-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          margin: 0 auto 1rem;
          color: #ffffff;

          ::ng-deep svg {
            width: 24px;
            height: 24px;
          }
        }

        &__feature-title {
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
        }

        &__feature-desc {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }

        /* Export Preview */
        &__export {
          background: #1e1e2e;
          border-radius: 1rem;
          overflow: hidden;
          margin-bottom: 3rem;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        &__export-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: #181825;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);

          h3 {
            font-size: 0.875rem;
            font-weight: 600;
            color: #ffffff;
            margin: 0;
          }
        }

        &__export-tabs {
          display: flex;
          gap: 0.5rem;
        }

        &__export-tab {
          padding: 0.375rem 0.75rem;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 0.375rem;
          color: #64748b;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            color: #94a3b8;
          }

          &--active {
            background: rgba(99, 102, 241, 0.2);
            border-color: rgba(99, 102, 241, 0.4);
            color: #a5b4fc;
          }
        }

        &__export-code {
          padding: 1.5rem;
          margin: 0;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.875rem;
          line-height: 1.8;
          color: #cdd6f4;
          overflow-x: auto;
        }

        &__code-comment {
          color: #6c7086;
        }

        &__code-selector {
          color: #f9e2af;
        }

        &__code-property {
          color: #89b4fa;
        }

        &__code-value {
          color: #a6e3a1;
        }

        /* CTA */
        &__cta {
          text-align: center;
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

          svg {
            width: 1.25rem;
            height: 1.25rem;
          }

          &--primary {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: #ffffff;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 30px rgba(99, 102, 241, 0.5);
            }
          }
        }

        &__cta-note {
          display: block;
          margin-top: 1rem;
          font-size: 0.875rem;
          color: #64748b;
        }
      }

      @media (max-width: 1024px) {
        .showcase {
          padding: 4rem 2rem;

          &__features {
            grid-template-columns: repeat(2, 1fr);
          }

          &__palette {
            grid-template-columns: 1fr;
          }

          &__title {
            font-size: 2rem;
          }
        }
      }

      @media (max-width: 640px) {
        .showcase {
          &__features {
            grid-template-columns: 1fr;
          }
        }
      }
    `,
  ],
})
export class ThemeBuilderShowcaseComponent {
  features: FeatureCard[] = [];

  constructor(private sanitizer: DomSanitizer) {
    this.features = [
      {
        icon: this.sanitizer
          .bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="6"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>`),
        title: 'M3 Colors',
        description: 'Material Design 3 color system',
        gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      },
      {
        icon: this.sanitizer
          .bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <path d="M8 21h8"/>
          <path d="M12 17v4"/>
        </svg>`),
        title: 'Live Preview',
        description: 'See changes in real-time',
        gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
      },
      {
        icon: this.sanitizer
          .bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>`),
        title: 'Dark Mode',
        description: 'Light & dark theme support',
        gradient: 'linear-gradient(135deg, #1e293b, #475569)',
      },
      {
        icon: this.sanitizer
          .bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="M12 18v-6"/>
          <path d="M9 15l3 3 3-3"/>
        </svg>`),
        title: 'Export',
        description: 'Download CSS or SCSS',
        gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
      },
    ];
  }
}
