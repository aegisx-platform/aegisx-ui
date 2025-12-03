import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface TechItem {
  name: string;
  description: string;
  icon: SafeHtml;
  color: string;
}

@Component({
  selector: 'ax-tech-stack',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="tech-stack" id="tech-stack">
      <div class="tech-stack__container">
        <!-- Section Header -->
        <div class="tech-stack__header">
          <span class="tech-stack__eyebrow">Tech Stack</span>
          <h2 class="tech-stack__title">
            Modern Full-Stack
            <span class="tech-stack__title-accent">Architecture</span>
          </h2>
          <p class="tech-stack__subtitle">
            Built with the best tools for building enterprise-grade applications
          </p>
        </div>

        <!-- Main Tech Logos -->
        <div class="tech-stack__main">
          <a
            href="https://angular.dev"
            target="_blank"
            class="tech-stack__main-logo"
          >
            <img src="assets/logos/angular_wordmark_white.png" alt="Angular" />
            <span>Frontend</span>
          </a>
          <div class="tech-stack__main-plus">+</div>
          <a
            href="https://fastify.dev"
            target="_blank"
            class="tech-stack__main-logo"
          >
            <img src="assets/logos/fastify-white-landscape.svg" alt="Fastify" />
            <span>Backend</span>
          </a>
        </div>

        <!-- Frontend Stack -->
        <div class="tech-stack__section">
          <h3 class="tech-stack__section-title">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8" />
              <path d="M12 17v4" />
            </svg>
            Frontend Stack
          </h3>
          <div class="tech-stack__grid">
            @for (tech of frontendStack; track tech.name) {
              <div class="tech-stack__card" [style.--accent-color]="tech.color">
                <div
                  class="tech-stack__card-icon"
                  [innerHTML]="tech.icon"
                ></div>
                <div class="tech-stack__card-content">
                  <h4 class="tech-stack__card-name">{{ tech.name }}</h4>
                  <p class="tech-stack__card-desc">{{ tech.description }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Backend Stack -->
        <div class="tech-stack__section">
          <h3 class="tech-stack__section-title">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="2" width="20" height="8" rx="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" />
              <circle cx="6" cy="6" r="1" />
              <circle cx="6" cy="18" r="1" />
            </svg>
            Backend Stack
          </h3>
          <div class="tech-stack__grid">
            @for (tech of backendStack; track tech.name) {
              <div class="tech-stack__card" [style.--accent-color]="tech.color">
                <div
                  class="tech-stack__card-icon"
                  [innerHTML]="tech.icon"
                ></div>
                <div class="tech-stack__card-content">
                  <h4 class="tech-stack__card-name">{{ tech.name }}</h4>
                  <p class="tech-stack__card-desc">{{ tech.description }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- DevOps Stack -->
        <div class="tech-stack__section">
          <h3 class="tech-stack__section-title">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              />
            </svg>
            DevOps & Tooling
          </h3>
          <div class="tech-stack__grid">
            @for (tech of devopsStack; track tech.name) {
              <div class="tech-stack__card" [style.--accent-color]="tech.color">
                <div
                  class="tech-stack__card-icon"
                  [innerHTML]="tech.icon"
                ></div>
                <div class="tech-stack__card-content">
                  <h4 class="tech-stack__card-name">{{ tech.name }}</h4>
                  <p class="tech-stack__card-desc">{{ tech.description }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .tech-stack {
        padding: 6rem 4rem;
        background: linear-gradient(180deg, #0a0a1a 0%, #111128 100%);

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
          font-size: 2.5rem;
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
          font-size: 1.125rem;
          color: #94a3b8;
          max-width: 500px;
          margin: 0 auto;
        }

        &__main {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3rem;
          margin-bottom: 4rem;
          padding: 3rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.5rem;
        }

        &__main-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          transition: transform 0.2s ease;

          &:hover {
            transform: translateY(-4px);
          }

          img {
            height: 48px;
            width: auto;
          }

          span {
            font-size: 0.875rem;
            color: #64748b;
            font-weight: 500;
          }
        }

        &__main-plus {
          font-size: 2rem;
          color: #64748b;
          font-weight: 300;
        }

        &__section {
          margin-bottom: 3rem;
        }

        &__section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 1.5rem 0;

          svg {
            width: 1.5rem;
            height: 1.5rem;
            color: #6366f1;
          }
        }

        &__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        &__card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.75rem;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: var(--accent-color, rgba(99, 102, 241, 0.3));
            transform: translateY(-2px);
          }
        }

        &__card-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 0.5rem;
          color: var(--accent-color, #6366f1);
          flex-shrink: 0;

          svg,
          ::ng-deep svg {
            width: 20px;
            height: 20px;
          }
        }

        &__card-content {
          min-width: 0;
        }

        &__card-name {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 0.25rem 0;
        }

        &__card-desc {
          font-size: 0.8125rem;
          color: #64748b;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      @media (max-width: 1024px) {
        .tech-stack {
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
        .tech-stack {
          &__grid {
            grid-template-columns: 1fr;
          }

          &__main {
            flex-direction: column;
            gap: 1.5rem;
          }

          &__main-plus {
            transform: rotate(90deg);
          }
        }
      }
    `,
  ],
})
export class TechStackComponent {
  frontendStack: TechItem[];
  backendStack: TechItem[];
  devopsStack: TechItem[];

  constructor(private sanitizer: DomSanitizer) {
    this.frontendStack = [
      {
        name: 'Angular 19',
        description: 'Modern framework with Signals',
        color: '#dd0031',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.93 12.645h4.134L12.003 8.19l-2.073 4.455zM12 0L1.5 4.2l1.6 14.1L12 24l8.9-5.7 1.6-14.1L12 0zm6.65 18.4h-2.4l-1.275-3.225H8.975L7.7 18.4H5.35L12 2.1l6.65 16.3z"/></svg>`,
        ),
      },
      {
        name: 'AegisX UI',
        description: 'Custom component library',
        color: '#6366f1',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
        ),
      },
      {
        name: 'Angular Material',
        description: 'Material Design components',
        color: '#3f51b5',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
        ),
      },
      {
        name: 'TailwindCSS',
        description: 'Utility-first styling',
        color: '#06b6d4',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6c-2.7 0-4.35 1.35-4.95 4.05.99-1.35 2.145-1.86 3.465-1.53.75.19 1.29.735 1.89 1.335C13.33 10.785 14.46 12 17.1 12c2.7 0 4.35-1.35 4.95-4.05-.99 1.35-2.145 1.86-3.465 1.53-.75-.19-1.29-.735-1.89-1.335C15.77 7.215 14.64 6 12 6zM6.9 12c-2.7 0-4.35 1.35-4.95 4.05.99-1.35 2.145-1.86 3.465-1.53.75.19 1.29.735 1.89 1.335.93.93 2.07 2.145 4.71 2.145 2.7 0 4.35-1.35 4.95-4.05-.99 1.35-2.145 1.86-3.465 1.53-.75-.19-1.29-.735-1.89-1.335C10.68 13.215 9.54 12 6.9 12z"/></svg>`,
        ),
      },
    ];

    this.backendStack = [
      {
        name: 'Fastify 5',
        description: 'High-performance Node.js',
        color: '#ffffff',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        ),
      },
      {
        name: 'PostgreSQL',
        description: 'Robust database',
        color: '#336791',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
        ),
      },
      {
        name: 'Knex.js',
        description: 'SQL query builder',
        color: '#e26522',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>`,
        ),
      },
      {
        name: 'TypeBox',
        description: 'Runtime validation',
        color: '#3178c6',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
        ),
      },
    ];

    this.devopsStack = [
      {
        name: 'Nx Monorepo',
        description: 'Workspace management',
        color: '#143055',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
        ),
      },
      {
        name: 'Docker',
        description: 'Containerization',
        color: '#2496ed',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.186.186 0 0 0-.185.186v1.887c0 .102.083.185.185.185zm-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.186.186 0 0 0-.185.185v1.888c0 .102.082.186.185.186zm0 2.716h2.118a.186.186 0 0 0 .186-.185V6.29a.186.186 0 0 0-.186-.185h-2.118a.186.186 0 0 0-.185.185v1.887c0 .102.082.186.185.186zm-2.93 0h2.12a.186.186 0 0 0 .185-.185V6.29a.186.186 0 0 0-.186-.185h-2.12a.186.186 0 0 0-.185.185v1.887c0 .102.083.186.186.186zm-2.964 0h2.119a.186.186 0 0 0 .186-.185V6.29a.186.186 0 0 0-.186-.185h-2.12a.186.186 0 0 0-.185.185v1.887c0 .102.083.186.186.186zm5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.186.186 0 0 0-.185.186v1.887c0 .102.082.185.185.185zm-2.93 0h2.12a.186.186 0 0 0 .185-.185V9.006a.186.186 0 0 0-.186-.186h-2.12a.186.186 0 0 0-.185.186v1.887c0 .102.083.185.186.185zm-2.964 0h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.12a.186.186 0 0 0-.185.186v1.887c0 .102.083.185.186.185zm-2.92 0h2.12a.186.186 0 0 0 .185-.185V9.006a.186.186 0 0 0-.186-.186h-2.12a.186.186 0 0 0-.185.186v1.887c0 .102.083.185.186.185zM23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.75.75 0 0 0-.75.748 11.39 11.39 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.25 12.25 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z"/></svg>`,
        ),
      },
      {
        name: 'GitHub Actions',
        description: 'CI/CD automation',
        color: '#ffffff',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
        ),
      },
      {
        name: 'Multi-Instance',
        description: 'Parallel development',
        color: '#f59e0b',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="8" height="8" rx="1"/></svg>`,
        ),
      },
    ];
  }
}
