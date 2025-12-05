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
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AxLoadingButtonComponent } from '../../loading-button/ax-loading-button.component';

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordFormConfig {
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  backToLoginText?: string;
  successTitle?: string;
  successMessage?: string;
  successButtonText?: string;
}

/**
 * AegisX Reset Password Form Component
 *
 * A form for creating a new password after receiving a reset link.
 *
 * @example
 * ```html
 * <ax-reset-password-form
 *   [loading]="isLoading"
 *   [success]="passwordReset"
 *   (formSubmit)="onResetPassword($event)"
 *   (backToLogin)="navigateToLogin()"
 * />
 * ```
 */
@Component({
  selector: 'ax-reset-password-form',
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
        <!-- Reset Form -->
        <mat-card-header class="centered-header">
          <div class="header-icon brand-bg">
            <mat-icon>lock</mat-icon>
          </div>
          <mat-card-title>{{ config.title }}</mat-card-title>
          <mat-card-subtitle>{{ config.subtitle }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()">
            <!-- New Password Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>New password</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input
                matInput
                [type]="hidePassword() ? 'password' : 'text'"
                formControlName="password"
                placeholder="Enter new password"
                autocomplete="new-password"
              />
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="togglePasswordVisibility()"
              >
                <mat-icon>{{
                  hidePassword() ? 'visibility_off' : 'visibility'
                }}</mat-icon>
              </button>
              @if (
                resetPasswordForm.get('password')?.hasError('required') &&
                resetPasswordForm.get('password')?.touched
              ) {
                <mat-error>Password is required</mat-error>
              }
              @if (
                resetPasswordForm.get('password')?.hasError('minlength') &&
                resetPasswordForm.get('password')?.touched
              ) {
                <mat-error>Password must be at least 8 characters</mat-error>
              }
              <mat-hint>At least 8 characters</mat-hint>
            </mat-form-field>

            <!-- Confirm Password Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm new password</mat-label>
              <mat-icon matPrefix>lock_outline</mat-icon>
              <input
                matInput
                [type]="hideConfirmPassword() ? 'password' : 'text'"
                formControlName="confirmPassword"
                placeholder="Confirm new password"
                autocomplete="new-password"
              />
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="toggleConfirmPasswordVisibility()"
              >
                <mat-icon>{{
                  hideConfirmPassword() ? 'visibility_off' : 'visibility'
                }}</mat-icon>
              </button>
              @if (
                resetPasswordForm
                  .get('confirmPassword')
                  ?.hasError('required') &&
                resetPasswordForm.get('confirmPassword')?.touched
              ) {
                <mat-error>Please confirm your password</mat-error>
              }
              @if (
                resetPasswordForm
                  .get('confirmPassword')
                  ?.hasError('passwordMismatch') &&
                resetPasswordForm.get('confirmPassword')?.touched
              ) {
                <mat-error>Passwords do not match</mat-error>
              }
            </mat-form-field>

            <!-- Submit Button -->
            <ax-loading-button
              type="submit"
              [loading]="loading"
              loadingText="Resetting..."
              icon="check"
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
            <mat-icon>check_circle</mat-icon>
          </div>
          <mat-card-title>{{ config.successTitle }}</mat-card-title>
          <mat-card-subtitle>{{ config.successMessage }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <ax-loading-button
            [loading]="false"
            icon="login"
            iconPosition="end"
            [fullWidth]="true"
            (buttonClick)="onBackToLoginClick()"
          >
            {{ config.successButtonText }}
          </ax-loading-button>
        </mat-card-content>
      }

      <!-- Footer (only show when not success) -->
      @if (!success) {
        <mat-card-footer>
          <button mat-button type="button" (click)="onBackToLoginClick()">
            <mat-icon>arrow_back</mat-icon>
            <span>{{ config.backToLoginText }}</span>
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

      mat-card-footer {
        display: flex;
        justify-content: center;
        padding: 1rem;
      }
    `,
  ],
})
export class AxResetPasswordFormComponent {
  /** Form configuration options */
  @Input() set config(value: Partial<ResetPasswordFormConfig>) {
    this._config = { ...this.defaultConfig, ...value };
  }
  get config(): ResetPasswordFormConfig {
    return this._config;
  }

  /** Loading state for submit button */
  @Input() loading = false;

  /** Success state - shows confirmation message */
  @Input() success = false;

  /** Emits form data when submitted */
  @Output() formSubmit = new EventEmitter<ResetPasswordFormData>();

  /** Emits when back to login is clicked */
  @Output() backToLogin = new EventEmitter<void>();

  resetPasswordForm: FormGroup;
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  private defaultConfig: ResetPasswordFormConfig = {
    title: 'Set new password',
    subtitle:
      'Your new password must be different from previously used passwords.',
    submitButtonText: 'Reset Password',
    backToLoginText: 'Back to login',
    successTitle: 'Password reset!',
    successMessage: 'Your password has been successfully reset.',
    successButtonText: 'Continue to login',
  };

  private _config: ResetPasswordFormConfig = this.defaultConfig;

  private fb = inject(FormBuilder);

  constructor() {
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.formSubmit.emit(
        this.resetPasswordForm.value as ResetPasswordFormData,
      );
    } else {
      Object.keys(this.resetPasswordForm.controls).forEach((key) => {
        this.resetPasswordForm.get(key)?.markAsTouched();
      });
    }
  }

  onBackToLoginClick(): void {
    this.backToLogin.emit();
  }

  private passwordMatchValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }
}
