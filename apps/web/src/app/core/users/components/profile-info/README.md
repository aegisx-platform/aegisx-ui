# Profile Info Component

A standalone Angular component for displaying and editing user profile information with reactive form handling, signal-based state management, and comprehensive Material Design integration.

## Overview

The Profile Info Component provides a dual-mode interface for viewing and editing user profile data:

- **Display Mode**: Shows user information in a clean, organized grid layout
- **Edit Mode**: Provides form fields for updating editable user properties

## Features

- **Signal-based Reactive State**: Uses Angular's new signals input/output API for type-safe prop binding
- **OnPush Change Detection**: Optimized performance with manual change detection strategy
- **Dual-Mode Interface**: Seamless toggle between display and edit modes
- **Form Validation**: Built-in validators for all editable fields
- **Department Selection**: Integrated department selector with hierarchical display
- **Status Badges**: Visual indicators for user status (active, inactive, suspended, pending)
- **Responsive Design**: Mobile-first layout that works on all device sizes
- **Error Handling**: Comprehensive error messaging and user feedback
- **Loading States**: Clear indication of async operations
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA attributes

## Usage

```typescript
import { ProfileInfoComponent } from '@app/core/users';

@Component({
  selector: 'app-profile-page',
  template: ` <ax-profile-info [user]="currentUser()" (updateProfile)="onProfileUpdate($event)" /> `,
  imports: [ProfileInfoComponent],
})
export class ProfilePage {
  currentUser = signal<User | null>(null);

  onProfileUpdate(updates: Partial<User>): void {
    // Handle profile update
    this.userService.updateUser(this.currentUser()!.id, updates);
  }
}
```

## Inputs

### `user` (required)

Type: `Signal<User>`

The user object to display/edit. Must be provided using the signals input API.

```typescript
user = input.required<User>();
```

**User Model Properties:**

- `id`: Unique user identifier
- `email`: User email (read-only)
- `firstName`: User's first name (editable)
- `lastName`: User's last name (editable)
- `phone`: User's phone number (editable)
- `department_id`: Associated department ID (editable)
- `status`: User status (active, inactive, suspended, pending)
- `role`: Primary user role
- `roles`: Array of all assigned roles
- `createdAt`: Account creation date
- `lastLoginAt`: Last login timestamp

## Outputs

### `updateProfile`

Type: `OutputEmitterRef<Partial<User>>`

Emitted when the user submits profile changes. Contains only the modified fields.

```typescript
updateProfile = output<Partial<User>>();
```

**Emitted Data:**

```typescript
{
  firstName?: string;
  lastName?: string;
  phone?: string;
  department_id?: number | null;
}
```

## Component State

### Signals

- `editMode`: Reactive state for toggling between display and edit modes
- `isSaving`: Loading state indicator during profile update
- `departmentName`: Display name of the selected department

### Computed Signals

- `userFullName`: Computed full name from firstName and lastName
- `userRole`: Computed primary role from user data

## Methods

### `toggleEditMode(): void`

Switches between display and edit modes. In edit mode, focuses the first form field for better UX.

### `saveChanges(): Promise<void>`

Validates the form and emits the `updateProfile` event with the updated values. Includes error handling and user feedback via snackbar.

### `cancelEdit(): void`

Cancels editing and reverts form changes. Shows confirmation if form has unsaved changes.

### `getErrorMessage(fieldName: string): string`

Returns user-friendly error messages for validation errors.

## Form Fields (Edit Mode)

1. **First Name** (Required)
   - Min length: 1 character
   - Placeholder: "Enter first name"

2. **Last Name** (Required)
   - Min length: 1 character
   - Placeholder: "Enter last name"

3. **Email** (Read-only)
   - Displays current email with hint "Email cannot be changed"

4. **Phone** (Optional)
   - Placeholder: "Enter phone number"

5. **Department** (Optional)
   - Uses `DepartmentSelectorComponent`
   - Hierarchical dropdown with indentation
   - Supports null selection

## Display Mode Sections

1. **Full Name**: Computed from firstName and lastName
2. **Email**: User's email address (clickable/copyable)
3. **Phone**: Phone number or "Not provided" placeholder
4. **Department**: Department name or "Not assigned" placeholder
5. **Role**: Primary user role with security icon badge
6. **Status**: Status badge with color coding:
   - Green for Active
   - Gray for Inactive
   - Red for Suspended
   - Orange for Pending
7. **Member Since**: Account creation date
8. **Last Login**: Last login timestamp or "Never"

## Styling

### CSS Classes

- `.profile-info-card`: Container card wrapper
- `.display-mode`: Display mode wrapper
- `.edit-mode`: Edit mode wrapper
- `.profile-header`: Header section with title and action button
- `.profile-grid`: Responsive grid layout for profile sections
- `.profile-section`: Individual data section
- `.status-badge`: Status indicator styling
- `.role-badge`: Role display styling
- `.form-grid`: Form field grid layout
- `.form-actions`: Action button container

### Responsive Breakpoints

- **Mobile** (< 600px): Single column layout, full-width buttons
- **Tablet** (600px - 768px): Adjusted spacing and layout
- **Desktop** (> 768px): Multi-column grid layout

### CSS Variables

Uses project's design system variables:

- `--ax-spacing-*`: Spacing scale (xs, sm, md, lg, xl)
- `--ax-text-primary`: Primary text color
- `--ax-text-secondary`: Secondary text color
- `--ax-text-tertiary`: Tertiary text color
- `--ax-border-color`: Border colors

## Material Components Used

- `MatFormFieldModule`: Form field containers
- `MatInputModule`: Text input fields
- `MatButtonModule`: Action buttons
- `MatIconModule`: Icons for buttons and badges
- `MatCardModule`: Card wrapper
- `MatProgressSpinnerModule`: Loading indicator
- `MatSelectModule`: Dropdown selection
- `MatSnackBarModule`: Toast notifications

## Dependencies

- `@angular/core`: Core Angular framework
- `@angular/common`: Common Angular utilities
- `@angular/forms`: Reactive forms
- `@angular/material`: Material Design components
- `@aegisx/ui`: Custom UI components (AxCardComponent)
- `DepartmentSelectorComponent`: Department selection component
- `UserService`: User data management service

## Example Integration

```typescript
import { Component, inject, signal } from '@angular/core';
import { ProfileInfoComponent, UserService, User } from '@app/core/users';

@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile-container">
      <ax-profile-info [user]="currentUser()" (updateProfile)="handleProfileUpdate($event)" />
    </div>
  `,
  imports: [ProfileInfoComponent],
})
export class UserProfileComponent {
  private userService = inject(UserService);
  currentUser = signal<User | null>(null);

  constructor() {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  handleProfileUpdate(updates: Partial<User>): void {
    const user = this.currentUser();
    if (!user) return;

    this.userService.updateUser(user.id, updates).subscribe({
      next: (updatedUser) => {
        this.currentUser.set(updatedUser);
      },
      error: (error) => {
        console.error('Profile update failed:', error);
      },
    });
  }
}
```

## Accessibility Features

- Proper semantic HTML structure
- ARIA labels on form fields
- Keyboard navigation support
- Color-independent status indicators (icons + text)
- Sufficient color contrast (WCAG AA)
- Focus management in edit mode
- Error messages linked to form fields

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Email cannot be edited as it's the user's unique identifier
- Department selection is optional
- Changes are emitted but not persisted by the component (parent handles API calls)
- Confirmation dialog shown if canceling with unsaved changes
- All timestamps are formatted using Angular's date pipe with 'mediumDate' format
