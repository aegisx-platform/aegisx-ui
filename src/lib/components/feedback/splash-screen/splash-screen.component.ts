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
        [style.background]="displayBackground()"
      >
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
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
      }

      .ax-splash-screen__content {
        text-align: center;
        color: white;
        max-width: 400px;
        padding: 2rem;
      }

      .ax-splash-screen__logo {
        margin-bottom: 1.5rem;

        img {
          max-width: 120px;
          max-height: 120px;
          object-fit: contain;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
        }
      }

      .ax-splash-screen__logo-placeholder {
        margin-bottom: 1.5rem;

        mat-icon {
          font-size: 80px;
          width: 80px;
          height: 80px;
          opacity: 0.9;
        }
      }

      .ax-splash-screen__title {
        font-size: 2rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
        letter-spacing: -0.5px;
      }

      .ax-splash-screen__tagline {
        font-size: 1rem;
        opacity: 0.85;
        margin: 0 0 2rem;
      }

      .ax-splash-screen__progress-section {
        margin: 2rem 0;
      }

      .ax-splash-screen__progress-bar {
        border-radius: 4px;
        overflow: hidden;

        ::ng-deep {
          .mdc-linear-progress__buffer-bar {
            background-color: rgba(255, 255, 255, 0.2);
          }

          .mdc-linear-progress__bar-inner {
            border-color: white;
          }
        }
      }

      .ax-splash-screen__message {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        margin-top: 1rem;
        font-size: 0.9rem;
        opacity: 0.9;

        mat-spinner {
          ::ng-deep circle {
            stroke: white;
          }
        }

        .error-icon {
          color: #ffcdd2;
        }
      }

      .ax-splash-screen__percentage {
        font-size: 0.85rem;
        opacity: 0.7;
        margin-top: 0.5rem;
      }

      .ax-splash-screen__stages {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 2rem;
        text-align: left;
      }

      .ax-splash-screen__stage {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.75rem;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;

        &--pending {
          opacity: 0.5;
        }

        &--loading {
          background: rgba(255, 255, 255, 0.2);
        }

        &--completed {
          opacity: 0.7;

          .ax-splash-screen__stage-icon mat-icon {
            color: #a5d6a7;
          }
        }

        &--error {
          background: rgba(255, 0, 0, 0.2);

          .ax-splash-screen__stage-icon mat-icon {
            color: #ffcdd2;
          }
        }
      }

      .ax-splash-screen__stage-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }

        mat-spinner {
          ::ng-deep circle {
            stroke: white;
          }
        }
      }

      .ax-splash-screen__stage-label {
        font-size: 0.85rem;
      }

      .ax-splash-screen__error {
        margin-top: 1.5rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 8px;

        p {
          margin: 0 0 1rem;
          font-size: 0.9rem;
        }

        button {
          color: white;
          border-color: rgba(255, 255, 255, 0.5);
        }
      }

      .ax-splash-screen__version {
        margin-top: 2rem;
        font-size: 0.75rem;
        opacity: 0.5;
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
