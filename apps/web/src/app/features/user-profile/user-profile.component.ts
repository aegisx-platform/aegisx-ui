import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';
import { AegisxCardComponent, AegisxAlertComponent } from '@aegisx/ui';
import { ProfileInfoComponent } from './components/profile-info.component';
import { ProfileSecurityComponent } from './components/profile-security.component';
import { UserService } from '../users/user.service';

@Component({
  selector: 'ax-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule,
    AegisxCardComponent,
    AegisxAlertComponent,
    ProfileInfoComponent,
    ProfileSecurityComponent,
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              My Profile
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              Manage your account information and preferences
            </p>
          </div>
          <div class="flex items-center space-x-2">
            @if (hasUnsavedChanges()) {
              <ax-alert type="info" class="mr-4">
                You have unsaved changes
              </ax-alert>
            }
            <button
              mat-raised-button
              color="primary"
              (click)="saveAllChanges()"
              [disabled]="!hasUnsavedChanges() || isSaving()"
            >
              @if (isSaving()) {
                <mat-icon class="animate-spin mr-2">sync</mat-icon>
              }
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="flex justify-center items-center min-h-[400px]">
          <div class="text-center">
            <mat-spinner diameter="48"></mat-spinner>
            <p class="text-gray-600 dark:text-gray-400 mt-4">
              Loading profile...
            </p>
          </div>
        </div>
      }

      <!-- Error State -->
      @else if (error()) {
        <ax-alert type="error" title="Error Loading Profile" class="mb-6">
          {{ error() }}
          <button
            mat-button
            color="primary"
            (click)="loadProfile()"
            class="ml-2"
          >
            Retry
          </button>
        </ax-alert>
      }

      <!-- Main Content -->
      @else {
        <!-- Profile Tabs -->
        <ax-card [appearance]="'elevated'">
          <mat-tab-group
            [(selectedIndex)]="selectedTabIndex"
            animationDuration="200ms"
            class="profile-tabs"
          >
            <!-- Profile Information Tab -->
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">person</mat-icon>
                <span>Profile Info</span>
                @if (profileInfoHasChanges()) {
                  <mat-icon
                    class="ml-2 text-orange-500 text-sm"
                    fontIcon="edit"
                    matTooltip="This section has unsaved changes"
                  ></mat-icon>
                }
              </ng-template>
              <div class="tab-content">
                <ax-profile-info
                  [userProfile]="userProfile()"
                  (profileChange)="onProfileInfoChange($event)"
                ></ax-profile-info>
              </div>
            </mat-tab>

            <!-- Security Tab -->
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">security</mat-icon>
                <span>Security</span>
              </ng-template>
              <div class="tab-content">
                <ax-profile-security></ax-profile-security>
              </div>
            </mat-tab>

            <!-- Preferences Tab -->
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">tune</mat-icon>
                <span>Preferences</span>
                @if (preferencesHasChanges()) {
                  <mat-icon
                    class="ml-2 text-orange-500 text-sm"
                    fontIcon="edit"
                    matTooltip="This section has unsaved changes"
                  ></mat-icon>
                }
              </ng-template>
              <div class="tab-content">
                <div class="text-center py-8">
                  <mat-icon
                    class="text-gray-400 mb-4"
                    style="font-size: 48px; height: 48px; width: 48px;"
                    >tune</mat-icon
                  >
                  <h3
                    class="text-lg font-medium text-gray-600 dark:text-gray-300"
                  >
                    Preferences Coming Soon
                  </h3>
                  <p class="text-gray-500 dark:text-gray-400 mt-2">
                    Theme, language, and notification preferences will be
                    available here.
                  </p>
                </div>
              </div>
            </mat-tab>

            <!-- Account Management Tab -->
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">manage_accounts</mat-icon>
                <span>Account</span>
              </ng-template>
              <div class="tab-content">
                <div class="space-y-6">
                  <!-- Account Activity -->
                  <div>
                    <h3
                      class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100"
                    >
                      Account Activity
                    </h3>
                    <div class="text-center py-8">
                      <mat-icon
                        class="text-gray-400 mb-4"
                        style="font-size: 48px; height: 48px; width: 48px;"
                        >history</mat-icon
                      >
                      <h4
                        class="text-lg font-medium text-gray-600 dark:text-gray-300"
                      >
                        Activity Log Coming Soon
                      </h4>
                      <p class="text-gray-500 dark:text-gray-400 mt-2">
                        View your login history and account activities here.
                      </p>
                    </div>
                  </div>

                  <mat-divider></mat-divider>

                  <!-- Danger Zone -->
                  <div>
                    <h3
                      class="text-lg font-semibold mb-4 text-red-600 dark:text-red-400"
                    >
                      Danger Zone
                    </h3>
                    <ax-alert type="warning" class="mb-4">
                      These actions cannot be undone. Please proceed with
                      caution.
                    </ax-alert>
                    <div class="space-y-4">
                      <div
                        class="p-4 border border-red-200 dark:border-red-800 rounded-md"
                      >
                        <h4
                          class="font-medium text-red-800 dark:text-red-200 mb-2"
                        >
                          Delete Account
                        </h4>
                        <p class="text-red-600 dark:text-red-300 text-sm mb-4">
                          Permanently delete your account and all associated
                          data. This action cannot be reversed.
                        </p>
                        <button
                          mat-stroked-button
                          color="warn"
                          (click)="confirmDeleteAccount()"
                          [disabled]="true"
                        >
                          Delete Account (Coming Soon)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </ax-card>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .profile-tabs {
        min-height: 600px;
      }

      .tab-content {
        padding: 24px;
      }

      ::ng-deep .mat-mdc-tab-body-wrapper {
        flex: 1;
      }

      ::ng-deep .mat-mdc-tab-labels {
        @apply border-b dark:border-gray-700;
      }

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
export class UserProfileComponent implements OnInit, OnDestroy {
  private snackBar = inject(MatSnackBar);
  private userService = inject(UserService);
  private destroy$ = new Subject<void>();

  selectedTabIndex = 0;

  // State signals
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);
  userProfile = signal<any>(null);
  profileChanges = signal<any>({});

  ngOnInit(): void {
    this.loadProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userService
      .getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.userProfile.set(profile);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set(error.message || 'Failed to load profile');
          this.isLoading.set(false);
        },
      });
  }

  onProfileInfoChange(updatedProfile: any): void {
    // Update the profile data directly since ProfileInfoComponent now saves directly
    this.userProfile.set(updatedProfile);
    // Clear any pending changes since profile was saved
    this.profileChanges.update((current) => {
      const { profile, ...rest } = current;
      return rest;
    });
  }

  hasUnsavedChanges(): boolean {
    const changes = this.profileChanges();
    return Object.keys(changes).length > 0;
  }

  profileInfoHasChanges(): boolean {
    return false; // Profile info now saves directly, no pending changes
  }

  preferencesHasChanges(): boolean {
    return !!this.profileChanges()?.preferences;
  }

  async saveAllChanges(): Promise<void> {
    if (!this.hasUnsavedChanges()) return;

    this.isSaving.set(true);

    try {
      const changes = this.profileChanges();

      // Save profile information changes
      if (changes.profile) {
        await this.userService.updateProfile(changes.profile).toPromise();
        // Reload profile to get updated data
        this.loadProfile();
      }

      // Save preferences changes
      if (changes.preferences) {
        // TODO: Call API to save preferences changes when preferences API is implemented
        console.log('Saving preferences changes:', changes.preferences);
      }

      // Clear changes after successful save
      this.profileChanges.set({});

      this.snackBar.open('Profile updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    } catch (error: any) {
      this.snackBar.open(error.message || 'Failed to save changes', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  confirmDeleteAccount(): void {
    // TODO: Implement account deletion with confirmation dialog
    console.log('Delete account confirmation dialog would open here');
  }
}
