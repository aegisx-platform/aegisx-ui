import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DocHeaderComponent } from '../../../../../components/docs/doc-header/doc-header.component';
import { AxCodeTabsComponent, CodeTab } from '@aegisx/ui';
import { PropsTableComponent } from '../../../../../components/props-table/props-table.component';

@Component({
  selector: 'ax-auth-doc',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    DocHeaderComponent,
    AxCodeTabsComponent,
    PropsTableComponent,
  ],
  template: `
    <div class="docs-page">
      <!-- Header -->
      <ax-doc-header
        title="Authentication Components"
        description="ชุด components สำหรับสร้างหน้า authentication ที่ครบครัน รวม Login, Register, Forgot Password, Social Login และ Auth Layout"
        category="Authentication"
      />

      <!-- Live Examples Section -->
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>
            <h2 class="section-title">
              <mat-icon class="title-icon">launch</mat-icon>
              Live Examples
            </h2>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="text-secondary mb-4">
            คลิกที่การ์ดด้านล่างเพื่อดูตัวอย่างจริงของหน้า Authentication
            แต่ละประเภท หน้าเหล่านี้เป็นหน้าที่ใช้งานจริงใน Web Application
          </p>

          <div class="example-grid">
            <!-- Login Page -->
            <a
              routerLink="/docs/components/aegisx/auth/examples/login"
              class="example-card"
            >
              <div class="example-icon login-bg">
                <mat-icon>login</mat-icon>
              </div>
              <div class="example-content">
                <h3>Login Page</h3>
                <p>หน้า Login พร้อม Remember Me และ Social Login</p>
              </div>
              <mat-icon class="arrow-icon">arrow_forward</mat-icon>
            </a>

            <!-- Register Page -->
            <a
              routerLink="/docs/components/aegisx/auth/examples/register"
              class="example-card"
            >
              <div class="example-icon register-bg">
                <mat-icon>person_add</mat-icon>
              </div>
              <div class="example-content">
                <h3>Register Page</h3>
                <p>หน้าลงทะเบียนพร้อม Password Strength Indicator</p>
              </div>
              <mat-icon class="arrow-icon">arrow_forward</mat-icon>
            </a>

            <!-- Forgot Password Page -->
            <a
              routerLink="/docs/components/aegisx/auth/examples/forgot-password"
              class="example-card"
            >
              <div class="example-icon forgot-bg">
                <mat-icon>lock_reset</mat-icon>
              </div>
              <div class="example-content">
                <h3>Forgot Password</h3>
                <p>หน้า Reset Password ผ่าน Email</p>
              </div>
              <mat-icon class="arrow-icon">arrow_forward</mat-icon>
            </a>

            <!-- Reset Password Page -->
            <a
              routerLink="/docs/components/aegisx/auth/examples/reset-password"
              class="example-card"
            >
              <div class="example-icon reset-bg">
                <mat-icon>password</mat-icon>
              </div>
              <div class="example-content">
                <h3>Reset Password</h3>
                <p>หน้าตั้ง Password ใหม่หลังกด reset link</p>
              </div>
              <mat-icon class="arrow-icon">arrow_forward</mat-icon>
            </a>

            <!-- Confirm Email Page -->
            <a
              routerLink="/docs/components/aegisx/auth/examples/confirm-email"
              class="example-card"
            >
              <div class="example-icon verify-bg">
                <mat-icon>mark_email_read</mat-icon>
              </div>
              <div class="example-content">
                <h3>Confirm Email</h3>
                <p>หน้ายืนยัน Email พร้อม 5 สถานะ</p>
              </div>
              <mat-icon class="arrow-icon">arrow_forward</mat-icon>
            </a>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Components Overview -->
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>
            <h2 class="section-title">
              <mat-icon class="title-icon">widgets</mat-icon>
              Available Components
            </h2>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="component-list">
            <div class="component-item">
              <mat-icon>view_quilt</mat-icon>
              <div>
                <strong>AxAuthLayoutComponent</strong>
                <span>Layout wrapper สำหรับหน้า authentication</span>
              </div>
            </div>

            <div class="component-item">
              <mat-icon>login</mat-icon>
              <div>
                <strong>AxLoginFormComponent</strong>
                <span>Form สำหรับ login พร้อม validation</span>
              </div>
            </div>

            <div class="component-item">
              <mat-icon>person_add</mat-icon>
              <div>
                <strong>AxRegisterFormComponent</strong>
                <span>Form สำหรับ registration</span>
              </div>
            </div>

            <div class="component-item">
              <mat-icon>lock_reset</mat-icon>
              <div>
                <strong>AxForgotPasswordFormComponent</strong>
                <span>Form สำหรับ request password reset</span>
              </div>
            </div>

            <div class="component-item">
              <mat-icon>password</mat-icon>
              <div>
                <strong>AxResetPasswordFormComponent</strong>
                <span>Form สำหรับ set new password</span>
              </div>
            </div>

            <div class="component-item">
              <mat-icon>share</mat-icon>
              <div>
                <strong>AxSocialLoginComponent</strong>
                <span>ปุ่ม Social login (Google, Facebook, GitHub)</span>
              </div>
            </div>

            <div class="component-item">
              <mat-icon>mark_email_read</mat-icon>
              <div>
                <strong>AxConfirmEmailComponent</strong>
                <span>หน้ายืนยัน email พร้อม 5 สถานะ</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Usage Examples -->
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>
            <h2 class="section-title">
              <mat-icon class="title-icon">code</mat-icon>
              Usage Examples
            </h2>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <h3 class="subsection-title">Basic Login Page</h3>
          <ax-code-tabs [tabs]="loginUsageCode" />

          <h3 class="subsection-title">With Auth Layout</h3>
          <ax-code-tabs [tabs]="authLayoutUsageCode" />

          <h3 class="subsection-title">Social Login Integration</h3>
          <ax-code-tabs [tabs]="socialLoginUsageCode" />
        </mat-card-content>
      </mat-card>

      <!-- API Reference -->
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>
            <h2 class="section-title">
              <mat-icon class="title-icon">description</mat-icon>
              API Reference
            </h2>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <h3 class="subsection-title">AxLoginFormComponent</h3>
          <ax-props-table [properties]="loginFormProps" />

          <h3 class="subsection-title">AxRegisterFormComponent</h3>
          <ax-props-table [properties]="registerFormProps" />

          <h3 class="subsection-title">AxAuthLayoutComponent</h3>
          <ax-props-table [properties]="authLayoutProps" />
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .docs-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .title-icon {
        color: var(--ax-brand-default);
      }

      .subsection-title {
        font-size: 1rem;
        font-weight: 600;
        margin: 1.5rem 0 0.75rem 0;
      }

      .subsection-title:first-of-type {
        margin-top: 0;
      }

      .text-secondary {
        color: var(--ax-text-secondary);
      }

      .mb-4 {
        margin-bottom: 1rem;
      }

      /* Example Grid - Simple */
      .example-grid {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .example-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md);
        text-decoration: none;
        color: inherit;
        transition: border-color 0.2s;
      }

      .example-card:hover {
        border-color: var(--ax-brand-default);
      }

      .example-icon {
        width: 40px;
        height: 40px;
        border-radius: var(--ax-radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        mat-icon {
          color: white;
        }
      }

      .login-bg {
        background: var(--ax-brand-default);
      }
      .register-bg {
        background: var(--ax-success-default);
      }
      .forgot-bg {
        background: var(--ax-warning-default);
      }
      .reset-bg {
        background: var(--ax-info-default);
      }
      .verify-bg {
        background: #22d3d3;
      }

      .example-content {
        flex: 1;
        min-width: 0;

        h3 {
          margin: 0;
          font-size: 0.9375rem;
          font-weight: 600;
        }

        p {
          margin: 0.25rem 0 0 0;
          font-size: 0.8125rem;
          color: var(--ax-text-secondary);
        }
      }

      .arrow-icon {
        color: var(--ax-text-subtle);
        transition: transform 0.2s;
      }

      .example-card:hover .arrow-icon {
        transform: translateX(4px);
        color: var(--ax-brand-default);
      }

      /* Component List - Simple */
      .component-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .component-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        > mat-icon {
          color: var(--ax-brand-default);
        }

        > div {
          display: flex;
          flex-direction: column;

          strong {
            font-size: 0.875rem;
          }

          span {
            font-size: 0.8125rem;
            color: var(--ax-text-secondary);
          }
        }
      }
    `,
  ],
})
export class AuthDocComponent {
  // Code examples
  loginUsageCode: CodeTab[] = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<ax-login-form
  [config]="loginConfig"
  (login)="onLogin($event)"
  (forgotPassword)="onForgotPassword()"
  (register)="onRegister()"
/>`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { AxLoginFormComponent, LoginFormConfig } from '@aegisx/ui';

@Component({
  imports: [AxLoginFormComponent],
})
export class LoginPage {
  loginConfig: LoginFormConfig = {
    showRememberMe: true,
    showForgotPassword: true,
    showRegisterLink: true,
  };

  onLogin(data: LoginFormData) {
    this.authService.login(data).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => this.showError(err.message)
    });
  }
}`,
    },
  ];

  authLayoutUsageCode: CodeTab[] = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<ax-auth-layout
  [brandName]="'My App'"
  [tagline]="'Enterprise Solutions'"
