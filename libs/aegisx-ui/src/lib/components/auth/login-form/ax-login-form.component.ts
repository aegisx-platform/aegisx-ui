import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AxLoadingButtonComponent } from '../../loading-button/ax-loading-button.component';

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormConfig {
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  showSocialLogin?: boolean;
  showSignupLink?: boolean;
  forgotPasswordText?: string;
  signupText?: string;
  signupLinkText?: string;
}

/**
 * AegisX Login Form Component
 *
 * A reusable login form with email/password fields, social login options,
 * and configurable UI elements.
 *
 * @example
 * ```html
 * <ax-login-form
 *   [config]="{ title: 'Welcome back' }"
 *   [loading]="isLoading"
 *   (formSubmit)="onLogin($event)"
 *   (forgotPassword)="onForgotPassword()"
 *   (socialLogin)="onSocialLogin($event)"
 *   (signupClick)="onSignup()"
 * />
 * ```
 */
@Component({
  selector: 'ax-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDividerModule,
    AxLoadingButtonComponent,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title>{{ config.title }}</mat-card-title>
        <mat-card-subtitle>{{ config.subtitle }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
              loginForm.get('email')?.hasError('required') &&
              loginForm.get('email')?.touched
            ) {
              <mat-error>Email is required</mat-error>
            }
            @if (
              loginForm.get('email')?.hasError('email') &&
              loginForm.get('email')?.touched
            ) {
              <mat-error>Please enter a valid email</mat-error>
            }
          </mat-form-field>

          <!-- Password Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <mat-icon matPrefix>lock</mat-icon>
            <input
              matInput
              [type]="hidePassword() ? 'password' : 'text'"
              formControlName="password"
              placeholder="Enter your password"
              autocomplete="current-password"
            />
            <button
              mat-icon-button
              matSuffix
              type="button"
              (click)="togglePasswordVisibility()"
              [attr.aria-label]="'Hide password'"
              [attr.aria-pressed]="!hidePassword()"
            >
              <mat-icon>{{
                hidePassword() ? 'visibility_off' : 'visibility'
              }}</mat-icon>
            </button>
            @if (
              loginForm.get('password')?.hasError('required') &&
              loginForm.get('password')?.touched
            ) {
              <mat-error>Password is required</mat-error>
            }
            @if (
              loginForm.get('password')?.hasError('minlength') &&
              loginForm.get('password')?.touched
            ) {
              <mat-error>Password must be at least 6 characters</mat-error>
            }
          </mat-form-field>

          <!-- Remember Me & Forgot Password -->
          @if (config.showRememberMe || config.showForgotPassword) {
            <div class="form-options">
              @if (config.showRememberMe) {
                <mat-checkbox formControlName="rememberMe">
                  Remember me
                </mat-checkbox>
              }
              @if (config.showForgotPassword) {
                <a
                  href="javascript:void(0)"
                  class="link"
                  (click)="onForgotPasswordClick()"
                >
                  {{ config.forgotPasswordText }}
                </a>
              }
            </div>
          }

          <!-- Login Button -->
          <ax-loading-button
            type="submit"
            [loading]="loading"
            loadingText="Signing in..."
            icon="arrow_forward"
            iconPosition="end"
            [fullWidth]="true"
            (buttonClick)="onSubmit()"
          >
            {{ config.submitButtonText }}
          </ax-loading-button>
        </form>

        <!-- Social Login -->
        @if (config.showSocialLogin) {
          <div class="divider-container">
            <mat-divider></mat-divider>
            <span class="divider-text">or continue with</span>
            <mat-divider></mat-divider>
          </div>

          <div class="social-buttons">
            <button
              mat-stroked-button
              type="button"
              (click)="onSocialLoginClick('google')"
            >
              <mat-icon>g_mobiledata</mat-icon>
              <span>Google</span>
            </button>
            <button
              mat-stroked-button
              type="button"
              (click)="onSocialLoginClick('github')"
            >
              <mat-icon>code</mat-icon>
              <span>GitHub</span>
            </button>
          </div>
        }
      </mat-card-content>

      <!-- Footer -->
      @if (config.showSignupLink) {
        <mat-card-footer>
          <p class="footer-text">
            {{ config.signupText }}
            <a href="javascript:void(0)" class="link" (click)="onSignupClick()">
              {{ config.signupLinkText }}
            </a>
          </p>
        </mat-card-footer>
      }
    </mat-card>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .full-width {
        width: 100%;
      }

      .form-options {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .link {
        color: var(--ax-brand-default);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }

      .divider-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: 1.5rem 0;

        mat-divider {
          flex: 1;
        }
      }

      .divider-text {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }

      .social-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }

      .footer-text {
        text-align: center;
        margin: 0;
        padding: 1rem;
      }
    `,
  ],
})
export class AxLoginFormComponent {
  /** Form configuration options */
  @Input() set config(value: Partial<LoginFormConfig>) {
    this._config = { ...this.defaultConfig, ...value };
  }
  get config(): LoginFormConfig {
    return this._config;
  }

  /** Loading state for submit button */
  @Input() loading = false;

  /** Emits form data when submitted */
  @Output() formSubmit = new EventEmitter<LoginFormData>();

  /** Emits when forgot password is clicked */
  @Output() forgotPassword = new EventEmitter<void>();

  /** Emits social provider name when social login is clicked */
  @Output() socialLogin = new EventEmitter<string>();

  /** Emits when signup link is clicked */
  @Output() signupClick = new EventEmitter<void>();

  loginForm: FormGroup;
  hidePassword = signal(true);

  private defaultConfig: LoginFormConfig = {
    title: 'Welcome back',
    subtitle: 'Sign in to your account to continue',
    submitButtonText: 'Sign In',
    showRememberMe: true,
    showForgotPassword: true,
    showSocialLogin: true,
    showSignupLink: true,
    forgotPasswordText: 'Forgot password?',
    signupText: "Don't have an account?",
    signupLinkText: 'Sign up',
  };

  private _config: LoginFormConfig = this.defaultConfig;

  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.formSubmit.emit(this.loginForm.value as LoginFormData);
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  onForgotPasswordClick(): void {
    this.forgotPassword.emit();
  }

  onSocialLoginClick(provider: string): void {
    this.socialLogin.emit(provider);
  }

  onSignupClick(): void {
    this.signupClick.emit();
  }
}
