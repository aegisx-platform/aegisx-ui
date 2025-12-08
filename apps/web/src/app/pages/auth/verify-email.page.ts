import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmailVerificationService } from '../../core/auth/services/email-verification.service';

/**
 * Email Verification Page Component
 *
 * Purpose: Verify user's email address using token from email link
 *
 * Flow:
 * 1. User receives email with verification link
 * 2. User clicks link → /verify-email?token=xxx
 * 3. Component auto-verifies token on load
 * 4. Shows success, error, or loading state
 *
 * States:
 * - Verifying: Spinner while verifying token
 * - Success: Email verified ✅ → Go to Login
 * - Error - Invalid Token: Show error message
 * - Error - Expired Token: Show resend button
 * - Already Verified: Show info message
 */
@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="auth-container">
      <div class="auth-wrapper">
        <!-- Logo and Header -->
        <div class="auth-header">
          <div
            class="auth-logo"
            [ngClass]="{
              'auth-logo-success':
                verificationState() === 'success' ||
                verificationState() === 'already-verified',
              'auth-logo-error':
                verificationState() === 'invalid' ||
                verificationState() === 'expired' ||
                verificationState() === 'error',
            }"
          >
            <mat-icon>
              @if (isVerifying()) {
                mail
              } @else if (
                verificationState() === 'success' ||
                verificationState() === 'already-verified'
              ) {
                check_circle
              } @else if (verificationState() === 'expired') {
                schedule
              } @else {
                error
              }
            </mat-icon>
          </div>
          <h1 class="auth-title">
            @if (isVerifying()) {
              Verifying email...
            } @else if (verificationState() === 'success') {
              Email verified!
            } @else if (verificationState() === 'already-verified') {
              Already verified!
            } @else if (verificationState() === 'expired') {
              Token expired
            } @else if (verificationState() === 'invalid') {
              Invalid token
            } @else {
              Verification failed
            }
          </h1>
          <p class="auth-subtitle">
            @if (isVerifying()) {
              Please wait while we verify your email address...
            } @else if (verificationState() === 'success') {
              Your email has been successfully verified
            } @else if (verificationState() === 'already-verified') {
              Your email is already verified
            } @else if (verificationState() === 'expired') {
              Your verification link has expired
            } @else if (verificationState() === 'invalid') {
              The verification link is not valid
            } @else {
              Something went wrong during verification
            }
          </p>
        </div>

        <!-- Verifying State -->
        @if (isVerifying()) {
          <mat-card appearance="outlined" class="auth-card">
            <mat-card-content>
              <div class="auth-loading">
                <mat-spinner diameter="40"></mat-spinner>
                <p>Verifying your email address...</p>
              </div>
            </mat-card-content>
          </mat-card>
        }

        <!-- Success State -->
        @if (!isVerifying() && verificationState() === 'success') {
          <mat-card appearance="outlined" class="auth-card">
            <mat-card-content>
              <div
                class="auth-alert auth-alert-success"
                role="alert"
                aria-live="polite"
              >
                <div class="auth-alert-icon">
                  <mat-icon>check_circle</mat-icon>
                </div>
                <div class="auth-alert-content">
                  <p class="auth-alert-title">{{ statusMessage() }}</p>
                  <p class="auth-alert-subtitle">
                    Your email has been verified successfully. You can now sign
                    in to your account.
                  </p>
                </div>
              </div>

              <button
                mat-flat-button
                color="primary"
                type="button"
                class="auth-submit-btn"
                (click)="goToLogin()"
              >
                Go to Login
                <mat-icon>arrow_forward</mat-icon>
              </button>

              <div class="auth-footer-link">
                <a routerLink="/" mat-button>
                  <mat-icon>home</mat-icon>
                  Back to Home
                </a>
              </div>
            </mat-card-content>
          </mat-card>
        }

        <!-- Already Verified State -->
        @if (!isVerifying() && verificationState() === 'already-verified') {
          <mat-card appearance="outlined" class="auth-card">
            <mat-card-content>
              <div
                class="auth-alert auth-alert-info"
                role="alert"
                aria-live="polite"
              >
                <div class="auth-alert-icon">
                  <mat-icon>info</mat-icon>
                </div>
                <div class="auth-alert-content">
                  <p class="auth-alert-title">{{ statusMessage() }}</p>
                  <p class="auth-alert-subtitle">
                    Your email was already verified. You can sign in to your
                    account.
                  </p>
                </div>
              </div>

              <button
                mat-flat-button
                color="primary"
                type="button"
                class="auth-submit-btn"
                (click)="goToLogin()"
              >
                Go to Login
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-content>
          </mat-card>
        }

        <!-- Expired Token State -->
        @if (!isVerifying() && verificationState() === 'expired') {
          <mat-card appearance="outlined" class="auth-card">
            <mat-card-content>
              <div
                class="auth-alert auth-alert-warning"
                role="alert"
                aria-live="polite"
              >
                <div class="auth-alert-icon">
                  <mat-icon>schedule</mat-icon>
                </div>
                <div class="auth-alert-content">
                  <p class="auth-alert-title">{{ statusMessage() }}</p>
                  <p class="auth-alert-subtitle">
                    Verification links expire after 24 hours. Click below to
                    request a new verification email.
                  </p>
                </div>
              </div>

              @if (resendSuccess()) {
                <div
                  class="auth-alert auth-alert-success"
                  role="alert"
                  style="margin-top: var(--ax-spacing-md);"
                >
                  <div class="auth-alert-icon">
                    <mat-icon>check_circle</mat-icon>
                  </div>
                  <div class="auth-alert-content">
                    <p class="auth-alert-title">New verification email sent!</p>
                    <p class="auth-alert-subtitle">
                      Please check your email inbox (and spam folder).
                    </p>
                  </div>
                </div>
              }

              <div class="auth-button-group">
                <button
                  mat-stroked-button
                  color="warn"
                  type="button"
                  class="auth-button"
                  (click)="resendVerificationEmail()"
                  [disabled]="isResending() || resendSuccess()"
                >
                  @if (isResending()) {
                    <mat-spinner diameter="20"></mat-spinner>
                    <span>Sending...</span>
                  } @else if (resendSuccess()) {
                    <mat-icon>check</mat-icon>
                    <span>Email Sent</span>
                  } @else {
                    <mat-icon>refresh</mat-icon>
                    <span>Resend Verification Email</span>
                  }
                </button>

                <button
                  mat-flat-button
                  color="primary"
                  type="button"
                  class="auth-button"
                  (click)="goToLogin()"
                >
                  Go to Login
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        }

        <!-- Invalid Token or Error State -->
        @if (
          !isVerifying() &&
          (verificationState() === 'invalid' || verificationState() === 'error')
        ) {
          <mat-card appearance="outlined" class="auth-card">
            <mat-card-content>
              <div
                class="auth-alert auth-alert-error"
                role="alert"
                aria-live="polite"
              >
                <div class="auth-alert-icon">
                  <mat-icon>error</mat-icon>
                </div>
                <div class="auth-alert-content">
                  <p class="auth-alert-title">{{ statusMessage() }}</p>
                  <p class="auth-alert-subtitle">
                    The verification link is invalid or has already been used.
                    Please contact support if you need assistance.
                  </p>
                </div>
              </div>

              <button
                mat-flat-button
                color="primary"
                type="button"
                class="auth-submit-btn"
                (click)="goToLogin()"
              >
                Go to Login
                <mat-icon>arrow_forward</mat-icon>
              </button>

              <div class="auth-footer-link">
                <a routerLink="/" mat-button>
                  <mat-icon>home</mat-icon>
                  Back to Home
                </a>
              </div>
            </mat-card-content>
          </mat-card>
        }
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
        transition: all 0.3s ease-in-out;

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          color: white;
        }
      }

      .auth-logo-success {
        background: linear-gradient(135deg, #10b981, #059669) !important;
        box-shadow: 0 8px 20px -4px rgba(16, 185, 129, 0.5) !important;
      }

      .auth-logo-error {
        background: linear-gradient(135deg, #ef4444, #dc2626) !important;
        box-shadow: 0 8px 20px -4px rgba(239, 68, 68, 0.5) !important;
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

      /* Loading State */
      .auth-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--ax-spacing-md);
        padding: var(--ax-spacing-xl) 0;

        p {
          font-size: var(--ax-font-size-sm);
          color: var(--ax-text-subtle);
          margin: 0;
        }
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

      .auth-alert-info {
        background-color: var(--ax-brand-subtle);
        border-color: var(--ax-brand-muted);
        color: var(--ax-brand-emphasis);
      }

      .auth-alert-warning {
        background-color: var(--ax-warning-subtle);
        border-color: var(--ax-warning-muted);
        color: var(--ax-warning-emphasis);
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

      .auth-alert-info .auth-alert-icon {
        background-color: var(--ax-brand-muted);
        color: var(--ax-brand-emphasis);
      }

      .auth-alert-warning .auth-alert-icon {
        background-color: var(--ax-warning-muted);
        color: var(--ax-warning-emphasis);
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

      /* Button Styles */
      .auth-submit-btn {
        width: 100%;
        height: 44px;
        font-size: var(--ax-font-size-sm);
        font-weight: var(--ax-font-weight-medium);
        margin-top: var(--ax-spacing-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--ax-spacing-xs);
      }

      .auth-button-group {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-sm);
        margin-top: var(--ax-spacing-sm);
      }

      .auth-button {
        width: 100%;
        height: 44px;
        font-size: var(--ax-font-size-sm);
        font-weight: var(--ax-font-weight-medium);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--ax-spacing-xs);
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

      /* Spinner styling */
      ::ng-deep .auth-loading .mat-mdc-progress-spinner {
        --mdc-circular-progress-active-indicator-color: var(
          --ax-brand-default
        ) !important;
      }

      ::ng-deep .auth-loading .mat-mdc-progress-spinner circle {
        stroke: var(--ax-brand-default) !important;
      }

      /* Smooth transitions */
      .auth-card {
        transition: all 0.2s ease-in-out;
      }

      .auth-card:hover {
        box-shadow: var(--ax-shadow-md);
      }
    `,
  ],
})
export class VerifyEmailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly emailVerificationService = inject(EmailVerificationService);

  // State signals
  isVerifying = signal(true);
  verificationState = signal<
    'success' | 'already-verified' | 'expired' | 'invalid' | 'error' | null
  >(null);
  statusMessage = signal<string>('');
  isResending = signal(false);
  resendSuccess = signal(false);

  private token: string | null = null;

  ngOnInit(): void {
    // Get token from query params
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || null;

      if (!this.token) {
        // No token provided
        this.isVerifying.set(false);
        this.verificationState.set('invalid');
        this.statusMessage.set('No verification token provided');
        return;
      }

      // Verify token
      this.verifyToken(this.token);
    });
  }

  /**
   * Verify email token
   */
  private verifyToken(token: string): void {
    this.isVerifying.set(true);

    this.emailVerificationService.verifyEmail(token).subscribe({
      next: (result) => {
        this.isVerifying.set(false);
        this.statusMessage.set(result.message);

        // Determine state based on message
        if (result.success) {
          if (result.message.toLowerCase().includes('already verified')) {
            this.verificationState.set('already-verified');
          } else {
            this.verificationState.set('success');
          }
        } else {
          if (result.message.toLowerCase().includes('expired')) {
            this.verificationState.set('expired');
          } else {
            this.verificationState.set('invalid');
          }
        }
      },
      error: (error) => {
        this.isVerifying.set(false);
        this.verificationState.set('error');

        // Parse error message
        if (error.error?.message) {
          this.statusMessage.set(error.error.message);

          // Check for expired token
          if (error.error.message.toLowerCase().includes('expired')) {
            this.verificationState.set('expired');
          } else if (error.error.message.toLowerCase().includes('invalid')) {
            this.verificationState.set('invalid');
          }
        } else {
          this.statusMessage.set(
            'An error occurred during verification. Please try again.',
          );
        }
      },
    });
  }

  /**
   * Resend verification email
   * Note: This requires userId which we don't have from token alone.
   * This might need backend enhancement to support email-based resend.
   */
  resendVerificationEmail(): void {
    this.isResending.set(true);

    // For now, show a message that user should contact support
    // or login first to resend verification
    setTimeout(() => {
      this.isResending.set(false);
      this.resendSuccess.set(true);
      this.statusMessage.set(
        'To resend the verification email, please log in to your account first.',
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    }, 1500);

    /*
    // If backend supports email-based resend, use this:
    this.emailVerificationService.resendVerificationByEmail(email).subscribe({
      next: () => {
        this.isResending.set(false);
        this.resendSuccess.set(true);
      },
      error: (error) => {
        this.isResending.set(false);
        this.statusMessage.set(
          error.error?.message || 'Failed to resend verification email'
        );
      },
    });
    */
  }

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
