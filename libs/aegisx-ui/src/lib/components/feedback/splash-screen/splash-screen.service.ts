import { Injectable, signal, computed } from '@angular/core';
import {
  SplashScreenConfig,
  SplashScreenStage,
  SplashScreenState,
  DEFAULT_SPLASH_CONFIG,
  DEFAULT_STAGES,
} from './splash-screen.types';

/**
 * Service to control the Splash Screen state
 *
 * @example
 * ```typescript
 * // In app.config.ts or APP_INITIALIZER
 * export function initializeApp(splashService: SplashScreenService) {
 *   return async () => {
 *     splashService.show({
 *       appName: 'My App',
 *       logo: '/assets/logo.svg',
 *     });
 *
 *     splashService.setStages([
 *       { id: 'config', label: 'Loading config', icon: 'settings', status: 'pending' },
 *       { id: 'auth', label: 'Checking auth', icon: 'lock', status: 'pending' },
 *       { id: 'data', label: 'Loading data', icon: 'cloud', status: 'pending' },
 *     ]);
 *
 *     // Stage 1: Config
 *     splashService.startStage('config');
 *     await loadConfig();
 *     splashService.completeStage('config');
 *
 *     // Stage 2: Auth
 *     splashService.startStage('auth');
 *     await checkAuth();
 *     splashService.completeStage('auth');
 *
 *     // Stage 3: Data
 *     splashService.startStage('data');
 *     await loadData();
 *     splashService.completeStage('data');
 *
 *     // Done - hide splash
 *     await splashService.hide();
 *   };
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SplashScreenService {
  // Configuration
  private _config = signal<SplashScreenConfig>(DEFAULT_SPLASH_CONFIG);

  // State
  private _visible = signal(false);
  private _stages = signal<SplashScreenStage[]>([]);
  private _currentStageIndex = signal(-1);
  private _customMessage = signal<string | null>(null);
  private _error = signal<string | null>(null);
  private _showTime = 0;

  // Public computed signals
  readonly config = this._config.asReadonly();
  readonly visible = this._visible.asReadonly();
  readonly stages = this._stages.asReadonly();
  readonly currentStageIndex = this._currentStageIndex.asReadonly();
  readonly error = this._error.asReadonly();

  readonly currentStage = computed(() => {
    const stages = this._stages();
    const index = this._currentStageIndex();
    return index >= 0 && index < stages.length ? stages[index] : null;
  });

  readonly currentMessage = computed(() => {
    const custom = this._customMessage();
    if (custom) return custom;

    const stage = this.currentStage();
    if (stage) return stage.label;

    return this._config().tips?.[0] || 'กำลังโหลด...';
  });

  readonly overallProgress = computed(() => {
    const stages = this._stages();
    if (stages.length === 0) return 0;

    const completed = stages.filter((s) => s.status === 'completed').length;
    const loading = stages.filter((s) => s.status === 'loading').length;

    return Math.round(((completed + loading * 0.5) / stages.length) * 100);
  });

  readonly completedStages = computed(
    () => this._stages().filter((s) => s.status === 'completed').length,
  );

  readonly hasError = computed(() => this._error() !== null);

  readonly state = computed<SplashScreenState>(() => ({
    visible: this._visible(),
    stages: this._stages(),
    currentStageIndex: this._currentStageIndex(),
    overallProgress: this.overallProgress(),
    currentMessage: this.currentMessage(),
    error: this._error(),
  }));

  /**
   * Show splash screen with optional config
   */
  show(config?: Partial<SplashScreenConfig>): void {
    if (config) {
      this._config.update((c) => ({ ...c, ...config }));
    }
    this._showTime = Date.now();
    this._visible.set(true);
    this._error.set(null);
  }

  /**
   * Hide splash screen (respects minDisplayTime)
   */
  async hide(): Promise<void> {
    const minTime = this._config().minDisplayTime || 0;
    const elapsed = Date.now() - this._showTime;

    if (elapsed < minTime) {
      await this.delay(minTime - elapsed);
    }

    this._visible.set(false);
  }

  /**
   * Force hide immediately
   */
  forceHide(): void {
    this._visible.set(false);
  }

  /**
   * Set loading stages
   */
  setStages(stages: SplashScreenStage[]): void {
    this._stages.set(stages.map((s) => ({ ...s, status: 'pending' as const })));
    this._currentStageIndex.set(-1);
  }

  /**
   * Use default stages
   */
  useDefaultStages(): void {
    this.setStages(DEFAULT_STAGES);
  }

  /**
   * Start a stage by ID
   */
  startStage(stageId: string): void {
    this._stages.update((stages) =>
      stages.map((s, index) => {
        if (s.id === stageId) {
          this._currentStageIndex.set(index);
          return { ...s, status: 'loading' as const };
        }
        return s;
      }),
    );
    this._customMessage.set(null);
  }

  /**
   * Complete a stage by ID
   */
  completeStage(stageId: string): void {
    this._stages.update((stages) =>
      stages.map((s) =>
        s.id === stageId ? { ...s, status: 'completed' as const } : s,
      ),
    );
  }

  /**
   * Mark a stage as error
   */
  errorStage(stageId: string, errorMessage?: string): void {
    this._stages.update((stages) =>
      stages.map((s) =>
        s.id === stageId ? { ...s, status: 'error' as const, errorMessage } : s,
      ),
    );
    this._error.set(errorMessage || `Error in stage: ${stageId}`);
  }

  /**
   * Set custom message (overrides stage label)
   */
  setMessage(message: string): void {
    this._customMessage.set(message);
  }

  /**
   * Clear custom message
   */
  clearMessage(): void {
    this._customMessage.set(null);
  }

  /**
   * Set error state
   */
  setError(error: string): void {
    this._error.set(error);
  }

  /**
   * Clear error
   */
  clearError(): void {
    this._error.set(null);
  }

  /**
   * Reset all state
   */
  reset(): void {
    this._visible.set(false);
    this._stages.set([]);
    this._currentStageIndex.set(-1);
    this._customMessage.set(null);
    this._error.set(null);
    this._config.set(DEFAULT_SPLASH_CONFIG);
  }

  /**
   * Update config
   */
  updateConfig(config: Partial<SplashScreenConfig>): void {
    this._config.update((c) => ({ ...c, ...config }));
  }

  /**
   * Run stages sequentially with async functions
   */
  async runStages(
    stageHandlers: Array<{
      id: string;
      handler: () => Promise<void>;
    }>,
  ): Promise<boolean> {
    for (const { id, handler } of stageHandlers) {
      this.startStage(id);
      try {
        await handler();
        this.completeStage(id);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.errorStage(id, message);
        return false;
      }
    }
    return true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
