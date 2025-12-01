import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SplashScreenService } from './splash-screen.service';
import { SplashScreenStage } from './splash-screen.types';

/**
 * AegisX Splash Screen Component
 *
 * A full-screen loading overlay that shows app initialization progress.
 * Can be controlled via SplashScreenService or used standalone.
 *
 * @example
 * ```html
 * <!-- In app.component.html - Uses service -->
 * <ax-splash-screen />
 *
 * <!-- Standalone with inputs -->
 * <ax-splash-screen
 *   [logo]="'/assets/logo.svg'"
 *   [appName]="'My App'"
 *   [visible]="isLoading"
 *   [stages]="loadingStages"
 *   [currentMessage]="'Loading...'"
 * />
 * ```
 */
@Component({
  selector: 'ax-splash-screen',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isVisible()) {
      <div
        class="ax-splash-screen"
        [class.ax-splash-screen--fade]="animationStyle() === 'fade'"
        [class.ax-splash-screen--slide]="animationStyle() === 'slide'"
        [class.ax-splash-screen--scale]="animationStyle() === 'scale'"
        [class.ax-splash-screen--error]="hasError()"
      >
        <!-- Animated Background (theme-aware, no inline style override) -->
        <div class="ax-splash-screen__bg">
          <div class="gradient-orb orb-1"></div>
          <div class="gradient-orb orb-2"></div>
          <div class="gradient-orb orb-3"></div>
          <div class="grid-pattern"></div>
        </div>

        <div class="ax-splash-screen__content">
          <!-- Logo -->
          @if (displayLogo()) {
            <div class="ax-splash-screen__logo">
              <img [src]="displayLogo()" [alt]="displayAppName()" />
            </div>
          } @else {
            <div class="ax-splash-screen__logo-placeholder">
              <mat-icon>rocket_launch</mat-icon>
            </div>
          }

          <!-- App Name -->
          <h1 class="ax-splash-screen__title">{{ displayAppName() }}</h1>

          <!-- Tagline -->
          @if (displayTagline()) {
            <p class="ax-splash-screen__tagline">{{ displayTagline() }}</p>
          }

          <!-- Progress Section -->
          <div class="ax-splash-screen__progress-section">
            <!-- Overall Progress Bar -->
            <mat-progress-bar
              [mode]="progressMode()"
              [value]="overallProgress()"
              class="ax-splash-screen__progress-bar"
            />

            <!-- Current Message -->
            <div class="ax-splash-screen__message">
              @if (!hasError()) {
                <mat-spinner diameter="16" />
              } @else {
                <mat-icon class="error-icon">error</mat-icon>
              }
              <span>{{ displayMessage() }}</span>
            </div>

            <!-- Progress Percentage -->
            @if (showPercentage() && !hasError()) {
              <div class="ax-splash-screen__percentage">
                {{ overallProgress() }}%
              </div>
            }
          </div>

          <!-- Stage Details -->
          @if (showStageDetails() && displayStages().length > 0) {
            <div class="ax-splash-screen__stages">
              @for (stage of displayStages(); track stage.id) {
                <div
                  class="ax-splash-screen__stage"
                  [class.ax-splash-screen__stage--pending]="
                    stage.status === 'pending'
                  "
                  [class.ax-splash-screen__stage--loading]="
                    stage.status === 'loading'
                  "
                  [class.ax-splash-screen__stage--completed]="
                    stage.status === 'completed'
                  "
                  [class.ax-splash-screen__stage--error]="
                    stage.status === 'error'
                  "
                >
                  <div class="ax-splash-screen__stage-icon">
                    @switch (stage.status) {
                      @case ('completed') {
                        <mat-icon>check_circle</mat-icon>
                      }
                      @case ('loading') {
                        <mat-spinner diameter="18" />
                      }
                      @case ('error') {
                        <mat-icon>error</mat-icon>
                      }
                      @default {
                        <mat-icon>{{
                          stage.icon || 'radio_button_unchecked'
                        }}</mat-icon>
                      }
                    }
                  </div>
                  <span class="ax-splash-screen__stage-label">{{
                    stage.label
                  }}</span>
                </div>
              }
            </div>
          }

          <!-- Error Section -->
          @if (hasError()) {
            <div class="ax-splash-screen__error">
              <p>{{ errorMessage() }}</p>
              @if (onRetry) {
                <button mat-stroked-button (click)="onRetry()">
                  <mat-icon>refresh</mat-icon>
                  ลองใหม่
                </button>
              }
            </div>
          }

          <!-- Version -->
          @if (displayVersion()) {
            <div class="ax-splash-screen__version">v{{ displayVersion() }}</div>
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      /* Theme-aware CSS Variables */
      :host {
        /* Dark theme (default) */
        --splash-bg: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
        --splash-bg-error: linear-gradient(135deg, #1e1e2e 0%, #2d1b3d 100%);
        --splash-text: #ffffff;
        --splash-text-muted: rgba(255, 255, 255, 0.7);
        --splash-text-subtle: rgba(255, 255, 255, 0.5);
        --splash-orb-opacity: 0.6;
        --splash-orb-1: linear-gradient(135deg, #6366f1, #8b5cf6);
        --splash-orb-2: linear-gradient(135deg, #06b6d4, #3b82f6);
        --splash-orb-3: linear-gradient(135deg, #f472b6, #ec4899);
        --splash-grid-color: rgba(255, 255, 255, 0.03);
        --splash-progress-bg: rgba(255, 255, 255, 0.15);
        --splash-progress-bar: #ffffff;
        --splash-success: #34d399;
        --splash-error: #f87171;
        --splash-logo-shadow: rgba(99, 102, 241, 0.4);
      }

      /* Light theme - detect via .light class or data-theme without -dark */
      :host-context(.light),
      :host-context([data-theme='aegisx']),
      :host-context([data-theme='verus']) {
        --splash-bg: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
        --splash-bg-error: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        --splash-text: #1e293b;
        --splash-text-muted: rgba(30, 41, 59, 0.7);
        --splash-text-subtle: rgba(30, 41, 59, 0.5);
        --splash-orb-opacity: 0.4;
        --splash-orb-1: linear-gradient(135deg, #818cf8, #a78bfa);
        --splash-orb-2: linear-gradient(135deg, #22d3ee, #60a5fa);
        --splash-orb-3: linear-gradient(135deg, #f9a8d4, #f472b6);
        --splash-grid-color: rgba(0, 0, 0, 0.03);
        --splash-progress-bg: rgba(99, 102, 241, 0.15);
        --splash-progress-bar: #6366f1;
        --splash-success: #10b981;
        --splash-error: #ef4444;
        --splash-logo-shadow: rgba(99, 102, 241, 0.3);
      }

      .ax-splash-screen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;

        &--fade {
          animation: fadeIn 0.3s ease-out;
        }

        &--slide {
          animation: slideIn 0.4s ease-out;
        }

        &--scale {
          animation: scaleIn 0.3s ease-out;
        }

        &--error {
          .ax-splash-screen__bg {
            background: var(--splash-bg-error);
          }
          .orb-1 {
            background: linear-gradient(135deg, #f5576c, #f093fb);
          }
          .orb-2 {
            background: linear-gradient(135deg, #ef4444, #f87171);
          }
        }
      }

      /* Animated Background */
      .ax-splash-screen__bg {
        position: absolute;
        inset: 0;
        background: var(--splash-bg);
        overflow: hidden;
      }

      .gradient-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: var(--splash-orb-opacity);
      }

      .orb-1 {
        width: 500px;
        height: 500px;
        background: var(--splash-orb-1);
        top: -150px;
        right: -100px;
        animation: float 8s ease-in-out infinite;
      }

      .orb-2 {
        width: 350px;
        height: 350px;
        background: var(--splash-orb-2);
        bottom: -100px;
        left: -80px;
        animation: float 10s ease-in-out infinite reverse;
      }

      .orb-3 {
        width: 250px;
        height: 250px;
        background: var(--splash-orb-3);
        top: 40%;
        left: 25%;
        transform: translate(-50%, -50%);
        animation: float 12s ease-in-out infinite;
      }

      .grid-pattern {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(var(--splash-grid-color) 1px, transparent 1px),
          linear-gradient(90deg, var(--splash-grid-color) 1px, transparent 1px);
        background-size: 40px 40px;
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

      .ax-splash-screen__content {
        position: relative;
        z-index: 1;
        text-align: center;
        color: var(--splash-text);
        max-width: 400px;
        padding: 2rem;
        animation: contentFadeIn 0.6s ease-out 0.1s both;
      }

      @keyframes contentFadeIn {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .ax-splash-screen__logo {
        margin-bottom: 1.5rem;

        img {
          max-width: 100px;
          max-height: 100px;
          object-fit: contain;
          filter: drop-shadow(0 8px 20px var(--splash-logo-shadow));
        }
      }

      .ax-splash-screen__logo-placeholder {
        margin-bottom: 1.5rem;
        width: 88px;
        height: 88px;
        margin-left: auto;
        margin-right: auto;
        background: var(--splash-orb-1);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 32px var(--splash-logo-shadow);
        animation: logoFloat 3s ease-in-out infinite;

        mat-icon {
          font-size: 44px;
          width: 44px;
          height: 44px;
          color: white;
        }
      }

      @keyframes logoFloat {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
      }

      .ax-splash-screen__title {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        letter-spacing: -0.5px;
        color: var(--splash-text);
      }

      .ax-splash-screen__tagline {
        font-size: 0.9375rem;
        color: var(--splash-text-muted);
        margin: 0 0 1.5rem;
        line-height: 1.5;
      }

      .ax-splash-screen__progress-section {
        margin: 2rem 0 1rem;
      }

      .ax-splash-screen__progress-bar {
        height: 4px;
        border-radius: 2px;
        overflow: hidden;
        background: var(--splash-progress-bg);

        ::ng-deep {
          .mdc-linear-progress {
            height: 4px;
          }

          .mdc-linear-progress__buffer-bar {
            background-color: var(--splash-progress-bg);
          }

          .mdc-linear-progress__bar-inner {
            border-color: var(--splash-progress-bar);
          }

          .mdc-linear-progress__primary-bar,
          .mdc-linear-progress__secondary-bar {
            background: var(--splash-progress-bar);
          }
        }
      }

      .ax-splash-screen__message {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.625rem;
        margin-top: 0.875rem;
        font-size: 0.875rem;
        color: var(--splash-text-muted);

        mat-spinner {
          ::ng-deep circle {
            stroke: var(--splash-progress-bar);
          }
        }

        .error-icon {
          color: var(--splash-error);
        }
      }

      .ax-splash-screen__percentage {
        font-size: 0.8125rem;
        color: var(--splash-text-subtle);
        margin-top: 0.375rem;
        font-variant-numeric: tabular-nums;
      }

      .ax-splash-screen__stages {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1.5rem;
        text-align: left;
      }

      .ax-splash-screen__stage {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0;
        transition: all 0.2s ease;

        &--pending {
          opacity: 0.4;
        }

        &--loading {
          opacity: 1;
        }

        &--completed {
          opacity: 0.6;

          .ax-splash-screen__stage-icon mat-icon {
            color: var(--splash-success);
          }
        }

        &--error {
          .ax-splash-screen__stage-icon mat-icon {
            color: var(--splash-error);
          }
        }
      }

      .ax-splash-screen__stage-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }

        mat-spinner {
          ::ng-deep circle {
            stroke: var(--splash-progress-bar);
          }
        }
      }

      .ax-splash-screen__stage-label {
        font-size: 0.875rem;
        color: var(--splash-text);
        font-weight: 400;
      }

      .ax-splash-screen__error {
        margin-top: 1.5rem;
        text-align: center;

        p {
          margin: 0 0 1rem;
          font-size: 0.875rem;
          color: var(--splash-text-muted);
        }

        button {
          color: var(--splash-text);
          border-color: var(--splash-text-subtle);

          &:hover {
            background: var(--splash-progress-bg);
            border-color: var(--splash-text-muted);
          }
        }
      }

      .ax-splash-screen__version {
        margin-top: 1.5rem;
        font-size: 0.75rem;
        color: var(--splash-text-subtle);
        font-variant-numeric: tabular-nums;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* Responsive */
      @media (max-width: 480px) {
        .ax-splash-screen__content {
          padding: 1.5rem;
        }

        .ax-splash-screen__logo-placeholder {
          width: 72px;
          height: 72px;
          border-radius: 16px;

          mat-icon {
            font-size: 36px;
            width: 36px;
            height: 36px;
          }
        }

        .ax-splash-screen__title {
          font-size: 1.375rem;
        }

        .ax-splash-screen__tagline {
          font-size: 0.875rem;
        }

        .orb-1 {
          width: 300px;
          height: 300px;
        }

        .orb-2 {
          width: 200px;
          height: 200px;
        }

        .orb-3 {
          width: 150px;
          height: 150px;
        }
      }
    `,
  ],
})
export class AxSplashScreenComponent {
  private splashService = inject(SplashScreenService);

  // Standalone inputs (override service)
  readonly visible = input<boolean | undefined>(undefined);
  readonly logo = input<string | undefined>(undefined);
  readonly appName = input<string | undefined>(undefined);
  readonly version = input<string | undefined>(undefined);
  readonly tagline = input<string | undefined>(undefined);
  readonly background = input<string | undefined>(undefined);
  readonly stages = input<SplashScreenStage[] | undefined>(undefined);
  readonly message = input<string | undefined>(undefined);
  readonly progress = input<number | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);
  readonly showPercentage = input(true);

  // Retry callback
  onRetry?: () => void;

  // Computed values (merge input with service)
  protected isVisible = computed(() => {
    const inputVisible = this.visible();
    return inputVisible !== undefined
      ? inputVisible
      : this.splashService.visible();
  });

  protected displayLogo = computed(() => {
    return this.logo() || this.splashService.config().logo;
  });

  protected displayAppName = computed(() => {
    return (
      this.appName() || this.splashService.config().appName || 'Application'
    );
  });

  protected displayTagline = computed(() => {
    return this.tagline() || this.splashService.config().tagline;
  });

  protected displayVersion = computed(() => {
    return this.version() || this.splashService.config().version;
  });

  protected displayBackground = computed(() => {
    return this.background() || this.splashService.config().background;
  });

  protected displayStages = computed(() => {
    return this.stages() || this.splashService.stages();
  });

  protected displayMessage = computed(() => {
    return this.message() || this.splashService.currentMessage();
  });

  protected overallProgress = computed(() => {
    const inputProgress = this.progress();
    return inputProgress !== undefined
      ? inputProgress
      : this.splashService.overallProgress();
  });

  protected hasError = computed(() => {
    const inputError = this.error();
    return inputError !== undefined
      ? !!inputError
      : this.splashService.hasError();
  });

  protected errorMessage = computed(() => {
    return this.error() || this.splashService.error();
  });

  protected progressMode = computed(() => {
    return this.displayStages().length > 0 || this.progress() !== undefined
      ? 'determinate'
      : 'indeterminate';
  });

  protected showStageDetails = computed(() => {
    return this.splashService.config().showStageDetails !== false;
  });

  protected animationStyle = computed(() => {
    return this.splashService.config().animationStyle || 'fade';
  });
}
