# Profile Avatar Component

A standalone Angular component for managing user profile avatars with upload, preview, and delete functionality.

## Features

- Circular avatar display (150x150px)
- User initials placeholder when no avatar exists
- File upload with validation
- File type validation (JPG, PNG, WebP only)
- File size validation (max 5MB)
- Upload progress indication
- Delete avatar with confirmation
- Hover overlay with action buttons
- Responsive design (mobile-optimized)
- Material Design integration
- Accessibility features (ARIA labels, semantic HTML)
- Real-time error feedback with auto-dismiss

## Usage

```typescript
import { ProfileAvatarComponent } from '@app/core/users';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [ProfileAvatarComponent],
  template: `
    <ax-profile-avatar
      [user]="currentUser()"
      (uploadAvatar)="onAvatarUpload($event)"
      (deleteAvatar)="onAvatarDelete()"
    ></ax-profile-avatar>
  `
})
export class MyComponent {
  currentUser = signal<User>({...});

  onAvatarUpload(file: File): void {
    // Handle avatar upload
    console.log('Avatar uploaded:', file.name);
  }

  onAvatarDelete(): void {
    // Handle avatar deletion
    console.log('Avatar deleted');
  }
}
```

## Inputs

### `user` (required)

- Type: `User`
- The user object containing avatar, firstName, lastName, email

## Outputs

### `uploadAvatar`

- Type: `EventEmitter<File>`
- Emitted when a file is successfully uploaded
- Passes the uploaded File object

### `deleteAvatar`

- Type: `EventEmitter<void>`
- Emitted when avatar is successfully deleted

## Component Architecture

### Signals

- `uploading`: Indicates upload in progress
- `uploadProgress`: Current upload progress percentage (0-100)
- `errorMessage`: Current error message (auto-clears after 5 seconds)

### Computed Signals

- `userInitials`: Computed from firstName and lastName (e.g., "JD" for John Doe)
- `userFullName`: Full name concatenation
- `hasAvatar`: Whether user has an avatar

### Methods

- `triggerFileInput()`: Open file picker
- `onFileSelected()`: Handle file selection
- `deleteAvatarClick()`: Show confirmation and delete

## Styling

The component uses Material Design 3 theming with CSS custom properties:

- Primary colors from Material theme
- Responsive breakpoints for mobile devices
- Smooth transitions and animations
- Dark mode support through Material theme variables

### CSS Classes

- `.profile-avatar-container`: Main container
- `.avatar-display`: Avatar circular display
- `.avatar-overlay`: Hover overlay with actions
- `.avatar-placeholder`: Initials placeholder
- `.progress-overlay`: Upload progress indicator

## File Validation

- **Allowed types**: image/jpeg, image/png, image/webp
- **Maximum size**: 5MB
- **Error messages**: User-friendly feedback on validation failures

## Accessibility

- ARIA labels for interactive elements
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast for error messages

## Integration with UserService

Uses `UserService` methods:

- `uploadAvatar(formData, progressCallback)`: Upload avatar with progress tracking
- `deleteAvatar()`: Delete user avatar

## Responsive Design

- Desktop: 150x150px avatar with full UI
- Tablet (≤600px): 120x120px avatar, reduced spacing
- Mobile (≤400px): 100x100px avatar, compact layout

## Error Handling

- File validation errors with clear messages
- Upload failures with API error details
- Auto-dismissing error messages (5 seconds)
- Snackbar notifications for user feedback

## Example Integration

```typescript
// In a profile page component
<div class="profile-section">
  <ax-profile-avatar
    [user]="userProfile()"
    (uploadAvatar)="handleAvatarUpload($event)"
    (deleteAvatar)="handleAvatarDelete()"
  ></ax-profile-avatar>

  <div class="profile-info">
    <h1>{{ userProfile().firstName }} {{ userProfile().lastName }}</h1>
    <p>{{ userProfile().email }}</p>
  </div>
</div>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Component uses Angular 19+ Signals API
- Requires Angular Material v18+
- OnPush change detection for optimal performance
- All Material modules are self-contained
