# Profile Avatar Component - Implementation Guide

## Quick Start

### Basic Usage

```typescript
import { ProfileAvatarComponent } from '@app/core/users';
import { Component, signal } from '@angular/core';
import { User } from '@app/core/users';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ProfileAvatarComponent],
  template: ` <ax-profile-avatar [user]="userProfile()" (uploadAvatar)="onUpload($event)" (deleteAvatar)="onDelete()"></ax-profile-avatar> `,
})
export class ProfilePageComponent {
  userProfile = signal<User>({
    id: '123',
    email: 'john@example.com',
    username: 'johnsmith',
    firstName: 'John',
    lastName: 'Smith',
    avatar: null,
    // ... other required User fields
  });

  onUpload(file: File): void {
    console.log('File uploaded:', file);
    // Handle avatar upload response
  }

  onDelete(): void {
    console.log('Avatar deleted');
    // Handle avatar deletion
  }
}
```

## Component API

### Inputs

```typescript
// Required input - the user object
[user] = 'userProfile: User';
```

**User Interface:**

```typescript
interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string; // URL to avatar image
  // ... other fields
}
```

### Outputs

```typescript
// Emitted when avatar is successfully uploaded
uploadAvatar = 'onUpload($event: File)'(
  // Emitted when avatar is successfully deleted
  deleteAvatar,
) = 'onDelete()';
```

## Features

### Avatar Display

- **Size:** 150x150px (responsive on mobile)
- **Shape:** Perfect circle with border
- **Placeholder:** User initials with gradient background
- **Image Format:** Supports JPG, PNG, WebP

### User Initials

- Automatically generated from firstName and lastName
- Example: "John Doe" → "JD"
- Displayed in gradient background (primary to tertiary)
- Large, readable font

### Upload Functionality

- Click camera icon to upload
- File validation:
  - Max 5MB file size
  - Image formats only (jpg, png, webp)
- Real-time progress indication
- Error messages with auto-dismiss

### Delete Functionality

- Delete button appears only when avatar exists
- Confirmation dialog before deletion
- Loading state during deletion
- Success/error feedback

### Error Handling

- Clear error messages
- Auto-dismiss after 5 seconds
- Snackbar notifications
- No data loss on error

## Component Signals

### State Signals

```typescript
uploading: Signal<boolean>; // Is upload in progress?
uploadProgress: Signal<number>; // 0-100 progress percentage
errorMessage: Signal<string | null>; // Current error message
```

### Computed Signals

```typescript
userInitials: Signal<string>; // E.g., "JD"
userFullName: Signal<string>; // E.g., "John Doe"
hasAvatar: Signal<boolean>; // Does user have avatar?
```

## Styling & Customization

### CSS Classes

- `.profile-avatar-container`: Main wrapper
- `.avatar-display`: Avatar circle
- `.avatar-overlay`: Hover overlay
- `.avatar-placeholder`: Initials background
- `.progress-overlay`: Loading indicator
- `.error-message`: Error display
- `.upload-instructions`: Info section

### Responsive Breakpoints

- **Desktop:** 150x150px avatar
- **Tablet (≤600px):** 120x120px avatar
- **Mobile (≤400px):** 100x100px avatar

### Theme Integration

All colors use Material Design 3 tokens:

- `--mat-sys-primary`: Primary action color
- `--mat-sys-error`: Error states
- `--mat-sys-surface-container`: Backgrounds

## Integration with UserService

The component uses two UserService methods:

### Upload Avatar

```typescript
uploadAvatar(formData: FormData, progressCallback?: (progress: number) => void)
  : Observable<ApiResponse<AvatarUploadResponse>>
```

### Delete Avatar

```typescript
deleteAvatar(): Observable<ApiResponse<{ message: string }>>
```

## Accessibility Features

- **ARIA Labels:** All interactive elements have aria-label
- **Semantic HTML:** Proper button elements, roles
- **Keyboard Navigation:** Full keyboard support
- **Screen Readers:** Descriptive labels and alt text
- **Color Contrast:** High contrast for error states
- **Touch Targets:** 48px+ buttons on mobile

## Error Scenarios

### File Validation Errors

```
"Invalid file type. Please upload JPG, PNG, or WebP image."
"File size must not exceed 5MB."
```

### Upload Errors

- API connection failures
- Authentication failures
- Server-side validation errors
- Network timeouts

All errors display with user-friendly messages.

## Events Flow

### Upload Flow

1. User clicks camera icon or selects file
2. Component validates file (type, size)
3. Shows progress overlay with percentage
4. Emits `uploadAvatar` event with File object
5. Shows success snackbar
6. Parent component handles API call

### Delete Flow

1. User clicks delete button
2. Confirmation dialog appears
3. User confirms deletion
4. Shows loading indicator
5. Emits `deleteAvatar` event
6. Shows success snackbar
7. Parent component handles API call

