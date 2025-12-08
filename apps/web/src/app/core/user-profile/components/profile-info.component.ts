import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../users/services/user.service';
import {
  AvatarUploadComponent,
  AvatarUploadResult,
} from './avatar-upload.component';

@Component({
  selector: 'ax-profile-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatCardModule,
    AvatarUploadComponent,
  ],
  template: `
    <div class="profile-info-container">
      <!-- Profile Picture Section -->
      <div class="profile-header">
        <ax-avatar-upload
          [avatarUrl]="userProfile?.avatar"
          [displayName]="getDisplayName()"
          (avatarChange)="onAvatarChange($event)"
          (uploadStart)="onAvatarUploadStart()"
          (uploadComplete)="onAvatarUploadComplete($event)"
          (uploadError)="onAvatarUploadError($event)"
        ></ax-avatar-upload>

        <div class="profile-header-info">
          <h2 class="profile-name">{{ getDisplayName() }}</h2>
          <p class="profile-email">{{ userProfile?.email }}</p>
          <p class="profile-member-since">
            Member since {{ formatDate(userProfile?.createdAt) }}
          </p>
        </div>
      </div>

      <mat-divider></mat-divider>

      <!-- Profile Information Form -->
      <form [formGroup]="profileForm" class="profile-form">
        <h3 class="section-title">Personal Information</h3>

        <!-- Name Fields -->
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input
              matInput
              formControlName="firstName"
              placeholder="Enter your first name"
            />
            <mat-icon matSuffix>person</mat-icon>
            <mat-error
              *ngIf="profileForm.get('firstName')?.hasError('required')"
            >
              First name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input
              matInput
              formControlName="lastName"
              placeholder="Enter your last name"
            />
            <mat-icon matSuffix>person</mat-icon>
            <mat-error
              *ngIf="profileForm.get('lastName')?.hasError('required')"
            >
              Last name is required
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Username and Email -->
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Username</mat-label>
            <input
              matInput
              formControlName="username"
              placeholder="Enter your username"
            />
            <mat-icon matSuffix>alternate_email</mat-icon>
            <mat-error
              *ngIf="profileForm.get('username')?.hasError('required')"
            >
              Username is required
            </mat-error>
            <mat-error
              *ngIf="profileForm.get('username')?.hasError('minlength')"
            >
              Username must be at least 3 characters
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input
              matInput
              formControlName="email"
              placeholder="Enter your email"
              type="email"
            />
            <mat-icon matSuffix>email</mat-icon>
            <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
              Please enter a valid email address
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Bio -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Bio</mat-label>
          <textarea
            matInput
            formControlName="bio"
            placeholder="Tell us about yourself..."
            rows="4"
            maxlength="500"
          ></textarea>
          <mat-icon matSuffix>description</mat-icon>
          <mat-hint>{{ getBioLength() }}/500 characters</mat-hint>
        </mat-form-field>

        <!-- Account Status (Read-only) -->
        <div class="account-status-box">
          <h4 class="account-status-title">Account Status</h4>
          <div class="status-grid">
            <div class="status-row">
              <span class="status-label">Role(s):</span>
              <span class="status-value">
                @if (userProfile?.roles && userProfile.roles.length > 0) {
                  {{ formatRoles(userProfile.roles) }}
                } @else {
                  {{ userProfile?.role }}
                }
              </span>
            </div>
            <div class="status-row">
              <span class="status-label">Status:</span>
              <span
                class="status-value"
                [ngClass]="getStatusColor(userProfile?.status)"
              >
                {{ userProfile?.status }}
              </span>
            </div>
            <div class="status-row">
              <span class="status-label">Email Verified:</span>
              <span
                class="status-value"
                [ngClass]="
                  userProfile?.emailVerified
                    ? 'status-verified'
                    : 'status-unverified'
                "
              >
                {{ userProfile?.emailVerified ? 'Yes' : 'No' }}
              </span>
            </div>
            <div class="status-row">
              <span class="status-label">Last Updated:</span>
              <span class="status-value">
                {{ formatDate(userProfile?.updatedAt) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button
            mat-button
            type="button"
            (click)="resetForm()"
            [disabled]="!hasChanges()"
          >
            Reset Changes
          </button>
          <button
            mat-flat-button
            color="primary"
            type="button"
            (click)="saveChanges()"
            [disabled]="profileForm.invalid || !hasChanges() || isSaving()"
          >
            @if (isSaving()) {
              <ng-container>
                <mat-icon class="save-icon animate-spin">sync</mat-icon>
                Saving...
              </ng-container>
            } @else {
              <ng-container>
                <mat-icon class="save-icon">save</mat-icon>
                Save Changes
              </ng-container>
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* ===== CONTAINER ===== */
      .profile-info-container {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-xl);
      }

      /* ===== PROFILE HEADER ===== */
      .profile-header {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-xl);
      }

      .profile-header-info {
        flex: 1;
      }

      .profile-name {
        margin: 0 0 var(--ax-spacing-xs) 0;
        font-size: var(--ax-text-xl);
        font-weight: var(--ax-font-semibold);
        color: var(--mat-sys-on-surface);
      }

      .profile-email {
        margin: 0 0 var(--ax-spacing-xs) 0;
        color: var(--mat-sys-on-surface);
      }

      .profile-member-since {
        margin: 0;
        font-size: var(--ax-text-sm);
        color: var(--mat-sys-on-surface-variant);
      }

      /* ===== FORM ===== */
      .profile-form {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-lg);
      }

      .section-title {
        margin: 0 0 var(--ax-spacing-md) 0;
        font-size: var(--ax-text-lg);
        font-weight: var(--ax-font-semibold);
        color: var(--mat-sys-on-surface);
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: var(--ax-spacing-md);
      }

      @media (min-width: 768px) {
        .form-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .full-width {
        width: 100%;
      }

      mat-form-field {
        width: 100%;
        margin-bottom: 4px;
      }

      /* ===== ACCOUNT STATUS ===== */
      .account-status-box {
        padding: var(--ax-spacing-lg);
        border-radius: var(--ax-radius-md);
        background-color: var(--mat-sys-surface-container-low);
      }

      .account-status-title {
        margin: 0 0 var(--ax-spacing-md) 0;
        font-size: var(--ax-text-md);
        font-weight: var(--ax-font-medium);
        color: var(--mat-sys-on-surface);
      }

      .status-grid {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: var(--ax-spacing-md);
        font-size: var(--ax-text-sm);
      }

      @media (min-width: 768px) {
        .status-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .status-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .status-label {
        color: var(--mat-sys-on-surface-variant);
      }

      .status-value {
        font-weight: var(--ax-font-medium);
        color: var(--mat-sys-on-surface);
        text-transform: capitalize;
      }

      .status-verified {
        color: var(--ax-success-default);
      }

      .status-unverified {
        color: var(--ax-error-default);
      }

      .status-active {
        color: var(--ax-success-default);
      }

      .status-inactive {
        color: var(--ax-error-default);
      }

      .status-pending {
        color: var(--ax-warning-default);
      }

      /* ===== ACTION BUTTONS ===== */
      .action-buttons {
        display: flex;
        justify-content: flex-end;
        gap: var(--ax-spacing-sm);
      }

      .save-icon {
        margin-right: var(--ax-spacing-sm);
      }

      /* ===== ANIMATIONS ===== */
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .animate-spin {
        animation: spin 1s linear infinite;
      }
    `,
  ],
})
export class ProfileInfoComponent implements OnChanges {
  @Input() userProfile: any = null;
  @Output() profileChange = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  isSaving = signal(false);

  profileForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    bio: ['', [Validators.maxLength(500)]],
  });

  private originalValues: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userProfile'] && this.userProfile) {
      this.loadProfileData();
    }
  }

  private loadProfileData(): void {
    if (this.userProfile) {
      const profileData = {
        firstName: this.userProfile.firstName || '',
        lastName: this.userProfile.lastName || '',
        username: this.userProfile.username || '',
        email: this.userProfile.email || '',
        bio: this.userProfile.bio || '',
      };

      this.profileForm.patchValue(profileData);
      this.originalValues = { ...profileData };
    }
  }

  getDisplayName(): string {
    if (!this.userProfile) return 'User';
    const firstName = this.userProfile.firstName || '';
    const lastName = this.userProfile.lastName || '';
    return (
      `${firstName} ${lastName}`.trim() || this.userProfile.username || 'User'
    );
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Unknown';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  }

  formatRoles(roles: string[]): string {
    return roles.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(', ');
  }

  getBioLength(): number {
    return this.profileForm.get('bio')?.value?.length || 0;
  }

  getStatusColor(status: string | undefined): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  }

  hasChanges(): boolean {
    if (!this.originalValues || Object.keys(this.originalValues).length === 0) {
      return false;
    }

    const currentValues = this.profileForm.value;
    return Object.keys(this.originalValues).some(
      (key) =>
        currentValues[key as keyof typeof currentValues] !==
        this.originalValues[key],
    );
  }

  resetForm(): void {
    this.profileForm.patchValue(this.originalValues);
  }

  async saveChanges(): Promise<void> {
    if (!this.profileForm.valid || !this.hasChanges()) return;

    this.isSaving.set(true);

    try {
      const formValue = this.profileForm.value;
      const changes = {
        firstName: formValue.firstName || undefined,
        lastName: formValue.lastName || undefined,
        username: formValue.username || undefined,
        email: formValue.email || undefined,
        bio: formValue.bio || undefined,
      };
      const updatedProfile = await this.userService
        .updateProfile(changes)
        .toPromise();

      // Update original values to reflect saved state
      this.originalValues = { ...changes };

      // Emit the updated profile to parent component
      this.profileChange.emit(updatedProfile);

      this.snackBar.open('Profile updated successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    } catch (error: any) {
      this.snackBar.open(error.message || 'Failed to update profile', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  onAvatarChange(avatarUrl: string): void {
    // Update the local profile data
    if (this.userProfile) {
      this.userProfile = {
        ...this.userProfile,
        avatar: avatarUrl,
      };

      // Emit the updated profile
      this.profileChange.emit(this.userProfile);
    }
  }

  onAvatarUploadStart(): void {
    console.log('Avatar upload started');
  }

  onAvatarUploadComplete(result: AvatarUploadResult): void {
    if (result.success && result.avatarUrl) {
      console.log('Avatar upload completed:', result.avatarUrl);
      this.onAvatarChange(result.avatarUrl);
    }
  }

  onAvatarUploadError(error: string): void {
    console.error('Avatar upload error:', error);
    // Error is already handled by the AvatarUploadComponent with snackbar
  }
}
