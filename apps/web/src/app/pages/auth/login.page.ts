import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatCardModule,
  ],
  template: `
    <div
      class="auth-container"
      style="background-color: var(--ax-background-muted);"
    >
      <div class="auth-wrapper">
        <!-- Logo and Header -->
        <div class="auth-header">
          <div class="auth-logo-circle">
            <mat-icon class="auth-logo-icon">shield</mat-icon>
          </div>
          <h1 class="auth-title" style="color: var(--ax-text-heading);">
            Welcome back
          </h1>
          <p class="auth-subtitle" style="color: var(--ax-text-secondary);">
            Sign in to your AegisX account
          </p>
        </div>

        <!-- Login Form Card -->
        <mat-card appearance="outlined" class="auth-card">
          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <!-- Error Alert -->
              @if (errorMessage()) {
                <div
                  class="auth-alert auth-alert-error"
                  role="alert"
                  aria-live="polite"
                >
                  <div class="auth-alert-icon">
                    <mat-icon>error</mat-icon>
                  </div>
                  <div class="auth-alert-content">
                    <p class="auth-alert-message">{{ errorMessage() }}</p>
                  </div>
                </div>
              }

              <!-- Email Field -->
              <mat-form-field appearance="outline" class="auth-field">
                <mat-label>Email</mat-label>
                <input
                  matInput
                  type="email"
                  formControlName="email"
                  placeholder="name@company.com"
                  autocomplete="email"
                  required
                />
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                  Please enter a valid email address
                </mat-error>
              </mat-form-field>

              <!-- Password Field -->
              <mat-form-field appearance="outline" class="auth-field">
                <mat-label>Password</mat-label>
                <input
                  matInput
                  [type]="hidePassword() ? 'password' : 'text'"
                  formControlName="password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  required
                />
                <button
                  mat-icon-button
                  matSuffix
                  type="button"
                  (click)="togglePasswordVisibility()"
                  [attr.aria-label]="
                    hidePassword() ? 'Show password' : 'Hide password'
                  "
                >
                  <mat-icon>{{
                    hidePassword() ? 'visibility' : 'visibility_off'
                  }}</mat-icon>
                </button>
                <mat-error
                  *ngIf="loginForm.get('password')?.hasError('required')"
                >
                  Password is required
                </mat-error>
                <mat-error
                  *ngIf="loginForm.get('password')?.hasError('minlength')"
                >
                  Password must be at least 6 characters
                </mat-error>
              </mat-form-field>

              <!-- Remember Me & Forgot Password -->
              <div class="auth-options">
                <mat-checkbox formControlName="rememberMe" color="primary">
                  Remember me
                </mat-checkbox>
                <a
                  routerLink="/forgot-password"
                  class="auth-link"
                  style="color: var(--ax-brand-default);"
                >
                  Forgot password?
                </a>
              </div>

              <!-- Submit Button -->
              <button
                mat-flat-button
                color="primary"
                type="submit"
                class="auth-submit-btn"
                [disabled]="loginForm.invalid || isLoading()"
              >
                @if (isLoading()) {
                  <span class="auth-btn-loading">
                    <mat-spinner diameter="20"></mat-spinner>
                    <span>Signing in...</span>
                  </span>
                } @else {
                  Sign in
                }
              </button>

              <!-- Divider -->
              <div class="auth-divider">
                <span style="color: var(--ax-text-subtle);"
                  >Don't have an account?</span
                >
              </div>

              <!-- Sign Up Link -->
              <div class="auth-footer-link">
                <a
                  routerLink="/register"
                  class="auth-link"
                  style="color: var(--ax-brand-default);"
                >
                  Create an account
                </a>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Demo Credentials (Development Only) -->
        @if (isDevelopment()) {
          <mat-card appearance="outlined" class="auth-demo-card">
            <mat-card-content>
              <div class="auth-demo-header">
                <div class="auth-demo-header-icon">
                  <mat-icon>info</mat-icon>
                </div>
                <h4>Quick Login (Dev Only)</h4>
              </div>
              <div class="auth-demo-buttons">
                <!-- Admin Button -->
                <div
                  class="auth-demo-btn"
                  (click)="fillDemoCredentials('admin')"
                >
                  <div class="auth-demo-btn-icon auth-demo-icon-purple">
                    <mat-icon>admin_panel_settings</mat-icon>
                  </div>
                  <div class="auth-demo-btn-content">
                    <div class="auth-demo-btn-title">Admin Account</div>
                    <div class="auth-demo-btn-subtitle">
                      admin&#64;aegisx.local
                    </div>
                  </div>
                  <mat-icon class="auth-demo-btn-arrow">arrow_forward</mat-icon>
                </div>

                <!-- Manager Button -->
                <div
                  class="auth-demo-btn"
                  (click)="fillDemoCredentials('manager')"
                >
                  <div class="auth-demo-btn-icon auth-demo-icon-blue">
                    <mat-icon>manage_accounts</mat-icon>
                  </div>
                  <div class="auth-demo-btn-content">
                    <div class="auth-demo-btn-title">Manager Account</div>
                    <div class="auth-demo-btn-subtitle">
                      manager&#64;aegisx.local
                    </div>
                  </div>
                  <mat-icon class="auth-demo-btn-arrow">arrow_forward</mat-icon>
                </div>

                <!-- Demo Button -->
                <div
                  class="auth-demo-btn"
                  (click)="fillDemoCredentials('demo')"
                >
                  <div class="auth-demo-btn-icon auth-demo-icon-green">
                    <mat-icon>person</mat-icon>
                  </div>
                  <div class="auth-demo-btn-content">
                    <div class="auth-demo-btn-title">Demo Account</div>
                    <div class="auth-demo-btn-subtitle">
                      demo&#64;aegisx.local
                    </div>
                  </div>
                  <mat-icon class="auth-demo-btn-arrow">arrow_forward</mat-icon>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [
    `
      /* ============================================
       AUTH PAGE STYLES - USING AEGISX TOKENS
       ============================================ */

      .auth-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: var(--ax-spacing-2xl) var(--ax-spacing-md);
      }

      .auth-wrapper {
        width: 100%;
        max-width: 450px;
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-lg);
      }

      /* Fix mat-card-content padding */
      ::ng-deep .auth-card .mat-mdc-card-content {
        padding: var(--ax-spacing-2xl) !important;
      }

      /* Header */
      .auth-header {
        text-align: center;
      }

      .auth-logo-circle {
        margin: 0 auto var(--ax-spacing-lg);
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--ax-radius-2xl);
        background: linear-gradient(
          135deg,
          var(--ax-brand-default),
          var(--ax-brand-emphasis)
        );
        box-shadow: var(--ax-shadow-lg);
      }

      .auth-logo-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: white;
      }

      .auth-title {
        margin: 0 0 var(--ax-spacing-sm);
        font-size: var(--ax-text-3xl);
        font-weight: var(--ax-font-bold);
        letter-spacing: -0.025em;
      }

      .auth-subtitle {
        margin: 0;
        font-size: var(--ax-text-sm);
      }

      /* Card */
      .auth-card {
        background-color: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-xl);
        box-shadow: var(--ax-shadow-sm);
      }

      /* Alert */
      .auth-alert {
        display: flex;
        align-items: flex-start;
        gap: var(--ax-spacing-sm);
        padding: var(--ax-spacing-md);
        margin-bottom: var(--ax-spacing-lg);
        border-radius: var(--ax-radius-lg);
        border: 1px solid;
      }

      .auth-alert-error {
        background-color: var(--ax-error-surface);
        border-color: var(--ax-error-border);
      }

      .auth-alert-icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--ax-radius-full);
        background-color: var(--ax-error-muted);
      }

      .auth-alert-icon mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: var(--ax-error-default);
      }

      .auth-alert-content {
        flex: 1;
      }

      .auth-alert-message {
        margin: 0;
        font-size: var(--ax-text-sm);
        font-weight: var(--ax-font-medium);
        color: var(--ax-error-emphasis);
      }

      /* Form Field */
      .auth-field {
        width: 100%;
        margin-bottom: var(--ax-spacing-md);
      }

      /* Options Row */
      .auth-options {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--ax-spacing-lg);
      }

      .auth-link {
        font-size: var(--ax-text-sm);
        font-weight: var(--ax-font-medium);
        text-decoration: none;
        transition: opacity var(--ax-transition-fast);
      }

      .auth-link:hover {
        opacity: var(--ax-opacity-hover);
      }

      /* Submit Button */
      .auth-submit-btn {
        width: 100%;
        height: 44px;
        font-size: var(--ax-text-sm);
        font-weight: var(--ax-font-semibold);
        margin-bottom: var(--ax-spacing-lg);
      }

      .auth-btn-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--ax-spacing-sm);
      }

      /* Divider */
      .auth-divider {
        position: relative;
        text-align: center;
        margin: var(--ax-spacing-lg) 0;
      }

      .auth-divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background-color: var(--ax-border-default);
        z-index: 0;
      }

      .auth-divider span {
        position: relative;
        display: inline-block;
        padding: 0 var(--ax-spacing-sm);
        background-color: var(--ax-background-default);
        font-size: var(--ax-text-xs);
        z-index: 1;
      }

      /* Footer Link */
      .auth-footer-link {
        text-align: center;
      }

      /* Demo Card */
      .auth-demo-card {
        background-color: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-xl);
        box-shadow: var(--ax-shadow-sm);
      }

      .auth-demo-header {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm);
        margin-bottom: var(--ax-spacing-lg);
        padding-bottom: var(--ax-spacing-md);
        border-bottom: 1px solid var(--ax-border-default);
      }

      .auth-demo-header-icon {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--ax-radius-lg);
        background-color: var(--ax-info-surface);
      }

      .auth-demo-header-icon mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: var(--ax-info-default);
      }

      .auth-demo-header h4 {
        margin: 0;
        font-size: var(--ax-text-base);
        font-weight: var(--ax-font-semibold);
        color: var(--ax-text-heading);
      }

      .auth-demo-buttons {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-md);
      }

      .auth-demo-btn {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-md);
        padding: var(--ax-spacing-md);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        background-color: var(--ax-background-default);
        cursor: pointer;
        transition: all var(--ax-transition-base);
      }

      .auth-demo-btn:hover {
        border-color: var(--ax-brand-default);
        background-color: var(--ax-background-subtle);
        transform: translateX(4px);
      }

      .auth-demo-btn-icon {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--ax-radius-lg);
      }

      .auth-demo-icon-purple {
        background: linear-gradient(
          135deg,
          var(--ax-purple-default),
          var(--ax-purple-emphasis)
        );
      }

      .auth-demo-icon-blue {
        background: linear-gradient(
          135deg,
          var(--ax-brand-default),
          var(--ax-brand-emphasis)
        );
      }

      .auth-demo-icon-green {
        background: linear-gradient(
          135deg,
          var(--ax-success-default),
          var(--ax-success-emphasis)
        );
      }

      .auth-demo-btn-icon mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: white;
      }

      .auth-demo-btn-content {
        flex: 1;
        min-width: 0;
      }

      .auth-demo-btn-title {
        font-size: var(--ax-text-base);
        font-weight: var(--ax-font-semibold);
        color: var(--ax-text-heading);
        margin-bottom: var(--ax-spacing-xs);
        line-height: 1.2;
      }

      .auth-demo-btn-subtitle {
        font-size: var(--ax-text-sm);
        color: var(--ax-text-subtle);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .auth-demo-btn-arrow {
        flex-shrink: 0;
        margin-left: auto;
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: var(--ax-text-subtle);
        transition: all var(--ax-transition-fast);
      }

      .auth-demo-btn:hover .auth-demo-btn-arrow {
        color: var(--ax-brand-default);
        transform: translateX(4px);
      }

      /* Material Overrides */
      ::ng-deep .mat-mdc-form-field {
        --mdc-outlined-text-field-container-shape: var(--ax-radius-lg);
        --mat-form-field-container-text-size: var(--ax-text-sm);
      }

      ::ng-deep .mat-mdc-progress-spinner {
        --mdc-circular-progress-active-indicator-color: currentColor;
      }
    `,
  ],
})
export class LoginPage {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals for reactive state
  protected isLoading = signal<boolean>(false);
  protected errorMessage = signal<string>('');
  protected hidePassword = signal<boolean>(true);
  protected isDevelopment = signal<boolean>(!this.isProduction());

  // Reactive form
  protected loginForm: FormGroup;

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    // Load remembered email if exists
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.loginForm.patchValue({
        email: rememberedEmail,
        rememberMe: true,
      });
      this.loginForm.get('email')?.markAsUntouched();
    }
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password, rememberMe } = this.loginForm.value;

    // Handle remember me
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Navigation is handled by AuthService
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.message || 'Login failed. Please try again.',
        );
      },
    });
  }

  protected togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  protected fillDemoCredentials(type: 'admin' | 'manager' | 'demo'): void {
    const credentials = {
      admin: {
        email: 'admin@aegisx.local',
        password: 'Admin123!',
      },
      manager: {
        email: 'manager@aegisx.local',
        password: 'Manager123!',
      },
      demo: {
        email: 'demo@aegisx.local',
        password: 'Demo123!',
      },
    };

    const { email, password } = credentials[type];

    this.loginForm.patchValue({
      email,
      password,
      rememberMe: false,
    });

    this.loginForm.get('email')?.markAsTouched();
    this.loginForm.get('password')?.markAsTouched();
  }

  private isProduction(): boolean {
    return (
      window.location.hostname === 'aegisx.com' ||
      window.location.hostname === 'www.aegisx.com' ||
      localStorage.getItem('environment') === 'production'
    );
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
