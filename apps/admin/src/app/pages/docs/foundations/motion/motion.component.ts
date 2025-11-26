import { Component, inject, signal } from '@angular/core';
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

interface MotionToken {
  name: string;
  cssVar: string;
  value: string;
  description: string;
}

@Component({
  selector: 'ax-motion-page',
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
    <div class="motion-page">
      <ax-doc-header
        title="Motion"
        description="Animation durations and easing functions for smooth, natural interactions. Motion should be purposeful and enhance the user experience."
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Foundations', link: '/docs/foundations/overview' },
          { label: 'Motion' },
        ]"
      ></ax-doc-header>

      <!-- Duration Tokens -->
      <section class="motion-page__durations">
        <h2 class="motion-page__section-title">Duration Scale</h2>
        <p class="motion-page__description">
          Use appropriate durations based on the complexity and importance of
          the animation.
        </p>

        <div class="motion-page__grid">
          @for (token of durationTokens; track token.name) {
            <div
              class="motion-page__token"
              (click)="copyToken(token.cssVar)"
              matTooltip="Click to copy"
            >
              <div class="motion-page__token-preview">
                <div
                  class="motion-page__demo-box"
                  [class.motion-page__demo-box--animating]="animating()"
                  [style.transition-duration]="token.value"
                ></div>
              </div>
              <div class="motion-page__token-info">
                <span class="motion-page__token-name">{{ token.name }}</span>
                <code class="motion-page__token-css">{{ token.cssVar }}</code>
                <span class="motion-page__token-value">{{ token.value }}</span>
                <span class="motion-page__token-desc">{{
                  token.description
                }}</span>
              </div>
            </div>
          }
        </div>

        <button
          mat-stroked-button
          class="motion-page__trigger"
          (click)="triggerAnimation()"
        >
          <mat-icon>play_arrow</mat-icon>
          Play Animation
        </button>
      </section>

      <!-- Easing Functions -->
      <section class="motion-page__easing">
        <h2 class="motion-page__section-title">Easing Functions</h2>
        <p class="motion-page__description">
          Easing functions control the rate of change during an animation.
        </p>

        <div class="motion-page__easing-grid">
          @for (easing of easingFunctions; track easing.name) {
            <div class="motion-page__easing-item">
              <div class="motion-page__easing-preview">
                <div
                  class="motion-page__easing-box"
                  [class.motion-page__easing-box--animating]="animating()"
                  [style.transition-timing-function]="easing.value"
                ></div>
                <div class="motion-page__easing-track"></div>
              </div>
              <div class="motion-page__easing-info">
                <span class="motion-page__easing-name">{{ easing.name }}</span>
                <code>{{ easing.value }}</code>
                <p>{{ easing.description }}</p>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Motion Principles -->
      <section class="motion-page__principles">
        <h2 class="motion-page__section-title">Motion Principles</h2>

        <div class="motion-page__principles-grid">
          <div class="motion-page__principle">
            <mat-icon>speed</mat-icon>
            <h4>Quick & Responsive</h4>
            <p>
              UI feedback should feel instant. Use fast durations (75-150ms) for
              micro-interactions.
            </p>
          </div>

          <div class="motion-page__principle">
            <mat-icon>visibility</mat-icon>
            <h4>Purposeful</h4>
            <p>
              Motion should guide attention and provide feedback, not distract
              from content.
            </p>
          </div>

          <div class="motion-page__principle">
            <mat-icon>accessibility</mat-icon>
            <h4>Accessible</h4>
            <p>
              Respect reduced motion preferences. Never rely solely on animation
              for meaning.
            </p>
          </div>

          <div class="motion-page__principle">
            <mat-icon>tune</mat-icon>
            <h4>Consistent</h4>
            <p>
              Use the same durations and easing for similar types of animations
              across the app.
            </p>
          </div>
        </div>
      </section>

      <!-- Use Cases -->
      <section class="motion-page__use-cases">
        <h2 class="motion-page__section-title">When to Use Each Duration</h2>

        <div class="motion-page__use-case-grid">
          <div class="motion-page__use-case">
            <h4>Instant (75ms)</h4>
            <ul>
              <li>Button press feedback</li>
              <li>Toggle switches</li>
              <li>Checkbox/radio changes</li>
              <li>Tooltips appearing</li>
            </ul>
          </div>

          <div class="motion-page__use-case">
            <h4>Fast (150ms)</h4>
            <ul>
              <li>Hover state changes</li>
              <li>Focus rings</li>
              <li>Color transitions</li>
              <li>Small position changes</li>
            </ul>
          </div>

          <div class="motion-page__use-case">
            <h4>Normal (250ms)</h4>
            <ul>
              <li>Dropdown menus</li>
              <li>Accordion expand</li>
              <li>Card hover effects</li>
              <li>Tab switches</li>
            </ul>
          </div>

          <div class="motion-page__use-case">
            <h4>Slow (350-500ms)</h4>
            <ul>
              <li>Modal enter/exit</li>
              <li>Page transitions</li>
              <li>Complex animations</li>
              <li>Loading skeletons</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Code Example -->
      <section class="motion-page__code">
        <h2 class="motion-page__section-title">Usage in CSS</h2>
        <ax-code-tabs [tabs]="codeExamples"></ax-code-tabs>
      </section>
    </div>
  `,
  styles: [
    `
      .motion-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl, 1.5rem);
      }

      .motion-page__section-title {
        font-size: var(--ax-text-xl, 1.25rem);
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
      }

      .motion-page__description {
        font-size: var(--ax-text-sm, 0.875rem);
        color: var(--ax-text-secondary);
        margin: 0 0 var(--ax-spacing-lg, 1rem) 0;
      }

      /* Duration Tokens */
      .motion-page__durations {
        margin-bottom: var(--ax-spacing-3xl, 3rem);
      }

      .motion-page__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
        margin-bottom: var(--ax-spacing-lg, 1rem);
      }

      .motion-page__token {
        cursor: pointer;
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg, 0.75rem);
        overflow: hidden;
        transition: border-color var(--ax-duration-fast, 150ms);

        &:hover {
          border-color: var(--ax-brand-default);
        }
      }

      .motion-page__token-preview {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: var(--ax-spacing-lg, 1rem);
        background: var(--ax-background-subtle);
        height: 60px;
      }

      .motion-page__demo-box {
        width: 32px;
        height: 32px;
        background: var(--ax-brand-default);
        border-radius: var(--ax-radius-md, 0.5rem);
        transition-property: transform;
        transition-timing-function: ease-out;
      }

      .motion-page__demo-box--animating {
        transform: translateX(100px);
      }

      .motion-page__token-info {
        padding: var(--ax-spacing-sm, 0.5rem);
        background: var(--ax-background-default);
      }

      .motion-page__token-name {
        display: block;
        font-size: var(--ax-text-sm, 0.875rem);
        font-weight: 600;
        color: var(--ax-text-primary);
      }

      .motion-page__token-css {
        display: block;
        font-size: var(--ax-text-xs, 0.75rem);
        font-family: var(--ax-font-mono);
        color: var(--ax-text-secondary);
      }

      .motion-page__token-value {
        display: block;
        font-size: var(--ax-text-xs, 0.75rem);
        color: var(--ax-brand-default);
        font-weight: 600;
      }

      .motion-page__token-desc {
        display: block;
        font-size: var(--ax-text-xs, 0.75rem);
        color: var(--ax-text-secondary);
        margin-top: 2px;
      }

      .motion-page__trigger {
        margin-top: var(--ax-spacing-sm, 0.5rem);
      }

      /* Easing */
      .motion-page__easing {
        margin-bottom: var(--ax-spacing-3xl, 3rem);
      }

      .motion-page__easing-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .motion-page__easing-item {
        padding: var(--ax-spacing-md, 0.75rem);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg, 0.75rem);
      }

      .motion-page__easing-preview {
        position: relative;
        height: 40px;
        margin-bottom: var(--ax-spacing-sm, 0.5rem);
      }

      .motion-page__easing-track {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--ax-border-default);
        transform: translateY(-50%);
      }

      .motion-page__easing-box {
        position: absolute;
        top: 50%;
        left: 0;
        width: 24px;
        height: 24px;
        background: var(--ax-brand-default);
        border-radius: var(--ax-radius-sm, 0.25rem);
        transform: translateY(-50%);
        transition: left 500ms;
      }

      .motion-page__easing-box--animating {
        left: calc(100% - 24px);
      }

      .motion-page__easing-info {
        .motion-page__easing-name {
          display: block;
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
        }

        code {
          font-size: var(--ax-text-xs, 0.75rem);
          font-family: var(--ax-font-mono);
          color: var(--ax-text-secondary);
        }

        p {
          font-size: var(--ax-text-xs, 0.75rem);
          color: var(--ax-text-secondary);
          margin: var(--ax-spacing-xs, 0.25rem) 0 0 0;
        }
      }

      /* Principles */
      .motion-page__principles {
        margin-bottom: var(--ax-spacing-3xl, 3rem);
      }

      .motion-page__principles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-lg, 1rem);
      }

      .motion-page__principle {
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
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-xs, 0.25rem) 0;
        }

        p {
          font-size: var(--ax-text-xs, 0.75rem);
          color: var(--ax-text-secondary);
          margin: 0;
          line-height: 1.5;
        }
      }

      /* Use Cases */
      .motion-page__use-cases {
        margin-bottom: var(--ax-spacing-3xl, 3rem);
      }

      .motion-page__use-case-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: var(--ax-spacing-md, 0.75rem);
      }

      .motion-page__use-case {
        padding: var(--ax-spacing-md, 0.75rem);
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg, 0.75rem);

        h4 {
          font-size: var(--ax-text-sm, 0.875rem);
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm, 0.5rem) 0;
        }

        ul {
          margin: 0;
          padding-left: var(--ax-spacing-lg, 1rem);

          li {
            font-size: var(--ax-text-xs, 0.75rem);
            color: var(--ax-text-secondary);
            margin-bottom: var(--ax-spacing-xs, 0.25rem);
          }
        }
      }

      .motion-page__code {
        margin-bottom: var(--ax-spacing-2xl, 2rem);
      }
    `,
  ],
})
export class MotionComponent {
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  animating = signal(false);

  durationTokens: MotionToken[] = [
    {
      name: 'Instant',
      cssVar: '--ax-duration-instant',
      value: '75ms',
      description: 'Micro-interactions',
    },
    {
      name: 'Fast',
      cssVar: '--ax-duration-fast',
      value: '150ms',
      description: 'Quick feedback',
    },
    {
      name: 'Normal',
      cssVar: '--ax-duration-normal',
      value: '250ms',
      description: 'Standard transitions',
    },
    {
      name: 'Slow',
      cssVar: '--ax-duration-slow',
      value: '350ms',
      description: 'Elaborate animations',
    },
    {
      name: 'Slower',
      cssVar: '--ax-duration-slower',
      value: '500ms',
      description: 'Complex sequences',
    },
  ];

  easingFunctions = [
    {
      name: 'Ease Out',
      value: 'ease-out',
      description: 'Fast start, slow end. Best for entering elements.',
    },
    {
      name: 'Ease In',
      value: 'ease-in',
      description: 'Slow start, fast end. Best for exiting elements.',
    },
    {
      name: 'Ease In Out',
      value: 'ease-in-out',
      description: 'Smooth acceleration and deceleration.',
    },
    {
      name: 'Linear',
      value: 'linear',
      description: 'Constant speed. Use sparingly, can feel mechanical.',
    },
  ];

  codeExamples = [
    {
      label: 'CSS',
      language: 'scss' as const,
      code: `/* Using motion tokens */
.button {
  transition: all var(--ax-duration-fast) ease-out;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--ax-shadow-md);
}

.dropdown {
  transition: opacity var(--ax-duration-normal) ease-out,
              transform var(--ax-duration-normal) ease-out;
}

.modal-enter {
  animation: fadeIn var(--ax-duration-slow) ease-out;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`,
    },
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `// Using with Angular animations
import { trigger, transition, style, animate } from '@angular/animations';

export const fadeSlideIn = trigger('fadeSlideIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-10px)' }),
    animate('var(--ax-duration-normal) ease-out',
      style({ opacity: 1, transform: 'translateY(0)' })
    ),
  ]),
  transition(':leave', [
    animate('var(--ax-duration-fast) ease-in',
      style({ opacity: 0, transform: 'translateY(-10px)' })
    ),
  ]),
]);`,
    },
  ];

  triggerAnimation(): void {
    this.animating.set(true);
    setTimeout(() => this.animating.set(false), 600);
  }

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
