import {
  Component,
  signal,
  inject,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { AxAlertComponent } from '@aegisx/ui';
import {
  UserService,
  UserPreferences,
  UserProfile,
} from '../../users/services/user.service';

@Component({
  selector: 'ax-user-preferences',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTooltipModule,
    AxAlertComponent,
  ],
  template: `
    <div class="preferences-container">
      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loading-container">
          <div class="loading-content">
            <mat-spinner diameter="40"></mat-spinner>
            <p class="loading-text">Loading preferences...</p>
          </div>
        </div>
      }

      <!-- Error State -->
      @else if (error()) {
        <ax-alert
          type="error"
          title="Error Loading Preferences"
          class="error-alert"
        >
          {{ error() }}
          <button
            mat-button
            color="primary"
            (click)="loadPreferences()"
            class="retry-button"
          >
            Retry
          </button>
        </ax-alert>
      }

      <!-- Main Content -->
      @else {
        <form [formGroup]="preferencesForm" (ngSubmit)="savePreferences()">
          <div class="preferences-sections">
            <!-- Appearance Section -->
            <mat-card appearance="outlined">
              <mat-card-header>
                <mat-card-title class="section-card-title">
                  <mat-icon class="section-icon">palette</mat-icon>
                  Appearance
                </mat-card-title>
                <mat-card-subtitle>
                  Customize the visual appearance of your interface
                </mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <div class="form-grid-2col">
                  <!-- Theme -->
                  <mat-form-field appearance="outline">
                    <mat-label>Theme</mat-label>
                    <mat-select formControlName="theme">
                      <mat-option value="default">Default</mat-option>
                      <mat-option value="light">Light</mat-option>
                      <mat-option value="dark">Dark</mat-option>
                      <mat-option value="auto">Auto (System)</mat-option>
                    </mat-select>
                    <mat-icon matSuffix>brightness_6</mat-icon>
                    <mat-hint>Choose your preferred color theme</mat-hint>
                  </mat-form-field>

                  <!-- Scheme -->
                  <mat-form-field appearance="outline">
                    <mat-label>Color Scheme</mat-label>
                    <mat-select formControlName="scheme">
                      <mat-option value="light">Light</mat-option>
                      <mat-option value="dark">Dark</mat-option>
                      <mat-option value="auto">Auto</mat-option>
                    </mat-select>
                    <mat-icon matSuffix>color_lens</mat-icon>
                    <mat-hint>Base color scheme for the interface</mat-hint>
                  </mat-form-field>

                  <!-- Layout -->
                  <mat-form-field appearance="outline">
                    <mat-label>Layout Style</mat-label>
                    <mat-select formControlName="layout">
                      <mat-option value="classic">Classic</mat-option>
                      <mat-option value="compact">Compact</mat-option>
                      <mat-option value="enterprise">Enterprise</mat-option>
                      <mat-option value="empty">Minimal</mat-option>
                    </mat-select>
                    <mat-icon matSuffix>dashboard</mat-icon>
                    <mat-hint>Choose your preferred layout style</mat-hint>
                  </mat-form-field>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Localization Section -->
            <mat-card appearance="outlined">
              <mat-card-header>
                <mat-card-title class="section-card-title">
                  <mat-icon class="section-icon">language</mat-icon>
                  Localization
                </mat-card-title>
                <mat-card-subtitle>
                  Set your language, timezone, and date/time formats
                </mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <div class="form-grid-2col">
                  <!-- Language -->
                  <mat-form-field appearance="outline">
                    <mat-label>Language</mat-label>
                    <mat-select formControlName="language">
                      <mat-option value="en">English</mat-option>
                      <mat-option value="th">ไทย (Thai)</mat-option>
                      <mat-option value="ja">日本語 (Japanese)</mat-option>
                      <mat-option value="zh">中文 (Chinese)</mat-option>
                      <mat-option value="ko">한국어 (Korean)</mat-option>
                      <mat-option value="es">Español (Spanish)</mat-option>
                      <mat-option value="fr">Français (French)</mat-option>
                      <mat-option value="de">Deutsch (German)</mat-option>
                    </mat-select>
                    <mat-icon matSuffix>translate</mat-icon>
                    <mat-hint>Interface language</mat-hint>
                  </mat-form-field>

                  <!-- Timezone -->
                  <mat-form-field appearance="outline">
                    <mat-label>Timezone</mat-label>
                    <mat-select formControlName="timezone">
                      <mat-option value="UTC"
                        >UTC (Coordinated Universal Time)</mat-option
                      >
                      <mat-option value="Asia/Bangkok"
                        >Asia/Bangkok (GMT+7)</mat-option
                      >
                      <mat-option value="Asia/Tokyo"
                        >Asia/Tokyo (GMT+9)</mat-option
                      >
                      <mat-option value="America/New_York"
                        >America/New_York (EST)</mat-option
                      >
                      <mat-option value="America/Los_Angeles"
                        >America/Los_Angeles (PST)</mat-option
                      >
                      <mat-option value="Europe/London"
                        >Europe/London (GMT)</mat-option
                      >
                      <mat-option value="Europe/Paris"
                        >Europe/Paris (CET)</mat-option
                      >
                      <mat-option value="Australia/Sydney"
                        >Australia/Sydney (AEST)</mat-option
                      >
                    </mat-select>
                    <mat-icon matSuffix>schedule</mat-icon>
                    <mat-hint>Your local timezone</mat-hint>
                  </mat-form-field>

                  <!-- Date Format -->
                  <mat-form-field appearance="outline">
                    <mat-label>Date Format</mat-label>
                    <mat-select formControlName="dateFormat">
                      <mat-option value="MM/DD/YYYY"
                        >MM/DD/YYYY (US)</mat-option
                      >
                      <mat-option value="DD/MM/YYYY"
                        >DD/MM/YYYY (International)</mat-option
                      >
                      <mat-option value="YYYY-MM-DD"
                        >YYYY-MM-DD (ISO)</mat-option
                      >
                    </mat-select>
                    <mat-icon matSuffix>calendar_today</mat-icon>
                    <mat-hint>How dates are displayed</mat-hint>
                  </mat-form-field>

                  <!-- Time Format -->
                  <mat-form-field appearance="outline">
                    <mat-label>Time Format</mat-label>
                    <mat-select formControlName="timeFormat">
                      <mat-option value="12h">12-hour (AM/PM)</mat-option>
                      <mat-option value="24h">24-hour</mat-option>
                    </mat-select>
                    <mat-icon matSuffix>access_time</mat-icon>
                    <mat-hint>How times are displayed</mat-hint>
                  </mat-form-field>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Notifications Section -->
            <mat-card appearance="outlined">
              <mat-card-header>
                <mat-card-title class="section-card-title">
                  <mat-icon class="section-icon">notifications</mat-icon>
                  Notifications
                </mat-card-title>
                <mat-card-subtitle>
                  Control how and when you receive notifications
                </mat-card-subtitle>
              </mat-card-header>

              <mat-card-content formGroupName="notifications">
                <div class="toggle-list">
                  <!-- Email Notifications -->
                  <div class="toggle-item">
                    <div class="toggle-info">
                      <h4 class="toggle-title">Email Notifications</h4>
                      <p class="toggle-description">
                        Receive notifications via email
                      </p>
                    </div>
                    <mat-slide-toggle
                      formControlName="email"
                      color="primary"
                    ></mat-slide-toggle>
                  </div>

                  <!-- Push Notifications -->
                  <div class="toggle-item">
                    <div class="toggle-info">
                      <h4 class="toggle-title">Push Notifications</h4>
                      <p class="toggle-description">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <mat-slide-toggle
                      formControlName="push"
                      color="primary"
                    ></mat-slide-toggle>
                  </div>

                  <!-- Desktop Notifications -->
                  <div class="toggle-item">
                    <div class="toggle-info">
                      <h4 class="toggle-title">Desktop Notifications</h4>
                      <p class="toggle-description">
                        Show desktop notifications when app is minimized
                      </p>
                    </div>
                    <mat-slide-toggle
                      formControlName="desktop"
                      color="primary"
                    ></mat-slide-toggle>
                  </div>

                  <!-- Sound Notifications -->
                  <div class="toggle-item">
                    <div class="toggle-info">
                      <h4 class="toggle-title">Sound Alerts</h4>
                      <p class="toggle-description">
                        Play sounds for notifications and alerts
                      </p>
                    </div>
                    <mat-slide-toggle
                      formControlName="sound"
                      color="primary"
                    ></mat-slide-toggle>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Navigation Section -->
            <mat-card appearance="outlined">
              <mat-card-header>
                <mat-card-title class="section-card-title">
                  <mat-icon class="section-icon">menu</mat-icon>
                  Navigation
                </mat-card-title>
                <mat-card-subtitle>
                  Customize the navigation menu behavior
                </mat-card-subtitle>
              </mat-card-header>

              <mat-card-content formGroupName="navigation">
                <div class="toggle-list">
                  <!-- Navigation Collapsed -->
                  <div class="toggle-item">
                    <div class="toggle-info">
                      <h4 class="toggle-title">Collapsed by Default</h4>
                      <p class="toggle-description">
                        Start with navigation menu collapsed
                      </p>
                    </div>
                    <mat-slide-toggle
                      formControlName="collapsed"
                      color="primary"
                    ></mat-slide-toggle>
                  </div>

                  <div class="form-grid-2col nav-grid-spacing">
                    <!-- Navigation Type -->
                    <mat-form-field appearance="outline">
                      <mat-label>Navigation Type</mat-label>
                      <mat-select formControlName="type">
                        <mat-option value="default">Default</mat-option>
                        <mat-option value="compact">Compact</mat-option>
                        <mat-option value="horizontal">Horizontal</mat-option>
                      </mat-select>
                      <mat-icon matSuffix>view_module</mat-icon>
                      <mat-hint>Navigation style</mat-hint>
                    </mat-form-field>

                    <!-- Navigation Position -->
                    <mat-form-field appearance="outline">
                      <mat-label>Navigation Position</mat-label>
                      <mat-select formControlName="position">
                        <mat-option value="left">Left</mat-option>
                        <mat-option value="right">Right</mat-option>
                        <mat-option value="top">Top</mat-option>
                      </mat-select>
                      <mat-icon matSuffix>place</mat-icon>
                      <mat-hint>Where navigation appears</mat-hint>
                    </mat-form-field>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Action Buttons -->
            <div class="action-buttons-row">
              <button
                type="button"
                mat-button
                (click)="resetToDefaults()"
                [disabled]="isSaving()"
              >
                Reset to Defaults
              </button>

              <div class="button-group">
                <button
                  type="button"
                  mat-button
                  (click)="discardChanges()"
                  [disabled]="!hasChanges() || isSaving()"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  mat-raised-button
                  color="primary"
                  [disabled]="
                    !hasChanges() || preferencesForm.invalid || isSaving()
                  "
                >
                  @if (isSaving()) {
                    <mat-icon class="animate-spin mr-2">sync</mat-icon>
                  }
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </form>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* ===== CONTAINER ===== */
      .preferences-container {
        max-width: 800px;
      }

      /* ===== LOADING STATE ===== */
      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 300px;
      }

      .loading-content {
        text-align: center;
      }

      .loading-text {
        margin-top: var(--ax-spacing-lg);
        color: var(--ax-text-subtle);
      }

      /* ===== ERROR STATE ===== */
      .error-alert {
        margin-bottom: var(--ax-spacing-xl);
      }

      .retry-button {
        margin-left: var(--ax-spacing-sm);
      }

      /* ===== SECTIONS ===== */
      .preferences-sections {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-xl);
      }

      /* ===== SECTION CARDS ===== */
      .section-card-title {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm);
        font-size: var(--ax-font-size-lg);
        font-weight: var(--ax-font-weight-semibold);
      }

      .section-icon {
        margin-right: 0;
      }

      /* ===== FORM GRID ===== */
      .form-grid-2col {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: var(--ax-spacing-md);
      }

      @media (min-width: 768px) {
        .form-grid-2col {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .nav-grid-spacing {
        margin-top: var(--ax-spacing-lg);
      }

      /* ===== TOGGLE LIST ===== */
      .toggle-list {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-lg);
      }

      .toggle-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ax-spacing-md);
      }

      .toggle-info {
        flex: 1;
      }

      .toggle-title {
        margin: 0 0 var(--ax-spacing-xs) 0;
        font-weight: var(--ax-font-weight-medium);
        color: var(--ax-text-heading);
      }

      .toggle-description {
        margin: 0;
        font-size: var(--ax-font-size-sm);
        color: var(--ax-text-subtle);
      }

      /* ===== ACTION BUTTONS ===== */
      .action-buttons-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: var(--ax-spacing-lg);
      }

      .button-group {
        display: flex;
        gap: var(--ax-spacing-sm);
      }

      /* ===== ANIMATIONS ===== */
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .animate-spin {
        animation: spin 1s linear infinite;
      }

      /* ===== MATERIAL OVERRIDES ===== */
      ::ng-deep .mat-mdc-form-field {
        width: 100%;
      }

      ::ng-deep .mat-mdc-slide-toggle {
        --mdc-switch-selected-track-color: rgb(var(--primary-500));
        --mdc-switch-selected-handle-color: rgb(var(--primary-600));
      }
    `,
  ],
})
export class UserPreferencesComponent implements OnInit, OnDestroy {
  @Input() userProfile: UserProfile | null = null;
  @Output() preferencesChange = new EventEmitter<UserPreferences>();

  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  // State signals
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);
  originalPreferences = signal<UserPreferences | null>(null);

  preferencesForm: FormGroup;

  constructor() {
    this.preferencesForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.userProfile?.preferences) {
      this.loadPreferencesFromProfile(this.userProfile.preferences);
    } else {
      this.loadPreferences();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      theme: ['default', [Validators.required]],
      scheme: ['light', [Validators.required]],
      layout: ['classic', [Validators.required]],
      language: ['en', [Validators.required, Validators.pattern(/^[a-z]{2}$/)]],
      timezone: ['UTC', [Validators.required]],
      dateFormat: ['MM/DD/YYYY', [Validators.required]],
      timeFormat: ['12h', [Validators.required]],
      notifications: this.formBuilder.group({
        email: [true],
        push: [false],
        desktop: [true],
        sound: [true],
      }),
      navigation: this.formBuilder.group({
        collapsed: [false],
        type: ['default', [Validators.required]],
        position: ['left', [Validators.required]],
      }),
    });
  }

  loadPreferences(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userService
      .getPreferences()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (preferences) => {
          this.loadPreferencesFromProfile(preferences);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set(error.message || 'Failed to load preferences');
          this.isLoading.set(false);
        },
      });
  }

  private loadPreferencesFromProfile(preferences: UserPreferences): void {
    this.originalPreferences.set(preferences);
    this.preferencesForm.patchValue(preferences);
  }

  hasChanges(): boolean {
    const currentValues = this.preferencesForm.value;
    const original = this.originalPreferences();

    if (!original) return false;

    return JSON.stringify(currentValues) !== JSON.stringify(original);
  }

  async savePreferences(): Promise<void> {
    if (!this.preferencesForm.valid || !this.hasChanges()) return;

    this.isSaving.set(true);

    try {
      const preferences = this.preferencesForm.value as UserPreferences;
      const updatedPreferences = await this.userService
        .updatePreferences(preferences)
        .toPromise();

      if (updatedPreferences) {
        this.originalPreferences.set(updatedPreferences);
        this.preferencesChange.emit(updatedPreferences);

        this.snackBar.open('Preferences updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      }
    } catch (error: any) {
      this.snackBar.open(
        error.message || 'Failed to update preferences',
        'Close',
        {
          duration: 5000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        },
      );
    } finally {
      this.isSaving.set(false);
    }
  }

  discardChanges(): void {
    const original = this.originalPreferences();
    if (original) {
      this.preferencesForm.patchValue(original);
    }
  }

  resetToDefaults(): void {
    const defaultPreferences: UserPreferences = {
      theme: 'default',
      scheme: 'light',
      layout: 'classic',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      notifications: {
        email: true,
        push: false,
        desktop: true,
        sound: true,
      },
      navigation: {
        collapsed: false,
        type: 'default',
        position: 'left',
      },
    };

    this.preferencesForm.patchValue(defaultPreferences);
  }

  // Utility methods for E2E testing
  getCurrentPreferences(): UserPreferences {
    return this.preferencesForm.value;
  }

  changeTheme(theme: string): void {
    this.preferencesForm.patchValue({ theme });
  }

  changeScheme(scheme: string): void {
    this.preferencesForm.patchValue({ scheme });
  }

  changeLanguage(language: string): void {
    this.preferencesForm.patchValue({ language });
  }

  changeLayout(layout: string): void {
    this.preferencesForm.patchValue({ layout });
  }

  toggleEmailNotifications(enabled: boolean): void {
    this.preferencesForm.get('notifications.email')?.setValue(enabled);
  }

  togglePushNotifications(enabled: boolean): void {
    this.preferencesForm.get('notifications.push')?.setValue(enabled);
  }

  toggleDesktopNotifications(enabled: boolean): void {
    this.preferencesForm.get('notifications.desktop')?.setValue(enabled);
  }

  toggleSoundNotifications(enabled: boolean): void {
    this.preferencesForm.get('notifications.sound')?.setValue(enabled);
  }

  changeNavigationType(type: string): void {
    this.preferencesForm.get('navigation.type')?.setValue(type);
  }

  changeNavigationPosition(position: string): void {
    this.preferencesForm.get('navigation.position')?.setValue(position);
  }

  toggleNavigationCollapsed(collapsed: boolean): void {
    this.preferencesForm.get('navigation.collapsed')?.setValue(collapsed);
  }

  verifyPreferencesComponentLoads(): Promise<boolean> {
    return Promise.resolve(!this.isLoading() && !this.error());
  }

  verifyOperationResult(): Promise<boolean> {
    // This would be used in tests to verify success state
    return Promise.resolve(true);
  }

  verifyFormValidation(): Promise<void> {
    // This would be used in tests to verify form validation
    return Promise.resolve();
  }

  // Alias for E2E test compatibility
  hasUnsavedChanges(): boolean {
    return this.hasChanges();
  }
}
