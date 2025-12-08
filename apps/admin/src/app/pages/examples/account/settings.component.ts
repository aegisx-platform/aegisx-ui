import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-settings-example',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatListModule,
  ],
  template: `
    <div class="settings-page">
      <!-- Header -->
      <header class="settings-page__header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </header>

      <div class="settings-page__content">
        <!-- Sidebar Navigation -->
        <nav class="settings-page__nav">
          @for (section of sections; track section.id) {
            <button
              [class.active]="activeSection() === section.id"
              (click)="activeSection.set(section.id)"
            >
              <mat-icon>{{ section.icon }}</mat-icon>
              {{ section.label }}
            </button>
          }
        </nav>

        <!-- Main Content -->
        <main class="settings-page__main">
          @switch (activeSection()) {
            @case ('profile') {
              <section class="settings-page__section">
                <h2>Profile Information</h2>
                <p class="settings-page__section-desc">
                  Update your personal information and profile details
                </p>

                <div class="settings-page__form">
                  <div class="settings-page__avatar-row">
                    <div class="settings-page__avatar">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                        alt="Avatar"
                      />
                    </div>
                    <div class="settings-page__avatar-actions">
                      <button mat-stroked-button>
                        <mat-icon>upload</mat-icon>
                        Change Photo
                      </button>
                      <button mat-button color="warn">Remove</button>
                    </div>
                  </div>

                  <div class="settings-page__row">
                    <mat-form-field appearance="outline">
                      <mat-label>First Name</mat-label>
                      <input matInput [(ngModel)]="profile.firstName" />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Last Name</mat-label>
                      <input matInput [(ngModel)]="profile.lastName" />
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Email</mat-label>
                    <input matInput [(ngModel)]="profile.email" type="email" />
                    <mat-icon matSuffix>mail</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Bio</mat-label>
                    <textarea
                      matInput
                      [(ngModel)]="profile.bio"
                      rows="3"
                    ></textarea>
                    <mat-hint>Brief description for your profile</mat-hint>
                  </mat-form-field>

                  <div class="settings-page__row">
                    <mat-form-field appearance="outline">
                      <mat-label>Company</mat-label>
                      <input matInput [(ngModel)]="profile.company" />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Job Title</mat-label>
                      <input matInput [(ngModel)]="profile.jobTitle" />
                    </mat-form-field>
                  </div>

                  <div class="settings-page__actions">
                    <button mat-button>Cancel</button>
                    <button mat-flat-button color="primary">
                      Save Changes
                    </button>
                  </div>
                </div>
              </section>
            }

            @case ('notifications') {
              <section class="settings-page__section">
                <h2>Notification Preferences</h2>
                <p class="settings-page__section-desc">
                  Choose how you want to be notified about activity
                </p>

                <div class="settings-page__toggles">
                  @for (notification of notifications; track notification.id) {
                    <div class="settings-page__toggle-item">
                      <div class="settings-page__toggle-info">
                        <h4>{{ notification.title }}</h4>
                        <p>{{ notification.description }}</p>
                      </div>
                      <mat-slide-toggle
                        [(ngModel)]="notification.enabled"
                        color="primary"
                      />
                    </div>
                  }
                </div>

                <mat-divider />

                <h3>Email Digest</h3>
                <mat-form-field appearance="outline">
                  <mat-label>Frequency</mat-label>
                  <mat-select [(ngModel)]="emailDigest">
                    <mat-option value="daily">Daily</mat-option>
                    <mat-option value="weekly">Weekly</mat-option>
                    <mat-option value="monthly">Monthly</mat-option>
                    <mat-option value="never">Never</mat-option>
                  </mat-select>
                </mat-form-field>

                <div class="settings-page__actions">
                  <button mat-button>Reset to Default</button>
                  <button mat-flat-button color="primary">
                    Save Preferences
                  </button>
                </div>
              </section>
            }

            @case ('security') {
              <section class="settings-page__section">
                <h2>Security Settings</h2>
                <p class="settings-page__section-desc">
                  Manage your password and account security
                </p>

                <div class="settings-page__security-card">
                  <div class="settings-page__security-info">
                    <mat-icon>lock</mat-icon>
                    <div>
                      <h4>Password</h4>
                      <p>Last changed 3 months ago</p>
                    </div>
                  </div>
                  <button mat-stroked-button>Change Password</button>
                </div>

                <div class="settings-page__security-card">
                  <div class="settings-page__security-info">
                    <mat-icon>security</mat-icon>
                    <div>
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security</p>
                    </div>
                  </div>
                  <mat-slide-toggle
                    [(ngModel)]="twoFactorEnabled"
                    color="primary"
                  />
                </div>

                <div class="settings-page__security-card">
                  <div class="settings-page__security-info">
                    <mat-icon>devices</mat-icon>
                    <div>
                      <h4>Active Sessions</h4>
                      <p>3 devices currently logged in</p>
                    </div>
                  </div>
                  <button mat-stroked-button>Manage Sessions</button>
                </div>

                <mat-divider />

                <h3>Danger Zone</h3>
                <div class="settings-page__danger-card">
                  <div>
                    <h4>Delete Account</h4>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <button mat-flat-button color="warn">Delete Account</button>
                </div>
              </section>
            }

            @case ('appearance') {
              <section class="settings-page__section">
                <h2>Appearance</h2>
                <p class="settings-page__section-desc">
                  Customize how the application looks
                </p>

                <h3>Theme</h3>
                <div class="settings-page__theme-options">
                  @for (theme of themes; track theme.id) {
                    <button
                      class="settings-page__theme-option"
                      [class.active]="selectedTheme() === theme.id"
                      (click)="selectedTheme.set(theme.id)"
                    >
                      <div
                        class="settings-page__theme-preview"
                        [class]="theme.id"
                      >
                        <div class="preview-sidebar"></div>
                        <div class="preview-content"></div>
                      </div>
                      <span>{{ theme.label }}</span>
                    </button>
                  }
                </div>

                <h3>Density</h3>
                <mat-form-field appearance="outline">
                  <mat-label>Display Density</mat-label>
                  <mat-select [(ngModel)]="density">
                    <mat-option value="comfortable">Comfortable</mat-option>
                    <mat-option value="compact">Compact</mat-option>
                    <mat-option value="spacious">Spacious</mat-option>
                  </mat-select>
                </mat-form-field>

                <div class="settings-page__toggles">
                  <div class="settings-page__toggle-item">
                    <div class="settings-page__toggle-info">
                      <h4>Reduce Motion</h4>
                      <p>Minimize animations throughout the app</p>
                    </div>
                    <mat-slide-toggle
                      [(ngModel)]="reduceMotion"
                      color="primary"
                    />
                  </div>
                </div>

                <div class="settings-page__actions">
                  <button mat-button>Reset to Default</button>
                  <button mat-flat-button color="primary">
                    Save Preferences
                  </button>
                </div>
              </section>
            }

            @case ('billing') {
              <section class="settings-page__section">
                <h2>Billing & Plans</h2>
                <p class="settings-page__section-desc">
                  Manage your subscription and billing information
                </p>

                <div class="settings-page__plan-card">
                  <div class="settings-page__plan-info">
                    <span class="settings-page__plan-badge">Current Plan</span>
                    <h3>Professional</h3>
                    <p>$29/month • Renews on Jan 15, 2025</p>
                  </div>
                  <div class="settings-page__plan-actions">
                    <button mat-stroked-button>Change Plan</button>
                    <button mat-button color="warn">Cancel</button>
                  </div>
                </div>

                <h3>Payment Method</h3>
                <div class="settings-page__payment-card">
                  <div class="settings-page__card-icon">
                    <mat-icon>credit_card</mat-icon>
                  </div>
                  <div class="settings-page__card-info">
                    <h4>Visa ending in 4242</h4>
                    <p>Expires 12/2026</p>
                  </div>
                  <button mat-stroked-button>Update</button>
                </div>

                <h3>Billing History</h3>
                <div class="settings-page__billing-list">
                  @for (invoice of invoices; track invoice.id) {
                    <div class="settings-page__invoice">
                      <div class="settings-page__invoice-info">
                        <span class="settings-page__invoice-date">{{
                          invoice.date
                        }}</span>
                        <span class="settings-page__invoice-amount">{{
                          invoice.amount
                        }}</span>
                      </div>
                      <div class="settings-page__invoice-actions">
                        <span
                          class="settings-page__invoice-status"
                          [class]="invoice.status"
                        >
                          {{ invoice.status }}
                        </span>
                        <button mat-icon-button>
                          <mat-icon>download</mat-icon>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </section>
            }
          }
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .settings-page {
        min-height: 100vh;
        background: var(--ax-background-default);
        padding: 2rem;
      }

      /* Header */
      .settings-page__header {
        max-width: 1000px;
        margin: 0 auto 2rem;

        h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--ax-text-heading);
          margin: 0;
        }

        p {
          color: var(--ax-text-secondary);
          margin: 0.5rem 0 0;
        }
      }

      /* Content */
      .settings-page__content {
        display: grid;
        grid-template-columns: 240px 1fr;
        gap: 2rem;
        max-width: 1000px;
        margin: 0 auto;
      }

      @media (max-width: 768px) {
        .settings-page__content {
          grid-template-columns: 1fr;
        }
      }

      /* Navigation */
      .settings-page__nav {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          border-radius: var(--ax-radius-md);
          color: var(--ax-text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }

          &:hover {
            background: var(--ax-background-subtle);
            color: var(--ax-text-primary);
          }

          &.active {
            background: var(--ax-brand-subtle);
            color: var(--ax-brand-default);
            font-weight: 500;
          }
        }
      }

      @media (max-width: 768px) {
        .settings-page__nav {
          flex-direction: row;
          flex-wrap: wrap;
          gap: 0.5rem;

          button {
            flex: 1;
            min-width: fit-content;
            justify-content: center;
          }
        }
      }

      /* Main Content */
      .settings-page__main {
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        padding: 1.5rem;
      }

      /* Section */
      .settings-page__section {
        h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0;
        }

        h3 {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 1.5rem 0 1rem;
        }
      }

      .settings-page__section-desc {
        color: var(--ax-text-secondary);
        font-size: 0.875rem;
        margin: 0.5rem 0 1.5rem;
      }

      /* Form */
      .settings-page__form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .settings-page__row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;

        @media (max-width: 640px) {
          grid-template-columns: 1fr;
        }
      }

      .full-width {
        width: 100%;
      }

      .settings-page__avatar-row {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 1rem;
      }

      .settings-page__avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .settings-page__avatar-actions {
        display: flex;
        gap: 0.75rem;
      }

      .settings-page__actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--ax-border-default);
      }

      /* Toggle Items */
      .settings-page__toggles {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .settings-page__toggle-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);
      }

      .settings-page__toggle-info {
        h4 {
          margin: 0;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--ax-text-heading);
        }

        p {
          margin: 0.25rem 0 0;
          font-size: 0.8125rem;
          color: var(--ax-text-secondary);
        }
      }

      /* Security Cards */
      .settings-page__security-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);
        margin-bottom: 0.75rem;
      }

      .settings-page__security-info {
        display: flex;
        align-items: center;
        gap: 1rem;

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
          color: var(--ax-brand-default);
        }

        h4 {
          margin: 0;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--ax-text-heading);
        }

        p {
          margin: 0;
          font-size: 0.8125rem;
          color: var(--ax-text-secondary);
        }
      }

      .settings-page__danger-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--ax-danger-subtle);
        border: 1px solid var(--ax-danger-default);
        border-radius: var(--ax-radius-md);

        h4 {
          margin: 0;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--ax-danger-default);
        }

        p {
          margin: 0.25rem 0 0;
          font-size: 0.8125rem;
          color: var(--ax-text-secondary);
        }
      }

      /* Theme Options */
      .settings-page__theme-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;

        @media (max-width: 640px) {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .settings-page__theme-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        border: 2px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        background: transparent;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: var(--ax-brand-default);
        }

        &.active {
          border-color: var(--ax-brand-default);
          background: var(--ax-brand-subtle);
        }

        span {
          font-size: 0.875rem;
          color: var(--ax-text-primary);
        }
      }

      .settings-page__theme-preview {
        width: 100%;
        height: 60px;
        border-radius: var(--ax-radius-sm);
        display: flex;
        overflow: hidden;

        .preview-sidebar {
          width: 30%;
          height: 100%;
        }

        .preview-content {
          flex: 1;
          height: 100%;
        }

        &.light {
          .preview-sidebar {
            background: #f3f4f6;
          }
          .preview-content {
            background: #ffffff;
          }
        }

        &.dark {
          .preview-sidebar {
            background: #1f2937;
          }
          .preview-content {
            background: #111827;
          }
        }

        &.system {
          .preview-sidebar {
            background: linear-gradient(180deg, #f3f4f6 50%, #1f2937 50%);
          }
          .preview-content {
            background: linear-gradient(180deg, #ffffff 50%, #111827 50%);
          }
        }
      }

      /* Plan Card */
      .settings-page__plan-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        background: linear-gradient(135deg, var(--ax-brand-default), #8b5cf6);
        border-radius: var(--ax-radius-lg);
        color: white;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .settings-page__plan-info {
        h3 {
          margin: 0.5rem 0 0.25rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
        }

        p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.875rem;
        }
      }

      .settings-page__plan-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        background: rgba(255, 255, 255, 0.2);
        border-radius: var(--ax-radius-sm);
        font-size: 0.75rem;
        font-weight: 500;
      }

      .settings-page__plan-actions {
        display: flex;
        gap: 0.5rem;

        button {
          color: white;
          border-color: rgba(255, 255, 255, 0.5);
        }
      }

      /* Payment Card */
      .settings-page__payment-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);
      }

      .settings-page__card-icon {
        width: 48px;
        height: 32px;
        background: var(--ax-brand-default);
        border-radius: var(--ax-radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          color: white;
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }

      .settings-page__card-info {
        flex: 1;

        h4 {
          margin: 0;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--ax-text-heading);
        }

        p {
          margin: 0;
          font-size: 0.8125rem;
          color: var(--ax-text-secondary);
        }
      }

      /* Billing List */
      .settings-page__billing-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .settings-page__invoice {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);
      }

      .settings-page__invoice-info {
        display: flex;
        gap: 1.5rem;
      }

      .settings-page__invoice-date {
        color: var(--ax-text-secondary);
        font-size: 0.875rem;
      }

      .settings-page__invoice-amount {
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .settings-page__invoice-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .settings-page__invoice-status {
        padding: 0.25rem 0.5rem;
        border-radius: var(--ax-radius-sm);
        font-size: 0.75rem;
        font-weight: 500;

        &.paid {
          background: var(--ax-success-subtle);
          color: var(--ax-success-default);
        }

        &.pending {
          background: var(--ax-warning-subtle);
          color: var(--ax-warning-default);
        }
      }

      /* Responsive */
      @media (max-width: 640px) {
        .settings-page {
          padding: 1rem;
        }

        .settings-page__plan-card {
          flex-direction: column;
          align-items: flex-start;
        }

        .settings-page__avatar-row {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class SettingsExampleComponent {
  activeSection = signal('profile');
  selectedTheme = signal('system');
  twoFactorEnabled = false;
  emailDigest = 'weekly';
  density = 'comfortable';
  reduceMotion = false;

  sections = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'security', label: 'Security', icon: 'security' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
    { id: 'billing', label: 'Billing', icon: 'credit_card' },
  ];

  profile = {
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    bio: 'Senior Software Engineer passionate about building great products.',
    company: 'TechCorp Inc.',
    jobTitle: 'Senior Software Engineer',
  };

  notifications = [
    {
      id: 1,
      title: 'Email Notifications',
      description: 'Receive email updates about your account',
      enabled: true,
    },
    {
      id: 2,
      title: 'Push Notifications',
      description: 'Receive push notifications on your devices',
      enabled: true,
    },
    {
      id: 3,
      title: 'Marketing Emails',
      description: 'Receive emails about new features and offers',
      enabled: false,
    },
    {
      id: 4,
      title: 'Security Alerts',
      description: 'Get notified about security events',
      enabled: true,
    },
  ];

  themes = [
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
    { id: 'system', label: 'System' },
  ];

  invoices = [
    { id: 1, date: 'Dec 1, 2024', amount: '$29.00', status: 'paid' },
    { id: 2, date: 'Nov 1, 2024', amount: '$29.00', status: 'paid' },
    { id: 3, date: 'Oct 1, 2024', amount: '$29.00', status: 'paid' },
  ];
}
