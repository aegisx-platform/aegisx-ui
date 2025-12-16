import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AxCardComponent } from '@aegisx/ui';
import { UserService, User } from '../../services/user.service';
import { ProfileInfoComponent } from '../../components/profile-info/profile-info.component';
import { ProfileAvatarComponent } from '../../components/profile-avatar/profile-avatar.component';
import { ProfilePreferencesComponent } from '../../components/profile-preferences/profile-preferences.component';
import { ProfileActivityComponent } from '../../components/profile-activity/profile-activity.component';

/**
 * Profile Page Container
 * ===================================
 * Main container component for the user profile page.
 * Orchestrates loading and management of profile-related child components:
 * - Profile Information (editable name, email, phone, department)
 * - Avatar Management (upload/delete profile picture)
 * - Preferences (theme, language, notifications, timezone)
 * - Activity History (user actions and login history)
 *
 * @example
 * Accessible via routing: /profile
 */
@Component({
  selector: 'ax-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    AxCardComponent,
    ProfileInfoComponent,
    ProfileAvatarComponent,
    ProfilePreferencesComponent,
    ProfileActivityComponent,
  ],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Signals for reactive state management
  currentUser = signal<User | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  activeTab = signal(0);

  // Computed signals
  hasError = computed(() => !!this.error());
  isLoading = computed(() => this.loading());
  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user?.firstName || !user?.lastName) return 'U';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  });

  userFullName = computed(() => {
    const user = this.currentUser();
    return `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  /**
   * Load current user profile
   */
  loadProfile(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.currentUser.set(profile as unknown as User);
        this.loading.set(false);
      },
      error: (error: any) => {
        const errorMsg =
          error?.error?.message || error?.message || 'Failed to load profile';
        this.error.set(errorMsg);
        this.loading.set(false);

        this.snackBar.open(errorMsg, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Handle profile information updates
   * @param data Partial user data with firstName, lastName, phone, department_id
   */
  handleProfileUpdate(data: any): void {
    this.loading.set(true);

    this.userService.updateProfile(data as any).subscribe({
      next: (updatedProfile) => {
        this.currentUser.set(updatedProfile as unknown as User);
        this.loading.set(false);

        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      },
      error: (error: any) => {
        this.loading.set(false);

        const errorMsg =
          error?.error?.message || error?.message || 'Failed to update profile';

        this.snackBar.open(errorMsg, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Handle avatar upload
   * Triggered when user uploads a new avatar file
   * @param file The avatar file to upload
   */
  handleAvatarUpload(file: File): void {
    this.loading.set(true);

    // The actual upload is handled by the ProfileAvatarComponent
    // This method is called after successful upload to refresh the profile
    setTimeout(() => {
      this.loadProfile();
    }, 500);
  }

  /**
   * Handle avatar deletion
   * Triggered when user deletes their avatar
   */
  handleAvatarDelete(): void {
    this.loading.set(true);

    // The actual deletion is handled by the ProfileAvatarComponent
    // This method is called after successful deletion to refresh the profile
    setTimeout(() => {
      this.loadProfile();
    }, 500);
  }

  /**
   * Handle preferences save
   * Note: Preferences are saved directly by the ProfilePreferencesComponent
   * This method serves as a hook for future enhancements
   */
  handlePreferencesSave(): void {
    // Preferences component handles saving independently
    // This is here for consistency with other tab handlers
  }

  /**
   * Navigate back to previous page
   */
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Track by function for ngFor
   */
  trackByIndex(index: number): number {
    return index;
  }
}
