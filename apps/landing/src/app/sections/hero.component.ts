import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ax-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero">
      <div class="hero__container">
        <!-- Badge -->
        <div class="hero__badge">
          <span class="hero__badge-icon">&#10024;</span>
          <span>Open Source Angular UI Library</span>
        </div>

        <!-- Main Heading -->
        <h1 class="hero__title">
          Build Beautiful Apps
          <span class="hero__title-gradient">Faster Than Ever</span>
        </h1>

        <!-- Subtitle -->
        <p class="hero__subtitle">
          A powerful Angular component library with a stunning theme system.
          <strong>100% Free & Open Source.</strong>
          Supercharge your productivity with our CRUD Generator.
        </p>

        <!-- CTA Buttons -->
        <div class="hero__actions">
          <a
            href="https://github.com/AegisX/aegisx-ui"
            target="_blank"
            class="hero__btn hero__btn--primary"
          >
            <svg class="hero__btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
            Get Started Free
          </a>
          <a href="#pricing" class="hero__btn hero__btn--secondary">
            <svg
              class="hero__btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            View CRUD Generator
          </a>
        </div>

        <!-- Stats -->
        <div class="hero__stats">
          <div class="hero__stat">
            <span class="hero__stat-value">50+</span>
            <span class="hero__stat-label">Components</span>
          </div>
          <div class="hero__stat-divider"></div>
          <div class="hero__stat">
            <span class="hero__stat-value">10+</span>
            <span class="hero__stat-label">Themes</span>
          </div>
          <div class="hero__stat-divider"></div>
          <div class="hero__stat">
            <span class="hero__stat-value">MIT</span>
            <span class="hero__stat-label">License</span>
          </div>
        </div>
      </div>

      <!-- Hero Visual -->
      <div class="hero__visual">
        <div class="hero__code-preview">
          <div class="hero__code-header">
            <span class="hero__code-dot hero__code-dot--red"></span>
            <span class="hero__code-dot hero__code-dot--yellow"></span>
            <span class="hero__code-dot hero__code-dot--green"></span>
            <span class="hero__code-title">terminal</span>
          </div>
          <pre
            class="hero__code-content"
          ><code><span class="hero__code-prompt">$</span> npm install aegisx-ui

<span class="hero__code-comment"># Generate full-stack CRUD in 30 seconds</span>
<span class="hero__code-prompt">$</span> npx aegisx-crud generate products

<span class="hero__code-success">&#10003;</span> Created backend API routes
<span class="hero__code-success">&#10003;</span> Created TypeBox schemas
<span class="hero__code-success">&#10003;</span> Created Angular components
<span class="hero__code-success">&#10003;</span> Created data table with filters
<span class="hero__code-success">&#10003;</span> Created form dialogs

<span class="hero__code-info">Ready!</span> Your CRUD module is ready at /products</code></pre>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
        padding: 6rem 4rem;
        background: linear-gradient(
          135deg,
          #0f0f23 0%,
          #1a1a3e 50%,
          #0f0f23 100%
        );
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(
              circle at 20% 50%,
              rgba(99, 102, 241, 0.15) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 50%,
              rgba(168, 85, 247, 0.15) 0%,
              transparent 50%
            );
          pointer-events: none;
        }

        &__container {
          position: relative;
          z-index: 1;
        }

        &__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 9999px;
          font-size: 0.875rem;
          color: #a5b4fc;
          margin-bottom: 1.5rem;
        }

        &__badge-icon {
          font-size: 1rem;
        }

        &__title {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          color: #ffffff;
          margin: 0 0 1.5rem 0;
        }

        &__title-gradient {
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
          line-height: 1.7;
          margin: 0 0 2rem 0;
          max-width: 540px;

          strong {
            color: #ffffff;
          }
        }

        &__actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        &__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.75rem;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;

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
              border-color: rgba(255, 255, 255, 0.3);
            }
          }
        }

        &__btn-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        &__stats {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        &__stat {
          text-align: center;
        }

        &__stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
        }

        &__stat-label {
          font-size: 0.875rem;
          color: #64748b;
        }

        &__stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
        }

        &__visual {
          position: relative;
          z-index: 1;
        }

        &__code-preview {
          background: #1e1e2e;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);
          transition: transform 0.3s ease;

          &:hover {
            transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
          }
        }

        &__code-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.25rem;
          background: #181825;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        &__code-dot {
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

        &__code-title {
          margin-left: auto;
          font-size: 0.75rem;
          color: #6c7086;
        }

        &__code-content {
          padding: 1.5rem;
          margin: 0;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.875rem;
          line-height: 1.8;
          color: #cdd6f4;
          overflow-x: auto;
        }

        &__code-prompt {
          color: #a6e3a1;
        }

        &__code-comment {
          color: #6c7086;
        }

        &__code-success {
          color: #a6e3a1;
        }

        &__code-info {
          color: #89b4fa;
          font-weight: 600;
        }
      }

      /* Tablet */
      @media (max-width: 1024px) {
        .hero {
          grid-template-columns: 1fr;
          padding: 4rem 2rem;
          text-align: center;
          gap: 2rem;

          &__subtitle {
            max-width: 100%;
          }

          &__actions {
            justify-content: center;
            flex-wrap: wrap;
          }

          &__stats {
            justify-content: center;
          }

          &__visual {
            order: -1;
          }

          &__code-preview {
            transform: none;

            &:hover {
              transform: none;
            }
          }

          &__title {
            font-size: 2.5rem;
          }
        }
      }

      /* Mobile */
      @media (max-width: 640px) {
        .hero {
          padding: 2rem 1rem;
          min-height: auto;
          gap: 1.5rem;

          &__badge {
            font-size: 0.75rem;
            padding: 0.375rem 0.75rem;
          }

          &__title {
            font-size: 1.75rem;
          }

          &__subtitle {
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }

          &__actions {
            flex-direction: column;
            gap: 0.75rem;
            margin-bottom: 2rem;
          }

          &__btn {
            width: 100%;
            justify-content: center;
            padding: 0.875rem 1.5rem;
            font-size: 0.875rem;
          }

          &__stats {
            gap: 1rem;
          }

          &__stat-value {
            font-size: 1.5rem;
          }

          &__stat-label {
            font-size: 0.75rem;
          }

          &__stat-divider {
            height: 30px;
          }

          &__code-preview {
            border-radius: 0.75rem;
          }

          &__code-header {
            padding: 0.75rem 1rem;
          }

          &__code-dot {
            width: 10px;
            height: 10px;
          }

          &__code-content {
            padding: 1rem;
            font-size: 0.7rem;
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-word;
          }
        }
      }

      /* Extra small mobile */
      @media (max-width: 400px) {
        .hero {
          padding: 1.5rem 0.75rem;

          &__title {
            font-size: 1.5rem;
          }

          &__stats {
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          &__stat-divider {
            display: none;
          }

          &__code-content {
            font-size: 0.625rem;
          }
        }
      }
    `,
  ],
})
export class HeroComponent {}