## TypeScript Types

```typescript
// User interface (already defined in UserService)
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  // ... other fields
}

// API Response from upload
export interface AvatarUploadResponse {
  avatar: string;
  thumbnails: {
    small: string;
    medium: string;
    large: string;
  };
}
```

## Common Patterns

### With Loading State

```typescript
@Component({
  template: `
    @if (loading()) {
      <mat-spinner></mat-spinner>
    } @else {
      <ax-profile-avatar [user]="userProfile()" (uploadAvatar)="onUpload($event)" (deleteAvatar)="onDelete()"></ax-profile-avatar>
    }
  `,
})
export class ProfileComponent {
  loading = signal(true);
  userProfile = signal<User | null>(null);

  ngOnInit() {
    this.loadProfile();
  }

  async loadProfile() {
    this.userProfile.set(await this.userService.getProfile().toPromise());
    this.loading.set(false);
  }
}
```

### In a Form

```typescript
<form [formGroup]="profileForm">
  <ax-profile-avatar
    [user]="userProfile()"
    (uploadAvatar)="onUpload($event)"
    (deleteAvatar)="onDelete()"
  ></ax-profile-avatar>

  <!-- Other form fields -->
  <button type="submit">Save Profile</button>
</form>
```

### With Parent State Updates

```typescript
onUpload(file: File): void {
  // Update parent state after upload
  this.userProfile.update(user => ({
    ...user,
    avatar: URL.createObjectURL(file)  // Show preview immediately
  }));
}

onDelete(): void {
  // Clear avatar from parent state
  this.userProfile.update(user => ({
    ...user,
    avatar: null
  }));
}
```

## Performance Considerations

- **OnPush Change Detection:** Minimal re-renders
- **Signals API:** Efficient reactivity
- **File Upload:** Streaming with progress tracking
- **Image Size:** Validated to max 5MB
- **Memory:** Cleans up file input after each selection

## Browser Support

- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

Requires:

- Angular 19+
- Angular Material 18+
- TypeScript 5.2+

## Troubleshooting

### Component Not Showing

1. Ensure `ProfileAvatarComponent` is imported
2. Check that `[user]` input is provided
3. Verify user object has required fields

### Upload Not Working

1. Check network connectivity
2. Verify UserService is properly injected
3. Check console for error messages
4. Ensure API endpoint is correct

### Styling Issues

1. Verify Material theme is loaded
2. Check CSS custom properties are defined
3. Check for CSS conflicts with other styles
4. Test in isolated environment

### Mobile Issues

1. Check responsive breakpoints (600px, 400px)
2. Verify touch targets are 48px+
3. Test with actual mobile browser
4. Check viewport meta tag

## Advanced Usage

### Custom Error Handling

```typescript
@Component({
  template: `
    <ax-profile-avatar [user]="userProfile()" (uploadAvatar)="handleUpload($event)" (deleteAvatar)="handleDelete()"></ax-profile-avatar>

    @if (customError()) {
      <div class="error-banner">
        {{ customError() }}
      </div>
    }
  `,
})
export class AdvancedProfileComponent {
  customError = signal<string | null>(null);

  handleUpload(file: File): void {
    try {
      // Custom validation
      if (file.size > 2 * 1024 * 1024) {
        this.customError.set('File must be under 2MB');
        return;
      }
      // Proceed with upload
    } catch (e) {
      this.customError.set('Upload failed');
    }
  }

  handleDelete(): void {
    // Custom confirmation
    if (!confirm('This action cannot be undone')) {
      return;
    }
    // Proceed with deletion
  }
}
```

## API Integration Example

```typescript
// In parent component
async onAvatarUpload(file: File): Promise<void> {
  try {
    const response = await this.userService
      .uploadAvatar(new FormData().append('avatar', file))
      .toPromise();

    if (response?.success) {
      // Update user profile with new avatar URL
      this.userProfile.update(user => ({
        ...user,
        avatar: response.data.avatar
      }));

      this.snackBar.open('Avatar updated', 'Close', { duration: 3000 });
    }
  } catch (error) {
    this.snackBar.open('Failed to upload avatar', 'Close', { duration: 5000 });
  }
}

async onAvatarDelete(): Promise<void> {
  try {
    const response = await this.userService
      .deleteAvatar()
      .toPromise();

    if (response?.success) {
      // Clear avatar from user profile
      this.userProfile.update(user => ({
        ...user,
        avatar: null
      }));

      this.snackBar.open('Avatar deleted', 'Close', { duration: 3000 });
    }
  } catch (error) {
    this.snackBar.open('Failed to delete avatar', 'Close', { duration: 5000 });
  }
}
```

---

**Last Updated:** December 16, 2024
**Component Version:** 1.0.0
