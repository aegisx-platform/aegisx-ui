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
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { SplashScreenService } from './splash-screen.service';
import { SplashScreenStage } from './splash-screen.types';

type WaveColorTheme =
  | 'light'
  | 'dark'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'aurora'
  | 'aegisx';
type BackgroundStyle = 'orbs' | 'wave' | 'minimal';

interface WaveColorPalette {
  light: string;
  dark: string;
  skyTop: string;
  skyBottom: string;
  textColor?: string;
}

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
  styleUrl: './splash-screen.component.scss',
  template: `
    @if (isVisible()) {
      <div
        class="ax-splash-screen"
        [class.ax-splash-screen--fade]="animationStyle() === 'fade'"
        [class.ax-splash-screen--slide]="animationStyle() === 'slide'"
        [class.ax-splash-screen--scale]="animationStyle() === 'scale'"
        [class.ax-splash-screen--error]="hasError()"
      >
        <!-- Background based on style -->
        @if (bgStyle() === 'wave') {
          <!-- Wave Background -->
          <div
            class="ax-splash-screen__bg ax-splash-screen__bg--wave"
            [attr.data-wave-theme]="waveTheme()"
            [style]="waveBackgroundStyle()"
          >
            <div class="wave-container">
              <div
                class="wave wave-1"
                [style.background]="waveBackground1()"
              ></div>
              <div
                class="wave wave-2"
                [style.background]="waveBackground2()"
              ></div>
              <div
                class="wave wave-3"
                [style.background]="waveBackground3()"
              ></div>
            </div>
          </div>
        } @else if (bgStyle() === 'minimal') {
          <!-- Minimal Background -->
          <div class="ax-splash-screen__bg ax-splash-screen__bg--minimal"></div>
        } @else {
          <!-- Orbs Background (default) -->
          <div class="ax-splash-screen__bg">
            <div class="gradient-orb orb-1"></div>
            <div class="gradient-orb orb-2"></div>
            <div class="gradient-orb orb-3"></div>
            <div class="grid-pattern"></div>
          </div>
        }

        <div class="ax-splash-screen__content" [ngStyle]="waveContentStyles()">
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

          <!-- App Name (hidden — logo already contains brand text) -->
          <!-- <h1 class="ax-splash-screen__title">{{ displayAppName() }}</h1> -->

          <!-- Tagline (hidden — keep splash minimal, logo-only) -->
          <!-- @if (displayTagline()) {
            <p class="ax-splash-screen__tagline">{{ displayTagline() }}</p>
          } -->

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
})
export class AxSplashScreenComponent {
  private splashService = inject(SplashScreenService);
  private sanitizer = inject(DomSanitizer);

  // Wave color palettes
  private readonly waveColorPalettes: Record<WaveColorTheme, WaveColorPalette> =
    {
      light: {
        light: '#e2e8f0',
        dark: '#cbd5e1',
        skyTop: '#ffffff',
        skyBottom: '#f8fafc',
      },
      dark: {
        light: '#52525b',
        dark: '#27272a',
        skyTop: '#18181b',
        skyBottom: '#27272a',
        textColor: '#ffffff',
      },
      ocean: {
        light: '#22d3ee',
        dark: '#0891b2',
        skyTop: '#ecfeff',
        skyBottom: '#cffafe',
      },
      sunset: {
        light: '#fb923c',
        dark: '#ea580c',
        skyTop: '#fff7ed',
        skyBottom: '#ffedd5',
      },
      forest: {
        light: '#4ade80',
        dark: '#16a34a',
        skyTop: '#f0fdf4',
        skyBottom: '#dcfce7',
      },
      aurora: {
        light: '#a78bfa',
        dark: '#7c3aed',
        skyTop: '#faf5ff',
        skyBottom: '#f3e8ff',
      },
      aegisx: {
        light: '#818cf8',
        dark: '#4f46e5',
        skyTop: '#eef2ff',
        skyBottom: '#e0e7ff',
      },
    };

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

  // Background style inputs (override service config)
  readonly backgroundStyleOverride = input<BackgroundStyle | undefined>(
    undefined,
  );
  readonly waveColorThemeOverride = input<WaveColorTheme | undefined>(
    undefined,
  );

  // Retry callback
  onRetry?: () => void;

  // Computed bgStyle - merge input with service config
  protected bgStyle = computed(() => {
    return (
      this.backgroundStyleOverride() ||
      this.splashService.config().backgroundStyle ||
      'orbs'
    );
  });

  // Computed waveTheme - merge input with service config
  protected waveTheme = computed(() => {
    return (
      this.waveColorThemeOverride() ||
      this.splashService.config().waveColor ||
      'ocean'
    );
  });

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

  // Wave computed signals
  private currentPalette = computed(() => {
    return this.waveColorPalettes[this.waveTheme()];
  });

  protected waveBackgroundStyle = computed((): SafeStyle => {
    const palette = this.currentPalette();
    const style = `background: linear-gradient(180deg, ${palette.skyTop} 0%, ${palette.skyBottom} 100%)`;
    return this.sanitizer.bypassSecurityTrustStyle(style);
  });

  // Wave backgrounds with repeat-x for seamless animation
  protected waveBackground1 = computed(() => {
    const palette = this.currentPalette();
    const svg = this.generateWaveSvg(palette.light, palette.dark, 1);
    return `url("${svg}") repeat-x`;
  });

  protected waveBackground2 = computed(() => {
    const palette = this.currentPalette();
    const svg = this.generateWaveSvg(palette.dark, palette.light, 0.8);
    return `url("${svg}") repeat-x`;
  });

  protected waveBackground3 = computed(() => {
    const palette = this.currentPalette();
    const svg = this.generateWaveSvg(palette.light, palette.dark, 0.6);
    return `url("${svg}") repeat-x`;
  });

  protected waveContentStyles = computed(() => {
    if (this.bgStyle() !== 'wave') {
      return {};
    }
    const palette = this.currentPalette();
    if (palette.textColor) {
      return {
        '--splash-text': palette.textColor,
        '--splash-text-muted': `${palette.textColor}cc`,
        '--splash-text-subtle': `${palette.textColor}99`,
      };
    }
    return {};
  });

  // Generate wave SVG with gradient fill - 1600px wide for seamless repeat
  private generateWaveSvg(
    colorLight: string,
    colorDark: string,
    opacity: number,
  ): string {
    const gradientId = `waveGrad${Math.random().toString(36).substr(2, 9)}`;
    // Original wave shape with fill - the v77H0 creates the solid area below the wave curve
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="198" viewBox="0 0 1600 198">
      <defs>
        <linearGradient id="${gradientId}" x1="50%" x2="50%" y1="-10.959%" y2="100%">
          <stop stop-color="${colorLight}" stop-opacity="${opacity * 0.25}" offset="0%"/>
          <stop stop-color="${colorDark}" stop-opacity="${opacity}" offset="100%"/>
        </linearGradient>
      </defs>
      <path fill="url(#${gradientId})" d="M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z" transform="matrix(-1 0 0 1 1600 0)"/>
    </svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }
}
