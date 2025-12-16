import {
  Component,
  input,
  output,
  signal,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { AxCardComponent } from '@aegisx/ui';
import { UserService, User } from '../../services/user.service';
import { DepartmentSelectorComponent } from '../../../../features/system/modules/departments/components/department-selector/department-selector.component';

/**
 * Profile Info Component
 * ===================================
 * Displays and edits user profile information with the following features:
 * - Display mode showing user details (name, email, phone, department, role)
 * - Edit mode with form fields for editable properties
 * - Toggle between display and edit modes
 * - Save changes with validation
 * - Cancel editing with confirmation
 * - Loading states during save
 * - Error handling with user feedback
 *
 * @example
 * <ax-profile-info
 *   [user]="currentUser()"
 *   (updateProfile)="onProfileUpdate($event)"
 * ></ax-profile-info>
 */
@Component({
  selector: 'ax-profile-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    AxCardComponent,
    DepartmentSelectorComponent,
  ],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInfoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // Signals for reactive state management
  editMode = signal(false);
  isSaving = signal(false);
  departmentName = signal<string | null>(null);

  // Inputs (using signals API)
  user = input.required<User>();

  // Outputs (using signals API)
  updateProfile = output<Partial<User>>();

  // Form group for editing
  profileForm: FormGroup;

  // Computed signals
  userFullName = computed(() => {
    const userData = this.user();
    return (
      `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() ||
      'User'
    );
  });

  userRole = computed(() => {
    const userData = this.user();
    // Get primary role or first role if available
    if (userData?.primaryRole?.roleName) {
      return userData.primaryRole.roleName;
    }
    if (userData?.roles && userData.roles.length > 0) {
      return userData.roles[0].roleName;
    }
    return userData?.role || 'No role assigned';
  });

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(1)]],
      lastName: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', []],
      department_id: [null as number | null, []],
    });
  }

  ngOnInit(): void {
    this.populateForm();
  }

  /**
   * Populate form with current user data
   */
  private populateForm(): void {
    const userData = this.user();
    this.profileForm.patchValue({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      department_id: userData?.department_id || null,
    });

    // Disable email field as it shouldn't be edited
    this.profileForm.get('email')?.disable();
  }

  /**
   * Toggle between display and edit modes
   */
  toggleEditMode(): void {
    if (!this.editMode()) {
      this.editMode.set(true);
      // Focus the first form field
      setTimeout(() => {
        const firstInput = document.querySelector(
          '[formControlName="firstName"]',
        ) as HTMLInputElement;
        firstInput?.focus();
      }, 0);
    } else {
      // If in edit mode, ask to cancel
      this.cancelEdit();
    }
  }

  /**
   * Save profile changes
   */
  async saveChanges(): Promise<void> {
    if (this.profileForm.invalid) {
      this.snackBar.open('Please fix the form errors', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.isSaving.set(true);

    try {
      const formValue = this.profileForm.getRawValue();
      const updateData: Partial<User> = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        phone: formValue.phone || undefined,
        department_id: formValue.department_id || null,
      };

      this.updateProfile.emit(updateData);
      this.editMode.set(false);

      this.snackBar.open('Profile updated successfully!', 'Close', {
        duration: 3000,
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      this.snackBar.open('Failed to update profile', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  /**
   * Cancel editing and revert changes
   */
  cancelEdit(): void {
    if (this.profileForm.dirty) {
      if (confirm('Are you sure you want to discard your changes?')) {
        this.populateForm();
        this.editMode.set(false);
      }
    } else {
      this.editMode.set(false);
    }
  }

  /**
   * Get error message for a form field
   */
  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }

    return 'Invalid input';
  }
}
