import {
  Component,
  input,
  output,
  signal,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UserService, User } from '../../services/user.service';

/**
 * Profile Avatar Component
 *
 * A standalone Angular component for displaying and managing user profile avatars.
 * Features include:
 * - Circular avatar display with user initials fallback
 * - Upload avatar with file validation (max 5MB, image only)
 * - Delete avatar functionality
 * - Upload progress indication
 * - Error handling with user feedback
 *
 * @example
 * <ax-profile-avatar
 *   [user]="currentUser()"
 *   (uploadAvatar)="onAvatarUpload($event)"
 *   (deleteAvatar)="onAvatarDelete()"
 * ></ax-profile-avatar>
 */
@Component({
  selector: 'ax-profile-avatar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './profile-avatar.component.html',
  styleUrl: './profile-avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileAvatarComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  // Signals for reactive state management
  uploading = signal(false);
  uploadProgress = signal(0);
  errorMessage = signal<string | null>(null);

  // Inputs (using signals API)
  user = input.required<User>();

  // Outputs (using signals API)
  uploadAvatar = output<File>();
  deleteAvatar = output<void>();

  // Computed signals
  userInitials = computed(() => {
    const userData = this.user();
    if (!userData?.firstName || !userData?.lastName) return 'U';

    const initials =
      `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
    return initials;
  });

  userFullName = computed(() => {
    const userData = this.user();
    return (
      `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() ||
      'User'
    );
  });

  hasAvatar = computed(() => {
    return !!this.user()?.avatar;
  });

  /**
   * Initialize component and set up reactive effects
   */
  ngOnInit(): void {
    // Clear error message after 5 seconds
    effect(() => {
      const error = this.errorMessage();
      if (error) {
        const timeoutId = setTimeout(() => {
          this.errorMessage.set(null);
        }, 5000);

        return () => clearTimeout(timeoutId);
      }
      return undefined;
    });
  }

  /**
   * Trigger file input click to open file selector
   */
  triggerFileInput(): void {
    if (!this.uploading()) {
      this.fileInput?.nativeElement?.click();
    }
  }

  /**
   * Handle file selection from input or drag & drop
   * Validates file type and size before emitting upload event
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input?.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    this.validateAndUploadFile(file);

    // Reset file input to allow selecting the same file again
    if (input) {
      input.value = '';
    }
  }

  /**
   * Validate file type and size
   * Allowed types: jpg, png, webp
   * Max size: 5MB
   */
  private validateAndUploadFile(file: File): void {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage.set(
        'Invalid file type. Please upload JPG, PNG, or WebP image.',
      );
      this.snackBar.open(this.errorMessage()!, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      this.errorMessage.set('File size must not exceed 5MB.');
      this.snackBar.open(this.errorMessage()!, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    // Upload file
    this.uploadFile(file);
  }

  /**
   * Upload file to server and handle progress
   */
  private uploadFile(file: File): void {
    this.uploading.set(true);
    this.uploadProgress.set(0);
    this.errorMessage.set(null);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('avatar', file);

    // Call API with progress tracking
    this.userService
      .uploadAvatar(formData, (progress) => {
        this.uploadProgress.set(progress);
      })
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.uploading.set(false);
            this.uploadProgress.set(0);

            // Emit the file to parent component
            this.uploadAvatar.emit(file);

            this.snackBar.open('Avatar uploaded successfully!', 'Close', {
              duration: 3000,
            });
          }
        },
        error: (error: any) => {
          this.uploading.set(false);
          this.uploadProgress.set(0);

          const errorMsg =
            error?.error?.message ||
            error?.message ||
            'Failed to upload avatar';
          this.errorMessage.set(errorMsg);

          this.snackBar.open(errorMsg, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  /**
   * Delete user avatar after confirmation
   */
  deleteAvatarClick(): void {
    if (confirm('Are you sure you want to delete your profile picture?')) {
      this.deleteAvatarConfirmed();
    }
  }

  /**
   * Send delete request to server and handle response
   */
  private deleteAvatarConfirmed(): void {
    this.uploading.set(true);
    this.errorMessage.set(null);

    this.userService.deleteAvatar().subscribe({
      next: () => {
        this.uploading.set(false);

        // Emit delete event to parent component
        this.deleteAvatar.emit();

        this.snackBar.open('Avatar deleted successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (error: any) => {
        this.uploading.set(false);

        const errorMsg =
          error?.error?.message || error?.message || 'Failed to delete avatar';
        this.errorMessage.set(errorMsg);

        this.snackBar.open(errorMsg, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
