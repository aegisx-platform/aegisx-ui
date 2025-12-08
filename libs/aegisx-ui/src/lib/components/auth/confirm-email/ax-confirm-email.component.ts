import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AxLoadingButtonComponent } from '../../loading-button/ax-loading-button.component';

export type ConfirmEmailStatus =
  | 'pending'
  | 'verifying'
  | 'success'
  | 'error'
  | 'expired';

export interface ConfirmEmailConfig {
  pendingTitle?: string;
  pendingMessage?: string;
  verifyingTitle?: string;
  verifyingMessage?: string;
  successTitle?: string;
  successMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  expiredTitle?: string;
  expiredMessage?: string;
  continueButtonText?: string;
  resendButtonText?: string;
  tryAgainButtonText?: string;
}

/**
 * AegisX Confirm Email Component
 *
 * A component for displaying email confirmation status with different states:
 * - pending: Waiting for user to check their email
 * - verifying: Currently verifying the email token
 * - success: Email verified successfully
 * - error: Verification failed
 * - expired: Token has expired
 *
 * @example
 * ```html
 * <ax-confirm-email
 *   [status]="'success'"
 *   (continue)="navigateToDashboard()"
 *   (resendEmail)="onResendVerification()"
 * />
 * ```
 */
@Component({
  selector: 'ax-confirm-email',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AxLoadingButtonComponent,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-header class="centered-header">
        <!-- Icon based on status -->
        <div class="header-icon" [ngClass]="getIconClass()">
          @switch (status) {
            @case ('pending') {
              <mat-icon>mark_email_unread</mat-icon>
            }
            @case ('verifying') {
              <mat-spinner diameter="32"></mat-spinner>
            }
            @case ('success') {
              <mat-icon>verified</mat-icon>
            }
            @case ('error') {
              <mat-icon>error_outline</mat-icon>
            }
            @case ('expired') {
              <mat-icon>timer_off</mat-icon>
            }
          }
        </div>

        <mat-card-title>{{ getTitle() }}</mat-card-title>
        <mat-card-subtitle>{{ getMessage() }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        @switch (status) {
          @case ('pending') {
            <div class="email-display">
              @if (email) {
                <span>{{ email }}</span>
              }
            </div>

            <ax-loading-button
              [loading]="resendLoading"
              loadingText="Sending..."
              icon="refresh"
              iconPosition="start"
              [fullWidth]="true"
              (buttonClick)="onResendClick()"
            >
              {{ config.resendButtonText }}
            </ax-loading-button>
          }

          @case ('verifying') {
            <p class="note-text">Please wait while we verify your email...</p>
          }

          @case ('success') {
            <ax-loading-button
              [loading]="false"
              icon="arrow_forward"
              iconPosition="end"
              [fullWidth]="true"
              (buttonClick)="onContinueClick()"
            >
              {{ config.continueButtonText }}
            </ax-loading-button>
          }

          @case ('error') {
            <ax-loading-button
              [loading]="false"
              icon="refresh"
              iconPosition="start"
              [fullWidth]="true"
              (buttonClick)="onTryAgainClick()"
            >
              {{ config.tryAgainButtonText }}
            </ax-loading-button>
          }

          @case ('expired') {
            <ax-loading-button
              [loading]="resendLoading"
              loadingText="Sending..."
              icon="send"
              iconPosition="start"
              [fullWidth]="true"
              (buttonClick)="onResendClick()"
            >
              {{ config.resendButtonText }}
            </ax-loading-button>
          }
        }
      </mat-card-content>

      @if (status !== 'verifying') {
        <mat-card-footer>
          <button mat-button type="button" (click)="onBackToLoginClick()">
            <mat-icon>arrow_back</mat-icon>
            <span>Back to login</span>
          </button>
        </mat-card-footer>
      }
    </mat-card>
  `,
  styles: [
    `
      .centered-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .header-icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;

        mat-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
          color: white;
        }
      }

      .icon-pending {
        background: var(--ax-brand-default);
      }

      .icon-verifying {
        background: var(--ax-background-muted);
      }

      .icon-success {
        background: var(--ax-success-default);
      }

      .icon-error {
        background: var(--ax-error-default);
      }

      .icon-expired {
        background: var(--ax-warning-default);
      }

      .email-display {
        text-align: center;
        margin-bottom: 1rem;
        padding: 1rem;
        background: var(--ax-background-muted);
        border-radius: 8px;
        font-weight: 500;
      }

      .note-text {
        text-align: center;
        color: var(--ax-text-subtle);
        font-size: 0.875rem;
      }

      mat-card-footer {
        display: flex;
        justify-content: center;
        padding: 1rem;
      }
    `,
  ],
})
export class AxConfirmEmailComponent {
  /** Current verification status */
  @Input() status: ConfirmEmailStatus = 'pending';

  /** Email address being verified */
  @Input() email = '';

  /** Loading state for resend button */
  @Input() resendLoading = false;

  /** Component configuration */
  @Input() set config(value: Partial<ConfirmEmailConfig>) {
    this._config = { ...this.defaultConfig, ...value };
  }
  get config(): ConfirmEmailConfig {
    return this._config;
  }

  /** Emits when continue button is clicked (success state) */
  @Output() continue = new EventEmitter<void>();

  /** Emits when resend email button is clicked */
  @Output() resendEmail = new EventEmitter<void>();

  /** Emits when try again button is clicked (error state) */
  @Output() tryAgain = new EventEmitter<void>();

  /** Emits when back to login is clicked */
  @Output() backToLogin = new EventEmitter<void>();

  private defaultConfig: ConfirmEmailConfig = {
    pendingTitle: 'Check your email',
    pendingMessage: "We've sent a verification link to your email address.",
    verifyingTitle: 'Verifying email',
    verifyingMessage: 'Please wait while we verify your email address.',
    successTitle: 'Email verified!',
    successMessage: 'Your email has been successfully verified.',
    errorTitle: 'Verification failed',
    errorMessage: 'We could not verify your email. Please try again.',
    expiredTitle: 'Link expired',
    expiredMessage:
      'This verification link has expired. Please request a new one.',
    continueButtonText: 'Continue to dashboard',
    resendButtonText: 'Resend verification email',
    tryAgainButtonText: 'Try again',
  };

  private _config: ConfirmEmailConfig = this.defaultConfig;

  getTitle(): string {
    switch (this.status) {
      case 'pending':
        return this.config.pendingTitle || '';
      case 'verifying':
        return this.config.verifyingTitle || '';
      case 'success':
        return this.config.successTitle || '';
      case 'error':
        return this.config.errorTitle || '';
      case 'expired':
        return this.config.expiredTitle || '';
      default:
        return '';
    }
  }

  getMessage(): string {
    switch (this.status) {
      case 'pending':
        return this.config.pendingMessage || '';
      case 'verifying':
        return this.config.verifyingMessage || '';
      case 'success':
        return this.config.successMessage || '';
      case 'error':
        return this.config.errorMessage || '';
      case 'expired':
        return this.config.expiredMessage || '';
      default:
        return '';
    }
  }

  getIconClass(): string {
    return `icon-${this.status}`;
  }

  getSubtitleClass(): string {
    switch (this.status) {
      case 'success':
        return 'subtitle-success';
      case 'error':
        return 'subtitle-error';
      case 'expired':
        return 'subtitle-expired';
      default:
        return '';
    }
  }

  onContinueClick(): void {
    this.continue.emit();
  }

  onResendClick(): void {
    this.resendEmail.emit();
  }

  onTryAgainClick(): void {
    this.tryAgain.emit();
  }

  onBackToLoginClick(): void {
    this.backToLogin.emit();
  }
}