>
  <ax-login-form
    [config]="loginConfig"
    (login)="onLogin($event)"
  />
</ax-auth-layout>`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import {
  AxAuthLayoutComponent,
  AxLoginFormComponent
} from '@aegisx/ui';

@Component({
  imports: [AxAuthLayoutComponent, AxLoginFormComponent],
  template: \`
    <ax-auth-layout [brandName]="'My App'">
      <ax-login-form />
    </ax-auth-layout>
  \`
})
export class LoginPage {}`,
    },
  ];

  socialLoginUsageCode: CodeTab[] = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<ax-social-login
  [providers]="['google', 'facebook', 'github']"
  [config]="{
    showDivider: true,
    dividerText: 'or continue with',
    layout: 'horizontal'
  }"
  (providerClick)="onSocialLogin($event)"
/>`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { AxSocialLoginComponent } from '@aegisx/ui';

@Component({
  imports: [AxSocialLoginComponent],
})
export class LoginPage {
  onSocialLogin(provider: string) {
    // Redirect to OAuth provider
    window.location.href = \`/api/auth/\${provider}\`;
  }
}`,
    },
  ];

  // API Props
  loginFormProps = [
    {
      name: 'config',
      type: 'LoginFormConfig',
      default: '{}',
      description: 'Configuration object for the login form',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Shows loading state on submit button',
    },
    {
      name: 'login',
      type: 'EventEmitter<LoginFormData>',
      default: '-',
      description: 'Emits when form is submitted with valid data',
    },
    {
      name: 'forgotPassword',
      type: 'EventEmitter<void>',
      default: '-',
      description: 'Emits when forgot password link is clicked',
    },
    {
      name: 'register',
      type: 'EventEmitter<void>',
      default: '-',
      description: 'Emits when register link is clicked',
    },
  ];

  registerFormProps = [
    {
      name: 'config',
      type: 'RegisterFormConfig',
      default: '{}',
      description: 'Configuration object for the register form',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Shows loading state on submit button',
    },
    {
      name: 'register',
      type: 'EventEmitter<RegisterFormData>',
      default: '-',
      description: 'Emits when form is submitted with valid data',
    },
    {
      name: 'login',
      type: 'EventEmitter<void>',
      default: '-',
      description: 'Emits when login link is clicked',
    },
  ];

  authLayoutProps = [
    {
      name: 'brandName',
      type: 'string',
      default: "'App'",
      description: 'Application name displayed in the layout',
    },
    {
      name: 'brandIcon',
      type: 'string',
      default: "'shield'",
      description: 'Icon name for the brand logo',
    },
    {
      name: 'tagline',
      type: 'string',
      default: "''",
      description: 'Tagline text displayed below brand name',
    },
    {
      name: 'features',
      type: 'AuthFeature[]',
      default: '[]',
      description: 'List of features to display in branding section',
    },
    {
      name: 'brandingBackground',
      type: 'string',
      default: "'gradient'",
      description: 'Background style for branding panel',
    },
  ];
}
