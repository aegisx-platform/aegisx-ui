import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-register',
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
            <mat-icon>person_add</mat-icon>
          </div>
          <h1 class="auth-title">Create your account</h1>
          <p class="auth-subtitle">Sign up to get started with your account</p>
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
                  <p class="auth-alert-subtitle">Redirecting to home...</p>
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

            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
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
                  *ngIf="registerForm.get('email')?.hasError('required')"
                >
                  Email is required
                </mat-error>
                <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                  Please enter a valid email address
                </mat-error>
              </mat-form-field>

              <!-- Username Field -->
              <mat-form-field appearance="outline" class="auth-field">
                <mat-label>Username</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="username"
                  placeholder="johndoe"
                  autocomplete="username"
                  required
                />
                <mat-error
                  *ngIf="registerForm.get('username')?.hasError('required')"
                >
                  Username is required
                </mat-error>
                <mat-error
                  *ngIf="registerForm.get('username')?.hasError('minlength')"
                >
                  Username must be at least 3 characters
                </mat-error>
              </mat-form-field>

              <!-- First Name and Last Name - Two Column Grid -->
              <div class="auth-field-row">
                <!-- First Name Field -->
                <mat-form-field appearance="outline" class="auth-field">
                  <mat-label>First Name</mat-label>
                  <input
                    matInput
                    type="text"
                    formControlName="firstName"
                    placeholder="John"
                    autocomplete="given-name"
                    required
                  />
                  <mat-error
                    *ngIf="registerForm.get('firstName')?.hasError('required')"
                  >
                    Required
                  </mat-error>
                </mat-form-field>

                <!-- Last Name Field -->
                <mat-form-field appearance="outline" class="auth-field">
                  <mat-label>Last Name</mat-label>
                  <input
                    matInput
                    type="text"
                    formControlName="lastName"
                    placeholder="Doe"
                    autocomplete="family-name"
                    required
                  />
                  <mat-error
                    *ngIf="registerForm.get('lastName')?.hasError('required')"
                  >
                    Required
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Password Field -->
              <mat-form-field appearance="outline" class="auth-field">
                <mat-label>Password</mat-label>
                <input
                  matInput
                  [type]="hidePassword() ? 'password' : 'text'"
                  formControlName="password"
                  placeholder="Enter password"
                  autocomplete="new-password"
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
                  *ngIf="registerForm.get('password')?.hasError('required')"
                >
                  Password is required
                </mat-error>
                <mat-error
                  *ngIf="registerForm.get('password')?.hasError('minlength')"
                >
                  Password must be at least 8 characters
                </mat-error>
              </mat-form-field>

              <!-- Confirm Password Field -->
              <mat-form-field appearance="outline" class="auth-field">
                <mat-label>Confirm Password</mat-label>
                <input
                  matInput
                  [type]="hideConfirmPassword() ? 'password' : 'text'"
                  formControlName="confirmPassword"
                  placeholder="Confirm password"
                  autocomplete="new-password"
                  required
                />
                <button
                  mat-icon-button
                  matSuffix
                  type="button"
                  (click)="toggleConfirmPasswordVisibility()"
                  [attr.aria-label]="
                    hideConfirmPassword() ? 'Show password' : 'Hide password'
                  "
                >
                  <mat-icon>{{
                    hideConfirmPassword() ? 'visibility' : 'visibility_off'
                  }}</mat-icon>
                </button>
                <mat-error
                  *ngIf="
                    registerForm.get('confirmPassword')?.hasError('required')
                  "
                >
                  Please confirm your password
                </mat-error>
                <mat-error
                  *ngIf="
                    registerForm.hasError('passwordMismatch') &&
                    registerForm.get('confirmPassword')?.touched
                  "
                >
                  Passwords do not match
                </mat-error>
              </mat-form-field>

              <!-- Submit Button -->
              <button
                mat-flat-button
                color="primary"
                type="submit"
                class="auth-submit-btn"
                [disabled]="registerForm.invalid || isLoading()"
              >
                @if (isLoading()) {
                  <span class="auth-btn-loading">
                    <mat-spinner diameter="20"></mat-spinner>
                    <span>Creating account...</span>
                  </span>
                } @else {
                  Create account
                }
              </button>

              <!-- Sign In Link -->
              <div class="auth-footer-link">
                <span>Already have an account?</span>
                <a routerLink="/login" mat-button color="primary">Sign in</a>
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
              <h4>Account Information</h4>
            </div>
            <ul class="auth-info-list">
              <li>
                <mat-icon>check_circle</mat-icon>
                <span>Password must be at least 8 characters</span>
              </li>
              <li>
                <mat-icon>check_circle</mat-icon>
                <span>Username must be unique</span>
              </li>
              <li>
                <mat-icon>check_circle</mat-icon>
                <span>Limited to 3 registrations per hour for security</span>
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
          color: white;
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
        margin-bottom: var(--ax-spacing-md);
      }

      .auth-field-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--ax-spacing-md);
        margin-bottom: var(--ax-spacing-md);
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
        gap: var(--ax-spacing-xs);
        margin-top: var(--ax-spacing-lg);
        font-size: var(--ax-font-size-sm);
        color: var(--ax-text-default);
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
export class RegisterPage {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals for reactive state
  protected isLoading = signal<boolean>(false);
  protected errorMessage = signal<string>('');
  protected successMessage = signal<string>('');
  protected hidePassword = signal<boolean>(true);
  protected hideConfirmPassword = signal<boolean>(true);

  // Reactive form
  protected registerForm: FormGroup;

  constructor() {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  protected onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { email, username, firstName, lastName, password } =
      this.registerForm.value;

    this.authService
      .register({ email, username, firstName, lastName, password })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.successMessage.set(
            'Account created successfully! Please check your email to verify your account.',
          );
          this.registerForm.reset();

          // Redirect to home after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            error.message || 'Failed to create account. Please try again.',
          );
        },
      });
  }

  protected togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  private passwordMatchValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
}
