import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { PasswordResetService } from '../../core/auth/services/password-reset.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="auth-container">
      <div class="auth-wrapper">
        <!-- Logo and Header -->
        <div class="auth-header">
          <div class="auth-logo">
            <mat-icon>lock_reset</mat-icon>
          </div>
          <h1 class="auth-title">Reset your password</h1>
          <p class="auth-subtitle">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <!-- Form Card -->
        <mat-card class="auth-card">
          <mat-card-content>
            <!-- Success Message -->
            @if (successMessage()) {
              <div
                class="auth-alert auth-alert-success"
                role="alert"
                aria-live="polite"
              >
                <div class="auth-alert-icon">
                  <mat-icon>check_circle</mat-icon>
                </div>
                <div class="auth-alert-content">
                  <p class="auth-alert-title">{{ successMessage() }}</p>
                  <p class="auth-alert-subtitle">
                    Please check your email inbox (and spam folder) for the
                    reset link.
                  </p>
                </div>
              </div>
            }

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
                  <p class="auth-alert-title">{{ errorMessage() }}</p>
                </div>
              </div>
            }

            <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
              <!-- Email Field -->
              <mat-form-field appearance="outline" class="auth-field">
                <mat-label>Email address</mat-label>
                <input
                  matInput
                  type="email"
                  formControlName="email"
                  placeholder="name@company.com"
                  autocomplete="email"
                  required
                />
                <mat-error
                  *ngIf="forgotPasswordForm.get('email')?.hasError('required')"
                >
                  Email is required
                </mat-error>
                <mat-error
                  *ngIf="forgotPasswordForm.get('email')?.hasError('email')"
                >
                  Please enter a valid email address
                </mat-error>
              </mat-form-field>

              <!-- Submit Button -->
              <button
                mat-flat-button
                color="primary"
                type="submit"
                class="auth-submit-btn"
                [disabled]="forgotPasswordForm.invalid || isLoading()"
              >
                @if (isLoading()) {
                  <span class="auth-btn-loading">
                    <mat-spinner diameter="20"></mat-spinner>
                    <span>Sending reset link...</span>
                  </span>
                } @else {
                  Send reset link
                }
              </button>

              <!-- Back to Login Link -->
              <div class="auth-footer-link">
                <a routerLink="/login" mat-button color="primary">
                  <mat-icon>arrow_back</mat-icon>
                  Back to login
                </a>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Info Card -->
        <mat-card class="auth-info-card">
          <mat-card-content>
            <div class="auth-info-header">
              <div class="auth-info-icon">
                <mat-icon>info</mat-icon>
              </div>
              <h4>Password Reset Information</h4>
            </div>
            <ul class="auth-info-list">
              <li>
                <mat-icon>check_circle</mat-icon>
                <span>Reset link expires in 1 hour</span>
              </li>
              <li>
                <mat-icon>check_circle</mat-icon>
                <span>Check spam folder if not received</span>
              </li>
              <li>
                <mat-icon>check_circle</mat-icon>
                <span>Limited to 3 requests per hour for security</span>
              </li>
            </ul>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: var(--ax-spacing-2xl) var(--ax-spacing-md);
        background-color: var(--ax-background-muted);
      }

      .auth-wrapper {
        width: 100%;
        max-width: 480px;
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-lg);
      }

      /* Header Styles */
      .auth-header {
        text-align: center;
      }

      .auth-logo {
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
        box-shadow: 0 8px 20px -4px var(--ax-brand-muted);

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          color: var(--ax-text-inverse);
        }
      }

      .auth-title {
        font-size: var(--ax-font-size-2xl);
        font-weight: var(--ax-font-weight-bold);
        color: var(--ax-text-heading);
        margin: 0 0 var(--ax-spacing-sm);
        letter-spacing: -0.02em;
      }

      .auth-subtitle {
        font-size: var(--ax-font-size-sm);
        color: var(--ax-text-subtle);
        margin: 0;
      }

      /* Card Styles */
      .auth-card {
        background-color: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        box-shadow: var(--ax-shadow-sm);
      }

      ::ng-deep .auth-card .mat-mdc-card-content {
        padding: var(--ax-spacing-2xl) !important;
      }

      /* Alert Styles */
      .auth-alert {
        display: flex;
        align-items: flex-start;
        gap: var(--ax-spacing-md);
        padding: var(--ax-spacing-md);
        border-radius: var(--ax-radius-lg);
        margin-bottom: var(--ax-spacing-lg);
        border: 1px solid;
      }

      .auth-alert-success {
        background-color: var(--ax-success-subtle);
        border-color: var(--ax-success-muted);
        color: var(--ax-success-emphasis);
      }

      .auth-alert-error {
        background-color: var(--ax-error-subtle);
        border-color: var(--ax-error-muted);
        color: var(--ax-error-emphasis);
      }

      .auth-alert-icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }

      .auth-alert-success .auth-alert-icon {
        background-color: var(--ax-success-muted);
        color: var(--ax-success-emphasis);
      }

      .auth-alert-error .auth-alert-icon {
        background-color: var(--ax-error-muted);
        color: var(--ax-error-emphasis);
      }

      .auth-alert-content {
        flex: 1;
      }

      .auth-alert-title {
        font-size: var(--ax-font-size-sm);
        font-weight: var(--ax-font-weight-medium);
        margin: 0 0 var(--ax-spacing-xs);
      }

      .auth-alert-subtitle {
        font-size: var(--ax-font-size-xs);
        margin: 0;
        opacity: 0.9;
      }

      /* Form Field Styles */
      .auth-field {
        width: 100%;
        margin-bottom: var(--ax-spacing-lg);
      }

      /* Submit Button */
      .auth-submit-btn {
        width: 100%;
        height: 44px;
        font-size: var(--ax-font-size-sm);
        font-weight: var(--ax-font-weight-medium);
        margin-top: var(--ax-spacing-sm);
      }

      .auth-btn-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--ax-spacing-sm);
      }

      /* Footer Link */
      .auth-footer-link {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: var(--ax-spacing-lg);
      }

      .auth-footer-link a {
        display: inline-flex;
        align-items: center;
        gap: var(--ax-spacing-xs);
      }

      /* Info Card Styles */
      .auth-info-card {
        background-color: var(--ax-background-default);
        border: 1px solid var(--ax-brand-muted);
        box-shadow: var(--ax-shadow-sm);
      }

      ::ng-deep .auth-info-card .mat-mdc-card-content {
        padding: var(--ax-spacing-lg) !important;
      }

      .auth-info-header {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-md);
        margin-bottom: var(--ax-spacing-md);
      }

      .auth-info-icon {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--ax-radius-lg);
        background-color: var(--ax-brand-subtle);

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
          color: var(--ax-brand-emphasis);
        }
      }

      .auth-info-header h4 {
        font-size: var(--ax-font-size-sm);
        font-weight: var(--ax-font-weight-semibold);
        color: var(--ax-text-heading);
        margin: 0;
      }

      .auth-info-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-sm);
      }

      .auth-info-list li {
        display: flex;
        align-items: flex-start;
        gap: var(--ax-spacing-sm);
        font-size: var(--ax-font-size-xs);
        color: var(--ax-text-default);

        mat-icon {
          flex-shrink: 0;
          font-size: 14px;
          width: 14px;
          height: 14px;
          margin-top: 2px;
          color: var(--ax-brand-default);
        }

        span {
          flex: 1;
        }
      }

      /* Spinner styling */
      ::ng-deep .auth-btn-loading .mat-mdc-progress-spinner {
        --mdc-circular-progress-active-indicator-color: currentColor !important;
      }

      ::ng-deep .auth-btn-loading .mat-mdc-progress-spinner circle {
        stroke: currentColor !important;
      }

      /* Smooth transitions */
      .auth-card,
      .auth-info-card {
        transition: all 0.2s ease-in-out;
      }

      .auth-card:hover,
      .auth-info-card:hover {
        box-shadow: var(--ax-shadow-md);
      }
    `,
  ],
})
export class ForgotPasswordPage {
  private formBuilder = inject(FormBuilder);
  private passwordResetService = inject(PasswordResetService);

  // Signals for reactive state
  protected isLoading = signal<boolean>(false);
  protected errorMessage = signal<string>('');
  protected successMessage = signal<string>('');

  // Reactive form
  protected forgotPasswordForm: FormGroup;

  constructor() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  protected onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { email } = this.forgotPasswordForm.value;

    this.passwordResetService.requestPasswordReset(email).subscribe({
      next: (message) => {
        this.isLoading.set(false);
        this.successMessage.set(message);
        this.forgotPasswordForm.reset();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.message || 'Failed to send reset link. Please try again.',
        );
      },
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach((key) => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }
}
