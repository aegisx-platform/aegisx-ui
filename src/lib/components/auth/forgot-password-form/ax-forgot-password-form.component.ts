import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AxLoadingButtonComponent } from '../../loading-button/ax-loading-button.component';

export interface ForgotPasswordFormData {
  email: string;
}

export interface ForgotPasswordFormConfig {
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  backToLoginText?: string;
  successTitle?: string;
  successMessage?: string;
}

/**
 * AegisX Forgot Password Form Component
 *
 * A form for requesting a password reset link via email.
 *
 * @example
 * ```html
 * <ax-forgot-password-form
 *   [loading]="isLoading"
 *   [success]="emailSent"
 *   (formSubmit)="onRequestReset($event)"
 *   (backToLogin)="navigateToLogin()"
 * />
 * ```
 */
@Component({
  selector: 'ax-forgot-password-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AxLoadingButtonComponent,
  ],
  template: `
    <mat-card appearance="outlined">
      @if (!success) {
        <!-- Request Form -->
        <mat-card-header class="centered-header">
          <div class="header-icon brand-bg">
            <mat-icon>lock_reset</mat-icon>
          </div>
          <mat-card-title>{{ config.title }}</mat-card-title>
          <mat-card-subtitle>{{ config.subtitle }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
            <!-- Email Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="your@email.com"
                autocomplete="email"
              />
              @if (
                forgotPasswordForm.get('email')?.hasError('required') &&
                forgotPasswordForm.get('email')?.touched
              ) {
                <mat-error>Email is required</mat-error>
              }
              @if (
                forgotPasswordForm.get('email')?.hasError('email') &&
                forgotPasswordForm.get('email')?.touched
              ) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <!-- Submit Button -->
            <ax-loading-button
              type="submit"
              [loading]="loading"
              loadingText="Sending..."
              icon="send"
              iconPosition="end"
              [fullWidth]="true"
              (buttonClick)="onSubmit()"
            >
              {{ config.submitButtonText }}
            </ax-loading-button>
          </form>
        </mat-card-content>
      } @else {
        <!-- Success State -->
        <mat-card-header class="centered-header">
          <div class="header-icon success-bg">
            <mat-icon>mark_email_read</mat-icon>
          </div>
          <mat-card-title>{{ config.successTitle }}</mat-card-title>
          <mat-card-subtitle>{{ config.successMessage }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <p class="note-text">
            Didn't receive the email? Check your spam folder or try again.
          </p>

          <ax-loading-button
            [loading]="loading"
            loadingText="Resending..."
            icon="refresh"
            iconPosition="start"
            [fullWidth]="true"
            (buttonClick)="onResendClick()"
          >
            Resend Email
          </ax-loading-button>
        </mat-card-content>
      }

      <!-- Footer -->
      <mat-card-footer>
        <button mat-button type="button" (click)="onBackToLoginClick()">
          <mat-icon>arrow_back</mat-icon>
          <span>{{ config.backToLoginText }}</span>
        </button>
      </mat-card-footer>
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
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: white;
        }
      }

      .brand-bg {
        background: var(--ax-brand-default);
      }

      .success-bg {
        background: var(--ax-success-default);
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .full-width {
        width: 100%;
      }

      .note-text {
        text-align: center;
        font-size: 0.875rem;
        color: var(--ax-text-subtle);
        margin-bottom: 1rem;
      }

      mat-card-footer {
        display: flex;
        justify-content: center;
        padding: 1rem;
      }
    `,
  ],
})
export class AxForgotPasswordFormComponent {
  /** Form configuration options */
  @Input() set config(value: Partial<ForgotPasswordFormConfig>) {
    this._config = { ...this.defaultConfig, ...value };
  }
  get config(): ForgotPasswordFormConfig {
    return this._config;
  }

  /** Loading state for submit button */
  @Input() loading = false;

  /** Success state - shows confirmation message */
  @Input() success = false;

  /** Emits form data when submitted */
  @Output() formSubmit = new EventEmitter<ForgotPasswordFormData>();

  /** Emits when back to login is clicked */
  @Output() backToLogin = new EventEmitter<void>();

  /** Emits when resend email is clicked */
  @Output() resendEmail = new EventEmitter<void>();

  forgotPasswordForm: FormGroup;

  private defaultConfig: ForgotPasswordFormConfig = {
    title: 'Forgot password?',
    subtitle: "No worries, we'll send you reset instructions.",
    submitButtonText: 'Send Reset Link',
    backToLoginText: 'Back to login',
    successTitle: 'Check your email',
    successMessage: "We've sent a password reset link to your email address.",
  };

  private _config: ForgotPasswordFormConfig = this.defaultConfig;

  private fb = inject(FormBuilder);
  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.formSubmit.emit(
        this.forgotPasswordForm.value as ForgotPasswordFormData,
      );
    } else {
      Object.keys(this.forgotPasswordForm.controls).forEach((key) => {
        this.forgotPasswordForm.get(key)?.markAsTouched();
      });
    }
  }

  onBackToLoginClick(): void {
    this.backToLogin.emit();
  }

  onResendClick(): void {
    this.resendEmail.emit();
  }
}
